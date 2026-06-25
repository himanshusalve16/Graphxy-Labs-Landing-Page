const { db } = require('../../../db/clampbox/db');
const { auditLogs, gatewayKeys, policies, extensionSessions } = require('../../../db/clampbox/schema/schema');
const { eq, and, desc, sql, gte } = require('drizzle-orm');
const { resolveOrganizationId } = require('../utils/orgResolver');

exports.getDashboard = async (req, res) => {
  try {
    const organizationId = await resolveOrganizationId(req.query.organizationId);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Queries in parallel
    const [
      [activeKeysRow],
      [activePoliciesRow],
      [totalRequestsTodayRow],
      [blockedTodayRow],
      [redactedTodayRow],
      [highRiskTodayRow],
      recentLogs,
      activeSessionsRow,
      lastKeyRow,
      [activePolicyRow],
      allLogsToday
    ] = await Promise.all([
      db.select({ count: sql`count(*)::int` })
        .from(gatewayKeys)
        .where(and(eq(gatewayKeys.organizationId, organizationId), eq(gatewayKeys.status, 'active'))),

      db.select({ count: sql`count(*)::int` })
        .from(policies)
        .where(and(eq(policies.organizationId, organizationId), eq(policies.enabled, true))),

      db.select({ count: sql`count(*)::int` })
        .from(auditLogs)
        .where(and(
          eq(auditLogs.organizationId, organizationId),
          gte(auditLogs.createdAt, todayStart)
        )),

      db.select({ count: sql`count(*)::int` })
        .from(auditLogs)
        .where(and(
          eq(auditLogs.organizationId, organizationId),
          eq(auditLogs.action, 'block'),
          gte(auditLogs.createdAt, todayStart)
        )),

      db.select({ count: sql`count(*)::int` })
        .from(auditLogs)
        .where(and(
          eq(auditLogs.organizationId, organizationId),
          eq(auditLogs.action, 'redact'),
          gte(auditLogs.createdAt, todayStart)
        )),

      db.select({ count: sql`count(*)::int` })
        .from(auditLogs)
        .where(and(
          eq(auditLogs.organizationId, organizationId),
          sql`severity IN ('high', 'critical')`,
          gte(auditLogs.createdAt, todayStart)
        )),

      db.select()
        .from(auditLogs)
        .where(eq(auditLogs.organizationId, organizationId))
        .orderBy(desc(auditLogs.createdAt))
        .limit(5),

      db.select({ count: sql`count(*)::int` })
        .from(extensionSessions)
        .where(and(eq(extensionSessions.organizationId, organizationId), eq(extensionSessions.status, 'active'))),

      db.select({ name: gatewayKeys.name })
        .from(gatewayKeys)
        .where(and(eq(gatewayKeys.organizationId, organizationId), eq(gatewayKeys.status, 'active')))
        .orderBy(desc(gatewayKeys.lastUsedAt), desc(gatewayKeys.createdAt))
        .limit(1),

      db.select({ name: policies.name })
        .from(policies)
        .where(and(eq(policies.organizationId, organizationId), eq(policies.enabled, true)))
        .orderBy(policies.priority, desc(policies.createdAt))
        .limit(1),

      db.select({
        labels: auditLogs.labels,
        provider: auditLogs.provider,
        riskScore: auditLogs.riskScore,
        action: auditLogs.action
      })
      .from(auditLogs)
      .where(and(
        eq(auditLogs.organizationId, organizationId),
        gte(auditLogs.createdAt, todayStart)
      ))
    ]);

    // Aggregate classifications & providers from logs today
    const labelCounts = {};
    const providerCounts = {};
    let secretsDetectedCount = 0;

    allLogsToday.forEach(log => {
      const p = log.provider || 'unknown';
      providerCounts[p] = (providerCounts[p] || 0) + 1;

      if (Array.isArray(log.labels)) {
        secretsDetectedCount += log.labels.length;
        log.labels.forEach(lbl => {
          labelCounts[lbl] = (labelCounts[lbl] || 0) + 1;
        });
      }
    });

    const topSecretTypes = Object.entries(labelCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    const providerUsage = Object.entries(providerCounts)
      .map(([provider, count]) => ({ provider, count }))
      .sort((a, b) => b.count - a.count);

    const totalRequests = totalRequestsTodayRow?.count || 0;
    const blocked = blockedTodayRow?.count || 0;
    const redacted = redactedTodayRow?.count || 0;
    const highRisk = highRiskTodayRow?.count || 0;
    const blockRate = totalRequests > 0 ? ((blocked / totalRequests) * 100).toFixed(1) : '0.0';
    const redactRate = totalRequests > 0 ? ((redacted / totalRequests) * 100).toFixed(1) : '0.0';

    // Last inspection metadata
    const lastInspection = recentLogs.length > 0 ? {
      createdAt: recentLogs[0].createdAt,
      action: recentLogs[0].action,
      riskScore: recentLogs[0].riskScore,
      provider: recentLogs[0].provider
    } : null;

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          activeKeys: activeKeysRow?.count || 0,
          activePolicies: activePoliciesRow?.count || 0,
          requestsToday: totalRequests,
          blockedToday: blocked,
          redactedToday: redacted,
          highRiskToday: highRisk,
          blockRate,
          redactRate,
          secretsDetected: secretsDetectedCount,
          activePolicyName: activePolicyRow?.name || 'None',
          activeGatewayName: lastKeyRow[0]?.name || 'None',
          connectedBrowsers: activeSessionsRow[0]?.count || 0,
          lastInspection,
          dbStatus: 'connected',
          backendStatus: 'online'
        },
        topSecretTypes,
        providerUsage,
        recentActivity: recentLogs
      }
    });
  } catch (error) {
    console.error('[Dashboard Controller] DB error:', error.message);
    res.status(503).json({ success: false, error: 'Database unavailable. Please try again.' });
  }
};

const crypto = require('crypto');
const { db } = require('../../../db/clampbox/db');
const { auditLogs, promptEvents } = require('../../../db/clampbox/schema/schema');

async function writeAuditLog(data) {
  const {
    organizationId,
    userId = null,
    gatewayKeyId = null,
    extensionSessionId = null,
    source,
    provider = null,
    action,
    status,
    riskScore = 0,
    severity = 'low',
    labels = [],
    policyId = null,
    promptText = null,
    metadata = {}
  } = data;

  try {
    const requestHash = promptText 
      ? crypto.createHash('sha256').update(promptText).digest('hex')
      : null;

    const auditData = {
      organizationId,
      userId,
      gatewayKeyId,
      extensionSessionId,
      eventType: `policy_${action}`,
      source,
      provider,
      action,
      status,
      riskScore,
      severity,
      labels,
      policyId,
      requestHash,
      metadata: JSON.stringify(metadata),
      createdAt: new Date()
    };

    const [record] = await db
      .insert(auditLogs)
      .values(auditData)
      .returning({ id: auditLogs.id });

    const logId = record.id;

    // Write prompt event mapping
    if (promptText) {
      await db
        .insert(promptEvents)
        .values({
          organizationId,
          auditLogId: logId,
          source,
          provider,
          promptHash: requestHash,
          promptLength: promptText.length,
          detectionCount: labels.length,
          detections: labels,
          classifications: labels,
          redactionCount: 0,
          decision: action,
          createdAt: new Date()
        });
    }

    return {
      success: true,
      auditId: logId,
      requestHash: requestHash
    };

  } catch (error) {
    console.error('[Audit Service] Error writing audit log:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { writeAuditLog };

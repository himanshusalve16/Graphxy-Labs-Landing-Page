const { db } = require('../../../db/clampbox/db');
const { auditLogs } = require('../../../db/clampbox/schema/schema');
const { eq, desc, sql } = require('drizzle-orm');
const { resolveOrganizationId } = require('../utils/orgResolver');

exports.getLogs = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);
  const offset = parseInt(req.query.offset) || 0;

  try {
    const organizationId = await resolveOrganizationId(req.query.organizationId);
    const list = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.organizationId, organizationId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql`count(*)::int` })
      .from(auditLogs)
      .where(eq(auditLogs.organizationId, organizationId));

    res.status(200).json({ success: true, data: list, total, limit, offset });
  } catch (error) {
    console.error('[Audit Controller] DB error:', error.message);
    res.status(503).json({ success: false, error: 'Database unavailable. Please try again.' });
  }
};

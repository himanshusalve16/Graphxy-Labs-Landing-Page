const { db } = require('../../../db/clampbox/db');
const { organizations } = require('../../../db/clampbox/schema/schema');
const { eq } = require('drizzle-orm');
const { resolveOrganizationId } = require('../utils/orgResolver');

const DEFAULT_SETTINGS = {
  defaultAction: 'allow',
  extensionSyncInterval: 300,
  auditRetentionDays: 90,
  alertThreshold: 'high'
};

exports.getSettings = async (req, res) => {
  try {
    const organizationId = await resolveOrganizationId(req.query.organizationId);
    const rows = await db
      .select({ settingsJson: organizations.settingsJson, name: organizations.name, plan: organizations.plan })
      .from(organizations)
      .where(eq(organizations.id, organizationId));

    if (rows.length === 0) {
      return res.status(200).json({ success: true, data: DEFAULT_SETTINGS });
    }

    const settings = rows[0].settingsJson || DEFAULT_SETTINGS;
    res.status(200).json({ success: true, data: settings, org: { name: rows[0].name, plan: rows[0].plan } });
  } catch (error) {
    console.error('[Settings Controller] DB error:', error.message);
    res.status(200).json({ success: true, data: DEFAULT_SETTINGS, _fallback: true });
  }
};

exports.saveSettings = async (req, res) => {
  const { settings } = req.body;
  if (!settings) return res.status(400).json({ error: 'settings object is required.' });
  try {
    const organizationId = await resolveOrganizationId(req.body.organizationId || req.query.organizationId);
    await db
      .update(organizations)
      .set({ settingsJson: settings, updatedAt: new Date() })
      .where(eq(organizations.id, organizationId));

    res.status(200).json({ success: true, message: 'Settings saved successfully.' });
  } catch (error) {
    console.error('[Settings Controller] Save error:', error.message);
    res.status(503).json({ success: false, error: 'Failed to save settings.' });
  }
};

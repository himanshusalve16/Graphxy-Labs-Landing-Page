const { db } = require('../../../db/clampbox/db');
const { policies } = require('../../../db/clampbox/schema/schema');
const { eq, and, desc } = require('drizzle-orm');
const { resolveOrganizationId } = require('../utils/orgResolver');
const gatewayKeyService = require('../services/gatewayKey.service');

exports.getPolicies = async (req, res) => {
  try {
    let organizationId;
    const key = req.headers['x-clampbox-key'] || req.headers['X-Clampbox-Key'];
    if (key) {
      const keyRecord = await gatewayKeyService.validateApiKey(key);
      if (keyRecord) {
        organizationId = keyRecord.organizationId;
      }
    }
    if (!organizationId) {
      organizationId = await resolveOrganizationId(req.query.organizationId || req.body.organizationId);
    }

    let list = await db
      .select()
      .from(policies)
      .where(eq(policies.organizationId, organizationId))
      .orderBy(policies.priority, desc(policies.createdAt));

    // Auto-seed default presets if list is empty
    if (list.length === 0) {
      const defaults = [
        {
          organizationId,
          name: 'Strict Security Policy',
          description: 'Blocks all sensitive data immediately. Intended for enterprise environments.',
          action: 'block',
          priority: 10,
          conditions: {
            classifications: ['cryptographic_secret', 'cloud_credential', 'personal_data', 'payment_data', 'infrastructure_secret'],
            minimumRiskScore: 30
          },
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          organizationId,
          name: 'Standard Security Policy',
          description: 'Redacts sensitive information, warns on medium-risk content. Recommended default.',
          action: 'redact',
          priority: 20,
          conditions: {
            classifications: ['cryptographic_secret', 'cloud_credential', 'personal_data', 'payment_data', 'infrastructure_secret'],
            minimumRiskScore: 50
          },
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          organizationId,
          name: 'Relaxed Security Policy',
          description: 'Warns only for high-risk content, allows most prompts. Intended for personal experimentation.',
          action: 'warn',
          priority: 30,
          conditions: {
            classifications: ['cryptographic_secret', 'cloud_credential', 'personal_data'],
            minimumRiskScore: 70
          },
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await db.insert(policies).values(defaults);

      // Refetch
      list = await db
        .select()
        .from(policies)
        .where(eq(policies.organizationId, organizationId))
        .orderBy(policies.priority, desc(policies.createdAt));
    }

    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error('[Policies Controller] DB error:', error.message);
    res.status(503).json({ success: false, error: 'Database unavailable.' });
  }
};

exports.createPolicy = async (req, res) => {
  const { name, description, action, priority = 100, conditions = {}, enabled = true } = req.body;
  if (!name || !action) return res.status(400).json({ error: 'name and action are required.' });
  try {
    const organizationId = await resolveOrganizationId(req.body.organizationId || req.query.organizationId);
    const [created] = await db
      .insert(policies)
      .values({ organizationId, name, description, action, priority, conditions, enabled, createdAt: new Date(), updatedAt: new Date() })
      .returning();
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('[Policies Controller] Create error:', error.message);
    res.status(503).json({ success: false, error: 'Failed to create policy.' });
  }
};

exports.deletePolicy = async (req, res) => {
  const { id } = req.params;
  try {
    const organizationId = await resolveOrganizationId(req.query.organizationId);
    await db.delete(policies).where(and(eq(policies.id, id), eq(policies.organizationId, organizationId)));
    res.status(200).json({ success: true, message: 'Policy deleted.' });
  } catch (error) {
    console.error('[Policies Controller] Delete error:', error.message);
    res.status(503).json({ success: false, error: 'Failed to delete policy.' });
  }
};

const { db } = require('../../../db/clampbox/db');
const { gatewayKeys } = require('../../../db/clampbox/schema/schema');
const { eq, and, desc } = require('drizzle-orm');
const gatewayKeyService = require('../services/gatewayKey.service');
const { resolveOrganizationId } = require('../utils/orgResolver');

exports.getKeys = async (req, res) => {
  try {
    const organizationId = await resolveOrganizationId(req.query.organizationId);
    const list = await db
      .select()
      .from(gatewayKeys)
      .where(eq(gatewayKeys.organizationId, organizationId))
      .orderBy(desc(gatewayKeys.createdAt));
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error('[Keys Controller] DB error:', error.message);
    res.status(503).json({ success: false, error: 'Database unavailable.' });
  }
};

exports.createKey = async (req, res) => {
  const { name, environment = 'production' } = req.body;
  if (!name) return res.status(400).json({ error: 'Key label name is required.' });
  try {
    const organizationId = await resolveOrganizationId(req.body.organizationId || req.query.organizationId);
    const { rawKey, keyHash, fingerprint } = gatewayKeyService.generateKey(environment);
    await db.insert(gatewayKeys).values({
      organizationId,
      name,
      keyHash,
      keyFingerprint: fingerprint,
      environment,
      status: 'active',
      createdAt: new Date()
    });
    res.status(200).json({
      success: true,
      message: 'Gateway API key created successfully. Store this value safely — it will not be shown again.',
      key: rawKey,
      fingerprint
    });
  } catch (error) {
    console.error('[Keys Controller] Create error:', error.message);
    res.status(503).json({ success: false, error: 'Failed to create gateway key.' });
  }
};

exports.revokeKey = async (req, res) => {
  const { id } = req.params;
  try {
    const organizationId = await resolveOrganizationId(req.query.organizationId);
    await db
      .update(gatewayKeys)
      .set({ status: 'revoked', revokedAt: new Date() })
      .where(and(eq(gatewayKeys.id, id), eq(gatewayKeys.organizationId, organizationId)));
    res.status(200).json({ success: true, message: 'Key revoked successfully.' });
  } catch (error) {
    console.error('[Keys Controller] Revoke error:', error.message);
    res.status(503).json({ success: false, error: 'Failed to revoke key.' });
  }
};

exports.verifyKey = async (req, res) => {
  const { key } = req.body;
  if (!key) {
    return res.status(400).json({ success: false, error: 'Gateway key is required.' });
  }

  try {
    const keyRecord = await gatewayKeyService.validateApiKey(key);
    if (!keyRecord) {
      return res.status(401).json({ success: false, error: 'Invalid or revoked Gateway API key.' });
    }

    const { organizations } = require('../../../db/clampbox/schema/schema');
    const orgs = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, keyRecord.organizationId));
    
    const org = orgs[0] || { name: 'Default Org', slug: 'default' };

    res.status(200).json({
      success: true,
      organization: {
        id: keyRecord.organizationId,
        name: org.name,
        slug: org.slug
      },
      key: {
        id: keyRecord.id,
        name: keyRecord.name,
        environment: keyRecord.environment,
        status: keyRecord.status
      }
    });
  } catch (error) {
    console.error('[Keys Controller] Verify error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to verify Gateway Key.' });
  }
};


const { db } = require('../../../db/clampbox/db');
const { apiKeys } = require('../../../db/clampbox/schema/schema');
const { eq, and, desc } = require('drizzle-orm');
const crypto = require('crypto');
const { resolveOrganizationId } = require('../utils/orgResolver');

const ENCRYPTION_KEY = process.env.CLAMPBOX_ENCRYPTION_KEY || 'demo_encryption_secret_key_32_byt';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

exports.getVault = async (req, res) => {
  try {
    const organizationId = await resolveOrganizationId(req.query.organizationId);
    const list = await db
      .select({
        id: apiKeys.id,
        provider: apiKeys.provider,
        label: apiKeys.label,
        environment: apiKeys.environment,
        status: apiKeys.status,
        keyFingerprint: apiKeys.keyFingerprint,
        lastUsedAt: apiKeys.lastUsedAt,
        rotationDueAt: apiKeys.rotationDueAt,
        createdAt: apiKeys.createdAt,
        revokedAt: apiKeys.revokedAt
      })
      .from(apiKeys)
      .where(eq(apiKeys.organizationId, organizationId))
      .orderBy(desc(apiKeys.createdAt));
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error('[Vault Controller] DB error:', error.message);
    res.status(503).json({ success: false, error: 'Database unavailable.' });
  }
};

exports.createVaultEntry = async (req, res) => {
  const { provider, label, rawKey, environment = 'production' } = req.body;
  if (!provider || !label || !rawKey) {
    return res.status(400).json({ error: 'provider, label, and rawKey are required.' });
  }
  try {
    const organizationId = await resolveOrganizationId(req.body.organizationId || req.query.organizationId);
    const encryptedKey = encrypt(rawKey);
    const fingerprint = `${rawKey.slice(0, 6)}...${rawKey.slice(-4)}`;
    const rotationDueAt = new Date();
    rotationDueAt.setDate(rotationDueAt.getDate() + 90);

    const [created] = await db.insert(apiKeys).values({
      organizationId,
      provider,
      label,
      encryptedKey,
      keyFingerprint: fingerprint,
      environment,
      status: 'active',
      rotationDueAt,
      createdAt: new Date()
    }).returning({ id: apiKeys.id, label: apiKeys.label, provider: apiKeys.provider });

    res.status(201).json({ success: true, data: created, message: 'Credential stored securely in vault.' });
  } catch (error) {
    console.error('[Vault Controller] Create error:', error.message);
    res.status(503).json({ success: false, error: 'Failed to store credential.' });
  }
};

exports.revokeVaultEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const organizationId = await resolveOrganizationId(req.query.organizationId);
    await db
      .update(apiKeys)
      .set({ status: 'revoked', revokedAt: new Date() })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.organizationId, organizationId)));
    res.status(200).json({ success: true, message: 'Credential revoked.' });
  } catch (error) {
    console.error('[Vault Controller] Revoke error:', error.message);
    res.status(503).json({ success: false, error: 'Failed to revoke credential.' });
  }
};

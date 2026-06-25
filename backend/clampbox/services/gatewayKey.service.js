const crypto = require('crypto');
const { db } = require('../../../db/clampbox/db');
const { gatewayKeys } = require('../../../db/clampbox/schema/schema');
const { eq } = require('drizzle-orm');

function generateKey(env = 'production') {
  const prefix = env === 'production' ? 'cb_live' : env === 'staging' ? 'cb_stag' : 'cb_dev';
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const rawKey = `${prefix}_${randomBytes}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const fingerprint = `${rawKey.slice(0, 7)}...${rawKey.slice(-4)}`;
  return { rawKey, keyHash, fingerprint };
}

async function validateApiKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') return null;
  try {
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const records = await db
      .select()
      .from(gatewayKeys)
      .where(eq(gatewayKeys.keyHash, keyHash));
    if (records.length === 0) return null;
    const keyRecord = records[0];
    if (keyRecord.status !== 'active') return null;
    // Update last used timestamp asynchronously
    db.update(gatewayKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(gatewayKeys.id, keyRecord.id))
      .catch(() => {});
    return keyRecord;
  } catch (error) {
    console.error('[Gateway Key Service] Error validating key:', error.message);
    return null;
  }
}

module.exports = { generateKey, validateApiKey };

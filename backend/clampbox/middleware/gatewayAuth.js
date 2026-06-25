const { validateApiKey } = require('../services/gatewayKey.service');

async function gatewayAuth(req, res, next) {
  const key = req.headers['x-clampbox-key'] || req.headers['X-Clampbox-Key'] || (req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', ''));

  if (!key) {
    return res.status(401).json({
      success: false,
      error: 'Missing Gateway API key. Please set the X-Clampbox-Key header.'
    });
  }

  try {
    const keyRecord = await validateApiKey(key);
    if (!keyRecord) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or revoked Gateway API key.'
      });
    }

    req.organizationId = keyRecord.organizationId;
    req.gatewayKeyId = keyRecord.id;
    req.gatewayKeyName = keyRecord.name;
    req.gatewayKeyEnv = keyRecord.environment;

    next();
  } catch (error) {
    console.error('[Gateway Auth Middleware] Verification error:', error.message);
    res.status(500).json({ success: false, error: 'Internal auth service error.' });
  }
}

module.exports = gatewayAuth;

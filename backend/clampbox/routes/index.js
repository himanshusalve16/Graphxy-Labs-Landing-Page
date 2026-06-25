const express = require('express');
const router = express.Router();

const healthController = require('../controllers/health.controller');
const waitlistController = require('../controllers/waitlist.controller');
const policiesController = require('../controllers/policies.controller');
const keysController = require('../controllers/keys.controller');
const auditController = require('../controllers/audit.controller');
const riskController = require('../controllers/risk.controller');
const dashboardController = require('../controllers/dashboard.controller');
const vaultController = require('../controllers/vault.controller');
const settingsController = require('../controllers/settings.controller');
const onboardingController = require('../controllers/onboarding.controller');
const extensionController = require('../controllers/extension.controller');
const gatewayAuth = require('../middleware/gatewayAuth');

// Health
router.get('/health', healthController.checkHealth);

// Dashboard
router.get('/dashboard', dashboardController.getDashboard);

// Onboarding
router.post('/onboarding', onboardingController.setupOnboarding);

// Waitlist
router.post('/waitlist', waitlistController.addToWaitlist);

// Policies
router.get('/policies', policiesController.getPolicies);
router.post('/policies', policiesController.createPolicy);
router.delete('/policies/:id', policiesController.deletePolicy);

// Gateway Keys
router.get('/gateway-keys', keysController.getKeys);
router.post('/gateway-keys', keysController.createKey);
router.delete('/gateway-keys/:id', keysController.revokeKey);
router.post('/gateway-keys/verify', keysController.verifyKey);

// Extension
router.post('/extension/ping', gatewayAuth, extensionController.ping);

// Audit Logs
router.get('/audit-logs', auditController.getLogs);

// Risk / Inspection
router.post('/risk/inspect', gatewayAuth, riskController.inspect);

// Vault (Provider Credentials)
router.get('/vault', vaultController.getVault);
router.post('/vault', vaultController.createVaultEntry);
router.delete('/vault/:id', vaultController.revokeVaultEntry);

// Settings
router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.saveSettings);

module.exports = router;


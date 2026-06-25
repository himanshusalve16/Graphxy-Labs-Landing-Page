const { db } = require('../../../db/clampbox/db');
const { gatewayKeys, policies, policyAssignments, organizations } = require('../../../db/clampbox/schema/schema');
const gatewayKeyService = require('../services/gatewayKey.service');
const { resolveOrganizationId } = require('../utils/orgResolver');
const { eq } = require('drizzle-orm');

exports.setupOnboarding = async (req, res) => {
  const { gatewayName, policyPreset } = req.body;

  if (!gatewayName || !policyPreset) {
    return res.status(400).json({
      success: false,
      error: 'gatewayName and policyPreset are required.'
    });
  }

  try {
    const organizationId = await resolveOrganizationId();

    // 1. Generate Gateway Key
    const { rawKey, keyHash, fingerprint } = gatewayKeyService.generateKey('production');
    const [insertedKey] = await db
      .insert(gatewayKeys)
      .values({
        organizationId,
        name: gatewayName,
        keyHash,
        keyFingerprint: fingerprint,
        environment: 'production',
        status: 'active',
        createdAt: new Date()
      })
      .returning();

    // 2. Define policy details based on preset
    let policyData = {};
    if (policyPreset === 'strict') {
      policyData = {
        name: 'Strict Security Policy',
        description: 'Blocks all sensitive data immediately. Intended for enterprise environments.',
        action: 'block',
        priority: 10,
        conditions: {
          classifications: ['cryptographic_secret', 'cloud_credential', 'personal_data', 'payment_data', 'infrastructure_secret'],
          minimumRiskScore: 30
        }
      };
    } else if (policyPreset === 'relaxed') {
      policyData = {
        name: 'Relaxed Security Policy',
        description: 'Warns only for high-risk content, allows most prompts. Intended for personal experimentation.',
        action: 'warn',
        priority: 30,
        conditions: {
          classifications: ['cryptographic_secret', 'cloud_credential', 'personal_data'],
          minimumRiskScore: 70
        }
      };
    } else {
      // Default: standard
      policyData = {
        name: 'Standard Security Policy',
        description: 'Redacts sensitive information, warns on medium-risk content. Recommended default.',
        action: 'redact',
        priority: 20,
        conditions: {
          classifications: ['cryptographic_secret', 'cloud_credential', 'personal_data', 'payment_data', 'infrastructure_secret'],
          minimumRiskScore: 50
        }
      };
    }

    // 3. Insert policy
    const [insertedPolicy] = await db
      .insert(policies)
      .values({
        organizationId,
        name: policyData.name,
        description: policyData.description,
        action: policyData.action,
        priority: policyData.priority,
        conditions: policyData.conditions,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    // 4. Create Policy Assignment to the Gateway Key
    await db
      .insert(policyAssignments)
      .values({
        organizationId,
        policyId: insertedPolicy.id,
        gatewayKeyId: insertedKey.id,
        enabled: true,
        createdAt: new Date()
      });

    // 5. Update Organization settings default action
    await db
      .update(organizations)
      .set({
        settingsJson: {
          defaultAction: policyPreset === 'strict' ? 'block' : 'allow',
          extensionSyncInterval: 300,
          auditRetentionDays: 90,
          alertThreshold: 'high'
        },
        updatedAt: new Date()
      })
      .where(eq(organizations.id, organizationId));

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully.',
      key: rawKey,
      fingerprint,
      policy: insertedPolicy
    });

  } catch (error) {
    console.error('[Onboarding Controller] Setup error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to complete onboarding setup.'
    });
  }
};

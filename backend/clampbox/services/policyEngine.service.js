const { db } = require('../../../db/clampbox/db');
const { policies } = require('../../../db/clampbox/schema/schema');
const { eq, and } = require('drizzle-orm');

async function evaluatePolicies(organizationId, context) {
  const { provider, source, classifications = [], riskScore = 0 } = context;

  try {
    const activePolicies = await db
      .select()
      .from(policies)
      .where(
        and(
          eq(policies.organizationId, organizationId),
          eq(policies.enabled, true)
        )
      );

    // Sort by priority ascending (1 is highest priority)
    activePolicies.sort((a, b) => a.priority - b.priority);

    // Evaluate each policy rule
    for (const policy of activePolicies) {
      const { conditions, action, id, name } = policy;
      
      // Match classifications
      const matchedClassifications = classifications.filter(c => 
        conditions.classifications && conditions.classifications.includes(c)
      );

      const hasClassificationMatch = matchedClassifications.length > 0;
      const meetsRiskScore = riskScore >= (conditions.minimumRiskScore || 0);

      // Trigger if condition matches
      if (hasClassificationMatch && meetsRiskScore) {
        return {
          decisionId: `dec_${Math.random().toString(36).substr(2, 9)}`,
          action: action,
          policyId: id,
          policyName: name,
          reason: `Matched policy rule "${name}"`,
          severity: riskScore >= 80 ? 'critical' : riskScore >= 50 ? 'high' : riskScore >= 20 ? 'medium' : 'low',
          riskScore: riskScore,
          labels: matchedClassifications,
          auditRequired: true
        };
      }
    }

    // Default Fallback: Allow
    return {
      decisionId: `dec_allow_${Math.random().toString(36).substr(2, 9)}`,
      action: 'allow',
      policyId: null,
      reason: 'No policy rules matched',
      severity: 'low',
      riskScore: riskScore,
      labels: [],
      auditRequired: false
    };

  } catch (error) {
    console.error('[Policy Engine] Error evaluating policies:', error.message);
    return {
      decisionId: 'dec_error',
      action: 'allow',
      policyId: null,
      reason: 'Internal policy evaluator error',
      severity: 'low',
      riskScore: 0,
      labels: [],
      auditRequired: true
    };
  }
}

module.exports = { evaluatePolicies };

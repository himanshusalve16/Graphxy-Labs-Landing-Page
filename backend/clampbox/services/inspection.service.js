// Clampbox Prompt Inspection Orchestrator Service
const secretDetector = require('./secretDetection.service');
const classifier = require('./classification.service');
const policyEngine = require('./policyEngine.service');
const redactor = require('./redaction.service');
const auditLogger = require('./audit.service');

/**
 * Normalizes, scans, scores, and applies security policy controls to a prompt.
 * 
 * @param {string} promptText 
 * @param {Object} reqContext - { organizationId, userId, source, provider }
 * @returns {Promise<Object>} - The final decision payload
 */
async function inspectPrompt(promptText, reqContext = {}) {
  const { 
    organizationId = 'default', 
    userId = null, 
    gatewayKeyId = null,
    source = 'gateway', 
    provider = 'chatgpt' 
  } = reqContext;

  const text = promptText || '';

  try {
    // 1. Scan text for matches
    const matches = secretDetector.scanText(text);

    // 2. Classify matches
    const { classifications, maxSeverity } = classifier.classifyMatches(matches);

    // 3. Compute risk score based on formula
    let baseScore = 0;
    if (maxSeverity === 'critical') baseScore = 80;
    else if (maxSeverity === 'high') baseScore = 55;
    else if (maxSeverity === 'medium') baseScore = 30;
    else if (maxSeverity === 'low' && matches.length > 0) baseScore = 15;

    // Weight factors
    const classificationWeight = classifications.length * 3;
    const countWeight = Math.min(matches.length * 2, 10);
    const providerWeight = provider === 'chatgpt' ? 2 : 0; // standard weight adjustment

    let riskScore = baseScore + classificationWeight + countWeight + providerWeight;
    riskScore = Math.min(Math.max(riskScore, 0), 100);

    const severity = riskScore >= 80 ? 'critical' : riskScore >= 50 ? 'high' : riskScore >= 20 ? 'medium' : 'low';

    // 4. Evaluate policies
    const policyDecision = await policyEngine.evaluatePolicies(organizationId, {
      provider,
      source,
      classifications,
      riskScore
    });

    // 5. Execute redaction if required
    let finalPromptText = text;
    let redactionCount = 0;

    if (policyDecision.action === 'redact') {
      const redactionResult = redactor.redactText(text, matches);
      finalPromptText = redactionResult.text;
      redactionCount = redactionResult.redactedCount;
    }

    // 6. Write to audit logging system
    await auditLogger.writeAuditLog({
      organizationId,
      userId,
      gatewayKeyId,
      source,
      provider,
      action: policyDecision.action,
      status: policyDecision.action === 'block' ? 'blocked' : 'success',
      riskScore,
      severity,
      labels: classifications,
      policyId: policyDecision.policyId,
      promptText: text,
      metadata: {
        matchesCount: matches.length,
        redactionCount
      }
    });

    return {
      decisionId: policyDecision.decisionId,
      action: policyDecision.action,
      riskScore,
      severity,
      labels: classifications,
      policyId: policyDecision.policyId,
      reason: policyDecision.reason,
      redactedText: finalPromptText,
      redactionCount
    };

  } catch (error) {
    console.error('[Inspection Service] Error inspecting prompt:', error);
    return {
      decisionId: 'dec_error',
      action: 'allow',
      riskScore: 0,
      severity: 'low',
      labels: [],
      policyId: null,
      reason: 'Failed to inspect prompt content',
      redactedText: text,
      redactionCount: 0
    };
  }
}

module.exports = {
  inspectPrompt
};

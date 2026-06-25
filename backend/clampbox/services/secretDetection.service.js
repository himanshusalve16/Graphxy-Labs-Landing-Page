// Clampbox Regex-based Secret and PII Detector Service

const DETECTORS = [
  {
    name: 'private_key',
    regex: /-----BEGIN (RSA |EC |dsa |pgp )?PRIVATE KEY-----[\s\S]+?-----END (RSA |EC |dsa |pgp )?PRIVATE KEY-----/gi,
    severity: 'critical',
    confidence: 1.0,
    label: 'cryptographic_secret',
    replacement: '[REDACTED_PRIVATE_KEY]'
  },
  {
    name: 'aws_access_key',
    regex: /\b(AKIA|ASCA|ABIA|ACCA)[0-9A-Z]{16}\b/g,
    severity: 'critical',
    confidence: 0.95,
    label: 'cloud_credential',
    replacement: '[AWS_ACCESS_KEY_ID]'
  },
  {
    name: 'aws_secret_key',
    regex: /\b[0-9a-zA-Z+/]{40}\b/g, // Should only match in credentials context (simplified for demonstration)
    severity: 'critical',
    confidence: 0.5,
    label: 'cloud_credential',
    replacement: '[AWS_SECRET_ACCESS_KEY]'
  },
  {
    name: 'email_address',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    severity: 'medium',
    confidence: 0.99,
    label: 'personal_data',
    replacement: '[REDACTED_EMAIL]'
  },
  {
    name: 'phone_number',
    regex: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    severity: 'medium',
    confidence: 0.8,
    label: 'personal_data',
    replacement: '[REDACTED_PHONE]'
  },
  {
    name: 'credit_card',
    regex: /\b(?:\d[ -]*?){13,16}\b/g, // Credit card-like candidates
    severity: 'high',
    confidence: 0.7,
    label: 'payment_data',
    replacement: '[REDACTED_CARD]'
  },
  {
    name: 'db_connection_url',
    regex: /\b(?:postgresql|mysql|mongodb|redis):\/\/[a-zA-Z0-9_.-]+:[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+:\d+\/[a-zA-Z0-9_.-]+\b/g,
    severity: 'critical',
    confidence: 0.95,
    label: 'infrastructure_secret',
    replacement: '[REDACTED_CONNECTION_STRING]'
  }
];

/**
 * Scans prompt text for secrets and PII indicators.
 * 
 * @param {string} text 
 * @returns {Array<Object>} - Matched offsets and label data
 */
function scanText(text) {
  if (!text || typeof text !== 'string') return [];
  
  const matches = [];
  
  DETECTORS.forEach(detector => {
    // Reset regex index
    detector.regex.lastIndex = 0;
    let match;
    
    while ((match = detector.regex.exec(text)) !== null) {
      matches.push({
        name: detector.name,
        label: detector.label,
        matchedValue: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: detector.confidence,
        severity: detector.severity,
        replacement: detector.replacement
      });
    }
  });

  return matches;
}

module.exports = {
  scanText
};

// Clampbox Classification Service

const CLASSIFICATION_MAP = {
  'private_key': 'cryptographic_secret',
  'aws_access_key': 'cloud_credential',
  'aws_secret_key': 'cloud_credential',
  'email_address': 'personal_data',
  'phone_number': 'personal_data',
  'credit_card': 'payment_data',
  'db_connection_url': 'infrastructure_secret'
};

/**
 * Resolves a list of unique classifications and severity scores from raw scan matches.
 * 
 * @param {Array<Object>} matches 
 * @returns {Object} - { classifications: string[], maxSeverity: string }
 */
function classifyMatches(matches) {
  if (!matches || !matches.length) {
    return { classifications: [], maxSeverity: 'low' };
  }

  const classificationsSet = new Set();
  let maxSeverityVal = 0; // 0 = low, 1 = medium, 2 = high, 3 = critical
  const severityMap = { low: 0, medium: 1, high: 2, critical: 3 };
  const severityLabels = ['low', 'medium', 'high', 'critical'];

  matches.forEach(m => {
    const mapped = CLASSIFICATION_MAP[m.name] || 'uncategorized';
    classificationsSet.add(mapped);

    const score = severityMap[m.severity] || 0;
    if (score > maxSeverityVal) {
      maxSeverityVal = score;
    }
  });

  return {
    classifications: Array.from(classificationsSet),
    maxSeverity: severityLabels[maxSeverityVal]
  };
}

module.exports = {
  classifyMatches
};

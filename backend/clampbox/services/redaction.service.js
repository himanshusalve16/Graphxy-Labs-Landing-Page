// Clampbox Redaction Service

/**
 * Replaces sensitive text spans with policy-safe placeholders.
 * Scans offsets in reverse/descending order to maintain string indexing.
 * 
 * @param {string} text 
 * @param {Array<Object>} matches 
 * @returns {Object} - { text: string, redactedCount: number }
 */
function redactText(text, matches) {
  if (!text || !matches || !matches.length) {
    return { text, redactedCount: 0 };
  }

  // Sort matches by startIndex descending to prevent indexes from shifting
  const sortedMatches = [...matches].sort((a, b) => b.startIndex - a.startIndex);

  let result = text;
  let count = 0;

  sortedMatches.forEach(m => {
    const before = result.substring(0, m.startIndex);
    const after = result.substring(m.endIndex);
    result = before + m.replacement + after;
    count++;
  });

  return {
    text: result,
    redactedCount: count
  };
}

module.exports = {
  redactText
};

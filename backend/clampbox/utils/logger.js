// Clampbox Security-Aware Logger Utility

// Regular expressions to detect and filter sensitive information from logs
const SECRET_PATTERNS = [
  /cb_(live|stag|dev)_[0-9a-zA-Z]+/gi,                   // Clampbox Gateway Keys
  /sk-proj-[0-9a-zA-Z]+/gi,                              // OpenAI API Keys
  /sk-ant-[0-9a-zA-Z_-]+/gi,                             // Anthropic API Keys
  /bearer\s+[0-9a-zA-Z._-]+/gi,                          // Bearer Tokens
  /db:\/\/.*?:.*?@/gi,                                   // DB URLs with credentials
  /pass(?:word)?\s*=\s*[^\s&]+/gi,                       // Passwords
  /secret\s*=\s*[^\s&]+/gi                               // Secrets
];

/**
 * Sanitizes sensitive inputs to prevent leaking credentials in logs.
 * @param {string} msg 
 * @returns {string}
 */
function sanitize(msg) {
  if (typeof msg !== 'string') {
    try {
      msg = JSON.stringify(msg);
    } catch (e) {
      return String(msg);
    }
  }

  let sanitized = msg;
  SECRET_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, (match) => {
      // Keep prefix but scrub the secret part
      if (match.toLowerCase().startsWith('bearer')) return 'Bearer [FILTERED]';
      if (match.toLowerCase().includes('://')) return 'db://[FILTERED_USER]:[FILTERED_PASS]@';
      return '[FILTERED]';
    });
  });

  return sanitized;
}

function formatLog(level, msg) {
  const ts = new Date().toISOString();
  return `[${ts}] [${level.toUpperCase()}] [Clampbox] ${sanitize(msg)}`;
}

const logger = {
  info: (msg) => {
    console.log(formatLog('info', msg));
  },
  warn: (msg) => {
    console.warn(formatLog('warn', msg));
  },
  error: (msg, err = null) => {
    const errMsg = err ? `${msg} - Error: ${err.message || err}\nStack: ${err.stack || ''}` : msg;
    console.error(formatLog('error', errMsg));
  },
  security: (msg) => {
    console.log(formatLog('security-event', msg));
  }
};

module.exports = logger;

// Clampbox Content Interceptor & Injected Dialogs
console.log('[Clampbox Guard] Injection script initialized.');

const SELECTORS = {
  chatgpt: {
    input: '#prompt-textarea',
    button: '[data-testid="send-button"]'
  },
  claude: {
    input: '[contenteditable="true"]',
    button: 'button[aria-label="Send Message"], button[type="submit"]'
  },
  gemini: {
    input: '.input-area textarea, [contenteditable="true"]',
    button: '.send-button-container button'
  }
};

let isChecking = false;

function getProvider() {
  const host = window.location.hostname;
  if (host.includes('chatgpt.com') || host.includes('openai.com')) return 'chatgpt';
  if (host.includes('claude.ai')) return 'claude';
  if (host.includes('gemini.google.com')) return 'gemini';
  return null;
}

// Injects the custom modal CSS styles into the page
function injectCSS() {
  if (document.getElementById('clampbox-guard-styles')) return;

  const style = document.createElement('style');
  style.id = 'clampbox-guard-styles';
  style.textContent = `
    .cb-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(9, 9, 11, 0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: 'Inter', system-ui, sans-serif;
      animation: cbFadeIn 200ms ease-out;
    }
    .cb-modal {
      background-color: #18181B;
      border: 1px solid #27272A;
      border-radius: 12px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
      color: #F4F4F5;
      overflow: hidden;
      animation: cbSlideUp 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cb-modal-header {
      padding: 18px 20px;
      border-bottom: 1px solid #27272A;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .cb-modal-icon {
      width: 20px;
      height: 20px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 11px;
      color: white;
    }
    .cb-modal-icon-block {
      background-color: #EF4444;
    }
    .cb-modal-icon-warn {
      background-color: #F59E0B;
    }
    .cb-modal-title {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }
    .cb-modal-body {
      padding: 20px;
      font-size: 12.5px;
      line-height: 1.6;
      color: #D4D4D8;
    }
    .cb-modal-footer {
      padding: 14px 20px;
      background-color: #09090B;
      border-top: 1px solid #27272A;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .cb-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 150ms ease;
    }
    .cb-btn-primary {
      background-color: #0D9488;
      color: white;
    }
    .cb-btn-primary:hover {
      background-color: #0F766E;
    }
    .cb-btn-danger {
      background-color: #EF4444;
      color: white;
    }
    .cb-btn-danger:hover {
      background-color: #DC2626;
    }
    .cb-btn-ghost {
      background-color: transparent;
      color: #A1A1AA;
      border: 1px solid #27272A;
    }
    .cb-btn-ghost:hover {
      background-color: rgba(255,255,255,0.03);
      color: #F4F4F5;
    }
    .cb-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #18181B;
      border: 1px solid #0D9488;
      border-left: 4px solid #0D9488;
      border-radius: 8px;
      padding: 12px 18px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      color: #F4F4F5;
      font-size: 12px;
      font-weight: 500;
      z-index: 999999;
      transform: translateX(120%);
      transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cb-toast.show {
      transform: translateX(0);
    }

    @keyframes cbFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes cbSlideUp {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// Injects modal overlay to DOM and returns a promise resolving on click
function showModal({ type, title, message, actionText, cancelText }) {
  injectCSS();
  
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'cb-overlay';

    const modal = document.createElement('div');
    modal.className = 'cb-modal';

    const header = document.createElement('div');
    header.className = 'cb-modal-header';

    const icon = document.createElement('div');
    icon.className = `cb-modal-icon cb-modal-icon-${type}`;
    icon.textContent = type === 'block' ? '!' : '?';

    const titleEl = document.createElement('h4');
    titleEl.className = 'cb-modal-title';
    titleEl.textContent = title;

    header.appendChild(icon);
    header.appendChild(titleEl);

    const body = document.createElement('div');
    body.className = 'cb-modal-body';
    body.innerHTML = message;

    const footer = document.createElement('div');
    footer.className = 'cb-modal-footer';

    if (cancelText) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'cb-btn cb-btn-ghost';
      cancelBtn.textContent = cancelText;
      cancelBtn.addEventListener('click', () => {
        overlay.remove();
        resolve(false);
      });
      footer.appendChild(cancelBtn);
    }

    const actionBtn = document.createElement('button');
    actionBtn.className = `cb-btn ${type === 'block' ? 'cb-btn-danger' : 'cb-btn-primary'}`;
    actionBtn.textContent = actionText;
    actionBtn.addEventListener('click', () => {
      overlay.remove();
      resolve(true);
    });
    footer.appendChild(actionBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);
  });
}

// Shows a sliding toast alert
function showToast(message) {
  injectCSS();
  
  const toast = document.createElement('div');
  toast.className = 'cb-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Trigger slide in
  setTimeout(() => toast.classList.add('show'), 50);
  
  // Slide out and remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Hijack prompt submission
function setupInterception() {
  const provider = getProvider();
  if (!provider) return;

  const config = SELECTORS[provider];

  // Intercept key down ENTER events
  document.addEventListener('keydown', async (event) => {
    if (isChecking) return; // Recursion shield

    const input = document.querySelector(config.input);
    if (!input || event.target !== input) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      const promptText = input.value || input.innerText || '';
      if (!promptText.trim()) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const decision = await checkPrompt(promptText, provider);
      await handleEnforcement(input, decision, () => {
        // Submit callback
        isChecking = true;
        
        // Emulate sending by dispatching keypress
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        });
        input.dispatchEvent(enterEvent);
        
        // Fallback for rich input editors (like ChatGPT/Gemini) if keypress fails
        const submitBtn = document.querySelector(config.button);
        if (submitBtn) {
          submitBtn.click();
        }
        
        isChecking = false;
      });
    }
  }, true);

  // Intercept click on send buttons
  document.addEventListener('click', async (event) => {
    if (isChecking) return;

    const button = document.querySelector(config.button);
    if (!button || !button.contains(event.target)) return;

    const input = document.querySelector(config.input);
    if (!input) return;

    const promptText = input.value || input.innerText || '';
    if (!promptText.trim()) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const decision = await checkPrompt(promptText, provider);
    await handleEnforcement(input, decision, () => {
      isChecking = true;
      button.click();
      isChecking = false;
    });
  }, true);
}

function checkPrompt(text, provider) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'CHECK_PROMPT', text, provider }, (response) => {
      resolve(response || { action: 'allow', redactedText: text });
    });
  });
}

async function handleEnforcement(input, decision, submitCallback) {
  const { action, reason = 'Blocked by policy rule', redactedText } = decision;

  if (action === 'block') {
    await showModal({
      type: 'block',
      title: 'Prompt Submission Blocked',
      message: `<strong>Security Alert:</strong> Your prompt contains sensitive information and has been blocked.<br/><br/><span style="color:#EF4444">${reason}</span>`,
      actionText: 'Acknowledge'
    });
    return;
  }

  if (action === 'warn') {
    const proceed = await showModal({
      type: 'warn',
      title: 'Security Warning',
      message: `<strong>Notice:</strong> High-risk configurations or potential secrets were detected in your prompt. Do you wish to proceed and submit anyway?<br/><br/><span style="color:#F59E0B">${reason}</span>`,
      actionText: 'Submit Anyway',
      cancelText: 'Cancel'
    });
    if (!proceed) return;
  }

  if (action === 'redact' && redactedText && redactedText !== (input.value || input.innerText)) {
    if (input.value !== undefined) {
      input.value = redactedText;
    } else {
      input.innerText = redactedText;
    }
    
    // Dispatch input events to trigger state update in host UI frameworks
    input.dispatchEvent(new Event('input', { bubbles: true }));
    showToast('Prompt redacted & secured before submission.');
  }

  submitCallback();
}

// Check every 2 seconds to bind event listeners
setInterval(setupInterception, 2000);

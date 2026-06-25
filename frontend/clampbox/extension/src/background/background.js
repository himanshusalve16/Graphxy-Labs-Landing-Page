// Clampbox Extension Background Service Worker
const API_BASE_URL = 'http://localhost:5000/api/clampbox';

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Clampbox Background] Extension installed.');
  
  // Create a unique installation ID
  chrome.storage.local.get(['installationId'], (store) => {
    if (!store.installationId) {
      const instId = 'inst_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      chrome.storage.local.set({
        installationId: instId,
        connected: false,
        gatewayKey: null,
        gatewayName: null,
        activePolicy: 'Standard Policy',
        lastSync: null,
        policies: [],
        inspectHistory: []
      });
    }
  });
});

// Periodic policy sync handler
async function syncPolicies() {
  chrome.storage.local.get(['gatewayKey', 'connected'], async (data) => {
    if (!data.connected || !data.gatewayKey) return;

    try {
      const response = await fetch(`${API_BASE_URL}/policies`, {
        headers: { 'X-Clampbox-Key': data.gatewayKey }
      });
      
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          // Find enabled policy with highest priority
          const activePol = json.data.find(p => p.enabled) || json.data[0] || { name: 'Standard Policy' };
          
          chrome.storage.local.set({
            policies: json.data,
            activePolicy: activePol.name,
            lastSync: new Date().toLocaleTimeString()
          });
          console.log('[Clampbox Background] Policies synchronized:', json.data.length);
        }
      }
    } catch (err) {
      console.warn('[Clampbox Background] Policy sync failed. Using cached rules.');
    }
  });
}

// Ping backend to update active extension session
async function pingSession() {
  chrome.storage.local.get(['gatewayKey', 'connected', 'installationId'], async (data) => {
    if (!data.connected || !data.gatewayKey || !data.installationId) return;

    try {
      await fetch(`${API_BASE_URL}/extension/ping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Clampbox-Key': data.gatewayKey
        },
        body: JSON.stringify({
          installationId: data.installationId,
          extensionVersion: '1.0.0',
          browser: 'Chrome',
          platform: navigator.platform || 'Unknown'
        })
      });
      console.log('[Clampbox Background] Ping session updated.');
    } catch (err) {
      console.warn('[Clampbox Background] Session ping failed.');
    }
  });
}

// Alarms to trigger sync and ping every 3 minutes
chrome.alarms.create('policy-sync-alarm', { periodInMinutes: 3 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'policy-sync-alarm') {
    syncPolicies();
    pingSession();
  }
});

// Listener for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'FORCE_SYNC') {
    syncPolicies().then(() => {
      pingSession().then(() => {
        sendResponse({ success: true });
      });
    }).catch(() => {
      sendResponse({ success: false });
    });
    return true;
  }

  if (request.type === 'CHECK_PROMPT') {
    chrome.storage.local.get(['gatewayKey', 'connected', 'inspectHistory'], async (store) => {
      const prompt = request.text || '';
      
      if (!store.connected || !store.gatewayKey) {
        // Allow by default if disconnected
        sendResponse({ action: 'allow', redactedText: prompt, reason: 'Disconnected' });
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/risk/inspect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Clampbox-Key': store.gatewayKey
          },
          body: JSON.stringify({
            text: prompt,
            provider: request.provider || 'chatgpt',
            source: 'extension'
          })
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            const decision = json.data;

            // Cache inspection history locally (keep last 10)
            const history = store.inspectHistory || [];
            history.push({
              promptText: prompt.substring(0, 100),
              action: decision.action,
              timestamp: new Date().toLocaleTimeString()
            });
            if (history.length > 10) history.shift();
            chrome.storage.local.set({ inspectHistory: history });

            sendResponse(decision);
            return;
          }
        }
        
        // Fallback on HTTP errors
        sendResponse({ action: 'allow', redactedText: prompt, reason: 'Inspection error' });
      } catch (err) {
        console.error('[Clampbox Background] Prompt inspect error:', err);
        sendResponse({ action: 'allow', redactedText: prompt, reason: 'Network failure' });
      }
    });
    return true; // Keep channel open for async response
  }
});

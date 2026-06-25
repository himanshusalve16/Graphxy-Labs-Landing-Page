// Clampbox Popup Logic
const BACKEND_URL = 'http://localhost:5000/api/clampbox';

document.addEventListener('DOMContentLoaded', () => {
  const connStatus = document.getElementById('connection-status');
  const gatewayName = document.getElementById('gateway-name');
  const activePolicy = document.getElementById('active-policy');
  const lastSync = document.getElementById('last-sync');
  const backendHealth = document.getElementById('backend-health');

  const disconnectedView = document.getElementById('disconnected-view');
  const connectedView = document.getElementById('connected-view');
  const historySection = document.getElementById('history-section');
  const historyList = document.getElementById('history-list');
  const historyCount = document.getElementById('history-count');

  const gatewayInput = document.getElementById('gateway-key-input');
  const connectBtn = document.getElementById('connect-btn');
  const disconnectBtn = document.getElementById('disconnect-btn');
  const syncBtn = document.getElementById('sync-btn');

  // Verify backend health
  async function checkHealth() {
    try {
      const res = await fetch(`${BACKEND_URL}/health`);
      if (res.ok) {
        backendHealth.textContent = 'Online';
        backendHealth.style.color = 'var(--color-green)';
      } else {
        backendHealth.textContent = 'Degraded';
        backendHealth.style.color = '#F59E0B';
      }
    } catch (e) {
      backendHealth.textContent = 'Offline';
      backendHealth.style.color = 'var(--color-red)';
    }
  }

  // Update UI values from storage
  function updateUI() {
    chrome.storage.local.get([
      'connected',
      'gatewayKey',
      'gatewayName',
      'activePolicy',
      'lastSync',
      'inspectHistory'
    ], (data) => {
      if (data.connected && data.gatewayKey) {
        // Connected view
        connStatus.textContent = 'Active';
        connStatus.className = 'badge badge-active';
        gatewayName.textContent = data.gatewayName || 'Main Gateway';
        activePolicy.textContent = data.activePolicy || 'Standard Policy';
        lastSync.textContent = data.lastSync || 'Just now';

        disconnectedView.style.display = 'none';
        connectedView.style.display = 'block';
      } else {
        // Disconnected view
        connStatus.textContent = 'Disconnected';
        connStatus.className = 'badge badge-inactive';
        gatewayName.textContent = '-';
        activePolicy.textContent = '-';
        lastSync.textContent = '-';

        disconnectedView.style.display = 'block';
        connectedView.style.display = 'none';
      }

      // Display inspection history
      const history = data.inspectHistory || [];
      if (history.length > 0) {
        historySection.style.display = 'block';
        historyCount.textContent = `${history.length} log${history.length > 1 ? 's' : ''}`;
        
        historyList.innerHTML = '';
        // Display last 3 logs
        history.slice(-3).reverse().forEach(item => {
          const div = document.createElement('div');
          div.className = 'history-item';
          
          const textSpan = document.createElement('span');
          textSpan.className = 'history-text';
          textSpan.textContent = item.promptText || '';
          textSpan.title = item.promptText || '';
          
          const badgeSpan = document.createElement('span');
          badgeSpan.className = `history-badge h-${item.action}`;
          badgeSpan.textContent = item.action;
          
          div.appendChild(textSpan);
          div.appendChild(badgeSpan);
          historyList.appendChild(div);
        });
      } else {
        historySection.style.display = 'none';
      }

      const consoleLink = document.getElementById('console-link');
      const auditLink = document.getElementById('audit-link');
      if (consoleLink && auditLink) {
        if (BACKEND_URL.includes('localhost')) {
          consoleLink.href = 'http://localhost:5173/clampbox/dashboard';
          auditLink.href = 'http://localhost:5173/clampbox/audit';
        } else {
          consoleLink.href = 'https://clampbox.graphxylabs.dev/dashboard';
          auditLink.href = 'https://clampbox.graphxylabs.dev/audit';
        }
      }
    });
  }

  const confirmModal = document.getElementById('confirm-modal');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const errorBanner = document.getElementById('error-banner');

  function showError(msg) {
    if (msg) {
      errorBanner.textContent = msg;
      errorBanner.style.display = 'block';
      setTimeout(() => {
        errorBanner.style.display = 'none';
      }, 5000);
    } else {
      errorBanner.style.display = 'none';
    }
  }

  // Connect Gateway key
  connectBtn.addEventListener('click', async () => {
    const key = gatewayInput.value.trim();
    if (!key) {
      showError('Please enter a Gateway API Key.');
      return;
    }

    connectBtn.textContent = 'Connecting...';
    connectBtn.disabled = true;
    showError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/gateway-keys/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          // Fetch active policy name
          let policyName = 'Standard Policy';
          try {
            const polRes = await fetch(`${BACKEND_URL}/policies`, {
              headers: { 'X-Clampbox-Key': key }
            });
            if (polRes.ok) {
              const polJson = await polRes.json();
              if (polJson.success && polJson.data && polJson.data.length > 0) {
                // Enabled policy with highest priority
                const activePol = polJson.data.find(p => p.enabled) || polJson.data[0];
                policyName = activePol.name;
              }
            }
          } catch (e) {}

          chrome.storage.local.set({
            connected: true,
            gatewayKey: key,
            gatewayName: json.key.name,
            orgId: json.organization.id,
            activePolicy: policyName,
            lastSync: new Date().toLocaleTimeString(),
            inspectHistory: []
          }, () => {
            // Trigger sync alarm in background
            chrome.runtime.sendMessage({ type: 'FORCE_SYNC' });
            gatewayInput.value = '';
            updateUI();
          });
        } else {
          showError('Failed to connect: Invalid Gateway Key response.');
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        showError(`Connection failed: ${errJson.error || 'Check backend server status.'}`);
      }
    } catch (e) {
      showError('Failed to connect to backend server. Make sure Clampbox backend is running on port 5000.');
    } finally {
      connectBtn.textContent = 'Connect Gateway';
      connectBtn.disabled = false;
    }
  });

  // Disconnect Gateway key
  disconnectBtn.addEventListener('click', () => {
    confirmModal.style.display = 'flex';
  });

  modalCancelBtn.addEventListener('click', () => {
    confirmModal.style.display = 'none';
  });

  modalConfirmBtn.addEventListener('click', () => {
    confirmModal.style.display = 'none';
    chrome.storage.local.set({
      connected: false,
      gatewayKey: null,
      gatewayName: null,
      orgId: null,
      activePolicy: null,
      lastSync: null
    }, () => {
      updateUI();
    });
  });

  // Force policy synchronization
  syncBtn.addEventListener('click', () => {
    syncBtn.textContent = 'Syncing...';
    syncBtn.disabled = true;
    
    chrome.runtime.sendMessage({ type: 'FORCE_SYNC' }, (response) => {
      syncBtn.textContent = 'Force Sync Policies';
      syncBtn.disabled = false;
      if (response && response.success) {
        updateUI();
      } else {
        showError('Policy synchronization failed. Check backend connection.');
      }
    });
  });

  checkHealth();
  updateUI();
  
  // Refresh stats every 5 seconds
  setInterval(checkHealth, 5000);
});

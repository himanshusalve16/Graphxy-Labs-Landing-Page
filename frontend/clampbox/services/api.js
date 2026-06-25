const API_BASE = import.meta.env.VITE_GRAPHXY_API_BASE_URL || 'http://localhost:5000/api/clampbox';
const DEFAULT_ORG = 'default';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const json = await res.json();
  if (!res.ok) throw new ApiError(json.error || 'Request failed', res.status);
  return json;
}

export const api = {
  getDashboard: (orgId = DEFAULT_ORG) =>
    request(`/dashboard?organizationId=${orgId}`),

  getPolicies: (orgId = DEFAULT_ORG) =>
    request(`/policies?organizationId=${orgId}`),

  createPolicy: (orgId = DEFAULT_ORG, data) =>
    request(`/policies`, { method: 'POST', body: JSON.stringify({ ...data, organizationId: orgId }) }),

  deletePolicy: (id, orgId = DEFAULT_ORG) =>
    request(`/policies/${id}?organizationId=${orgId}`, { method: 'DELETE' }),

  getKeys: (orgId = DEFAULT_ORG) =>
    request(`/gateway-keys?organizationId=${orgId}`),

  createKey: (orgId = DEFAULT_ORG, data) =>
    request(`/gateway-keys`, { method: 'POST', body: JSON.stringify({ ...data, organizationId: orgId }) }),

  revokeKey: (id, orgId = DEFAULT_ORG) =>
    request(`/gateway-keys/${id}?organizationId=${orgId}`, { method: 'DELETE' }),

  getAuditLogs: (orgId = DEFAULT_ORG, params = {}) => {
    const qs = new URLSearchParams({ organizationId: orgId, ...params }).toString();
    return request(`/audit-logs?${qs}`);
  },

  getVault: (orgId = DEFAULT_ORG) =>
    request(`/vault?organizationId=${orgId}`),

  createVaultEntry: (orgId = DEFAULT_ORG, data) =>
    request(`/vault`, { method: 'POST', body: JSON.stringify({ ...data, organizationId: orgId }) }),

  revokeVaultEntry: (id, orgId = DEFAULT_ORG) =>
    request(`/vault/${id}?organizationId=${orgId}`, { method: 'DELETE' }),

  getSettings: (orgId = DEFAULT_ORG) =>
    request(`/settings?organizationId=${orgId}`),

  saveSettings: (orgId = DEFAULT_ORG, settings) =>
    request(`/settings?organizationId=${orgId}`, { method: 'PUT', body: JSON.stringify({ organizationId: orgId, settings }) }),

  inspect: (data) =>
    request(`/risk/inspect`, { method: 'POST', body: JSON.stringify(data) }),

  setupOnboarding: (data) =>
    request(`/onboarding`, { method: 'POST', body: JSON.stringify(data) })
};

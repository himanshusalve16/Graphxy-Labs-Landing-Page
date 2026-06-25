# Clampbox Product Status

> **Purpose:** Single source of truth for the current implementation state of Clampbox — covering what is built, what is pending, active API routes, technical debt, and the product roadmap.

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Implementation Inventory](#2-implementation-inventory)
3. [Active API Routes](#3-active-api-routes)
4. [Production Hardening Summary](#4-production-hardening-summary)
5. [Technical Debt](#5-technical-debt)
6. [Product Roadmap](#6-product-roadmap)

---

## 1. Platform Overview

Clampbox is a **single-user MVP AI Security Gateway** deployed within the Graphxy Labs monorepo. It controls prompt flow and prevents sensitive data leaks (credentials, customer records, proprietary source code) before they reach public LLMs.

**Dual Interface:**
1. **Browser Extension** (Manifest V3) — Real-time prompt interception on ChatGPT, Claude, Gemini
2. **API Gateway** — Developer-facing HTTP proxy using cryptographic gateway keys

**Stack:**
| Layer | Technology |
|---|---|
| Frontend | Vite, React 18, Tailwind CSS, Framer Motion, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | PostgreSQL via Drizzle ORM |
| Cache | Redis |
| Extension | Chrome Manifest V3 |
| Frontend Hosting | Vercel (`graphxylabs.dev`) |
| Backend Hosting | Render |

---

## 2. Implementation Inventory

### Backend Modules

| File | Purpose |
|---|---|
| `backend/clampbox/controllers/dashboard.controller.js` | Live aggregated database metrics endpoint |
| `backend/clampbox/controllers/vault.controller.js` | Encrypted provider API credential storage (AES-256-CBC) |
| `backend/clampbox/controllers/settings.controller.js` | Global workspace configuration controller |
| `backend/clampbox/controllers/audit.controller.js` | Compliance audit log retrieval (real DB, no mocks) |
| `backend/clampbox/controllers/keys.controller.js` | Gateway key generation and revocation (no mock fallbacks) |
| `backend/clampbox/controllers/policies.controller.js` | Policy CRUD (no mock rule fallbacks) |
| `backend/clampbox/controllers/waitlist.controller.js` | Real database waitlist insert |
| `backend/clampbox/utils/orgResolver.js` | Resolves string tenant IDs to correct PostgreSQL UUID records |
| `backend/clampbox/services/inspection.service.js` | Orchestrates the security evaluation pipeline |
| `backend/clampbox/services/secretDetection.service.js` | Regex-based secret and PII scanner |
| `backend/clampbox/services/classification.service.js` | Maps detections to semantic taxonomy |
| `backend/clampbox/services/riskScoring.service.js` | Calculates risk scores (0–100) |
| `backend/clampbox/services/redaction.service.js` | Replaces matched spans with `[REDACTED_X]` placeholders |
| `backend/clampbox/services/policyEngine.service.js` | Evaluates active policies and produces enforcement decisions |
| `backend/clampbox/services/gatewayKey.service.js` | Generates and validates cryptographic gateway tokens |
| `backend/clampbox/services/audit.service.js` | Writes immutable audit log records |

### Database Schema

Schema files live in `db/clampbox/schema/schema.js`. Current tables:

| Table | Purpose |
|---|---|
| `organizations` | Tenant workspace records (slug, settings JSON) |
| `api_keys` | Authorized gateway access tokens (hashed, peppered) |
| `policies` | Security rules (action, priority, enabled flag) |
| `api_credentials` | Encrypted provider API keys (Vault) |
| `audit_logs` | Immutable interception event records |
| `prompt_events` | Detailed prompt metadata (hashed content, detections) |
| `waitlist` | Email submissions from the product waitlist page |

### Frontend Console Pages

| File | Page |
|---|---|
| `frontend/clampbox/web/Dashboard.jsx` | Overview with metrics cards, getting-started card, and setup wizard |
| `frontend/clampbox/web/Policies.jsx` | Policy management (create, list, delete) |
| `frontend/clampbox/web/Keys.jsx` | Gateway key generation and revocation |
| `frontend/clampbox/web/Gateways.jsx` | Active gateways listed by key association |
| `frontend/clampbox/web/AuditLogs.jsx` | Paginated compliance audit log viewer |
| `frontend/clampbox/web/Vault.jsx` | Encrypted provider credential management |
| `frontend/clampbox/web/Settings.jsx` | Workspace configuration (defaults, rate limits, retention) |

### Frontend Components

| File | Purpose |
|---|---|
| `frontend/clampbox/components/CbLayout.jsx` | Console shell — white sidebar, active state routing, responsive mobile drawer |
| `frontend/clampbox/components/Modal.jsx` | State-driven custom modal (replaces native browser `alert/confirm`) |
| `frontend/clampbox/components/SetupWizardModal.jsx` | Multi-step onboarding wizard (key creation, extension setup, audit verification) |
| `frontend/clampbox/services/api.js` | Centralized fetch client with error handling |

---

## 3. Active API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/clampbox/health` | Service health status |
| `GET` | `/api/clampbox/dashboard` | Live aggregated metrics |
| `GET` | `/api/clampbox/policies` | List all active security rules |
| `POST` | `/api/clampbox/policies` | Create a new security rule |
| `DELETE` | `/api/clampbox/policies/:id` | Delete a security rule |
| `GET` | `/api/clampbox/gateway-keys` | List all gateway access keys |
| `POST` | `/api/clampbox/gateway-keys` | Generate a new gateway token |
| `DELETE` | `/api/clampbox/gateway-keys/:id` | Revoke a gateway token |
| `GET` | `/api/clampbox/audit-logs` | Retrieve paginated audit log records |
| `POST` | `/api/clampbox/risk/inspect` | Inspect a prompt through the security pipeline |
| `GET` | `/api/clampbox/vault` | List encrypted credential entries (metadata only) |
| `POST` | `/api/clampbox/vault` | Store an encrypted provider key |
| `DELETE` | `/api/clampbox/vault/:id` | Revoke a vault credential |
| `GET` | `/api/clampbox/settings` | Retrieve workspace configuration |
| `PUT` | `/api/clampbox/settings` | Update workspace configuration |

---

## 4. Production Hardening Summary

The following production-readiness improvements have been completed:

### Onboarding — Dashboard-First Flow
- Removed mandatory onboarding redirect between the product page and dashboard
- Dashboard now detects setup completion state and shows a **Getting Started** progress card
- Interactive checklist checks for: active gateway key, connected browser extension, first audit event
- Setup wizard available via dashboard header button — launches `SetupWizardModal.jsx`
- Checklist is replaced by a success widget upon 100% completion

### Visual & Design Polish
- Animated radial mesh glows (`float-glow-1`, `float-glow-2`) matching the Graphxy Labs aesthetic
- 20px repeating grid overlay and procedural SVG noise texture on the main content area
- Custom zinc Tailwind palette tokens (`zinc-150`, `zinc-250`, `zinc-450`, etc.) for consistent contrast
- Sidebar converted to white/light background with teal active state indicators
- Logo restored to original uploaded design (`#676767` / `#D9D9D9` fills)

### Custom Modal System
- Native `alert()` / `confirm()` calls replaced with a state-driven `<Modal />` component
- Used across: policy delete confirmations, key revocation prompts, vault validation errors, settings save banners

### API URL Cleanup
- All hardcoded `localhost:5000` references in docs and UI components replaced with production paths
- Extension popup uses dynamic host resolution (production by default, localhost fallback in dev)

---

## 5. Technical Debt

| Priority | Issue | Notes |
|---|---|---|
| 🔴 High | **JWT verification for PATs** | Personal Access Tokens currently generate hex strings but lack backend cryptographic signing and validation |
| 🟡 Medium | **Real-time policy sync** | Extension currently polls every 5 minutes — WebSocket implementation would enable instant policy updates |
| 🟡 Medium | **API rate limiting hardening** | DDoS protection on `/api/clampbox/` routes needs load testing validation |
| 🟢 Low | **Automated test coverage** | No unit or integration tests exist — prioritize for v1.1 |

---

## 6. Product Roadmap

### Q3 2026 — Performance & Security
- **Redis Rule Cache:** Move active policy evaluation from PostgreSQL queries to memory-backed Redis checks for `<5ms` gateway latencies
- **Encrypted Fields at Rest:** Encrypt audit log payloads and vault values using server environment secrets

### Q4 2026 — Enterprise Integrations
- **SAML / SSO Integration:** Allow authentication via Okta, Azure AD, Auth0
- **Custom Policy Regex Builders:** Visual sandbox for testing prompt regex patterns before applying block/redact actions
- **SIEM Export Streams:** Stream audit logs directly to Datadog, Splunk, or AWS S3

### Q1 2027 — Autonomous Privacy Agents
- **Self-Healing Redaction:** Deep learning models for context-based PII detection beyond strict regex patterns
- **Instant Notifications:** Real-time Slack/email alerts on high-risk security violations

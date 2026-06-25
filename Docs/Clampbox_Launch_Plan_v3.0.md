# Clampbox Launch Plan v3.0

**Internal Engineering Specification**  
**Parent Company:** Graphxy Labs  
**Product:** Clampbox  
**Website:** https://graphxylabs.dev  
**Status:** Draft for implementation planning  
**Version:** 3.0  

---

## Table Of Contents

1. Part 1: Executive Summary, Vision, Market, Product Overview, Architecture
2. Part 2: Frontend, Backend, Database, Folder Structure, Routing
3. Part 3: Dashboard, Browser Extension, Security Engine
4. Part 4: Policies, Gateway, Risk Engine, Audit
5. Part 5: API Design, Database Schema, Authentication
6. Part 6: UI/UX, Design System, Motion System
7. Part 7: Deployment, Roadmap, Business Model
8. Part 8: Appendix, Glossary, Future Work

---

# Part 1: Executive Summary, Vision, Market, Product Overview, Architecture

## 1. Executive Summary

Clampbox is an AI Security Gateway developed by Graphxy Labs. It protects the interactions between users, organizations, browser-based AI tools, internal applications, and external AI providers.

Clampbox does not replace large language models. It does not become the chat interface of record for every user. It sits between users and AI systems so organizations can inspect prompts, detect secrets, enforce policies, redact sensitive data, score risk, and record audit evidence before sensitive information leaves the organization.

The product is part of the Graphxy Labs ecosystem. The public product page, waitlist, and dashboard surfaces are integrated into the existing Graphxy Labs website and application. There is one Graphxy Labs frontend. Clampbox lives inside that frontend as a product area.

The initial product architecture uses:

| Layer | Stack |
|---|---|
| Frontend | React JS, Vite, JavaScript, React Router, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Drizzle ORM |
| Browser Extension | Chrome Extension, Manifest V3, React JS, Vite |
| Cache and Queue Support | Redis where needed for rate limits, policy cache, extension sessions, and future async processing |

Clampbox v3.0 has two primary interaction paths:

1. Browser extension protection for users interacting with providers such as ChatGPT, Claude, Gemini, Grok, Perplexity, and future providers.
2. Gateway API protection for applications and teams that route provider requests through the Graphxy Labs backend.

The product starts with pragmatic deterministic controls: regex detection, structured classification, policy evaluation, redaction, gateway assignment, risk scoring, and audit logging. The roadmap later adds semantic detection, enterprise governance, advanced analytics, cloud connectors, desktop controls, and confidential computing research.

## 2. Product Vision

The vision for Clampbox is to make AI usage governable without making it unusable.

Organizations are adopting AI faster than they are adopting AI security. Employees paste customer data into web tools. Engineers send proprietary code and stack traces into assistants. Sales, finance, legal, and support teams use AI to summarize content that may include regulated or confidential information. Product teams integrate external AI APIs before security teams can define a review process.

Clampbox gives those organizations a control plane:

- See which AI providers are being used.
- Inspect prompts before they are submitted.
- Detect secrets, credentials, PII, PHI-like data, internal identifiers, financial data, source code, and proprietary content.
- Enforce policies by organization, user, provider, gateway, data type, severity, and environment.
- Redact sensitive spans instead of blocking useful work where possible.
- Score risk consistently.
- Maintain an audit trail suitable for security reviews and compliance evidence.
- Give administrators a dashboard that explains decisions clearly.

Clampbox must feel like infrastructure. It should be quiet, reliable, explainable, and predictable. The product should avoid theatrical security language and focus on practical governance.

## 3. Product Positioning

### 3.1 Positioning Statement

Clampbox is the AI Security Gateway for teams that need visibility, policy enforcement, redaction, and auditability across employee and application AI usage.

### 3.2 What Clampbox Is

Clampbox is:

- A security gateway for prompts and AI provider requests.
- A browser extension for governed use of web-based AI tools.
- A dashboard for policies, keys, audit logs, risk, and organization management.
- A backend policy and inspection engine.
- A product within the Graphxy Labs ecosystem.

### 3.3 What Clampbox Is Not

Clampbox is not:

- A replacement for ChatGPT, Claude, Gemini, Grok, Perplexity, or future providers.
- A new foundation model.
- A general chatbot product.
- An independent legal entity.
- An independently hosted web property.
- A browser.
- A SIEM.
- A DLP product trying to replace all enterprise security tools.

Clampbox should integrate with security workflows over time, but the first job is narrow and concrete: protect AI interactions.

## 4. Market Context

### 4.1 Problem

AI adoption has moved from experimentation into daily work. Security teams now face a visibility and governance gap:

| Problem | Why It Matters |
|---|---|
| Employees paste sensitive data into AI tools | Data leaves without review or auditability |
| Developers send credentials and proprietary code | Secrets can be exposed and source IP can leak |
| Different teams use different providers | Governance becomes fragmented |
| Browser-based AI usage is hard to observe | Traditional API gateway controls do not apply |
| AI provider policies vary | Organizations need their own enforcement layer |
| Compliance teams need evidence | Logs must show what happened and why |

Existing controls often sit too far away from the moment of risk. Endpoint agents may know that a browser is open. Network tools may see domains. API logs may show provider traffic. But the sensitive part is the prompt content and the policy decision before submission.

### 4.2 Target Customers

| Segment | Initial Pain | Buying Trigger |
|---|---|---|
| Startups using AI in products | No central gateway or audit trail | Customer security review |
| Software teams | Secrets and code pasted into tools | Internal security incident or SOC 2 preparation |
| Mid-market companies | AI usage spread across departments | Governance mandate |
| Security teams | No prompt-level visibility | Risk assessment or board pressure |
| Compliance-driven teams | Need evidence of AI controls | Audit request |

### 4.3 Competitive Positioning

Clampbox should be positioned as a focused AI interaction governance layer. It is narrower than broad endpoint security platforms and more direct than passive analytics. Its core advantage is being close to the prompt:

- Before submission: inspect, classify, redact, block, or allow.
- During use: synchronize policy to extension sessions and gateways.
- After decision: record structured audit evidence.

## 5. Product Overview

### 5.1 Core Flow

```text
User
  |
  v
Clampbox Browser Extension
  |
  v
Clampbox Security Engine
  |
  v
Policy Engine
  |
  v
AI Provider
  |
  v
Response
```

Supported providers:

- ChatGPT
- Claude
- Gemini
- Grok
- Perplexity
- Future providers

### 5.2 Core Capabilities

| Capability | Description |
|---|---|
| Prompt Inspection | Extracts prompt content from browser forms, extension events, and gateway requests |
| Secret Detection | Detects credentials, tokens, API keys, private keys, and risky configuration fragments |
| Policy Enforcement | Applies allow, warn, redact, block, require review, and log-only actions |
| Prompt Redaction | Replaces sensitive spans with policy-safe placeholders before forwarding or submission |
| Gateway Management | Issues gateway keys, assigns policies, rotates credentials, and controls provider routing |
| Risk Scoring | Produces consistent severity and score values based on detections and context |
| Audit Logging | Records decisions, metadata, hashes, detections, users, providers, and policy outcomes |
| Enterprise Governance | Supports organizations, roles, policy assignments, audit review, and future RBAC |
| Browser Extension | Adds protection to browser-based AI usage with Manifest V3 architecture |
| Dashboard | Provides product administration, traffic visibility, policy management, keys, risk, and audit |
| Waitlist | Captures demand from the Graphxy Labs product page |
| Future Enterprise Features | Adds SSO, SCIM, SIEM export, cloud connectors, semantic detection, and advanced analytics |

### 5.3 Product Surfaces

| Surface | Route Or Location | Audience |
|---|---|---|
| Product Page | `/products/clampbox` | Public visitors and prospective customers |
| Waitlist | `/clampbox/waitlist` | Prospects and early access users |
| Dashboard | `/clampbox/dashboard` | Authenticated users |
| Policies | `/clampbox/policies` | Admins and security owners |
| Gateways | `/clampbox/gateways` | Admins and developers |
| Keys | `/clampbox/keys` | Admins and developers |
| Audit | `/clampbox/audit` | Admins, auditors, security users |
| Settings | `/clampbox/settings` | Organization administrators |
| Extension Popup | Chrome extension | End users |
| Extension Settings | Chrome extension | End users and administrators |
| Backend APIs | Graphxy Labs backend | Frontend, extension, and application clients |

## 6. Architecture Overview

### 6.1 System Boundary

Clampbox is implemented as product modules inside the Graphxy Labs codebase and deployment model.

```text
Graphxy Labs
|
+-- Website
|   |
|   +-- Main Graphxy Labs pages
|   +-- Product pages
|   +-- Clampbox product page
|   +-- Clampbox waitlist
|
+-- Clampbox
    |
    +-- Dashboard routes
    +-- Browser extension
    +-- Backend services
    +-- Security engine
    +-- Policy engine
    +-- Database schema
```

There is one frontend application. Clampbox uses product-scoped folders, routes, services, components, and shared UI primitives inside that application.

### 6.2 High-Level Runtime Architecture

```text
                       +---------------------------+
                       | Graphxy Labs Frontend     |
                       | React + Vite + Router     |
                       +------------+--------------+
                                    |
                                    | HTTPS
                                    v
                       +---------------------------+
                       | Graphxy Labs Backend      |
                       | Node.js + Express.js      |
                       +------------+--------------+
                                    |
          +-------------------------+--------------------------+
          |                         |                          |
          v                         v                          v
+------------------+      +-------------------+      +-------------------+
| PostgreSQL       |      | Redis             |      | AI Providers      |
| Drizzle ORM      |      | Cache, limits     |      | Provider APIs     |
+------------------+      +-------------------+      +-------------------+
          ^
          |
          | sync, events, policy lookup
          |
+------------------------------+
| Clampbox Browser Extension   |
| Manifest V3 + React + Vite   |
+------------------------------+
```

### 6.3 Request Flow: Browser-Based Prompt Protection

```text
1. User opens a supported AI provider in Chrome.
2. Clampbox content script detects provider page context.
3. User types or pastes a prompt into the provider UI.
4. Extension extracts prompt text before submission.
5. Extension requests local or remote inspection.
6. Security engine classifies content and computes risk.
7. Policy engine returns an action.
8. Extension allows, warns, redacts, or blocks submission.
9. Decision metadata is written to audit logs.
10. User sees a clear outcome in the extension UI or inline prompt guard.
```

### 6.4 Request Flow: Gateway API Protection

```text
1. Application sends provider-style request to Graphxy Labs backend gateway.
2. Backend validates the Clampbox gateway key.
3. Gateway resolves organization, environment, provider, and policy assignment.
4. Prompt payload is normalized into inspectable text units.
5. Regex detection and classification run.
6. Risk scoring produces a severity and score.
7. Policy engine decides allow, redact, block, warn, or log-only.
8. If redaction is required, sensitive spans are replaced.
9. Backend forwards the allowed request to the configured provider.
10. Backend records audit metadata and prompt event details.
11. Response is returned to the caller.
```

### 6.5 Architecture Principles

| Principle | Decision |
|---|---|
| Single frontend | Clampbox is integrated into the existing Graphxy Labs React application |
| Product isolation | Clampbox code is scoped under `clampbox/` folders |
| Clear separation | Frontend, backend, extension, shared UI, and database responsibilities stay separate |
| JavaScript-first | The frontend and extension use JavaScript |
| Provider-agnostic design | Provider-specific adapters sit behind common gateway and inspection interfaces |
| Security by default | Raw sensitive prompt bodies are minimized in storage |
| Explainable controls | Every enforcement action should have a reason a user can understand |
| Buildable Phase 1 | Start with regex, classification rules, policy evaluation, risk scoring, and audit logs |

---

# Part 2: Frontend, Backend, Database, Folder Structure, Routing

## 7. Frontend Architecture

### 7.1 Frontend Stack

Clampbox uses the current Graphxy Labs frontend stack:

- React JS
- Vite
- JavaScript
- React Router
- Tailwind CSS
- Framer Motion

The Clampbox frontend is a product area within the Graphxy Labs frontend. It should inherit existing layout shells, navigation conventions, typography, color tokens, spacing, and motion standards.

### 7.2 Frontend Responsibilities

The frontend is responsible for:

- Public Clampbox product page.
- Waitlist form.
- Authenticated dashboard.
- Policy editor UI.
- Gateway key management UI.
- Provider key management UI.
- Audit log viewer.
- Risk dashboard.
- Vault surface for provider credentials metadata.
- Settings, user profile, and organization pages.
- API calls to the Graphxy Labs backend.
- Client-side state, validation, loading, empty, and error states.

The frontend must not:

- Store provider API secrets in browser storage.
- Perform privileged policy enforcement that can be bypassed by direct API calls.
- Mix backend logic into frontend services.
- Treat the extension as a dashboard replacement.

### 7.3 Product Module Layout

Clampbox frontend code lives under `frontend/src/clampbox/app`.

```text
frontend/
  src/
    clampbox/
      app/
        pages/
        components/
        layouts/
        hooks/
        services/
        utils/
        assets/
        constants/
      extension/
        src/
        assets/
        manifest.json
        package.json
      shared/
        ui/
        hooks/
        utils/
```

### 7.4 Shared UI Strategy

`clampbox/shared/ui` contains product-specific reusable UI components that may be used by the dashboard and extension where appropriate. Shared components should wrap Graphxy Labs design system primitives instead of introducing a competing visual language.

Examples:

- `RiskBadge`
- `PolicyActionBadge`
- `ProviderIcon`
- `DetectionLabel`
- `GatewayStatusPill`
- `AuditDecisionCell`
- `SensitiveSpanPreview`
- `MetricTile`
- `EmptyState`
- `InlineAlert`

## 8. Backend Architecture

### 8.1 Backend Stack

Clampbox uses the Graphxy Labs backend stack:

- Node.js
- Express.js
- PostgreSQL
- Drizzle ORM
- Redis where needed

### 8.2 Backend Responsibilities

The backend is responsible for:

- REST APIs for dashboard, extension, waitlist, policy, gateway, audit, and health.
- Authentication and session validation.
- Organization and role authorization.
- Gateway key validation.
- API key encryption and vault handling.
- Prompt normalization and inspection.
- Secret detection.
- Classification.
- Risk scoring.
- Policy enforcement.
- Redaction.
- Provider routing.
- Audit event writing.
- Rate limiting.
- Extension session registration and policy synchronization.

The backend must not:

- Trust extension-side enforcement as the only control for gateway traffic.
- Return raw provider credentials to the frontend or extension.
- Persist raw prompt content by default.
- Use product-specific routes without organization scoping.

### 8.3 Backend Module Layout

```text
backend/
  src/
    clampbox/
      routes/
      controllers/
      services/
      middleware/
      policies/
      validators/
      utils/
```

### 8.4 Service Boundaries

| Service | Responsibility |
|---|---|
| `inspectionService` | Normalizes and inspects prompt text |
| `secretDetectionService` | Runs regex and structured secret detection |
| `classificationService` | Converts detections into labels and categories |
| `riskScoringService` | Produces risk scores, severity, and reasons |
| `policyEngineService` | Evaluates policies and returns enforcement action |
| `redactionService` | Replaces sensitive spans and records redaction metadata |
| `gatewayService` | Handles gateway requests and provider forwarding |
| `gatewayKeyService` | Issues, hashes, validates, rotates, and revokes gateway keys |
| `providerKeyService` | Stores encrypted provider credentials |
| `auditService` | Writes structured audit records |
| `extensionService` | Manages extension sessions and policy sync |
| `waitlistService` | Captures and manages waitlist entries |
| `organizationService` | Manages organization-scoped operations |

## 9. Database Architecture

### 9.1 Database Stack

Clampbox uses:

- PostgreSQL for durable relational data.
- Drizzle ORM for schema definition, queries, and migrations.
- Redis for short-lived cache, rate limits, and policy synchronization acceleration.

### 9.2 Database Layout

```text
database/
  drizzle/
  schema/
  migrations/
```

### 9.3 Data Model Summary

| Entity | Purpose |
|---|---|
| Users | People who authenticate to Graphxy Labs and Clampbox dashboard |
| Organizations | Tenant boundary for policies, keys, logs, and users |
| Organization Members | User membership and role assignments |
| Gateway Keys | Public-facing keys used by applications or extension sessions |
| API Keys | Encrypted provider credentials and internal API tokens |
| Policies | Rules that decide allowed, warned, redacted, blocked, or logged behavior |
| Policy Assignments | Binding between policies and organizations, users, providers, gateways, or environments |
| Audit Logs | Immutable decision records for security and compliance review |
| Prompt Events | Structured prompt inspection events linked to audit logs |
| Waitlist | Early access and sales demand capture |
| Extension Sessions | Installed extension registrations and sync state |

### 9.4 Relationship Overview

```text
users
  |
  +-- organization_members -- organizations
                                |
                                +-- gateway_keys
                                +-- api_keys
                                +-- policies
                                +-- policy_assignments
                                +-- audit_logs
                                +-- prompt_events
                                +-- extension_sessions

waitlist entries may optionally link to users or organizations after conversion.
```

## 10. Required Folder Structure

### 10.1 Frontend

```text
frontend/
  src/
    clampbox/
      app/
        pages/
          ClampboxProductPage.jsx
          ClampboxDashboardPage.jsx
          ClampboxPoliciesPage.jsx
          ClampboxGatewaysPage.jsx
          ClampboxKeysPage.jsx
          ClampboxAuditPage.jsx
          ClampboxSettingsPage.jsx
          ClampboxWaitlistPage.jsx
        components/
          audit/
          dashboard/
          forms/
          gateway/
          policy/
          risk/
          vault/
        layouts/
          ClampboxDashboardLayout.jsx
          ClampboxPublicLayout.jsx
        hooks/
          useAuditLogs.js
          useClampboxSession.js
          useGatewayKeys.js
          usePolicies.js
          useRiskMetrics.js
          useWaitlistForm.js
        services/
          auditApi.js
          extensionApi.js
          gatewayApi.js
          keysApi.js
          policiesApi.js
          riskApi.js
          waitlistApi.js
        utils/
          formatAuditDecision.js
          formatRiskScore.js
          providerUtils.js
          validation.js
        assets/
        constants/
          clampboxRoutes.js
          providers.js
          policyActions.js
      extension/
        src/
          background/
          content/
          popup/
          settings/
          services/
          storage/
          utils/
        assets/
        manifest.json
        package.json
      shared/
        ui/
        hooks/
        utils/
```

### 10.2 Backend

```text
backend/
  src/
    clampbox/
      routes/
        audit.routes.js
        extension.routes.js
        gateway.routes.js
        health.routes.js
        keys.routes.js
        policies.routes.js
        risk.routes.js
        settings.routes.js
        waitlist.routes.js
      controllers/
        audit.controller.js
        extension.controller.js
        gateway.controller.js
        keys.controller.js
        policies.controller.js
        risk.controller.js
        settings.controller.js
        waitlist.controller.js
      services/
        audit.service.js
        classification.service.js
        extension.service.js
        gateway.service.js
        gatewayKey.service.js
        inspection.service.js
        policyEngine.service.js
        providerKey.service.js
        redaction.service.js
        riskScoring.service.js
        secretDetection.service.js
        waitlist.service.js
      middleware/
        requireAuth.js
        requireClampboxOrg.js
        requireGatewayKey.js
        requireRole.js
        rateLimit.js
        validateRequest.js
      policies/
        defaultPolicies.js
        policyEvaluator.js
        policyTypes.js
      validators/
        audit.validators.js
        extension.validators.js
        gateway.validators.js
        key.validators.js
        policy.validators.js
        waitlist.validators.js
      utils/
        crypto.js
        hashing.js
        providerAdapters.js
        requestMetadata.js
        safeJson.js
```

### 10.3 Database

```text
database/
  drizzle/
    drizzle.config.js
  schema/
    clampbox.audit.js
    clampbox.extension.js
    clampbox.keys.js
    clampbox.organizations.js
    clampbox.policies.js
    clampbox.promptEvents.js
    clampbox.users.js
    clampbox.waitlist.js
  migrations/
```

## 11. Routing

Clampbox routes are integrated with React Router inside the Graphxy Labs frontend.

| Route | Purpose | Access |
|---|---|---|
| `/products/clampbox` | Public product page | Public |
| `/clampbox/dashboard` | Dashboard overview | Authenticated |
| `/clampbox/policies` | Policy management | Admin, security, owner |
| `/clampbox/gateways` | Gateway management | Admin, developer, owner |
| `/clampbox/keys` | Gateway and provider keys | Admin, developer, owner |
| `/clampbox/audit` | Audit logs | Admin, auditor, security, owner |
| `/clampbox/settings` | Product and organization settings | Admin, owner |
| `/clampbox/waitlist` | Waitlist capture | Public |

### 11.1 Route Configuration Example

```jsx
import { Routes, Route } from "react-router-dom";
import ClampboxProductPage from "./clampbox/app/pages/ClampboxProductPage";
import ClampboxDashboardPage from "./clampbox/app/pages/ClampboxDashboardPage";
import ClampboxPoliciesPage from "./clampbox/app/pages/ClampboxPoliciesPage";
import ClampboxGatewaysPage from "./clampbox/app/pages/ClampboxGatewaysPage";
import ClampboxKeysPage from "./clampbox/app/pages/ClampboxKeysPage";
import ClampboxAuditPage from "./clampbox/app/pages/ClampboxAuditPage";
import ClampboxSettingsPage from "./clampbox/app/pages/ClampboxSettingsPage";
import ClampboxWaitlistPage from "./clampbox/app/pages/ClampboxWaitlistPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/products/clampbox" element={<ClampboxProductPage />} />
      <Route path="/clampbox/waitlist" element={<ClampboxWaitlistPage />} />
      <Route path="/clampbox/dashboard" element={<ClampboxDashboardPage />} />
      <Route path="/clampbox/policies" element={<ClampboxPoliciesPage />} />
      <Route path="/clampbox/gateways" element={<ClampboxGatewaysPage />} />
      <Route path="/clampbox/keys" element={<ClampboxKeysPage />} />
      <Route path="/clampbox/audit" element={<ClampboxAuditPage />} />
      <Route path="/clampbox/settings" element={<ClampboxSettingsPage />} />
    </Routes>
  );
}
```

## 12. Public Product Page

The Clampbox product page is part of the Graphxy Labs website. It should present Clampbox as a Graphxy Labs product, not as an isolated brand with its own separate web presence.

### 12.1 Page Goals

- Explain the security problem clearly.
- Show where Clampbox sits in the AI interaction path.
- Describe prompt inspection, policy enforcement, redaction, risk scoring, browser extension, and audit logging.
- Capture waitlist demand.
- Route qualified users toward dashboard access when available.

### 12.2 Page Sections

| Section | Content |
|---|---|
| Hero | Clampbox as the AI Security Gateway by Graphxy Labs |
| Problem | AI tools receive sensitive data without governance |
| Flow Diagram | User to extension to security engine to policy to provider |
| Capabilities | Prompt inspection, secret detection, policies, redaction, audit |
| Browser Extension | Chrome extension protection for web AI tools |
| Dashboard | Admin control plane for policies, gateways, risk, audit |
| Enterprise | Governance, audit, organization controls, future SSO |
| Waitlist CTA | Early access capture |

---

# Part 3: Dashboard, Browser Extension, Security Engine

## 13. Dashboard

The Clampbox dashboard is a professional SaaS control plane for security, governance, and operational visibility.

### 13.1 Dashboard Principles

- Make risk visible without making the interface noisy.
- Explain policy decisions in plain language.
- Keep tables dense but readable.
- Make administration tasks fast.
- Surface incomplete setup steps clearly.
- Avoid burying audit evidence behind decorative UI.
- Support responsive layouts for tablets and smaller laptops, while prioritizing desktop workflows.

### 13.2 Dashboard Information Architecture

```text
Clampbox Dashboard
|
+-- Overview
+-- Gateway Keys
+-- Policy Management
+-- Audit Logs
+-- Risk Dashboard
+-- Vault
+-- Settings
+-- User Profile
+-- Organization
+-- Future Integrations
```

### 13.3 Overview

The overview page gives administrators an operational snapshot.

Key widgets:

| Widget | Description |
|---|---|
| Requests Today | Count of inspected prompts and gateway requests |
| Block Rate | Percentage of requests blocked by policy |
| Redaction Rate | Percentage of requests modified before submission |
| High Risk Events | Count of events above configured risk threshold |
| Active Providers | Providers observed in extension or gateway traffic |
| Active Gateways | Gateway keys used in the selected period |
| Policy Coverage | Percentage of active users, providers, and gateways with assigned policies |
| Extension Health | Installed, active, stale, and outdated extension sessions |

### 13.4 Gateway Keys

Gateway keys are organization-scoped credentials issued by Clampbox. Applications use these keys to call the Graphxy Labs backend gateway.

The UI must support:

- Create key.
- Name key.
- Assign provider.
- Assign environment such as development, staging, production.
- Assign policy set.
- Rotate key.
- Revoke key.
- View last used timestamp.
- View request count.
- View risk and block trend.

Raw keys are shown once at creation. After that, only metadata and a fingerprint are visible.

### 13.5 Policy Management

The policy UI supports creating and managing enforcement rules.

Policy editor requirements:

- Policy name and description.
- Scope: organization, provider, gateway, user group, extension, environment.
- Conditions: detection type, risk score, provider, route, source, user role.
- Action: allow, warn, redact, block, require review, log-only.
- Redaction strategy where applicable.
- Priority.
- Enabled or disabled state.
- Test prompt panel for simulation.
- Change history in future phases.

### 13.6 Audit Logs

Audit logs provide structured evidence of inspected interactions and enforcement decisions.

Table columns:

| Column | Description |
|---|---|
| Time | Event timestamp |
| Organization | Tenant boundary |
| User | User or service identity |
| Source | Extension, gateway, dashboard test, or system |
| Provider | ChatGPT, Claude, Gemini, Grok, Perplexity, or other |
| Action | Allow, warn, redact, block, log-only |
| Risk | Numeric score and severity |
| Labels | Detection and classification labels |
| Policy | Policy that produced the decision |
| Request Hash | Hash of prompt content or canonical request body |
| Status | Success, blocked, failed, or degraded |

Audit log details should show decision rationale, redaction count, matched detection labels, policy evaluation path, request metadata, extension version, and gateway key fingerprint. Raw prompt bodies should not be shown by default.

### 13.7 Risk Dashboard

The risk dashboard helps security teams understand trends.

Views:

- Risk by provider.
- Risk by department or organization group.
- Risk by detection label.
- Top blocked policies.
- Redaction volume over time.
- Secret exposure attempts.
- Extension coverage.
- Gateway coverage.
- High risk users or service accounts.
- Policy simulation results in future phases.

### 13.8 Vault

The vault is the administrative surface for provider credentials and internal API tokens.

It must show:

- Provider.
- Label.
- Environment.
- Created by.
- Created at.
- Last used.
- Rotation due date.
- Status.

It must never show the plaintext provider key after save.

### 13.9 Settings, User Profile, Organization

Settings areas include:

- Organization profile.
- Default provider policy.
- Extension policy sync interval.
- Audit retention.
- Risk thresholds.
- Allowed providers.
- Blocked providers.
- Redaction defaults.
- User profile.
- Organization members.
- Roles and permissions in future phases.

### 13.10 Future Integrations

The dashboard reserves space for:

- SIEM export.
- Slack or email notifications.
- Cloud storage connectors.
- Identity provider sync.
- Ticketing systems.
- Data catalog integrations.
- Endpoint management integrations.

## 14. Browser Extension

The Clampbox browser extension is the primary mechanism for protecting web-based AI usage.

### 14.1 Extension Goals

- Detect supported AI provider pages.
- Observe prompt input areas.
- Intercept submission attempts.
- Inspect prompt text before submission.
- Enforce policies locally or through the backend.
- Redact prompt text when policy allows safe continuation.
- Block submission when required.
- Show clear feedback to the user.
- Sync policies from the backend.
- Record audit events.

### 14.2 Extension Architecture

```text
Chrome Extension
|
+-- manifest.json
+-- background service worker
+-- content scripts
+-- popup UI
+-- settings UI
+-- extension storage
+-- Clampbox API client
+-- provider adapters
+-- local inspection helpers
```

### 14.3 Manifest V3

The extension uses Manifest V3.

Key responsibilities:

| Component | Responsibility |
|---|---|
| Background Service Worker | Session registration, policy sync, API communication, message routing |
| Content Scripts | DOM monitoring, prompt extraction, submission interception, inline user feedback |
| Popup UI | Status, provider detection, active policy, quick controls |
| Settings UI | Organization connection, sync status, user preferences |
| Storage | Cached policy bundle, session metadata, user settings |

### 14.4 Prompt Interception

Prompt interception is provider-specific. Each provider adapter should define:

- URL match patterns.
- DOM selectors for prompt input.
- Submission button selectors.
- Keyboard submission behavior.
- Method for reading prompt text.
- Method for replacing prompt text after redaction.
- Method for showing inline notices.
- Known limitations.

The extension should not assume that provider DOM structures are stable. Adapters must be versioned and monitored.

### 14.5 DOM Monitoring

Content scripts use DOM observation to detect prompt input fields and provider UI changes.

Requirements:

- Use efficient observers and debounce expensive work.
- Avoid scanning entire pages continuously.
- Prefer scoped observation after provider root is located.
- Handle single-page application navigation.
- Re-bind handlers when the provider UI re-renders.
- Fail closed or warn when prompt controls cannot be reliably identified, depending on organization policy.

### 14.6 Policy Synchronization

The extension syncs policies from the backend.

Sync inputs:

- Organization ID.
- User ID.
- Extension session ID.
- Extension version.
- Provider domain.
- Policy bundle version.

Sync outputs:

- Applicable policy rules.
- Detection patterns allowed for local execution.
- Redaction rules.
- Provider allowlist or blocklist.
- Minimum extension version.
- Audit sampling settings.
- Offline behavior.

### 14.7 Popup UI

The popup UI should show:

- Connected organization.
- Current provider detection.
- Protection status.
- Active policy summary.
- Last sync time.
- Recent decision.
- Extension version.
- Link to dashboard.
- Settings entry point.

The popup should be operational, not decorative.

### 14.8 Settings UI

Settings should include:

- Sign in or connect organization.
- Sync status.
- Extension session status.
- Provider permissions.
- Local cache status.
- Diagnostics export.
- User preference for local warnings where organization policy permits.

Administrative controls remain in the dashboard.

### 14.9 Gateway Communication

The extension communicates with the backend for:

- Session registration.
- Policy bundle sync.
- Remote inspection when required.
- Audit event submission.
- Extension health reporting.
- Update checks.

The extension should use short-lived session credentials or signed extension session tokens. It must not store provider API keys.

### 14.10 Dashboard Communication

The dashboard surfaces extension state:

- Installed sessions.
- Active users.
- Last seen timestamp.
- Extension version.
- Policy bundle version.
- Providers observed.
- Recent enforcement actions.
- Outdated sessions.
- Unhealthy sync states.

### 14.11 Extension Security Considerations

Security requirements:

- Do not store provider credentials.
- Do not persist raw prompt content unless explicitly configured for a controlled enterprise deployment.
- Minimize permissions.
- Use host permissions only for supported provider domains.
- Validate messages between content scripts and background worker.
- Sanitize any prompt previews shown in UI.
- Encrypt or protect local session material where browser APIs allow.
- Rotate extension session tokens.
- Allow administrators to revoke sessions.
- Record extension version in audit events.

### 14.12 Build Process

The extension uses Vite and React JS.

Build outputs:

- `manifest.json`
- background service worker bundle
- content script bundle
- popup bundle
- settings page bundle
- assets

The extension package should be generated as a zip artifact for store submission and internal testing.

### 14.13 Packaging And Distribution

Phase 1 distribution:

- Developer build for internal testing.
- Signed package for early design partners.
- Chrome Web Store submission when policy and UX are stable.

Future distribution:

- Managed enterprise deployment.
- Organization policy templates for browser management.
- Firefox support after Chrome provider adapters stabilize.

## 15. Security Engine

The security engine is the core backend subsystem that turns prompt text into an enforcement decision.

### 15.1 Phase 1 Subsystems

```text
Prompt Input
  |
  v
Prompt Inspection
  |
  v
Regex Detection
  |
  v
Classification Engine
  |
  v
Risk Scoring
  |
  v
Policy Engine
  |
  v
Gateway Assignment
  |
  v
Enforcement
  |
  v
Audit Logging
```

### 15.2 Regex Detection

Regex detection identifies known sensitive patterns:

- API keys.
- Access tokens.
- Private key headers.
- Password assignment patterns.
- Email addresses.
- Phone numbers.
- Credit card-like numbers.
- Social security number-like patterns.
- IP addresses.
- Database connection strings.
- Cloud credentials.
- OAuth tokens.
- Internal ticket or customer identifiers where configured.

Regex patterns must return:

- Detection type.
- Matched span offsets.
- Confidence.
- Severity.
- Detector version.
- Redaction strategy.

### 15.3 Classification Engine

The classification engine converts raw detections into higher-level labels:

| Detection | Classification |
|---|---|
| `aws_access_key_id` | `cloud_credential` |
| `bearer_token` | `secret` |
| `email_address` | `personal_data` |
| `credit_card_candidate` | `payment_data` |
| `private_key_block` | `cryptographic_secret` |
| `source_code` | `intellectual_property` |
| `database_url` | `infrastructure_secret` |

Classification makes policies easier to manage. Administrators should not need to write a rule for every low-level detector.

### 15.4 Risk Scoring

Risk scoring assigns a numeric score and severity.

Inputs:

- Detection type.
- Confidence.
- Count.
- Provider.
- User role.
- Organization policy.
- Gateway environment.
- Prompt length.
- Redaction feasibility.
- Historical false positive overrides in future phases.

Example scale:

| Score | Severity | Meaning |
|---:|---|---|
| 0-19 | Low | Routine prompt, no sensitive indicators |
| 20-49 | Medium | Potential sensitive content or low-confidence match |
| 50-79 | High | Strong match for regulated or confidential content |
| 80-100 | Critical | Secret, credential, private key, or policy-prohibited content |

### 15.5 Policy Engine

The policy engine evaluates applicable policies in priority order.

Policy output:

```json
{
  "action": "redact",
  "policyId": "pol_01HZXAMPLE",
  "reason": "Cloud credential detected in prompt",
  "severity": "critical",
  "riskScore": 92,
  "redactionRequired": true,
  "auditRequired": true
}
```

Actions:

- `allow`
- `warn`
- `redact`
- `block`
- `require_review`
- `log_only`

### 15.6 Gateway Assignment

Gateway assignment maps traffic to an enforcement context.

Inputs:

- Gateway key.
- Organization.
- Provider.
- Environment.
- User or service identity.
- Source application.
- Assigned policies.

The assignment result determines which policies run and what provider credentials are used.

### 15.7 Prompt Inspection

Prompt inspection normalizes provider-specific payloads into text units.

Examples:

- Chat message content.
- User prompt fields.
- System prompt fields where applicable.
- Tool input payloads.
- File metadata where supported.
- Browser text area content.

Prompt inspection should preserve enough structure to explain policy decisions without storing raw prompt bodies by default.

### 15.8 Audit Logging

Audit logging records:

- Who initiated the request.
- What provider was targeted.
- Which gateway or extension session was used.
- What policy was evaluated.
- What action was taken.
- Which labels were detected.
- What risk score was produced.
- Whether redaction occurred.
- Whether the provider request was sent.
- Whether the final operation succeeded.

---

# Part 4: Policies, Gateway, Risk Engine, Audit

## 16. Policy Model

Policies define how Clampbox responds to detected risk.

### 16.1 Policy Object

```json
{
  "id": "pol_01HZXAMPLE",
  "name": "Block secrets in public AI tools",
  "description": "Blocks prompts containing credentials in browser-based AI sessions.",
  "enabled": true,
  "priority": 10,
  "scope": {
    "organizationId": "org_01HZXAMPLE",
    "sources": ["extension"],
    "providers": ["chatgpt", "claude", "gemini", "grok", "perplexity"]
  },
  "conditions": {
    "classifications": ["secret", "cloud_credential", "cryptographic_secret"],
    "minimumRiskScore": 70
  },
  "action": "block",
  "redaction": null,
  "audit": {
    "required": true,
    "includeDetections": true
  }
}
```

### 16.2 Policy Evaluation Order

Policies are evaluated by:

1. Organization.
2. Enabled state.
3. Scope match.
4. Priority.
5. Conditions.
6. Action.

The first decisive policy should win unless the policy is explicitly marked as additive. This keeps behavior predictable.

### 16.3 Policy Actions

| Action | Behavior |
|---|---|
| Allow | Request continues without modification |
| Warn | User sees warning; action may continue depending on source |
| Redact | Sensitive spans are replaced before submission or forwarding |
| Block | Request is stopped |
| Require Review | Request is queued or held for approval in future workflows |
| Log Only | Request continues and audit evidence is recorded |

### 16.4 Default Policies

Phase 1 should ship with default policy templates:

| Template | Default Action |
|---|---|
| Block private keys | Block |
| Block cloud credentials | Block |
| Redact email addresses | Redact |
| Redact phone numbers | Redact |
| Warn on source code paste | Warn |
| Log all high risk prompts | Log only |
| Block production gateway secrets | Block |

## 17. Gateway Management

Gateway management controls application-level AI traffic.

### 17.1 Gateway Key Lifecycle

```text
Create -> Show Once -> Store Hash -> Assign Policy -> Use -> Rotate -> Revoke
```

Requirements:

- Keys are generated with strong randomness.
- Only a hash is stored.
- Plaintext key is shown once.
- Each key belongs to one organization.
- Keys can be scoped to provider and environment.
- Keys can be assigned policy bundles.
- Revoked keys fail immediately.
- Last used metadata is tracked.

### 17.2 Gateway Providers

Clampbox supports a provider adapter pattern:

| Provider | Adapter Responsibilities |
|---|---|
| ChatGPT | Normalize chat payloads, route to configured provider API, handle streaming where supported |
| Claude | Normalize messages and system prompts, route with provider-specific headers |
| Gemini | Normalize content parts and model paths |
| Grok | Add provider adapter when stable gateway requirements are defined |
| Perplexity | Add provider adapter for chat and search-augmented flows |
| Future providers | Implement adapter contract |

### 17.3 Gateway Decision Flow

```text
Incoming request
  |
  v
Validate gateway key
  |
  v
Resolve organization and provider
  |
  v
Load policy assignments
  |
  v
Normalize prompt payload
  |
  v
Inspect and classify
  |
  v
Score risk
  |
  v
Evaluate policy
  |
  +-- block -> write audit -> return policy response
  |
  +-- redact -> rewrite payload -> forward -> write audit -> return response
  |
  +-- allow -> forward -> write audit -> return response
```

### 17.4 Gateway API Example

```http
POST /api/clampbox/v1/gateway/chatgpt/chat/completions HTTP/1.1
Host: api.graphxylabs.dev
Authorization: Bearer cb_live_example
Content-Type: application/json

{
  "model": "example-model",
  "messages": [
    {
      "role": "user",
      "content": "Summarize this support ticket: ..."
    }
  ]
}
```

Blocked response:

```json
{
  "error": {
    "code": "CLAMPBOX_POLICY_BLOCKED",
    "message": "This prompt was blocked by organization policy.",
    "decisionId": "aud_01HZXAMPLE",
    "riskScore": 94,
    "labels": ["secret", "cloud_credential"]
  }
}
```

## 18. Risk Engine

### 18.1 Risk Inputs

The risk engine combines:

- Detector severity.
- Detector confidence.
- Number of matches.
- Classification category.
- Provider sensitivity.
- Source context.
- User role.
- Gateway environment.
- Policy sensitivity.
- Redaction feasibility.

### 18.2 Scoring Formula, Phase 1

Phase 1 should use a simple weighted model:

```text
riskScore =
  maxDetectorScore
  + classificationWeight
  + sourceWeight
  + environmentWeight
  + providerWeight
  + countWeight
  - redactionReduction
```

Clamp the score between 0 and 100.

### 18.3 Severity Mapping

| Severity | Score Range | Default UI Color |
|---|---:|---|
| Low | 0-19 | Neutral |
| Medium | 20-49 | Amber |
| High | 50-79 | Orange or Red |
| Critical | 80-100 | Red |

### 18.4 Risk Explanation

Every score should include reasons:

```json
{
  "score": 92,
  "severity": "critical",
  "reasons": [
    "Private key block detected",
    "Prompt source is browser extension",
    "Provider is external",
    "Organization policy blocks cryptographic secrets"
  ]
}
```

## 19. Audit

### 19.1 Audit Principles

- Write audit records for every enforcement decision.
- Store metadata and hashes by default.
- Avoid storing raw sensitive prompt bodies.
- Make audit records queryable by organization, provider, user, action, policy, and risk.
- Support retention controls.
- Prepare for export integrations.

### 19.2 Audit Event Types

| Event Type | Description |
|---|---|
| `prompt_inspected` | Prompt content was inspected |
| `policy_allowed` | Prompt passed policy |
| `policy_warned` | User was warned |
| `policy_redacted` | Prompt was modified |
| `policy_blocked` | Prompt was blocked |
| `gateway_key_created` | Gateway key created |
| `gateway_key_rotated` | Gateway key rotated |
| `gateway_key_revoked` | Gateway key revoked |
| `policy_created` | Policy created |
| `policy_updated` | Policy updated |
| `extension_registered` | Extension session registered |
| `extension_policy_synced` | Extension synced policy |

### 19.3 Audit Record Example

```json
{
  "id": "aud_01HZXAMPLE",
  "organizationId": "org_01HZXAMPLE",
  "userId": "usr_01HZXAMPLE",
  "source": "extension",
  "provider": "chatgpt",
  "eventType": "policy_blocked",
  "action": "block",
  "riskScore": 94,
  "severity": "critical",
  "labels": ["secret", "cloud_credential"],
  "policyId": "pol_01HZXAMPLE",
  "requestHash": "sha256:example",
  "redactionCount": 0,
  "createdAt": "2026-06-25T00:00:00.000Z"
}
```

---

# Part 5: API Design, Database Schema, Authentication

## 20. REST API Design

Clampbox APIs are served by the Graphxy Labs backend.

Base path:

```text
/api/clampbox/v1
```

### 20.1 API Groups

| Group | Path |
|---|---|
| Health | `/health` |
| Waitlist | `/waitlist` |
| Dashboard Overview | `/overview` |
| Policies | `/policies` |
| Gateway Keys | `/gateway-keys` |
| Provider Keys | `/provider-keys` |
| Gateway | `/gateway/:provider/*` |
| Audit | `/audit-logs` |
| Prompt Events | `/prompt-events` |
| Extension | `/extension/*` |
| Risk | `/risk/*` |
| Settings | `/settings` |

## 21. API Examples

### 21.1 Waitlist

```http
POST /api/clampbox/v1/waitlist
Content-Type: application/json

{
  "email": "security@example.com",
  "name": "Avery Chen",
  "company": "Example Co",
  "role": "Security Engineering",
  "teamSize": "51-200",
  "useCase": "We need browser governance for AI tools."
}
```

### 21.2 Create Policy

```http
POST /api/clampbox/v1/policies
Authorization: Bearer session_token
Content-Type: application/json

{
  "name": "Redact personal data",
  "description": "Redact common personal data before provider submission.",
  "enabled": true,
  "priority": 50,
  "conditions": {
    "classifications": ["personal_data"],
    "minimumRiskScore": 20
  },
  "action": "redact"
}
```

### 21.3 Register Extension Session

```http
POST /api/clampbox/v1/extension/sessions
Authorization: Bearer session_token
Content-Type: application/json

{
  "extensionVersion": "1.0.0",
  "browser": "chrome",
  "installationId": "ext_install_01HZXAMPLE",
  "platform": "windows"
}
```

### 21.4 Sync Extension Policy

```http
POST /api/clampbox/v1/extension/policy-sync
Authorization: Bearer extension_session_token
Content-Type: application/json

{
  "policyBundleVersion": "2026.06.25.1",
  "providers": ["chatgpt", "claude"]
}
```

### 21.5 Inspect Prompt

```http
POST /api/clampbox/v1/risk/inspect
Authorization: Bearer session_token
Content-Type: application/json

{
  "source": "dashboard_test",
  "provider": "chatgpt",
  "text": "Please review this configuration: password=example"
}
```

## 22. Authentication

### 22.1 Auth Contexts

Clampbox uses multiple authentication contexts:

| Context | Used By | Credential |
|---|---|---|
| User session | Dashboard and waitlist conversion | Graphxy Labs session token |
| Extension session | Browser extension | Extension session token |
| Gateway key | Application gateway requests | Clampbox gateway key |
| Internal service | Background jobs and future workers | Internal service token |

### 22.2 User Authentication

User authentication belongs to the Graphxy Labs platform. Clampbox consumes the authenticated user context and applies Clampbox-specific organization and role checks.

The backend middleware should resolve:

- User ID.
- Active organization ID.
- Organization role.
- Clampbox product access.
- Permission set.

### 22.3 Authorization

Role model, Phase 1:

| Role | Permissions |
|---|---|
| Owner | Full organization and billing control |
| Admin | Manage policies, keys, members, settings |
| Security | Manage policies and audit workflows |
| Developer | Manage gateway keys and view own integration activity |
| Auditor | Read audit logs and reports |
| Member | Use extension and view limited personal status |

### 22.4 Gateway Key Authentication

Gateway keys authenticate application traffic. They must be:

- Randomly generated.
- Prefix-labeled for environment and display.
- Hashed before storage.
- Revocable.
- Scoped.
- Rate limited.

### 22.5 Extension Session Authentication

Extension sessions authenticate installed browser extensions.

Flow:

1. User signs into Graphxy Labs.
2. Extension requests registration.
3. Backend creates an extension session.
4. Extension receives a session token.
5. Extension uses token for policy sync and audit events.
6. Admin can revoke session.

## 23. Database Schema

The following schemas describe the required model. Exact Drizzle definitions may differ in syntax, but should preserve these fields and relationships.

### 23.1 Users

```text
users
  id uuid primary key
  email text unique not null
  name text
  avatar_url text
  created_at timestamp not null
  updated_at timestamp not null
```

### 23.2 Organizations

```text
organizations
  id uuid primary key
  name text not null
  slug text unique not null
  plan text not null default 'free'
  clampbox_enabled boolean not null default false
  created_at timestamp not null
  updated_at timestamp not null
```

### 23.3 Organization Members

```text
organization_members
  id uuid primary key
  organization_id uuid not null references organizations(id)
  user_id uuid not null references users(id)
  role text not null
  status text not null default 'active'
  created_at timestamp not null
  updated_at timestamp not null
```

### 23.4 Gateway Keys

```text
gateway_keys
  id uuid primary key
  organization_id uuid not null references organizations(id)
  name text not null
  key_hash text not null unique
  key_fingerprint text not null
  provider text
  environment text not null default 'production'
  status text not null default 'active'
  last_used_at timestamp
  created_by uuid references users(id)
  created_at timestamp not null
  revoked_at timestamp
```

### 23.5 Policies

```text
policies
  id uuid primary key
  organization_id uuid not null references organizations(id)
  name text not null
  description text
  enabled boolean not null default true
  priority integer not null default 100
  conditions jsonb not null
  action text not null
  redaction jsonb
  created_by uuid references users(id)
  created_at timestamp not null
  updated_at timestamp not null
```

### 23.6 Policy Assignments

```text
policy_assignments
  id uuid primary key
  organization_id uuid not null references organizations(id)
  policy_id uuid not null references policies(id)
  gateway_key_id uuid references gateway_keys(id)
  provider text
  source text
  environment text
  user_id uuid references users(id)
  enabled boolean not null default true
  created_at timestamp not null
```

### 23.7 API Keys

```text
api_keys
  id uuid primary key
  organization_id uuid not null references organizations(id)
  provider text not null
  label text not null
  encrypted_key text not null
  key_fingerprint text not null
  environment text not null default 'production'
  status text not null default 'active'
  last_used_at timestamp
  rotation_due_at timestamp
  created_by uuid references users(id)
  created_at timestamp not null
  revoked_at timestamp
```

### 23.8 Audit Logs

```text
audit_logs
  id uuid primary key
  organization_id uuid not null references organizations(id)
  user_id uuid references users(id)
  gateway_key_id uuid references gateway_keys(id)
  extension_session_id uuid
  event_type text not null
  source text not null
  provider text
  action text
  status text not null
  risk_score integer
  severity text
  labels jsonb
  policy_id uuid references policies(id)
  request_hash text
  response_hash text
  metadata jsonb
  created_at timestamp not null
```

### 23.9 Prompt Events

```text
prompt_events
  id uuid primary key
  organization_id uuid not null references organizations(id)
  audit_log_id uuid references audit_logs(id)
  source text not null
  provider text
  prompt_hash text not null
  prompt_length integer
  detection_count integer not null default 0
  detections jsonb
  classifications jsonb
  redaction_count integer not null default 0
  decision text not null
  created_at timestamp not null
```

### 23.10 Waitlist

```text
waitlist
  id uuid primary key
  email text not null
  name text
  company text
  role text
  team_size text
  use_case text
  source text
  status text not null default 'new'
  created_at timestamp not null
  updated_at timestamp not null
```

### 23.11 Extension Sessions

```text
extension_sessions
  id uuid primary key
  organization_id uuid not null references organizations(id)
  user_id uuid not null references users(id)
  installation_id text not null
  extension_version text not null
  browser text not null
  platform text
  status text not null default 'active'
  policy_bundle_version text
  last_seen_at timestamp
  created_at timestamp not null
  revoked_at timestamp
```

---

# Part 6: UI/UX, Design System, Motion System

## 24. UI/UX Direction

Clampbox inherits the Graphxy Labs design system. It should feel like a serious security and infrastructure product inside the Graphxy Labs ecosystem.

### 24.1 Tone

The interface should be:

- Calm.
- Precise.
- Dense enough for professional use.
- Clear about risk.
- Direct about blocked or redacted content.
- Helpful without being chatty.

### 24.2 Typography

Use the existing Graphxy Labs typography scale.

Guidelines:

- Product pages may use larger display headings.
- Dashboard headings should be compact.
- Tables should prioritize readability.
- Labels should be short and consistent.
- Monospace text should be used for keys, hashes, IDs, and provider routes.

### 24.3 Spacing And Grid

Dashboard layouts should use:

- A fixed sidebar on desktop.
- Top bar for organization switcher, profile, and important status.
- Responsive grid for metrics.
- Full-width table regions.
- Compact filters.
- No nested card stacks.

### 24.4 Cards

Cards are appropriate for:

- Metric tiles.
- Individual setup tasks.
- Repeated integration items.
- Policy templates.
- Modal content.

Cards should not be used to wrap entire page sections.

### 24.5 Buttons

Button hierarchy:

| Type | Use |
|---|---|
| Primary | Create policy, create key, save settings |
| Secondary | Cancel, test policy, view details |
| Destructive | Revoke key, delete policy, block provider |
| Ghost | Table row actions and toolbar controls |
| Icon | Compact actions such as copy, rotate, filter, refresh |

### 24.6 Motion And Animations

Use Framer Motion for subtle state transitions:

- Page transitions.
- Drawer open and close.
- Modal transitions.
- Row expansion.
- Risk trend reveal.
- Toast entrance.

Motion should be functional and restrained. Do not animate critical security feedback in a way that delays understanding.

### 24.7 Sidebar

Sidebar items:

- Overview
- Policies
- Gateways
- Keys
- Audit
- Risk
- Vault
- Settings

The active route should be obvious. Navigation should remain stable across product pages.

### 24.8 Tables

Tables are central to the dashboard.

Requirements:

- Sort.
- Filter.
- Search.
- Pagination.
- Column visibility in later phases.
- Empty states.
- Loading states.
- Row detail drawer.
- Export in future phases.

### 24.9 Charts

Charts should answer operational questions:

- Are high risk events increasing?
- Which providers produce the most blocks?
- Which policies fire most often?
- Which users or gateway keys need review?
- Is extension coverage improving?

Use restrained colors and clear legends.

### 24.10 Forms

Forms should include:

- Inline validation.
- Clear helper text.
- Save states.
- Error states.
- Dirty state warning where needed.
- Test panels for policies.
- Confirmation for destructive actions.

### 24.11 Badges And Status Colors

| Status | Color Intent |
|---|---|
| Active | Green |
| Warning | Amber |
| Blocked | Red |
| Redacted | Orange |
| Log Only | Neutral |
| Disabled | Muted |
| Stale | Amber |
| Revoked | Muted red |

### 24.12 Dark Mode

Clampbox should support the existing Graphxy Labs dark mode behavior.

Security-specific requirements:

- Risk colors must remain distinguishable.
- Tables must preserve row separation.
- Code and hash values must be readable.
- Form controls must maintain contrast.
- Disabled states must not look active.

### 24.13 Accessibility

Requirements:

- Keyboard navigation for dashboard controls.
- Accessible labels for icon buttons.
- Focus states.
- Color is not the only signal for risk.
- Tables expose readable text values.
- Dialogs trap focus correctly.
- Extension popup is navigable by keyboard.

### 24.14 Responsive Behavior

Desktop is the primary dashboard target. Responsive support still matters.

Responsive rules:

- Sidebar collapses to drawer on smaller screens.
- Metric grids collapse cleanly.
- Tables switch to horizontal scroll or compact list views.
- Forms remain readable.
- Product page and waitlist are fully mobile friendly.
- Extension popup uses fixed dimensions appropriate for browser extension UI.

---

# Part 7: Deployment, Roadmap, Business Model

## 25. Deployment

Clampbox uses the Graphxy Labs deployment model.

### 25.1 Deployment Components

| Component | Deployment |
|---|---|
| Graphxy Labs Frontend | One Vercel frontend deployment |
| Graphxy Labs Backend | Node.js Express hosting |
| PostgreSQL | Managed database |
| Redis | Managed cache |
| Browser Extension | Chrome Web Store and internal package artifacts |
| CI/CD | GitHub-based workflows |

### 25.2 Environment Variables

Frontend:

```text
VITE_GRAPHXY_API_BASE_URL
VITE_CLAMPBOX_EXTENSION_ID
VITE_CLAMPBOX_ENABLE_WAITLIST
VITE_CLAMPBOX_ENABLE_DASHBOARD
```

Backend:

```text
DATABASE_URL
REDIS_URL
CLAMPBOX_ENCRYPTION_KEY
CLAMPBOX_GATEWAY_KEY_PEPPER
CLAMPBOX_SESSION_SECRET
CLAMPBOX_ALLOWED_ORIGINS
CLAMPBOX_AUDIT_RETENTION_DAYS
CLAMPBOX_RATE_LIMIT_WINDOW_SECONDS
CLAMPBOX_RATE_LIMIT_MAX_REQUESTS
```

Provider credentials are stored per organization in encrypted database records, not as global frontend variables.

### 25.3 CI/CD

GitHub workflows should run:

- Lint.
- Unit tests.
- Backend tests.
- Frontend build.
- Extension build.
- Database migration checks.
- Security scanning where available.
- Artifact upload for extension packages.

### 25.4 Backend Hosting Options

The backend may run on a managed Node.js platform or container hosting provider. Requirements:

- HTTPS.
- Environment variable management.
- Health checks.
- Background worker support in future phases.
- Redis connectivity.
- PostgreSQL connectivity.
- Log streaming.
- Horizontal scaling path.

### 25.5 Database Hosting

PostgreSQL hosting requirements:

- Automated backups.
- Point-in-time restore where available.
- Connection pooling.
- Migration workflow.
- Encryption at rest.
- Region selection aligned to customers where possible.

### 25.6 Redis

Redis uses:

- Rate limits.
- Policy bundle cache.
- Extension session heartbeat cache.
- Short-lived gateway lookup cache.
- Future async job coordination.

Redis must not be the system of record for audit or policy data.

### 25.7 Extension Publishing

Publishing process:

1. Build extension package.
2. Run static checks.
3. Test with supported provider pages.
4. Verify permission list.
5. Generate release notes.
6. Submit to Chrome Web Store.
7. Roll out gradually where supported.
8. Monitor extension health and policy sync failures.

## 26. Development Roadmap

### 26.1 Phase 1: Product Website, Dashboard, Extension MVP, Backend APIs

Goals:

- Launch public product page within Graphxy Labs website.
- Capture waitlist demand.
- Build authenticated dashboard shell.
- Implement core backend route structure.
- Implement extension MVP for one or two supported providers.
- Implement regex detection, classification, risk scoring, policy enforcement, redaction, and audit logging.

Deliverables:

| Area | Deliverable |
|---|---|
| Product page | `/products/clampbox` |
| Waitlist | `/clampbox/waitlist` and backend API |
| Dashboard | Overview, navigation, initial metrics |
| Extension | Prompt detection, policy sync, warn/block/redact |
| Backend | REST APIs and core security engine |
| Database | Initial schema and migrations |

### 26.2 Phase 2: Policies, Gateway Keys, Audit, Risk Engine

Goals:

- Complete policy management.
- Complete gateway key lifecycle.
- Add provider key vault.
- Improve audit filtering and detail drawers.
- Expand risk engine configuration.
- Add policy test console.
- Add provider adapters.

Deliverables:

- Policy CRUD and templates.
- Gateway key creation, rotation, revocation.
- Provider credential vault.
- Audit log table with filters.
- Risk dashboard.
- Policy assignment engine.

### 26.3 Phase 3: Organizations, RBAC, Analytics, Enterprise Features

Goals:

- Mature multi-organization support.
- Add role-based access control.
- Improve analytics.
- Add audit export.
- Add enterprise settings.
- Add extension fleet visibility.

Deliverables:

- Organization management.
- Roles and permission checks.
- Audit export.
- Extension session management.
- Analytics dashboards.
- Notification settings.

### 26.4 Phase 4: Cloud Connectors, Desktop App, Firefox Extension, Semantic Detection, Advanced Research

Goals:

- Add cloud data connectors.
- Explore desktop controls for unmanaged workflows.
- Add Firefox extension support.
- Add semantic detection and model-assisted classification.
- Research trusted execution approaches for enterprise customers.

Future research:

- Semantic sensitive data detection.
- LLM classification.
- Confidential computing and TEE integration.
- Provider-side policy hooks where available.
- Data lineage and prompt provenance.

## 27. Business Model

### 27.1 Tiers

| Tier | Audience | Positioning |
|---|---|---|
| Free | Individual developers and small teams | Basic visibility and limited rules |
| Pro | Startups and technical teams | More policies, more audit retention, gateway keys |
| Business | Growing organizations | Team controls, extension management, analytics |
| Enterprise | Regulated and large organizations | Governance, integrations, advanced retention, support |

### 27.2 Example Pricing Direction

Pricing should be validated with customers before publication.

| Tier | Possible Pricing Basis |
|---|---|
| Free | Limited users, limited prompt events, basic policies |
| Pro | Per user per month or usage-based prompt event quota |
| Business | Per organization plus usage tiers |
| Enterprise | Contract pricing based on users, events, retention, and integrations |

### 27.3 Customer Segments

| Segment | Message |
|---|---|
| Developers | Protect AI API usage without rewriting applications |
| Security teams | Get prompt-level visibility and enforcement |
| Compliance teams | Produce audit evidence for AI usage |
| IT teams | Govern browser-based AI tools |
| Founders | Reduce customer security review friction |

### 27.4 Go-To-Market

Initial GTM:

- Graphxy Labs website product page.
- Waitlist.
- Founder-led demos.
- Security engineering content.
- Technical posts about AI prompt governance.
- Design partner program.
- Chrome extension early access.

Sales motion:

1. Capture waitlist.
2. Qualify use case.
3. Offer guided onboarding.
4. Install extension for pilot group.
5. Configure default policies.
6. Review audit evidence after one week.
7. Convert based on risk visibility and governance value.

### 27.5 Competitive Positioning

Clampbox competes by being:

- Prompt-aware.
- Provider-agnostic.
- Practical to deploy.
- Integrated into browser and gateway flows.
- Clear about policy decisions.
- Focused on governance evidence.

---

# Part 8: Appendix, Glossary, Future Work

## 28. Appendix A: Detection Categories

| Category | Examples |
|---|---|
| Secret | API keys, tokens, passwords |
| Cloud Credential | Cloud access keys and service credentials |
| Cryptographic Secret | Private keys, certificates |
| Personal Data | Email, phone, address-like data |
| Payment Data | Credit card-like values |
| Infrastructure | Database URLs, hostnames, internal IPs |
| Source Code | Code blocks, stack traces, repository fragments |
| Business Confidential | Sales data, roadmap, financial planning |
| Regulated Data | Organization-defined regulated content |

## 29. Appendix B: Provider Adapter Contract

```js
export const providerAdapter = {
  id: "chatgpt",
  displayName: "ChatGPT",
  matchUrl(url) {
    return true;
  },
  extractPrompt(context) {
    return {
      text: "",
      metadata: {}
    };
  },
  replacePrompt(context, redactedText) {
    return true;
  },
  showNotice(context, decision) {
    return true;
  }
};
```

## 30. Appendix C: Policy Decision Contract

```json
{
  "decisionId": "dec_01HZXAMPLE",
  "action": "redact",
  "riskScore": 72,
  "severity": "high",
  "labels": ["personal_data"],
  "policyId": "pol_01HZXAMPLE",
  "reason": "Personal data detected and redaction is required.",
  "redactions": [
    {
      "start": 12,
      "end": 28,
      "label": "email_address",
      "replacement": "[REDACTED_EMAIL]"
    }
  ],
  "auditRequired": true
}
```

## 31. Appendix D: Glossary

| Term | Meaning |
|---|---|
| AI Security Gateway | A control layer that inspects and governs AI interactions |
| Audit Log | Structured record of an event or policy decision |
| Classification | Higher-level label derived from detections |
| Detection | A specific match found in prompt content |
| Extension Session | Registered browser extension installation for a user |
| Gateway Key | Clampbox-issued credential used to access gateway APIs |
| Policy | Rule that maps risk and context to an action |
| Policy Assignment | Binding between a policy and a scope |
| Prompt Event | Structured record of an inspected prompt |
| Redaction | Replacement of sensitive spans with safe placeholders |
| Risk Score | Numeric estimate of the sensitivity and danger of an interaction |
| Vault | Encrypted storage and management surface for provider credentials |

## 32. Appendix E: Future Enterprise Features

Future enterprise capabilities:

- SSO.
- SCIM.
- Advanced RBAC.
- Department-level policy inheritance.
- Policy approvals.
- Audit export.
- SIEM integrations.
- Slack notifications.
- Email digests.
- Data residency controls.
- Custom detectors.
- Custom redaction templates.
- Managed extension deployment reports.
- Cloud storage scanning.
- Ticketing integration.
- Legal hold.
- Immutable audit storage.
- Enterprise support workflows.

## 33. Appendix F: Future Research

### 33.1 Semantic Detection

Regex detection is effective for structured secrets and common patterns, but it cannot understand all sensitive intent. Future semantic detection can classify prompts that reveal confidential strategies, customer information, or internal context without obvious patterns.

### 33.2 LLM Classification

LLM classification may be used as an optional secondary classifier for enterprise customers. It must be designed carefully to avoid sending sensitive content to an external classifier without governance. Self-hosted or privacy-preserving classification may be required for some customers.

### 33.3 TEE Integration

Trusted execution environments are a future research path for customers that require strong assurances about inspection and redaction workloads. This is not required for Phase 1, but it may become important for regulated enterprise deals.

### 33.4 Desktop App

A desktop app may provide broader governance for local workflows, clipboard activity, and unmanaged browser contexts. This should come after browser extension and gateway value is proven.

### 33.5 Firefox Support

Firefox support should be added after the Chrome extension architecture, provider adapters, and policy sync model are stable. The adapter and policy layers should avoid browser-specific assumptions where practical.

## 34. Implementation Decision Record

| Decision | Rationale |
|---|---|
| Clampbox is a Graphxy Labs product | Keeps brand, deployment, and product architecture unified |
| One frontend | Avoids duplicate UI systems and fragmented routing |
| React Router routes | Matches the existing frontend direction |
| JavaScript frontend and extension | Matches current Graphxy Labs stack |
| Express backend | Keeps API and security logic in backend services |
| PostgreSQL and Drizzle | Durable relational model with typed schema workflow at the database layer |
| Manifest V3 extension | Required for modern Chrome extension distribution |
| Regex detection in Phase 1 | Fast, explainable, buildable, and effective for secrets |
| Audit metadata by default | Reduces sensitive data retention risk |
| Provider adapter model | Keeps future provider support manageable |

## 35. Final Summary

Clampbox v3.0 is a clean architecture for building an AI Security Gateway inside Graphxy Labs.

It uses the existing Graphxy Labs frontend, backend, database, and extension stack. It integrates product pages, waitlist, dashboard, browser extension, security engine, policy engine, gateway management, risk scoring, redaction, and audit logging into one internally consistent system.

The product begins with practical controls that can ship: prompt inspection, regex detection, classification, risk scoring, policy enforcement, redaction, gateway assignment, and audit logs. It then expands toward enterprise governance, analytics, integrations, semantic detection, desktop coverage, Firefox support, and advanced research.

The central promise remains simple:

Clampbox protects AI interactions before sensitive data reaches the AI provider.

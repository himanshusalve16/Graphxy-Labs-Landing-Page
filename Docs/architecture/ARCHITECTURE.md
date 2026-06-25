# System Architecture & Data Flow

> **Purpose:** This document details the software architecture, system boundaries, component relationships, and execution pipelines of the Clampbox AI Security Gateway.

## Table of Contents

1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Repository Structure](#2-repository-structure)
3. [Interaction Flows](#3-interaction-flows)
4. [The Backend Security Pipeline](#4-the-backend-security-pipeline)
5. [Technology Stack](#5-technology-stack)

---

## 1. High-Level System Architecture

Clampbox resides within the Graphxy Labs monorepo. It interfaces with client web browsers, backend engines, databases, and third-party AI model providers.

```mermaid
graph TD
    Extension["Clampbox Chrome Extension<br>(Manifest V3)"]
    ViteApp["Graphxy Labs Frontend<br>(React + Vite / Vercel)"]
    ExpressAPI["Graphxy Labs Backend<br>(Node + Express / Render)"]
    PostgresDB[("PostgreSQL DB<br>(Drizzle ORM)")]
    RedisCache[("Redis Cache<br>(Rate limits, Session keys)")]
    AIProviders["AI Providers<br>(OpenAI, Anthropic, Gemini)"]

    Extension -- "HTTPS Policy Sync / Events" --> ExpressAPI
    ViteApp -- "HTTPS Admin Actions" --> ExpressAPI
    ExpressAPI -- "SQL Queries" --> PostgresDB
    ExpressAPI -- "Lookup / Rate Limit" --> RedisCache
    ExpressAPI -- "Proxied Secure Requests" --> AIProviders
    Extension -- "Direct Interception" --> AIProviders
```

---

## 2. Repository Structure

```
D:\Graphxy
├── backend/                  # Express.js REST API server
│   ├── clampbox/             # Clampbox product logic
│   │   ├── controllers/      # Route handler controllers
│   │   ├── middleware/       # Request middleware
│   │   ├── routes/           # Endpoint path mappings
│   │   ├── services/         # Core logic (inspection, policy, redaction, audit)
│   │   └── utils/            # Utilities (logger, org resolver)
│   ├── src/                  # Global backend server entrypoint (server.js)
│   └── package.json
├── db/                       # Drizzle ORM database scaffolding
│   └── clampbox/
│       ├── schema/           # Table schema definitions
│       ├── migrations/       # Generated SQL migration files
│       └── db.js             # pg Pool initialization
├── frontend/                 # Vite + React SPA
│   ├── clampbox/             # Clampbox console source
│   │   ├── components/       # Layout shells (CbLayout.jsx, Modal.jsx)
│   │   ├── extension/        # Manifest V3 Chrome Extension source
│   │   ├── services/         # Fetch client wrapper (api.js)
│   │   └── web/              # Console page views (Dashboard, Policies, Keys, etc.)
│   └── src/                  # Graphxy Labs website pages
├── Docs/                     # Product specs, design docs, wireframes, roadmaps
├── docs/                     # Technical developer documentation (this directory)
├── scripts/                  # Utility scripts (populate-docker-cache.ps1)
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── .env.example
```

---

## 3. Interaction Flows

Clampbox processes traffic via two execution loops:

### 3.1 Browser-Based Prompt Interception

Protects end-user interactions on standard chatbot interfaces (ChatGPT, Claude, Gemini, Grok):

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Ext as Clampbox Extension
    participant Page as Provider Web Page
    participant API as Clampbox Backend API
    participant AI as AI Provider API

    User->>Page: Type prompt & click Submit
    Ext->>Page: Intercept submit event
    Ext->>API: Send prompt for evaluation
    Note over API: Run Security Pipeline<br>(Inspect, Classify, Redact, Score Risk, Policy Check)
    API-->>Ext: Return Decision (Allow, Redact, Warn, Block)

    alt Decision is Block
        Ext->>Page: Cancel submit event
        Ext->>User: Display blocked notice popup
    else Decision is Redact
        Ext->>Page: Replace form text with redacted output
        Ext->>Page: Release modified submit event to provider
        Page->>AI: Send redacted prompt
    else Decision is Allow
        Ext->>Page: Release original submit event
        Page->>AI: Send original prompt
    end
```

### 3.2 API Gateway Routing

Protects developer application requests routing through Clampbox gateway keys:

```mermaid
sequenceDiagram
    autonumber
    participant App as Client Application
    participant API as Clampbox Gateway API
    participant Engine as Security Engine
    participant DB as Postgres Database
    participant AI as AI Provider API

    App->>API: POST /api/clampbox/risk/inspect (with Gateway Key)
    API->>DB: Lookup & Validate Gateway Key hash
    DB-->>API: Key is valid (Retrieve assigned policies)
    API->>Engine: Run Security Pipeline
    Note over Engine: 1. Normalization<br>2. Secret/PII Scan<br>3. Risk Scoring<br>4. Policy Engine
    Engine-->>API: Return Decision & Redacted Prompt

    alt Decision is Allow or Redact
        API->>AI: Forward request with decrypted provider API key
        AI-->>API: Return provider response
        API->>DB: Log Audit Event & Prompt Event hashes
        API-->>App: Return clean output response
    else Decision is Block
        API->>DB: Log Audit Event (Blocked status)
        API-->>App: Return 403 Forbidden (Blocked by security policy)
    end
```

---

## 4. The Backend Security Pipeline

Every prompt evaluated by the backend passes through a modular, sequential security pipeline:

```mermaid
graph LR
    Input["Input Prompt Text"] --> Normalization["1. Normalization<br>(Clean whitespace, decode encodings)"]
    Normalization --> Detections["2. Secret & PII Scanner<br>(Regex and classification rules)"]
    Detections --> Risk["3. Risk Scoring<br>(Calculate severity & risk index)"]
    Risk --> Policy["4. Policy Evaluator<br>(Match criteria against active rules)"]
    Policy --> Outcome{"5. Policy Outcome"}

    Outcome -->|Allow| OutAllow["Allow original prompt"]
    Outcome -->|Redact| OutRedact["Redact sensitive spans<br>& release safe prompt"]
    Outcome -->|Warn| OutWarn["Alert client<br>(Confirm/Bypass step)"]
    Outcome -->|Block| OutBlock["Reject request<br>& stop execution"]
```

### Engine Components

| File | Responsibility |
|---|---|
| `inspection.service.js` | Orchestrates the overall sequence and aggregates findings |
| `secretDetection.service.js` | Runs regex checks for passwords, API keys, SSH keys, private keys, database URLs, credentials |
| `classification.service.js` | Maps raw detections to semantic taxonomy classes (PII, Infrastructure, Business Confidential) |
| `riskScoring.service.js` | Evaluates overall prompt threat severity, outputting scores from `0` (no risk) to `100` (critical) |
| `redaction.service.js` | Replaces targeted sensitive substring offsets with structured placeholders (e.g., `[REDACTED_EMAIL]`) |
| `policyEngine.service.js` | Resolves which policies apply and produces the final enforcement action |

### Secure Vault Encryption

Provider API keys stored inside the Vault (`api_keys` table) are symmetrically encrypted using **AES-256-CBC** via `vault.controller.js`. The master encryption key is read from the `CLAMPBOX_ENCRYPTION_KEY` environment variable. Raw encrypted key payloads are **never** returned via the REST API — only metadata fingerprints are exposed.

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vite, React 18, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, CORS, Morgan |
| **Database** | PostgreSQL (via Drizzle ORM) |
| **Cache** | Redis (rate limits, policy caching) |
| **Browser Extension** | Chrome Manifest V3 |
| **Containerization** | Docker, Docker Compose |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

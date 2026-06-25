# Environment Variables Dictionary & Security Guidelines

> **Purpose:** Reference for all environment configuration variables used across the Graphxy Labs & Clampbox platform, including syntax, defaults, validation rules, and secure generation procedures.

## Table of Contents

1. [Security Policies](#1-security-policies)
2. [Frontend Variables (VITE\_ Prefixed)](#2-frontend-variables-vite_-prefixed)
3. [Backend Server Variables](#3-backend-server-variables)
4. [Generating Secure Secrets](#4-generating-secure-secrets)
5. [Example .env File](#5-example-env-file)

---

## 1. Security Policies

> [!CAUTION]
> **Never commit `.env`, `.env.local`, `.env.production`, or any secret file to git.** These files are ignored by default in `.gitignore`.

1. **Use Managed Key Managers in Production:** Enter secrets directly into the Vercel and Render dashboards, or use a secrets manager (Doppler, AWS Secrets Manager, Infisical).
2. **Generate Strong Keys:** All production encryption keys, peppers, and session secrets must be generated with cryptographically secure random sources.
3. **Rotate Keys Regularly:** Rotate `CLAMPBOX_ENCRYPTION_KEY` and `CLAMPBOX_GATEWAY_KEY_PEPPER` at least once per quarter.
4. **Strict CORS in Production:** Set `CLAMPBOX_ALLOWED_ORIGINS` to only your production domains. Never use `*` in production.

---

## 2. Frontend Variables (`VITE_` Prefixed)

All variables exposed to the React frontend **must be prefixed with `VITE_`**. They are compiled into static JS bundles at build time and are **publicly visible** — never put secrets here.

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `VITE_GRAPHXY_API_BASE_URL` | URL | `http://localhost:5000/api/clampbox` | Target base URL for frontend API fetch operations. Set to your Render backend URL in production. |
| `VITE_CLAMPBOX_EXTENSION_ID` | String | `abcdefghijklmnopqrstuvwxyzabcdef` | The 32-character Chrome Web Store ID of your published extension. Used for dashboard ↔ content script messaging. |
| `VITE_CLAMPBOX_ENABLE_WAITLIST` | Boolean | `true` | Enables waitlist sign-up forms and routing. |
| `VITE_CLAMPBOX_ENABLE_DASHBOARD` | Boolean | `true` | Enables access to the Clampbox console dashboard. |
| `VITE_FORMSPREE_WAITLIST_ID` | String | `xpzvoldo` | Formspree form ID for fallback email captures if the backend is unreachable. |

---

## 3. Backend Server Variables

These variables remain private to the Node.js process and are **never** sent to the client browser.

### Server

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `PORT` | Integer | `5000` | Port on which the Express.js server listens. |
| `NODE_ENV` | String | `development` | Runtime environment. `production` enables JSON logging and activates PII log scrubbers. |

### Database & Cache

| Variable | Type | Required | Purpose |
|---|---|---|---|
| `DATABASE_URL` | URL | ✅ | PostgreSQL connection string. Format: `postgresql://[user]:[password]@[host]:[port]/[database]` |
| `REDIS_URL` | URL | ✅ | Redis connection string. Format: `redis://[host]:[port]` |

### Security & Encryption

| Variable | Type | Required | Purpose |
|---|---|---|---|
| `CLAMPBOX_ENCRYPTION_KEY` | Hex (64 chars) | ✅ | AES-256 symmetric encryption key for provider API credentials in the Vault. Must be exactly 32 bytes (64 hex characters). |
| `CLAMPBOX_GATEWAY_KEY_PEPPER` | String | ✅ | High-entropy random salt appended to Gateway Keys before hashing into the database. |
| `CLAMPBOX_SESSION_SECRET` | String | ✅ | Secret used to sign Express session cookies. |

### CORS

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `CLAMPBOX_ALLOWED_ORIGINS` | Comma-separated list | `http://localhost:5173,https://graphxylabs.dev` | Allowed origins for Cross-Origin Resource Sharing. Include your extension ID in production. |

### Rate Limiting

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `CLAMPBOX_RATE_LIMIT_WINDOW_SECONDS` | Integer | `60` | Duration window for the request rate limiter. |
| `CLAMPBOX_RATE_LIMIT_MAX_REQUESTS` | Integer | `100` | Maximum allowed API calls per window per IP or token. |

### Audit & Logging

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `CLAMPBOX_AUDIT_RETENTION_DAYS` | Integer | `90` | Number of days to retain audit log records before pruning. |

---

## 4. Generating Secure Secrets

Use one of the following methods to generate cryptographically strong values for `CLAMPBOX_ENCRYPTION_KEY`, `CLAMPBOX_GATEWAY_KEY_PEPPER`, and `CLAMPBOX_SESSION_SECRET`.

### Node.js (Recommended)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### OpenSSL
```bash
openssl rand -hex 32
```

Copy the generated 64-character hex string and paste it into your environment config or hosting dashboard.

---

## 5. Example .env File

Below is the full `.env.example` template committed to the repository:

```env
# ==============================================================================
# FRONTEND CONFIGURATION
# ==============================================================================
VITE_GRAPHXY_API_BASE_URL=http://localhost:5000/api/clampbox
VITE_CLAMPBOX_ENABLE_WAITLIST=true
VITE_CLAMPBOX_ENABLE_DASHBOARD=true
VITE_CLAMPBOX_EXTENSION_ID=abcdefghijklmnopqrstuvwxyzabcdef
VITE_FORMSPREE_WAITLIST_ID=xpzvoldo

# ==============================================================================
# BACKEND SERVER
# ==============================================================================
PORT=5000
NODE_ENV=development

# ==============================================================================
# DATABASE
# ==============================================================================
DATABASE_URL=postgresql://clampbox:password@localhost:5433/clampbox

# ==============================================================================
# CACHE
# ==============================================================================
REDIS_URL=redis://localhost:6379

# ==============================================================================
# SECURITY & ENCRYPTION
# ==============================================================================
CLAMPBOX_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
CLAMPBOX_GATEWAY_KEY_PEPPER=some_random_pepper_string_for_hashing
CLAMPBOX_SESSION_SECRET=session_signing_secret_phrase

# ==============================================================================
# CORS
# ==============================================================================
CLAMPBOX_ALLOWED_ORIGINS=http://localhost:5173,https://graphxylabs.dev

# ==============================================================================
# RATE LIMITING
# ==============================================================================
CLAMPBOX_RATE_LIMIT_WINDOW_SECONDS=60
CLAMPBOX_RATE_LIMIT_MAX_REQUESTS=100

# ==============================================================================
# AUDIT & LOGGING
# ==============================================================================
CLAMPBOX_AUDIT_RETENTION_DAYS=90
```

> [!NOTE]
> The values above are development defaults. **All secrets must be replaced with strong, randomly generated values before deploying to production.**

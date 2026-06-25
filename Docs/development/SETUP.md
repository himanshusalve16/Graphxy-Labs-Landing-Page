# Local Development Setup Guide

> **Purpose:** Step-by-step instructions to set up, run, test, and maintain the Graphxy Labs & Clampbox development environment locally.

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Configuration](#2-environment-configuration)
3. [Option A — Docker Compose (Recommended)](#3-option-a--docker-compose-recommended)
4. [Option B — Bare Metal (No Docker)](#4-option-b--bare-metal-no-docker)
5. [Database Migrations (Drizzle ORM)](#5-database-migrations-drizzle-orm)
6. [Chrome Extension Setup](#6-chrome-extension-setup)
7. [Verification & Testing](#7-verification--testing)
8. [Code Quality](#8-code-quality)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

Ensure the following tools are installed before starting:

| Tool | Version | Required For |
|---|---|---|
| **Node.js** | v18.x or v20.x | Running backend & frontend |
| **npm** | v9.x or later | Package management |
| **Docker Desktop** | Latest stable | Containerized development |
| **PostgreSQL** | 15+ | Bare-metal DB (if not using Docker) |
| **Redis** | 7+ | Bare-metal cache (if not using Docker) |
| **Google Chrome** | Latest | Testing the browser extension |

---

## 2. Environment Configuration

Copy the root-level environment template to create your local `.env` file:

**Git Bash / Unix:**
```bash
cp .env.example .env
```

**PowerShell:**
```powershell
Copy-Item .env.example .env
```

**Windows CMD:**
```cmd
copy .env.example .env
```

Open the `.env` file and review the variables. For bare-metal execution, adjust `DATABASE_URL` and `REDIS_URL` to point to your local instances.

> [!TIP]
> See [docs/development/ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for a full dictionary of all variables and how to generate secure secrets.

---

## 3. Option A — Docker Compose (Recommended)

Docker Compose orchestrates the entire stack (PostgreSQL, Redis, backend, and frontend) with zero manual database installation required.

### Development Mode (Hot Reload)

Runs the full stack with live reloading. Code changes on your host machine are reflected instantly inside containers:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

| Service | URL |
|---|---|
| **Vite Frontend** | [http://localhost:5173](http://localhost:5173) |
| **Express Backend** | [http://localhost:5000](http://localhost:5000) |
| **Backend Health** | [http://localhost:5000/health](http://localhost:5000/health) |
| **PostgreSQL** | Port `5433` on host (avoids conflicts with local Postgres on `5432`) |
| **Redis** | Port `6379` on host |

### Production Simulation

To test production-grade containers (Nginx for frontend, multi-stage builds, non-root users):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

| Service | URL |
|---|---|
| **Frontend (Nginx)** | [http://localhost:8080](http://localhost:8080) |
| **Express Backend** | [http://localhost:5000](http://localhost:5000) |

### Common Docker Commands

```bash
# Check running containers
docker compose ps

# Stop all containers
docker compose down

# Clear persisted volume data (hard reset)
docker compose down -v

# View logs for a specific service
docker compose logs -f backend
```

---

## 4. Option B — Bare Metal (No Docker)

If you prefer to run services natively without Docker:

### Step 1 — Database & Cache

Ensure PostgreSQL is running locally and create the database:

```sql
CREATE DATABASE clampbox;
```

Ensure Redis is running on port `6379`.

Update your `.env`:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/clampbox
REDIS_URL=redis://localhost:6379
```

### Step 2 — Install Dependencies

From the monorepo root:
```bash
npm install
```

### Step 3 — Run Services

Run each service individually from the root using workspace flags:

```bash
# Start backend server (port 5000)
npm run dev:backend

# Start frontend dev server (port 5173)
npm run dev:frontend

# Build frontend for production
npm run build:frontend
```

Or run from the service directories directly:

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

---

## 5. Database Migrations (Drizzle ORM)

The database schema is managed with **Drizzle ORM** under the `db/clampbox/` directory.

### Generate a Migration

When you make changes to schema files inside `db/clampbox/schema/`, generate a SQL migration:

```bash
npx drizzle-kit generate --config=db/clampbox/drizzle.config.js
```

This writes SQL migration files to `db/clampbox/migrations/`.

### Apply Migrations

Run all outstanding migrations against your active database:

```bash
npx drizzle-kit migrate --config=db/clampbox/drizzle.config.js
```

### Database Studio (Visual GUI)

Launch the Drizzle visual table manager:

```bash
npx drizzle-kit studio --config=db/clampbox/drizzle.config.js
```

> [!NOTE]
> You can also use the workspace scripts: `npm run migration:generate`, `npm run migration:apply`, and `npm run db:studio` from the root.

---

## 6. Chrome Extension Setup

### Build the Extension

```bash
cd frontend/clampbox/extension
npm install
npm run build
```

This outputs compiled assets to `frontend/clampbox/extension/dist/`.

For watch mode (live rebuild during development):
```bash
npm run dev
```

### Load into Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `frontend/clampbox/extension/dist` folder
5. The Clampbox extension icon appears in your browser toolbar

### Configure Permissions

After loading the extension:

1. Click **Details** on the Clampbox extension card
2. Under **Site access**, verify permissions cover the target AI provider pages:
   - `https://chatgpt.com/*`
   - `https://claude.ai/*`
   - `https://gemini.google.com/*`
3. Optionally enable **Allow in Incognito** to test in incognito tabs

### Verify Connection

With the backend running (`http://localhost:5000`):

1. Click the Clampbox icon in the browser toolbar
2. The popup status indicator should show `CONNECTED` (green badge)
3. Visit a supported page (e.g., `https://chatgpt.com`) to see prompt interception in action

---

## 7. Verification & Testing

Verify service connectivity using `curl` or any HTTP client:

```bash
# Backend health check
curl http://localhost:5000/health

# Dashboard metrics
curl http://localhost:5000/api/clampbox/dashboard

# Settings
curl http://localhost:5000/api/clampbox/settings

# List policies
curl http://localhost:5000/api/clampbox/policies
```

Expected responses are `200 OK` with `{ "success": true, ... }` JSON bodies.

---

## 8. Code Quality

Before committing code changes:

```bash
# Lint check (frontend)
npm run lint

# Format styles
npm run format
```

---

## 9. Troubleshooting

### Port already in use (`EADDRINUSE`)

**Problem:** Another process occupies port `5432` or `3000`, blocking Docker containers.

**Resolution:** The dev compose already maps PostgreSQL to port `5433` and frontend to `5173` to avoid conflicts. If you still get port errors, check for conflicting processes:
```bash
netstat -aon | findstr :5433
```

---

### PostgreSQL UUID casting exception

**Problem:** API calls return `invalid input syntax for type uuid: "default"`.

**Resolution:** Never pass static string literals to UUID columns. Use the `resolveOrganizationId` utility in backend routes to dynamically resolve the correct UUID from slugs or labels.

---

### CORS errors in the Extension

**Problem:** Extension popup shows connection errors; browser console shows `blocked by CORS policy`.

**Resolution:** Verify `CLAMPBOX_ALLOWED_ORIGINS` in your `.env` includes the extension origin:
```env
CLAMPBOX_ALLOWED_ORIGINS=http://localhost:5173,chrome-extension://<YOUR_EXTENSION_ID>
```

---

### Docker Compose double binding errors

**Problem:** `Ports collation duplicate bindings detected`

**Resolution:** Ensure override files (`docker-compose.dev.yml`) do not re-declare ports already bound in `docker-compose.yml`. Each port binding should appear in only one file.

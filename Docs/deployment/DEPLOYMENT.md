# Production Deployment Guide

> **Purpose:** Complete reference for the production deployment strategy, infrastructure choices, build pipelines, release checklist, and platform-specific guides for Graphxy Labs & Clampbox.

## Table of Contents

1. [Deployment Architecture](#1-deployment-architecture)
2. [Release Checklist](#2-release-checklist)
3. [Frontend Deployment — Vercel](#3-frontend-deployment--vercel)
4. [Backend Deployment — Render](#4-backend-deployment--render)
5. [Docker & Containerization](#5-docker--containerization)
6. [Keep-Alive & API Warmup](#6-keep-alive--api-warmup)
7. [Chrome Extension Publishing](#7-chrome-extension-publishing)

---

## 1. Deployment Architecture

The repository uses a **split-deployment architecture** optimized for performance and ease of management:

```text
       +-----------------------+              +----------------------+
       |   Vite Frontend       |              |  Node.js API Server  |
       |   Hosted on Vercel    |              |   Hosted on Render   |
       +-----------+-----------+              +-----------+----------+
                   |                                      |
                   | REST HTTPS Requests                  | Drizzle ORM Queries
                   +------------------------------------->+
                                                          |
                                          +---------------+---------------+
                                          |                               |
                                          v                               v
                                +-------------------+           +-------------------+
                                | Managed Postgres  |           |   Managed Redis   |
                                | (Render / AWS)    |           | (Render / Upstash)|
                                +-------------------+           +-------------------+
```

| Component | Platform | URL Pattern |
|---|---|---|
| **Frontend** | Vercel | `https://graphxylabs.dev` |
| **Backend API** | Render | `https://clampbox-api.onrender.com` |
| **Database** | Render Postgres / Supabase / AWS RDS | Internal connection string |
| **Cache** | Render Redis / Upstash | Internal connection string |
| **Browser Extension** | Chrome Web Store | Published extension ID |

---

## 2. Release Checklist

Complete all steps before deploying to production:

### ✅ Database Migrations
- [ ] Ensure all pending migrations are generated locally and committed to `db/clampbox/migrations/`
- [ ] Run migrations against the staging database first:
  ```bash
  DATABASE_URL=your_staging_db_url npx drizzle-kit migrate --config=db/clampbox/drizzle.config.js
  ```
- [ ] Verify in Drizzle Studio that the schema matches expectations
- [ ] Run migrations against the production database:
  ```bash
  DATABASE_URL=your_prod_db_url npx drizzle-kit migrate --config=db/clampbox/drizzle.config.js
  ```

### ✅ Encryption Keys
- [ ] `CLAMPBOX_ENCRYPTION_KEY` is a cryptographically strong 32-byte hex-encoded key (not the default dev value)
- [ ] `CLAMPBOX_GATEWAY_KEY_PEPPER` is set to a unique randomized string
- [ ] `CLAMPBOX_SESSION_SECRET` is set to a long, secure secret phrase

Generate secure keys with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ✅ CORS Enforcement
- [ ] `CLAMPBOX_ALLOWED_ORIGINS` contains only production domains:
  ```env
  CLAMPBOX_ALLOWED_ORIGINS=https://graphxylabs.dev,chrome-extension://[your_extension_id]
  ```
- [ ] Wildcard `*` is **not** present

### ✅ Logging & Scrubbing
- [ ] `NODE_ENV=production` is set — this enforces JSON logging and activates regex scrubbers to purge passwords, tokens, and PII from backend outputs

### ✅ Health Monitoring
- [ ] Keep-alive ping is configured (see [Section 6](#6-keep-alive--api-warmup))

---

## 3. Frontend Deployment — Vercel

### Step 1 — Import Repository

1. Log in to the [Vercel Dashboard](https://vercel.com)
2. Click **Add New...** → **Project**
3. Connect to GitHub and click **Import** next to your Graphxy repository

### Step 2 — Configure Build Settings

In the project configuration panel:

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 3 — Environment Variables

Add these key-value pairs in the **Environment Variables** section:

| Variable | Production Value | Description |
|---|---|---|
| `VITE_GRAPHXY_API_BASE_URL` | `https://clampbox-api.onrender.com/api/clampbox` | Public path of your Render backend |
| `VITE_CLAMPBOX_EXTENSION_ID` | Your Chrome Web Store extension ID | 32-character alphanumeric ID |
| `VITE_CLAMPBOX_ENABLE_WAITLIST` | `true` | Enables waitlist forms |
| `VITE_CLAMPBOX_ENABLE_DASHBOARD` | `true` | Enables dashboard navigation |

### Step 4 — Deploy

Click **Deploy**. Vercel will clone the repo, navigate to `frontend/`, install packages, compile assets, and deploy.

### Step 5 — Custom Domain

1. In the Vercel project dashboard, go to **Settings** → **Domains**
2. Add `graphxylabs.dev` and `www.graphxylabs.dev`
3. Follow Vercel's DNS instructions:
   - Add a **CNAME** record pointing to `cname.vercel-dns.com`, or
   - Add an **A** record pointing to `76.76.21.21`

### SPA Routing

The Vite + React build is a Single Page Application. The `frontend/vercel.json` file handles routing so deep links don't 404:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This file is already committed and applied automatically on every Vercel deployment.

---

## 4. Backend Deployment — Render

### Step 1 — Create PostgreSQL Database

1. Log in to the [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Name: `clampbox-db`, select your region and tier
4. Click **Create Database**
5. Copy the **Internal Database URL** (used when backend is on Render)

### Step 2 — Create Redis Instance

1. Click **New +** → **Redis**
2. Name: `clampbox-cache`, select the same region
3. Click **Create Redis**
4. Copy the **Internal Redis Connection String**

### Step 3 — Create the Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---|---|
| **Name** | `clampbox-api` |
| **Region** | Same as DB and Redis |
| **Branch** | `main` |
| **Root Directory** | *(leave empty — required for monorepo access to `/db` and `/shared`)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm run start:backend` |

4. Click **Advanced** to add environment variables

### Step 4 — Environment Variables on Render

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `DATABASE_URL` | Internal connection string from Step 1 |
| `REDIS_URL` | Internal connection string from Step 2 |
| `CLAMPBOX_ALLOWED_ORIGINS` | `https://graphxylabs.dev,chrome-extension://[id]` |
| `CLAMPBOX_ENCRYPTION_KEY` | Your 32-byte hex key |
| `CLAMPBOX_GATEWAY_KEY_PEPPER` | Your secure string |
| `CLAMPBOX_SESSION_SECRET` | Your secret phrase |

### Step 5 — Health Check Configuration

1. In your Render Web Service settings, locate **Health Check Path**
2. Set it to `/health`
3. Save — Render will send `GET /health` during deploys. A `200 OK` response confirms the service is ready.

---

## 5. Docker & Containerization

### Architecture Overview

```text
                               +----------------------------+
                               |   Docker Compose Orchestrator|
                               +--------------+-------------+
                                              |
      +-----------------+--------------------+--------------------+-----------------+
      |                 |                    |                    |                 |
      v                 v                    v                    v                 v
+-----------+     +-----------+        +-----------+        +-----------+     +-----------+
| PostgreSQL|     | Redis     |        | Backend   |        | Frontend  |     | Volumes   |
| (Database)|     | (Cache)   |        | Node/Exp  |        | React/Vite|     | pgdata,   |
| port 5433 |     | port 6379 |        | port 5000 |        | port 5173 |     | redisdata |
+-----------+     +-----------+        +-----------+        +-----------+     +-----------+
```

### Dockerfile Specifications

**Backend (`backend/Dockerfile`)**
- Base image: `node:22-alpine`
- Copies `node_modules` from host to avoid OpenSSL network failures in virtual networks
- Runs directly via `node src/server.js` for graceful signal handling

**Frontend (`frontend/Dockerfile`)**
- Stage 1 (`build`): Uses `node:22-alpine`, compiles Vite/React app to static assets
- Stage 2 (serve): Uses `nginx:alpine`, serves compiled assets on port `80`

### Docker Compose Files

| File | Purpose |
|---|---|
| `docker-compose.yml` | Base service definitions (postgres, redis, backend, frontend) |
| `docker-compose.dev.yml` | Dev overrides: bind mounts, hot reload, Vite on port `5173` |
| `docker-compose.prod.yml` | Production overrides: JSON log driver limits |

### Networking

Docker Compose creates a shared default network. Container names act as DNS hostnames:

| Connection | String |
|---|---|
| Database (inside Docker) | `postgresql://clampbox:password@db:5432/clampbox` |
| Redis (inside Docker) | `redis://redis:6379` |
| Frontend → Backend | Via `VITE_GRAPHXY_API_BASE_URL` env variable |

### Volumes

| Volume | Maps To | Purpose |
|---|---|---|
| `pgdata` | `/var/lib/postgresql/data` | Persists PostgreSQL data across restarts |
| `redisdata` | `/data` | Persists Redis cache state across restarts |

### CLI Reference

```bash
# Start development stack
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Start production simulation
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Stop all containers
docker compose down

# Hard reset (wipe volumes)
docker compose down -v

# View logs for a service
docker compose logs -f backend
```

---

## 6. Keep-Alive & API Warmup

### The Hibernation Problem

Render's Free Tier spins down web services after **15 minutes of inactivity**. The next request triggers a cold start taking **30–60 seconds**, causing timeouts in browser extensions and dashboards.

> [!WARNING]
> Do **not** write self-pinging loops inside backend code. If the container is sleeping, internal code cannot run to wake itself. This pattern also causes resource waste, log pollution, and race conditions under horizontal scaling.

### Option 1 — UptimeRobot (Recommended)

1. Create a free account at [https://uptimerobot.com](https://uptimerobot.com)
2. Click **Add New Monitor** and configure:
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `Clampbox API Keep-Alive`
   - **URL:** `https://clampbox-api.onrender.com/health`
   - **Monitoring Interval:** Every 5 minutes
   - **Timeout:** 30 seconds
3. Click **Create Monitor** — UptimeRobot pings the service continuously

### Option 2 — Cron-Job.org

1. Register at [https://cron-job.org](https://cron-job.org)
2. Create a cronjob:
   - **Address:** `https://clampbox-api.onrender.com/`
   - **Schedule:** `*/12 * * * *` (every 12 minutes)

### Option 3 — GitHub Actions

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep API Warm

on:
  schedule:
    - cron: '*/12 * * * *'

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Send HTTP Ping
        run: |
          curl -s -o /dev/null -w "%{http_code}" https://clampbox-api.onrender.com/health
```

---

## 7. Chrome Extension Publishing

1. Build the production extension bundle:
   ```bash
   cd frontend/clampbox/extension
   npm run build
   ```
2. Create a ZIP archive of the `dist/` folder contents
3. Submit to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. After approval, copy your **Extension ID** and set it as `VITE_CLAMPBOX_EXTENSION_ID` in your Vercel environment variables

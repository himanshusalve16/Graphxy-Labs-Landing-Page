# Graphxy Labs — Clampbox AI Security Gateway

> **Clampbox** is an AI Security Gateway that governs, inspects, redacts, and audits interactions with Large Language Models. It operates as both a **Chrome Extension** (Manifest V3) for real-time browser prompt protection, and a **backend API gateway** for developer applications.

---

## 📂 Repository Structure

```
D:\Graphxy
├── backend/          # Node.js + Express.js API server
│   └── clampbox/     # Security pipeline, vault, audit, gateway key logic
├── db/               # Drizzle ORM schema & migrations
│   └── clampbox/     # PostgreSQL table definitions and migration files
├── frontend/         # Vite + React SPA
│   ├── src/          # Graphxy Labs website (landing, products, contact)
│   └── clampbox/     # Clampbox console dashboard & Chrome Extension source
├── Docs/             # Product specs, design docs, wireframes, business plans
├── docs/             # Technical developer documentation
├── scripts/          # Utility scripts
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── .env.example
```

---

## 🚀 Quick Start (Local Development)

Ensure **Node.js v18+**, **Docker Desktop**, and **Git** are installed.

**1. Configure environment:**
```bash
cp .env.example .env
```

**2. Start the full stack:**
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**3. Access the interfaces:**

| Interface | URL |
|---|---|
| Frontend Web App | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:5000](http://localhost:5000) |
| Health Check | [http://localhost:5000/health](http://localhost:5000/health) |

For complete setup instructions including bare-metal, extension loading, and database migrations, see **[docs/development/SETUP.md](./docs/development/SETUP.md)**.

---

## 📖 Documentation

All technical documentation lives in the **[`docs/`](./docs/)** directory. See the **[Documentation Index](./docs/DOCUMENTATION_INDEX.md)** for the complete navigation guide.

| Document | Purpose |
|---|---|
| [Architecture](./docs/architecture/ARCHITECTURE.md) | System design, data flows, security pipeline |
| [Development Setup](./docs/development/SETUP.md) | Local setup, Docker, migrations, extension |
| [Environment Variables](./docs/development/ENVIRONMENT_VARIABLES.md) | Full variable dictionary & secret generation |
| [Deployment](./docs/deployment/DEPLOYMENT.md) | Vercel, Render, Docker, keep-alive, Chrome Web Store |
| [API Reference](./docs/backend/API_REFERENCE.md) | All REST endpoints with request/response examples |
| [Extension Guide](./docs/extension/EXTENSION.md) | Build, load, configure, and publish the extension |
| [Product Status](./docs/product/PRODUCT_STATUS.md) | Implementation inventory, roadmap, technical debt |

**Product design documentation** (specs, wireframes, roadmaps) lives in **[`Docs/`](./Docs/README.md)**.

---

## 🏗️ How Clampbox Works

Clampbox processes AI prompts through a **modular security pipeline**:

```
Input Prompt
    ↓
1. Normalization       — Clean whitespace, decode encodings
    ↓
2. Secret & PII Scan   — Regex checks for API keys, credentials, emails, SSNs
    ↓
3. Risk Scoring        — Calculate severity index (0–100)
    ↓
4. Policy Evaluation   — Match against your active security rules
    ↓
5. Enforcement         — Allow / Redact / Warn / Block
```

See [Architecture](./docs/architecture/ARCHITECTURE.md) for full sequence diagrams.

---

## 🤝 Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for development workflow, code standards, and pull request guidelines.

## 📋 Changelog

See **[CHANGELOG.md](./CHANGELOG.md)** for version history.

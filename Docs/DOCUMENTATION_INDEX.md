# Documentation Index

> **The master navigation page for all Clampbox & Graphxy Labs technical documentation.**

This index covers all developer-facing documentation. For product design specs, wireframes, and business documents, see the [`Docs/`](../Docs/README.md) directory.

---

## 🏛️ Architecture

| Document | Description |
|---|---|
| [ARCHITECTURE.md](./architecture/ARCHITECTURE.md) | System architecture, repository structure, interaction flows, security pipeline, and tech stack |

---

## 🛠️ Development

| Document | Description |
|---|---|
| [SETUP.md](./development/SETUP.md) | Local development setup — Docker, bare-metal, migrations, extension loading, troubleshooting |
| [ENVIRONMENT_VARIABLES.md](./development/ENVIRONMENT_VARIABLES.md) | Full environment variable dictionary, security policies, and secret generation |

---

## 🚀 Deployment

| Document | Description |
|---|---|
| [DEPLOYMENT.md](./deployment/DEPLOYMENT.md) | Complete deployment guide — Vercel (frontend), Render (backend), Docker, keep-alive strategy, Chrome Web Store publishing |

---

## 🔌 Backend API

| Document | Description |
|---|---|
| [API_REFERENCE.md](./backend/API_REFERENCE.md) | Full REST API reference — all endpoints, request/response formats, authentication, error codes |

---

## 🧩 Browser Extension

| Document | Description |
|---|---|
| [EXTENSION.md](./extension/EXTENSION.md) | Extension overview, build instructions, Chrome loading, permissions, architectural flow, publishing guide |

---

## 📊 Product

| Document | Description |
|---|---|
| [PRODUCT_STATUS.md](./product/PRODUCT_STATUS.md) | Current implementation inventory, active API routes, production hardening summary, technical debt, and roadmap |

---

## 📁 Assets

Static assets referenced by documentation are stored in [`docs/assets/`](./assets/).

---

## 🗺️ Quick Start

New to the project? Follow this path:

1. **Understand the system** → [Architecture](./architecture/ARCHITECTURE.md)
2. **Set up locally** → [Development Setup](./development/SETUP.md)
3. **Configure variables** → [Environment Variables](./development/ENVIRONMENT_VARIABLES.md)
4. **Build & load the extension** → [Extension Guide](./extension/EXTENSION.md)
5. **Explore the API** → [API Reference](./backend/API_REFERENCE.md)
6. **Deploy to production** → [Deployment Guide](./deployment/DEPLOYMENT.md)
7. **Check current status** → [Product Status](./product/PRODUCT_STATUS.md)

---

## 🗃️ Legacy Documentation

The following root-level files are preserved for historical reference but their contents have been consolidated into the documents above:

| File | Consolidated Into |
|---|---|
| `ARCHITECTURE.md` | `docs/architecture/ARCHITECTURE.md` |
| `SETUP.md` | `docs/development/SETUP.md` |
| `LOCAL_DEVELOPMENT.md` | `docs/development/SETUP.md` |
| `BACKEND_SETUP.md` | `docs/development/SETUP.md` |
| `DATABASE_SETUP.md` | `docs/development/SETUP.md` |
| `TROUBLESHOOTING.md` | `docs/development/SETUP.md` |
| `ENVIRONMENT_VARIABLES.md` | `docs/development/ENVIRONMENT_VARIABLES.md` |
| `DEPLOYMENT.md` | `docs/deployment/DEPLOYMENT.md` |
| `RENDER_DEPLOYMENT.md` | `docs/deployment/DEPLOYMENT.md` |
| `VERCEL_DEPLOYMENT.md` | `docs/deployment/DEPLOYMENT.md` |
| `DOCKER.md` | `docs/deployment/DEPLOYMENT.md` |
| `KEEP_ALIVE.md` | `docs/deployment/DEPLOYMENT.md` |
| `EXTENSION_SETUP.md` | `docs/extension/EXTENSION.md` |
| `EXTENSION_BUILD.md` | `docs/extension/EXTENSION.md` |
| `API_REFERENCE.md` | `docs/backend/API_REFERENCE.md` |
| `IMPLEMENTATION_REPORT.md` | `docs/product/PRODUCT_STATUS.md` |
| `PROJECT_EXECUTION_GUIDE.md` | `docs/product/PRODUCT_STATUS.md` |
| `CLAMPBOX_PROJECT_STATUS.md` | `docs/product/PRODUCT_STATUS.md` |
| `PRODUCTION_READINESS_REPORT.md` | `docs/product/PRODUCT_STATUS.md` |
| `ROADMAP.md` | `docs/product/PRODUCT_STATUS.md` |

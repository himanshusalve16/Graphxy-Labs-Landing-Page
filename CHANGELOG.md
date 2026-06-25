# Changelog

All notable changes to Clampbox and the Graphxy Labs platform.

---

## [1.0.0] - 2026-06-25 — Production MVP

### Added
- **Dashboard-First Onboarding:** Removed mandatory onboarding redirect; users land directly on the console. A non-blocking Getting Started progress card guides setup
- **Setup Wizard Modal:** Multi-step guided wizard (`SetupWizardModal.jsx`) accessible from the dashboard header
- **Custom Modal System:** State-driven `<Modal />` component replacing all native `alert()` / `confirm()` browser dialogs
- **Animated Radial Glows:** Premium CSS animations (`float-glow-1`, `float-glow-2`) on the main content area matching Graphxy Labs design language
- **Grid & Noise Overlays:** 20px repeating grid and procedural SVG noise texture on the console viewport
- **White Sidebar:** Console sidebar converted to a clean white/light theme with teal active state indicators and left accent bars
- **Logo Restored:** Custom uploaded logo fills (`#676767` / `#D9D9D9`) restored from `currentColor` override

### Fixed
- **Help & Docs link removed** from sidebar navigation (consolidated into product docs)
- **API URLs:** All `localhost:5000` references in UI components replaced with production endpoints
- **Extension Popup:** Dynamic host resolution (production by default, localhost fallback in dev environments)

### Documentation
- Complete documentation refactor into `docs/` directory
- Consolidated 20 root-level Markdown files into 6 structured documents
- Created `docs/DOCUMENTATION_INDEX.md` as master navigation page
- Created `CONTRIBUTING.md`

---

## [0.3.0] - 2026-06-22 — UI/UX Design System Alignment

### Added
- Graphxy Labs design system inherited across all Clampbox console pages
- Framer Motion micro-animations on sidebar active states
- Custom zinc Tailwind palette tokens (`zinc-150`, `zinc-250`, `zinc-450`, etc.)
- Consistent typography using Inter and Fraunces from Google Fonts

### Removed
- Organization, Teams, Member Invitations, Tenant Directory pages (deferred to enterprise edition)
- Onboarding page as mandatory step in the user flow

---

## [0.2.0] - 2026-06-15 — Backend Integration & Security Pipeline

### Added
- **Interception Gateway:** Express proxy layer for custom gateway keys
- **Vault:** AES-256-CBC encrypted storage for OpenAI, Anthropic, Gemini, Groq, Perplexity API keys
- **Policy Engine:** Full CRUD policy management with priority ordering
- **Audit Logs:** Immutable compliance log records with real database writes
- **Dashboard Metrics:** Live aggregated statistics from PostgreSQL

### Fixed
- **UUID Resolution:** Replaced all mock `'default'` tenant string literals with `resolveOrganizationId` utility
- **Port Conflicts:** Development stack mapped to non-conflicting ports (`5433` for PostgreSQL, `5173` for frontend)
- **Mock Data Removed:** Eliminated all fake fallback data from controllers and services

---

## [0.1.0] - 2026-06-01 — Initial Monorepo Setup

### Added
- Monorepo structure: `backend/`, `frontend/`, `db/`, `shared/`, `scripts/`
- Vite + React 18 frontend with React Router
- Node.js + Express backend with Drizzle ORM
- PostgreSQL schema: organizations, api_keys, policies, vault, audit_logs
- Chrome Manifest V3 extension: content script, background service worker, popup
- Docker Compose stack (development and production configurations)
- CI-ready `.env.example` template

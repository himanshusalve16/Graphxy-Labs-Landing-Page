# Roadmap
## Graphxy Labs — Graphzy + Forkline

Timeframes are relative ("Week N") rather than fixed calendar dates since this is a founder-led build. The sequencing and dependencies matter more than exact durations.

---

## Graphzy Roadmap

### Phase 0 — Foundations (Weeks 1–2)

- Monorepo scaffolding: `apps/graphzy-web` (React + Vite + Tailwind), `apps/graphxy-site` (Next.js), `services/graphzy-api` (Node + Express), `packages/ui` (shared design tokens)
- Graphxy Labs design system tokens implemented (colors, type, spacing, glass-card, motion)
- Gemini API integration: combined classify+explain call, JSON schema validation with one retry
- `ai_response_cache` table and cache-key logic wired in
- graphxylabs.com landing page live: hero, Graphzy card, Forkline "Coming Soon" card, eight service vertical sections, footer

**Exit criteria:** Question typed in barebones UI returns valid structured JSON from Gemini, cached on repeat. Landing page is live at graphxylabs.com.

---

### Phase 1 — Graphzy Core Loop (Weeks 3–5)

- Home/Ask screen (per Hi-Fi design)
- Explanation + Visual view: Desmos canvas + slider rendering from AI output
- Follow-up flow (text + suggested chips), capped at 6 per session
- Guest session support (local storage) + Supabase Auth (email/magic link) + guest-to-account merge
- History list + reopen-session flow with slider-state restoration
- Error/edge states (rate limit, network, degraded response)

**Exit criteria:** User can ask a math question, get an explanation + interactive graph, ask follow-ups, sign up, and find the topic again in History.

---

### Phase 2 — Dashboard & Pilot Readiness (Weeks 6–7)

- Topic-wise Dashboard: subject counts, concepts explored, weak-area flagging
- Polish pass: motion/transitions per Interaction Design doc, empty states, mobile responsiveness
- Lightweight analytics logging (Gemini call volume vs. free-tier limits, cache hit rate, error rates)
- Basic onboarding (3-step on first visit, dismissible)
- Early access / "Join Graphzy" waitlist collection on graphxylabs.com for the pilot

**Exit criteria:** Product feature-complete against MVP scope, ready for external users.

---

### Phase 3 — Pilot (Weeks 8–11, ~4 weeks)

- Recruit 200–1,500 pilot users (student communities, personal network, relevant subreddits)
- Monitor: Gemini rate-limit headroom, cache hit rate, session/follow-up engagement, error rates
- Collect qualitative feedback (in-app survey after first session: "Did the visual help?")
- Weekly triage of feedback into backlog — no new features mid-pilot unless a blocking bug

**Exit criteria:** Success metrics (see Success Metrics doc) evaluated; go/no-go decision on V2 investment and funding conversations.

---

### Phase 4 — Graphzy V2: Chemistry Layer (Post-pilot)

- PubChem PUG REST integration for SMILES/structure lookup
- 3Dmol.js molecule rendering component (same "visual canvas" pattern as Desmos)
- AI prompt schema extended with a `molecule` output type
- Router gains a `chemistry` branch

---

### Phase 5 — Graphzy V2: Biology Layer

- Cytoscape.js or SVG-based pathway/cycle/network diagrams
- AI prompt schema extended with a `diagram` output type (nodes/edges/labels)
- Router gains a `biology` branch

---

### Phase 6 — Graphzy V2: Physics Layer

- Canvas-based simulations (motion, waves, simple forces); Three.js for 3D needs
- AI prompt schema extended with a `simulation` output type
- Router gains a `physics` branch

---

### Phase 7 — Graphzy Engagement & Retention Features

- Auto-generated quizzes per topic/concept
- Step-by-step hints (progressive reveal)
- "Explain like I'm 12" tone toggle + difficulty slider
- Daily practice plan from dashboard weak areas
- Progress analytics over time

---

## Forkline Roadmap

### Phase 0 — Concept Definition & Waitlist
- /forkline waitlist page live on graphxylabs.com
- POS, seating maps, and kitchen monitor workflow definition

## Lattice Roadmap

### Phase 0 — Concept Definition & Waitlist
- /lattice waitlist page live on graphxylabs.com
- Investor CRM tracking, deck metrics, execution roadmap specs

### Phase 0 — Concept Definition & Waitlist
- /forkline waitlist page live on graphxylabs.com
- POS, seating maps, and kitchen monitor workflow definition

## Lattice Roadmap

### Phase 0 — Concept Definition & Waitlist
- /lattice waitlist page live on graphxylabs.com
- Investor CRM tracking, deck metrics, execution roadmap specs

### Forkline Phase 0 — Waitlist & Product Definition (Parallel to Graphzy Phases 1–3)

- /forkline waitlist page live on graphxylabs.com with email capture
- Forkline PRD, Feature Spec, IA, and Design docs produced
- Competitive analysis of restaurant management space (Toast, Square for Restaurants, TouchBistro, etc.)
- Core Forkline design system (warm premium aesthetic, distinct from Graphzy's STEM palette)

### Forkline Phase 1 — Core Product (Post-Graphzy Pilot)

- Order management and POS integration (foundation features)
- Table management
- Staff management
- Basic reporting and analytics
- Closed beta with 2–5 restaurant partners

### Forkline Phase 2 — Platform Expansion

- Inventory tracking
- Customer loyalty program
- Multi-location operations
- Workflow automation
- Self-service onboarding

### Forkline Phase 3 — Growth

- Advanced analytics and business intelligence
- Third-party integrations (delivery platforms, accounting)
- Enterprise multi-location dashboard
- Mobile apps (iOS + Android for floor staff)

---

## Cross-Cutting Priorities (Always Evaluate)

- **Monetization timing (Graphzy):** revisit once V2 chemistry/biology layers exist and pilot data shows retention — likely freemium gating follow-up limits, history length, or advanced subjects.
- **Monetization (Forkline):** subscription SaaS model; pricing tier design part of Forkline Phase 0 product definition.
- **Infra scaling:** if free tiers become binding before V2, prioritize caching improvements over feature work.
- **Desmos licensing:** re-check terms before any Graphzy monetization event.
- **Design system evolution:** `packages/ui` shared tokens evolve with both products; Graphzy's STEM-subject accent palette and Forkline's warm-premium palette must coexist cleanly without collision.

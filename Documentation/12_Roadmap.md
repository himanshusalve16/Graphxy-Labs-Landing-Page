# Roadmap

Timeframes are relative ("Week N") rather than fixed calendar dates, since this is a part-time/solo-founder build. Adjust pace as needed — the sequencing and dependencies matter more than the exact durations.

---

## Phase 0 — Foundations (Weeks 1–2)

- Project scaffolding: React + Vite + Tailwind frontend, Node/Express backend, Supabase project (Auth + Postgres) created
- Design system tokens implemented (colors, type, spacing, glass-card component, motion primitives)
- Gemini API integration: single combined classify+explain call, JSON schema validation with one retry
- Basic `ai_response_cache` table and cache-key logic wired in

**Exit criteria:** A question typed in a barebones UI returns valid structured JSON from Gemini, cached on repeat.

---

## Phase 1 — MVP Core Loop (Weeks 3–5)

- Home/Ask screen (per Wireframes/Hi-Fi)
- Explanation + Visual view: Desmos canvas + slider rendering from AI output
- Follow-up flow (text + suggested chips), capped at 6 per session
- Guest session support (local storage) + Supabase Auth (email/magic link) + guest-to-account merge
- History list + reopen-session flow with slider-state restoration
- Error/edge states (rate limit, network, degraded response) per Interaction Design doc

**Exit criteria:** A user can ask a math question, get an explanation + interactive graph, ask follow-ups, sign up, and find the topic again in History.

---

## Phase 2 — Dashboard & Pilot Readiness (Weeks 6–7)

- Topic-wise Dashboard: subject counts, concepts explored, weak-area flagging
- Polish pass: motion/transitions per Interaction Design doc, empty states, mobile responsiveness
- Lightweight analytics/logging (Gemini call volume vs. free-tier limits, cache hit rate, error rates)
- Basic onboarding (3-step "what this app does" on first visit, dismissible)

**Exit criteria:** Product is feature-complete against the MVP scope in the PRD and ready for external users.

---

## Phase 3 — Pilot (Weeks 8–11, ~4 weeks)

- Recruit 200–1,500 pilot users (e.g., a few classes, a subreddit/student community, personal network)
- Monitor: Gemini rate-limit headroom, cache hit rate, error rates, session/follow-up engagement
- Collect qualitative feedback (short in-app survey after first session: "Did the visual help you understand this better?")
- Weekly triage of feedback into a backlog, but **no new features shipped mid-pilot** unless a blocking bug

**Exit criteria:** Success metrics (see Success Metrics doc) evaluated; go/no-go decision on V2 investment and/or funding conversations.

---

## Phase 4 — V2: Chemistry Layer (Post-pilot, scope TBD by pilot results)

- PubChem PUG REST integration for SMILES/structure lookup
- 3Dmol.js molecule rendering component, following the same "visual canvas" pattern as Desmos
- Extend AI prompt schema with a `molecule` output type; router gains a `chemistry` branch
- Reaction concept explanations (qualitative — not full reaction simulation in this phase)

---

## Phase 5 — V2: Biology Layer

- Cytoscape.js or SVG-based pathway/cycle/network diagrams
- AI prompt schema extended with a `diagram` output type (nodes/edges/labels)
- Router gains a `biology` branch

---

## Phase 6 — V2: Physics Layer

- Canvas-based simulations first (motion, waves, simple forces) — Three.js reserved for cases that need 3D (e.g., projectile motion in 3D, vector fields)
- AI prompt schema extended with a `simulation` output type (initial conditions, parameters)
- Router gains a `physics` branch

---

## Phase 7 — Engagement & Retention Features

- Auto-generated quizzes per topic/concept
- Step-by-step hints (progressive reveal)
- "Explain like I'm 12" tone toggle + difficulty slider
- Daily practice plan surfaced from dashboard weak areas
- Progress analytics over time

---

## Cross-Cutting / Always-Evaluate

- **Monetization timing:** revisit once V2 chemistry/biology layers exist and pilot data shows retention — likely a freemium model gating follow-up limits, history length, or advanced subjects.
- **Infra scaling:** if free-tier limits (Gemini, Supabase, Vercel/Render) become binding before V2 is ready, prioritize caching improvements and request batching over feature work.
- **Desmos licensing:** re-check terms before Phase 3 pilot if any monetization signal emerges during the pilot.
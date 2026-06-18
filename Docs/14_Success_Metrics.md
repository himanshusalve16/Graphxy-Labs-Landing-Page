# Success Metrics
## Graphxy Labs — Graphzy Pilot + Company-Level KPIs

---

## Part 1 — Graphzy Pilot Metrics

### 1.1 North Star Metric

**Interactive engagements per session** — the number of times a user manipulates a visual (drags a slider, rotates/zooms a graph) within a single topic session. This is the metric that most directly reflects the core hypothesis: that students engage more deeply with manipulable explanations than with static ones.

---

### 1.2 Activation

| Metric | Definition | Target (pilot) |
|---|---|---|
| First-question completion rate | % of users who submit a question and receive a valid (non-error) response | ≥ 90% |
| Time-to-first-visual | Median time from question submit to visual canvas rendered | < 4 seconds |
| Guest → signup conversion | % of guest users who create an account | ≥ 25% |

---

### 1.3 Engagement (Core Hypothesis Validation)

| Metric | Definition | Why it matters |
|---|---|---|
| % of sessions with ≥1 slider interaction | Sessions where the user touched a slider vs. read-only | Directly tests "interactivity over narration" |
| Avg. interactive engagements per session | See North Star | Depth of exploration, not just presence |
| Follow-up rate | % of sessions with ≥1 follow-up question | Curiosity was sparked, not just answered |
| Follow-up-to-visual-update rate | % of follow-ups that result in a new/updated expression or slider | Follow-ups feel connected to the visual |

---

### 1.4 Retention

| Metric | Definition | Target (pilot, 4–8 week window) |
|---|---|---|
| Week-2 return rate | % of users active in week 1 who return in week 2 | ≥ 30% (exploratory benchmark) |
| Sessions per returning user per week | Avg. new topics asked by returning users | Track trend, no hard target |
| History revisit rate | % of users who reopen a past topic from History | Signals the history loop has value |

---

### 1.5 Learning Signal (Qualitative + Lightweight Quantitative)

- **Post-session micro-survey** (single tap, optional): "Did this help you understand it better?" — Yes / Somewhat / No. Shown once per session after the first follow-up or after 60s of engagement.
- **Open-text pilot feedback** (short form at end of pilot, 3–4 questions): clarity vs. text-only alternatives, which subject the student most wants next, one thing that felt confusing in the UI.

---

### 1.6 Technical / Operational Health

| Metric | Definition | Target |
|---|---|---|
| Gemini call volume vs. free-tier daily limit | Daily API calls / daily free quota | Stay < 80% |
| Cache hit rate | % of `/ask` requests served from `ai_response_cache` | ≥ 20% by end of pilot |
| AI JSON validation failure rate | % of responses requiring the schema-repair retry | < 5% |
| Error rate (429/502/network) shown to users | % of requests resulting in a visible error | < 5% |
| p95 response latency (`/ask`) | 95th percentile time-to-response | < 8 seconds |

---

### 1.7 Pilot Go/No-Go Framework

At the end of the pilot window, evaluate three questions:

1. **Did the interactivity hypothesis hold?** Is "% of sessions with ≥1 slider interaction" meaningfully high, and does qualitative feedback attribute clarity specifically to the interactive element?
2. **Is the technical foundation sustainable?** Cache hit rate and Gemini call volume suggest the architecture can support 5–10x the pilot cohort without a paid tier, or a clear affordable next step exists.
3. **Is there a retention signal worth building on?** Week-2 return rate and follow-up rate suggest users come back to *explore*, not just to get one answer.

Yes on (1) + workable (2) → invest in Graphzy V2 (chemistry layer next). Weak (1) → revisit interaction design before adding subjects.

---

### 1.8 Explicit Non-Goals for Pilot Metrics

- No claims about exam score improvement (no control group, too short a window).
- No revenue/monetization metrics — out of scope until post-pilot.
- No cross-subject comparison metrics (math-only MVP).

---

## Part 2 — Forkline Pre-Launch Metrics

Forkline is Coming Soon during the Graphzy pilot. The relevant metrics at this stage are waitlist and interest signals.

| Metric | Definition | Target |
|---|---|---|
| Forkline detail page views / inquiry clicks | Total emails captured at /forkline during the Graphzy pilot window | 100+ (validates market interest before build begins) |
| Waitlist source attribution | Traffic source breakdown for /forkline page (direct, organic, referral) | Track — informs future marketing channels |
| Qualitative interest signals | Replies to waitlist confirmation email asking one open question ("What's your biggest operations headache?") | Qualitative input for Forkline PRD |

---

## Part 2.5 — Clampbox Pre-Launch Metrics
Clampbox is under COMING SOON during the Graphzy pilot. The metrics measure detail page inquiry conversion.

| Metric | Definition | Target |
|---|---|---|
| Clampbox detail page views / inquiry clicks | Total emails captured at /clampbox during the pilot window | 100+ (validates infrastructure/security interest) |
| Qualitative interest signals | Inquiries regarding specific enclave support (AWS Nitro vs. Intel SGX) | Qualitative input for Clampbox product definition |

---

## Part 3 — Graphxy Labs Company-Level Metrics

These are brand/presence metrics for the company during the pilot phase, not product metrics.

| Metric | Definition | Note |
|---|---|---|
| graphxylabs.com traffic | Monthly unique visitors to the landing page | Baseline measurement; no hard target for pilot |
| Product page split | % of visitors routing to /graphzy vs. /clampbox vs. /forkline vs. /services | Signals which draw is strongest; informs landing page copy optimization |
| Brand credibility signal | Inbound enquiries for services (Management Systems, Web Dev, AI/ML, Secure Infra etc.) from graphxylabs.com | Validates the company positioning alongside the products |

---

## Part 4 — Success Definition by Phase

| Phase | Graphzy | Clampbox | Forkline | Lattice | Graphxy Labs (Company) |
|---|---|---|---|---|---|
| Pilot (now) | Interactivity hypothesis validated; ≥25% guest→signup; week-2 return ≥30% | ≥100 detail page views / inquiry clicks | ≥100 detail page views / inquiry clicks | ≥100 detail page views / inquiry clicks | Landing page live; services sections visible; brand coherent |
| Post-pilot (V2) | Chemistry layer shipped; 3+ subjects available; paying tier launched | Secure enclave SDK beta launch | Forkline closed beta with 2–5 restaurant partners | First client service engagements sourced; team growing |
| Growth | 10k+ MAU Graphzy; paying subscription cohort; strong retention | Scaled multi-cloud enclave deployment | Forkline open beta; 20+ restaurant locations | Portfolio products publicly available; Graphxy Labs brand established |

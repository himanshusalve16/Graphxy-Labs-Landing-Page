# Success Metrics

## 1. North Star Metric

**Interactive engagements per session** — the number of times a user manipulates a visual (drags a slider, rotates/zooms a graph) within a single topic session. This is the metric that most directly reflects the core hypothesis: that students engage with *manipulable* explanations more than static ones. A session with zero interactions but a completed read is "an answer was delivered"; a session with multiple slider drags is "a concept was explored."

## 2. Activation

| Metric | Definition | Target (pilot) |
|---|---|---|
| First-question completion rate | % of users who submit a question and receive a valid (non-error) response | ≥ 90% |
| Time-to-first-visual | Median time from question submit to visual canvas rendered | < 4 seconds |
| Guest → signup conversion | % of guest users who create an account (e.g., prompted after first session) | ≥ 25% |

## 3. Engagement (Core Hypothesis Validation)

| Metric | Definition | Why it matters |
|---|---|---|
| % of sessions with ≥1 slider interaction | Sessions where the user touched a slider/control vs. read-only | Directly tests "interactivity over narration" |
| Avg. interactive engagements per session | See North Star above | Depth of exploration, not just presence |
| Follow-up rate | % of sessions with ≥1 follow-up question | Indicates curiosity was sparked, not just answered |
| Follow-up-to-visual-update rate | % of follow-ups that result in a new/updated expression or slider | Tests whether follow-ups feel "connected" to the visual |

## 4. Retention

| Metric | Definition | Target (pilot, 4–8 week window) |
|---|---|---|
| Week-2 return rate | % of users active in week 1 who return in week 2 | ≥ 30% (exploratory benchmark — pilot will help calibrate) |
| Sessions per returning user per week | Avg. number of new topics asked by returning users | Track trend, no hard target for pilot |
| History revisit rate | % of users who reopen a past topic from History | Signals the dashboard/history loop has value |

## 5. Learning Signal (Qualitative + Lightweight Quantitative)

Given the pilot has no formal pre/post testing infrastructure, learning impact is measured via:

- **Post-session micro-survey** (single tap, optional): "Did this help you understand it better?" — Yes / Somewhat / No, shown once per session after the first follow-up or after 60s of engagement, non-blocking.
- **Dashboard "weak area resolved" rate (V2-leaning, but trackable in MVP):** if a topic was flagged as a weak area and the user later revisits it and asks no further confusion-pattern follow-ups, treat as a soft signal of resolution.
- **Open-text feedback** collected at end of pilot (short form, 3–4 questions): clarity vs. text-only alternatives the student normally uses, what subject they most want next (signals V2 prioritization), and one thing that felt confusing in the UI.

## 6. Technical / Operational Health

| Metric | Definition | Target (pilot) |
|---|---|---|
| Gemini call volume vs. free-tier daily limit | Daily API calls / daily free quota | Stay < 80% to leave headroom; if consistently near limit, caching strategy needs revisiting before scaling pilot cohort |
| Cache hit rate | % of `/ask` requests served from `ai_response_cache` | ≥ 20% by end of pilot (higher hit rates expected as common questions recur) |
| AI JSON validation failure rate | % of responses requiring the schema-repair retry | < 5%; if higher, prompt needs tightening |
| Error rate (429/502/network) shown to users | % of requests resulting in a visible error state | < 5% |
| p95 response latency (`/ask`) | 95th percentile time-to-response | < 8 seconds (acceptable upper bound before UX feels broken) |

## 7. Pilot Go/No-Go Framework

At the end of the pilot window, evaluate against these three questions:

1. **Did the interactivity hypothesis hold?** — Is "% of sessions with ≥1 slider interaction" meaningfully high (e.g., majority of sessions), and does qualitative feedback attribute clarity specifically to the interactive element (not just "the explanation was good")?
2. **Is the technical foundation sustainable?** — Cache hit rate and Gemini call volume suggest the architecture can support 5–10x the pilot cohort without a paid tier, or a clear, affordable next step exists.
3. **Is there a retention signal worth building on?** — Week-2 return rate and follow-up rate suggest users come back to *explore*, not just to get one answer.

A clear "yes" on (1) and a workable answer on (2) justify investing in V2 (chemistry layer next, per Roadmap). A weak result on (1) suggests revisiting the interaction design before adding subjects — the core loop, not breadth, would be the bottleneck.

## 8. Explicit Non-Goals for Pilot Metrics

- No claims about exam score improvement (no control group, too short a window).
- No revenue/monetization metrics — out of scope until post-pilot.
- No cross-subject comparison metrics (math-only MVP).
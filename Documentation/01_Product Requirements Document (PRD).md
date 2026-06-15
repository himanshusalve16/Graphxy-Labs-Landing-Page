# Product Requirements Document (PRD)
## Visual Learning Engine — "Lumen" (working name)

---

### 1. Overview

Lumen turns a plain-language question into an interactive, visual explanation. Instead of returning text alone, it detects the subject (math, chemistry, biology, physics), breaks the topic into concepts, and renders the right visual — a live graph, a 3D molecule, a pathway diagram, or a physics simulation — alongside a short, clear explanation the student can manipulate and question further.

### 2. Problem Statement

Students rarely fail from a lack of information. They fail because explanations stay abstract — a paragraph or formula with no picture of what is actually happening. Existing AI tutors (Gauth, Astra, ThetaWise, Studdy AI, MathGPT) mostly answer with text, static images, or pre-recorded video. Few let a student *manipulate* the thing they're learning about in real time — drag a slider and watch a parabola shift, rotate a molecule, or speed up a reaction. Lumen's bet is that interactivity, not more text, is what makes abstract ideas click.

### 3. Goals

- **Primary goal:** Validate that an AI-generated explanation paired with a live, manipulable visual improves comprehension and engagement versus a text-only answer.
- **Secondary goal:** Produce a working pilot (hundreds–low thousands of users) on free-tier infrastructure (Gemini free API, Supabase free tier, Vercel/Render free tiers) to gather usage data and qualitative feedback before seeking funding.
- **Tertiary goal:** Build a portfolio-grade product that demonstrates AI integration, real-time visualization, and thoughtful product/UI design.

### 4. Target Users

| Segment | Description | Primary need |
|---|---|---|
| High school students (Grades 9–12) | Studying algebra, calculus, chemistry, biology, physics | "Help me *see* why this works" |
| Early undergraduates | STEM intro courses | Faster conceptual grounding before problem sets |
| Self-learners / hobbyists | Khan Academy / YouTube learners | Exploratory, curiosity-driven learning |

Out of scope for the pilot: institutional/classroom accounts, teachers as a distinct role, and non-STEM subjects.

### 5. Scope

#### MVP (Pilot) Scope
- Text question input (math-focused)
- AI explanation generation (Gemini)
- Desmos-based interactive graph output with sliders for detected variables
- Follow-up question support within the same session
- Saved history per user
- Topic-wise dashboard (what a student has explored, simple weak-area tagging)
- Lightweight auth (email/password or magic link via Supabase Auth)

#### V2 (Post-Pilot)
- Chemistry layer (PubChem + 3Dmol.js molecule rendering)
- Biology layer (Cytoscape.js / SVG pathway diagrams)
- Physics layer (Canvas/Three.js simulations)
- Voice input
- Auto-generated quizzes and step-by-step hints
- "Explain like I'm 12" and difficulty slider
- Daily practice plans and progress analytics

#### Explicitly Out of Scope (for now)
- Mobile native apps
- Offline mode
- Multi-language support
- Classroom/teacher dashboards, grading, LMS integration

### 6. Key Differentiators

1. **Interactivity over narration.** Competitors show a video or static diagram; Lumen lets the student change the input and watch the output respond live.
2. **Subject-aware visual routing.** One input box, but the visual engine (graph, molecule, diagram, simulation) is chosen automatically based on the question's domain.
3. **Conversational follow-up tied to the visual.** Follow-up questions can reference "this curve" or "this molecule" and the visual updates in context, not just the text.

### 7. Assumptions & Constraints

- Gemini free-tier API rate limits (requests/minute and /day) constrain concurrent usage; caching and request batching are required for a pilot of this size.
- Desmos API usage is free for educational/non-commercial contexts; this must be re-confirmed if the product becomes paid.
- No dedicated backend infra budget — Supabase free tier (Postgres + Auth) and Vercel/Render free hosting tiers are assumed.
- Pilot cohort size: 200–1,500 users over a defined pilot window (suggested 4–8 weeks).

### 8. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Gemini free-tier rate limiting under load | Degraded/failed responses during peak usage | Response caching, queueing, graceful "try again" UX, model fallback to a lighter prompt |
| Subject misclassification | Wrong visual engine chosen, breaks trust | Confidence-based routing + manual "switch lens" option for users |
| Desmos licensing changes | Core math visualization breaks | Abstract the graphing layer behind an interface so Plotly/D3 can substitute |
| Scope creep into V2 features during pilot | Pilot ships late or unfinished | Hard MVP freeze; V2 items tracked in roadmap only |

### 9. Success Criteria for the Pilot

See **Success Metrics Document** for full detail. At a minimum, the pilot should demonstrate: (a) users return to ask follow-up questions within a session, (b) a measurable share of users interact with sliders/visual controls (not just read), and (c) qualitative feedback indicates the visual explanation was clearer than a text-only one.

### 10. Stakeholders

- **Founder/Product owner:** defines scope, prioritizes roadmap, runs pilot
- **Pilot users:** students providing usage data and feedback
- **(Future) Contributors:** if open-sourced or team grows, frontend/backend/AI prompt-engineering roles
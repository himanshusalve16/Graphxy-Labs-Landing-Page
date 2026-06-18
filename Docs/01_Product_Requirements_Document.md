# Product Requirements Document (PRD)
## Graphxy Labs — Graphzy, Forkline, & Lattice Platforms

---

### 1. Company Context

**Graphxy Labs** is a modern, premium technology company building software products, intelligent systems, business platforms, automation solutions, and scalable digital experiences for startups, businesses, and enterprises. Its product portfolio currently comprises four flagships:

| Product | Category | Status |
|---|---|---|
| **Graphzy** | AI-Powered STEM Visualizer | COMING SOON |
| **Clampbox** | Confidential Execution Infrastructure | COMING SOON |
| **Forkline** | Restaurant Operations Platform | COMING SOON |
| **Lattice** | Startup Operations Platform | COMING SOON |

This document covers the requirements for **Graphzy**, Graphxy Labs' core visualization product.

---

### 2. Product Overview — Graphzy

Graphzy transforms a plain-language question into an interactive, visual explanation. Instead of returning text alone, it detects the subject (math, chemistry, biology, physics), breaks the topic into concepts, and renders the right visual — a live graph, a 3D molecule, a pathway diagram, or a physics simulation — alongside a concise explanation the student can manipulate and question further.

Graphzy is the first public-facing product shipping under the Graphxy Labs brand and serves as the flagship proof of the company's engineering capability and product philosophy: precision, interactivity, and restraint over noise.

---

### 3. Problem Statement

Students rarely fail from a lack of information. They fail because explanations stay abstract — a paragraph or formula with no picture of what is actually happening. Existing AI tutors (Gauth, Astra, ThetaWise, Studdy AI, MathGPT) mostly answer with text, static images, or pre-recorded video. Few let a student *manipulate* the thing they're learning about in real time. Graphzy's core thesis: interactivity, not more text, is what makes abstract ideas click.

---

### 4. Goals

- **Primary:** Validate that an AI-generated explanation paired with a live, manipulable visual improves comprehension and engagement versus a text-only answer.
- **Secondary:** Ship a working pilot (hundreds–low thousands of users) on free-tier infrastructure (Gemini free API, Supabase, Vercel/Render) to gather signal before seeking funding.
- **Tertiary:** Establish Graphzy — and by extension Graphxy Labs — as a premium, engineering-driven product that stands clearly apart from student-built chatbots and generic tutoring clones.

---

### 5. Target Users

| Segment | Description | Primary need |
|---|---|---|
| High school students (Grades 9–12) | Studying algebra, calculus, chemistry, biology, physics | "Help me *see* why this works" |
| Early undergraduates | STEM intro courses | Faster conceptual grounding before problem sets |
| Self-learners / hobbyists | Khan Academy / YouTube learners | Exploratory, curiosity-driven learning |

Out of scope for the pilot: institutional/classroom accounts, teachers as a distinct role, non-STEM subjects.

---

### 6. Scope

#### MVP (Pilot) Scope
- Text question input (math-focused)
- AI explanation generation (Gemini)
- Desmos-based interactive graph output with sliders for detected variables
- Follow-up question support within a session
- Saved history per user
- Topic-wise dashboard (concepts explored, weak-area tagging)
- Lightweight auth (email/magic link via Supabase Auth)

#### V2 (Post-Pilot) — Graphzy
- Chemistry layer (PubChem + 3Dmol.js)
- Biology layer (Cytoscape.js / SVG pathway diagrams)
- Physics layer (Canvas / Three.js simulations)
- Voice input, auto-generated quizzes, step-by-step hints
- "Explain like I'm 12" mode, difficulty slider
- Daily practice plans, progress analytics

#### Parallel Track — Forkline & Lattice
While Graphzy is in pilot, Graphxy Labs will begin the Forkline and Lattice product specifications (see Roadmap). Lattice is a startup operations platform managing investor pipelines, KPI dashboards, and execution roadmaps. Forkline is a restaurant operations platform. Forkline is a restaurant management and operations platform covering order management, POS integration, table management, inventory tracking, staff management, reporting and analytics, customer loyalty, multi-location operations, and workflow automation. Forkline is listed as Coming Soon on the Graphxy Labs landing page during the Graphzy pilot window.

---

### 7. Key Differentiators (Graphzy)

1. **Interactivity over narration.** Competitors show a video or static diagram; Graphzy lets the student change the input and watch the output respond live.
2. **Subject-aware visual routing.** One input box; the visual engine (graph, molecule, diagram, simulation) is chosen automatically.
3. **Conversational follow-up tied to the visual.** Follow-up questions can reference "this curve" or "this molecule" and the visual updates in context.

---

### 8. Assumptions & Constraints

- Gemini free-tier API rate limits constrain concurrent usage; caching and request batching are required.
- Desmos API usage is free for educational/non-commercial contexts.
- No dedicated backend infra budget — Supabase + Vercel/Render free tiers assumed for pilot.
- Pilot cohort: 200–1,500 users over 4–8 weeks.

---

### 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Gemini free-tier rate limiting under load | Degraded responses | Response caching, queueing, graceful retry UX |
| Subject misclassification | Wrong visual engine, breaks trust | Confidence-based routing + manual "switch lens" option |
| Desmos licensing changes | Core math visualization breaks | Abstract graphing layer so Plotly/D3 can substitute |
| Scope creep into V2 during pilot | Pilot ships late | Hard MVP freeze; V2 items in roadmap only |
| Forkline expectations outpacing Graphzy | Brand dilution | Maintain clear "Coming Soon" status; no pre-launch overpromising |

---

### 10. Success Criteria

See **Success Metrics Document** for full detail. At minimum, the pilot must show: (a) users return to ask follow-ups within a session, (b) a measurable share interact with sliders/visual controls, (c) qualitative feedback confirms the visual was clearer than text alone.

---

### 11. Stakeholders

- **Graphxy Labs Founder / Product Owner:** defines scope, prioritizes roadmap, runs pilot
- **Pilot users:** students providing usage data and qualitative feedback
- **Future contributors:** if open-sourced or team grows — frontend, backend, AI prompt-engineering, and eventually Forkline product roles

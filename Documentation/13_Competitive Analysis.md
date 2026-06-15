# Competitive Analysis

## 1. Landscape Summary

The AI tutoring space is crowded, but almost every player converges on the same core loop: snap a photo or type a question → get a text/video explanation → optionally generate a quiz. Differentiation mostly happens in *breadth of subjects*, *pricing*, and *explanation format* (text vs. pre-rendered video vs. live whiteboard) — not in giving the student a manipulable model of the concept itself.

## 2. Direct & Adjacent Competitors

| Product | Core format | Subjects | Visualization approach | Pricing signal |
|---|---|---|---|---|
| **Gauth** | Photo-based problem solving, chat explanations | Math, biology, physics, chemistry, and others | Text explanations, linked tutorial video library | Free tier + "Gauth Plus" for unlimited/advanced sessions |
| **Astra AI** | Photo + chat, subject-specific explanation styles | Math, chemistry (molecular structures, reactions), physics (forces, energy, motion), biology, languages, geography, history, economics, computer science | Described as "interactive problem-solving" but appears to be primarily structured text explanations, not live manipulable visuals | Subscription (testimonials suggest a paid product) |
| **Numerade / Ace** (via Awesome Agents review) | Chat + large library of educator videos | Middle school through college STEM: math, physics, chemistry, biology, engineering | Surfaces a relevant pre-recorded 3–5 minute educator video alongside the AI explanation for spatial/procedural topics like circuits or molecular structure | Free tier with ads and limited AI access; ~$8–30/month for full access |
| **Flexi (CK-12)** | Free chat tutor | Science and math, with tailored practice and bite-sized lessons | Primarily text/practice-based | Free |
| **ThetaWise** | Chat + side-by-side graphing | Includes Desmos-based graph visualization, plus AI-generated narrated video lessons for any topic | Closest direct overlap — already uses Desmos for math graphing, and offers a "Tutor Mode." Video generation is its differentiator for non-graphable concepts | Free to sign up; paid "Pro" tier with a trial |
| **Studdy AI** | "AI whiteboard tutor" | Math, science, and other subjects, with step-by-step breakdowns on an interactive whiteboard | Whiteboard-style step-by-step visual breakdown — visual *of the solution process*, not a manipulable model of the underlying concept | Free trial, subscription beyond |
| **MathGPT** | Chat + AI-generated video explanations | Algebra, calculus, chemistry, and physics, serving students from elementary through college | On-demand AI-generated videos with animations, diagrams, and voiceover tailored to the specific question | Free product (Cornell-founded) |
| **Studeo / StudAI** | Chat + photo + video/flashcard library | Math, physics, chemistry, and biology | Links to existing video/exercise library rather than generating live interactive visuals | Backed by Sequoia; freemium model implied |
| **Khanmigo / Khan Academy** | Socratic chat tutor, integrated with Khan Academy's existing exercise/video library | All core K-12 subjects | Leverages Khan Academy's large pre-built interactive exercise library (not AI-generated per question) | Low-cost (~$4/month historically) |
| **Wolfram Alpha / Desmos (standalone)** | Computation/graphing tools, not AI tutors | Math-heavy | Best-in-class interactive graphing, but no AI explanation layer wrapped around it | Free / freemium |
| **PhET Simulations (University of Colorado)** | Pre-built interactive simulations | Physics, chemistry, biology, math | Gold-standard hand-built interactive sims, but fixed catalog — not generated per arbitrary question | Free, open source |

## 3. Where Lumen Differs

1. **Live, AI-routed interactivity vs. pre-rendered media.** ThetaWise is the closest comparable in using Desmos, but pairs it with AI-*generated video* for non-graphable topics — a one-way medium. Most others (Numerade, MathGPT, Studeo) lean on video libraries or AI-generated videos as their "visual" answer. Lumen's bet is that a student manipulating a live model (sliders, rotating molecules, running a simulation) builds intuition that watching a video does not, even a well-made one.

2. **Subject-routed visual engines as a core architectural feature**, not just "we cover many subjects." Astra and Studeo both list broad subject coverage, but the *format* of the answer doesn't change much by subject — it's text/chat either way. Lumen explicitly switches its rendering engine (Desmos / 3Dmol.js / Cytoscape / Three.js) based on what would actually help *see* that specific concept.

3. **Narrow, deep MVP vs. broad-but-shallow.** Several competitors (Gauth, Astra, Studeo) claim coverage across 4+ subjects plus languages/humanities from day one — often resulting in inconsistent depth. Lumen's MVP deliberately does *one* subject (math) extremely well before expanding, which is both a scoping discipline and a credible "this is genuinely interactive, not just another chatbot" proof point for a pilot audience.

4. **Dashboard framed around concepts, not just usage.** Most competitors' "progress" features (Numerade, Studeo, Khanmigo) center on quiz scores or watched videos. Lumen's dashboard ties directly to *which concepts were explored and which need revisiting*, derived from the same classification step that powers the visual — no separate analytics system needed.

## 4. Competitive Risks

- **ThetaWise is the most direct threat** to the math MVP specifically — it already combines AI chat with Desmos. Lumen's differentiation there must come from execution quality (the design system, the "thinking → reveal" interaction, slider-first exploration) and from the roadmap toward chemistry/biology/physics visual engines that ThetaWise doesn't appear to offer in the same manipulable way.
- **Free, well-funded incumbents (Khanmigo, CK-12 Flexi)** can absorb the "free AI tutor" positioning easily; Lumen cannot compete on subject breadth or brand trust at pilot stage. The pilot's narrative should lean entirely on the *interactive visual* angle, which none of the reviewed products foreground as their primary hook.
- **PhET-quality simulations are a high bar** for the V2 physics/chemistry/biology layers — Lumen's AI-generated visuals will be simpler than hand-built PhET sims initially; expectations (in copy and onboarding) should be set accordingly ("explore the idea," not "research-grade simulation").

## 5. Positioning Statement (Draft)

> "Most AI tutors tell you the answer, or at best show you a video of someone else exploring it. Lumen lets *you* be the one turning the knob — change a number, rotate a molecule, watch a wave move — and see, instantly, why the answer is what it is."
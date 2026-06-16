# Competitive Analysis
## Graphxy Labs — Graphzy + Serva

This document covers two competitive landscapes: the AI tutoring/visualization space (for Graphzy) and the restaurant management and operations space (for Serva).

---

## Part 1 — Graphzy: AI Visualization & Tutoring

### 1.1 Landscape Summary

The AI tutoring space is crowded, but almost every player converges on the same core loop: snap a photo or type a question → get a text/video explanation → optionally generate a quiz. Differentiation happens mostly in breadth of subjects, pricing, and explanation format (text vs. pre-rendered video vs. live whiteboard) — not in giving the student a manipulable model of the concept itself.

### 1.2 Competitor Map

| Product | Core format | Visualization approach | Pricing signal | Key gap |
|---|---|---|---|---|
| **Gauth** | Photo-based problem solving, chat explanations | Text explanations, linked tutorial video library | Free tier + "Gauth Plus" for unlimited | No live interactive visual — videos are static |
| **Astra AI** | Photo + chat, subject-specific explanations | Described as "interactive" but primarily structured text; not live-manipulable | Subscription | Broad subject coverage, shallow on interactivity depth |
| **Numerade / Ace** | Chat + large educator video library | Surfaces pre-recorded 3–5 min educator videos for spatial topics | Free (ads) + ~$8–30/month | Pre-recorded media — student watches, doesn't interact |
| **Flexi (CK-12)** | Free chat tutor | Primarily text/practice-based | Free | No visualization layer at all |
| **ThetaWise** | Chat + Desmos graphing + AI video lessons | Desmos for math graphs; AI-generated narrated video for non-graphable concepts | Free sign-up; paid Pro tier | Video is still a one-way medium; no slider-driven exploration |
| **Studdy AI** | "AI whiteboard tutor" | Whiteboard-style step-by-step visual breakdowns | Subscription | Shows the *solution process*, not a manipulable model of the concept |
| **MathGPT** | Chat + AI-generated video | On-demand AI-generated videos with animations and diagrams per question | Free (Cornell-founded) | Video output — student watches, doesn't manipulate |
| **Studeo / StudAI** | Chat + photo + video/flashcard library | Links to existing library, not AI-generated live visuals | Sequoia-backed; freemium | Library model: content is static; breadth over depth |
| **Khanmigo / Khan Academy** | Socratic chat tutor + KA exercise library | Leverages Khan Academy's pre-built interactive exercises (not per-question AI visuals) | ~$4/month | Not generative — exercises are pre-built, not generated per arbitrary question |
| **PhET (University of Colorado)** | Pre-built interactive simulations | Gold-standard hand-built interactive sims, broad coverage | Free, open source | Fixed catalog — cannot answer arbitrary questions with a generated simulation |

### 1.3 Where Graphzy Differs

1. **Live, AI-routed interactivity vs. pre-rendered media.** Every competitor's "visual" is a video or static image the student watches. Graphzy's output is a live graph/molecule/simulation the student *changes* — the interaction is the learning event, not a passive delivery.

2. **Subject-routed visual engines as a core architectural feature.** Astra and Studeo list broad subject coverage but the format of the answer doesn't change meaningfully by subject. Graphzy explicitly switches its rendering engine (Desmos / 3Dmol.js / Cytoscape / Three.js) based on what would actually help *see* that concept.

3. **Narrow-and-deep MVP, not wide-and-shallow.** Most competitors ship 4+ subjects from day one at inconsistent quality. Graphzy's MVP does math exceptionally well before expanding — both a scoping discipline and a product credibility signal.

4. **Engineering identity.** Graphzy is built under Graphxy Labs, a company with a clear engineering and product-first brand. Most competitors are either VC-funded consumer apps (Gauth, Studeo) or university/non-profit tools (PhET, CK-12). Graphzy's positioning sits in a distinct space: premium, technical, interactive.

### 1.4 Competitive Risks

- **ThetaWise is the most direct math-MVP threat** — it already combines Desmos with AI chat. Differentiation must come from execution quality (design, interaction fidelity, the slider-first exploration paradigm) and from the chemistry/biology/physics visual roadmap.
- **Well-funded free incumbents (Khanmigo, Flexi)** can absorb "free AI tutor" positioning. Graphzy must stay focused on the *interactive visual* angle rather than competing on breadth or price.
- **PhET-quality simulations are a high bar** for V2 physics/chemistry/biology layers — expectations should be set accordingly in copy and onboarding.

### 1.5 Positioning Statement (Graphzy)

> "Most AI tutors tell you the answer, or show you a video of someone else exploring it. Graphzy lets *you* turn the knob — change a number, rotate a molecule, watch a wave — and see, instantly, why the answer is what it is."

---

## Part 2 — Serva: Restaurant Management & Operations

### 2.1 Landscape Summary

Restaurant management software (often called "restaurant tech" or "hospitality tech") is a mature but fragmented market. Most incumbents win on hardware ecosystem lock-in (POS terminals) or breadth of integrations, not on product design or operator experience quality. There is genuine opportunity for a premium, product-first entrant.

### 2.2 Competitor Map

| Product | Core strengths | Weaknesses | Pricing signal |
|---|---|---|---|
| **Toast** | Dominant US restaurant POS; strong hardware ecosystem; broad integrations; multi-location | Complex onboarding; expensive hardware lock-in; UX feels enterprise-legacy for smaller operators | SaaS subscription + hardware; $0–$165+/month per location |
| **Square for Restaurants** | Accessible for small operators; familiar Square brand; free tier available | Weak on multi-location operations; limited advanced inventory/loyalty; not purpose-built for complex restaurant workflows | Free tier; Plus $60/month |
| **TouchBistro** | Strong table management; iPad-native; good for sit-down restaurants | Less competitive on cloud/online integrations vs. Toast; weaker reporting than enterprise alternatives | ~$69+/month |
| **Lightspeed Restaurant** | Strong inventory tracking; multi-location support; good analytics | Higher pricing complexity; product feels broader than purpose-built | $69–$399+/month |
| **Revel Systems** | Enterprise-grade; strong multi-location; broad POS feature set | Very complex to implement; primarily for large chains; cost prohibitive for SMB | Custom/enterprise pricing |
| **Aloha (NCR Voyix)** | Legacy incumbent; large installed base in full-service restaurants | Dated UX; expensive hardware; slow product iteration | Enterprise |
| **Upserve / Lightspeed (Upserve)** | Strong analytics and reporting for data-driven operators | Acquired and absorbed; brand identity diluted | Part of Lightspeed suite |
| **7shifts** | Best-in-class staff scheduling | Single-purpose tool; not a full management platform | $17.99–$69.99+/month |

### 2.3 Where Serva Differs

1. **Design and product experience as a primary differentiator.** Every incumbent's UX reflects the era it was built in (early 2010s iPad apps, Windows POS terminals). Serva is designed from the ground up with a premium, modern product identity — the kind of operator experience that Toast's price commands but doesn't deliver in usability.

2. **Unified platform without the hardware lock-in.** Toast wins by bundling hardware; Serva's bet is that software-first, hardware-agnostic design — bring your own tablet/terminal — is a more attractive entry point for the 1–50 location operator segment that can't afford enterprise contracts or bespoke hardware rollouts.

3. **Workflow automation built in, not bolted on.** Most competitors treat automation (approval flows, low-stock alerts, staff notifications) as integration add-ons. Serva treats it as core functionality.

4. **Built under Graphxy Labs** — a technology company, not a payments company or a hardware company. This matters for credibility with the operator segment that is increasingly tech-literate and skeptical of being locked into a payments processor.

### 2.4 Competitive Risks

- **Toast's installed base and brand trust** are very strong in the US market. Serva cannot compete on brand awareness at launch; differentiation must be earned through product quality and word-of-mouth.
- **Square's free tier** makes it the default for new/small operators; Serva needs a compelling entry tier to compete at that bottom end, or should focus on the 5–50 location "modern SMB" segment above the Square floor.
- **Multi-location complexity** is where most competitors stumble; if Serva ships this well early, it becomes a strong hook for growing restaurant groups.

### 2.5 Positioning Statement (Serva)

> "Restaurant management software built for operators who care about both the guest experience and the operational one. Serva is what happens when a premium product company decides to build for hospitality."

---

## Part 3 — Graphxy Labs Company Positioning

### 3.1 Where Graphxy Labs Fits

Graphxy Labs is not competing as a systems integrator, a freelance agency, or a generic software consultancy. The competitive reference point for the company brand is the class of modern, premium product companies (Linear, Vercel, Clerk, Raycast) that have built strong engineering-first identities before scaling. The company's portfolio approach — Graphzy (visualization) + Serva (restaurant operations) + eight technology service verticals — positions it as a full-spectrum product and engineering studio, not a single-product startup.

### 3.2 Company Differentiators

- Product-first, engineering-driven — every product is designed and built in-house, not outsourced.
- Premium visual identity applied consistently across products (Graphzy, Serva) and the corporate brand.
- Cross-vertical technical depth: ML/AI, data visualization, management systems, mobile, web — Graphxy Labs can credibly serve clients across these areas while building its own flagship products.

### 3.3 Company-Level Competitive Risk

The company-as-agency risk: if Graphxy Labs takes on too many client service engagements before Graphzy and Serva reach meaningful scale, the brand risks reading as a consultancy rather than a product company. Mitigation: client work is scoped to fund product R&D, not to define the company's identity — the public brand always leads with products (Graphzy, Serva), and services are listed second.

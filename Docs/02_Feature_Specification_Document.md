# Feature Specification Document
## Graphzy — Visualization Platform by Graphxy Labs

Scope: MVP (Math-first pilot). V2 features are listed at the end. This document covers Graphzy only; Serva feature specs are a separate document produced during the Serva pre-development phase.

---

## 1. Question Input

**Description:** A single input where a student types a question or topic ("Why does y = x² look like a U shape?", "Show me sin(x) and how amplitude changes it").

**Behavior:**
- Accepts free text, min 3 characters, max ~500 characters.
- Image upload (handwritten/typed problem) is a V1.1 addition — text input only at launch.
- On submit, input is locked and a "thinking" state is shown (see Interaction Design Doc).

**Acceptance criteria:**
- Empty or whitespace-only input is rejected with inline message: "Type a question to get started."
- Input persists in the session if the request fails, so the user doesn't retype.

---

## 2. Subject & Topic Classification

**Description:** The AI Tutor Layer determines the subject domain and the specific concept(s) involved.

**Behavior:**
- Gemini call returns structured JSON: `{ subject: "math" | "chemistry" | "biology" | "physics", confidence: 0-1, concepts: string[] }`.
- For MVP, only `subject = "math"` routes to a full visual; other subjects return explanation text plus: "Visual support for [subject] is coming — here's the explanation."
- If confidence < 0.6, the user sees a quick confirmation prompt rather than a hard error.

**Acceptance criteria:**
- Classification completes in under ~4 seconds for 95% of requests.
- Misclassified requests degrade gracefully — never a hard error.

---

## 3. Concept Breakdown & Explanation Generation

**Description:** Gemini generates a structured explanation: a plain-language summary, the key relationship/formula, and (for math) the Desmos expressions and interactive parameters.

**Output schema (target):**
```json
{
  "summary": "string (2–4 sentences, plain language)",
  "key_idea": "string (one sentence — the aha)",
  "expressions": ["y=a*x^2+b", "..."],
  "sliders": [
    { "variable": "a", "min": -5, "max": 5, "default": 1, "step": 0.1, "label": "Stretch (a)" }
  ],
  "follow_up_suggestions": ["What if a is negative?", "..."]
}
```

**Acceptance criteria:**
- Explanation text capped at ~120 words for the initial answer.
- At least one slider suggested whenever the expression contains a variable parameter.
- `follow_up_suggestions` always returns 2–3 items.

---

## 4. Math Visualization (Desmos)

**Description:** Renders the Desmos calculator embedded in the result view using `expressions` and `sliders` returned by AI.

**Behavior:**
- Desmos API initialized once per session; expressions updated via `setExpression`.
- Sliders rendered as Desmos native sliders bound to the same variable names.
- Graph auto-fits viewport based on expression type.

**Acceptance criteria:**
- Changing a slider updates the graph with no perceptible lag.
- If Desmos fails to load, fall back to a static description: "Interactive graph unavailable — here's what changes: [text]."

---

## 5. Follow-up Questions

**Description:** After the initial explanation, the user can ask follow-ups that reference the current topic/visual.

**Behavior:**
- Follow-up requests include prior explanation context in the Gemini call.
- AI can respond with updated text, updated/additional Desmos expressions, or a new slider.
- Capped at 6 follow-ups per topic session (cost control); beyond that, user is prompted to start a new topic.

**Acceptance criteria:**
- Follow-up responses arrive without reloading the graph from scratch.
- Follow-up count and "new topic" affordance are visible at all times.

---

## 6. History

**Description:** Every topic asked is saved automatically to the user's account.

**Behavior:**
- Stored on first AI response — no explicit "save" action required.
- Listed in reverse-chronological order with subject tag, auto-generated title, and timestamp.
- Clicking a history item reopens explanation and graph in its last slider state.

**Acceptance criteria:**
- History loads in under 1 second for up to 200 saved items.
- Deleting a history item is a soft delete (data retained 30 days in backend, not exposed in MVP UI).

---

## 7. Topic-wise Dashboard

**Description:** Summary view showing what the student has explored, grouped by concept.

**Behavior (MVP):**
- Count of questions asked per subject.
- List of distinct concepts touched (from the `concepts` field returned at classification).
- Weak-area flag: topic flagged if the user asked 2+ confusion-signal follow-ups (heuristic keyword check, not a separate model call).

**Acceptance criteria:**
- Dashboard reflects history in the same session without a page refresh.
- Empty state shown for new users.

---

## 8. Authentication

**Description:** Lightweight account system so history and dashboard persist across sessions.

**Behavior:**
- Email + password or magic link via Supabase Auth.
- Guest usage allowed for the first question; prompted to sign up before persisting history beyond one session.
- Guest session merged into account immediately after sign-up.

---

## V2 Features (Reference Only)

| Feature | Summary |
|---|---|
| Chemistry Layer | PubChem PUG REST → 3Dmol.js molecule rendering; reaction concept explanations |
| Biology Layer | Cytoscape.js / SVG pathway, cycle, and network diagrams |
| Physics Layer | Canvas / Three.js simulations for motion, waves, forces, circuits |
| Voice Input | Browser speech-to-text into the same question pipeline |
| Auto Quizzes | Gemini-generated 3–5 question quizzes per topic, scored, feeding dashboard |
| Step-by-step Hints | Progressive reveal of solution steps |
| "Explain Like I'm 12" | Tone/complexity toggle on explanation generation prompt |
| Difficulty Slider | Adjusts depth of explanation and follow-up complexity |
| Daily Practice Plan | Scheduled topic suggestions based on dashboard weak areas |
| Progress Analytics | Trends over time: topics mastered, time spent, quiz scores |

---

*Serva feature specifications are maintained as a separate document. This file covers Graphzy only.*

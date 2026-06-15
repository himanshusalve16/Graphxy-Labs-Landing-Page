# Feature Specification Document

Scope: MVP (Math-first pilot). V2 features are listed at the end for context but are not specified in full detail here.

---

## 1. Question Input

**Description:** A single input where a student types a question or topic ("Why does y = x² look like a U shape?", "Show me sin(x) and how amplitude changes it").

**Behavior:**
- Accepts free text, min 3 characters, max ~500 characters.
- Optional: upload an image of a handwritten/typed problem (V1.1, not blocking MVP — text input only for launch).
- On submit, input is locked and a "thinking" state is shown (see Interaction Design Doc).

**Acceptance criteria:**
- Empty or whitespace-only input is rejected with inline message: "Type a question to get started."
- Input persists in the session if the request fails, so the user doesn't retype.

---

## 2. Subject & Topic Classification

**Description:** The AI Tutor Layer determines the subject domain and the specific concept(s) involved.

**Behavior:**
- Gemini call returns structured JSON: `{ subject: "math" | "chemistry" | "biology" | "physics", confidence: 0-1, concepts: string[] }`.
- For MVP, only `subject = "math"` routes to a full visual; other subjects return explanation text plus a message: "Visual support for [subject] is coming soon — here's the explanation."
- If confidence < 0.6, the user is shown a quick confirmation: "Is this a math question?" with Yes/No, defaulting to text-only explanation if "No" or unanswered.

**Acceptance criteria:**
- Classification call completes in under ~4 seconds for 95% of requests (subject to Gemini latency).
- Misclassified requests degrade gracefully — never a hard error.

---

## 3. Concept Breakdown & Explanation Generation

**Description:** Given the classified topic, Gemini generates a structured explanation: a short plain-language summary, the key relationship/formula, and (for math) the Desmos expressions and suggested interactive parameters.

**Output schema (target):**
```json
{
  "summary": "string (2-4 sentences, plain language)",
  "key_idea": "string (one sentence — the 'aha')",
  "expressions": ["y=a*x^2+b", "..."],
  "sliders": [
    { "variable": "a", "min": -5, "max": 5, "default": 1, "step": 0.1, "label": "Stretch (a)" }
  ],
  "follow_up_suggestions": ["What if a is negative?", "..."]
}
```

**Acceptance criteria:**
- Explanation text is capped at ~120 words for the initial answer (detail is added via follow-ups, not a wall of text upfront).
- At least one slider is suggested whenever the expression contains a variable parameter.
- `follow_up_suggestions` always returns 2–3 items to seed the next interaction.

---

## 4. Math Visualization (Desmos)

**Description:** Renders the Desmos calculator embedded in the result view using the `expressions` returned by the AI, with slider controls bound to `sliders`.

**Behavior:**
- Desmos API initialized once per session; expressions updated via `setExpression`.
- Sliders rendered as native Desmos sliders bound to the same variable names used in expressions.
- Graph auto-fits the viewport to a sensible default zoom based on expression type (detected heuristically: trig → wider x-range, polynomial → centered on roots/vertex if computable).

**Acceptance criteria:**
- Changing a slider updates the graph with no perceptible lag (Desmos native behavior).
- If Desmos fails to load (network/CDN issue), fall back to a static description: "Interactive graph unavailable — here's what changes: [text]."

---

## 5. Follow-up Questions

**Description:** After the initial explanation, the user can ask follow-ups that reference the current topic/visual ("What if a is negative?", "Why does the vertex move?").

**Behavior:**
- Follow-up requests include the prior explanation context (summary + expressions) in the Gemini call so responses stay relevant.
- The AI can respond with: (a) updated text only, (b) updated/additional Desmos expressions, or (c) a new suggested slider.
- Conversation is capped at 6 follow-ups per topic for the pilot (cost control); beyond that, the user is prompted to start a new topic.

**Acceptance criteria:**
- Follow-up responses arrive without reloading the graph from scratch — expressions are added/updated incrementally.
- Follow-up count and a "new topic" affordance are visible to the user at all times.

---

## 6. History

**Description:** Every asked topic (question + final explanation + key expressions) is saved to the user's account.

**Behavior:**
- Stored automatically on first AI response (no explicit "save" action required).
- Listed in reverse-chronological order with subject tag, a short title (auto-generated from the question), and timestamp.
- Clicking a history item reopens the explanation and graph in the same state (sliders restored to their last values).

**Acceptance criteria:**
- History loads in under 1 second for up to 200 saved items (pagination beyond that).
- Deleting a history item is a soft delete (recoverable for 30 days) — out of scope to expose "recover" UI in MVP, but the data model supports it.

---

## 7. Topic-wise Dashboard

**Description:** A summary view showing what the student has explored, grouped by subject and topic.

**Behavior (MVP scope):**
- Count of questions asked per subject (math only meaningfully populated in MVP).
- List of distinct topics/concepts touched (derived from the `concepts` field returned at classification time).
- Simple "weak area" flag: a topic is flagged if the user asked 2+ follow-ups expressing confusion (heuristic: follow-up phrased as "I still don't understand X" / "why" repeated) — computed via a lightweight keyword/intent check, not a separate model call, to control cost.

**Acceptance criteria:**
- Dashboard reflects history within the same session without requiring a page refresh.
- Empty state ("No topics yet — ask your first question") is shown for new users.

---

## 8. Authentication

**Description:** Lightweight account system so history/dashboard persist across sessions.

**Behavior:**
- Email + password or magic link via Supabase Auth.
- Anonymous/guest usage allowed for the first question (to reduce friction), prompting sign-up before saving history beyond one session.

**Acceptance criteria:**
- A guest's first session is preserved (e.g., via local storage) and merged into their account if they sign up immediately after.

---

## V2 Features (Reference Only)

| Feature | Summary |
|---|---|
| Chemistry Layer | SMILES lookup via PubChem PUG REST → 3Dmol.js molecule rendering; reaction concept explanations |
| Biology Layer | Cytoscape.js/SVG diagrams for pathways, cycles, and simple networks |
| Physics Layer | Canvas/Three.js simulations for motion, waves, forces, circuits |
| Voice Input | Browser speech-to-text feeding the same question pipeline |
| Auto Quizzes | Gemini-generated 3–5 question quizzes per topic, scored, feeding dashboard |
| Step-by-step Hints | Progressive reveal of solution steps rather than full explanation upfront |
| "Explain Like I'm 12" | Tone/complexity toggle on explanation generation prompt |
| Difficulty Slider | Adjusts depth of explanation and follow-up suggestion complexity |
| Daily Practice Plan | Scheduled topic suggestions based on dashboard weak areas |
| Progress Analytics | Trends over time: topics mastered, time spent, quiz scores |
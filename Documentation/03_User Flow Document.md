# User Flow Document

This document covers the primary flows for the MVP pilot: asking a question, viewing the interactive explanation, follow-up interaction, history, and the dashboard. Diagrams are written in Mermaid syntax for easy rendering.

---

## 1. Primary Flow — Ask → Explanation → Visual

```mermaid
flowchart TD
    A[User lands on Home/Ask screen] --> B[User types a question]
    B --> C{Guest or signed in?}
    C -->|Guest| D[Proceed, session stored locally]
    C -->|Signed in| E[Proceed, session tied to account]
    D --> F[Submit question]
    E --> F
    F --> G[Show 'thinking' state]
    G --> H[AI classifies subject + concepts]
    H --> I{Subject = Math AND confidence high?}
    I -->|Yes| J[AI generates explanation + Desmos expressions + sliders]
    I -->|No / low confidence| K[Show text explanation only + 'visual coming soon' note]
    J --> L[Render explanation panel + Desmos graph + sliders]
    K --> L2[Render explanation panel only]
    L --> M[Save to history if signed in]
    L2 --> M
    M --> N[User explores: drag sliders, read explanation]
    N --> O[Follow-up question box visible with suggestions]
```

---

## 2. Follow-up Interaction Flow

```mermaid
flowchart TD
    A[User on explanation screen] --> B{Action}
    B -->|Drag slider| C[Desmos updates graph instantly — no AI call]
    B -->|Tap suggested follow-up| D[Send follow-up + prior context to AI]
    B -->|Type custom follow-up| D
    D --> E[Show inline 'thinking' indicator near chat]
    E --> F[AI returns updated text and/or new expressions/sliders]
    F --> G[Append explanation text below original]
    F --> H{New expressions returned?}
    H -->|Yes| I[Add/update Desmos expressions, keep existing ones]
    H -->|No| J[Graph unchanged]
    I --> K[Update follow-up suggestions]
    J --> K
    K --> L{Follow-up count >= 6?}
    L -->|Yes| M[Disable follow-up input, prompt 'Start a new topic']
    L -->|No| N[Follow-up input remains active]
```

---

## 3. History Flow

```mermaid
flowchart TD
    A[User opens History] --> B[List of past topics, newest first]
    B --> C{User taps a topic}
    C --> D[Reopen explanation screen]
    D --> E[Restore explanation text]
    D --> F[Restore Desmos expressions + slider positions]
    E --> G[Follow-up input re-enabled, counter resets per session]
    F --> G
    B --> H{User taps delete on a topic}
    H --> I[Soft-delete: remove from list, recoverable for 30 days]
```

---

## 4. Dashboard Flow

```mermaid
flowchart TD
    A[User opens Dashboard] --> B[Fetch aggregate stats: topics by subject]
    B --> C{Any history exists?}
    C -->|No| D[Show empty state: 'Ask your first question']
    C -->|Yes| E[Show subject breakdown cards]
    E --> F[Show list of explored topics/concepts]
    F --> G[Show flagged 'weak areas' if any]
    G --> H{User taps a topic or weak area}
    H --> I[Jump to that topic's saved explanation]
    G --> J{User taps 'Ask about this' on a weak area}
    J --> K[Pre-fill Home/Ask input with a suggested follow-up question]
```

---

## 5. Error & Edge Case Flows

```mermaid
flowchart TD
    A[Request fails: rate limit / network / AI error] --> B{Type}
    B -->|Rate limit| C[Show: 'A lot of people are learning right now — try again in a moment' + retry button]
    B -->|Network| D[Show: 'Connection issue — check your network' + retry]
    B -->|AI returns malformed JSON| E[Retry once automatically with stricter prompt]
    E --> F{Second attempt succeeds?}
    F -->|Yes| G[Proceed normally]
    F -->|No| H[Show text-only fallback: 'Here's what we can tell you' + raw explanation if available]
```

---

## 6. End-to-End Session Example (Narrative)

1. A guest user lands on the Home screen and types: *"Why does increasing 'a' in y = ax² make the parabola narrower?"*
2. The app shows a brief "thinking" animation (1–3 seconds).
3. Classification returns `subject: math, confidence: 0.95, concepts: ["quadratic functions", "vertical stretch"]`.
4. The explanation panel renders a 2–3 sentence summary and the key idea ("Multiplying by a larger `a` stretches the parabola vertically, making it look narrower").
5. A Desmos graph appears showing `y = a*x^2` with a slider for `a` from -5 to 5.
6. The user drags the slider — the graph updates instantly, no AI call.
7. The user taps a suggested follow-up: *"What happens if a is negative?"*
8. The AI responds with updated text ("A negative `a` flips the parabola to open downward") — Desmos already shows this when the slider goes negative, so no new expression is needed.
9. The session is saved to history automatically (prompted to sign up if guest, to keep it).
10. Later, the user opens the Dashboard and sees "Quadratic functions" listed under Math, with this topic available to revisit.
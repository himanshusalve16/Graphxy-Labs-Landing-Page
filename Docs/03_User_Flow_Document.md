# User Flow Document
## Graphzy — Visualization Platform by Graphxy Labs

This document covers the primary flows for the MVP pilot: asking a question, viewing the interactive explanation, follow-up interaction, history, and dashboard. Diagrams are written in Mermaid syntax.

---

## 1. Primary Flow — Ask → Explanation → Visual

```mermaid
flowchart TD
    A[User lands on Graphzy — Home/Ask screen] --> B[User types a question]
    B --> C{Guest or signed in?}
    C -->|Guest| D[Proceed, session stored locally]
    C -->|Signed in| E[Proceed, session tied to account]
    D --> F[Submit question]
    E --> F
    F --> G[Show thinking state]
    G --> H[AI classifies subject + concepts]
    H --> I{Subject = Math AND confidence high?}
    I -->|Yes| J[AI generates explanation + Desmos expressions + sliders]
    I -->|No / low confidence| K[Show text explanation only + coming soon note]
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
    A[User on Graphzy explanation screen] --> B{Action}
    B -->|Drag slider| C[Desmos updates graph instantly — no AI call]
    B -->|Tap suggested follow-up| D[Send follow-up + prior context to AI]
    B -->|Type custom follow-up| D
    D --> E[Show inline thinking indicator near chat]
    E --> F[AI returns updated text and/or new expressions/sliders]
    F --> G[Append explanation text below original]
    F --> H{New expressions returned?}
    H -->|Yes| I[Add/update Desmos expressions, keep existing]
    H -->|No| J[Graph unchanged]
    I --> K[Update follow-up suggestions]
    J --> K
    K --> L{Follow-up count >= 6?}
    L -->|Yes| M[Disable follow-up input, prompt Start a new topic]
    L -->|No| N[Follow-up input remains active]
```

---

## 3. History Flow

```mermaid
flowchart TD
    A[User opens History in Graphzy] --> B[List of past topics, newest first]
    B --> C{User taps a topic}
    C --> D[Reopen explanation screen]
    D --> E[Restore explanation text]
    D --> F[Restore Desmos expressions + slider positions]
    E --> G[Follow-up input re-enabled, counter resets per session]
    F --> G
    B --> H{User taps delete on a topic}
    H --> I[Soft-delete: remove from list, recoverable 30 days]
```

---

## 4. Dashboard Flow

```mermaid
flowchart TD
    A[User opens Dashboard in Graphzy] --> B[Fetch aggregate stats: topics by subject]
    B --> C{Any history exists?}
    C -->|No| D[Show empty state: Ask your first question]
    C -->|Yes| E[Show subject breakdown cards]
    E --> F[Show list of explored concepts]
    F --> G[Show flagged weak areas if any]
    G --> H{User taps a topic or weak area}
    H --> I[Jump to that topic saved explanation]
    G --> J{User taps Ask about this on a weak area}
    J --> K[Pre-fill Home/Ask input with a suggested follow-up question]
```

---

## 5. Graphxy Labs Landing Page Flow

```mermaid
flowchart TD
    A[User lands on graphxylabs.com] --> B[Hero section: who we are + what we build]
    B --> C[Products section]
    C --> D[Graphzy card: Explore Graphzy / Join Early Access]
    C --> E[Serva card: Join Serva Waitlist]
    D --> F[Route to /graphzy — Graphzy product page / app]
    E --> G[Route to /serva — Serva waitlist page]
    B --> H[Services/Verticals section: 8 verticals]
    H --> I[User scrolls or navigates to a vertical]
    I --> J[Contact / Inquiry CTA for that vertical]
```

---

## 6. Error & Edge Case Flows

```mermaid
flowchart TD
    A[Request fails: rate limit / network / AI error] --> B{Type}
    B -->|Rate limit| C[Show: A lot of people are exploring right now — try again in a moment + retry button]
    B -->|Network| D[Show: Connection issue — check your network + retry]
    B -->|AI returns malformed JSON| E[Retry once automatically with stricter prompt]
    E --> F{Second attempt succeeds?}
    F -->|Yes| G[Proceed normally]
    F -->|No| H[Show text-only fallback: Heres what we can tell you + raw explanation if available]
```

---

## 7. End-to-End Session Example (Narrative)

1. A guest user lands on Graphzy (via graphxylabs.com/graphzy or graphzy.io) and types: *"Why does increasing 'a' in y = ax² make the parabola narrower?"*
2. The app shows a brief thinking animation (1–3 seconds).
3. Classification returns `subject: math, confidence: 0.95, concepts: ["quadratic functions", "vertical stretch"]`.
4. The explanation panel renders a 2–3 sentence summary and the key idea.
5. A Desmos graph appears showing `y = a*x^2` with a slider for `a` from -5 to 5.
6. The user drags the slider — the graph updates instantly.
7. The user taps a suggested follow-up: *"What happens if a is negative?"*
8. The AI responds and the canvas highlights to signal the visual responded.
9. The session is saved; user is prompted to sign up to keep it.
10. Later, the user opens the Dashboard and sees "Quadratic functions" listed under Math.

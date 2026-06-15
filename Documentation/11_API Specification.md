# API Specification

Base URL (pilot): `https://api.lumen-app.example/v1` (placeholder — backend on Render/Fly.io)

All endpoints (except `/health`) require a Supabase JWT in `Authorization: Bearer <token>` for signed-in users. Guest usage is supported via an `X-Guest-Session-Id` header (a client-generated UUID stored in local storage) for endpoints marked **Guest OK**.

---

## POST `/ask`
**Guest OK**

Submits a new question. Runs classification + explanation generation, creates a `session` (and `visual_states` if math), returns the full result.

**Request body:**
```json
{
  "question": "Why does increasing a in y = ax^2 make the parabola narrower?"
}
```

**Response `200`:**
```json
{
  "session_id": "uuid",
  "subject": "math",
  "confidence": 0.95,
  "concepts": ["quadratic functions", "vertical stretch"],
  "summary": "Multiplying x^2 by a larger value of a stretches the graph vertically...",
  "key_idea": "A larger |a| makes the parabola appear narrower because y grows faster for the same x.",
  "expressions": ["y=a*x^2"],
  "sliders": [
    { "variable": "a", "min": -5, "max": 5, "default": 1, "step": 0.1, "label": "Stretch (a)" }
  ],
  "follow_up_suggestions": [
    "What happens if a is negative?",
    "What if we add a constant, like y = ax^2 + c?"
  ]
}
```

**Errors:**
- `400` — empty/invalid question
- `429` — rate limited (Gemini free tier exhausted); response includes `retry_after_seconds`
- `502` — AI returned invalid response after retry; falls back to `{ "summary": "...", "expressions": [], "sliders": [] }` with `"degraded": true`

---

## POST `/sessions/:session_id/follow-up`
**Guest OK** (guest sessions identified via `X-Guest-Session-Id`)

Submits a follow-up question within an existing session.

**Request body:**
```json
{ "question": "What if a is negative?" }
```

**Response `200`:**
```json
{
  "sequence_number": 1,
  "response_text": "When a is negative, the parabola flips and opens downward instead of upward.",
  "new_expressions": [],
  "new_sliders": [],
  "follow_up_suggestions": ["What if a = 0?"]
}
```

**Errors:**
- `403` — follow-up cap reached (sequence_number > 6): `{ "error": "follow_up_limit_reached" }`
- `404` — session not found / not owned by this user or guest
- `429`, `502` — as above

---

## GET `/sessions`
**Auth required**

Returns the signed-in user's session history, most recent first.

**Query params:** `limit` (default 20, max 100), `offset`, `subject` (optional filter)

**Response `200`:**
```json
{
  "sessions": [
    {
      "session_id": "uuid",
      "question": "Why does increasing a in y = ax^2 make the parabola narrower?",
      "subject": "math",
      "concepts": ["quadratic functions", "vertical stretch"],
      "created_at": "2026-06-10T12:00:00Z"
    }
  ],
  "total": 42
}
```

---

## GET `/sessions/:session_id`
**Auth required, or Guest OK if matching guest session**

Returns the full session detail for reopening (explanation, expressions, sliders, last slider values, follow-up thread).

**Response `200`:**
```json
{
  "session_id": "uuid",
  "question": "...",
  "subject": "math",
  "summary": "...",
  "key_idea": "...",
  "expressions": ["y=a*x^2"],
  "sliders": [{ "variable": "a", "min": -5, "max": 5, "default": 1, "step": 0.1, "label": "Stretch (a)" }],
  "slider_values_last": { "a": 2.3 },
  "follow_ups": [
    { "question": "What if a is negative?", "response_text": "...", "sequence_number": 1, "created_at": "..." }
  ]
}
```

---

## DELETE `/sessions/:session_id`
**Auth required**

Soft-deletes a session (sets `is_deleted = true`, `deleted_at = now()`).

**Response:** `204 No Content`

---

## PATCH `/sessions/:session_id/slider-state`
**Guest OK**

Persists the latest slider values so reopening a session restores the user's last configuration. Called on slider-change with debounce (e.g., 1s) — not on every drag tick.

**Request body:**
```json
{ "slider_values": { "a": 2.3 } }
```

**Response:** `204 No Content`

---

## GET `/dashboard`
**Auth required**

Returns aggregated dashboard data for the signed-in user.

**Response `200`:**
```json
{
  "subject_counts": { "math": 12, "chemistry": 0, "biology": 0, "physics": 0 },
  "concepts": [
    { "name": "quadratic functions", "subject": "math", "session_count": 4 },
    { "name": "vertical stretch", "subject": "math", "session_count": 2 }
  ],
  "weak_areas": [
    {
      "session_id": "uuid",
      "question": "Why does increasing a in y = ax^2 make the parabola narrower?",
      "reason": "Multiple clarifying follow-ups"
    }
  ]
}
```

---

## POST `/auth/merge-guest`
**Auth required**

Called immediately after a guest signs up. Reassigns guest-owned sessions (matched by `X-Guest-Session-Id`) to the now-authenticated `user_id`.

**Request body:**
```json
{ "guest_session_id": "uuid" }
```

**Response:** `204 No Content`

---

## GET `/health`

No auth required. Returns `{ "status": "ok" }` for uptime monitoring.

---

## Rate Limiting & Errors (Global Conventions)

- All AI-backed endpoints (`/ask`, `/follow-up`) may return `429` with body `{ "error": "rate_limited", "retry_after_seconds": N }`. The frontend should show the friendly "lots of people learning right now" message from the User Flow doc and auto-retry once after `retry_after_seconds`.
- All error responses follow `{ "error": "<machine_readable_code>", "message": "<human readable>" }`.
- `502` (`ai_response_invalid`) includes whatever partial/degraded content could be salvaged, with `"degraded": true`, so the frontend always has *something* to show.

## V2 Additions (Reference)

- `POST /sessions/:session_id/quiz` — generate a quiz for the session's concepts
- `POST /quiz-attempts` — submit quiz answers, returns score
- `GET /practice-plan` — today's suggested topics
- `POST /sessions` with `subject_hint` — for chemistry/biology/physics once those layers exist, allowing client-side pre-routing
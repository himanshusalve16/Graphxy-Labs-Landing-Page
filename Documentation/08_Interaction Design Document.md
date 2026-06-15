# Interaction Design Document

This document specifies micro-interactions, motion, and state transitions — the texture that makes the product feel "premium and calm" rather than templated. All timings/easings are starting points to be tuned against feel, not strict requirements.

---

## 1. Question Input

| State | Behavior |
|---|---|
| **Default** | Large, centered input with placeholder text that rotates through example prompts every ~4s (subtle fade, not jarring) — e.g., "Why is the graph of y=x² a U shape?" → "Show me how sin(x) changes with amplitude" |
| **Focus** | Border/ring transitions to the active subject-accent color (default: math blue) over 150ms; placeholder fades out |
| **Typing** | No live validation noise; character count only appears near the 500-char limit |
| **Submit** | Input field smoothly collapses/moves to a compact "breadcrumb" position at the top of the result view (shared element transition, ~300ms ease-out) — reinforces continuity rather than a hard page change |

## 2. "Thinking" State

This is the single most important moment to get right — it's the gap between asking and the visual appearing, and it sets the tone for the whole product.

- Avoid generic spinners. Use a **subtle pulsing glow** behind the (now-collapsed) question, in a neutral tone — not yet subject-colored, since the subject isn't confirmed yet.
- Microcopy rotates gently every ~2s through short, calm phrases: "Reading your question…" → "Finding the right way to show this…" → "Almost there…" — never jokey, never long.
- Target perceived wait: under 4 seconds. If it exceeds ~6 seconds, microcopy shifts to acknowledge it: "This one's taking a little longer…"
- On completion, the glow resolves into the subject-accent color as the explanation panel and visual canvas fade+rise into place (Framer Motion: opacity 0→1, y +12px→0, ~250ms, staggered ~80ms between explanation and canvas so the canvas feels like it "arrives" just after the text).

## 3. Visual Canvas Entrance

- The Desmos canvas container (glass card) is present in skeleton form (rounded rect, soft shimmer) even during "thinking," so its size/position doesn't jump when content arrives — only its contents fade in.
- Sliders animate in with a slight stagger (~50ms each) after the graph itself renders, drawing the eye toward "these are interactive."

## 4. Slider Interaction

- Dragging a slider is instant (native Desmos behavior) — no app-level debounce on the visual update.
- A small live value label follows the slider thumb while dragging (e.g., "a = 2.3"), fading out ~500ms after release.
- Slider state persistence (`PATCH /sessions/:id/slider-state`) is debounced at 1s after the last change — invisible to the user, no loading indicator.
- First-time hint: the first time a user reaches a result with sliders, a single small tooltip/pulse on the slider says "Drag to explore" — dismisses on first interaction and never shows again (stored per-user/local storage).

## 5. Follow-up Interaction

- Suggested follow-ups render as **pill/chip buttons** below the explanation — tapping one fills and auto-submits (no extra confirmation step, since the text is already a complete question).
- Custom follow-up input is a smaller, secondary-styled field directly below the chips — visually subordinate to the primary question input's styling, signaling "this is a continuation, not a new start."
- New follow-up responses append below the previous content with a fade+rise (~200ms) and the view auto-scrolls just enough to bring the new content into view (not a hard jump to bottom).
- If new Desmos expressions are added, the canvas briefly highlights (a soft 1px ring pulse in the subject-accent color, ~600ms) to draw attention back to the visual — this is the key moment reinforcing "the visual responded to your question."
- Follow-up counter (e.g., "3 of 6 follow-ups") appears small and unobtrusive near the input — only becomes prominent (color shift to a neutral warning tone, never red/alarming) at 5/6 and 6/6.

## 6. Subject Lens Indicator

- A small tag near the question breadcrumb shows the detected subject (e.g., "Math") in its accent color — pill shape, subject-accent background at low opacity, accent-colored text.
- If confidence is low and the app asks for confirmation ("Is this a math question?"), this is presented as two small inline buttons (Yes/No) directly under the explanation — not a modal. Choosing "No" gracefully removes the visual canvas (fade out, ~200ms) and expands the explanation text to fill the space.

## 7. History List

- Each history item is a card with a subtle hover/press elevation change (shadow grows slightly, ~1-2px translateY on hover for desktop; press-state scale 0.98 on mobile tap).
- Subject tag uses the same accent-color convention as the lens indicator, giving instant visual scanability of "what kind of question was this."
- Deleting an item: the card fades and collapses height smoothly (~250ms) rather than disappearing instantly — gives a sense of "undo window" even though undo isn't exposed in MVP UI.

## 8. Dashboard

- Subject count cards use a gentle count-up animation on first load (numbers animate from 0 to their value over ~600ms) — the one place where a bit of "delight" motion is appropriate, since it's a summary/reward moment.
- "Weak area" items use the amber/warning accent sparingly — a small dot or left-border accent, not a full-card warning treatment, to avoid making the dashboard feel like a report card.
- Empty states (no history yet) show a single calm illustration/icon + one-line copy + a button that routes to Home — no multi-paragraph onboarding text.

## 9. Error & Edge States

- Rate-limit / network errors appear as an **inline banner above the input**, not a modal or toast that disappears before being read. Includes a retry button.
- Errors never use red as a dominant color — a muted neutral-warm tone with an icon communicates "something needs attention" without alarming a student mid-study session.
- If the AI response is "degraded" (text-only fallback), the canvas area shows a quiet placeholder state: icon + "Interactive visual unavailable for this one — here's the explanation" rather than an empty box.

## 10. Motion Principles Summary

- **Settle, don't bounce.** All easing curves are ease-out for entrances, ease-in-out for state changes — no spring/overshoot.
- **One orchestrated moment per screen.** The "thinking → reveal" sequence on the result view is the signature motion moment; everything else (hovers, slider drags, list interactions) is quick (<200ms) and subordinate.
- **Respect reduced motion.** All entrance animations degrade to simple opacity fades (no y-translation) when `prefers-reduced-motion` is set.
- **Color signals subject, not state.** Accent colors are reserved for subject identity (math/chem/bio/physics) and should not double as success/error indicators — those use neutral tones as described above.
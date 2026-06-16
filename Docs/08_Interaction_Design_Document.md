# Interaction Design Document
## Graphzy — Visualization Platform by Graphxy Labs

All interaction patterns are calibrated to the Graphxy Labs design philosophy: calm precision, restrained motion, and editorial clarity. Nothing should feel like a template or a generic SaaS product.

---

## 1. Question Input

| State | Behavior |
|---|---|
| **Default** | Large, centered input with placeholder text rotating through example prompts every ~4s (subtle opacity fade only) — "Why is the graph of y=x² a U shape?" → "Show me how sin(x) changes with amplitude" |
| **Focus** | Border/ring transitions to the Graphzy subject-accent color (default: math blue) over 150ms; placeholder fades out |
| **Typing** | No live validation noise; character count only appears near the 500-char limit |
| **Submit** | Input field smoothly collapses to a compact breadcrumb position at the top of the result view (shared element transition, ~300ms ease-out) |

---

## 2. Thinking State

The most important moment in the product — the gap between asking and the visual appearing.

- No generic spinners. A subtle pulsing glow behind the collapsed question in a neutral tone (subject color not yet determined).
- Microcopy rotates every ~2s: "Reading your question…" → "Finding the right way to show this…" → "Almost there…"
- Target perceived wait: under 4 seconds. At ~6 seconds: "This one's taking a little longer…"
- On completion: glow resolves into the subject-accent color as explanation panel and visual canvas fade+rise in (Framer Motion: opacity 0→1, y +12px→0, ~250ms, 80ms stagger — canvas arrives just after text).

---

## 3. Visual Canvas Entrance

- The Desmos canvas container (glass card) is present in skeleton form even during thinking, so its size doesn't jump when content arrives — only the contents fade in.
- Sliders animate in with a slight stagger (~50ms each) after the graph renders, drawing the eye toward interactivity.

---

## 4. Slider Interaction

- Dragging is instant (native Desmos behavior) — no app-level debounce on visual updates.
- A small live value label follows the slider thumb while dragging (e.g., "a = 2.3"), fading out ~500ms after release.
- Slider state persistence (PATCH endpoint) is debounced at 1s — invisible to the user.
- First-time hint: a single "Drag to explore" pulse tooltip on first session with sliders — dismisses on first interaction, never repeats (stored in local storage).

---

## 5. Follow-up Interaction

- Suggested follow-ups render as pill/chip buttons below the explanation — tapping one fills and auto-submits.
- Custom follow-up input is a smaller, secondary-styled field directly below chips — visually subordinate, signaling "this is a continuation."
- New follow-up responses append below with a fade+rise (~200ms); the view auto-scrolls just enough to bring new content into view.
- If new Desmos expressions are added, the canvas briefly highlights (1px ring pulse in subject-accent color, ~600ms) — the moment reinforcing "the visual responded to your question."
- Follow-up counter (e.g., "3 of 6") appears small near the input — shifts to a neutral warning tone at 5/6 and 6/6, never alarming red.

---

## 6. Subject Lens Indicator

- A small pill tag near the question breadcrumb shows the detected subject (e.g., "Math") in its accent color.
- If confidence is low and the app asks for confirmation ("Is this a math question?"), this is presented as two small inline buttons — not a modal.
- Choosing "No" gracefully removes the visual canvas (fade out, ~200ms) and expands explanation text.

---

## 7. History List

- Each history item has a subtle hover elevation change (shadow grows, ~1–2px translateY on hover; scale 0.98 on mobile press).
- Subject tags use the accent-color convention for instant visual scanability.
- Deleting an item: card fades and collapses height smoothly (~250ms) rather than disappearing instantly.

---

## 8. Dashboard

- Subject count cards use a count-up animation on first load (0 → value over ~600ms) — one restrained moment of delight on a summary screen.
- "Weak area" items use the amber/warning accent as a small dot or left-border indicator only — not a full-card warning treatment.
- Empty states show a single icon + one-line copy + button to Home. No multi-paragraph onboarding.

---

## 9. Graphxy Labs Landing Page Interactions

- **Hero CTA buttons:** hover → subtle 1px translateY lift + shadow deepening. Primary CTA (Explore Graphzy) uses Graphzy blue; secondary CTA (Join Serva Waitlist) uses Serva amber.
- **Product cards (Graphzy / Serva):** on hover, a soft scale(1.015) with shadow elevation shift (~200ms ease-out). Serva card uses a "Coming Soon" badge with a distinct but restrained visual treatment — not a disabled/greyed state, since interest should still be driven.
- **Service vertical sections:** reveal on scroll into view with a fade+slight-rise (opacity 0→1, y +8px→0, ~300ms, staggered per section), controlled via IntersectionObserver + Framer Motion. Never more than one animated entrance zone visible at a time to avoid visual noise.
- **Navigation:** sticky top nav with a frosted-glass background (backdrop-blur) that only activates when the page scrolls past the hero — no blur on initial load to keep the hero clean.

---

## 10. Error & Edge States

- Rate-limit / network errors: inline banner above the input, not a modal or toast. Includes a retry button.
- Errors never use red as a dominant color — a muted warm-neutral tone with an icon.
- Degraded AI response: quiet placeholder in canvas area — icon + "Interactive visual unavailable — here's the explanation" — never a blank box.

---

## 11. Motion Principles

- **Settle, don't bounce.** All easing is ease-out for entrances, ease-in-out for state changes. No spring or overshoot.
- **One orchestrated moment per screen.** The thinking → reveal sequence on the result view is the signature motion. Everything else is quick (<200ms) and subordinate.
- **Respect reduced motion.** All entrance animations degrade to simple opacity fades when `prefers-reduced-motion` is set.
- **Color signals subject identity, not UI state.** Accent colors (math/chem/bio/physics/Serva amber) are reserved for domain identity. Error states use neutral tones.
- **Landing page: one reveal per section, not per element.** Do not animate individual paragraph lines or icon items — animate the containing section block as a unit.

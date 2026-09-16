# Design

<!-- impeccable:design-schema 1 -->

## Direction

**Interactive Technical Schematic.** Techseum is a technology museum where the explanation *is* a drawing you operate. The bold-minimal editorial shell (honoured from the brief's reference layout) frames a technical drawing system: one stroke family, measurement rules, node-link topology, exploded cutaways, animated flow. The category default this refuses is the long-form article with decorative illustration, and the generic same-size card grid as the page's structural idea.

Code-led build: no comp round, no image generation. The ambition lives in the direction contract below and was verified against screenshots.

## Direction contract

- **THESIS** — The explanation is a drawing you operate. Refuse article-plus-illustration and the generic card grid as structure.
- **OWN-WORLD** — White ground, near-black heavy display type, one indigo accent, a cyan signal, a warm warn; 24px card radius; hairline borders; a single SVG stroke family; dashed measurement rules.
- **STORY** — The visitor understands a mechanism as a repeatable sequence, believes they could describe it to someone else, then goes deeper or takes the challenge.
- **FIRST VIEWPORT** — Three-line display headline with a hand-drawn underline; two actions; a three-cell stat bar; three tilted schematic cards ringed by dashed orbits and sparkles.
- **FORM** — Schema-driven diagram engine plus procedural R3F exhibits inside a bold-minimal shell.
- **FINISH** — Reviewed against screenshots, detector run, documented here.

## Color

Strategy: **Restrained** — a white ground with one accent, the default for Operate/Read surfaces, which most of this product is.

Roles, all defined as RGB channel triplets on `:root` in `app/globals.css` and consumed through Tailwind (`tailwind.config.ts`):

| Token | Light | Role |
|---|---|---|
| `--paper` | `255 255 255` | Primary ground |
| `--paper-alt` | `247 247 248` | Recessed panels, bench chrome |
| `--paper-sink` | `240 240 242` | Track fills, nested wells |
| `--ink` | `10 10 10` | Headlines and primary text |
| `--ink-soft` | `46 46 51` | Body copy |
| `--ink-muted` | `107 107 112` | Secondary text, labels |
| `--ink-faint` / `--ink-ghost` | `150 150 158` / `196 196 204` | Diagram annotations, disabled |
| `--line` / `--line-strong` / `--line-dash` | `236 236 236` / `214 214 220` / `180 180 190` | Hairlines, control borders, measurement rules |
| `--accent` | `79 70 229` | The one technology accent |
| `--accent-soft` / `--accent-ink` | `238 240 255` / `67 56 202` | Accent fills and accent-on-soft text |
| `--signal` | `6 182 212` | Secondary flow/data channel |
| `--success` / `--warn` / `--danger` | `22 163 74` / `217 119 6` / `220 38 38` | States, callouts, lab verdicts |

Dark mode inverts the same roles under `.dark` (`--paper: 10 10 11`, `--ink: 245 245 247`, accent lifted to `129 122 255` for contrast). Every colour is referenced by token; no component hard-codes a hex except inside the WebGL models, where three.js cannot read CSS variables.

**Colour commits at region scale**: the accent owns whole diagram states (active node, pulse, progress) rather than being sprinkled as decoration. Semantic colour is reserved — red is never ornamental because red means overdriven or wrong.

## Typography

- **Display:** General Sans (Fontshare, loaded via `@import`), falling back to Inter then the system sans. Weight 600–700, tracking `-0.035em` to `-0.045em` at display sizes. Used for headlines, section titles, card titles, and stat figures.
- **Body/UI:** Inter (self-hosted via `next/font/google` as `--font-body`).
- **Mono:** JetBrains Mono (self-hosted as `--font-mono`), used only for real data: measurements, step values, latency, XP, spec labels, and code-like formulas. Never as a "technical" costume.

Scale is fluid: display runs `clamp(2rem, 5.4vw, 4rem)` on page titles and `clamp(2.6rem, 7.2vw, 5.1rem)` on the hero. Body copy sits at 13–17px with measure capped by `max-w-measure` (68ch). Numerals are tabular (`.tnum`) wherever figures align in columns.

## Space and shape

- 24px card radius (`--radius: 24px`), 14px for nested controls, 999px for pills.
- Shadow system is layered and soft, never a zero-offset halo: `--shadow-card`, `--shadow-lift`, `--shadow-pop`, each pairing a tight contact shadow with a large soft spread.
- Spacing rhythm is one scale throughout; section separations are generous, interior groups tight.
- Section separation uses either a `border-y` hairline band or plain ground, never a decorative divider.

## Line and ornament

- **One stroke family.** Every SVG uses `stroke-width` 1.3–1.6, `strokeLinecap="round"`, `strokeLinejoin="round"`, and `fill="none"` unless a form is intentionally solid. The same values appear in `schematic-thumb.tsx`, `simulation-2d.tsx`, and the lab benches.
- **Measurement rules.** Dashed axis lines with small end dots frame every diagram surface, which is what makes the previews read as drawings rather than icons.
- **Dashed connectors.** Edges and orbits use `strokeDasharray` in 2–5px steps; dashed strokes animate only where flow is the subject (`animate-dash`).
- **Sparkles and orbits** are the only pure ornament, and they are confined to the hero and CTA band, taken directly from the brief's reference.
- Iconography is authored SVG (`components/glyphs.tsx`); no icon font, no emoji, no unicode glyph standing in for an icon.

## Components

- `SchematicThumb` — the exhibit preview. Ten hand-drawn schematics on a shared `DiagramGround`; the diagram *is* the thumbnail.
- `Simulation2D` — schema-driven stepped diagram engine. Owns Play/Pause/Restart/Next-step, 1×/2×/4× speed, per-node hotspot inspection, and animated flow pulses. Every exhibit's diagram runs on it.
- `Simulation3D` — procedural React Three Fiber exhibits (ten model families built in code, no `.glb`). Orbit controls, 3D hotspot annotations, exploded view, an orbiting data-flow particle. Loaded through a dynamic import so three.js never enters the topic page's initial bundle.
- `ChallengeEngine` — one engine, three interaction types (ordering, multiple-choice, drag-drop) resolving to sequence or set, with immediate explained feedback.
- `TopicCard`, `RankBoard`, `Sparkline`, `Progress`, `Ring`, `Avatar` — the display primitives.
- `DiagramGround` — the single implementation of the technical grid, so every diagram shares one cell size and weight.

## Motion

One authored easing curve, `cubic-bezier(0.16, 1, 0.3, 1)`, everywhere. Entrances are a short rise and fade, staggered in groups, and run once per element (`once: true`). The scroll-scrubbed scenario timeline is the one long-form motion piece. Simulation playback, flow pulses, and the marquee are the only continuous motion, and all of it stops under `prefers-reduced-motion` — checked both in CSS and via `useReducedMotion()` in components, with a genuine reduced-motion render path rather than a slowed one.

## Accessibility

- Skip link to `#main`.
- `:focus-visible` ring at 2px accent with 2px offset on every interactive element.
- All controls are real `button`/`a`/`input` elements; icons carry `aria-hidden` and every control carries an accessible name.
- Diagrams expose `role="img"` with a descriptive `aria-label` that names the current step; hotspots are keyboard-focusable with Enter/Space handling.
- Toggles use `aria-pressed`; the theme toggle renders both icons to avoid a hydration mismatch.
- `prefers-reduced-motion` honoured in CSS and in JS.
- Body text meets 4.5:1 on both themes; secondary text on coloured callout grounds is tinted from that hue rather than greyed.

## Browser surfaces

Themed deliberately rather than left at defaults: text selection uses the accent, custom scrollbars are drawn from the palette, focus rings are branded, `accent-color` is set for range inputs, and tabular numerals are enabled for all aligned figures.

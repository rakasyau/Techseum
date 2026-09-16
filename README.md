# Techseum

**An interactive technology museum for the web.**

Techseum explains how the technology you use every day actually works — from the
CPU in your laptop and the Wi-Fi in the air, to the camera in your pocket and
the neural networks behind modern AI. Instead of long articles, every
explanation is something you can look at, take apart, and operate yourself.

`Next.js` · `TypeScript` · `Tailwind CSS` · `MongoDB` · `React Three Fiber` · `English / Bahasa Indonesia`

---

## Why it exists

Reading about a machine is not the same as understanding it. Techseum is built
on one idea: you understand a system when you can watch it work, take it apart,
and change one variable at a time to see why it matters.

Every exhibit follows the same four moves:

1. **Pick a depth** — from a plain-language intro to the real engineering constraints.
2. **Turn it in your hands** — a stepped diagram and an explorable 3D model.
3. **Break it deliberately** — run the simulation, open the exploded view, change the values.
4. **Prove you got it** — a short challenge that explains the answer either way.

## What you can do

- **Explore the exhibits** across five wings of technology.
- **Read at four depths** — Simple, Beginner, Technical and Deep Dive. One exhibit
  serves a thirteen-year-old and an engineering student without talking down to either.
- **Drive the diagram** — a stepped 2D simulation engine with play, pause, restart,
  1x / 2x / 4x speed, manual stepping, and a click-to-inspect part reader.
- **Turn the model** — procedural 3D exhibits with orbit controls, an exploded view,
  annotated hotspots and animated data flow.
- **Change the variables** — three lab benches that calculate real results from your inputs.
- **Follow a chain of events** — scroll-driven timelines that trace one request end to end.
- **Take the challenge** — one exercise per exhibit plus a daily challenge, each with an explanation.
- **Ask a question** — a contextual assistant on every exhibit, grounded in that exhibit's own content.

## The five wings

| Wing | The question it answers |
|---|---|
| **Computing** | How does silicon turn electricity into thought? |
| **Networking** | How do invisible signals find their way between machines? |
| **Electronics** | What is actually happening inside the circuits and sensors? |
| **Everyday Tech** | How do the devices in your pocket really work? |
| **Modern Tech** | What is a neural network, and where does the cloud live? |

## Interactive Lab

Three benches where you change one thing and watch the consequence.

- **Electronics Bench** — a battery, resistor and LED circuit. Adjust voltage and
  resistance, and current, power and LED brightness are calculated live from Ohm's law.
- **Network Bench** — build a topology by clicking nodes, then send a packet that is
  routed through your graph by a real breadth-first search.
- **Camera Bench** — trade aperture, shutter speed and ISO against each other and watch
  exposure, depth of field, motion blur and noise respond, with an exposure value
  derived from the settings you chose.

## Progression

Accounts are real and backed by a database.

- **XP** for reading levels, solving challenges and finishing an exhibit.
- **Levels** derived from total experience.
- **Streaks** that grow with daily activity.
- **Badges** such as First Explorer, CPU Master and Deep Dive, earned by completing
  things rather than by logging in.
- **Leaderboards**, all-time and weekly, ranked from real accounts.
- **Bookmarks** and a full activity history on your profile.

## The assistant

Each exhibit carries a contextual assistant. It answers follow-up questions using
that exhibit's own material as its grounding, adjusted to the depth you are
reading, and streams its answer as it is written.

It is deliberately scoped: if the exhibit does not cover something, it says so
rather than inventing an answer.

## Design

Techseum looks like a working drawing you can operate.

- A bold-minimal light mode: near-black heavy display type on a white ground, with
  one indigo accent and a cyan signal colour.
- A single authored SVG stroke family across every diagram, schematic and icon.
- Dashed measurement rules and annotation ticks, so previews read as technical
  drawings rather than decorative icons.
- Large-radius cards, hairline borders and a soft, layered shadow system.

Light and dark themes are both first-class, and a reduced-motion mode is respected
throughout the simulations and interface.

## Newsletter

The footer signup stores the address in the database and sends a welcome email
through Resend. Registration sends its own account-welcome email. The weekly
digest lives in scripts/send-digest.mjs. Every provider failure is logged with
the exact HTTP status and message, so a rejected sender or a revoked key is
visible instead of silent.

Paste-ready email templates are in emails/:

- emails/account-welcome.html — sent when someone creates an account
- emails/welcome.html — sent on newsletter signup
- emails/weekly-digest.html — the weekly roundup
- emails/subjects.txt — the matching subject lines

Delivery can be verified without the UI. Both scripts read `.env.local`:

- `node scripts/test-email.mjs [address]` — sends a test through every From
  address in play and prints the exact Resend status.
- `node scripts/test-register.mjs [baseUrl] [email]` — registers a real account
  against a running server and reports whether the welcome email was sent.

Until a sending domain is verified in Resend, only the sandbox sender
(onboarding@resend.dev) works, and Resend will only deliver to the email
address that owns the Resend account. Verify a domain and set
NEWSLETTER_FROM to start reaching real subscribers.

---

## Languages

The interface ships in **English** and **Bahasa Indonesia**. Switch instantly from
the header; your choice is saved to your account and applied on your next visit.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, Radix primitives |
| 2D visualisation | Hand-authored SVG driven by a schema-based step engine |
| 3D visualisation | Three.js via React Three Fiber and Drei, models authored procedurally in code |
| Motion | Framer Motion |
| Database | MongoDB Atlas with Mongoose |
| Accounts | bcrypt password hashing, signed JWT session cookies |
| Assistant | Server-side route handler with streamed responses |
| Validation | Zod |

## Accessibility

- Keyboard navigable, with visible focus rings throughout.
- Diagrams expose descriptive labels and a keyboard-operable part inspector.
- Light and dark themes, both meeting contrast requirements.
- Full reduced-motion support, honoured in both CSS and JavaScript.
- Semantic HTML, real buttons and inputs, and labelled controls.

## A note on accuracy

Exhibits are written to be correct and correctable. The deepest level of each
exhibit is where the honest caveats live — the real constraints, trade-offs and
failure modes, rather than a simplified story that falls apart on inspection.

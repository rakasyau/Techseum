# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js 14+ App Router + TypeScript and Tailwind CSS for the
interface; Framer Motion for motion; React Three Fiber + Drei + Three.js for
procedural in-code 3D exhibits; next-themes for light/dark.

MongoDB Atlas with Mongoose stores accounts and learner progress. bcrypt
hashes passwords, `jose` signs session cookies, and Zod validates every write
endpoint. The exhibit catalogue remains authored data under `lib/data/`,
while accounts, XP, badges, streaks, bookmarks, the leaderboard and site
statistics are read from MongoDB.

The AI assistant is a Next.js route handler that keeps the provider key
server-side and streams answers. It is briefed on each exhibit's scope, depth
levels, simulation steps and part names, then answers from general knowledge
about that subject rather than reciting the exhibit text.
Interface copy ships in English and Indonesian via a dictionary in
`lib/i18n/`. 3D exhibits are authored procedurally in code rather than loaded
from `.glb` files.
## Users

Four confirmed audiences, from PRD section 3:
- **Students (SMP/SMA):** need simple, non-technical, visual explanations.
- **University students (engineering/CS):** need technical depth and cross-references between topics.
- **General public:** want a fast answer to a passing curiosity, without jargon.
- **Tech enthusiasts:** want deep exploration, interactive simulations, and 3D models.

The situation is self-directed learning: a curious person lands on a topic and wants to actually understand the mechanism, not read a wall of prose.

## Product Purpose

Techseum explains how everyday technology works — CPU, Wi-Fi, camera, SSD, AI, and more — through 2D visualizations, interactive 3D models, simulations, and gamified challenges. It replaces long-form articles with an interactive digital-museum experience: visitors explore "exhibits", inspect models, run simulations, and complete challenges to understand the systems they use daily.

Success means: sessions longer than 5 minutes, over 60% of topic openers finishing level 1, healthy D7 retention driven by streaks, and measurable use of 3D mode above 2D-only.

## Positioning

The differentiator is **active comprehension over passive reading**: every exhibit pairs an explanation with something the visitor manipulates — a stepped 2D state-machine diagram, an explorable 3D model with hotspots and exploded view, or a live simulation (Ohm's law, packet routing, camera exposure). A neighboring article site could not truthfully copy the mechanism because the mechanism *is* the interaction, not the text.

## Operating Context

Consulted on desktop and mobile browsers. A visitor browses the museum (Explore), enters an exhibit (Topic Detail), chooses a depth level (Simple → Deep Dive), toggles 2D/3D, and optionally plays a mini-challenge for XP. Progress, badges, streaks, and bookmarks are shown against a mock profile in this frontend build. The design reference is a bold-minimal light-mode NFT marketplace landing page, reinterpreted for technology education.

## Capabilities and Constraints

**Confirmed in scope (frontend, mock data):**
- Landing page matching the reference layout section by section.
- Explore listing with category/level filters and instant search.
- Topic detail with four depth levels, 2D simulation mode, 3D model mode, mini-challenge, and related topics.
- "What Happens When…?" scroll-triggered scenario timelines.
- Interactive Lab: Electronics (Ohm's law + live LED), Network (node graph + animated packet), Camera (aperture/shutter/exposure).
- Challenges list with daily challenge and an ordering/MCQ/drag-drop engine.
- Leaderboard (all-time/weekly) with category filter and sparklines.
- Profile with progress, badges, bookmarks, history, and preferences.
- About page.
- Dark/light theme toggle; reduced-motion preference.
- A mock "Ask Why" assistant widget on topic pages (scripted responses; no live LLM).

**Explicitly undecided / not in this build:**
- Real MongoDB persistence, NextAuth, and API route handlers (PRD section 8) are deferred; the UI reads typed seed data so they can be swapped in later.
- Live LLM integration for "Ask Why".
- Real `.glb` 3D assets, PWA/offline, and full i18n are deferred.
- Any commercial claims, and per-topic accuracy review (PRD risk table).

## Brand Commitments

- **Name:** Techseum. Logo lockup is text with a circular mark (`◉ Techseum`).
- **Design language (pinned by the brief, PRD sections 4, 6.1, 12):** bold-minimal light mode, near-black heavy type on white/off-white, one technology accent (indigo `#4F46E5` with a soft `#EEF0FF`), large-radius rounded cards, dashed decorative lines and small sparkle/star marks, a numeric stat bar, and a leaderboard/ranking section.
- **Typography:** General Sans for display, Inter for body/UI (user-confirmed).

## Evidence on Hand

- `bahan/PRD-Techseum.md` — the authoritative product requirements document.
- `bahan/NFT Platform Interface _ Landing Page.jpg` — the landing-page layout reference.
- No product photography, customer logos, testimonials, or benchmark data exist. None may be fabricated. Testimonial-style or press-style content must not be invented.

## Product Principles

1. **Show, don't tell.** Every concept gets a diagram, model, or simulation; prose supports the interaction, never replaces it.
2. **Depth on demand.** One topic serves a 13-year-old and an engineering student through graduated levels, not separate products.
3. **The visitor touches the machine.** Exploration (orbit, sliders, drag, replay) is the primary learning act.
4. **Momentum by design.** XP, streaks, badges, and leaderboards make returning the default, without cheapening the content.
5. **Clarity over decoration.** A confident visual language earns attention; ornament that does not explain is removed.

## Accessibility & Inclusion

- Light and dark themes, both meeting contrast requirements.
- A reduced-motion mode for animation-sensitive users, respected by all simulations and reveals.
- Keyboard-navigable controls for simulations and challenges; diagrams carry text alternatives.

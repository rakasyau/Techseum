# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 14+ (App Router) with TypeScript. Styling via vanilla CSS (design tokens as CSS custom properties). Animations via Framer Motion and GSAP + ScrollTrigger. No Tailwind, no shadcn/ui — handcrafted components only.

## Users

- **Pelajar (SMP/SMA):** curious about how everyday tech works, need visual and non-technical explanations.
- **Mahasiswa (Teknik/CS):** want technical depth, cross-references between topics, and interactive simulations.
- **General public:** want quick, jargon-free answers to "how does X work?"
- **Tech enthusiasts:** want deep exploration, interactive 3D models, and hands-on simulations.

## Product Purpose

Techseum is an interactive technology education platform — a "digital technology museum." Instead of long articles, visitors explore exhibits, interact with 2D/3D models, run simulations, and complete challenges to understand the technology they use daily (CPU, Wi-Fi, cameras, SSD, AI, etc.). The goal is to make complex technology feel tangible and explorable.

## Positioning

The only platform that treats technology education as a museum experience: every topic is an interactive exhibit with tiered depth (Simple → Deep Dive), real-time 2D simulations, interactive 3D models, and gamified learning paths. Not a course platform, not a wiki — a place to walk through and touch the technology.

## Operating Context

Visitors arrive from search, social sharing, or direct curiosity. They land on a bold home page, browse exhibits by category (Computing, Networking, Electronics, Everyday Tech, Modern Tech), and dive into individual topics with level-selectable explanations and interactive visualizations. Gamification (XP, badges, streaks, leaderboard) drives repeat visits. The platform is primarily used on desktop and tablet, with mobile as a secondary but fully supported context.

## Capabilities and Constraints

**Confirmed capabilities:**
- 5 topic categories: Computing, Networking, Electronics, Everyday Tech, Modern Tech (50+ topics planned)
- 4-level content depth per topic: Simple, Beginner, Technical, Deep Dive
- 2D simulation engine (SVG + Canvas, state-machine driven, Play/Pause/Step/Speed controls)
- 3D model viewer (React Three Fiber, orbit, exploded view, hotspot annotations, particle data flow)
- Interactive Labs (Electronics/Ohm's Law, Network topology, Camera aperture/shutter)
- "What Happens When...?" scenario timelines (scroll-triggered)
- Gamification: XP, levels, badges, daily challenges, streaks, leaderboard
- AI "Ask Why" contextual assistant per topic
- Dark/light theme toggle
- Bilingual ID/EN (future)
- PWA offline support for 2D assets (future)

**Undecided:**
- Auth provider details (credentials + OAuth Google/GitHub planned but not confirmed)
- Database: MongoDB Atlas planned but not confirmed for initial frontend-only phase
- 3D model assets: to be created or sourced

## Brand Commitments

- Name: **Techseum** (with ◉ icon mark)
- Voice: curious, inviting, clear — like an enthusiastic museum guide. Never academic or dry.
- The design reference is an NFT marketplace landing page (bold-minimal, light-mode dominant) reinterpreted for education. The exact layout is not binding; the energy and quality level are.

## Evidence on Hand

- [PRD document](bahan/PRD-Techseum.md): full product requirements with page-by-page specifications
- [UI reference image](bahan/NFT%20Platform%20Interface%20_%20Landing%20Page.jpg): NFT marketplace landing page screenshot used as design energy reference
- Design tokens from PRD Section 12 (suggested, not binding): indigo accent (#4F46E5), off-white background, Inter/General Sans typography, 24px card radius

## Product Principles

1. **Show, don't tell.** Every concept is a visual experience before it is text. The simulation is the explanation.
2. **Progressive depth.** One topic, four levels. Nobody is locked out by complexity, nobody is bored by simplicity.
3. **Museum energy.** The interface should feel like walking through a beautifully designed exhibit — spatial, explorable, surprising.
4. **Earned complexity.** Gamification is motivation, not decoration. XP and badges reflect real understanding.
5. **Technology feels tangible.** Abstract concepts become objects you can rotate, pause, step through, and take apart.

## Accessibility & Inclusion

- Reduced motion mode for animation-sensitive users
- Dark/light theme for visual comfort
- Keyboard-navigable interactive elements
- Bilingual support (ID/EN) planned

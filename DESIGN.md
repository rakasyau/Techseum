---
name: Techseum
description: Interactive Digital Technology Museum Design System
colors:
  primary: "#0A0A0A"
  accent: "#4F46E5"
  accent-indigo: "#6366F1"
  accent-blue: "#2563EB"
  accent-sky: "#0284C7"
  accent-purple: "#7C3AED"
  accent-pink: "#EC4899"
  accent-amber: "#F59E0B"
  accent-amber-dark: "#D97706"
  accent-yellow: "#FBBF24"
  accent-emerald: "#059669"
  accent-emerald-light: "#34D399"
  accent-teal: "#10B981"
  accent-soft: "#EEF0FF"
  accent-softer: "#F5F3FF"
  badge-green-bg: "#ECFDF5"
  badge-amber-bg: "#FEF3C7"
  badge-red-bg: "#FEE2E2"
  badge-red-light: "#F87171"
  neutral-bg: "#FFFFFF"
  neutral-bg-alt: "#F7F7F8"
  neutral-card: "#FFFFFF"
  neutral-text: "#0A0A0A"
  neutral-text-muted: "#6B6B70"
  neutral-text-light: "#9CA3AF"
  neutral-border: "#E5E5E7"
  neutral-border-light: "#F0F0F2"
  success: "#16A34A"
  danger: "#DC2626"
typography:
  display:
    fontFamily: "General Sans, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  display-hero:
    fontSize: "clamp(2rem, 4.5vw, 3.25rem)"
    fontWeight: 800
  headline:
    fontFamily: "General Sans, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline-fluid:
    fontSize: "clamp(1.5rem, 2.5vw, 2rem)"
    fontWeight: 700
  title-xxl:
    fontSize: "3rem"
    fontWeight: 800
  title-xl:
    fontSize: "2.5rem"
    fontWeight: 800
  title-lg:
    fontSize: "2rem"
    fontWeight: 700
  title-stat:
    fontSize: "1.75rem"
    fontWeight: 800
  title-section:
    fontSize: "1.5rem"
    fontWeight: 700
  title-card-lg:
    fontSize: "1.375rem"
    fontWeight: 700
  title-card:
    fontSize: "1.25rem"
    fontWeight: 700
  title-card-sm:
    fontSize: "1.125rem"
    fontWeight: 700
  body:
    fontFamily: "Satoshi, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-md:
    fontSize: "0.9375rem"
  body-sm:
    fontSize: "0.875rem"
  caption:
    fontSize: "0.8125rem"
  label:
    fontFamily: "Satoshi, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.06em"
  micro:
    fontSize: "0.6875rem"
rounded:
  xs: "1px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  card: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.75rem"
  pill:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
  card:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.card}"
    padding: "1.25rem"
---

# Design System: Techseum

## Overview

**Creative North Star: "The Exhibition Hall of Modern Computing"**

Techseum approaches technology education not as textbook articles or dark neon hacker dashboards, but as a bright, spatial, carefully curated digital exhibition hall. The interface adopts a bold-minimal design language: deep near-black typography set against confident white fields, structured geometry with generous corner radii (24px cards), and an electric indigo accent used with surgical restraint.

The aesthetic draws energy from contemporary physical museum signage, architectural exhibition catalogs, and precision instrument manuals. It proves that technology is tangible, explorable, and beautiful without resorting to AI tropes (no generic gradients, no unmotivated glassmorphism, no dark-mode neon by default).

**Key Characteristics:**
- High-contrast, tight-tracking display typography (General Sans) paired with rhythmic, legible body text (Satoshi).
- Confident white-ground default with generous spatial rhythm and intentional breathing room.
- Tactile exhibit cards with subtle 1px borders, soft drop shadows, and delicate tilt transforms.
- Single electric indigo accent (#4F46E5) reserved for primary actions, active indicators, and technical annotations.
- Playful exhibition accents: dashed orbit arcs, sparkline data charts, and geometric sparkle glyphs.

## Colors

The palette is anchored in crisp neutral planes, deep near-black structural ink, and a single vibrant indigo accent that represents electrical and digital signals.

### Primary
- **Deep Obsidian** (`#0A0A0A`): Used for display headlines, primary buttons, active pill states, and dominant visual weight.
- **Electric Indigo** (`#4F46E5`): The signature technological signal color. Used for button hover states, category badges, circuit paths, and sparkle accents.

### Neutral
- **Gallery White** (`#FFFFFF`): The primary floor ground. Clean, airy, and spatial.
- **Off-White Canvas** (`#F7F7F8`): Alternate section backgrounds (Leaderboard, Tech Strip, Footer) creating subtle rhythmic depth.
- **Muted Charcoal** (`#6B6B70`): Secondary text, subtitles, explorer counts, and neutral iconography.
- **Subtle Silver** (`#E5E5E7`): 1px border lines and stat dividers.
- **Ghost Line** (`#F0F0F2`): Card hairline borders and internal card separators.

### Functional
- **Signal Emerald** (`#16A34A`): Streak badges, positive change percentages, and verified indicators.
- **Signal Crimson** (`#DC2626`): Deep Dive difficulty warnings and critical states.

### Named Rules
**The Rarity Rule.** The electric indigo accent is used on ≤8% of any given viewport. Its power comes from its contrast against the obsidian and white space.

## Typography

**Display Font:** General Sans (with system-ui, -apple-system fallback)
**Body Font:** Satoshi (with system-ui, -apple-system fallback)

**Character:** Architectural, confident, and highly legible. General Sans brings museum placard authority at large weights, while Satoshi ensures fatigue-free reading across technical explanations and metadata.

### Hierarchy
- **Display XL** (ExtraBold 800, `clamp(2.75rem, 5.5vw, 4.5rem)`, line-height 1.05, letter-spacing -0.035em): Hero headline only.
- **Headline** (Bold 700, `clamp(1.75rem, 3vw, 2.25rem)`, line-height 1.2, letter-spacing -0.02em): Section headers.
- **Title** (Bold 700, `1rem` to `1.25rem`, line-height 1.3, letter-spacing -0.01em): Exhibit card titles and leaderboard entries.
- **Body** (Regular 400 / Medium 500, `0.9375rem` to `1rem`, line-height 1.6): Subtitles, descriptions, and article text (measure 60–75ch).
- **Label / Tag** (SemiBold 600, `0.6875rem` to `0.75rem`, letter-spacing 0.05em, uppercase): Category kickers, difficulty badges, and metadata.

### Named Rules
**The No-Eyebrow Rule.** Section headings carry their own weight; do not stack decorative kicker labels above primary titles.

## Layout

A 1200px max-width centered container grid with an 8px base spacing scale. 

- **Grid Models:** 4-column exhibit cards on desktop, collapsing to 2-column on tablet (≤1024px) and 1-column on mobile (≤640px).
- **Section Spacing:** Generous `var(--space-20)` (5rem / 80px) top and bottom padding between exhibition zones.
- **Hero Composition:** 50/50 two-column split on desktop with asymmetrical visual weight; stacks vertically with centered alignment on mobile.
- **Horizontal Scrollways:** Category pills and tech strips feature momentum horizontal scrolling with subtle fade masks on mobile viewports.

## Elevation & Depth

Surfaces are predominantly flat and tactile at rest, utilizing hairline borders (`1px solid var(--color-border-light)`) and gentle tonal steps for containment.

### Shadow Vocabulary
- **Card Rest** (`0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)`): Default subtle elevation for exhibit preview cards.
- **Card Hover** (`0 4px 12px rgba(0, 0, 0, 0.06), 0 16px 40px rgba(0, 0, 0, 0.10)`): Dynamic lift state on interactive exhibit cards combined with `-4px` Y-translation.
- **Ambient Focus** (`0 4px 16px rgba(79, 70, 229, 0.3)`): Soft diffuse glow under active or hovered primary CTA buttons.

### Named Rules
**The Flat-By-Default Rule.** Elements rest flat on the gallery floor. Shadows and lift transforms are reserved strictly for interactive state response (hover, focus, dragging).

## Shapes

- **Card Radius:** Generous 24px (`var(--radius-card)`) creating friendly, museum-tablet-like containers.
- **Pill Radius:** Full 999px (`var(--radius-pill)`) on all interactive buttons, category filters, and difficulty tags.
- **Hairline Borders:** Uniform 1px and 1.5px borders defining edges with engineering precision.
- **Decorations:** Dashed circular arcs (`stroke-dasharray: 8 8`) and 4-point sparkle vector marks adding subtle cosmic/technological whimsy.

## Components

### Buttons
- **Shape:** Full pill radius (999px), `0.875rem 1.75rem` padding.
- **Primary:** Obsidian background (`#0A0A0A`) with white text. On hover, shifts to Electric Indigo (`#4F46E5`) with `-1px` translateY and subtle glow.
- **Outline:** Transparent background with 1.5px border (`#E5E5E7`). On hover, border darkens to Obsidian with `-1px` translateY.

### Category Pills
- **Shape:** Full pill radius, 1.5px border, circular icon badge on left.
- **State:** Inactive features white ground with dark text; active inverts to full Obsidian background with white text.

### Exhibit Cards
- **Shape:** 24px radius, 1px border light. Top half is an aspect-ratio 1:1 SVG/visual canvas in soft lavender tint (`#F5F3FF`); bottom half holds metadata, bold title, and explorer counter.
- **Interaction:** `-4px` lift with expanded shadow on hover; bookmark badge fades in on top-right.

### Leaderboard List
- **Shape:** 16px rounded rows, numbered index, gradient avatar badge with author initials, sparkline trend chart, and percentage change.

### Navigation
- **Shape:** Floating header with sticky background blur (`rgba(255, 255, 255, 0.85)` + `blur(16px)`), centered links, integrated dark/light theme switch, and search modal trigger.

## Do's and Don'ts

### Do:
- **Do** maintain generous white space around typography and exhibit cards.
- **Do** use authentic SVG circuit and component diagrams that represent real computing concepts.
- **Do** keep button and card transitions smooth using cubic-bezier curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Do** ensure dark mode fully adapts all tokens while preserving high contrast and crisp readability.

### Don't:
- **Don't** use multi-color gradient text or unmotivated neon glows.
- **Don't** clutter cards with nested boxes or colored left borders.
- **Don't** use generic stock photos or placeholder boxes when dedicated SVG technical visuals are required.
- **Don't** use standard sans-serif system defaults (Inter, Roboto) when distinctive brand typefaces (General Sans, Satoshi) are available.

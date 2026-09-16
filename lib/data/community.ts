import type { Badge, LabDef } from "../types";
import { championBadge } from "../xp";

/*
 * Lab definitions and the badge catalogue.
 *
 * The badge codes here must match what the server can actually award in
 * lib/progress.ts — a badge shown in the UI that no rule can ever grant is a
 * bug, not decoration. The champion badges are derived from the wing list so
 * they cannot drift when a wing is added.
 */

export const LABS: LabDef[] = [
  {
    slug: "electronics",
    title: "Electronics Bench",
    tagline: "Ohm's law, live",
    description:
      "Drive a simple battery, resistor and LED circuit. Adjust voltage and resistance and watch the current, power and light output respond in real time.",
    kind: "electronics",
    accent: "warn",
  },
  {
    slug: "network",
    title: "Network Bench",
    tagline: "Route a packet yourself",
    description:
      "Place devices, routers and servers, connect them, then send a packet and watch it find its way across the topology you built.",
    kind: "network",
    accent: "signal",
  },
  {
    slug: "camera",
    title: "Camera Bench",
    tagline: "Exposure, three ways",
    description:
      "Trade aperture, shutter speed and ISO against each other and see exactly how the same scene turns out under each combination.",
    kind: "camera",
    accent: "accent",
  },
];

const CHAMPIONS: { id: string; label: string }[] = [
  { id: "computing", label: "Computing" },
  { id: "networking", label: "Networking" },
  { id: "electronics", label: "Electronics" },
  { id: "everyday", label: "Everyday Tech" },
  { id: "modern", label: "Modern Tech" },
];

export const BADGES: Badge[] = [
  {
    code: "first-explorer",
    name: "First Explorer",
    description: "Completed your very first exhibit.",
    icon: "Compass",
    tier: "bronze",
    criteria: "Finish every level of any exhibit.",
  },
  {
    code: "cpu-master",
    name: "CPU Master",
    description: "Worked through every level of How Does a CPU Work?",
    icon: "Cpu",
    tier: "gold",
    criteria: "Complete all four levels and pass the CPU challenge.",
  },
  {
    code: "seven-day-streak",
    name: "Seven Day Streak",
    description: "Learned something on seven consecutive days.",
    icon: "Flame",
    tier: "silver",
    criteria: "Maintain a 7-day activity streak.",
  },
  {
    code: "deep-diver",
    name: "Deep Diver",
    description: "Read a Deep Dive level and took its challenge.",
    icon: "Waves",
    tier: "silver",
    criteria: "Finish any level 4 explanation and answer its challenge.",
  },
  {
    code: "challenge-chaser",
    name: "Challenge Chaser",
    description: "Completed five exhibits from start to finish.",
    icon: "Target",
    tier: "bronze",
    criteria: "Finish five exhibits.",
  },
  ...CHAMPIONS.map(({ id, label }) => ({
    code: championBadge(id),
    name: "Category Champion: " + label,
    description: "Completed every exhibit in the " + label + " wing.",
    icon: "Trophy",
    tier: "gold" as const,
    criteria: "Finish all " + label + " topics.",
  })),
];

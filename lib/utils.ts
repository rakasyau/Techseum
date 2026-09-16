import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${n}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function xpToLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100));
}

export function levelFloor(level: number): number {
  return level * level * 100;
}

export function levelProgress(xp: number) {
  const level = xpToLevel(xp);
  const floor = levelFloor(level);
  const ceiling = levelFloor(level + 1);
  const pct = Math.min(100, Math.round(((xp - floor) / (ceiling - floor)) * 100));
  return { level, pct, floor, ceiling, toNext: ceiling - xp };
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

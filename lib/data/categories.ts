import type { Category } from "../types";

export const CATEGORIES: Category[] = [
  {
    id: "computing",
    label: "Computing",
    blurb: "The silicon that turns electricity into thought.",
    icon: "Cpu",
    accent: "accent",
  },
  {
    id: "networking",
    label: "Networking",
    blurb: "How invisible signals find their way between machines.",
    icon: "Radio",
    accent: "signal",
  },
  {
    id: "electronics",
    label: "Electronics",
    blurb: "Circuits, sensors and the physics underneath them.",
    icon: "CircuitBoard",
    accent: "warn",
  },
  {
    id: "everyday",
    label: "Everyday Tech",
    blurb: "The objects in your pocket and on your desk.",
    icon: "Smartphone",
    accent: "success",
  },
  {
    id: "modern",
    label: "Modern Tech",
    blurb: "Machine learning, the cloud, and what comes next.",
    icon: "Sparkles",
    accent: "accent",
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<Category["id"], Category>;

export function categoryLabel(id: string): string {
  return (
    CATEGORY_MAP[id as Category["id"]]?.label ?? id
  );
}

export type CategoryId =
  | "computing"
  | "networking"
  | "electronics"
  | "everyday"
  | "modern";

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
  icon: string;
  accent: string;
}

export type Difficulty = 1 | 2 | 3 | 4;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: "Simple",
  2: "Beginner",
  3: "Technical",
  4: "Deep Dive",
};

/* ---------------- 2D simulation schema ---------------- */

export interface SimNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  shape?: "box" | "pill" | "circle";
  tone?: "default" | "accent" | "signal" | "muted";
  /** hotspo-t tooltip copy when the node is clicked */
  desc: string;
}

export interface SimEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  tone?: "default" | "accent" | "signal" | "muted";
  /** route the edge through a bend point */
  bend?: "h" | "v";
}

export interface SimStep {
  id: string;
  title: string;
  short: string;
  description: string;
  active: string[];
  pulses?: { from: string; to: string }[];
  value?: string;
}

export interface SimLane {
  label: string;
  y: number;
  h: number;
}

export interface Simulation2DConfig {
  viewBox: [number, number, number, number];
  nodes: SimNode[];
  edges: SimEdge[];
  steps: SimStep[];
  lanes?: SimLane[];
}

/* ---------------- 3D schema ---------------- */

export type Model3DKind =
  | "cpu"
  | "gpu"
  | "ram"
  | "ssd"
  | "camera"
  | "router"
  | "battery"
  | "phone"
  | "module"
  | "cloud";

export interface Hotspot3D {
  id: string;
  label: string;
  detail: string;
  position: [number, number, number];
}

export interface Model3DConfig {
  kind: Model3DKind;
  hotspots: Hotspot3D[];
  exploded: boolean;
}

/* ---------------- content blocks ---------------- */

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone: "info" | "tip" | "warn"; title: string; text: string }
  | { type: "stats"; items: { label: string; value: string; note?: string }[] }
  | { type: "compare"; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { type: "steps"; items: { title: string; text: string }[] };

export interface TopicLevel {
  level: Difficulty;
  minutes: number;
  lede: string;
  blocks: ContentBlock[];
}

export interface Topic {
  slug: string;
  title: string;
  question: string;
  summary: string;
  category: CategoryId;
  difficultyDefault: Difficulty;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  /** diagram family used by the 2D/3D preview thumbnail */
  glyph: Model3DKind;
  levels: TopicLevel[];
  sim2d: Simulation2DConfig;
  model3d: Model3DConfig;
  relatedTopics: string[];
  learningPath?: string;
}

/* ---------------- scenarios ---------------- */

export interface ScenarioStep {
  order: number;
  label: string;
  description: string;
  icon: string;
  latency?: string;
  detail: string;
}

export interface Scenario {
  slug: string;
  title: string;
  summary: string;
  topicSlug: string;
  duration: string;
  steps: ScenarioStep[];
}

/* ---------------- challenges ---------------- */

export type ChallengeType = "ordering" | "multiple-choice" | "drag-drop";

export interface Challenge {
  id: string;
  topicSlug: string;
  type: ChallengeType;
  question: string;
  hint?: string;
  xpReward: number;
  /** ordering: correct sequence of item ids; multiple-choice: option id list */
  options: { id: string; label: string; detail?: string }[];
  answer: string[];
  explanation: string;
  bucket: "topic" | "daily";
}

/* ---------------- gamification ---------------- */

export interface Badge {
  code: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "accent";
  criteria: string;
  earned?: boolean;
  progress?: number;
}

export interface Learner {
  username: string;
  displayName: string;
  avatarSeed: string;
  xp: number;
  streak: number;
  badges: number;
  trend: number;
  favorite: CategoryId;
  sparkline: number[];
  country: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatarSeed: string;
  bio: string;
  xp: number;
  streak: { current: number; longest: number };
  joined: string;
  bookmarks: string[];
  completedTopics: string[];
  inProgressTopics: string[];
  badges: string[];
  categoryProgress: { category: CategoryId; completed: number; total: number }[];
  history: { date: string; topicSlug: string; action: string; xp: number }[];
}

/* ---------------- labs ---------------- */

export interface LabDef {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  kind: "electronics" | "network" | "camera";
  accent: string;
}

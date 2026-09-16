import type { ContentBlock, Difficulty } from "@/lib/types";

/*
 * Exhibit prose is authored once in English and translated through overlays in
 * this folder. An overlay carries only the text; ids, coordinates, answer keys
 * and geometry stay in the English source, and the merge functions in
 * `./index.ts` combine the two. Any key an overlay omits falls back to English.
 */

export type LevelBlocks = ContentBlock[];

export interface TopicTranslation {
  title?: string;
  question?: string;
  summary?: string;
  tags?: string[];
  /** Keyed by level number. */
  levels?: Partial<Record<Difficulty, { lede?: string; blocks?: LevelBlocks }>>;
  sim2d?: {
    nodes?: Record<string, { label?: string; sub?: string; desc?: string }>;
    /** Keyed by `${from}->${to}`. */
    edges?: Record<string, { label?: string }>;
    steps?: Record<
      string,
      { title?: string; short?: string; description?: string; value?: string }
    >;
  };
  model3d?: {
    hotspots?: Record<string, { label?: string; detail?: string }>;
  };
}

export interface ChallengeTranslation {
  question?: string;
  hint?: string;
  explanation?: string;
  /** Keyed by option id. */
  options?: Record<string, { label?: string; detail?: string }>;
}

export interface ScenarioTranslation {
  title?: string;
  summary?: string;
  /** Keyed by step order. */
  steps?: Record<string, { label?: string; description?: string; detail?: string }>;
}

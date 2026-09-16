import type { Topic } from "../../types";
import { computingTopics } from "./computing";
import { networkingTopics } from "./networking";
import { electronicsTopics } from "./electronics";
import { everydayTopics } from "./everyday";
import { modernTopics } from "./modern";

export const TOPICS: Topic[] = [
  ...computingTopics,
  ...networkingTopics,
  ...electronicsTopics,
  ...everydayTopics,
  ...modernTopics,
];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function topicsByCategory(category: string): Topic[] {
  return TOPICS.filter((t) => t.category === category);
}

export function relatedTopics(topic: Topic): Topic[] {
  return topic.relatedTopics
    .map((slug) => getTopic(slug))
    .filter((t): t is Topic => Boolean(t));
}

export const FEATURED_TOPICS = TOPICS.filter((t) => t.featured);

export const TRENDING_TOPICS = [...TOPICS]
  .filter((t) => t.trending)
  .sort((a, b) => b.explorerCount - a.explorerCount);

export const LEARNING_PATHS: {
  slug: string;
  title: string;
  blurb: string;
  topicSlugs: string[];
  accent: string;
}[] = [
  {
    slug: "understanding-the-internet",
    title: "Understanding the Internet",
    blurb: "From a radio wave in your room to a server in a warehouse.",
    topicSlugs: ["wifi", "cpu", "bluetooth"],
    accent: "signal",
  },
  {
    slug: "inside-your-device",
    title: "Inside Your Device",
    blurb: "The hardware stack that makes a modern computer work.",
    topicSlugs: ["cpu", "ram", "ssd", "gpu"],
    accent: "accent",
  },
  {
    slug: "machine-intelligence",
    title: "Machine Intelligence",
    blurb: "How models learn, and where they actually run.",
    topicSlugs: ["neural-net", "gpu", "cloud"],
    accent: "accent",
  },
  {
    slug: "everyday-electronics",
    title: "Everyday Electronics",
    blurb: "The physics behind the objects you touch every day.",
    topicSlugs: ["battery", "touchscreen", "camera"],
    accent: "warn",
  },
];

export const ALL_TAG_OPTIONS = Array.from(
  new Set(TOPICS.flatMap((t) => t.tags))
).sort();

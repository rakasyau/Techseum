import type { Challenge, Difficulty, Scenario, Topic } from "@/lib/types";
import type { Locale } from "../config";
import type {
  ChallengeTranslation,
  ScenarioTranslation,
  TopicTranslation,
} from "./types";
import { idTopics } from "./id";
import { idChallenges } from "./id-challenges";
import { idScenarios } from "./id-scenarios";

/*
 * Content overlays.
 *
 * English is the canonical source: ids, geometry, coordinates and answer keys
 * live in `lib/data`. A translation overlay carries only prose, and these
 * functions merge it over the source. A missing key falls back to English, so
 * a partially translated exhibit still renders coherently rather than blank.
 */

const TOPIC_OVERLAYS: Record<Locale, Record<string, TopicTranslation | undefined>> = {
  en: {},
  id: idTopics,
};

const CHALLENGE_OVERLAYS: Record<
  Locale,
  Record<string, ChallengeTranslation | undefined>
> = {
  en: {},
  id: idChallenges,
};

const SCENARIO_OVERLAYS: Record<
  Locale,
  Record<string, ScenarioTranslation | undefined>
> = {
  en: {},
  id: idScenarios,
};

export function localizeTopic(topic: Topic, locale: Locale): Topic {
  const overlay = TOPIC_OVERLAYS[locale]?.[topic.slug];
  if (!overlay) return topic;

  const levels = topic.levels.map((level) => {
    const tr = overlay.levels?.[level.level as Difficulty];
    if (!tr) return level;
    return {
      ...level,
      lede: tr.lede ?? level.lede,
      blocks: tr.blocks ?? level.blocks,
    };
  });

  const nodes = topic.sim2d.nodes.map((node) => {
    const tr = overlay.sim2d?.nodes?.[node.id];
    if (!tr) return node;
    return {
      ...node,
      label: tr.label ?? node.label,
      sub: tr.sub ?? node.sub,
      desc: tr.desc ?? node.desc,
    };
  });

  const edges = topic.sim2d.edges.map((edge) => {
    const tr = overlay.sim2d?.edges?.[edge.from + "->" + edge.to];
    if (!tr?.label) return edge;
    return { ...edge, label: tr.label };
  });

  const steps = topic.sim2d.steps.map((step) => {
    const tr = overlay.sim2d?.steps?.[step.id];
    if (!tr) return step;
    return {
      ...step,
      title: tr.title ?? step.title,
      short: tr.short ?? step.short,
      description: tr.description ?? step.description,
      value: tr.value ?? step.value,
    };
  });

  const hotspots = topic.model3d.hotspots.map((spot) => {
    const tr = overlay.model3d?.hotspots?.[spot.id];
    if (!tr) return spot;
    return {
      ...spot,
      label: tr.label ?? spot.label,
      detail: tr.detail ?? spot.detail,
    };
  });

  return {
    ...topic,
    title: overlay.title ?? topic.title,
    question: overlay.question ?? topic.question,
    summary: overlay.summary ?? topic.summary,
    tags: overlay.tags ?? topic.tags,
    levels,
    sim2d: { ...topic.sim2d, nodes, edges, steps },
    model3d: { ...topic.model3d, hotspots },
  };
}

export function localizeChallenge(
  challenge: Challenge,
  locale: Locale
): Challenge {
  const overlay = CHALLENGE_OVERLAYS[locale]?.[challenge.id];
  if (!overlay) return challenge;
  return {
    ...challenge,
    question: overlay.question ?? challenge.question,
    hint: overlay.hint ?? challenge.hint,
    explanation: overlay.explanation ?? challenge.explanation,
    // Options keep their ids and the authored answer key.
    options: challenge.options.map((o) => {
      const tr = overlay.options?.[o.id];
      if (!tr) return o;
      return { ...o, label: tr.label ?? o.label, detail: tr.detail ?? o.detail };
    }),
  };
}

export function localizeScenario(scenario: Scenario, locale: Locale): Scenario {
  const overlay = SCENARIO_OVERLAYS[locale]?.[scenario.slug];
  if (!overlay) return scenario;
  const steps = scenario.steps.map((step) => {
    const tr = overlay.steps?.[String(step.order)];
    if (!tr) return step;
    return {
      ...step,
      label: tr.label ?? step.label,
      description: tr.description ?? step.description,
      detail: tr.detail ?? step.detail,
    };
  });
  return {
    ...scenario,
    title: overlay.title ?? scenario.title,
    summary: overlay.summary ?? scenario.summary,
    steps,
  };
}

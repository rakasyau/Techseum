"use client";

import * as React from "react";
import type { Challenge, Scenario, Topic } from "@/lib/types";
import { useLanguage } from "@/components/language-provider";
import {
  localizeChallenge,
  localizeScenario,
  localizeTopic,
} from "./index";

/*
 * Localized content hooks.
 *
 * The exhibit pages are prerendered from the English source, so the overlay is
 * applied on the client where the active locale is known. The result is
 * memoized on `[topic, locale]` so an unchanged locale reuses the same object
 * and does not thrash child effects.
 */
export function useTopic(topic: Topic): Topic {
  const { locale } = useLanguage();
  return React.useMemo(() => localizeTopic(topic, locale), [topic, locale]);
}

export function useOptionalTopic(topic: Topic | undefined): Topic | undefined {
  const { locale } = useLanguage();
  return React.useMemo(
    () => (topic ? localizeTopic(topic, locale) : undefined),
    [topic, locale]
  );
}

export function useTopics(topics: Topic[]): Topic[] {
  const { locale } = useLanguage();
  return React.useMemo(
    () => topics.map((topic) => localizeTopic(topic, locale)),
    [topics, locale]
  );
}

export function useChallenge(challenge: Challenge): Challenge {
  const { locale } = useLanguage();
  return React.useMemo(
    () => localizeChallenge(challenge, locale),
    [challenge, locale]
  );
}

export function useScenario(scenario: Scenario): Scenario {
  const { locale } = useLanguage();
  return React.useMemo(
    () => localizeScenario(scenario, locale),
    [scenario, locale]
  );
}

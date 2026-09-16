import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SCENARIOS, getScenario } from "@/lib/data/scenarios";
import { getTopic } from "@/lib/data/topics";
import { getServerLocale } from "@/lib/i18n/server";
import { localizeScenario, localizeTopic } from "@/lib/i18n/content";
import { ScenarioContent } from "@/components/scenarios/scenario-content";

export function generateStaticParams() {
  return SCENARIOS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const scenario = getScenario(params.slug);
  if (!scenario) return { title: "Scenario not found" };
  return { title: scenario.title, description: scenario.summary };
}

export default function ScenarioPage({
  params,
}: {
  params: { slug: string };
}) {
  const source = getScenario(params.slug);
  if (!source) notFound();

  const locale = getServerLocale();
  const scenario = localizeScenario(source, locale);
  const found = getTopic(source.topicSlug);
  const topic = found ? localizeTopic(found, locale) : undefined;
  const others = SCENARIOS.filter((s) => s.slug !== source.slug).map((s) =>
    localizeScenario(s, locale)
  );

  return (
    <ScenarioContent scenario={scenario} topic={topic} others={others} />
  );
}

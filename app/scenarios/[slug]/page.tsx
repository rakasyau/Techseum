import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SCENARIOS, getScenario } from "@/lib/data/scenarios";
import { getTopic } from "@/lib/data/topics";
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
  const scenario = getScenario(params.slug);
  if (!scenario) notFound();

  const topic = getTopic(scenario.topicSlug);
  const others = SCENARIOS.filter((s) => s.slug !== scenario.slug);

  return (
    <ScenarioContent scenario={scenario} topic={topic} others={others} />
  );
}

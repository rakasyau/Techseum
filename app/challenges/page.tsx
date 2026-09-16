import type { Metadata } from "next";
import { ChallengesBoard } from "@/components/challenges/challenges-board";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Challenges",
  description:
    "Short exercises drawn from every exhibit, plus a daily challenge to keep your streak alive. Every answer is explained.",
};

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-12 lg:px-8 lg:pt-16">
      <PageHeading titleKey="challengeTitle" leadKey="challengeLead" />

      <div className="mt-10">
        <ChallengesBoard />
      </div>
    </div>
  );
}

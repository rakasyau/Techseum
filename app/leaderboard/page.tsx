import type { Metadata } from "next";
import { LeaderboardBoard } from "@/components/leaderboard/leaderboard-board";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Ranked learners by experience points, all time and weekly, filterable per wing.",
};

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-12 lg:px-8 lg:pt-16">
      <PageHeading titleKey="leaderboardTitle" leadKey="leaderboardLead" />

      <div className="mt-10">
        <LeaderboardBoard />
      </div>
    </div>
  );
}

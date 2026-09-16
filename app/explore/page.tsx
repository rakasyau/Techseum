import type { Metadata } from "next";
import { TOPICS } from "@/lib/data/topics";
import { ExploreBrowser } from "@/components/explore/explore-browser";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Explore the collection",
  description:
    "Browse the Techseum collection by wing and difficulty. Every exhibit pairs a stepped diagram with a 3D model and a challenge.",
};

export default function ExplorePage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-12 lg:px-8 lg:pt-16">
      <PageHeading titleKey="exploreTitle" leadKey="exploreLead" />

      <div className="mt-9">
        <ExploreBrowser
          topics={TOPICS}
          initialCategory={searchParams?.category}
        />
      </div>
    </div>
  );
}

"use client";

import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion-primitives";
import { FeaturedRail } from "@/components/home/featured-exhibit";
import { DiscoverGrid } from "@/components/home/discover-grid";
import { HomeBoards } from "@/components/home/home-boards";
import { useLanguage } from "@/components/language-provider";
import { TOPICS } from "@/lib/data/topics";

/*
 * The translated editorial sections of the homepage. Kept as one client
 * component so the page itself stays a server component free of a large
 * client bundle, and so the dictionary is read in one place.
 */
export function FeaturedSection() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-[1320px] px-5 pt-16 lg:px-8 lg:pt-24">
      <Reveal>
        <SectionHeading
          title={t.home.featured}
          description={t.home.featuredLead}
          href="/explore"
          linkLabel={t.common.viewAll}
        />
      </Reveal>
      <div className="mt-8">
        <FeaturedRail slugs={["cpu", "wifi", "camera", "ssd", "neural-net"]} />
      </div>
    </section>
  );
}

export function TrendingSection() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-[1320px] px-5 pt-16 lg:px-8 lg:pt-24">
      <Reveal>
        <SectionHeading
          title={t.home.trending}
          description={t.home.trendingLead}
          href="/leaderboard"
          linkLabel={t.leaderboard.fullRanking}
        />
      </Reveal>
      <div className="mt-8">
        <HomeBoards />
      </div>
    </section>
  );
}

export function DiscoverSection() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-[1320px] px-5 pt-16 lg:px-8 lg:pt-24">
      <Reveal>
        <SectionHeading
          title={t.home.discover}
          description={t.home.discoverLead}
        />
      </Reveal>
      <div className="mt-7">
        <DiscoverGrid topics={TOPICS} />
      </div>
    </section>
  );
}

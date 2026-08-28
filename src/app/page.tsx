// DIRECTION CONTRACT
// THESIS: An interactive technology museum homepage that proves technology is tangible,
// explorable, and beautiful. Refuses the dark-gradient-neon tech category default.
// OWN-WORLD: White/off-white ground, deep indigo darkness (#0A0A0A), electric indigo
// (#4F46E5) accent, General Sans display + Inter body, 24px card radius, dashed-line
// and sparkle decorations.
// STORY: Visitor lands → sees technology made tangible (hero exhibit cards) → stats prove
// scale → category pills invite browsing → featured exhibits show best work → leaderboard
// shows community → discover tabs surface fresh topics → footer invites return.
// FIRST VIEWPORT: Full-width white field. Navbar logo-left/links-center/utils-right. Below,
// two-column hero: left carries massive 3-line headline + subtitle + 2 CTAs + stat bar.
// Right shows two tilted exhibit preview cards with dashed-line arcs and sparkle accents.
// FORM: Bold-minimal exhibition, seed key 87bbe3b6.
// FINISH: Unreviewed and undocumented is unfinished; this build ends with the finish review,
// the verdict, DESIGN.md, and every shipping raster carrying its provenance.

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryPills from "@/components/CategoryPills";
import FeaturedExhibits from "@/components/FeaturedExhibits";
import TrendingLeaderboard from "@/components/TrendingLeaderboard";
import DiscoverTopics from "@/components/DiscoverTopics";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoryPills />
        <FeaturedExhibits />
        <TrendingLeaderboard />
        <DiscoverTopics />
      </main>
      <Footer />
    </>
  );
}

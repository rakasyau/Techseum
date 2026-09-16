import { Hero } from "@/components/home/hero";
import { StackStrip, CategoryRail } from "@/components/home/category-rail";
import { MethodSection } from "@/components/home/method-section";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturedSection } from "@/components/home/home-sections";
import { TrendingSection } from "@/components/home/home-sections";
import { DiscoverSection } from "@/components/home/home-sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StackStrip />
      <CategoryRail />
      <FeaturedSection />
      <div className="mt-16 lg:mt-24">
        <MethodSection />
      </div>
      <TrendingSection />
      <DiscoverSection />
      <div className="mt-20 lg:mt-28">
        <CtaSection />
      </div>
    </>
  );
}

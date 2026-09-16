import type { MetadataRoute } from "next";
import { SCENARIOS } from "@/lib/data/scenarios";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://techseum.rakasyau.my.id";

/*
 * Only public surfaces are listed. Exhibits, challenges and profiles require
 * an account, so advertising them to crawlers would send people to a sign-in
 * wall from search results.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: BASE + "/", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: BASE + "/about", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: BASE + "/lab", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: BASE + "/login", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: BASE + "/register", lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  // Scenario pages are public and are a good entry point to the museum.
  for (const s of SCENARIOS) {
    pages.push({
      url: `${BASE}/scenarios/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return pages;
}

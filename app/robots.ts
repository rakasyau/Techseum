import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://techseum.rakasyau.my.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/lab", "/about", "/scenarios/"],
        // Account-gated areas. Crawlers would only ever reach a sign-in wall.
        disallow: ["/explore", "/challenges", "/leaderboard", "/profile", "/api/"],
      },
    ],
    sitemap: BASE + "/sitemap.xml",
  };
}

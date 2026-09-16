"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { useLanguage } from "./language-provider";

export function SiteFooter() {
  const { t } = useLanguage();

  const COLUMNS = [
    {
      title: t.footer.explore,
      links: [
        { href: "/explore?category=computing", label: "Computing" },
        { href: "/explore?category=networking", label: "Networking" },
        { href: "/explore?category=electronics", label: "Electronics" },
        { href: "/explore?category=everyday", label: "Everyday Tech" },
        { href: "/explore?category=modern", label: "Modern Tech" },
      ],
    },
    {
      title: t.footer.learn,
      links: [
        { href: "/scenarios/open-a-website", label: t.footer.howItWorks },
        { href: "/lab", label: t.footer.interactiveLab },
        { href: "/challenges", label: t.nav.challenges },
        { href: "/leaderboard", label: t.nav.leaderboard },
      ],
    },
    {
      title: t.footer.aboutCol,
      links: [
        { href: "/about", label: t.footer.mission },
        { href: "/about#method", label: t.footer.method },
        { href: "/profile/you", label: t.footer.yourProgress },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[1320px] px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-ink-muted">
              {t.footer.tagline}
            </p>
            <div className="mt-6 max-w-[360px]">
              <label
                htmlFor="newsletter"
                className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted"
              >
                {t.footer.newsletter}
              </label>
              <div className="mt-3">
                <NewsletterForm inputId="newsletter" />
              </div>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1 text-sm text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-7 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Techseum. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {t.footer.operational}
            </span>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 underline-offset-4 hover:text-ink hover:underline"
            >
              {t.footer.privacy}
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/language-provider";

/*
 * One client-side gate for every account-only surface.
 *
 * The rule: How It Works, Lab and About are public. Everything else — the
 * exhibit catalogue, challenges, leaderboard and profile — asks for an
 * account. This renders the prompt instead of the page, so nothing behind the
 * gate is fetched or shown to an anonymous visitor.
 *
 * What stays public is listed here explicitly rather than assumed, so a new
 * route is private until someone opts it in.
 */
const PUBLIC_PREFIXES = ["/scenarios", "/lab", "/about", "/login", "/register"];

export function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(prefix + "/") ||
      pathname.startsWith(prefix + "?")
  );
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  // Public routes render immediately, signed in or not.
  if (isPublicRoute(pathname)) return <>{children}</>;

  if (loading) return <GateSkeleton />;
  if (user) return <>{children}</>;

  return <GatePrompt />;
}

function GatePrompt() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1320px] items-center px-5 py-16 lg:px-8">
      <div className="mx-auto w-full max-w-[560px]">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-paper p-8 text-center shadow-card sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, rgb(var(--accent-soft)), transparent 70%)",
            }}
          />

          <div className="relative">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-paper text-accent">
              <Lock size={22} />
            </span>

            <h1 className="mt-6 font-display text-[clamp(1.6rem,4vw,2.2rem)] font-bold tracking-[-0.036em] text-balance">
              {t.gate.title}
            </h1>
            <p className="mx-auto mt-4 max-w-[44ch] text-[14px] leading-relaxed text-ink-muted">
              {t.gate.lead}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
              >
                {t.gate.createAccount}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-line-strong px-6 text-sm font-medium transition-colors hover:border-ink"
              >
                {t.gate.signIn}
              </Link>
            </div>

            <div className="mt-7 border-t border-line pt-6">
              <p className="flex items-start justify-center gap-2 text-[12.5px] leading-relaxed text-ink-muted">
                <ShieldCheck
                  size={14}
                  className="mt-0.5 shrink-0 text-ink-faint"
                  aria-hidden
                />
                {t.gate.lockNote}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {[
                  { href: "/scenarios/open-a-website", label: t.nav.howItWorks },
                  { href: "/lab", label: t.nav.lab },
                  { href: "/about", label: t.nav.about },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[13px] font-medium text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[12px] leading-relaxed text-ink-faint">
          {t.gate.browseFree}
        </p>
      </div>
    </div>
  );
}

function GateSkeleton() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 py-16 lg:px-8">
      <div className="h-8 w-56 animate-pulse rounded-full bg-paper-sink" />
      <div className="mt-6 h-4 w-80 animate-pulse rounded-full bg-paper-sink" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-paper-sink" />
        ))}
      </div>
    </div>
  );
}

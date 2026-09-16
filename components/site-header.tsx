"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { SearchCommand } from "./search-command";
import { LanguageToggle } from "./language-toggle";
import { AccountMenu } from "./account-menu";
import { useLanguage } from "./language-provider";

export function SiteHeader() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const NAV = [
    { href: "/explore", label: t.nav.explore },
    { href: "/scenarios/open-a-website", label: t.nav.howItWorks },
    { href: "/lab", label: t.nav.lab },
    { href: "/challenges", label: t.nav.challenges },
    { href: "/leaderboard", label: t.nav.leaderboard },
    { href: "/about", label: t.nav.about },
  ];

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 ease-out",
          scrolled
            ? "border-b border-line bg-paper/85 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-paper"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:h-[72px] lg:px-8">
          <Link href="/" className="shrink-0 rounded-lg" aria-label="Techseum">
            <Logo markOnly className="sm:hidden" />
            <Logo className="hidden sm:inline-flex" />
          </Link>

          <nav className="ml-2 hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(
                item.href.split("/").slice(0, 2).join("/")
              );
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-[13.5px] font-medium transition-colors duration-200",
                    active ? "text-ink" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-paper-alt"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 items-center gap-2.5 rounded-full border border-line px-3.5 text-[13px] text-ink-muted transition-colors duration-200 hover:border-line-strong hover:text-ink lg:flex"
            >
              <Search size={15} />
              <kbd className="rounded border border-line bg-paper-alt px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.search}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink lg:hidden"
            >
              <Search size={16} />
            </button>

            <LanguageToggle className="hidden sm:block" />
            <ThemeToggle />
            <AccountMenu />

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={t.nav.toggleMenu}
              aria-expanded={mobileOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink xl:hidden"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </header>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-paper px-5 pb-10 pt-6 lg:top-[72px] xl:hidden"
          >
            <nav className="flex flex-col">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.035, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-between border-b border-line py-4 font-display text-2xl font-semibold tracking-[-0.03em] text-ink"
                  >
                    {item.label}
                    <span className="text-ink-ghost">→</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-6 flex items-center gap-3">
              <LanguageToggle />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

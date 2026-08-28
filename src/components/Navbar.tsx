"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { useUserProgress } from "@/context/UserProgressContext";
import { useLanguage } from "@/context/LanguageContext";
import { FlameIcon } from "@/components/icons/CustomIcons";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, xp, level, streak, logout } = useUserProgress();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.explore, href: "/explore" },
    { label: t.nav.howItWorks, href: "/scenarios/what-happens-when-google" },
    { label: t.nav.lab, href: "/lab" },
    { label: t.nav.challenges, href: "/challenges" },
    { label: t.nav.leaderboard, href: "/leaderboard" },
    { label: t.nav.about, href: "/about" },
  ];

  return (
    <nav
      id="main-nav"
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} id="nav-logo">
          <span className={styles.logoMark}>◉</span>
          <span className={styles.logoText}>Techseum</span>
        </Link>

        <ul
          className={`${styles.links} ${mobileOpen ? styles.linksOpen : ""}`}
          id="nav-links"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={styles.link}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {/* Language Switcher */}
          <button
            className={styles.langBtn}
            onClick={() => setLanguage(language === "en" ? "id" : "en")}
            aria-label="Toggle language"
            id="nav-lang-toggle"
            title="Ganti Bahasa / Switch Language"
          >
            <span className={language === "id" ? styles.langActive : ""}>ID</span>
            <span className={styles.langDivider}>/</span>
            <span className={language === "en" ? styles.langActive : ""}>EN</span>
          </button>

          {/* Search Button */}
          <Link
            href="/explore"
            className={styles.iconBtn}
            aria-label="Search Exhibits"
            id="nav-search"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>

          {/* Theme Toggle */}
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            id="nav-theme-toggle"
          >
            {theme === "light" ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* User Auth or Pass Button */}
          {isAuthenticated ? (
            <div className={styles.userContainer}>
              <Link
                href="/challenges"
                className={styles.userBadgeBtn}
                aria-label="User profile & challenges"
                id="nav-user-badge"
                title={user?.name}
              >
                <span className={styles.streakBadge}>
                  <FlameIcon size={14} color="var(--color-accent-amber)" />
                  {streak}
                </span>
                <span className={styles.userLevelTag}>L{level}</span>
                <span className={styles.userXpTag}>{xp} XP</span>
              </Link>
              <button
                onClick={() => logout()}
                className={styles.logoutBtn}
                title={t.nav.logout}
                id="nav-logout-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className={`btn btn-primary ${styles.loginBtn}`}
              id="nav-login-btn"
            >
              {t.nav.login}
            </Link>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="nav-hamburger"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}

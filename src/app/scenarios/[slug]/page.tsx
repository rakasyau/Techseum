"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getScenarioBySlug } from "@/data/scenarios";
import { useUserProgress } from "@/context/UserProgressContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  CpuIcon,
  WifiIcon,
  DnsIcon,
  GpuIcon,
  MuseumHallIcon,
} from "@/components/icons/CustomIcons";
import styles from "./Scenario.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function StepVectorIcon({ iconKey }: { iconKey: string }) {
  switch (iconKey) {
    case "keyboard":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" />
        </svg>
      );
    case "dns":
      return <DnsIcon size={22} />;
    case "lock":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "fiber":
      return <WifiIcon size={22} />;
    case "server":
      return <CpuIcon size={22} />;
    case "render":
      return <GpuIcon size={22} />;
    default:
      return <CpuIcon size={22} />;
  }
}

export default function ScenarioPage({ params }: PageProps) {
  const { slug } = use(params);
  const { language, t } = useLanguage();
  const scenario = getScenarioBySlug(slug, language);
  const { isAuthenticated, isLoading } = useUserProgress();

  if (!scenario) {
    return (
      <>
        <Navbar />
        <main className={styles.notFoundMain}>
          <div className="container">
            <h1>{t.scenarios.notFoundTitle}</h1>
            <Link href="/explore" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
              {t.scenarios.returnCatalog}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Auth Guard
  if (!isLoading && !isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <section className={styles.heroSection}>
            <div className="container" style={{ textAlign: "center", padding: "4rem 1rem" }}>
              <div style={{ width: "72px", height: "72px", margin: "0 auto 1.5rem", borderRadius: "50%", backgroundColor: "var(--color-accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MuseumHallIcon size={36} color="var(--color-accent)" />
              </div>
              <h1 className={styles.title}>{scenario.title}</h1>
              <p className={styles.subtitle} style={{ margin: "1rem auto 2rem", maxWidth: "50ch" }}>
                {t.topicDetail.mustLoginSubtitle}
              </p>
              <Link href={`/auth/login?redirect=/scenarios/${scenario.slug}`} className="btn btn-primary">
                {t.topicDetail.loginToAccess} →
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* ── Header ───────────────────────────────── */}
        <section className={styles.heroSection}>
          <div className="container">
            <span className={styles.kicker}>{t.scenarios.kicker}</span>
            <h1 className={styles.title}>{scenario.title}</h1>
            <p className={styles.subtitle}>{scenario.subtitle}</p>

            <div className={styles.metaRow}>
              <span className={styles.durationBadge}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{scenario.totalDurationMs}</span>
              </span>
              <span className={styles.stepsBadge}>
                <CpuIcon size={15} />
                <span>{scenario.steps.length} {t.scenarios.phases}</span>
              </span>
            </div>
          </div>
        </section>

        {/* ── Interactive Scroll Timeline ──────────── */}
        <section className={styles.timelineSection}>
          <div className="container">
            <div className={styles.timelineTrack}>
              {scenario.steps.map((step) => (
                <div key={step.order} className={styles.timelineNode}>
                  <div className={styles.nodeLeft}>
                    <div className={styles.stepIconBubble}>
                      <StepVectorIcon iconKey={step.icon} />
                    </div>
                    <span className={styles.nodeTime}>{step.timeEstimate}</span>
                  </div>

                  <div className={styles.stepContentCard}>
                    <div className={styles.stepCardHeader}>
                      <span className={styles.stepCategoryTag}>{step.category}</span>
                      <h3 className={styles.stepHeading}>{step.title}</h3>
                    </div>

                    <p className={styles.stepSummaryText}>{step.summary}</p>

                    <div className={styles.technicalBox}>
                      <span className={styles.techLabel}>{t.scenarios.underTheHood}</span>
                      <p className={styles.techDetails}>{step.technicalDetails}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.timelineFooter}>
              <h3 className={styles.footHeading}>{t.scenarios.readyToExplore}</h3>
              <div className={styles.footActions}>
                <Link href="/explore/dns" className="btn btn-primary">
                  {t.scenarios.exploreDns}
                </Link>
                <Link href="/explore/cpu" className="btn btn-outline">
                  {t.scenarios.exploreCpu}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

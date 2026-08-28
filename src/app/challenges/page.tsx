"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TOPICS } from "@/data/topics";
import { useUserProgress } from "@/context/UserProgressContext";
import { useLanguage } from "@/context/LanguageContext";
import { FlameIcon, TrophyIcon, MuseumHallIcon } from "@/components/icons/CustomIcons";
import styles from "./Challenges.module.css";

export default function ChallengesPage() {
  const { isAuthenticated, isLoading, xp, level, streak, badges } = useUserProgress();
  const { t } = useLanguage();

  const xpForNextLevel = Math.pow(level, 2) * 100;
  const currentLevelBaseXP = Math.pow(level - 1, 2) * 100;
  const levelProgressPct = Math.min(
    100,
    Math.max(
      0,
      ((xp - currentLevelBaseXP) / (xpForNextLevel - currentLevelBaseXP || 1)) * 100
    )
  );

  // Auth Guard
  if (!isLoading && !isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <section className={styles.heroSection}>
            <div className="container" style={{ textAlign: "center", padding: "4rem 1rem" }}>
              <div style={{ width: "72px", height: "72px", margin: "0 auto 1.5rem", borderRadius: "50%", backgroundColor: "var(--color-accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrophyIcon size={36} color="var(--color-accent)" />
              </div>
              <h1 className={styles.title}>{t.challenges.title}</h1>
              <p className={styles.subtitle} style={{ margin: "1rem auto 2rem", maxWidth: "50ch" }}>
                {t.topicDetail.mustLoginSubtitle}
              </p>
              <Link href="/auth/login?redirect=/challenges" className="btn btn-primary">
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
            <span className={styles.kicker}>{t.challenges.kicker}</span>
            <h1 className={styles.title}>{t.challenges.title}</h1>
            <p className={styles.subtitle}>{t.challenges.subtitle}</p>

            {/* User Gamification Stats Card */}
            <div className={styles.statsCard}>
              <div className={styles.statCol}>
                <span className={styles.statLabel}>{t.challenges.currentLevel}</span>
                <span className={styles.statNum}>Level {level}</span>
                <span className={styles.statSub}>Architect in Training</span>
              </div>
              <div className={styles.statCol}>
                <span className={styles.statLabel}>{t.challenges.totalXp}</span>
                <span className={styles.statNum}>{xp.toLocaleString()} XP</span>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: `${levelProgressPct}%` }} />
                </div>
              </div>
              <div className={styles.statCol}>
                <span className={styles.statLabel}>{t.challenges.dailyStreak}</span>
                <span className={styles.statNum} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <FlameIcon size={22} color="var(--color-accent-amber)" />
                  {streak} Days
                </span>
                <span className={styles.statSub}>Active Explorer</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Badges Gallery ───────────────────────── */}
        <section className={styles.badgeSection}>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.secTitle}>{t.challenges.badgesTitle}</h2>
              <span className={styles.badgeCount}>
                {badges.length} {t.challenges.collected}
              </span>
            </div>

            <div className={styles.badgesGrid}>
              {badges.map((b) => (
                <div key={b.id} className={styles.badgeCard}>
                  <div className={styles.badgeIconBox}>
                    <MuseumHallIcon size={28} color="var(--color-accent)" />
                  </div>
                  <h4 className={styles.badgeName}>{b.name}</h4>
                  <p className={styles.badgeDesc}>{b.description}</p>
                  {b.unlockedAt && (
                    <span className={styles.unlockedDate}>Unlocked {b.unlockedAt}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Available Challenges Grid ────────────── */}
        <section className={styles.challengesGridSection}>
          <div className="container">
            <h2 className={styles.secTitle}>{t.challenges.exhibitsTitle}</h2>
            <div className={styles.challengesGrid}>
              {TOPICS.map((topic) => (
                <article key={topic.id} className={styles.challengeItem}>
                  <div className={styles.challengeMeta}>
                    <span className={styles.catName} style={{ color: topic.accentColor }}>
                      {topic.category}
                    </span>
                    <span className={styles.xpTag}>+{topic.challenge.xpReward} XP</span>
                  </div>
                  <h3 className={styles.chTitle}>{topic.title}</h3>
                  <p className={styles.chQuestion}>{topic.challenge.question}</p>
                  <Link href={`/explore/${topic.slug}`} className="btn btn-outline" style={{ alignSelf: "flex-start", marginTop: "auto" }}>
                    {t.challenges.launchChallenge} →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

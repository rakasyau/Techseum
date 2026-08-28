"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
  MedalGoldIcon,
  MedalSilverIcon,
  MedalBronzeIcon,
  FlameIcon,
} from "@/components/icons/CustomIcons";
import styles from "./Leaderboard.module.css";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  categorySpecialty: string;
  xp: number;
  streak: number;
  badgesCount: number;
  isRealUser?: boolean;
}

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState<"weekly" | "all-time">("weekly");
  const [selectedCat, setSelectedCat] = useState("All");
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.success && data.leaders) {
          setLeaders(data.leaders);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  const categories = [
    "All",
    t.categories.computing,
    t.categories.networking,
    t.categories.electronics,
    t.categories.everyday,
    t.categories.modern,
  ];

  const filtered = leaders.filter(
    (u) => selectedCat === "All" || u.categorySpecialty === selectedCat
  );

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className="container">
            <span className={styles.kicker}>{t.leaderboard.kicker}</span>
            <h1 className={styles.title}>{t.leaderboard.title}</h1>
            <p className={styles.subtitle}>{t.leaderboard.subtitle}</p>

            {/* Timeframe Toggles */}
            <div className={styles.controlsRow}>
              <div className={styles.timeframeTabs}>
                <button
                  className={`${styles.tfBtn} ${timeframe === "weekly" ? styles.tfActive : ""}`}
                  onClick={() => setTimeframe("weekly")}
                >
                  {t.leaderboard.thisWeek}
                </button>
                <button
                  className={`${styles.tfBtn} ${timeframe === "all-time" ? styles.tfActive : ""}`}
                  onClick={() => setTimeframe("all-time")}
                >
                  {t.leaderboard.allTime}
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className={styles.catPills}>
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`${styles.catPill} ${selectedCat === c ? styles.catPillActive : ""}`}
                    onClick={() => setSelectedCat(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.tableSection}>
          <div className="container">
            <div className={styles.rankTable}>
              <div className={styles.tableHeader}>
                <span className={styles.thRank}>{t.leaderboard.rank}</span>
                <span className={styles.thUser}>{t.leaderboard.explorer}</span>
                <span className={styles.thSpecialty}>{t.leaderboard.topCategory}</span>
                <span className={styles.thStreak}>{t.leaderboard.streak}</span>
                <span className={styles.thXp}>{t.leaderboard.totalXp}</span>
              </div>

              <div className={styles.tableBody}>
                {loading ? (
                  <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                    Loading leaderboard standings...
                  </div>
                ) : (
                  filtered.map((user) => (
                    <div key={user.rank} className={styles.tableRow}>
                      <div className={styles.rankCol}>
                        <span className={styles.rankBadge}>
                          {user.rank === 1 ? (
                            <MedalGoldIcon size={24} />
                          ) : user.rank === 2 ? (
                            <MedalSilverIcon size={24} />
                          ) : user.rank === 3 ? (
                            <MedalBronzeIcon size={24} />
                          ) : (
                            `#${user.rank}`
                          )}
                        </span>
                      </div>
                      <div className={styles.userCol}>
                        <div className={styles.avatar}>{user.avatar}</div>
                        <div className={styles.nameBlock}>
                          <span className={styles.userName}>
                            {user.name}
                            {user.isRealUser && (
                              <span style={{ marginLeft: "6px", fontSize: "0.6875rem", color: "var(--color-accent)", fontWeight: 700 }}>
                                (You)
                              </span>
                            )}
                          </span>
                          <span className={styles.userBadges}>{user.badgesCount} badges</span>
                        </div>
                      </div>
                      <div className={styles.specialtyCol}>
                        <span className={styles.specialtyBadge}>{user.categorySpecialty}</span>
                      </div>
                      <div className={styles.streakCol}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <FlameIcon size={14} color="var(--color-accent-amber)" />
                          {user.streak} days
                        </span>
                      </div>
                      <div className={styles.xpCol}>
                        <span className={styles.xpVal}>{user.xp.toLocaleString()} XP</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

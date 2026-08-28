"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { TOPICS, getLocalizedTopic } from "@/data/topics";
import { FlameIcon, MedalGoldIcon, MedalSilverIcon, MedalBronzeIcon } from "@/components/icons/CustomIcons";
import styles from "./TrendingLeaderboard.module.css";

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 60;
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`
    )
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TrendingLeaderboard() {
  const { language, t } = useLanguage();
  const [topLearners, setTopLearners] = useState<Array<{
    rank: number;
    name: string;
    avatar: string;
    xp: number;
    streak: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.success && data.leaders) {
          setTopLearners(data.leaders.slice(0, 5));
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  const trendingTopics = ["cpu", "wifi", "camera", "ssd", "ai-neural"].map((slug, i) => {
    const raw = TOPICS.find((tp) => tp.slug === slug)!;
    const localized = getLocalizedTopic(raw, language);
    return {
      rank: i + 1,
      name: localized.title,
      slug: localized.slug,
      category: localized.category,
      readTime: localized.readTime,
      change: `+${(5 - i) * 3}%`,
    };
  });

  return (
    <section className={`section ${styles.section}`} id="trending-leaderboard">
      <div className={`container ${styles.container}`}>
        {/* ── Trending Topics ──────────────────────── */}
        <motion.div
          className={styles.column}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.columnHeader}>
            <h2 className="section-title">
              {language === "id" ? "Eksibit Populer" : "Trending Exhibits"}
            </h2>
            <Link href="/explore" className={styles.period}>
              {language === "id" ? "Lihat semua →" : "View all →"}
            </Link>
          </div>

          <div className={styles.list}>
            {trendingTopics.map((topic) => (
              <Link
                key={topic.rank}
                href={`/explore/${topic.slug}`}
                className={styles.row}
                id={`trending-${topic.rank}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className={styles.rank}>
                  {topic.rank === 1 && <MedalGoldIcon size={20} />}
                  {topic.rank === 2 && <MedalSilverIcon size={20} />}
                  {topic.rank === 3 && <MedalBronzeIcon size={20} />}
                  {topic.rank > 3 && topic.rank}
                </span>
                <div className={styles.rowInfo}>
                  <span className={styles.rowName}>{topic.name}</span>
                  <span className={styles.rowSub}>
                    {topic.category} · {topic.readTime}
                  </span>
                </div>
                <div className={styles.rowRight}>
                  <MiniSparkline
                    data={[3, 5, 4, 7, 6, 8, 9]}
                    color="var(--color-accent)"
                  />
                  <span className={styles.change}>{topic.change}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Top Learners ─────────────────────────── */}
        <motion.div
          className={styles.column}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.15,
          }}
        >
          <div className={styles.columnHeader}>
            <h2 className="section-title">
              {language === "id" ? "Peringkat Penjelajah" : "Top Explorers"}
            </h2>
            <Link href="/leaderboard" className={styles.period}>
              {t.leaderboard.allTime} →
            </Link>
          </div>

          <div className={styles.list}>
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                {language === "id" ? "Memuat data peringkat..." : "Loading live standings..."}
              </div>
            ) : topLearners.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                <p>{language === "id" ? "Jadilah penjelajah pertama yang mencetak skor XP!" : "Be the first explorer to earn XP!"}</p>
                <Link href="/auth/register" className="btn btn-outline" style={{ marginTop: "1rem" }}>
                  {language === "id" ? "Daftar Akun Sekarang" : "Join & Claim XP"}
                </Link>
              </div>
            ) : (
              topLearners.map((learner) => (
                <Link
                  key={learner.rank}
                  href="/leaderboard"
                  className={styles.row}
                  id={`learner-${learner.rank}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className={styles.rank}>
                    {learner.rank === 1 && <MedalGoldIcon size={20} />}
                    {learner.rank === 2 && <MedalSilverIcon size={20} />}
                    {learner.rank === 3 && <MedalBronzeIcon size={20} />}
                    {learner.rank > 3 && learner.rank}
                  </span>
                  <div className={styles.avatar}>
                    {learner.avatar}
                  </div>
                  <div className={styles.rowInfo}>
                    <span className={styles.rowName}>{learner.name}</span>
                    <span className={styles.rowSub}>
                      {learner.xp.toLocaleString()} XP · <FlameIcon size={12} color="var(--color-accent-amber)" /> {learner.streak} {language === "id" ? "hari" : "streak"}
                    </span>
                  </div>
                  <div className={styles.rowRight}>
                    <MiniSparkline
                      data={[2, 4, 3, 6, 5, 7, 8]}
                      color="var(--color-success)"
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

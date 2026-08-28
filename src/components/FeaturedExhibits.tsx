"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedTopic, TOPICS } from "@/data/topics";
import { TopicThumbnailDispatcher } from "@/components/illustrations/TopicThumbnails";
import styles from "./FeaturedExhibits.module.css";

const FEATURED_SLUGS = ["cpu", "wifi", "camera", "ssd"];

export default function FeaturedExhibits() {
  const { language, t } = useLanguage();

  const featuredTopics = FEATURED_SLUGS.map((slug) => {
    const raw = TOPICS.find((top) => top.slug === slug)!;
    return getLocalizedTopic(raw, language);
  });

  return (
    <section className={`section ${styles.section}`} id="featured-exhibits">
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className="section-title">{t.featured?.title || (language === "id" ? "Eksibit Pilihan" : "Featured Exhibits")}</h2>
            <p className="section-subtitle">
              {t.featured?.subtitle || (language === "id" ? "Jelajahi teknologi paling populer dengan simulasi interaktif mendalam" : "Step inside our most popular interactive technology deep dives")}
            </p>
          </div>
          <Link href="/explore" className={styles.seeAll}>
            {language === "id" ? "Lihat Semua Eksibit →" : "View All Exhibits →"}
          </Link>
        </div>

        <div className={styles.grid}>
          {featuredTopics.map((topic, i) => (
            <motion.article
              key={topic.id}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
              id={`featured-card-${topic.id}`}
            >
              <Link href={`/explore/${topic.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div className={styles.cardThumb}>
                  <TopicThumbnailDispatcher slug={topic.slug} />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardCategory}>{topic.category}</span>
                    <span
                      className={styles.cardLevel}
                      data-level={topic.difficulty.toLowerCase()}
                    >
                      {topic.difficulty}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{topic.title}</h3>
                  <div className={styles.cardFooter}>
                    <div className={styles.explorers}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      <span>{topic.readTime}</span>
                    </div>
                    <span className={styles.simStageBadge}>
                      {topic.simulationSteps.length} {language === "id" ? "Tahap" : "Stages"}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

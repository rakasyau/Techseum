"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { TOPICS, getLocalizedTopic } from "@/data/topics";
import { TopicThumbnailDispatcher } from "@/components/illustrations/TopicThumbnails";
import styles from "./DiscoverTopics.module.css";

export default function DiscoverTopics() {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");

  const filterOptions = [
    { slug: "all", name: t.categories.all },
    { slug: "computing", name: t.categories.computing },
    { slug: "networking", name: t.categories.networking },
    { slug: "electronics", name: t.categories.electronics },
    { slug: "everyday", name: t.categories.everyday },
    { slug: "modern", name: t.categories.modern },
  ];

  const localizedList = TOPICS.map((top) => getLocalizedTopic(top, language));

  const filtered =
    activeFilter === "all"
      ? localizedList
      : localizedList.filter((topic) => topic.categorySlug === activeFilter);

  return (
    <section className={`section ${styles.section}`} id="discover-topics">
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h2 className="section-title">
            {language === "id" ? "Jelajahi Topik Baru" : "Discover New Topics"}
          </h2>
          <p className="section-subtitle">
            {language === "id"
              ? "Telusuri katalog lengkap eksibit sains dan arsitektur teknologi interaktif"
              : "Explore the latest interactive exhibits added to the museum catalog"}
          </p>
        </div>

        <div className={styles.filters} id="discover-filters">
          {filterOptions.map((filter) => (
            <button
              key={filter.slug}
              className={`${styles.filterPill} ${activeFilter === filter.slug ? styles.active : ""}`}
              onClick={() => setActiveFilter(filter.slug)}
              id={`filter-${filter.slug}`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filtered.map((topic) => (
              <motion.article
                key={topic.id}
                className={styles.card}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                id={`discover-card-${topic.id}`}
              >
                <Link
                  href={`/explore/${topic.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <div className={styles.cardVisual}>
                    <TopicThumbnailDispatcher slug={topic.slug} />
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMetaRow}>
                      <span className={styles.cardCat}>{topic.category}</span>
                      <span className={styles.cardDiff}>{topic.difficulty}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{topic.title}</h3>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardReadTime}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {topic.readTime}
                      </span>
                      <span className={styles.cardSimCount}>
                        {topic.simulationSteps.length} {language === "id" ? "Tahap" : "Stages"}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

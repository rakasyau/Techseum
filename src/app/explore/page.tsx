"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TOPICS, getLocalizedTopic } from "@/data/topics";
import { useUserProgress } from "@/context/UserProgressContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  MuseumHallIcon,
  CpuIcon,
  WifiIcon,
  CameraIcon,
  TouchscreenIcon,
  NeuralIcon,
} from "@/components/icons/CustomIcons";
import { TopicThumbnailDispatcher } from "@/components/illustrations/TopicThumbnails";
import styles from "./Explore.module.css";

export default function ExplorePage() {
  const { toggleBookmark, bookmarks, completedTopics } = useUserProgress();
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { slug: "all", name: t.categories.all, icon: <MuseumHallIcon size={18} /> },
    { slug: "computing", name: t.categories.computing, icon: <CpuIcon size={18} /> },
    { slug: "networking", name: t.categories.networking, icon: <WifiIcon size={18} /> },
    { slug: "electronics", name: t.categories.electronics, icon: <CameraIcon size={18} /> },
    { slug: "everyday", name: t.categories.everyday, icon: <TouchscreenIcon size={18} /> },
    { slug: "modern", name: t.categories.modern, icon: <NeuralIcon size={18} /> },
  ];

  const difficulties = [
    { slug: "all", label: t.levels.all },
    { slug: "simple", label: t.levels.simple },
    { slug: "beginner", label: t.levels.beginner },
    { slug: "technical", label: t.levels.technical },
    { slug: "deep dive", label: t.levels.deepDive },
  ];

  const localizedList = useMemo(() => {
    return TOPICS.map((top) => getLocalizedTopic(top, language));
  }, [language]);

  const filteredTopics = useMemo(() => {
    return localizedList.filter((topic) => {
      const matchCat =
        selectedCategory === "all" || topic.categorySlug === selectedCategory;
      const matchDiff =
        selectedDifficulty === "all" ||
        topic.difficulty.toLowerCase() === selectedDifficulty;
      const matchSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [localizedList, selectedCategory, selectedDifficulty, searchQuery]);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* ── Page Header ──────────────────────────── */}
        <section className={styles.heroSection}>
          <div className="container">
            <span className={styles.kicker}>{t.explore.kicker}</span>
            <h1 className={styles.title}>{t.explore.title}</h1>
            <p className={styles.subtitle}>{t.explore.subtitle}</p>

            {/* Instant Search Bar */}
            <div className={styles.searchBarWrapper}>
              <svg
                className={styles.searchIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={t.explore.searchPlaceholder}
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="explore-search-input"
              />
              {searchQuery && (
                <button
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Filter Bar ───────────────────────────── */}
        <section className={styles.filtersSection}>
          <div className="container">
            <div className={styles.filterBar}>
              {/* Category Pills */}
              <div className={styles.categoryScroll}>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    className={`${styles.catPill} ${selectedCategory === cat.slug ? styles.catPillActive : ""}`}
                    onClick={() => setSelectedCategory(cat.slug)}
                    id={`cat-filter-${cat.slug}`}
                  >
                    <span className={styles.catIcon}>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Difficulty Dropdown */}
              <div className={styles.diffSelector}>
                <select
                  className={styles.diffSelect}
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  id="diff-filter-select"
                >
                  {difficulties.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ── Exhibits Grid ────────────────────────── */}
        <section className={styles.gridSection}>
          <div className="container">
            <div className={styles.resultsCount}>
              {t.explore.showingCount} <strong>{filteredTopics.length}</strong> {t.explore.learners}
            </div>

            <div className={styles.grid}>
              {filteredTopics.map((topic) => {
                const isBookmarked = bookmarks.includes(topic.id);
                const isMastered = completedTopics.includes(topic.id);

                return (
                  <article key={topic.id} className={styles.card} id={`topic-card-${topic.slug}`}>
                    <a href={`/explore/${topic.slug}`} className={styles.cardLink}>
                      <div className={styles.cardThumb}>
                        <div className={styles.cardSvgWrapper}>
                          <TopicThumbnailDispatcher slug={topic.slug} />
                        </div>

                        {isMastered && (
                          <div className={styles.completedBadge} title="Exhibit Mastered">
                            ✓ {t.explore.mastered}
                          </div>
                        )}
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.cardMeta}>
                          <span className={styles.cardCategory} style={{ color: topic.accentColor }}>
                            {topic.category}
                          </span>
                          <span className={styles.diffBadge} data-level={topic.difficulty.toLowerCase()}>
                            {topic.difficulty}
                          </span>
                        </div>

                        <h3 className={styles.cardTitle}>{topic.title}</h3>
                        <p className={styles.cardTagline}>{topic.tagline}</p>

                        <div className={styles.cardFooter}>
                          <span className={styles.readTime}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            {topic.readTime}
                          </span>
                          <span className={styles.explorersCount}>
                            {topic.simulationSteps.length} {language === "id" ? "Tahap Simulasi" : "Sim Stages"}
                          </span>
                        </div>
                      </div>
                    </a>

                    <button
                      className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarkedActive : ""}`}
                      onClick={() => toggleBookmark(topic.id)}
                      aria-label="Bookmark topic"
                      id={`bookmark-topic-${topic.slug}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

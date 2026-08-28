"use client";

import { use, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Simulation2DEngine from "@/components/simulations/Simulation2DEngine";
import Simulation3DViewer from "@/components/simulations/Simulation3DViewer";
import MiniChallenge from "@/components/simulations/MiniChallenge";
import AskWhyAssistant from "@/components/simulations/AskWhyAssistant";
import { getTopicBySlug } from "@/data/topics";
import { useUserProgress } from "@/context/UserProgressContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./TopicDetail.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TopicDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { language, t } = useLanguage();
  const topic = getTopicBySlug(slug, language);
  const { isAuthenticated, isLoading, toggleBookmark, markTopicCompleted, bookmarks, completedTopics } = useUserProgress();

  const [activeLevel, setActiveLevel] = useState<number>(1); // 1 = Simple, 2 = Beginner, 3 = Technical, 4 = Deep Dive
  const [simMode, setSimMode] = useState<"2d" | "3d">("2d");
  const [isNarrating, setIsNarrating] = useState(false);

  if (!topic) {
    return (
      <>
        <Navbar />
        <main className={styles.notFoundMain}>
          <div className="container">
            <h1 className={styles.notFoundTitle}>Exhibit Not Found</h1>
            <p className={styles.notFoundSubtitle}>
              The technology exhibit you requested is not currently cataloged in the museum.
            </p>
            <Link href="/explore" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
              ← Return to Museum Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Auth Guard: Require Login to access interactive learning exhibits
  if (!isLoading && !isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <section className={styles.lockedSection}>
            <div className="container">
              <div className={styles.lockedCard}>
                <div className={styles.lockedIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h2 className={styles.lockedTitle}>{t.topicDetail.mustLoginTitle}</h2>
                <p className={styles.lockedSubtitle}>
                  {t.topicDetail.mustLoginSubtitle}
                </p>
                <div className={styles.lockedActions}>
                  <Link
                    href={`/auth/login?redirect=/explore/${topic.slug}`}
                    className="btn btn-primary"
                    id="locked-login-btn"
                  >
                    {t.topicDetail.loginToAccess} →
                  </Link>
                  <Link href="/explore" className="btn btn-outline">
                    ← {t.topicDetail.directory}
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

  const currentLevel = topic.levels.find((l) => l.level === activeLevel) || topic.levels[0];
  const isBookmarked = bookmarks.includes(topic.id);
  const isCompleted = completedTopics.includes(topic.id);

  const toggleNarration = () => {
    setIsNarrating(!isNarrating);
    if (!isNarrating && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${currentLevel.summary}. ${currentLevel.keyConcepts.join(". ")}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.lang = language === "id" ? "id-ID" : "en-US";
      utterance.onend = () => setIsNarrating(false);
      window.speechSynthesis.speak(utterance);
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const relatedTopics = topic.relatedSlugs
    .map((s) => getTopicBySlug(s, language))
    .filter(Boolean);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* ── Breadcrumb & Top Bar ─────────────────── */}
        <section className={styles.breadcrumbSection}>
          <div className="container">
            <div className={styles.breadcrumbBar}>
              <Link href="/explore" className={styles.backLink}>
                ← {t.topicDetail.directory}
              </Link>
              <div className={styles.breadcrumbPath}>
                <span className={styles.crumbMuted}>{topic.category}</span>
                <span className={styles.crumbSep}>/</span>
                <span className={styles.crumbCurrent}>{topic.title}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Exhibit Hero ─────────────────────────── */}
        <section className={styles.heroSection}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div className={styles.heroLeft}>
                <div className={styles.metaBadges}>
                  <span className={styles.categoryBadge} style={{ color: topic.accentColor, borderColor: topic.accentColor }}>
                    {topic.category}
                  </span>
                  <span className={styles.diffBadge} data-level={topic.difficulty.toLowerCase()}>
                    {topic.difficulty}
                  </span>
                  <span className={styles.readTimeBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {topic.readTime}
                  </span>
                </div>

                <h1 className={styles.topicTitle}>{topic.title}</h1>
                <p className={styles.topicTagline}>{topic.tagline}</p>

                <div className={styles.actionRow}>
                  <button
                    className={`btn ${isCompleted ? "btn-outline" : "btn-primary"}`}
                    onClick={() => markTopicCompleted(topic.id)}
                    id="mark-completed-btn"
                  >
                    {isCompleted ? `✓ ${t.topicDetail.masteredReward}` : t.topicDetail.markMastered}
                  </button>

                  <button
                    className={`${styles.iconActionBtn} ${isBookmarked ? styles.activeBookmark : ""}`}
                    onClick={() => toggleBookmark(topic.id)}
                    aria-label="Bookmark this exhibit"
                    id="topic-bookmark-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{isBookmarked ? t.topicDetail.bookmarked : t.topicDetail.bookmark}</span>
                  </button>

                  <button
                    className={`${styles.iconActionBtn} ${isNarrating ? styles.narratingActive : ""}`}
                    onClick={toggleNarration}
                    id="audio-narration-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    <span>{isNarrating ? t.topicDetail.audioListening : t.topicDetail.audioGuide}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Interactive Simulation Section ───────── */}
        <section className={styles.simulationSection}>
          <div className="container">
            <div className={styles.sectionHeaderRow}>
              <div>
                <span className={styles.secKicker}>{t.topicDetail.simKicker}</span>
                <h2 className={styles.secTitle}>{t.topicDetail.simTitle}</h2>
              </div>

              {/* Simulation Mode Toggle (2D vs 3D) */}
              <div className={styles.modeToggle}>
                <button
                  className={`${styles.modeBtn} ${simMode === "2d" ? styles.modeBtnActive : ""}`}
                  onClick={() => setSimMode("2d")}
                  id="toggle-2d-mode"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>{t.topicDetail.sim2D}</span>
                </button>
                <button
                  className={`${styles.modeBtn} ${simMode === "3d" ? styles.modeBtnActive : ""}`}
                  onClick={() => setSimMode("3d")}
                  id="toggle-3d-mode"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span>{t.topicDetail.sim3D}</span>
                </button>
              </div>
            </div>

            {/* Visualizer Renderer */}
            <div className={styles.simMount}>
              {simMode === "2d" ? (
                <Simulation2DEngine
                  topicId={topic.id}
                  topicTitle={topic.title}
                  steps={topic.simulationSteps}
                  totalSteps={topic.simulationSteps?.length || 4}
                />
              ) : (
                <Simulation3DViewer
                  topicId={topic.id}
                  topicTitle={topic.title}
                />
              )}
            </div>
          </div>
        </section>

        {/* ── 4-Level Explanation Depth Tabs ───────── */}
        <section className={styles.depthSection}>
          <div className="container">
            <div className={styles.depthHeader}>
              <div>
                <span className={styles.secKicker}>{t.topicDetail.depthKicker}</span>
                <h2 className={styles.secTitle}>{t.topicDetail.depthTitle}</h2>
              </div>

              {/* 4 Level Tabs */}
              <div className={styles.levelTabs} id="level-tabs-container">
                {topic.levels.map((lvl) => (
                  <button
                    key={lvl.level}
                    className={`${styles.levelTabBtn} ${activeLevel === lvl.level ? styles.levelTabActive : ""}`}
                    onClick={() => setActiveLevel(lvl.level)}
                    id={`level-tab-${lvl.level}`}
                  >
                    <span className={styles.levelNum}>L{lvl.level}</span>
                    <span className={styles.levelName}>{lvl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Depth Card Content */}
            <div className={styles.depthCard}>
              <div className={styles.depthCardTop}>
                <div className={styles.audienceInfo}>
                  <span className={styles.audLabel}>{t.topicDetail.targetAudience}</span>
                  <span className={styles.audVal}>{currentLevel.audience}</span>
                </div>
                <div className={styles.currentSummary}>{currentLevel.summary}</div>
              </div>

              {/* Key Concept Bullets */}
              <div className={styles.keyConceptsBox}>
                <h4 className={styles.kcTitle}>{t.topicDetail.keyTakeaways}</h4>
                <ul className={styles.kcList}>
                  {currentLevel.keyConcepts.map((concept, i) => (
                    <li key={i} className={styles.kcItem}>
                      <span className={styles.kcBullet}>✓</span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formatted Markdown Content */}
              <div className={styles.proseContent}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentLevel.markdownContent
                      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
                      .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
                      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
                      .replace(/`([^`]+)`/gim, "<code>$1</code>")
                      .replace(/\n\n/gim, "<p></p>"),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Mini Challenge & AI Assistant ────────── */}
        <section className={styles.challengeSection}>
          <div className="container">
            <div className={styles.twoColGrid}>
              <div>
                <MiniChallenge challenge={topic.challenge} topicTitle={topic.title} />
              </div>
              <div>
                <AskWhyAssistant topic={topic} currentLevelName={currentLevel.name} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Related Topics ───────────────────────── */}
        {relatedTopics.length > 0 && (
          <section className={styles.relatedSection}>
            <div className="container">
              <h3 className={styles.relatedTitle}>{t.topicDetail.relatedTitle}</h3>
              <div className={styles.relatedGrid}>
                {relatedTopics.map((rel) => {
                  if (!rel) return null;
                  return (
                    <Link
                      key={rel.id}
                      href={`/explore/${rel.slug}`}
                      className={styles.relatedCard}
                    >
                      <span className={styles.relCat} style={{ color: rel.accentColor }}>
                        {rel.category}
                      </span>
                      <h4 className={styles.relTitle}>{rel.title}</h4>
                      <p className={styles.relTagline}>{rel.tagline}</p>
                      <span className={styles.relArrow}>{t.topicDetail.exploreExhibit} →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

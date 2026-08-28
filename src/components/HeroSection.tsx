"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./HeroSection.module.css";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M8 0L9.6 6.4L16 8L9.6 9.6L8 16L6.4 9.6L0 8L6.4 6.4L8 0Z" />
    </svg>
  );
}

export default function HeroSection() {
  const { t } = useLanguage();

  const stats = [
    { value: "50+", label: t.hero.topicsCount },
    { value: "120+", label: t.hero.simsCount },
    { value: "10K+", label: t.hero.learnersCount },
  ];

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.inner}>
        {/* ── Left Column ──────────────────────────── */}
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.headline} id="hero-headline">
            {t.hero.headlineLine1}
            <br />
            {t.hero.headlineLine2}
            <br />
            {t.hero.headlineLine3}
          </h1>

          <p className={styles.subtitle} id="hero-subtitle">
            {t.hero.subtitle}
          </p>

          <div className={styles.ctas}>
            <a href="/explore" className={`btn btn-primary ${styles.ctaPrimary}`} id="hero-cta-primary">
              {t.hero.startExploring}
            </a>
            <a href="/scenarios/what-happens-when-google" className={`btn btn-outline ${styles.ctaSecondary}`} id="hero-cta-secondary">
              {t.hero.watchDemo}
            </a>
          </div>

          <div className={styles.stats} id="hero-stats">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className={styles.stat}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.5 + i * 0.1,
                }}
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Right Column: Exhibit Cards ──────────── */}
        <div className={styles.exhibit} id="hero-exhibit">
          {/* Dashed decoration arcs */}
          <svg
            className={styles.decoArc}
            viewBox="0 0 400 400"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="200"
              cy="200"
              r="180"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeDasharray="8 8"
              opacity="0.25"
            />
            <circle
              cx="200"
              cy="200"
              r="140"
              stroke="var(--color-border)"
              strokeWidth="1"
              strokeDasharray="6 10"
              opacity="0.4"
            />
          </svg>

          {/* Sparkle decorations */}
          <SparkleIcon className={`${styles.sparkle} ${styles.sparkle1}`} />
          <SparkleIcon className={`${styles.sparkle} ${styles.sparkle2}`} />
          <SparkleIcon className={`${styles.sparkle} ${styles.sparkle3}`} />
          <SparkleIcon className={`${styles.sparkle} ${styles.sparkle4}`} />

          {/* Card 1: CPU */}
          <motion.div
            className={`${styles.exhibitCard} ${styles.card1}`}
            initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
            animate={{ opacity: 1, rotate: -5, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.3,
            }}
            id="hero-card-cpu"
          >
            <a href="/explore/cpu" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div className={styles.cardVisual}>
                <svg viewBox="0 0 200 200" className={styles.chipSvg}>
                  {/* CPU chip body */}
                  <rect
                    x="50"
                    y="50"
                    width="100"
                    height="100"
                    rx="8"
                    fill="var(--color-accent)"
                    opacity="0.12"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                  />
                  <rect
                    x="65"
                    y="65"
                    width="70"
                    height="70"
                    rx="4"
                    fill="var(--color-accent)"
                    opacity="0.2"
                    stroke="var(--color-accent)"
                    strokeWidth="1.5"
                  />
                  <text
                    x="100"
                    y="105"
                    textAnchor="middle"
                    fill="var(--color-accent)"
                    fontSize="18"
                    fontWeight="700"
                    fontFamily="var(--font-display)"
                  >
                    CPU
                  </text>
                  {/* Pins top */}
                  {[60, 80, 100, 120, 140].map((x) => (
                    <line
                      key={`top-${x}`}
                      x1={x}
                      y1="30"
                      x2={x}
                      y2="50"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  ))}
                  {/* Pins bottom */}
                  {[60, 80, 100, 120, 140].map((x) => (
                    <line
                      key={`bot-${x}`}
                      x1={x}
                      y1="150"
                      x2={x}
                      y2="170"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  ))}
                  {/* Pins left */}
                  {[60, 80, 100, 120, 140].map((y) => (
                    <line
                      key={`left-${y}`}
                      x1="30"
                      y1={y}
                      x2="50"
                      y2={y}
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  ))}
                  {/* Pins right */}
                  {[60, 80, 100, 120, 140].map((y) => (
                    <line
                      key={`right-${y}`}
                      x1="150"
                      y1={y}
                      x2="170"
                      y2={y}
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  ))}
                  {/* Circuit traces */}
                  <path
                    d="M60 30 L60 20 M80 30 L80 15 M120 30 L120 20 M140 30 L140 15"
                    stroke="var(--color-accent)"
                    strokeWidth="1"
                    opacity="0.25"
                  />
                  {/* Corner dots */}
                  <circle cx="55" cy="55" r="3" fill="var(--color-accent)" opacity="0.3" />
                  <circle cx="145" cy="55" r="3" fill="var(--color-accent)" opacity="0.3" />
                  <circle cx="55" cy="145" r="3" fill="var(--color-accent)" opacity="0.3" />
                  <circle cx="145" cy="145" r="3" fill="var(--color-accent)" opacity="0.3" />
                </svg>
              </div>
              <div className={styles.cardLabel}>
                <span className={styles.cardTag}>Computing</span>
                <span className={styles.cardTitle}>How a CPU Works</span>
              </div>
            </a>
          </motion.div>

          {/* Card 2: Wi-Fi */}
          <motion.div
            className={`${styles.exhibitCard} ${styles.card2}`}
            initial={{ opacity: 0, rotate: 8, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 5, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.5,
            }}
            id="hero-card-wifi"
          >
            <a href="/explore/wifi" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div className={styles.cardVisual}>
                <svg viewBox="0 0 200 200" className={styles.wifiSvg}>
                  {/* Wi-Fi arcs */}
                  <g transform="translate(100, 130)">
                    <path
                      d="M-70,-50 Q-70,-90 0,-90 Q70,-90 70,-50"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                    <path
                      d="M-50,-35 Q-50,-65 0,-65 Q50,-65 50,-35"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                    <path
                      d="M-30,-20 Q-30,-40 0,-40 Q30,-40 30,-20"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <circle cx="0" cy="0" r="6" fill="var(--color-accent)" />
                  </g>
                  {/* Data particles */}
                  <circle cx="40" cy="60" r="2" fill="var(--color-accent)" opacity="0.4" />
                  <circle cx="160" cy="80" r="2" fill="var(--color-accent)" opacity="0.3" />
                  <circle cx="50" cy="100" r="1.5" fill="var(--color-accent)" opacity="0.5" />
                  <circle cx="150" cy="120" r="1.5" fill="var(--color-accent)" opacity="0.4" />
                </svg>
              </div>
              <div className={styles.cardLabel}>
                <span className={styles.cardTag}>Networking</span>
                <span className={styles.cardTitle}>Wi-Fi Signals</span>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

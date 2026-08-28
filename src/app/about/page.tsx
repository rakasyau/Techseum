"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
  MuseumHallIcon,
  CpuIcon,
  WifiIcon,
  CameraIcon,
  TouchscreenIcon,
  NeuralIcon,
  TrophyIcon,
} from "@/components/icons/CustomIcons";
import styles from "./About.module.css";

export default function AboutPage() {
  const { language } = useLanguage();

  const techCategories = [
    {
      icon: <CpuIcon size={24} color="#4F46E5" />,
      name: language === "id" ? "Komputasi" : "Computing",
      desc: language === "id"
        ? "CPU, GPU, RAM, SSD — arsitektur silikon yang menggerakkan dunia digital."
        : "CPU, GPU, RAM, SSD — silicon architectures powering the digital world.",
      color: "#4F46E5",
    },
    {
      icon: <WifiIcon size={24} color="#0EA5E9" />,
      name: language === "id" ? "Jaringan" : "Networking",
      desc: language === "id"
        ? "Wi-Fi, DNS, Bluetooth — bagaimana data melintasi gelombang elektromagnetik."
        : "Wi-Fi, DNS, Bluetooth — how data traverses electromagnetic waves.",
      color: "#0EA5E9",
    },
    {
      icon: <CameraIcon size={24} color="#10B981" />,
      name: language === "id" ? "Elektronik" : "Electronics",
      desc: language === "id"
        ? "Sensor kamera, baterai, sirkuit — fisika di balik perangkat keras."
        : "Camera sensors, batteries, circuits — the physics behind hardware.",
      color: "#10B981",
    },
    {
      icon: <TouchscreenIcon size={24} color="#0284C7" />,
      name: language === "id" ? "Teknologi Harian" : "Everyday Tech",
      desc: language === "id"
        ? "Layar sentuh, GPS, speaker — teknologi yang Anda gunakan setiap hari."
        : "Touchscreens, GPS, speakers — tech you interact with every day.",
      color: "#0284C7",
    },
    {
      icon: <NeuralIcon size={24} color="#A855F7" />,
      name: language === "id" ? "Teknologi Modern" : "Modern Tech",
      desc: language === "id"
        ? "Neural networks, blockchain, kuantum — teknologi masa depan hari ini."
        : "Neural networks, blockchain, quantum — tomorrow's tech today.",
      color: "#A855F7",
    },
  ];

  const stats = [
    {
      value: "21+",
      label: language === "id" ? "Topik Eksibit" : "Interactive Exhibits",
    },
    {
      value: "40+",
      label: language === "id" ? "Simulasi 2D & 3D" : "2D & 3D Simulations",
    },
    {
      value: "4",
      label: language === "id" ? "Tingkat Kedalaman" : "Depth Levels",
    },
    {
      value: "100%",
      label: language === "id" ? "Interaktif & Akses Bebas" : "Interactive & Open Access",
    },
  ];

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className="container">
            <span className={styles.kicker}>
              {language === "id" ? "Tentang Techseum" : "About Techseum"}
            </span>
            <h1 className={styles.title}>
              {language === "id"
                ? "Menjelaskan Sains & Teknologi untuk Semua Orang"
                : "Demystifying Technology for Everyone"}
            </h1>
            <p className={styles.subtitle}>
              {language === "id"
                ? "Kami percaya teknologi bukanlah sihir atau kotak hitam yang tak terpecahkan. Techseum adalah aula pameran digital interaktif yang dirancang untuk membuat silikon, algoritma, dan gelombang elektromagnetik menjadi nyata, visual, dan indah."
                : "We believe technology shouldn't feel like magic or an impenetrable black box. Techseum is an interactive, spatial exhibition hall dedicated to making silicon, algorithms, and electromagnetic waves tangible, visual, and beautiful."}
            </p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.icon}>
                  <TrophyIcon size={28} color="var(--color-accent)" />
                </div>
                <h3 className={styles.cardTitle}>
                  {language === "id" ? "Misi Kami" : "Our Mission"}
                </h3>
                <p className={styles.cardText}>
                  {language === "id"
                    ? "Menjembatani deskripsi tingkat tinggi yang terlalu dangkal dengan buku teks universitas yang rumit. Melalui metode bertingkat, penjelajah dari berbagai latar belakang dapat memilih kedalaman materi masing-masing."
                    : "Bridge the gap between superficial high-level descriptions and dense university textbooks. Through multi-level progressive disclosure, learners of all backgrounds can choose their own depth."}
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.icon}>
                  <CpuIcon size={28} color="var(--color-accent-indigo)" />
                </div>
                <h3 className={styles.cardTitle}>
                  {language === "id" ? "Simulasi Interaktif" : "Interactive First"}
                </h3>
                <p className={styles.cardText}>
                  {language === "id"
                    ? "Diagram statis membuat pembaca cepat bosan. Techseum memprioritaskan diagram mesin status 2D interaktif, eksplorasi spasial 3D WebGL, dan laboratorium fisika virtual langsung."
                    : "Static diagrams and long walls of text lead to passive skimming. Techseum prioritizes hands-on simulation state machines, 3D WebGL spatial exploration, and physics workbenches."}
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.icon}>
                  <MuseumHallIcon size={28} color="var(--color-accent-emerald)" />
                </div>
                <h3 className={styles.cardTitle}>
                  {language === "id" ? "4 Tingkat Pembelajaran" : "4-Tier Pedagogy"}
                </h3>
                <p className={styles.cardText}>
                  {language === "id"
                    ? "Setiap eksibit dikurasi dalam 4 tingkat: Sederhana (analogi sehari-hari), Pemula (mekanisme langkah demi langkah), Teknis (arsitektur & pipeline), dan Mendalam (fisika silikon & termodinamika)."
                    : "Every single technology exhibit is curated across 4 distinct levels: Simple (analogies), Beginner (step-by-step mechanisms), Technical (architecture & pipelines), and Deep Dive (silicon physics & thermodynamics)."}
                </p>
              </div>
            </div>

            {/* ── Stats Section ───────────────────────── */}
            <div className={styles.statsRow}>
              {stats.map((stat, i) => (
                <div key={i} className={styles.statItem}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* ── Technology Categories Showcase ──────── */}
            <div className={styles.showcaseBox}>
              <h2 className={styles.showcaseTitle}>
                {language === "id" ? "Teknologi yang Akan Kamu Jelajahi" : "Technology You'll Discover"}
              </h2>
              <p className={styles.showcaseSubtitle}>
                {language === "id"
                  ? "Dari arsitektur silikon mikroskopis hingga jaringan nirkabel global — setiap kategori dirancang untuk membuat yang tak terlihat menjadi terlihat."
                  : "From microscopic silicon architectures to global wireless networks — each category is designed to make the invisible visible."}
              </p>

              <div className={styles.categoryGrid}>
                {techCategories.map((cat, i) => (
                  <div key={i} className={styles.categoryCard}>
                    <div
                      className={styles.categoryIcon}
                      style={{ backgroundColor: `${cat.color}12` }}
                    >
                      {cat.icon}
                    </div>
                    <div className={styles.categoryInfo}>
                      <h4 className={styles.categoryName}>{cat.name}</h4>
                      <p className={styles.categoryDesc}>{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.ctaRow}>
                <Link href="/explore" className="btn btn-primary">
                  {language === "id" ? "Mulai Eksplorasi Eksibit →" : "Start Exploring Exhibits →"}
                </Link>
                <Link href="/lab" className="btn btn-outline">
                  {language === "id" ? "Buka Laboratorium Virtual" : "Open Interactive Labs"}
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

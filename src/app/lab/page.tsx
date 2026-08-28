"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ElectronicsLab from "@/components/lab/ElectronicsLab";
import CameraLab from "@/components/lab/CameraLab";
import NetworkLab from "@/components/lab/NetworkLab";
import { useUserProgress } from "@/context/UserProgressContext";
import { useLanguage } from "@/context/LanguageContext";
import { CpuIcon, CameraIcon, WifiIcon, MuseumHallIcon } from "@/components/icons/CustomIcons";
import styles from "./LabPage.module.css";

export default function LabPage() {
  const [activeTab, setActiveTab] = useState<string>("electronics");
  const { isAuthenticated, isLoading } = useUserProgress();
  const { t } = useLanguage();

  const labTabs = [
    { id: "electronics", name: t.lab.electronics, subtitle: "Ohm's Law & Circuit Load", icon: <CpuIcon size={20} /> },
    { id: "camera", name: t.lab.camera, subtitle: "Aperture, ISO & Bokeh", icon: <CameraIcon size={20} /> },
    { id: "network", name: t.lab.network, subtitle: "Hop Latency & Routing", icon: <WifiIcon size={20} /> },
  ];

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
              <h1 className={styles.title}>{t.lab.title}</h1>
              <p className={styles.subtitle} style={{ margin: "1rem auto 2rem", maxWidth: "50ch" }}>
                {t.topicDetail.mustLoginSubtitle}
              </p>
              <Link href="/auth/login?redirect=/lab" className="btn btn-primary">
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
            <span className={styles.kicker}>{t.lab.kicker}</span>
            <h1 className={styles.title}>{t.lab.title}</h1>
            <p className={styles.subtitle}>{t.lab.subtitle}</p>

            {/* Lab Switcher Tabs */}
            <div className={styles.tabsRow}>
              {labTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  id={`lab-tab-${tab.id}`}
                >
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  <div className={styles.tabInfo}>
                    <span className={styles.tabName}>{tab.name}</span>
                    <span className={styles.tabSub}>{tab.subtitle}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Active Lab Workbench ─────────────────── */}
        <section className={styles.workbenchSection}>
          <div className="container">
            {activeTab === "electronics" && <ElectronicsLab />}
            {activeTab === "camera" && <CameraLab />}
            {activeTab === "network" && <NetworkLab />}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

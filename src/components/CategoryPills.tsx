"use client";

import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  CpuIcon,
  WifiIcon,
  CameraIcon,
  TouchscreenIcon,
  NeuralIcon,
} from "@/components/icons/CustomIcons";
import styles from "./CategoryPills.module.css";

export default function CategoryPills() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const categories = [
    { name: t.categories.computing, icon: <CpuIcon size={16} />, slug: "computing" },
    { name: t.categories.networking, icon: <WifiIcon size={16} />, slug: "networking" },
    { name: t.categories.electronics, icon: <CameraIcon size={16} />, slug: "electronics" },
    { name: t.categories.everyday, icon: <TouchscreenIcon size={16} />, slug: "everyday" },
    { name: t.categories.modern, icon: <NeuralIcon size={16} />, slug: "modern" },
  ];

  return (
    <section className={styles.section} id="category-pills">
      <div className={styles.container}>
        <div className={styles.scroll} ref={scrollRef}>
          {categories.map((cat, i) => (
            <a
              key={cat.slug}
              href="/explore"
              className={`${styles.pill} ${i === 0 ? styles.active : ""}`}
              id={`pill-${cat.slug}`}
              style={{ textDecoration: "none" }}
            >
              <span className={styles.pillIcon}>{cat.icon}</span>
              <span className={styles.pillName}>{cat.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

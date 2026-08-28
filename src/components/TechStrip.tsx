import styles from "./TechStrip.module.css";

const TECH_ITEMS = [
  { name: "Next.js", icon: "⚡" },
  { name: "Three.js", icon: "🔮" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Framer Motion", icon: "✦" },
  { name: "TypeScript", icon: "⌂" },
  { name: "React", icon: "⚛" },
];

export default function TechStrip() {
  const items = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <section className={styles.strip} id="tech-strip">
      <div className={styles.label}>Built with</div>
      <div className={styles.marqueeWrap}>
        <div className={styles.marquee}>
          {items.map((tech, i) => (
            <div key={`${tech.name}-${i}`} className={styles.item}>
              <span className={styles.icon}>{tech.icon}</span>
              <span className={styles.name}>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

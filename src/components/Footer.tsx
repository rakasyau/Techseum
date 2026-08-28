"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus("error");
      setFeedbackMsg(t.footer.newsletterInvalid);
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setFeedbackMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFeedbackMsg(data.isExisting ? t.footer.newsletterAlready : t.footer.newsletterSuccess);
        setEmail("");
      } else {
        setStatus("error");
        setFeedbackMsg(data.error || t.footer.newsletterError);
      }
    } catch {
      setStatus("error");
      setFeedbackMsg(t.footer.newsletterError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerLinks = {
    Platform: [
      { label: t.nav.explore, href: "/explore" },
      { label: t.nav.lab, href: "/lab" },
      { label: t.nav.challenges, href: "/challenges" },
      { label: t.nav.leaderboard, href: "/leaderboard" },
    ],
    Categories: [
      { label: `${t.categories.computing} (CPU / GPU)`, href: "/explore?cat=computing" },
      { label: `${t.categories.networking} (Wi-Fi / DNS)`, href: "/explore?cat=networking" },
      { label: `${t.categories.electronics} (Camera / Battery)`, href: "/explore?cat=electronics" },
      { label: `${t.categories.everyday} (Touchscreen)`, href: "/explore?cat=everyday" },
      { label: `${t.categories.modern} (Neural AI)`, href: "/explore?cat=modern" },
    ],
    Resources: [
      { label: t.nav.howItWorks, href: "/scenarios/what-happens-when-google" },
      { label: t.nav.about, href: "/about" },
      { label: "Ohm's Law Simulator", href: "/lab" },
      { label: "Camera Optics Simulator", href: "/lab" },
    ],
  };

  return (
    <footer className={styles.footer} id="site-footer">
      <div className={`container ${styles.inner}`}>
        {/* ── Newsletter ───────────────────────────── */}
        <div className={styles.newsletter}>
          <div className={styles.nlContent}>
            <h3 className={styles.nlTitle}>{t.footer.newsletterTitle}</h3>
            <p className={styles.nlDesc}>{t.footer.newsletterDesc}</p>
          </div>
          <div className={styles.nlFormWrapper}>
            <form
              className={styles.nlForm}
              onSubmit={handleNewsletterSubmit}
              id="newsletter-form"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={styles.nlInput}
                id="newsletter-email"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.nlBtn}
                id="newsletter-submit"
              >
                {isSubmitting ? t.footer.subscribing : t.footer.subscribe}
              </button>
            </form>

            {status !== "idle" && (
              <div
                className={`${styles.nlFeedback} ${
                  status === "success" ? styles.nlSuccess : styles.nlError
                }`}
                role="status"
                id="newsletter-feedback"
              >
                {feedbackMsg}
              </div>
            )}
          </div>
        </div>

        {/* ── Links ────────────────────────────────── */}
        <div className={styles.links}>
          <div className={styles.brand}>
            <a href="/" className={styles.logo}>
              <span className={styles.logoMark}>◉</span>
              <span className={styles.logoText}>Techseum</span>
            </a>
            <p className={styles.brandDesc}>{t.footer.brandDesc}</p>
            <div className={styles.socials}>
              {["twitter", "github", "discord"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className={styles.socialLink}
                  aria-label={social}
                  id={`social-${social}`}
                >
                  {social === "twitter" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {social === "github" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                  {social === "discord" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className={styles.linkCol}>
              <h4 className={styles.linkColTitle}>{section}</h4>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={styles.linkItem}
                      id={`footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom ───────────────────────────────── */}
        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Techseum. {t.footer.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
}

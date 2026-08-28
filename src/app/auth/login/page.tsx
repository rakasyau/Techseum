"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUserProgress } from "@/context/UserProgressContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "../Auth.module.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/explore";
  const { login } = useUserProgress();
  const { language } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.user);
      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message);
    } finally {
      setLoading(false);
    }
  };

  const isId = language === "id";

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <Link href="/" className={styles.logoBadge}>
          <span className={styles.logoDot}>◉</span> Techseum
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>
            {isId ? "Masuk ke Museum Pass" : "Sign In to Museum Pass"}
          </h1>
          <p className={styles.subtitle}>
            {isId
              ? "Akses seluruh simulasi 2D/3D interaktif, simpan kemajuan belajar, dan kumpulkan lencana XP."
              : "Access all interactive 2D/3D simulations, save your learning progress, and earn XP badges."}
          </p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              {isId ? "Alamat Email" : "Email Address"}
            </label>
            <input
              id="email"
              type="email"
              required
              className={styles.input}
              placeholder="explorer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              {isId ? "Kata Sandi" : "Password"}
            </label>
            <input
              id="password"
              type="password"
              required
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary ${styles.submitBtn}`}
          >
            {loading
              ? isId ? "Memproses..." : "Signing in..."
              : isId ? "Masuk & Lanjutkan" : "Sign In & Continue"}
          </button>
        </form>

        <div className={styles.footer}>
          <span>{isId ? "Belum memiliki tiket?" : "Don't have a pass?"}</span>
          <Link href={`/auth/register?redirect=${encodeURIComponent(redirectUrl)}`} className={styles.link}>
            {isId ? "Daftar Gratis" : "Create Account"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

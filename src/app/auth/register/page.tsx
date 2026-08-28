"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUserProgress } from "@/context/UserProgressContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "../Auth.module.css";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/explore";
  const { login } = useUserProgress();
  const { language } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
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
            {isId ? "Daftar Akun Museum Pass" : "Claim Your Museum Pass"}
          </h1>
          <p className={styles.subtitle}>
            {isId
              ? "Dapatkan +25 XP bonus awal, lencana First Explorer, dan buka seluruh akses eksibit 2D/3D interaktif."
              : "Get +25 starter XP, the First Explorer badge, and unlock full access to all 2D/3D interactive exhibits."}
          </p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              {isId ? "Nama Lengkap" : "Full Name"}
            </label>
            <input
              id="name"
              type="text"
              required
              className={styles.input}
              placeholder="e.g. Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              {isId ? "Kata Sandi (Min. 6 Karakter)" : "Password (Min. 6 chars)"}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
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
              ? isId ? "Membuat Akun..." : "Creating Pass..."
              : isId ? "Daftar & Klaim +25 XP" : "Register & Claim +25 XP"}
          </button>
        </form>

        <div className={styles.footer}>
          <span>{isId ? "Sudah memiliki akun?" : "Already have a pass?"}</span>
          <Link href={`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`} className={styles.link}>
            {isId ? "Masuk di Sini" : "Sign In"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

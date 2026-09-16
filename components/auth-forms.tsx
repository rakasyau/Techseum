"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

/*
 * Where to send the user after a successful sign-in. The middleware appends
 * ?next= when it redirects a gated page, so signing in returns them to where
 * they were headed rather than always to the profile.
 */
function useNextPath(): string {
  const params = useSearchParams();
  const next = params.get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/profile/you";
  }
  return next;
}

export function LoginForm() {
  const { signIn } = useAuth();
  const nextPath = useNextPath();
  const { t } = useLanguage();
  const router = useRouter();
  const reduce = useReducedMotion();

  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(identifier, password);
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title={t.auth.signInTitle}
      lead={t.auth.signInLead}
      footer={
        <>
          {t.auth.noAccount}{" "}
          <Link
            href="/register"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            {t.auth.registerAction}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          id="identifier"
          label={t.auth.identifier}
          hint={t.auth.identifierHint}
          icon={<Mail size={15} />}
          value={identifier}
          onChange={setIdentifier}
          autoComplete="username"
          required
        />
        <Field
          id="password"
          label={t.auth.password}
          icon={<Lock size={15} />}
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="current-password"
          required
        />

        <AnimateMessage message={error} reduce={!!reduce} />

        <Button
          type="submit"
          disabled={busy}
          size="lg"
          className="w-full"
        >
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t.auth.signingIn}
            </>
          ) : (
            <>
              {t.auth.signInAction}
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}

export function RegisterForm() {
  const { register } = useAuth();
  const nextPath = useNextPath();
  const { t } = useLanguage();
  const router = useRouter();
  const reduce = useReducedMotion();

  const [form, setForm] = React.useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register(form);
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title={t.auth.registerTitle}
      lead={t.auth.registerLead}
      footer={
        <>
          {t.auth.haveAccount}{" "}
          <Link
            href="/login"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            {t.auth.signInAction}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          id="displayName"
          label={t.auth.displayName}
          value={form.displayName}
          onChange={set("displayName")}
          autoComplete="name"
          required
        />
        <Field
          id="username"
          label={t.auth.username}
          value={form.username}
          onChange={set("username")}
          autoComplete="username"
          required
        />
        <Field
          id="email"
          label={t.auth.email}
          icon={<Mail size={15} />}
          value={form.email}
          onChange={set("email")}
          type="email"
          autoComplete="email"
          required
        />
        <Field
          id="password"
          label={t.auth.password}
          hint={t.auth.passwordHint}
          icon={<Lock size={15} />}
          value={form.password}
          onChange={set("password")}
          type="password"
          autoComplete="new-password"
          required
        />

        <AnimateMessage message={error} reduce={!!reduce} />

        <Button type="submit" disabled={busy} size="lg" className="w-full">
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t.auth.registering}
            </>
          ) : (
            <>
              {t.auth.registerAction}
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}

function AuthShell({
  title,
  lead,
  children,
  footer,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 15%, rgb(var(--accent-soft)), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1320px] items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8">
        <div className="hidden lg:block">
          <Logo />
          <h2 className="mt-8 max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.2rem)] font-bold leading-[1.04] tracking-[-0.04em]">
            {title}
          </h2>
          <p className="mt-5 max-w-[44ch] text-[15px] leading-relaxed text-ink-muted">
            {lead}
          </p>
        </div>

        <div className="mx-auto w-full max-w-[440px]">
          <div className="rounded-3xl border border-line bg-paper p-6 shadow-card sm:p-8">
            <div className="lg:hidden">
              <Logo />
            </div>
            <h1 className="mt-6 font-display text-[clamp(1.5rem,3.4vw,2rem)] font-bold tracking-[-0.035em] lg:mt-0">
              {title}
            </h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted lg:hidden">
              {lead}
            </p>
            <div className="mt-7">{children}</div>
            <p className="mt-6 border-t border-line pt-5 text-center text-[13px] text-ink-muted">
              {footer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  icon,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between text-[13px] font-medium text-ink-soft"
      >
        {label}
        {hint ? (
          <span className="text-2xs font-normal text-ink-muted">{hint}</span>
        ) : null}
      </label>
      <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-line bg-paper-alt px-3.5 py-3 transition-colors focus-within:border-ink">
        {icon ? <span className="shrink-0 text-ink-muted">{icon}</span> : null}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-ink-faint"
        />
      </div>
    </div>
  );
}

function AnimateMessage({
  message,
  reduce,
}: {
  message: string | null;
  reduce: boolean;
}) {
  if (!message) return null;
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-3 text-[13px] leading-relaxed text-danger"
    >
      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden />
      {message}
    </motion.p>
  );
}

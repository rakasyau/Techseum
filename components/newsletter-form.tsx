"use client";

import * as React from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

/*
 * Newsletter signup.
 *
 * Posts to /api/newsletter, which stores the address and syncs it to the
 * email provider. The server reports provider state separately, so a provider
 * outage still confirms the subscription rather than showing a false failure.
 */
export function NewsletterForm({ inputId }: { inputId?: string }) {
  const { t, locale } = useLanguage();
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "busy") return;

    setError(null);
    setState("busy");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale }),
      });

      if (!response.ok) {
        let message = t.errors.generic;
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          /* keep the default */
        }
        setError(message);
        setState("idle");
        return;
      }

      setState("done");
    } catch {
      setError(t.errors.network);
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-center gap-2.5 rounded-full border border-success/25 bg-success-soft px-4 py-3">
        <Check size={15} className="shrink-0 text-success" aria-hidden />
        <p className="text-[13px] leading-snug text-ink-soft">
          {t.footer.subscribedLead}
        </p>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 rounded-full border border-line bg-paper-alt p-1 pl-4 transition-colors focus-within:border-ink"
      >
        <input
          id={inputId}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.footer.emailPlaceholder}
          aria-label={t.footer.emailLabel}
          disabled={state === "busy"}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-faint disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === "busy" || !email.trim()}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {state === "busy" ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {t.footer.subscribing}
            </>
          ) : (
            t.footer.subscribe
          )}
        </button>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-2.5 flex items-start gap-2 text-[12px] leading-relaxed text-danger"
        >
          <AlertCircle size={13} className="mt-0.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = { en: "EN", id: "ID" };

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.nav.language}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-[12px] font-semibold tracking-wide text-ink-soft transition-colors hover:border-ink hover:text-ink"
      >
        <Languages size={15} />
        {LABELS[locale]}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[150px] overflow-hidden rounded-xl border border-line bg-paper p-1 shadow-pop"
        >
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={locale === code}
              onClick={() => {
                setLocale(code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors",
                locale === code
                  ? "bg-paper-alt font-medium text-ink"
                  : "text-ink-muted hover:bg-paper-alt hover:text-ink"
              )}
            >
              {code === "en" ? "English" : "Bahasa Indonesia"}
              <span className="font-mono text-[10px] uppercase text-ink-faint">
                {LABELS[code]}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

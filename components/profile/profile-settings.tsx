"use client";

import * as React from "react";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/components/auth-provider";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const LEVELS = [1, 2, 3, 4];

export function SettingsTab() {
  const { t, locale, setLocale } = useLanguage();
  const { user, updatePreferences } = useAuth();

  const [defaultLevel, setDefaultLevel] = React.useState(
    user?.preferences.defaultLevel ?? 2
  );
  const [reducedMotion, setReducedMotion] = React.useState(
    user?.preferences.reducedMotion ?? false
  );

  return (
    <div className="max-w-[720px]">
      <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
        {t.profile.preferences}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {t.profile.defaultLevelLead}
      </p>

      <div className="mt-6 space-y-4">
        <SettingRow
          title={t.profile.defaultLevel}
          description={t.profile.defaultLevelLead}
        >
          <Segmented
            options={LEVELS.map((l) => t.common.level + " " + l)}
            index={LEVELS.indexOf(defaultLevel)}
            onSelect={(i) => {
              setDefaultLevel(LEVELS[i]);
              void updatePreferences({ defaultLevel: LEVELS[i] });
            }}
            label={t.profile.defaultLevel}
          />
        </SettingRow>

        <SettingRow title={t.nav.language} description={t.profile.languageLead}>
          <Segmented
            options={LOCALES.map((code) =>
              code === "en" ? "English" : "Bahasa Indonesia"
            )}
            index={LOCALES.indexOf(locale)}
            onSelect={(i) => setLocale(LOCALES[i] as Locale)}
            label={t.nav.language}
          />
        </SettingRow>

        <SettingRow
          title={t.profile.reducedMotion}
          description={t.profile.reducedMotionLead}
        >
          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            aria-label={t.profile.reducedMotion}
            onClick={() => {
              const next = !reducedMotion;
              setReducedMotion(next);
              void updatePreferences({ reducedMotion: next });
            }}
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full border transition-colors",
              reducedMotion
                ? "border-accent bg-accent"
                : "border-line-strong bg-paper-sink"
            )}
          >
            <span
              className={cn(
                "absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-card transition-all duration-200",
                reducedMotion ? "left-[25px]" : "left-[3px]"
              )}
            />
          </button>
        </SettingRow>
      </div>
    </div>
  );
}

function Segmented({
  options,
  index,
  onSelect,
  label,
}: {
  options: string[];
  index: number;
  onSelect: (index: number) => void;
  label: string;
}) {
  return (
    <div
      className="inline-flex flex-wrap rounded-full border border-line bg-paper-alt p-0.5"
      role="group"
      aria-label={label}
    >
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(i)}
          aria-pressed={index === i}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
            index === i ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-[46ch]">
        <p className="text-[14px] font-medium">{title}</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

"use client";

import * as React from "react";
import { Aperture, Gauge, Info, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

/* Camera bench. The preview is a drawn scene, not a photograph, so the
   exposure model is honest: aperture changes depth of field, shutter changes
   motion blur, and ISO changes visible grain. Exposure value is computed from
   the three settings so the readout is real. */

const APERTURES = [1.8, 2.8, 4, 5.6, 8, 11, 16];
const SHUTTERS = [
  { label: "1/1000", seconds: 1 / 1000 },
  { label: "1/500", seconds: 1 / 500 },
  { label: "1/250", seconds: 1 / 250 },
  { label: "1/125", seconds: 1 / 125 },
  { label: "1/60", seconds: 1 / 60 },
  { label: "1/30", seconds: 1 / 30 },
  { label: "1/15", seconds: 1 / 15 },
];
const ISOS = [100, 200, 400, 800, 1600, 3200];

export function CameraBench() {
  const { t } = useLanguage();
  const [f, setF] = React.useState(4);
  const [shutter, setShutter] = React.useState(3);
  const [iso, setIso] = React.useState(1);

  const shutterValue = SHUTTERS[shutter];
  const isoValue = ISOS[iso];

  /* Exposure value at ISO 100: EV = log2(N^2 / t) */
  const ev = Math.log2((f * f) / shutterValue.seconds);
  const targetEv = 10; // a bright indoor scene
  const isoCompensation = Math.log2(isoValue / 100);
  const exposureDelta = ev - isoCompensation - targetEv;

  const subjectBrightness = Math.min(1.05, Math.max(0.15, 1 + exposureDelta * 0.16));
  const grain = Math.min(1, Math.log2(isoValue / 100) / 5);
  const motionBlur = Math.min(
    1,
    Math.max(0, (shutterValue.seconds - 1 / 125) * 26)
  );
  const depthBlur = Math.min(1, Math.max(0, (2.8 - f) / 2.4));
  const clipping = subjectBrightness >= 1;

  const verdict = clipping
    ? { tone: "danger", title: t.lab.overexposed, body: t.lab.overexposedLead }
    : subjectBrightness < 0.45
      ? { tone: "warn", title: t.lab.underexposed, body: t.lab.underexposedLead }
      : { tone: "success", title: t.lab.wellExposed, body: t.lab.wellExposedLead };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-10">
      <div className="overflow-hidden rounded-2xl border border-line bg-paper-alt">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {/* the scene, drawn and then transformed by the settings */}
          <svg
            viewBox="0 0 640 480"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={"Simulated scene at f/" + f + ", " + shutterValue.label + " second, ISO " + isoValue}
          >
            <rect width="640" height="480" fill="rgb(var(--paper-alt))" />
            <g opacity={0.4 + subjectBrightness * 0.6}>
              {/* sky band */}
              <rect width="640" height="250" fill="rgb(var(--accent-soft))" />
              {/* background hills, blurred by aperture */}
              <g
                filter={
                  depthBlur > 0.05
                    ? "url(#dof-soft)"
                    : undefined
                }
                opacity="0.75"
              >
                <path
                  d="M0 250 Q160 150 320 240 T640 200 V250 Z"
                  fill="rgb(var(--ink-ghost))"
                />
                <circle cx="120" cy="90" r="34" fill="rgb(var(--warn) / 0.5)" />
              </g>
              {/* ground */}
              <rect y="250" width="640" height="230" fill="rgb(var(--paper-sink))" />
            </g>

            {/* the subject: a lamp post, in focus */}
            <g
              filter={motionBlur > 0.04 ? "url(#motion)" : undefined}
              opacity={0.35 + subjectBrightness * 0.65}
            >
              <rect x="300" y="150" width="14" height="270" rx="4" fill="rgb(var(--ink))" />
              <circle cx="307" cy="140" r="30" fill="rgb(var(--warn))" opacity={clipping ? 1 : 0.9} />
              <rect x="250" y="238" width="120" height="12" rx="4" fill="rgb(var(--ink))" />
            </g>

            {/* a moving element, blurred by shutter */}
            <g
              filter={motionBlur > 0.04 ? "url(#motion)" : undefined}
              opacity={0.5 + subjectBrightness * 0.4}
            >
              <circle cx="470" cy="300" r="16" fill="rgb(var(--accent))" />
            </g>

            <defs>
              <filter id="motion">
                <feGaussianBlur stdDeviation={motionBlur * 7} />
              </filter>
              <filter id="dof-soft">
                <feGaussianBlur stdDeviation={0.5 + depthBlur * 4} />
              </filter>
            </defs>

            {/* grain overlay, drawn as noise dots */}
            {grain > 0.05 ? (
              <g opacity={grain * 0.5}>
                {Array.from({ length: 90 }).map((_, i) => {
                  const x = (i * 71) % 640;
                  const y = (i * 137) % 480;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={1.1}
                      fill={i % 2 ? "rgb(var(--ink))" : "rgb(var(--paper))"}
                    />
                  );
                })}
              </g>
            ) : null}

            {/* exposure clip warning */}
            {clipping ? (
              <g>
                <rect x="0" y="0" width="640" height="480" fill="rgb(var(--danger) / 0.06)" />
                <g opacity="0.55">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <line
                      key={i}
                      x1={i * 48}
                      y1="440"
                      x2={i * 48 + 24}
                      y2="470"
                      stroke="rgb(var(--danger))"
                      strokeWidth="3"
                    />
                  ))}
                </g>
              </g>
            ) : null}
          </svg>

          {/* overlays */}
          <div className="pointer-events-none absolute inset-0 p-3">
            <div className="flex justify-between font-mono text-[10px] text-ink-soft">
              <span className="rounded border border-line bg-paper/85 px-2 py-1 backdrop-blur-sm">
                f/{f}
              </span>
              <span className="rounded border border-line bg-paper/85 px-2 py-1 backdrop-blur-sm">
                {shutterValue.label} s
              </span>
              <span className="rounded border border-line bg-paper/85 px-2 py-1 backdrop-blur-sm">
                ISO {isoValue}
              </span>
            </div>
            {/* focus frame */}
            <div className="absolute left-1/2 top-[42%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded border border-paper/70">
              <span className="absolute -left-1 -top-1 h-2 w-2 border-l-2 border-t-2 border-paper" />
              <span className="absolute -right-1 -top-1 h-2 w-2 border-r-2 border-t-2 border-paper" />
              <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-paper" />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-paper" />
            </div>
          </div>
        </div>

        {/* histogram */}
        <div className="border-t border-line px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-2xs font-medium uppercase tracking-[0.1em] text-ink-muted">
              {t.lab.histogram}
            </span>
            <div className="flex h-10 flex-1 items-end gap-[2px]">
              {buildHistogram(subjectBrightness, clipping).map((v, i) => (
                <span
                  key={i}
                  className={cn(
                    "flex-1 rounded-sm transition-all duration-500",
                    i < 6 ? "bg-ink-soft/40" : i > 26 ? "bg-danger/70" : "bg-accent"
                  )}
                  style={{ height: Math.max(4, v * 100) + "%" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-line bg-paper p-5">
          <Control
            icon={<Aperture size={14} />}
            label={t.lab.aperture}
            value={"f/" + f}
            values={APERTURES.map((a) => "f/" + a)}
            index={APERTURES.indexOf(f)}
            onChange={(i) => setF(APERTURES[i])}
            note={depthBlur > 0.5 ? t.lab.shallowFocus : depthBlur > 0.2 ? t.lab.moderateFocus : t.lab.deepFocus}
          />
          <Control
            icon={<Timer size={14} />}
            label={t.lab.shutterSpeed}
            value={shutterValue.label + " s"}
            values={SHUTTERS.map((s) => s.label)}
            index={shutter}
            onChange={setShutter}
            note={motionBlur > 0.4 ? t.lab.streaking : motionBlur > 0.1 ? t.lab.slightBlur : t.lab.motionFrozen}
          />
          <Control
            icon={<Gauge size={14} />}
            label={t.lab.iso}
            value={String(isoValue)}
            values={ISOS.map(String)}
            index={iso}
            onChange={setIso}
            note={grain > 0.6 ? t.lab.visibleNoise : grain > 0.3 ? t.lab.someGrain : t.lab.cleanSignal}
          />
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {[
            { label: t.lab.exposureValue, value: ev.toFixed(1) },
            { label: t.lab.brightness, value: Math.round(subjectBrightness * 100) + "%" },
            { label: t.lab.motionBlur, value: Math.round(motionBlur * 100) + "%" },
            { label: t.lab.noise, value: Math.round(grain * 100) + "%" },
          ].map((s) => (
            <div key={s.label} className="bg-paper p-4">
              <p className="text-2xs text-ink-muted">{s.label}</p>
              <p className="mt-1 font-display text-lg font-bold tracking-[-0.03em] tnum">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "flex gap-3 rounded-2xl border p-4",
            verdict.tone === "danger"
              ? "border-danger/30 bg-danger-soft"
              : verdict.tone === "warn"
                ? "border-warn/30 bg-warn-soft"
                : "border-success/25 bg-success-soft"
          )}
        >
          <Info
            size={16}
            className={cn(
              "mt-0.5 shrink-0",
              verdict.tone === "danger"
                ? "text-danger"
                : verdict.tone === "warn"
                  ? "text-warn"
                  : "text-success"
            )}
            aria-hidden
          />
          <div>
            <p className="text-[13px] font-semibold">{verdict.title}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
              {verdict.body}
            </p>
          </div>
        </div>

        <p className="rounded-2xl border border-line bg-paper-alt p-4 font-mono text-[11.5px] leading-relaxed text-ink-muted">
          EV = log2(N^2 / t) = log2({f}^2 / {shutterValue.seconds.toFixed(4)}) ={" "}
          {ev.toFixed(1)}
          <br />
          ISO compensation drags the effective exposure by{" "}
          {isoCompensation.toFixed(1)} stops.
        </p>
      </div>
    </div>
  );
}

function Control({
  icon,
  label,
  value,
  values,
  index,
  onChange,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  values: string[];
  index: number;
  onChange: (i: number) => void;
  note: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft">
          <span className="text-ink-faint">{icon}</span>
          {label}
        </span>
        <span className="tnum font-mono text-[12px] text-ink">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={values.length - 1}
        step={1}
        value={index}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-paper-sink accent-accent"
      />
      <div className="mt-2 flex justify-between font-mono text-[9px] text-ink-faint">
        <span>{values[0]}</span>
        <span className="text-ink-muted">{note}</span>
        <span>{values[values.length - 1]}</span>
      </div>
    </div>
  );
}

function buildHistogram(brightness: number, clipping: boolean): number[] {
  const bins = 32;
  const centre = Math.min(0.97, Math.max(0.06, brightness));
  return Array.from({ length: bins }, (_, i) => {
    const x = i / (bins - 1);
    const main = Math.exp(-Math.pow((x - centre) / 0.2, 2));
    const shadow = 0.25 * Math.exp(-Math.pow((x - 0.08) / 0.1, 2));
    let v = main + shadow;
    if (clipping && i > bins - 6) v += 0.85 * ((i - (bins - 6)) / 5);
    return Math.min(1, v);
  });
}

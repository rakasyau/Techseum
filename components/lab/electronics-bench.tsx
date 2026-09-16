"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

/* Electronics bench. A real Ohm's-law calculation drives a drawn circuit, so
   the LED brightness is derived from the numbers rather than faked. */

function Slider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  format = (v: number) => `${v}`,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[12.5px] font-medium text-ink-soft">
          {label}
        </label>
        <span className="tnum font-mono text-[12px] text-ink">
          {format(value)}
          <span className="ml-0.5 text-ink-muted">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-paper-sink accent-accent"
      />
    </div>
  );
}

export function ElectronicsBench() {
  const { t } = useLanguage();
  const [voltage, setVoltage] = React.useState(5);
  const [resistance, setResistance] = React.useState(220);

  /* Ohm's law plus the standard LED forward-drop approximation. */
  const forwardDrop = 2.0;
  const currentMa = Math.max(0, ((voltage - forwardDrop) / resistance) * 1000);
  const powerMw = currentMa * forwardDrop;
  const resistorPowerMw = ((voltage - forwardDrop) ** 2 / resistance) * 1000;

  const brightness = Math.min(1, currentMa / 20);
  const overdriven = currentMa > 25;
  const extinguished = currentMa < 0.6;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-10">
      <div className="overflow-hidden rounded-2xl border border-line bg-paper-alt">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgb(var(--line)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          <div className="no-scrollbar relative overflow-x-auto">
          <svg viewBox="0 0 640 320" className="relative block w-full min-w-[560px]" role="img" aria-label="Battery, resistor and LED circuit with the current flow visualized">
            {/* wires */}
            <g
              fill="none"
              stroke="rgb(var(--ink))"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M120 80 H520 V150" />
              <path d="M120 240 H520 V190" />
              <path d="M120 80 V160 M120 186 V240" />
            </g>

            {/* battery */}
            <g>
              <rect
                x="86"
                y="148"
                width="68"
                height="50"
                rx="8"
                fill="rgb(var(--paper))"
                stroke="rgb(var(--ink))"
                strokeWidth="1.8"
              />
              <text
                x="120"
                y="178"
                textAnchor="middle"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fill="rgb(var(--ink))"
              >
                {voltage.toFixed(1)}V
              </text>
              <text
                x="120"
                y="128"
                textAnchor="middle"
                fontSize="10"
                fill="rgb(var(--ink-muted))"
              >
                source
              </text>
            </g>

            {/* resistor */}
            <g>
              <rect
                x="286"
                y="62"
                width="96"
                height="36"
                rx="6"
                fill="rgb(var(--paper))"
                stroke="rgb(var(--ink))"
                strokeWidth="1.8"
              />
              <path
                d="M296 80 h8 l6 -10 8 20 8 -20 8 20 8 -20 8 20 6 -10 h8"
                fill="none"
                stroke="rgb(var(--ink))"
                strokeWidth="1.4"
              />
              <text
                x="334"
                y="48"
                textAnchor="middle"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fill="rgb(var(--ink-muted))"
              >
                {resistance >= 1000
                  ? `${(resistance / 1000).toFixed(1)}k`
                  : resistance}
                ohm
              </text>
            </g>

            {/* LED */}
            <g>
              <circle
                cx="520"
                cy="170"
                r="30"
                fill={
                  extinguished
                    ? "rgb(var(--paper))"
                    : `rgb(var(--warn) / ${0.15 + brightness * 0.7})`
                }
                stroke="rgb(var(--ink))"
                strokeWidth="1.8"
              />
              <path
                d="M508 158 L532 170 L508 182 Z"
                fill={extinguished ? "rgb(var(--ink-ghost))" : "rgb(var(--warn))"}
              />
              <line
                x1="508"
                y1="146"
                x2="508"
                y2="194"
                stroke="rgb(var(--ink))"
                strokeWidth="1.8"
              />
              {!extinguished ? (
                <g opacity={0.2 + brightness * 0.55}>
                  <line x1="552" y1="150" x2="574" y2="136" stroke="rgb(var(--warn))" strokeWidth="2" strokeLinecap="round" />
                  <line x1="558" y1="170" x2="586" y2="170" stroke="rgb(var(--warn))" strokeWidth="2" strokeLinecap="round" />
                  <line x1="552" y1="190" x2="574" y2="204" stroke="rgb(var(--warn))" strokeWidth="2" strokeLinecap="round" />
                </g>
              ) : null}
              <text
                x="520"
                y="228"
                textAnchor="middle"
                fontSize="10"
                fill="rgb(var(--ink-muted))"
              >
                LED {"\u00b7"} Vf 2.0V
              </text>
            </g>

            {/* current flow */}
            {!extinguished ? (
              <g>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <circle
                    key={i}
                    r="3.4"
                    fill={overdriven ? "rgb(var(--danger))" : "rgb(var(--accent))"}
                  >
                    <animateMotion
                      dur={`${Math.max(0.7, 4 / (1 + currentMa / 3))}s`}
                      repeatCount="indefinite"
                      begin={`${i * 0.28}s`}
                      path="M120 80 H520 V150 M120 240 H520 V190"
                    />
                  </circle>
                ))}
              </g>
            ) : null}

            {/* measurement ticks */}
            <g stroke="rgb(var(--ink-faint))" strokeWidth="1" strokeDasharray="3 4" fill="none">
              <line x1="40" y1="286" x2="600" y2="286" />
              <line x1="40" y1="280" x2="40" y2="292" />
              <line x1="600" y1="280" x2="600" y2="292" />
            </g>
            <text x="40" y="308" fontSize="9" fontFamily="ui-monospace, monospace" fill="rgb(var(--ink-faint))">
              closed circuit
            </text>
          </svg>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {t.lab.controls}
          </p>
          <div className="mt-5 space-y-6">
            <Slider
              label={t.lab.sourceVoltage}
              unit="V"
              value={voltage}
              min={0}
              max={12}
              step={0.1}
              onChange={setVoltage}
              format={(v) => v.toFixed(1)}
            />
            <Slider
              label={t.lab.resistance}
              unit="ohm"
              value={resistance}
              min={47}
              max={2200}
              step={1}
              onChange={setResistance}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {[
            { label: t.lab.current, value: currentMa.toFixed(1), unit: "mA" },
            { label: t.lab.ledPower, value: powerMw.toFixed(0), unit: "mW" },
            {
              label: t.lab.resistorPower,
              value: resistorPowerMw.toFixed(0),
              unit: "mW",
            },
            {
              label: t.lab.brightness,
              value: Math.round(brightness * 100).toString(),
              unit: "%",
            },
          ].map((s) => (
            <div key={s.label} className="bg-paper p-4">
              <p className="text-2xs text-ink-muted">{s.label}</p>
              <p className="mt-1 font-display text-xl font-bold tracking-[-0.03em] tnum">
                {s.value}
                <span className="ml-1 text-[11px] font-medium text-ink-muted">
                  {s.unit}
                </span>
              </p>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "flex gap-3 rounded-2xl border p-4",
            overdriven
              ? "border-danger/30 bg-danger-soft"
              : extinguished
                ? "border-line bg-paper-alt"
                : "border-success/25 bg-success-soft"
          )}
        >
          <Zap
            size={16}
            className={cn(
              "mt-0.5 shrink-0",
              overdriven
                ? "text-danger"
                : extinguished
                  ? "text-ink-muted"
                  : "text-success"
            )}
            aria-hidden
          />
          <div>
            <p className="text-[13px] font-semibold">
              {overdriven
                ? t.lab.overdriven
                : extinguished
                  ? t.lab.noLight
                  : t.lab.healthy}
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
              {overdriven
                ? t.lab.overdrivenLead
                : extinguished
                  ? t.lab.noLightLead
                  : t.lab.healthyLead}
            </p>
          </div>
        </div>

        <p className="rounded-2xl border border-line bg-paper-alt p-4 font-mono text-[11.5px] leading-relaxed text-ink-muted">
          I = (V_source - V_forward) / R
          <br />
          = ({voltage.toFixed(1)} - 2.0) / {resistance} = {currentMa.toFixed(1)} mA
        </p>
      </div>
    </div>
  );
}

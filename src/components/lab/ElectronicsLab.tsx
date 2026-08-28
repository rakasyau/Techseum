"use client";

import { useState } from "react";
import styles from "./ElectronicsLab.module.css";

export default function ElectronicsLab() {
  const [voltage, setVoltage] = useState(5.0); // Volts
  const [resistance, setResistance] = useState(220); // Ohms

  // Ohm's Law: I = V / R (Amperes), Power = V * I (Watts)
  const currentAmps = voltage / resistance;
  const currentMilliamps = (currentAmps * 1000).toFixed(1);
  const powerMilliwatts = (voltage * currentAmps * 1000).toFixed(1);

  // LED state
  const isOverloaded = Number(currentMilliamps) > 35; // Standard 5mm LED max ~30mA
  const ledBrightness = Math.min(1, Math.max(0, Number(currentMilliamps) / 25));

  // Dynamic resistor 4-band color code calculator
  const getResistorBands = (r: number) => {
    const digit1 = Math.floor(r / 100);
    const digit2 = Math.floor((r % 100) / 10);
    const colors = ["#000", "#8B4513", "#EF4444", "#F97316", "#FBBF24", "#22C55E", "#3B82F6", "#8B5CF6", "#6B7280", "#FFF"];
    return [colors[digit1 % 10] || "#EF4444", colors[digit2 % 10] || "#EF4444", "#8B4513", "#D97706"];
  };

  const bands = getResistorBands(resistance);

  return (
    <div className={styles.labCard} id="electronics-lab">
      <div className={styles.labHeader}>
        <div>
          <span className={styles.labTag}>Physics Simulation</span>
          <h3 className={styles.labTitle}>Ohm&apos;s Law &amp; Circuit Simulator</h3>
        </div>
        <div className={styles.formulaBadge}>
          <code>I = V / R</code> • <code>P = V × I</code>
        </div>
      </div>

      <div className={styles.labGrid}>
        {/* ── Left: Interactive Sliders ────────────── */}
        <div className={styles.controlsCol}>
          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabelRow}>
              <span className={styles.paramName}>Voltage (V):</span>
              <span className={styles.paramValue}>{voltage.toFixed(1)} V</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className={styles.slider}
              id="voltage-slider"
            />
            <div className={styles.sliderTicks}>
              <span>1V (AA Cell)</span>
              <span>5V (USB)</span>
              <span>12V (Car Battery)</span>
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabelRow}>
              <span className={styles.paramName}>Resistance (R):</span>
              <span className={styles.paramValue}>{resistance} Ω</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              value={resistance}
              onChange={(e) => setResistance(parseInt(e.target.value))}
              className={styles.slider}
              id="resistance-slider"
            />
            <div className={styles.sliderTicks}>
              <span>50Ω (Low)</span>
              <span>220Ω (Safe LED)</span>
              <span>1000Ω (1kΩ)</span>
            </div>
          </div>

          {/* Real-time Calculated Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>Calculated Current</span>
              <span className={`${styles.metricVal} ${isOverloaded ? styles.metricAlert : ""}`}>
                {currentMilliamps} mA
              </span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.metricLabel}>Power Dissipation</span>
              <span className={styles.metricVal}>{powerMilliwatts} mW</span>
            </div>
          </div>

          {isOverloaded && (
            <div className={styles.alertBanner}>
              ⚠️ <strong>Current Overload!</strong> At {currentMilliamps}mA, excessive thermal dissipation would permanently burn out a standard 20mA LED.
            </div>
          )}
        </div>

        {/* ── Right: Live SVG Circuit Diagram ──────── */}
        <div className={styles.circuitCol}>
          <svg className={styles.circuitSvg} viewBox="0 0 400 280">
            {/* Main Circuit Loop Wires */}
            <path
              d="M 60 70 H 340 V 210 H 60 Z"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Live Electron Flow Pulse */}
            <path
              d="M 60 70 H 340 V 210 H 60 Z"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeDasharray="6 12"
              className={styles.wireCurrentAnimation}
              style={{
                animationDuration: `${Math.max(0.3, 3 / (currentAmps * 50))}s`,
              }}
            />

            {/* Battery Symbol (Left) */}
            <g transform="translate(60, 140)">
              <rect x="-24" y="-30" width="48" height="60" rx="6" fill="var(--color-bg-card)" stroke="var(--color-border)" />
              <line x1="-12" y1="-10" x2="12" y2="-10" stroke="var(--color-text)" strokeWidth="3" />
              <line x1="-20" y1="10" x2="20" y2="10" stroke="var(--color-text)" strokeWidth="3" />
              <text x="0" y="-36" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-text)">
                {voltage}V DC
              </text>
            </g>

            {/* Resistor Component (Top) with Live Color Bands */}
            <g transform="translate(200, 70)">
              <rect x="-40" y="-14" width="80" height="28" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
              <rect x="-24" y="-14" width="6" height="28" fill={bands[0]} />
              <rect x="-10" y="-14" width="6" height="28" fill={bands[1]} />
              <rect x="4" y="-14" width="6" height="28" fill={bands[2]} />
              <rect x="20" y="-14" width="6" height="28" fill={bands[3]} />
              <text x="0" y="-22" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-text)">
                {resistance} Ω
              </text>
            </g>

            {/* LED Component (Right) with Dynamic Glow */}
            <g transform="translate(340, 140)">
              <circle
                cx="0"
                cy="0"
                r={16 + ledBrightness * 12}
                fill={isOverloaded ? "#EF4444" : "#22C55E"}
                opacity={isOverloaded ? 0.9 : ledBrightness * 0.7}
                filter="drop-shadow(0 0 16px rgba(34, 197, 94, 0.8))"
              />
              <polygon
                points="-10,-12 12,0 -10,12"
                fill={isOverloaded ? "#EF4444" : "#22C55E"}
                stroke="var(--color-text)"
                strokeWidth="1.5"
              />
              <line x1="12" y1="-12" x2="12" y2="12" stroke="var(--color-text)" strokeWidth="2" />
              <text x="0" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-text)">
                {isOverloaded ? "LED OVERHEATED" : "LED EMITTING"}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "./CameraLab.module.css";

export default function CameraLab() {
  const [aperture, setAperture] = useState(2.8); // f-stop
  const [shutterSpeed, setShutterSpeed] = useState(1 / 250); // seconds
  const [iso, setIso] = useState(400);

  // Exposure Value calculation: EV = log2(N^2 / t) - log2(ISO/100)
  const ev = (
    Math.log2((aperture * aperture) / shutterSpeed) -
    Math.log2(iso / 100)
  ).toFixed(1);

  // Optical Depth of Field (blur amount for background)
  // Lower f-number = higher blur
  const bokehBlurPx = Math.max(0, (16 / aperture - 1) * 3).toFixed(1);

  // Target base exposure reference ~ 11.5 EV
  const exposureDelta = Number(ev) - 11.5;
  const brightnessMultiplier = Math.max(
    0.2,
    Math.min(2.2, Math.pow(2, -exposureDelta * 0.5))
  ).toFixed(2);

  const getExposureStatus = () => {
    if (exposureDelta > 2) return { label: "Under-exposed (Too Dark)", color: "var(--color-danger)" };
    if (exposureDelta < -2) return { label: "Over-exposed (Blown Highlights)", color: "var(--color-text-muted)" };
    return { label: "Balanced Exposure", color: "var(--color-success)" };
  };

  const status = getExposureStatus();

  return (
    <div className={styles.labCard} id="camera-optics-lab">
      <div className={styles.labHeader}>
        <div>
          <span className={styles.labTag}>Optics & Sensor Simulator</span>
          <h3 className={styles.labTitle}>The Exposure Triangle &amp; Bokeh Lab</h3>
        </div>
        <div className={styles.evBadge}>
          EV Meter: <strong>{ev} EV</strong>
        </div>
      </div>

      <div className={styles.labGrid}>
        {/* ── Sliders ─────────────────────────────── */}
        <div className={styles.controlsCol}>
          <div className={styles.sliderGroup}>
            <div className={styles.labelRow}>
              <span className={styles.paramName}>Aperture (f-stop):</span>
              <span className={styles.paramValue}>f/{aperture}</span>
            </div>
            <input
              type="range"
              min="1.4"
              max="16"
              step="0.2"
              value={aperture}
              onChange={(e) => setAperture(parseFloat(e.target.value))}
              className={styles.slider}
              id="aperture-slider"
            />
            <div className={styles.ticks}>
              <span>f/1.4 (Creamy Bokeh)</span>
              <span>f/5.6</span>
              <span>f/16 (Deep Sharpness)</span>
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.labelRow}>
              <span className={styles.paramName}>Shutter Speed:</span>
              <span className={styles.paramValue}>
                {shutterSpeed < 1 ? `1/${Math.round(1 / shutterSpeed)}s` : `${shutterSpeed}s`}
              </span>
            </div>
            <input
              type="range"
              min="-12"
              max="0"
              step="1"
              value={Math.log2(shutterSpeed)}
              onChange={(e) => setShutterSpeed(Math.pow(2, parseInt(e.target.value)))}
              className={styles.slider}
              id="shutter-slider"
            />
            <div className={styles.ticks}>
              <span>1/4000s (Action Freeze)</span>
              <span>1/250s</span>
              <span>1s (Motion Blur)</span>
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.labelRow}>
              <span className={styles.paramName}>ISO Sensitivity:</span>
              <span className={styles.paramValue}>ISO {iso}</span>
            </div>
            <input
              type="range"
              min="100"
              max="6400"
              step="100"
              value={iso}
              onChange={(e) => setIso(parseInt(e.target.value))}
              className={styles.slider}
              id="iso-slider"
            />
            <div className={styles.ticks}>
              <span>ISO 100 (Clean)</span>
              <span>ISO 800</span>
              <span>ISO 6400 (High Noise)</span>
            </div>
          </div>

          <div className={styles.statusBox} style={{ borderColor: status.color }}>
            <span className={styles.statusDot} style={{ backgroundColor: status.color }} />
            <span className={styles.statusText}>{status.label}</span>
          </div>
        </div>

        {/* ── Interactive Viewport Preview ────────── */}
        <div className={styles.previewCol}>
          <div
            className={styles.cameraViewfinder}
            style={{
              filter: `brightness(${brightnessMultiplier})`,
            }}
          >
            {/* Background Layer with Dynamic Optical Blur */}
            <div
              className={styles.backgroundLayer}
              style={{
                filter: `blur(${bokehBlurPx}px)`,
              }}
            >
              <div className={styles.bgTree} />
              <div className={styles.bgSun} />
              <div className={styles.bgMountain} />
            </div>

            {/* Foreground Subject Layer (Always in Focus) */}
            <div className={styles.subjectLayer}>
              <div className={styles.subjectLens}>
                <svg viewBox="0 0 120 120" width="90" height="90">
                  <circle cx="60" cy="60" r="50" fill="#1E1B4B" stroke="#4F46E5" strokeWidth="4" />
                  <circle cx="60" cy="60" r="35" fill="#312E81" opacity="0.8" />
                  <circle cx="60" cy="60" r={Math.max(8, 45 - aperture * 2.2)} fill="#0A0A0A" />
                </svg>
              </div>
            </div>

            {/* Camera Viewfinder Reticle Overlay */}
            <div className={styles.viewfinderOverlay}>
              <div className={styles.crosshair} />
              <span className={styles.vfMetaTop}>[AF-C FOCUS LOCKED]</span>
              <span className={styles.vfMetaBottom}>
                f/{aperture} • {shutterSpeed < 1 ? `1/${Math.round(1 / shutterSpeed)}s` : `${shutterSpeed}s`} • ISO {iso}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

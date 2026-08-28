"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { type SimulationStep } from "@/data/topics";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Simulation2DEngine.module.css";

interface Simulation2DEngineProps {
  topicId: string;
  topicTitle: string;
  steps?: SimulationStep[];
  totalSteps?: number;
}

export default function Simulation2DEngine({
  topicId,
  topicTitle,
  steps = [],
  totalSteps: totalStepsProp,
}: Simulation2DEngineProps) {
  const { language } = useLanguage();
  const stepCount = steps.length > 0 ? steps.length : totalStepsProp || 4;
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 2 | 3>(1);

  // ── Reactive Simulation Clock ─────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const baseDuration = 3600;
    const intervalTime = baseDuration / speed;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % stepCount);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, stepCount]);

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % stepCount);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + stepCount) % stepCount);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Animation pulse duration derived from active speed
  const pulseDuration = useMemo(() => 2.4 / speed, [speed]);

  const currentStepData = steps[currentStep] || {
    stepNumber: currentStep + 1,
    title: `Step ${currentStep + 1}`,
    shortDesc: "Simulasi proses komputasi & elektronik berlangsung.",
    details: "",
  };

  // ── Render Dedicated Museum-Grade 2D Schematic ─────────────
  const renderTopicDiagram = () => {
    switch (topicId) {
      // ────────────────────────────────────────────────────────
      // 1. CPU (Fetch -> Decode -> Execute -> Writeback)
      // ────────────────────────────────────────────────────────
      case "cpu":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Bus Lines with Continuous Animated Flow */}
            <line x1="200" y1="140" x2="280" y2="140" stroke={currentStep === 0 ? "#818CF8" : "#334155"} strokeWidth={currentStep === 0 ? 3.5 : 2} className={currentStep === 0 ? styles.animFlow : undefined} />
            <line x1="440" y1="140" x2="520" y2="140" stroke={currentStep === 1 ? "#F59E0B" : "#334155"} strokeWidth={currentStep === 1 ? 3.5 : 2} className={currentStep === 1 ? styles.animFlow : undefined} />
            <path d="M 640 190 L 640 330 L 140 330 L 140 190" fill="none" stroke={currentStep === 3 ? "#10B981" : "#334155"} strokeWidth={currentStep === 3 ? 3.5 : 2} className={currentStep === 3 ? styles.animFlow : undefined} strokeDasharray="6 4" />

            {/* Step Traveling Data Packet with Native SVG Animation */}
            <circle r="7" fill={currentStep === 0 ? "#38BDF8" : currentStep === 1 ? "#FBBF24" : currentStep === 2 ? "#34D399" : "#10B981"} className={styles.animGlowFast}>
              {currentStep === 0 && <animate attributeName="cx" values="80;200;280" dur={`${pulseDuration}s`} repeatCount="indefinite" />}
              {currentStep === 0 && <animate attributeName="cy" values="140;140;140" dur={`${pulseDuration}s`} repeatCount="indefinite" />}

              {currentStep === 1 && <animate attributeName="cx" values="280;360;440;520" dur={`${pulseDuration}s`} repeatCount="indefinite" />}
              {currentStep === 1 && <animate attributeName="cy" values="140;140;140;140" dur={`${pulseDuration}s`} repeatCount="indefinite" />}

              {currentStep === 2 && <animate attributeName="cx" values="520;600;640" dur={`${pulseDuration}s`} repeatCount="indefinite" />}
              {currentStep === 2 && <animate attributeName="cy" values="140;140;190" dur={`${pulseDuration}s`} repeatCount="indefinite" />}

              {currentStep === 3 && <animate attributeName="cx" values="640;640;400;140;140" dur={`${pulseDuration}s`} repeatCount="indefinite" />}
              {currentStep === 3 && <animate attributeName="cy" values="190;330;330;330;190" dur={`${pulseDuration}s`} repeatCount="indefinite" />}
            </circle>

            {/* Step 1: Fetch Unit */}
            <rect
              x="70"
              y="90"
              width="130"
              height="100"
              rx="10"
              fill={currentStep === 0 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 0 ? "#818CF8" : "#334155"}
              strokeWidth={currentStep === 0 ? "3" : "1.5"}
              className={currentStep === 0 ? styles.animGlow : undefined}
            />
            <text x="135" y="125" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">1. FETCH (IF)</text>
            <text x="135" y="148" textAnchor="middle" fill={currentStep === 0 ? "#A5B4FC" : "#64748B"} fontSize="10" fontWeight="600">PC: 0x00401A20</text>
            <text x="135" y="168" textAnchor="middle" fill="#94A3B8" fontSize="9">L1 I-Cache 32KB</text>

            {/* Step 2: Decode Unit */}
            <rect
              x="280"
              y="90"
              width="160"
              height="100"
              rx="10"
              fill={currentStep === 1 ? "#312E81" : "#0F172A"}
              stroke={currentStep === 1 ? "#F59E0B" : "#334155"}
              strokeWidth={currentStep === 1 ? "3" : "1.5"}
              className={currentStep === 1 ? styles.animGlow : undefined}
            />
            <text x="360" y="125" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">2. DECODE (ID)</text>
            <text x="360" y="148" textAnchor="middle" fill={currentStep === 1 ? "#FDE68A" : "#64748B"} fontSize="10" fontWeight="600">Opcode: ADD (R1, R2)</text>
            <text x="360" y="168" textAnchor="middle" fill="#94A3B8" fontSize="9">Control Matrix (R3=Dest)</text>

            {/* Step 3: Execute Unit (ALU) */}
            <polygon
              points="520,80 660,110 660,170 520,200 550,140"
              fill={currentStep === 2 ? "#064E3B" : "#0F172A"}
              stroke={currentStep === 2 ? "#34D399" : "#334155"}
              strokeWidth={currentStep === 2 ? "3" : "1.5"}
              className={currentStep === 2 ? styles.animGlow : undefined}
            />
            <text x="600" y="135" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">3. EXECUTE</text>
            <text x="600" y="155" textAnchor="middle" fill={currentStep === 2 ? "#6EE7B7" : "#64748B"} fontSize="10" fontWeight="600">ALU: 42 + 58 = 100</text>

            {/* Step 4: Writeback Unit */}
            <rect
              x="250"
              y="270"
              width="300"
              height="100"
              rx="12"
              fill={currentStep === 3 ? "#064E3B" : "#0F172A"}
              stroke={currentStep === 3 ? "#10B981" : "#334155"}
              strokeWidth={currentStep === 3 ? "3" : "1.5"}
              className={currentStep === 3 ? styles.animGlow : undefined}
            />
            <text x="400" y="305" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">4. WRITEBACK (WB)</text>
            <text x="400" y="328" textAnchor="middle" fill={currentStep === 3 ? "#6EE7B7" : "#64748B"} fontSize="10" fontWeight="600">Register File: R3 &lt;= 100</text>
            <text x="400" y="348" textAnchor="middle" fill="#94A3B8" fontSize="9">Zero Flag (ZF)=0 · Carry=0</text>
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 2. Wi-Fi (Serialization -> QAM -> Waves -> Demodulation)
      // ────────────────────────────────────────────────────────
      case "wifi":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Step 1: Transmitter MAC Frame */}
            <rect
              x="60"
              y="220"
              width="200"
              height="120"
              rx="12"
              fill={currentStep === 0 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 0 ? "#818CF8" : "#334155"}
              strokeWidth={currentStep === 0 ? 3 : 1.5}
            />
            <line x1="100" y1="220" x2="100" y2="135" stroke={currentStep >= 2 ? "#38BDF8" : "#0EA5E9"} strokeWidth="4" strokeLinecap="round" />
            <line x1="220" y1="220" x2="220" y2="135" stroke={currentStep >= 2 ? "#38BDF8" : "#0EA5E9"} strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="133" r="6" fill={currentStep >= 2 ? "#38BDF8" : "#64748B"} />
            <circle cx="220" cy="133" r="6" fill={currentStep >= 2 ? "#38BDF8" : "#64748B"} />
            <text x="160" y="260" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">1. TX MAC / Router</text>
            <text x="160" y="282" textAnchor="middle" fill={currentStep === 0 ? "#A5B4FC" : "#38BDF8"} fontSize="10">802.11ax Frame Formed</text>
            <text x="160" y="305" textAnchor="middle" fill="#94A3B8" fontSize="9">[MAC|IP|Payload|CRC]</text>

            {/* Step 2: 1024-QAM Constellation Modulator */}
            <rect
              x="300"
              y="60"
              width="200"
              height="140"
              rx="10"
              fill={currentStep === 1 ? "#312E81" : "#0F172A"}
              stroke={currentStep === 1 ? "#F59E0B" : "#334155"}
              strokeWidth={currentStep === 1 ? 3 : 1.5}
            />
            <text x="400" y="90" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">2. QAM Modulation</text>
            <text x="400" y="110" textAnchor="middle" fill={currentStep === 1 ? "#FDE68A" : "#818CF8"} fontSize="10">Phase (I) &amp; Amplitude (Q)</text>
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={345 + c * 35}
                  cy={125 + r * 16}
                  r={currentStep === 1 ? 4.5 : 2.5}
                  fill={currentStep === 1 ? "#38BDF8" : "#475569"}
                >
                  {currentStep === 1 && (
                    <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" begin={`${(r + c) * 0.1}s`} />
                  )}
                </circle>
              ))
            )}

            {/* Step 3: Expanding RF Waves with Continuous Pulsing */}
            {[1, 2, 3, 4].map((ring) => (
              <circle
                key={ring}
                cx="220"
                cy="175"
                r={ring * 45}
                fill="none"
                stroke={currentStep === 2 ? "#06B6D4" : "#0284C7"}
                strokeWidth={currentStep === 2 ? 3 : 1.5}
                strokeDasharray="6 6"
              >
                <animate attributeName="r" values={`${ring * 25};${ring * 55 + 50};${ring * 25}`} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
            ))}
            {currentStep === 2 && (
              <text x="400" y="240" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700">3. 5.8 GHz Wave Propagation</text>
            )}

            {/* Step 4: Receiver & Demodulation */}
            <rect
              x="570"
              y="160"
              width="160"
              height="220"
              rx="18"
              fill={currentStep === 3 ? "#064E3B" : "#0F172A"}
              stroke={currentStep === 3 ? "#10B981" : "#334155"}
              strokeWidth={currentStep === 3 ? 3 : 1.5}
              className={currentStep === 3 ? styles.animGlow : undefined}
            />
            <rect x="585" y="180" width="130" height="150" rx="8" fill="#030712" />
            <text x="650" y="225" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">4. RX Device</text>
            <text x="650" y="248" textAnchor="middle" fill={currentStep === 3 ? "#6EE7B7" : "#34D399"} fontSize="11" fontWeight="600">LNA + ADC Decode</text>
            <text x="650" y="275" textAnchor="middle" fill="#94A3B8" fontSize="9">Bits Restored: 01101001</text>
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 3. Camera Sensor (Refraction -> Bayer CFA -> Well Charge -> ADC)
      // ────────────────────────────────────────────────────────
      case "camera":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Step 1: Animated Light Rays Refraction */}
            <path
              d="M 60 110 L 220 180 L 420 225 L 590 225"
              fill="none"
              stroke="#F59E0B"
              strokeWidth={currentStep === 0 ? 3.5 : 2}
              className={styles.animFlow}
            />
            <path
              d="M 60 340 L 220 270 L 420 225 L 590 225"
              fill="none"
              stroke="#F59E0B"
              strokeWidth={currentStep === 0 ? 3.5 : 2}
              className={styles.animFlow}
            />

            {/* Moving Photon Particles */}
            <circle r="4" fill="#FDE68A" className={styles.animGlowFast}>
              <animate attributeName="cx" values="60;220;420;590" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="cy" values="110;180;225;225" dur="1.4s" repeatCount="indefinite" />
            </circle>

            {/* Lens Elements (Step 1) */}
            <path
              d="M 220 90 Q 250 225 220 360 Q 190 225 220 90"
              fill={currentStep === 0 ? "rgba(56, 189, 248, 0.35)" : "rgba(2, 132, 199, 0.15)"}
              stroke={currentStep === 0 ? "#38BDF8" : "#0284C7"}
              strokeWidth={currentStep === 0 ? 3.5 : 2}
            />
            <text x="220" y="70" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">1. Optical Lens</text>

            {/* Aperture Iris */}
            <rect x="340" y="90" width="16" height="95" rx="3" fill="#475569" stroke="#94A3B8" />
            <rect x="340" y="265" width="16" height="95" rx="3" fill="#475569" stroke="#94A3B8" />
            <text x="348" y="70" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">Iris (f/1.8)</text>

            {/* Bayer Matrix CFA (Step 2) */}
            <rect
              x="460"
              y="110"
              width="45"
              height="230"
              rx="6"
              fill={currentStep === 1 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 1 ? "#F59E0B" : "#334155"}
              strokeWidth={currentStep === 1 ? 3 : 1.5}
            />
            <text x="482" y="90" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">2. Bayer CFA</text>
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i} transform={`translate(465, ${120 + i * 40})`}>
                <rect x="0" y="0" width="16" height="16" fill={i % 2 === 0 ? "#EF4444" : "#22C55E"} rx="2" />
                <rect x="18" y="0" width="16" height="16" fill={i % 2 === 0 ? "#22C55E" : "#3B82F6"} rx="2" />
              </g>
            ))}

            {/* Photodiode Wells (Step 3) */}
            <rect
              x="540"
              y="110"
              width="60"
              height="230"
              rx="6"
              fill={currentStep === 2 ? "#064E3B" : "#0F172A"}
              stroke={currentStep === 2 ? "#34D399" : "#334155"}
              strokeWidth={currentStep === 2 ? 3 : 1.5}
            />
            <text x="570" y="90" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">3. Photodiodes</text>
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx="570"
                cy={135 + i * 40}
                r={currentStep === 2 ? 10 : 6}
                fill={currentStep === 2 ? "#38BDF8" : "#475569"}
                stroke="#67E8F9"
                strokeWidth="1"
              >
                {currentStep === 2 && <animate attributeName="r" values="6;12;6" dur="1s" repeatCount="indefinite" />}
              </circle>
            ))}

            {/* Column ADC & RAW Output (Step 4) */}
            <rect
              x="635"
              y="110"
              width="105"
              height="230"
              rx="8"
              fill={currentStep === 3 ? "#064E3B" : "#0F172A"}
              stroke={currentStep === 3 ? "#10B981" : "#334155"}
              strokeWidth={currentStep === 3 ? 3 : 1.5}
              className={currentStep === 3 ? styles.animGlow : undefined}
            />
            <text x="687" y="90" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">4. Column ADC</text>
            <text x="687" y="160" textAnchor="middle" fill={currentStep === 3 ? "#6EE7B7" : "#64748B"} fontSize="11" fontWeight="600">14-bit RAW</text>
            <text x="687" y="185" textAnchor="middle" fill="#94A3B8" fontSize="9">CDS Noise Filter</text>
            <text x="687" y="240" textAnchor="middle" fill="#A7F3D0" fontSize="10">ISP Demosaic</text>
            <text x="687" y="260" textAnchor="middle" fill="#6EE7B7" fontSize="10">Output Frame</text>
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 4. SSD & Flash Memory (PCIe -> Wordline -> Sense Amp -> LDPC)
      // ────────────────────────────────────────────────────────
      case "ssd":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Step 1: PCIe 4.0 Interface with Flowing Bus */}
            <rect
              x="60"
              y="160"
              width="150"
              height="130"
              rx="10"
              fill={currentStep === 0 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 0 ? "#818CF8" : "#334155"}
              strokeWidth={currentStep === 0 ? 3 : 1.5}
            />
            <text x="135" y="200" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">1. Host PCIe 4.0</text>
            <text x="135" y="225" textAnchor="middle" fill={currentStep === 0 ? "#A5B4FC" : "#38BDF8"} fontSize="11" fontWeight="600">NVMe Read Request</text>
            <text x="135" y="250" textAnchor="middle" fill="#94A3B8" fontSize="9">DMA 64 Gbps (x4)</text>

            <line x1="210" y1="225" x2="250" y2="225" stroke="#38BDF8" strokeWidth="3" className={styles.animFlowFast} />

            {/* Step 2 & 4: Flash Controller & LDPC */}
            <rect
              x="250"
              y="115"
              width="190"
              height="220"
              rx="12"
              fill={currentStep === 3 ? "#064E3B" : currentStep === 0 ? "#312E81" : "#0F172A"}
              stroke={currentStep === 3 ? "#10B981" : currentStep === 0 ? "#818CF8" : "#334155"}
              strokeWidth={currentStep === 3 || currentStep === 0 ? 3 : 1.5}
            />
            <text x="345" y="150" textAnchor="middle" fill="#E2E8F0" fontSize="14" fontWeight="700">Flash Controller</text>
            <text x="345" y="175" textAnchor="middle" fill={currentStep === 0 ? "#FDE68A" : "#818CF8"} fontSize="10">FTL LBA Translation</text>
            <rect x="270" y="205" width="150" height="50" rx="6" fill={currentStep === 3 ? "#047857" : "#1E293B"} stroke={currentStep === 3 ? "#34D399" : "none"} className={currentStep === 3 ? styles.animGlow : undefined} />
            <text x="345" y="228" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="700">4. LDPC ECC Engine</text>
            <text x="345" y="245" textAnchor="middle" fill={currentStep === 3 ? "#6EE7B7" : "#94A3B8"} fontSize="9">Bitflip Correction: Clean 7GB/s</text>

            {/* Step 2 & 3: 3D NAND Vertical Strings & Sense Amps */}
            <rect
              x="480"
              y="90"
              width="250"
              height="270"
              rx="12"
              fill={currentStep === 1 || currentStep === 2 ? "#1E1B4B" : "#030712"}
              stroke={currentStep === 1 ? "#F59E0B" : currentStep === 2 ? "#38BDF8" : "#334155"}
              strokeWidth={currentStep === 1 || currentStep === 2 ? 3 : 1.5}
            />
            <text x="605" y="125" textAnchor="middle" fill="#FDE68A" fontSize="13" fontWeight="700">2. 3D NAND Flash Die</text>
            <text x="605" y="145" textAnchor="middle" fill="#94A3B8" fontSize="10">176 Vertical Cell Layers</text>

            {[0, 1, 2, 3].map((layer) => (
              <rect
                key={layer}
                x="510"
                y={165 + layer * 32}
                width="190"
                height="22"
                rx="4"
                fill={currentStep === 1 && layer === 1 ? "#D97706" : "#1E293B"}
                stroke={currentStep === 1 && layer === 1 ? "#FBBF24" : "#475569"}
                strokeWidth="1"
              />
            ))}
            <text x="605" y="180" textAnchor="middle" fill="#E2E8F0" fontSize="9" fontWeight="600">Wordline 88 (Activated Vpass)</text>

            {/* Step 3: Sense Amps */}
            <rect
              x="510"
              y="300"
              width="190"
              height="45"
              rx="6"
              fill={currentStep === 2 ? "#0284C7" : "#0F172A"}
              stroke={currentStep === 2 ? "#38BDF8" : "#334155"}
              className={currentStep === 2 ? styles.animGlow : undefined}
            />
            <text x="605" y="322" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="700">3. Sense Amps (ΔVth Read)</text>
            <text x="605" y="338" textAnchor="middle" fill={currentStep === 2 ? "#E0F2FE" : "#94A3B8"} fontSize="8">Trapped Electrons Measured</text>
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 5. GPU (Vertex Math -> Rasterizer -> Shaders -> Framebuffer)
      // ────────────────────────────────────────────────────────
      case "gpu":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Step 1: Vertex Shader Transformation */}
            <rect
              x="50"
              y="130"
              width="150"
              height="180"
              rx="10"
              fill={currentStep === 0 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 0 ? "#818CF8" : "#334155"}
              strokeWidth={currentStep === 0 ? 3 : 1.5}
            />
            <text x="125" y="160" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">1. Vertex Shaders</text>

            {/* 3D Wireframe Polygon with continuous rotation */}
            <polygon
              points="90,260 125,185 160,260"
              fill="rgba(99, 102, 241, 0.3)"
              stroke="#818CF8"
              strokeWidth="2"
              className={styles.animGlow}
            />
            <circle cx="90" cy="260" r="4" fill="#38BDF8" />
            <circle cx="125" cy="185" r="4" fill="#38BDF8" />
            <circle cx="160" cy="260" r="4" fill="#38BDF8" />

            {/* Flow to Step 2 */}
            <line x1="200" y1="220" x2="230" y2="220" stroke="#818CF8" strokeWidth="3" className={styles.animFlow} />

            {/* Step 2: Hardware Rasterizer */}
            <rect
              x="230"
              y="130"
              width="140"
              height="180"
              rx="10"
              fill={currentStep === 1 ? "#312E81" : "#0F172A"}
              stroke={currentStep === 1 ? "#F59E0B" : "#334155"}
              strokeWidth={currentStep === 1 ? 3 : 1.5}
            />
            <text x="300" y="165" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">2. Rasterizer</text>
            <text x="300" y="190" textAnchor="middle" fill={currentStep === 1 ? "#FDE68A" : "#64748B"} fontSize="10">Pixel Fragments</text>
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={275 + c * 18}
                  y={215 + r * 18}
                  width="14"
                  height="14"
                  rx="2"
                  fill={currentStep === 1 ? "#F59E0B" : "#1E293B"}
                  stroke={currentStep === 1 ? "#FDE68A" : "#334155"}
                />
              ))
            )}

            {/* Step 3: Streaming Multiprocessors (SMs) / Pixel Shading */}
            <rect
              x="400"
              y="80"
              width="190"
              height="280"
              rx="12"
              fill={currentStep === 2 ? "#064E3B" : "#030712"}
              stroke={currentStep === 2 ? "#22C55E" : "#334155"}
              strokeWidth={currentStep === 2 ? 3 : 1.5}
            />
            <text x="495" y="115" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">3. Pixel Shaders</text>
            <text x="495" y="135" textAnchor="middle" fill={currentStep === 2 ? "#86EFAC" : "#4ADE80"} fontSize="10">PBR &amp; Ray Tracing</text>
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={420 + c * 80}
                  y={155 + r * 60}
                  width="70"
                  height="48"
                  rx="6"
                  fill={currentStep === 2 ? "#047857" : "#052E16"}
                  stroke={currentStep === 2 ? "#4ADE80" : "#166534"}
                  strokeWidth="1.5"
                />
              ))
            )}

            {/* Step 4: GDDR6X & Framebuffer */}
            <rect
              x="620"
              y="110"
              width="140"
              height="220"
              rx="10"
              fill={currentStep === 3 ? "#064E3B" : "#0F172A"}
              stroke={currentStep === 3 ? "#10B981" : "#334155"}
              strokeWidth={currentStep === 3 ? 3 : 1.5}
            />
            <text x="690" y="150" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">4. Framebuffer</text>
            <text x="690" y="175" textAnchor="middle" fill={currentStep === 3 ? "#6EE7B7" : "#FDE68A"} fontSize="11" fontWeight="600">Z-Buffer Resolved</text>
            <text x="690" y="210" textAnchor="middle" fill="#94A3B8" fontSize="10">GDDR6X VRAM</text>
            <text x="690" y="235" textAnchor="middle" fill="#34D399" fontSize="10">1008 GB/s Bandwidth</text>
            <text x="690" y="280" textAnchor="middle" fill="#A7F3D0" fontSize="11" fontWeight="700">4K 120 FPS Output</text>
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 6. DNS (Browser Cache -> Resolver -> TLD -> Authoritative Server)
      // ────────────────────────────────────────────────────────
      case "dns":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Step 1: User Browser / Local Cache */}
            <rect
              x="60"
              y="270"
              width="170"
              height="110"
              rx="10"
              fill={currentStep === 0 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 0 ? "#818CF8" : "#334155"}
              strokeWidth={currentStep === 0 ? 3 : 1.5}
            />
            <text x="145" y="305" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">1. Browser / OS</text>
            <text x="145" y="330" textAnchor="middle" fill={currentStep === 0 ? "#A5B4FC" : "#94A3B8"} fontSize="10">Cache Miss: google.com</text>
            <text x="145" y="355" textAnchor="middle" fill="#38BDF8" fontSize="9">Ask Recursive Resolver</text>

            {/* Step 2: Root DNS Server */}
            <circle
              cx="400"
              cy="80"
              r="38"
              fill={currentStep === 1 ? "#312E81" : "#1E1B4B"}
              stroke={currentStep === 1 ? "#F59E0B" : "#818CF8"}
              strokeWidth={currentStep === 1 ? 3.5 : 2}
            />
            <text x="400" y="87" textAnchor="middle" fill="#E0E7FF" fontSize="15" fontWeight="800">2. . (Root)</text>
            <text x="400" y="130" textAnchor="middle" fill={currentStep === 1 ? "#FDE68A" : "#64748B"} fontSize="10">Root Points to .COM</text>

            {/* Step 3: TLD Servers */}
            <rect
              x="260"
              y="170"
              width="130"
              height="60"
              rx="8"
              fill={currentStep === 2 ? "#312E81" : "#0F172A"}
              stroke={currentStep === 2 ? "#F59E0B" : "#38BDF8"}
              strokeWidth={currentStep === 2 ? 3 : 1.5}
            />
            <text x="325" y="205" textAnchor="middle" fill="#BAE6FD" fontSize="12" fontWeight="700">3. .COM TLD</text>

            <rect x="420" y="170" width="130" height="60" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
            <text x="485" y="205" textAnchor="middle" fill="#64748B" fontSize="12" fontWeight="700">.ORG TLD</text>

            {/* Connection Lines */}
            <line x1="145" y1="270" x2="380" y2="110" stroke={currentStep === 0 || currentStep === 1 ? "#818CF8" : "#334155"} strokeWidth="2" strokeDasharray="4 4" />
            <line x1="380" y1="110" x2="325" y2="170" stroke={currentStep === 1 || currentStep === 2 ? "#F59E0B" : "#334155"} strokeWidth="2" />
            <line x1="325" y1="230" x2="480" y2="280" stroke={currentStep === 2 || currentStep === 3 ? "#10B981" : "#334155"} strokeWidth="2" />

            {/* Step 4: Authoritative Server */}
            <rect
              x="420"
              y="270"
              width="210"
              height="110"
              rx="10"
              fill={currentStep === 3 ? "#064E3B" : "#0F172A"}
              stroke={currentStep === 3 ? "#10B981" : "#334155"}
              strokeWidth={currentStep === 3 ? 3 : 1.5}
            />
            <text x="525" y="305" textAnchor="middle" fill="#A7F3D0" fontSize="13" fontWeight="700">4. Authoritative DNS</text>
            <text x="525" y="330" textAnchor="middle" fill={currentStep === 3 ? "#6EE7B7" : "#94A3B8"} fontSize="11" fontWeight="700">A Record: 142.250.190.46</text>
            <text x="525" y="355" textAnchor="middle" fill="#34D399" fontSize="9">Response Cached (TTL=300s)</text>
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 7. Bluetooth (Advertising -> ECDH -> Frequency Hop -> Audio Stream)
      // ────────────────────────────────────────────────────────
      case "bluetooth":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Step 1 & 2: Smartphone (Master) */}
            <rect
              x="80"
              y="110"
              width="150"
              height="240"
              rx="16"
              fill={currentStep === 1 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 1 ? "#818CF8" : "#38BDF8"}
              strokeWidth={currentStep === 1 ? 3 : 2}
            />
            <rect x="95" y="130" width="120" height="170" rx="8" fill="#030712" />
            <text x="155" y="170" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">Smartphone</text>
            <text x="155" y="195" textAnchor="middle" fill="#38BDF8" fontSize="10">Master Device</text>
            {currentStep === 1 && (
              <text x="155" y="235" textAnchor="middle" fill="#A5B4FC" fontSize="9">ECDH Key Pair</text>
            )}

            {/* Step 3: FHSS Frequency Spectrum Grid */}
            <rect
              x="270"
              y="70"
              width="260"
              height="150"
              rx="10"
              fill={currentStep === 2 ? "#312E81" : "#0F172A"}
              stroke={currentStep === 2 ? "#F59E0B" : "#334155"}
              strokeWidth={currentStep === 2 ? 3 : 1.5}
            />
            <text x="400" y="100" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">3. FHSS Hopping</text>
            <text x="400" y="120" textAnchor="middle" fill={currentStep === 2 ? "#FDE68A" : "#818CF8"} fontSize="10">1,600 hops/sec (79 Ch)</text>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
              <rect
                key={c}
                x={295 + c * 28}
                y={135}
                width="20"
                height="60"
                rx="3"
                fill={currentStep === 2 && (c === 2 || c === 5) ? "#F59E0B" : "#1E293B"}
                stroke={currentStep === 2 && (c === 2 || c === 5) ? "#FDE68A" : "#475569"}
              />
            ))}

            {/* Step 4: LC3 Audio Stream */}
            <rect
              x="270"
              y="240"
              width="260"
              height="110"
              rx="10"
              fill={currentStep === 3 ? "#064E3B" : "#0F172A"}
              stroke={currentStep === 3 ? "#10B981" : "#334155"}
              strokeWidth={currentStep === 3 ? 3 : 1.5}
            />
            <text x="400" y="270" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">4. LC3 Audio Stream</text>
            <text x="400" y="295" textAnchor="middle" fill={currentStep === 3 ? "#6EE7B7" : "#94A3B8"} fontSize="10">Low Latency &lt;50ms</text>
            {currentStep === 3 && isPlaying && (
              <motion.path
                d="M 300 325 Q 330 305 360 325 T 420 325 T 480 325"
                fill="none"
                stroke="#34D399"
                strokeWidth="2.5"
                animate={{ strokeDashoffset: [0, -40] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Step 1: Peripheral (Earbuds) */}
            <rect
              x="570"
              y="140"
              width="150"
              height="180"
              rx="14"
              fill={currentStep === 0 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 0 ? "#818CF8" : "#38BDF8"}
              strokeWidth={currentStep === 0 ? 3 : 1.5}
            />
            <text x="645" y="180" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">1. BLE Earbuds</text>
            <text x="645" y="205" textAnchor="middle" fill={currentStep === 0 ? "#A5B4FC" : "#38BDF8"} fontSize="10">Adv Ch 37, 38, 39</text>
            <circle cx="645" cy="255" r="22" fill="#030712" stroke="#6366F1" strokeWidth="2" />
            <text x="645" y="260" textAnchor="middle" fill="#E2E8F0" fontSize="14">🎧</text>
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 8. RAM & DRAM Cells (RAS -> Sense Amps -> CAS -> Restore)
      // ────────────────────────────────────────────────────────
      case "ram":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Step 1: Row Address Decoder (RAS) */}
            <rect
              x="60"
              y="80"
              width="150"
              height="280"
              rx="10"
              fill={currentStep === 0 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 0 ? "#818CF8" : "#334155"}
              strokeWidth={currentStep === 0 ? 3 : 1.5}
            />
            <text x="135" y="115" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">1. Row Decoder</text>
            <text x="135" y="138" textAnchor="middle" fill={currentStep === 0 ? "#A5B4FC" : "#64748B"} fontSize="10" fontWeight="600">RAS Address Strobe</text>
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(75, ${160 + i * 45})`}>
                <rect x="0" y="0" width="120" height="26" rx="5" fill={currentStep === 0 && i === 1 ? "#4338CA" : "#1E293B"} stroke={currentStep === 0 && i === 1 ? "#818CF8" : "none"} />
                <text x="60" y="17" textAnchor="middle" fill="#E2E8F0" fontSize="9" fontWeight="600">Wordline {i} {i === 1 ? "(ACTIVE)" : ""}</text>
              </g>
            ))}

            {/* 4x4 1T1C DRAM Matrix */}
            <rect x="250" y="70" width="300" height="300" rx="12" fill="#030712" stroke="#1E293B" strokeWidth="2" />
            <text x="400" y="100" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">1T1C DRAM Matrix (Femtofarad)</text>
            {[0, 1, 2, 3].map((r) => (
              <line key={r} x1="220" y1={140 + r * 55} x2="520" y2={140 + r * 55} stroke={currentStep === 0 && r === 1 ? "#818CF8" : "#334155"} strokeWidth={currentStep === 0 && r === 1 ? 2.5 : 1} />
            ))}

            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <g key={`${r}-${c}`} transform={`translate(${275 + c * 65}, ${120 + r * 55})`}>
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill={currentStep === 3 ? "#064E3B" : (currentStep === 0 && r === 1) ? "#4F46E5" : "#1E293B"}
                    stroke={currentStep === 3 ? "#10B981" : (currentStep === 0 && r === 1) ? "#818CF8" : "#475569"}
                    strokeWidth="1.5"
                  />
                  <text x="18" y="22" textAnchor="middle" fill="#E2E8F0" fontSize="8" fontWeight="700">1C</text>
                </g>
              ))
            )}

            {/* Step 2 & 4: Sense Amplifiers & Restore */}
            <rect
              x="580"
              y="80"
              width="160"
              height="280"
              rx="10"
              fill={currentStep === 1 || currentStep === 3 ? "#064E3B" : currentStep === 2 ? "#312E81" : "#0F172A"}
              stroke={currentStep === 1 ? "#34D399" : currentStep === 3 ? "#10B981" : currentStep === 2 ? "#F59E0B" : "#334155"}
              strokeWidth={currentStep > 0 ? 3 : 1.5}
            />
            <text x="660" y="115" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">
              {currentStep === 2 ? "3. Column (CAS)" : currentStep === 3 ? "4. Restore & Precharge" : "2. Sense Amps"}
            </text>
            <text x="660" y="138" textAnchor="middle" fill={currentStep >= 1 ? "#6EE7B7" : "#64748B"} fontSize="10" fontWeight="600">
              {currentStep === 3 ? "Recharging Leaking Cells" : "ΔV Charge Amp"}
            </text>
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(595, ${160 + i * 45})`}>
                <rect x="0" y="0" width="130" height="26" rx="5" fill={currentStep >= 1 ? "#047857" : "#1E293B"} />
                <text x="65" y="17" textAnchor="middle" fill="#E2E8F0" fontSize="9" fontWeight="600">Bitline {i} (1.1V Logic)</text>
              </g>
            ))}
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 9. Lithium-Ion Battery (De-intercalation -> Circuit -> Migration -> Intercalation)
      // ────────────────────────────────────────────────────────
      case "battery":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* External Circuit Wire (Top) */}
            <path
              d="M 170 100 L 170 55 L 630 55 L 630 100"
              fill="none"
              stroke={currentStep === 1 ? "#F59E0B" : "#334155"}
              strokeWidth={currentStep === 1 ? 3.5 : 2}
              strokeDasharray={currentStep === 1 ? "6 4" : "none"}
            />
            {/* Electron movement along top circuit */}
            {currentStep === 1 && isPlaying && (
              <motion.circle
                r="6"
                fill="#FBBF24"
                animate={{ cx: [170, 170, 400, 630, 630], cy: [100, 55, 55, 55, 100] }}
                transition={{ duration: pulseDuration * 0.8, repeat: Infinity, ease: "linear" }}
              />
            )}
            <text x="400" y="45" textAnchor="middle" fill={currentStep === 1 ? "#FDE68A" : "#64748B"} fontSize="11" fontWeight="700">
              2. External Electron Circuit (e- Flow Powers Phone)
            </text>

            {/* Step 1: Anode (-) Graphite */}
            <rect
              x="80"
              y="100"
              width="180"
              height="260"
              rx="10"
              fill={currentStep === 0 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 0 ? "#38BDF8" : "#334155"}
              strokeWidth={currentStep === 0 ? 3 : 1.5}
            />
            <text x="170" y="140" textAnchor="middle" fill="#E2E8F0" fontSize="14" fontWeight="700">1. Anode (-)</text>
            <text x="170" y="165" textAnchor="middle" fill={currentStep === 0 ? "#A5B4FC" : "#94A3B8"} fontSize="11">Graphite Layers (LiC6)</text>
            <text x="170" y="195" textAnchor="middle" fill="#38BDF8" fontSize="10">De-intercalation (Li+)</text>

            {/* Step 3: Separator & Li+ Shuttle */}
            <rect
              x="305"
              y="100"
              width="190"
              height="260"
              rx="10"
              fill={currentStep === 2 ? "#312E81" : "#030712"}
              stroke={currentStep === 2 ? "#F59E0B" : "#94A3B8"}
              strokeDasharray="6 4"
              strokeWidth={currentStep === 2 ? 3 : 2}
            />
            <text x="400" y="140" textAnchor="middle" fill="#E2E8F0" fontSize="14" fontWeight="700">3. Separator</text>
            <text x="400" y="165" textAnchor="middle" fill={currentStep === 2 ? "#FDE68A" : "#F59E0B"} fontSize="11">Electrolyte Ion Migration</text>

            {/* Li+ Ion Shuttling Particles */}
            {isPlaying &&
              [0, 1, 2, 3].map((i) => (
                <motion.circle
                  key={i}
                  cx={355}
                  cy={195 + i * 40}
                  r="9"
                  fill="#F59E0B"
                  animate={
                    currentStep === 2
                      ? { cx: [230, 400, 560] }
                      : { cx: [340, 460, 340] }
                  }
                  transition={{ duration: pulseDuration, repeat: Infinity, delay: i * 0.25 }}
                />
              ))}

            {/* Step 4: Cathode (+) Metal Oxide */}
            <rect
              x="540"
              y="100"
              width="180"
              height="260"
              rx="10"
              fill={currentStep === 3 ? "#064E3B" : "#0F172A"}
              stroke={currentStep === 3 ? "#10B981" : "#334155"}
              strokeWidth={currentStep === 3 ? 3 : 1.5}
            />
            <text x="630" y="140" textAnchor="middle" fill="#E2E8F0" fontSize="14" fontWeight="700">4. Cathode (+)</text>
            <text x="630" y="165" textAnchor="middle" fill={currentStep === 3 ? "#6EE7B7" : "#94A3B8"} fontSize="11">Metal Oxide (LiCoO2)</text>
            <text x="630" y="195" textAnchor="middle" fill="#34D399" fontSize="10">Cathode Intercalation</text>
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 10. Capacitive Touchscreen (Baseline -> Finger Touch -> ADC -> Centroid DSP)
      // ────────────────────────────────────────────────────────
      case "touchscreen":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Transparent ITO Screen Area */}
            <rect
              x="100"
              y="70"
              width="440"
              height="300"
              rx="14"
              fill="#030712"
              stroke={currentStep === 0 ? "#818CF8" : "#38BDF8"}
              strokeWidth={currentStep === 0 ? 3 : 2}
            />
            <text x="320" y="105" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">
              {currentStep === 0 ? "1. Baseline ITO Grid Charge" : "Capacitive ITO Sensor Grid"}
            </text>

            {/* Horizontal Drive Lines */}
            {[0, 1, 2, 3].map((r) => (
              <line key={r} x1="130" y1={155 + r * 55} x2="510" y2={155 + r * 55} stroke={currentStep === 0 ? "#818CF8" : "#0284C7"} strokeWidth="2" strokeOpacity="0.7" />
            ))}

            {/* Vertical Sense Lines */}
            {[0, 1, 2, 3, 4].map((c) => (
              <line key={c} x1={160 + c * 75} y1="135" x2={160 + c * 75} y2="340" stroke={currentStep === 2 ? "#38BDF8" : "#0284C7"} strokeWidth="2" strokeOpacity="0.7" />
            ))}

            {/* Step 2: Finger Touch & Electric Field Distortion */}
            {currentStep >= 1 && (
              <g>
                <circle cx="310" cy="210" r="34" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
                <circle cx="310" cy="210" r="18" fill="#F59E0B" fillOpacity="0.4" stroke="#FDE68A" strokeWidth="2" />
                <circle cx="310" cy="210" r="7" fill="#FFFFFF" />
                <text x="310" y="260" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="700">2. Touch ΔC (-15%)</text>
              </g>
            )}

            {/* Step 3 & 4: Touch Controller DSP Box */}
            <rect
              x="570"
              y="70"
              width="180"
              height="300"
              rx="12"
              fill={currentStep === 3 ? "#064E3B" : currentStep === 2 ? "#1E1B4B" : "#0F172A"}
              stroke={currentStep === 3 ? "#10B981" : currentStep === 2 ? "#818CF8" : "#334155"}
              strokeWidth={currentStep >= 2 ? 3 : 1.5}
            />
            <text x="660" y="105" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700">Touch Controller</text>
            <rect x="585" y="130" width="150" height="70" rx="8" fill={currentStep === 2 ? "#312E81" : "#1E293B"} stroke={currentStep === 2 ? "#38BDF8" : "none"} />
            <text x="660" y="155" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="700">3. ADC Matrix Scan</text>
            <text x="660" y="178" textAnchor="middle" fill={currentStep === 2 ? "#38BDF8" : "#94A3B8"} fontSize="9">240 Hz Scanning Rate</text>

            <rect x="585" y="225" width="150" height="90" rx="8" fill={currentStep === 3 ? "#047857" : "#1E293B"} stroke={currentStep === 3 ? "#34D399" : "none"} />
            <text x="660" y="250" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="700">4. Centroid Math</text>
            <text x="660" y="272" textAnchor="middle" fill={currentStep === 3 ? "#6EE7B7" : "#94A3B8"} fontSize="9">Gaussian (X:310, Y:210)</text>
            <text x="660" y="295" textAnchor="middle" fill="#A7F3D0" fontSize="9">Pointer Event Dispatched</text>
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 11. AI Neural Network (Embedding -> Forward Prop -> Loss -> Backprop)
      // ────────────────────────────────────────────────────────
      case "ai-neural":
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />

            {/* Connection Lines */}
            {[100, 180, 260, 340].map((y1) =>
              [80, 140, 200, 260, 320, 380].map((y2) => (
                <line
                  key={`${y1}-${y2}`}
                  x1="180"
                  y1={y1}
                  x2="400"
                  y2={y2}
                  stroke={currentStep === 3 ? "#EC4899" : currentStep === 1 ? "#818CF8" : "#6366F1"}
                  strokeOpacity={currentStep === 1 || currentStep === 3 ? 0.7 : 0.25}
                  strokeWidth={currentStep === 1 || currentStep === 3 ? 2 : 1}
                  strokeDasharray={currentStep === 3 ? "4 3" : "none"}
                />
              ))
            )}
            {[80, 140, 200, 260, 320, 380].map((y1) =>
              [160, 280].map((y2) => (
                <line
                  key={`${y1}-${y2}`}
                  x1="400"
                  y1={y1}
                  x2="620"
                  y2={y2}
                  stroke={currentStep === 3 ? "#F43F5E" : currentStep === 1 ? "#A855F7" : "#EC4899"}
                  strokeOpacity={currentStep === 1 || currentStep === 3 ? 0.75 : 0.3}
                  strokeWidth={currentStep === 1 || currentStep === 3 ? 2 : 1}
                  strokeDasharray={currentStep === 3 ? "4 3" : "none"}
                />
              ))
            )}

            {/* Step 1: Input Layer */}
            <text x="180" y="65" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">1. Inputs (X)</text>
            {[100, 180, 260, 340].map((y, i) => (
              <g key={i} transform={`translate(180, ${y})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={currentStep === 0 ? 22 : 18}
                  fill={currentStep === 0 ? "#312E81" : "#1E1B4B"}
                  stroke={currentStep === 0 ? "#818CF8" : "#4F46E5"}
                  strokeWidth={currentStep === 0 ? 3 : 2}
                />
                <text x="0" y="5" textAnchor="middle" fill="#E0E7FF" fontSize="10" fontWeight="700">x{i + 1}</text>
              </g>
            ))}

            {/* Step 2: Hidden Layers (Forward Pass) */}
            <text x="400" y="50" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">2. Hidden Layer (ReLU)</text>
            {[80, 140, 200, 260, 320, 380].map((y, i) => (
              <g key={i} transform={`translate(400, ${y})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={currentStep === 1 ? 23 : 19}
                  fill={currentStep === 1 ? "#581C87" : "#4C1D95"}
                  stroke={currentStep === 1 ? "#C084FC" : "#A855F7"}
                  strokeWidth={currentStep === 1 ? 3 : 2}
                />
                <text x="0" y="5" textAnchor="middle" fill="#F3E8FF" fontSize="10" fontWeight="700">h{i + 1}</text>
              </g>
            ))}

            {/* Step 3: Output Prediction & Loss */}
            <text x="620" y="120" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">3. Loss / Prediction</text>
            {[160, 280].map((y, i) => (
              <g key={i} transform={`translate(620, ${y})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={currentStep === 2 ? 25 : 21}
                  fill={currentStep === 2 ? "#9F1239" : "#831843"}
                  stroke={currentStep === 2 ? "#FB7185" : "#F43F5E"}
                  strokeWidth={currentStep === 2 ? 3.5 : 2.5}
                />
                <text x="0" y="5" textAnchor="middle" fill="#FFE4E6" fontSize="11" fontWeight="700">y{i + 1}</text>
              </g>
            ))}
            {currentStep === 2 && (
              <text x="620" y="345" textAnchor="middle" fill="#FB7185" fontSize="12" fontWeight="700">Cross-Entropy Loss (L)</text>
            )}

            {/* Step 4: Backpropagation Indicator */}
            {currentStep === 3 && (
              <g>
                <rect x="250" y="400" width="300" height="30" rx="6" fill="#881337" stroke="#F43F5E" />
                <text x="400" y="420" textAnchor="middle" fill="#FFE4E6" fontSize="11" fontWeight="700">
                  4. Backprop: W_new = W_old - η · ∇L
                </text>
              </g>
            )}
          </svg>
        );

      // ────────────────────────────────────────────────────────
      // 12. GPS (Satellite Trilateration & Relativity)
      // ────────────────────────────────────────────────────────
      case "gps": {
        const sats = [
          { name: "SV-01 (MEO)", x: 130, y: 70, color: "#38BDF8" },
          { name: "SV-14 (MEO)", x: 400, y: 55, color: "#818CF8" },
          { name: "SV-23 (MEO)", x: 670, y: 70, color: "#38BDF8" },
          { name: "SV-09 (Clock Ref)", x: 580, y: 150, color: "#F59E0B" },
        ];
        const userPos = { x: 380, y: 320 };

        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#040814" stroke="#1E293B" strokeWidth="2" />
            {/* Earth Surface Arc */}
            <path d="M 50,420 Q 400,280 750,420" fill="#0B1528" stroke="#1E3A8A" strokeWidth="2.5" />
            <text x="400" y="405" fill="#3B82F6" fontSize="12" fontWeight="700" textAnchor="middle">EARTH SURFACE (GEOID WGS84)</text>

            {/* Orbit Arc */}
            <path d="M 80,110 Q 400,20 720,110" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Satellites */}
            {sats.map((sat, i) => {
              const isActive = (currentStep === 0) || (currentStep === 1) || (currentStep === 2 && i < 3) || (currentStep === 3);
              return (
                <g key={sat.name} transform={`translate(${sat.x}, ${sat.y})`}>
                  {/* Solar Panels */}
                  <rect x="-35" y="-6" width="22" height="12" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                  <rect x="13" y="-6" width="22" height="12" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                  {/* Sat Body */}
                  <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#0F172A" stroke={sat.color} strokeWidth={2} />
                  <circle cx="0" cy="0" r="4" fill={isActive ? sat.color : "#475569"} />
                  <text x="0" y="-18" fill="#E2E8F0" fontSize="9" fontWeight="700" textAnchor="middle">{sat.name}</text>
                  <text x="0" y="24" fill="#94A3B8" fontSize="7.5" textAnchor="middle">10.23 MHz Cs Clock</text>

                  {/* Radio Beams to User */}
                  {(currentStep >= 1 && (i < 3 || currentStep === 3)) && (
                    <motion.line
                      x1={0}
                      y1={0}
                      x2={userPos.x - sat.x}
                      y2={userPos.y - sat.y}
                      stroke={sat.color}
                      strokeWidth={currentStep === 3 && i === 3 ? 3 : 1.8}
                      strokeDasharray="5 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: pulseDuration }}
                    />
                  )}
                </g>
              );
            })}

            {/* Range Spheres / Ranging Rings around Sats */}
            {currentStep >= 1 && sats.slice(0, currentStep >= 2 ? 3 : 2).map((sat, i) => (
              <motion.circle
                key={`ring-${i}`}
                cx={sat.x}
                cy={sat.y}
                r={160 + i * 25}
                fill="none"
                stroke={sat.color}
                strokeWidth="1.2"
                strokeDasharray="4 3"
                strokeOpacity="0.4"
                initial={{ scale: 0.2 }}
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: pulseDuration * 2 }}
              />
            ))}

            {/* User Smartphone Receiver Pin */}
            <g transform={`translate(${userPos.x}, ${userPos.y})`}>
              <circle cx="0" cy="0" r="18" fill="#0284C7" fillOpacity={currentStep >= 2 ? 0.3 : 0.1} stroke="#38BDF8" strokeWidth={2} />
              <circle cx="0" cy="0" r="6" fill="#38BDF8" />
              {currentStep === 3 && (
                <motion.circle
                  cx="0"
                  cy="0"
                  r="28"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              {/* Device Box */}
              <rect x="-14" y="16" width="28" height="42" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="0" cy="50" r="2.5" fill="#38BDF8" />
              <text x="0" y="72" fill="#38BDF8" fontSize="10" fontWeight="800" textAnchor="middle">
                {currentStep === 3 ? "FIX LOCKED (±0.8m)" : "GNSS L1/L5 RX"}
              </text>
              {currentStep === 3 && (
                <text x="0" y="85" fill="#34D399" fontSize="8" fontWeight="700" textAnchor="middle">
                  -6.2088° S, 106.8456° E (Δt=0)
                </text>
              )}
            </g>

            {/* HUD Relativity & Math Box */}
            <rect x="40" y="320" width="220" height="90" rx="8" fill="#0B132B" stroke="#0284C7" strokeWidth="1.5" />
            <text x="55" y="342" fill="#38BDF8" fontSize="10" fontWeight="700">EINSTEIN RELATIVITY CORR.</text>
            <text x="55" y="360" fill="#E2E8F0" fontSize="8.5">Special Rel: -7.2 μs/day (speed)</text>
            <text x="55" y="375" fill="#E2E8F0" fontSize="8.5">General Rel: +45.9 μs/day (gravity)</text>
            <text x="55" y="395" fill="#FDE68A" fontSize="9" fontWeight="700">Net Shift: +38.7 μs/day (11 km drift)</text>
          </svg>
        );
      }

      // ────────────────────────────────────────────────────────
      // 13. ANC (Active Noise Cancellation)
      // ────────────────────────────────────────────────────────
      case "anc": {
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#050B14" stroke="#1E293B" strokeWidth="2" />

            {/* 1. External Noise Generator Area (Left) */}
            <g transform="translate(60, 60)">
              <rect x="0" y="0" width="160" height="150" rx="10" fill="#1E1215" stroke="#EF4444" strokeWidth="2" />
              <text x="80" y="28" fill="#FCA5A5" fontSize="11" fontWeight="800" textAnchor="middle">NOISE SOURCE</text>
              <text x="80" y="46" fill="#EF4444" fontSize="8.5" textAnchor="middle">Airplane Jet Engine (120 Hz)</text>
              
              {/* Noise Sine Wave */}
              <motion.path
                d="M 15,100 Q 35,60 55,100 T 95,100 T 135,100"
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
                animate={currentStep >= 0 ? { x: [0, 20, 0] } : {}}
                transition={{ repeat: Infinity, duration: pulseDuration }}
              />
              <text x="80" y="135" fill="#F87171" fontSize="9" fontWeight="700" textAnchor="middle">+A (Ambient Noise)</text>
            </g>

            {/* Sound Wave Traveling to Headphone */}
            <motion.path
              d="M 225,135 L 340,135"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />

            {/* 2. Headphone & DSP Inversion Unit (Center) */}
            <g transform="translate(350, 45)">
              {/* Earcup Housing */}
              <rect x="0" y="0" width="160" height="340" rx="20" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
              <text x="80" y="32" fill="#38BDF8" fontSize="12" fontWeight="800" textAnchor="middle">ANC HEADPHONE</text>

              {/* Feedforward Mic */}
              <g transform="translate(10, 80)">
                <circle cx="0" cy="0" r="10" fill="#1E293B" stroke={currentStep >= 0 ? "#EF4444" : "#64748B"} strokeWidth="2" />
                <circle cx="0" cy="0" r="4" fill="#EF4444" />
                <text x="16" y="4" fill="#E2E8F0" fontSize="8" fontWeight="700">Feedforward Mic</text>
              </g>

              {/* DSP Engine */}
              <rect x="25" y="120" width="110" height="90" rx="8" fill="#1E1B4B" stroke={currentStep >= 1 ? "#A855F7" : "#475569"} strokeWidth="2" />
              <text x="80" y="145" fill="#C084FC" fontSize="10" fontWeight="800" textAnchor="middle">DSP INVERTER</text>
              <text x="80" y="162" fill="#93C5FD" fontSize="8" textAnchor="middle">Phase Shift: 180°</text>
              <text x="80" y="177" fill="#34D399" fontSize="8" textAnchor="middle">Latency: 12 μs</text>
              <text x="80" y="195" fill="#FDE68A" fontSize="7.5" textAnchor="middle">FxLMS Adaptive</text>

              {/* Acoustic Speaker Driver */}
              <g transform="translate(135, 165)">
                <polygon points="0,-35 20,-20 20,20 0,35" fill="#059669" stroke="#34D399" strokeWidth="2" />
                <text x="-5" y="52" fill="#34D399" fontSize="8" fontWeight="700" textAnchor="middle">Speaker Driver</text>
              </g>

              {/* Feedback Mic */}
              <g transform="translate(145, 250)">
                <circle cx="0" cy="0" r="8" fill="#1E293B" stroke={currentStep >= 2 ? "#10B981" : "#64748B"} strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="#10B981" />
                <text x="-55" y="4" fill="#A7F3D0" fontSize="7.5" fontWeight="600">Feedback Mic</text>
              </g>
            </g>

            {/* 3. Anti-Phase Wave & Ear Canal (Right) */}
            <g transform="translate(540, 60)">
              <rect x="0" y="0" width="220" height="310" rx="12" fill="#0B132B" stroke="#10B981" strokeWidth="2" />
              <text x="110" y="30" fill="#34D399" fontSize="12" fontWeight="800" textAnchor="middle">EAR CANAL &amp; EARDRUM</text>

              {/* Superimposed Waves Demonstration */}
              {/* Noise (+A) */}
              <text x="25" y="70" fill="#F87171" fontSize="9" fontWeight="700">Incoming Noise (+A):</text>
              <path d="M 25,100 Q 55,70 85,100 T 145,100 T 195,100" fill="none" stroke="#EF4444" strokeWidth="2" />

              {/* Anti-Phase (-A) */}
              <text x="25" y="130" fill="#93C5FD" fontSize="9" fontWeight="700">Anti-Phase Generated (-A):</text>
              <path d="M 25,160 Q 55,190 85,160 T 145,160 T 195,160" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" />

              {/* Destructive Interference Sum Result */}
              <rect x="15" y="195" width="190" height="95" rx="8" fill="#064E3B" stroke="#34D399" strokeWidth={currentStep === 3 ? 2.5 : 1} />
              <text x="110" y="218" fill="#A7F3D0" fontSize="10" fontWeight="800" textAnchor="middle">NET SOUND PRESSURE</text>
              <line x1="30" y1="250" x2="190" y2="250" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
              <text x="110" y="275" fill="#6EE7B7" fontSize="11" fontWeight="800" textAnchor="middle">
                {currentStep === 3 ? "0 dB (SILENCE: +A - A = 0)" : "Destructive Interference"}
              </text>
            </g>
          </svg>
        );
      }

      // ────────────────────────────────────────────────────────
      // 14. OLED & MicroLED (Self-Emissive Subpixels)
      // ────────────────────────────────────────────────────────
      case "oled": {
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#030712" stroke="#1E293B" strokeWidth="2" />

            {/* Title HUD */}
            <text x="50" y="55" fill="#F472B6" fontSize="14" fontWeight="800">OLED SUBPIXEL CROSS-SECTION (200nm Stack)</text>
            <text x="50" y="75" fill="#94A3B8" fontSize="10">True Black &amp; Self-Emissive Electroluminescence</text>

            {/* Layers Labels on Left */}
            <g transform="translate(45, 100)">
              <text x="0" y="20" fill="#94A3B8" fontSize="9" fontWeight="700">Glass &amp; Polarizer</text>
              <text x="0" y="60" fill="#CBD5E1" fontSize="9" fontWeight="700">Cathode (Mg/Ag)</text>
              <text x="0" y="100" fill="#60A5FA" fontSize="9" fontWeight="700">ETL (Electron Trans.)</text>
              <text x="0" y="150" fill="#F472B6" fontSize="10" fontWeight="800">EML (Emissive Layer)</text>
              <text x="0" y="200" fill="#F87171" fontSize="9" fontWeight="700">HTL (Hole Trans.)</text>
              <text x="0" y="240" fill="#FDE68A" fontSize="9" fontWeight="700">Anode (ITO Transp.)</text>
              <text x="0" y="280" fill="#34D399" fontSize="9" fontWeight="700">LTPO TFT Backplane</text>
            </g>

            {/* 3 Subpixels (Red, Green, Blue) and 1 Off (True Black) */}
            {[
              { label: "RED (620nm)", color: "#EF4444", bg: "#7F1D1D", x: 200, state: "ON" },
              { label: "GREEN (530nm)", color: "#22C55E", bg: "#14532D", x: 340, state: "ON" },
              { label: "BLUE (460nm)", color: "#3B82F6", bg: "#1E3A8A", x: 480, state: "ON" },
              { label: "TRUE BLACK", color: "#64748B", bg: "#020617", x: 620, state: "OFF (0V)" },
            ].map((sub) => {
              const isBlack = sub.state.includes("OFF");
              return (
                <g key={sub.label} transform={`translate(${sub.x}, 90)`}>
                  {/* Outer Subpixel Frame */}
                  <rect x="0" y="0" width="115" height="300" rx="8" fill="#0B132B" stroke={isBlack ? "#334155" : sub.color} strokeWidth={isBlack ? 1.5 : 2.5} />
                  <text x="57" y="20" fill={sub.color} fontSize="9" fontWeight="800" textAnchor="middle">{sub.label}</text>

                  {/* Glass Top */}
                  <rect x="8" y="28" width="99" height="16" rx="2" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                  
                  {/* Cathode */}
                  <rect x="8" y="48" width="99" height="18" fill="#334155" stroke="#64748B" strokeWidth="1" />
                  <text x="57" y="61" fill="#E2E8F0" fontSize="7.5" textAnchor="middle">Cathode (-)</text>

                  {/* ETL */}
                  <rect x="8" y="70" width="99" height="32" fill="#1E3A8A" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="1" />
                  {!isBlack && (
                    <motion.circle
                      cx={57}
                      cy={86}
                      r="4"
                      fill="#60A5FA"
                      animate={{ y: [0, 25, 0] }}
                      transition={{ repeat: Infinity, duration: pulseDuration }}
                    />
                  )}
                  <text x="57" y="89" fill="#93C5FD" fontSize="7" textAnchor="middle">e- Injection</text>

                  {/* EML Organic Emissive Layer */}
                  <rect
                    x="8"
                    y="106"
                    width="99"
                    height="65"
                    fill={isBlack ? "#000000" : sub.bg}
                    stroke={isBlack ? "#1E293B" : sub.color}
                    strokeWidth="2"
                  />
                  {!isBlack && currentStep >= 2 && (
                    <motion.circle
                      cx={57}
                      cy={138}
                      r="14"
                      fill={sub.color}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                  )}
                  <text x="57" y="142" fill="#FFFFFF" fontSize="8" fontWeight="800" textAnchor="middle">
                    {isBlack ? "0 PHOTONS" : "EXCITON (hν)"}
                  </text>

                  {/* HTL */}
                  <rect x="8" y="175" width="99" height="32" fill="#7F1D1D" fillOpacity="0.4" stroke="#EF4444" strokeWidth="1" />
                  {!isBlack && (
                    <motion.circle
                      cx={57}
                      cy={191}
                      r="4"
                      fill="#F87171"
                      animate={{ y: [0, -25, 0] }}
                      transition={{ repeat: Infinity, duration: pulseDuration }}
                    />
                  )}
                  <text x="57" y="194" fill="#FCA5A5" fontSize="7" textAnchor="middle">h+ Injection</text>

                  {/* Anode */}
                  <rect x="8" y="211" width="99" height="18" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
                  <text x="57" y="224" fill="#FDE68A" fontSize="7.5" textAnchor="middle">Anode (+) ITO</text>

                  {/* TFT Circuit */}
                  <rect x="8" y="233" width="99" height="35" rx="3" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
                  <text x="57" y="250" fill="#A7F3D0" fontSize="7.5" fontWeight="700" textAnchor="middle">LTPO Gate: {isBlack ? "0.0 V" : "3.3 V"}</text>
                  <text x="57" y="262" fill="#6EE7B7" fontSize="7" textAnchor="middle">{isBlack ? "Current: 0 μA" : "Current: 1.4 μA"}</text>

                  {/* Emitted Light Beam (Going Up) */}
                  {!isBlack && currentStep >= 2 && (
                    <motion.polygon
                      points="15,-10 100,-10 80,-35 35,-35"
                      fill={sub.color}
                      fillOpacity="0.5"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        );
      }

      // ────────────────────────────────────────────────────────
      // 15. Face ID (Structured Light 3D Mesh)
      // ────────────────────────────────────────────────────────
      case "face-id": {
        const dotCoords = [
          [520, 140], [550, 135], [580, 140],
          [500, 175], [535, 170], [565, 170], [600, 175],
          [520, 210], [550, 205], [580, 210],
          [530, 245], [550, 250], [570, 245],
          [510, 280], [550, 290], [590, 280],
        ];

        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#050814" stroke="#1E293B" strokeWidth="2" />

            {/* Smartphone Notch Hardware (Left) */}
            <g transform="translate(60, 90)">
              <rect x="0" y="0" width="220" height="260" rx="16" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <text x="110" y="32" fill="#C084FC" fontSize="12" fontWeight="800" textAnchor="middle">TRUEDEPTH SENSOR ARRAY</text>

              {/* 1. Flood Illuminator */}
              <rect x="20" y="55" width="180" height="40" rx="6" fill="#1E1B4B" stroke={currentStep >= 0 ? "#EF4444" : "#475569"} strokeWidth="1.5" />
              <circle cx="45" cy="75" r="8" fill="#EF4444" />
              <text x="65" y="79" fill="#FCA5A5" fontSize="9" fontWeight="700">1. Flood Illuminator (940nm)</text>

              {/* 2. VCSEL Dot Projector */}
              <rect x="20" y="105" width="180" height="45" rx="6" fill="#1E1B4B" stroke={currentStep >= 1 ? "#A855F7" : "#475569"} strokeWidth={currentStep >= 1 ? 2 : 1} />
              <circle cx="45" cy="127" r="8" fill="#A855F7" />
              <text x="65" y="125" fill="#E9D5FF" fontSize="9" fontWeight="700">2. VCSEL Dot Projector</text>
              <text x="65" y="140" fill="#C084FC" fontSize="7.5">30,000 IR Dots via DOE</text>

              {/* 3. Infrared Camera */}
              <rect x="20" y="160" width="180" height="40" rx="6" fill="#1E1B4B" stroke={currentStep >= 2 ? "#38BDF8" : "#475569"} strokeWidth="1.5" />
              <circle cx="45" cy="180" r="8" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="65" y="184" fill="#BAE6FD" fontSize="9" fontWeight="700">3. Infrared Sensor Camera</text>

              {/* 4. Secure Enclave / Neural Engine */}
              <rect x="20" y="210" width="180" height="36" rx="6" fill="#064E3B" stroke={currentStep >= 3 ? "#10B981" : "#475569"} strokeWidth={currentStep >= 3 ? 2 : 1} />
              <text x="110" y="232" fill="#A7F3D0" fontSize="9" fontWeight="800" textAnchor="middle">
                {currentStep === 3 ? "4. AUTHENTICATED ✓" : "4. Neural Engine Matching"}
              </text>
            </g>

            {/* Projected Structured Light Beams */}
            {currentStep >= 1 && (
              <g>
                {dotCoords.map(([dx, dy], i) => (
                  <motion.line
                    key={i}
                    x1={165}
                    y1={217}
                    x2={dx}
                    y2={dy}
                    stroke="#C084FC"
                    strokeWidth="1.2"
                    strokeDasharray="4 3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: pulseDuration * 0.7 }}
                  />
                ))}
              </g>
            )}

            {/* 3D Human Face Mesh Simulation (Right) */}
            <g transform="translate(360, 60)">
              <rect x="0" y="0" width="360" height="320" rx="16" fill="#070D1E" stroke="#6366F1" strokeWidth="2" />
              <text x="180" y="32" fill="#818CF8" fontSize="12" fontWeight="800" textAnchor="middle">3D FACIAL DEPTH MESH</text>

              {/* Head Contour Outline */}
              <path
                d="M 110,90 Q 180,50 250,90 Q 280,180 250,250 Q 180,290 110,250 Q 80,180 110,90"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeDasharray="5 5"
              />

              {/* 3D Wireframe Curves */}
              <path d="M 130,130 Q 180,160 230,130" fill="none" stroke="#6366F1" strokeWidth="1.5" />
              <path d="M 120,180 Q 180,220 240,180" fill="none" stroke="#6366F1" strokeWidth="1.5" />
              <path d="M 140,240 Q 180,260 220,240" fill="none" stroke="#6366F1" strokeWidth="1.5" />
              {/* Nose Bridge 3D Vector */}
              <line x1="180" y1="120" x2="180" y2="200" stroke="#A855F7" strokeWidth="2" />

              {/* 30,000 IR Dots on Face */}
              {currentStep >= 1 && dotCoords.map(([gx, gy], i) => (
                <g key={`dot-${i}`} transform={`translate(${gx - 360}, ${gy - 60})`}>
                  <circle cx="0" cy="0" r={currentStep >= 2 ? 4 : 3} fill="#C084FC" />
                  {currentStep >= 2 && (
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="8"
                      fill="none"
                      stroke="#E879F9"
                      strokeWidth="1"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                  )}
                </g>
              ))}

              {/* Disparity & Depth Equation Badge */}
              <rect x="30" y="270" width="300" height="35" rx="6" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1" />
              <text x="180" y="292" fill="#E0E7FF" fontSize="9" fontWeight="700" textAnchor="middle">
                Depth Triangulation: Z = (f · B) / Δd | Anti-Spoofing 3D: PASS
              </text>
            </g>
          </svg>
        );
      }

      // ────────────────────────────────────────────────────────
      // 16. NFC (13.56 MHz Magnetic Inductive Coupling)
      // ────────────────────────────────────────────────────────
      case "nfc": {
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#060A14" stroke="#1E293B" strokeWidth="2" />

            {/* Smartphone (Left) */}
            <g transform="translate(60, 70)">
              <rect x="0" y="0" width="220" height="300" rx="16" fill="#0B132B" stroke="#38BDF8" strokeWidth="2.5" />
              <text x="110" y="32" fill="#38BDF8" fontSize="12" fontWeight="800" textAnchor="middle">SMARTPHONE NFC</text>

              {/* Copper Loop Antenna */}
              <rect x="25" y="55" width="170" height="140" rx="10" fill="none" stroke="#F59E0B" strokeWidth="3" />
              <rect x="35" y="65" width="150" height="120" rx="8" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="6 3" />
              <text x="110" y="125" fill="#FDE68A" fontSize="9" fontWeight="700" textAnchor="middle">Loop Antenna Coil</text>
              <text x="110" y="140" fill="#F59E0B" fontSize="8" textAnchor="middle">Inductive LC Resonance</text>

              {/* Secure Element (SE) */}
              <rect x="35" y="210" width="150" height="65" rx="8" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
              <text x="110" y="235" fill="#A5B4FC" fontSize="9.5" fontWeight="800" textAnchor="middle">EAL6+ SECURE ELEMENT</text>
              <text x="110" y="252" fill="#CBD5E1" fontSize="8" textAnchor="middle">EMV Token (DAN): **** 8821</text>
              <text x="110" y="265" fill="#34D399" fontSize="8" textAnchor="middle">One-Time ARQC Cryptogram</text>
            </g>

            {/* Magnetic Coupling Flux Lines (Center) */}
            <g transform="translate(300, 110)">
              <text x="100" y="20" fill="#F59E0B" fontSize="11" fontWeight="800" textAnchor="middle">NEAR FIELD INDUCTION</text>
              <text x="100" y="38" fill="#94A3B8" fontSize="8.5" textAnchor="middle">13.56 MHz (d &lt; 4 cm)</text>

              {[0, 1, 2, 3].map((idx) => (
                <motion.path
                  key={idx}
                  d={`M 10,${60 + idx * 35} Q 100,${45 + idx * 35} 190,${60 + idx * 35}`}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2 }}
                />
              ))}

              <rect x="25" y="200" width="150" height="45" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
              <text x="100" y="218" fill="#FDE68A" fontSize="8.5" fontWeight="700" textAnchor="middle">Load Modulation</text>
              <text x="100" y="233" fill="#CBD5E1" fontSize="7.5" textAnchor="middle">ISO/IEC 14443 Type A (424 kbps)</text>
            </g>

            {/* POS Payment Terminal Reader (Right) */}
            <g transform="translate(520, 70)">
              <rect x="0" y="0" width="220" height="300" rx="16" fill="#0F172A" stroke="#10B981" strokeWidth="2.5" />
              <text x="110" y="32" fill="#34D399" fontSize="12" fontWeight="800" textAnchor="middle">POS PAYMENT READER</text>

              {/* Reader Screen */}
              <rect x="25" y="55" width="170" height="90" rx="8" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
              <text x="110" y="85" fill="#A7F3D0" fontSize="12" fontWeight="800" textAnchor="middle">
                {currentStep === 3 ? "PAYMENT APPROVED" : "HOLD NEAR READER"}
              </text>
              <text x="110" y="105" fill="#6EE7B7" fontSize="14" fontWeight="800" textAnchor="middle">
                {currentStep === 3 ? "$ 14.50 ✓" : "$ 14.50"}
              </text>
              <text x="110" y="130" fill="#A7F3D0" fontSize="8" textAnchor="middle">Contactless EMVCo</text>

              {/* Reader Antenna Coil */}
              <rect x="25" y="160" width="170" height="115" rx="8" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
              <circle cx="110" cy="205" r="24" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
              <text x="110" y="210" fill="#34D399" fontSize="16" fontWeight="800" textAnchor="middle">((( • )))</text>
              <text x="110" y="255" fill="#94A3B8" fontSize="8" textAnchor="middle">13.56 MHz Carrier Radiator</text>
            </g>
          </svg>
        );
      }

      // ────────────────────────────────────────────────────────
      // 17. Transistor FinFET/GAAFET & EUV Lithography
      // ────────────────────────────────────────────────────────
      case "transistor-euv": {
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#060914" stroke="#1E293B" strokeWidth="2" />

            {/* Left: EUV Plasma Source & Optics (Steps 1 & 2) */}
            <g transform="translate(45, 60)">
              <rect x="0" y="0" width="220" height="320" rx="12" fill="#0F172A" stroke="#818CF8" strokeWidth="2" />
              <text x="110" y="30" fill="#C084FC" fontSize="11" fontWeight="800" textAnchor="middle">13.5nm EUV SOURCE</text>

              {/* CO2 Laser Chamber */}
              <rect x="20" y="50" width="180" height="70" rx="6" fill="#1E1B4B" stroke={currentStep >= 0 ? "#E879F9" : "#475569"} strokeWidth={1.5} />
              <circle cx="110" cy="85" r={currentStep === 0 ? 16 : 8} fill="#E879F9" fillOpacity={currentStep === 0 ? 0.6 : 0.3} />
              <circle cx="110" cy="85" r="4" fill="#FFFFFF" />
              <text x="110" y="108" fill="#FDE68A" fontSize="8" fontWeight="700" textAnchor="middle">50kHz Tin Droplet Plasma (200,000°C)</text>

              {/* Bragg Multi-layer Reflective Mirrors */}
              <path d="M 30,150 Q 110,135 190,150" stroke={currentStep >= 1 ? "#38BDF8" : "#475569"} strokeWidth="4" fill="none" />
              <text x="110" y="172" fill="#93C5FD" fontSize="8.5" fontWeight="700" textAnchor="middle">Mo/Si Bragg Mirror (40 Layers)</text>
              <path d="M 40,205 Q 110,225 180,205" stroke={currentStep >= 1 ? "#38BDF8" : "#475569"} strokeWidth="4" fill="none" />

              {/* Reticle / Photomask */}
              <rect x="40" y="240" width="140" height="24" rx="3" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="110" y="256" fill="#FDE68A" fontSize="8.5" fontWeight="800" textAnchor="middle">3nm Circuit Mask</text>

              {/* Light Ray Path */}
              {currentStep >= 1 && (
                <motion.path
                  d="M 110,85 L 110,145 L 70,205 L 110,240 L 110,310"
                  stroke="#E879F9"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </g>

            {/* Right: 3nm Gate-All-Around (GAAFET) Nanosheet (Steps 3 & 4) */}
            <g transform="translate(300, 60)">
              <rect x="0" y="0" width="455" height="320" rx="12" fill="#0B132B" stroke="#38BDF8" strokeWidth="2" />
              <text x="227" y="30" fill="#38BDF8" fontSize="12" fontWeight="800" textAnchor="middle">3nm GATE-ALL-AROUND (GAAFET) NANOSHEET</text>

              {/* Source & Drain Terminals */}
              <g transform="translate(40, 70)">
                <rect x="0" y="0" width="80" height="180" rx="8" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                <text x="40" y="95" fill="#FDE68A" fontSize="12" fontWeight="800" textAnchor="middle">SOURCE</text>
                <text x="40" y="115" fill="#FBBF24" fontSize="9" textAnchor="middle">n+ SiGe</text>
              </g>

              <g transform="translate(335, 70)">
                <rect x="0" y="0" width="80" height="180" rx="8" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                <text x="40" y="95" fill="#FDE68A" fontSize="12" fontWeight="800" textAnchor="middle">DRAIN</text>
                <text x="40" y="115" fill="#FBBF24" fontSize="9" textAnchor="middle">n+ SiGe</text>
              </g>

              {/* 3 Stacked Horizontal Silicon Nanosheets (Channels) */}
              {[100, 145, 190].map((y, idx) => (
                <g key={idx}>
                  <rect x="120" y={y} width="215" height="22" rx="3" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
                  <text x="227" y={y + 15} fill="#E0F2FE" fontSize="8" fontWeight="700" textAnchor="middle">
                    Nanosheet Ribbon #{idx + 1} (3nm x 30nm)
                  </text>
                  {/* Flowing Electrons when Gate is Active (Step 4) */}
                  {currentStep >= 3 && (
                    <motion.circle
                      cx={140}
                      cy={y + 11}
                      r="4"
                      fill="#FDE68A"
                      animate={{ cx: [140, 315] }}
                      transition={{ repeat: Infinity, duration: 0.8 / speed, delay: idx * 0.2 }}
                    />
                  )}
                </g>
              ))}

              {/* 360° Metal Gate Enclosing Nanosheets */}
              <rect
                x="180"
                y="55"
                width="95"
                height="210"
                rx="8"
                fill="#6366F1"
                fillOpacity={currentStep >= 3 ? 0.45 : 0.2}
                stroke={currentStep >= 3 ? "#A855F7" : "#818CF8"}
                strokeWidth={currentStep >= 3 ? 2.5 : 1.5}
              />
              <text x="227" y="75" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">
                {currentStep >= 3 ? "GATE: 0.75V (ON)" : "HIGH-κ METAL GATE"}
              </text>
              <text x="227" y="278" fill="#A7F3D0" fontSize="8.5" fontWeight="700" textAnchor="middle">
                {currentStep >= 3 ? "Ballistic Electron Transport (0 Leakage)" : "360° Electrostatic Gate Control"}
              </text>
            </g>
          </svg>
        );
      }

      // ────────────────────────────────────────────────────────
      // 18. Quantum Computers & Qubit Superposition
      // ────────────────────────────────────────────────────────
      case "quantum-computing": {
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#040817" stroke="#1E293B" strokeWidth="2" />

            {/* Left: Dilution Refrigerator Golden Chandelier (Steps 1 & 2) */}
            <g transform="translate(50, 50)">
              <rect x="0" y="0" width="220" height="340" rx="12" fill="#0B132B" stroke="#F59E0B" strokeWidth="2" />
              <text x="110" y="30" fill="#FDE68A" fontSize="11" fontWeight="800" textAnchor="middle">DILUTION CRYOSTAT</text>

              {/* Multi-tier Cooling Stages */}
              <rect x="20" y="55" width="180" height="35" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
              <text x="110" y="76" fill="#E2E8F0" fontSize="8.5" textAnchor="middle">Stage 1: 50K Flange (-223°C)</text>

              <rect x="30" y="105" width="160" height="35" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
              <text x="110" y="126" fill="#FDE68A" fontSize="8.5" textAnchor="middle">Stage 2: 4K Plate (Liquid Helium)</text>

              <rect x="40" y="155" width="140" height="35" rx="4" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="1" />
              <text x="110" y="176" fill="#BAE6FD" fontSize="8.5" textAnchor="middle">Stage 3: 100 mK Still</text>

              <rect x="50" y="205" width="120" height="55" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth={2} className={styles.animGlow} />
              <text x="110" y="230" fill="#34D399" fontSize="10" fontWeight="800" textAnchor="middle">MIXING CHAMBER</text>
              <text x="110" y="248" fill="#A7F3D0" fontSize="12" fontWeight="800" textAnchor="middle">15 mK (-273.13°C)</text>

              {/* Golden Coaxial Control Lines with Flowing Pulses */}
              <line x1="60" y1="90" x2="60" y2="205" stroke="#F59E0B" strokeWidth="2" className={styles.animFlow} />
              <line x1="160" y1="90" x2="160" y2="205" stroke="#F59E0B" strokeWidth="2" className={styles.animFlow} />
              <text x="110" y="295" fill="#94A3B8" fontSize="8" textAnchor="middle">Microwave Coax Control Lines</text>
            </g>

            {/* Right: Bloch Sphere & Quantum State Simulation (Steps 3 & 4) */}
            <g transform="translate(300, 50)">
              <rect x="0" y="0" width="450" height="340" rx="12" fill="#060F26" stroke="#38BDF8" strokeWidth="2" />
              <text x="225" y="30" fill="#38BDF8" fontSize="12" fontWeight="800" textAnchor="middle">BLOCH SPHERE &amp; SUPERPOSITION (|Ψ⟩)</text>

              {/* Bloch Sphere Geometry Center */}
              <g transform="translate(225, 175)">
                {/* 3D Wireframe Sphere */}
                <circle cx="0" cy="0" r="90" fill="#0F172A" stroke="#1E3A8A" strokeWidth="2" />
                <ellipse cx="0" cy="0" rx="90" ry="32" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="5 4" />
                <ellipse cx="0" cy="0" rx="32" ry="90" fill="none" stroke="#6366F1" strokeWidth="1.2" strokeDasharray="5 4" />

                {/* Z Axis */}
                <line x1="0" y1="-105" x2="0" y2="105" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Poles */}
                <circle cx="0" cy="-90" r="6" fill="#38BDF8" className={styles.animGlowFast} />
                <text x="16" y="-88" fill="#38BDF8" fontSize="11" fontWeight="800">|0⟩ (Ground)</text>

                <circle cx="0" cy="90" r="6" fill="#EF4444" className={styles.animGlowFast} />
                <text x="16" y="96" fill="#F87171" fontSize="11" fontWeight="800">|1⟩ (Excited)</text>

                {/* State Vector |Ψ⟩ with Native SVG Continuous Rotation */}
                <g>
                  <line x1="0" y1="0" x2="0" y2="-85" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
                  </line>
                  <circle cx="0" cy="-85" r="5" fill="#FDE68A">
                    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
                  </circle>
                </g>

                <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
              </g>

              {/* Status Equation HUD */}
              <rect x="25" y="285" width="400" height="40" rx="6" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
              <text x="225" y="308" fill="#FDE68A" fontSize="10" fontWeight="800" textAnchor="middle">
                {currentStep === 0 && "State: |Ψ⟩ = |0⟩ (Classical Bit Zero)"}
                {currentStep === 1 && "Hadamard Applied: |Ψ⟩ = (|0⟩ + |1⟩)/√2 (50% |0⟩, 50% |1⟩)"}
                {currentStep === 2 && "Bell State Entangled: |Φ+⟩ = (|00⟩ + |11⟩)/√2"}
                {currentStep === 3 && "Wavefunction Collapsed: Readout = 0 (100% Deterministic)"}
              </text>
            </g>
          </svg>
        );
      }

      // ────────────────────────────────────────────────────────
      // 19. MEMS Sensors (Accelerometer & Gyroscope)
      // ────────────────────────────────────────────────────────
      case "mems-sensor": {
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#070C18" stroke="#1E293B" strokeWidth="2" />

            {/* Silicon Die Boundary */}
            <rect x="50" y="45" width="700" height="355" rx="12" fill="#0B1528" stroke="#334155" strokeWidth="2" />
            <text x="400" y="75" fill="#38BDF8" fontSize="13" fontWeight="800" textAnchor="middle">
              MEMS DIFFERENTIAL CAPACITIVE SENSOR (DRIE Polysilicon)
            </text>

            {/* Folded Spring Beams with Vibration Animation */}
            <path
              d="M 400,85 L 390,95 L 410,105 L 390,115 L 400,125"
              stroke="#34D399"
              strokeWidth="3"
              fill="none"
              className={styles.animVibrate}
            />
            <path
              d="M 400,325 L 390,335 L 410,345 L 390,355 L 400,365"
              stroke="#34D399"
              strokeWidth="3"
              fill="none"
              className={styles.animVibrate}
            />

            {/* Central Suspended Proof Mass (Oscillates dynamically) */}
            <g className={styles.animOscillate}>
              <rect x="330" y="125" width="140" height="200" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
              <text x="400" y="225" fill="#BAE6FD" fontSize="12" fontWeight="800" textAnchor="middle">PROOF MASS</text>
              <text x="400" y="245" fill="#38BDF8" fontSize="9" textAnchor="middle">
                Dynamic Inertial Shift (F = ma)
              </text>

              {/* Movable Comb Fingers Attached to Mass */}
              {[155, 195, 235, 275].map((y) => (
                <g key={`move-${y}`}>
                  <rect x="250" y={y} width="80" height="12" rx="2" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
                  <rect x="470" y={y} width="80" height="12" rx="2" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
                </g>
              ))}
            </g>

            {/* Fixed Static Comb Electrodes (Left C1 and Right C2) */}
            {/* Left Static Comb (Fixed) */}
            {[145, 185, 225, 265].map((y) => (
              <rect key={`fix-l-${y}`} x="200" y={y} width="85" height="12" rx="2" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
            ))}
            <text x="210" y="315" fill="#FDE68A" fontSize="10" fontWeight="700">Fixed Electrode (C1)</text>

            {/* Right Static Comb (Fixed) */}
            {[145, 185, 225, 265].map((y) => (
              <rect key={`fix-r-${y}`} x="515" y={y} width="85" height="12" rx="2" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
            ))}
            <text x="520" y="315" fill="#FDE68A" fontSize="10" fontWeight="700">Fixed Electrode (C2)</text>

            {/* Capacitance Readout HUD */}
            <rect x="80" y="340" width="640" height="45" rx="6" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
            <text x="400" y="367" fill="#A7F3D0" fontSize="11" fontWeight="800" textAnchor="middle">
              {currentStep === 0 && "Balanced: C1 = 120.0 fF | C2 = 120.0 fF (ΔC = 0 fF → 0.00 G)"}
              {currentStep === 1 && "Acceleration Detected: External Force F = ma pushing silicon mass"}
              {currentStep === 2 && "Capacitance Asymmetry: C1 = 104.2 fF | C2 = 135.8 fF (ΔC = 31.6 fF)"}
              {currentStep === 3 && "ASIC Vector Output: +1.00 G (Tilt Angle: 90° → Rotate Display UI)"}
            </text>
          </svg>
        );
      }

      // ────────────────────────────────────────────────────────
      // 20. Undersea Fiber Optics (TIR & DWDM)
      // ────────────────────────────────────────────────────────
      case "fiber-optic": {
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#040A17" stroke="#1E293B" strokeWidth="2" />

            {/* Left: DWDM Transmitter Laser Bank */}
            <g transform="translate(45, 60)">
              <rect x="0" y="0" width="160" height="320" rx="10" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
              <text x="80" y="28" fill="#67E8F9" fontSize="10" fontWeight="800" textAnchor="middle">DWDM LASER ARRAY</text>

              {[
                { name: "λ1: 1530nm (Red)", color: "#EF4444" },
                { name: "λ2: 1545nm (Amber)", color: "#F59E0B" },
                { name: "λ3: 1550nm (Green)", color: "#10B981" },
                { name: "λ4: 1565nm (Cyan)", color: "#06B6D4" },
              ].map((laser, i) => (
                <g key={laser.name} transform={`translate(15, ${55 + i * 45})`}>
                  <rect x="0" y="0" width="130" height="32" rx="4" fill="#1E293B" stroke={laser.color} strokeWidth={1.5} />
                  <circle cx="20" cy="16" r="6" fill={laser.color} className={styles.animGlowFast}>
                    <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                  </circle>
                  <text x="35" y="20" fill="#E2E8F0" fontSize="7.5" fontWeight="700">{laser.name}</text>
                </g>
              ))}

              <text x="80" y="260" fill="#BAE6FD" fontSize="8" textAnchor="middle">96 Channels MUX</text>
              <text x="80" y="275" fill="#34D399" fontSize="9" fontWeight="800" textAnchor="middle">400 Gbps / Channel</text>
            </g>

            {/* Center: Silica Fiber Glass Core & Total Internal Reflection */}
            <g transform="translate(225, 80)">
              {/* Cladding Pipe Outer */}
              <rect x="0" y="0" width="360" height="280" rx="12" fill="#0B132B" stroke="#38BDF8" strokeWidth="2" />
              <text x="180" y="30" fill="#64748B" fontSize="9" fontWeight="700" textAnchor="middle">
                SILICA CLADDING (n2 = 1.450)
              </text>

              {/* Glass Core Channel (9 micron) */}
              <rect x="0" y="65" width="360" height="150" fill="#0369A1" fillOpacity="0.4" stroke="#0284C7" strokeWidth="2" />
              <text x="180" y="90" fill="#38BDF8" fontSize="11" fontWeight="800" textAnchor="middle">
                PURE SILICA CORE (n1 = 1.485)
              </text>

              {/* Total Internal Reflection Zig-Zag Light Pulse */}
              <path
                id="fiber-light-path"
                d="M 0,140 L 60,70 L 140,210 L 220,70 L 300,210 L 360,140"
                stroke="#F59E0B"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.animFlowFast}
              />

              {/* Flowing Photon Wave Packet on Path */}
              <circle r="6" fill="#FDE68A" className={styles.animGlowFast}>
                <animateMotion path="M 0,140 L 60,70 L 140,210 L 220,70 L 300,210 L 360,140" dur="1.5s" repeatCount="indefinite" />
              </circle>

              {/* Normal lines at bounce points */}
              <line x1="60" y1="55" x2="60" y2="85" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="140" y1="195" x2="140" y2="225" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="220" y1="55" x2="220" y2="85" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Speed HUD */}
              <rect x="30" y="225" width="300" height="35" rx="6" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1" />
              <text x="180" y="247" fill="#FDE68A" fontSize="9" fontWeight="800" textAnchor="middle">
                Total Internal Reflection: θ = 82° &gt; θc (200,000 km/s)
              </text>
            </g>

            {/* Right: Subsea EDFA Optical Repeater & Photodiode Receiver */}
            <g transform="translate(605, 60)">
              <rect x="0" y="0" width="150" height="320" rx="10" fill="#0F172A" stroke="#10B981" strokeWidth="2" />
              <text x="75" y="28" fill="#34D399" fontSize="10" fontWeight="800" textAnchor="middle">EDFA REPEATER</text>

              {/* 980nm Pump Laser */}
              <rect x="15" y="55" width="120" height="50" rx="4" fill="#064E3B" stroke="#34D399" strokeWidth="1.5" className={styles.animGlow} />
              <text x="75" y="78" fill="#A7F3D0" fontSize="8" fontWeight="700" textAnchor="middle">980nm Pump</text>
              <text x="75" y="92" fill="#6EE7B7" fontSize="7.5" textAnchor="middle">Er3+ Ion Excitation</text>

              {/* Coherent Photodiode Receiver */}
              <rect x="15" y="130" width="120" height="80" rx="4" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5" />
              <text x="75" y="155" fill="#C084FC" fontSize="9" fontWeight="800" textAnchor="middle">COHERENT DSP</text>
              <text x="75" y="172" fill="#E2E8F0" fontSize="7.5" textAnchor="middle">64-QAM Demod</text>
              <text x="75" y="190" fill="#34D399" fontSize="8" fontWeight="700" textAnchor="middle">Internet Packets ✓</text>

              <text x="75" y="265" fill="#94A3B8" fontSize="7.5" textAnchor="middle">Subsea Cable Depth:</text>
              <text x="75" y="280" fill="#67E8F9" fontSize="9" fontWeight="800" textAnchor="middle">6,000 Meters</text>
            </g>
          </svg>
        );
      }

      // ────────────────────────────────────────────────────────
      // 21. Motherboard & High-Speed PCB Routing
      // ────────────────────────────────────────────────────────
      case "pcb-motherboard": {
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="20" y="20" width="760" height="410" rx="16" fill="#041B19" stroke="#0D9488" strokeWidth="2" />

            {/* Motherboard Header HUD */}
            <text x="50" y="55" fill="#2DD4BF" fontSize="13" fontWeight="800">
              HIGH-SPEED MULTI-LAYER PCB ROUTING (PCIe 5.0 &amp; DDR5 Bus)
            </text>

            {/* 1. VRM Power Delivery System (Top Left) */}
            <g transform="translate(50, 80)">
              <rect x="0" y="0" width="200" height="130" rx="8" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
              <text x="100" y="25" fill="#FDE68A" fontSize="10" fontWeight="800" textAnchor="middle">16-PHASE VRM (1.1V 250A)</text>

              {/* Chokes & Caps */}
              {[20, 60, 100, 140].map((x, i) => (
                <rect key={x} x={x} y="40" width="24" height="24" rx="3" fill="#1E293B" stroke="#94A3B8" strokeWidth="1">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="0.8s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                </rect>
              ))}
              <text x="100" y="90" fill="#A7F3D0" fontSize="8" textAnchor="middle">PWM Buck Converter: 12V → 1.1V</text>
              <text x="100" y="108" fill="#34D399" fontSize="8.5" fontWeight="700" textAnchor="middle">Ripple &lt; 5 mV DC</text>
            </g>

            {/* 2. CPU Socket LGA 1700 (Center Left) */}
            <g transform="translate(50, 230)">
              <rect x="0" y="0" width="200" height="140" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
              <text x="100" y="25" fill="#38BDF8" fontSize="10" fontWeight="800" textAnchor="middle">CPU LGA-1700 SOCKET</text>

              {/* Gold Contact Pin Grid */}
              <rect x="25" y="40" width="150" height="80" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
              <text x="100" y="78" fill="#FDE68A" fontSize="9" fontWeight="800" textAnchor="middle">1,700 Gold Pins</text>
              <text x="100" y="95" fill="#CBD5E1" fontSize="7.5" textAnchor="middle">DDR5 &amp; PCIe Direct Links</text>
            </g>

            {/* 3. High-Speed Serpentine Length-Matched Traces (Center) */}
            <g transform="translate(280, 80)">
              <rect x="0" y="0" width="240" height="290" rx="8" fill="#042F2E" stroke="#2DD4BF" strokeWidth="1.5" />
              <text x="120" y="25" fill="#5EEAD4" fontSize="10" fontWeight="800" textAnchor="middle">SERPENTINE BUS MATCHING</text>

              {/* Trace 1 (Straight) */}
              <path d="M 10,70 L 230,70" stroke="#F59E0B" strokeWidth="2.5" fill="none" className={styles.animFlow} />
              <text x="20" y="60" fill="#FDE68A" fontSize="7.5">Lane 0 (L = 65.0 mm)</text>
              <circle r="4" fill="#FDE68A">
                <animateMotion path="M 10,70 L 230,70" dur="1.2s" repeatCount="indefinite" />
              </circle>

              {/* Trace 2 (Wiggly Serpentine to match length) */}
              <path
                d="M 10,120 L 60,120 L 70,100 L 90,140 L 110,100 L 130,140 L 140,120 L 230,120"
                stroke="#F59E0B"
                strokeWidth="2.5"
                fill="none"
                className={styles.animFlow}
              />
              <text x="20" y="110" fill="#FDE68A" fontSize="7.5">Lane 1 (Serpentine L = 65.0 mm)</text>
              <circle r="4" fill="#FDE68A">
                <animateMotion path="M 10,120 L 60,120 L 70,100 L 90,140 L 110,100 L 130,140 L 140,120 L 230,120" dur="1.2s" repeatCount="indefinite" />
              </circle>

              {/* Trace 3 (Serpentine) */}
              <path
                d="M 10,180 L 50,180 L 65,160 L 85,200 L 105,160 L 125,200 L 145,180 L 230,180"
                stroke="#F59E0B"
                strokeWidth="2.5"
                fill="none"
                className={styles.animFlow}
              />
              <text x="20" y="170" fill="#FDE68A" fontSize="7.5">Lane 2 (Serpentine L = 65.0 mm)</text>
              <circle r="4" fill="#FDE68A">
                <animateMotion path="M 10,180 L 50,180 L 65,160 L 85,200 L 105,160 L 125,200 L 145,180 L 230,180" dur="1.2s" repeatCount="indefinite" />
              </circle>

              {/* Skew HUD */}
              <rect x="15" y="225" width="210" height="45" rx="4" fill="#134E4A" />
              <text x="120" y="243" fill="#A7F3D0" fontSize="8" fontWeight="700" textAnchor="middle">Controlled Impedance: 85 Ω</text>
              <text x="120" y="258" fill="#5EEAD4" fontSize="8.5" fontWeight="800" textAnchor="middle">Timing Skew: &lt; 0.5 Picoseconds</text>
            </g>

            {/* 4. PCIe 5.0 x16 Slot & Open Eye Diagram (Right) */}
            <g transform="translate(545, 80)">
              <rect x="0" y="0" width="190" height="290" rx="8" fill="#0F172A" stroke="#10B981" strokeWidth="2" />
              <text x="95" y="25" fill="#34D399" fontSize="10" fontWeight="800" textAnchor="middle">PCIe 5.0 EYE DIAGRAM</text>

              {/* Eye Diagram Scope Screen */}
              <rect x="15" y="45" width="160" height="130" rx="6" fill="#064E3B" stroke="#34D399" strokeWidth="1.5" />
              
              {/* Eye Pattern Waves with Pulsing Glow */}
              <path d="M 25,110 Q 95,55 165,110" stroke="#34D399" strokeWidth="2" fill="none" className={styles.animGlowFast} />
              <path d="M 25,110 Q 95,165 165,110" stroke="#34D399" strokeWidth="2" fill="none" className={styles.animGlowFast} />
              <circle cx="95" cy="110" r="14" fill="#064E3B" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="95" y="114" fill="#A7F3D0" fontSize="7.5" fontWeight="800" textAnchor="middle">OPEN EYE</text>

              <text x="95" y="200" fill="#6EE7B7" fontSize="9" fontWeight="800" textAnchor="middle">32 GT/s (128 GB/s)</text>
              <text x="95" y="220" fill="#CBD5E1" fontSize="7.5" textAnchor="middle">Back-Drilled Vias (No Stub)</text>
              <text x="95" y="235" fill="#CBD5E1" fontSize="7.5" textAnchor="middle">Megtron 6 Low-Loss Dielectric</text>
              <text x="95" y="260" fill="#34D399" fontSize="8" fontWeight="700" textAnchor="middle">Bit Error Rate: 10⁻¹² ✓</text>
            </g>
          </svg>
        );
      }

      // Default Schematic
      default:
        return (
          <svg viewBox="0 0 800 450" className={styles.svgCanvas}>
            <rect x="30" y="25" width="740" height="400" rx="16" fill="#070A12" stroke="#1E293B" strokeWidth="2" />
            <text x="400" y="210" textAnchor="middle" fill="#E2E8F0" fontSize="18" fontWeight="700">{topicTitle}</text>
            <text x="400" y="245" textAnchor="middle" fill="#818CF8" fontSize="13">
              Step {currentStep + 1}: {currentStepData.title}
            </text>
          </svg>
        );
    }
  };

  return (
    <div className={styles.container}>
      {/* Interactive Step Navigation Header */}
      {steps.length > 0 && (
        <div className={styles.stepNavHeader} id="simulation-step-tabs">
          {steps.map((s, idx) => (
            <button
              key={idx}
              className={`${styles.stepTabBtn} ${currentStep === idx ? styles.stepTabActive : ""}`}
              onClick={() => setCurrentStep(idx)}
              id={`sim-step-tab-${idx + 1}`}
            >
              <span className={styles.stepTabNumber}>{idx + 1}</span>
              <span>{s.title.replace(/^\d+\.\s*/, "")}</span>
            </button>
          ))}
        </div>
      )}

      {/* Canvas Area */}
      <div className={styles.canvasWrapper}>
        {renderTopicDiagram()}
      </div>

      {/* Active Step Explanation Banner */}
      <div className={styles.stepBanner}>
        <div className={styles.stepBannerHeader}>
          <h4 className={styles.stepBannerTitle}>
            <span className={styles.stepActiveBadge}>
              {language === "id" ? `Langkah ${currentStep + 1}` : `Step ${currentStep + 1}`}
            </span>
            <span>{currentStepData.title}</span>
          </h4>
        </div>
        <p className={styles.stepBannerDesc}>{currentStepData.shortDesc}</p>
        {currentStepData.details && (
          <p className={styles.stepBannerDetails}>{currentStepData.details}</p>
        )}
      </div>

      {/* Control Bar */}
      <div className={styles.controlBar}>
        <div className={styles.stepInfo}>
          <span className={styles.stepBadge}>
            {language === "id"
              ? `Langkah ${currentStep + 1} dari ${stepCount}`
              : `Step ${currentStep + 1} of ${stepCount}`}
          </span>
          <span className={styles.topicLabel}>{topicTitle}</span>
        </div>

        <div className={styles.centerControls}>
          <button
            onClick={handlePrev}
            className={styles.ctrlBtn}
            title="Langkah Sebelumnya (Previous)"
            id="sim-prev"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className={`${styles.ctrlBtn} ${styles.playBtn}`}
            title={isPlaying ? "Jeda Simulasi (Pause)" : "Jalankan Simulasi (Play)"}
            id="sim-play-pause"
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <button
            onClick={handleNext}
            className={styles.ctrlBtn}
            title="Langkah Berikutnya (Next)"
            id="sim-next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        <div className={styles.speedControls}>
          {([1, 2, 3] as const).map((s) => (
            <button
              key={s}
              className={`${styles.speedBtn} ${speed === s ? styles.speedActive : ""}`}
              onClick={() => setSpeed(s)}
              id={`sim-speed-${s}x`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

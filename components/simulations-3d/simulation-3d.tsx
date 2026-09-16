"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, RoundedBox, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Box, Layers, MousePointer2, Move3d, Scan } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import type { Model3DConfig } from "@/lib/types";

/* Procedural exhibits. No .glb assets: every model is authored in code so the
   build carries no binary dependency and every part can be exploded and
   annotated. The three.js material families stay consistent across exhibits. */

const INK = "#1b1b1f";
const INK_SOFT = "#3a3a42";
const METAL = "#8b8b96";
const ACCENT = "#5b52f0";
const ACCENT_SOFT = "#c9c5ff";
const SIGNAL = "#12b8d4";
const BOARD = "#1f6b45";

export function Simulation3D({
  config,
  title,
}: {
  config: Model3DConfig;
  title: string;
}) {
  const { t } = useLanguage();
  const [exploded, setExploded] = React.useState(config.exploded);
  const [active, setActive] = React.useState<string | null>(null);
  const [autoRotate, setAutoRotate] = React.useState(true);

  const hotspot = config.hotspots.find((h) => h.id === active) ?? null;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-paper-alt px-3 py-2.5">
        <span className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-2xs font-medium text-ink-soft">
          <Move3d size={13} className="text-accent" />
          {t.topic.orbitHint}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExploded((v) => !v)}
            aria-pressed={exploded}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors",
              exploded
                ? "border-accent bg-accent-soft text-accent-ink"
                : "border-line text-ink-soft hover:border-ink hover:text-ink"
            )}
          >
            <Layers size={14} />
            {t.topic.explodedView}
          </button>
          <button
            type="button"
            onClick={() => setAutoRotate((v) => !v)}
            aria-pressed={autoRotate}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors",
              autoRotate
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-ink hover:text-ink"
            )}
          >
            <Scan size={14} />
            {t.topic.autoRotate}
          </button>
        </div>
      </div>

      <div className="relative h-[380px] bg-paper-sink sm:h-[440px]">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [3.2, 2.4, 4.2], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.72} />
          <directionalLight position={[5, 7, 4]} intensity={1.5} />
          <directionalLight position={[-4, 2, -5]} intensity={0.55} />
          <React.Suspense fallback={null}>
            <group position={[0, -0.3, 0]}>
              <Exhibit
                kind={config.kind}
                exploded={exploded}
                onSelect={setActive}
                active={active}
              />
            </group>
            <Environment preset="city" />
          </React.Suspense>
          <OrbitControls
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.9}
            minDistance={3}
            maxDistance={9}
            minPolarAngle={0.35}
            maxPolarAngle={Math.PI / 1.75}
            onStart={() => setAutoRotate(false)}
          />

          {config.hotspots.map((h, i) => (
            <Html
              key={h.id}
              position={h.position}
              center
              distanceFactor={4.5}
              zIndexRange={[20, 0]}
            >
              {/*
                Compact by default: a small numbered dot anchored to the part.
                The full name appears only on hover or when selected, so the
                model itself is never buried under labels.
              */}
              <button
                type="button"
                onClick={() => setActive(active === h.id ? null : h.id)}
                aria-label={h.label + ": " + h.detail}
                aria-pressed={active === h.id}
                title={h.label}
                className={cn(
                  "group relative flex items-center justify-center rounded-full border shadow-card backdrop-blur-sm transition-all duration-200",
                  active === h.id
                    ? "h-9 w-9 border-accent bg-accent text-white sm:h-7 sm:w-7"
                    : "h-8 w-8 border-line bg-paper/90 text-ink-soft hover:border-accent hover:bg-accent-soft hover:text-accent-ink sm:h-6 sm:w-6"
                )}
              >
                <span className="tnum text-[10px] font-semibold leading-none">
                  {i + 1}
                </span>

                {/* Name revealed on hover (or while selected), offset so it
                    never sits on top of the part it points at. */}
                <span
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-medium transition-opacity duration-150",
                    active === h.id
                      ? "border-accent/30 bg-accent-soft text-accent-ink opacity-100"
                      : "border-line bg-paper/95 text-ink-soft opacity-0 group-hover:opacity-100"
                  )}
                >
                  {h.label}
                </span>
              </button>
            </Html>
          ))}
        </Canvas>

        <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-line bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted backdrop-blur-sm">
          <Box size={11} />
          {config.kind} · {config.hotspots.length} hotspots
        </span>

        {active === null ? (
          <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-line bg-paper/90 px-2.5 py-1 text-[10px] text-ink-muted backdrop-blur-sm">
            <MousePointer2 size={11} />
            {t.topic.tapMarker}
          </span>
        ) : null}
      </div>

      <div className="border-t border-line bg-paper-alt px-5 py-4">
        {hotspot ? (
          <div>
            <p className="flex items-center gap-2 font-display text-sm font-semibold tracking-[-0.01em]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-semibold text-white">
                {config.hotspots.findIndex((h) => h.id === hotspot.id) + 1}
              </span>
              {hotspot.label}
            </p>
            <p className="mt-2 max-w-measure text-[13px] leading-relaxed text-ink-muted">
              {hotspot.detail}
            </p>
          </div>
        ) : (
          <p className="text-[13px] leading-relaxed text-ink-muted">
            {title} — drag to turn the model, use the exploded view to separate
            every layer, and open a marker to read what that part does.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── the models ─────────────────────────── */

function Exhibit({
  kind,
  exploded,
  active,
  onSelect,
}: {
  kind: Model3DConfig["kind"];
  exploded: boolean;
  active: string | null;
  onSelect: (id: string | null) => void;
}) {
  const group = React.useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.06;
  });

  return (
    <group ref={group} scale={1.15}>
      {kind === "cpu" && <Cpu exploded={exploded} />}
      {kind === "gpu" && <Gpu exploded={exploded} />}
      {kind === "ram" && <Ram exploded={exploded} />}
      {kind === "ssd" && <Ssd exploded={exploded} />}
      {kind === "camera" && <Camera exploded={exploded} />}
      {kind === "router" && <Router exploded={exploded} />}
      {kind === "battery" && <Battery exploded={exploded} />}
      {kind === "phone" && <Phone exploded={exploded} />}
      {kind === "module" && <Module exploded={exploded} />}
      {kind === "cloud" && <Cloud exploded={exploded} />}
      <DataFlow />
    </group>
  );
}

/* A packet of light that travels around the model — the data-flow motif that
   ties every exhibit together. */
function DataFlow() {
  const ref = React.useRef<THREE.Mesh>(null);
  const t = React.useRef(0);
  useFrame((_, dt) => {
    t.current = (t.current + dt * 0.28) % 1;
    if (ref.current) {
      const a = t.current * Math.PI * 2;
      const r = 2.35;
      ref.current.position.set(
        Math.cos(a) * r,
        Math.sin(a * 2) * 0.35,
        Math.sin(a) * r
      );
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 16, 16]} />
      <meshBasicMaterial color={SIGNAL} />
    </mesh>
  );
}

function Part({
  children,
  color = INK,
  metalness = 0.35,
  roughness = 0.42,
  ...props
}: React.ComponentProps<typeof RoundedBox> & {
  color?: string;
  metalness?: number;
  roughness?: number;
}) {
  return (
    <RoundedBox args={[1, 1, 1]} radius={0.06} smoothness={3} {...props}>
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
      {children}
    </RoundedBox>
  );
}

function Cpu({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.34 : 0;
  return (
    <group>
      <Part position={[0, -0.28 - o, 0]} args={[1.75, 0.14, 1.75]} radius={0.03} color={BOARD} metalness={0.2} roughness={0.6} />
      <Part position={[0, -0.06, 0]} args={[1.35, 0.18, 1.35]} radius={0.05} color={INK} />
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-0.5 + (i % 3) * 0.5, -0.03, -0.5 + Math.floor(i / 3) * 0.5]}>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial color={ACCENT_SOFT} metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
      <Part position={[0, 0.14 + o * 0.5, 0]} args={[1.5, 0.16, 1.5]} radius={0.04} color={METAL} metalness={0.9} roughness={0.18} />
      <Part position={[0, 0.3 + o, 0]} args={[0.92, 0.04, 0.92]} radius={0.01} color={ACCENT} metalness={0.5} roughness={0.2} />
      {exploded ? (
        <Part position={[0, -0.72, 0]} args={[1.55, 0.05, 1.55]} radius={0.02} color={METAL} metalness={0.8} roughness={0.3} />
      ) : null}
    </group>
  );
}

function Gpu({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.4 : 0;
  return (
    <group>
      <Part position={[0, -0.2, 0]} args={[2.5, 0.12, 1.2]} radius={0.03} color={INK} />
      <group position={[0, 0.06 + o * 0.4, 0]}>
        <Part args={[1.1, 0.1, 1]} radius={0.02} color={ACCENT_SOFT} metalness={0.5} roughness={0.3} />
      </group>
      <group position={[0, 0.28 + o, 0]}>
        <Part args={[1.95, 0.3, 1.02]} radius={0.06} color={INK_SOFT} />
      </group>
      <group position={[0, 0.62 + o * 1.35, 0]}>
        <Part args={[2.1, 0.1, 1.15]} radius={0.04} color={METAL} metalness={0.85} roughness={0.2} />
      </group>
      {[
        [-0.85, 0.62],
        [-0.28, 0.62],
        [0.28, 0.62],
        [0.85, 0.62],
      ].map(([x, y], i) => (
        <group key={i} position={[x, y + o * 1.35, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.06, 12, 24]} />
            <meshStandardMaterial color={INK} metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      ))}
      {[-0.95, -0.32, 0.32, 0.95].map((x, i) => (
        <mesh key={i} position={[x, -0.1, 0.05]}>
          <boxGeometry args={[0.36, 0.08, 0.36]} />
          <meshStandardMaterial color={ACCENT} metalness={0.6} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function Ram({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.28 : 0;
  return (
    <group>
      <Part args={[2.6, 0.09, 0.8]} radius={0.02} color={BOARD} metalness={0.2} roughness={0.65} />
      {[-1, -0.5, 0, 0.5, 1].map((x, i) => (
        <group key={i} position={[x, 0.16 + o * (i % 2 ? 1 : 0.6), 0]}>
          <Part args={[0.4, 0.18, 0.5]} radius={0.02} color={INK} />
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[0.34, 0.02, 0.44]} />
            <meshStandardMaterial color={ACCENT_SOFT} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.07, 0]}>
        <boxGeometry args={[2.6, 0.05, 0.82]} />
        <meshStandardMaterial color="#c9a14a" metalness={0.95} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Ssd({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.42 : 0;
  return (
    <group>
      <Part args={[2.6, 0.09, 0.9]} radius={0.02} color={BOARD} metalness={0.2} roughness={0.62} />
      <group position={[-0.65, 0.28 + o, 0]}>
        <Part args={[0.75, 0.32, 0.78]} radius={0.03} color={INK} />
        <mesh position={[0, 0.17, 0]}>
          <boxGeometry args={[0.68, 0.02, 0.7]} />
          <meshStandardMaterial color={ACCENT} metalness={0.55} roughness={0.3} />
        </mesh>
      </group>
      <group position={[0.4, 0.24 + o * 1.3, -0.05]}>
        <Part args={[1.05, 0.26, 0.66]} radius={0.03} color={INK} />
        {[-0.25, 0, 0.25].map((x, i) => (
          <mesh key={i} position={[x, 0.14, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.58]} />
            <meshStandardMaterial color={ACCENT_SOFT} metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
      </group>
      <group position={[1.15, 0.2 + o * 0.7, 0]}>
        <Part args={[0.16, 0.1, 0.5]} radius={0.01} color={METAL} metalness={0.9} roughness={0.2} />
      </group>
      <mesh position={[-1.15, -0.03, 0]}>
        <boxGeometry args={[0.3, 0.16, 0.9]} />
        <meshStandardMaterial color="#c9a14a" metalness={0.95} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Camera({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.5 : 0;
  return (
    <group>
      <Part args={[2.1, 1.3, 0.85]} radius={0.14} color={INK} />
      <group position={[0, 0.06, 0.62 + o * 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.56, 0.62, 0.7, 40]} />
          <meshStandardMaterial color={INK_SOFT} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
      <group position={[0, 0.06, 1.02 + o * 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.46, 0.24, 40]} />
          <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
      <group position={[0, 0.06, 1.26 + o * 1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 0.06, 40]} />
          <meshStandardMaterial color={ACCENT} metalness={0.4} roughness={0.1} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 40]} />
          <meshStandardMaterial color="#0a0a12" metalness={0.6} roughness={0.05} />
        </mesh>
      </group>
      {exploded ? (
        <group position={[0, 0.06 + o * 1.15, 0.02]}>
          <mesh>
            <boxGeometry args={[1.15, 0.6, 0.03]} />
            <meshStandardMaterial color={ACCENT_SOFT} metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ) : null}
      <mesh position={[0.72, 0.55, 0.15]}>
        <cylinderGeometry args={[0.09, 0.09, 0.12, 20]} />
        <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Router({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.4 : 0;
  return (
    <group>
      <Part args={[2.4, 0.34, 1.5]} radius={0.08} color={INK} />
      <mesh position={[0, 0.19, 0]}>
        <boxGeometry args={[2.2, 0.03, 1.3]} />
        <meshStandardMaterial color={INK_SOFT} metalness={0.4} roughness={0.5} />
      </mesh>
      {[
        [-0.4, 0],
        [0, 0],
        [0.4, 0],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.24, z]}>
          <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
          <meshStandardMaterial
            color={i === 0 ? "#39d98a" : ACCENT}
            emissive={i === 0 ? "#39d98a" : ACCENT}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      {[
        [-0.85, 0.72],
        [0.85, 0.72],
      ].map(([x, y], i) => (
        <group key={i} position={[x, y + o, -0.4]} rotation={[0.12, 0, x > 0 ? -0.14 : 0.14]}>
          <mesh position={[0, 0.44, 0]}>
            <cylinderGeometry args={[0.05, 0.04, 0.9, 14]} />
            <meshStandardMaterial color={INK_SOFT} metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.19, 0]}>
        <boxGeometry args={[1.6, 0.04, 1.1]} />
        <meshStandardMaterial color={BOARD} metalness={0.2} roughness={0.65} />
      </mesh>
    </group>
  );
}

function Battery({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.42 : 0;
  const layers = [
    { x: -0.55, c: INK_SOFT },
    { x: 0, c: ACCENT_SOFT },
    { x: 0.55, c: ACCENT },
  ];
  return (
    <group>
      <Part args={[2.5, 0.9, 1]} radius={0.12} color={METAL} metalness={0.85} roughness={0.2} />
      {layers.map((l, i) => (
        <group key={i} position={[l.x, 0.02 + o * (i === 1 ? 0.5 : i === 0 ? 0.2 : 0.9), 0.53]}>
          <mesh>
            <boxGeometry args={[0.5, 0.86, 0.03]} />
            <meshStandardMaterial color={l.c} metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.98, 0.5, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.2, 20]} />
        <meshStandardMaterial color="#c9a14a" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[-0.98, 0.5, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.2, 20]} />
        <meshStandardMaterial color={METAL} metalness={0.95} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Phone({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.44 : 0;
  return (
    <group rotation={[0, 0, 0]}>
      <Part position={[0, 0, 0]} args={[0.92, 1.85, 0.12]} radius={0.09} color={INK} />
      <group position={[0, 0.18 + o, 0.14]}>
        <mesh>
          <boxGeometry args={[0.8, 1.3, 0.02]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={0.35}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
      </group>
      {exploded ? (
        <group position={[0, 0.18 + o * 1.9, 0.14]}>
          <mesh>
            <boxGeometry args={[0.84, 1.34, 0.015]} />
            <meshStandardMaterial color={ACCENT_SOFT} transparent opacity={0.5} metalness={0.3} roughness={0.15} />
          </mesh>
        </group>
      ) : null}
      <group position={[0, -0.45 - o * 0.4, 0.03]}>
        <mesh>
          <boxGeometry args={[0.74, 0.8, 0.06]} />
          <meshStandardMaterial color={BOARD} metalness={0.2} roughness={0.6} />
        </mesh>
      </group>
      <group position={[0, -0.1 - o * 0.8, 0]}>
        <mesh>
          <boxGeometry args={[0.66, 0.5, 0.05]} />
          <meshStandardMaterial color={INK_SOFT} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
      <mesh position={[-0.24, 0.72, 0.14]}>
        <cylinderGeometry args={[0.11, 0.11, 0.05, 24]} />
        <meshStandardMaterial color={INK} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Module({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.36 : 0;
  return (
    <group>
      <Part args={[1.7, 1.7, 0.14]} radius={0.06} color={INK} />
      <group position={[0, 0, 0.1 + o]}>
        <mesh>
          <boxGeometry args={[0.7, 0.7, 0.06]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.3} metalness={0.5} roughness={0.25} />
        </mesh>
      </group>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-0.5 + (i % 3) * 0.5, -0.5 + Math.floor(i / 3) * 0.5, 0.09]}>
          <boxGeometry args={[0.14, 0.14, 0.02]} />
          <meshStandardMaterial color={ACCENT_SOFT} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={`t${i}`} position={[x, 0.92 + o * 0.6, 0]}>
          <boxGeometry args={[0.1, 0.14, 0.1]} />
          <meshStandardMaterial color="#c9a14a" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={`b${i}`} position={[x, -0.92 - o * 0.6, 0]}>
          <boxGeometry args={[0.1, 0.14, 0.1]} />
          <meshStandardMaterial color="#c9a14a" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Cloud({ exploded }: { exploded: boolean }) {
  const o = exploded ? 0.2 : 0;
  return (
    <group>
      {[-0.7, 0, 0.7].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <Part position={[0, 0, 0]} args={[0.6, 1.5, 0.7]} radius={0.05} color={INK_SOFT} />
          {[0.5, 0.2, -0.1, -0.4].map((y, j) => (
            <mesh key={j} position={[0, y, 0.37]}>
              <boxGeometry args={[0.48, 0.06, 0.02]} />
              <meshStandardMaterial
                color={j === 0 ? "#39d98a" : ACCENT}
                emissive={j === 0 ? "#39d98a" : ACCENT}
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </group>
      ))}
      {exploded ? (
        <group position={[0, -1.05 - o, 0]}>
          <mesh>
            <boxGeometry args={[2.6, 0.05, 0.9]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

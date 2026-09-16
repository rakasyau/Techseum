"use client";

import * as React from "react";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

/* Network bench. You build a topology by clicking nodes, then send a packet
   that is routed by a real breadth-first search, so the path shown is derived
   from the graph rather than hardcoded. */

type NodeType = "device" | "router" | "server";

interface Node {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
}

const PALETTE: { type: NodeType; label: string; hint: string }[] = [
  { type: "device", label: "Device", hint: "Laptop, phone or sensor" },
  { type: "router", label: "Router", hint: "Forwards packets" },
  { type: "server", label: "Server", hint: "Responds to requests" },
];

const INITIAL: Node[] = [
  { id: "n1", type: "device", label: "Laptop", x: 70, y: 70 },
  { id: "n2", type: "router", label: "Router", x: 290, y: 180 },
  { id: "n3", type: "server", label: "Server", x: 520, y: 90 },
];

export function NetworkBench() {
  const { t } = useLanguage();
  const paletteLabels: Record<NodeType, string> = {
    device: t.lab.deviceLabel,
    router: t.lab.routerLabel,
    server: t.lab.serverLabel,
  };
  const [nodes, setNodes] = React.useState<Node[]>(INITIAL);
  const [links, setLinks] = React.useState<[string, string][]>([
    ["n1", "n2"],
    ["n2", "n3"],
  ]);
  const [pending, setPending] = React.useState<string | null>(null);
  const [path, setPath] = React.useState<string[]>([]);
  const [travelling, setTravelling] = React.useState(false);
  const counter = React.useRef(3);

  const byId = React.useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, Node>,
    [nodes]
  );

  const linked = React.useMemo(() => {
    const map = new Map<string, string[]>();
    nodes.forEach((n) => map.set(n.id, []));
    links.forEach(([a, b]) => {
      map.get(a)?.push(b);
      map.get(b)?.push(a);
    });
    return map;
  }, [nodes, links]);

  const addNode = (type: NodeType) => {
    counter.current += 1;
    const id = "n" + counter.current;
    const count = nodes.filter((n) => n.type === type).length + 1;
    setNodes((prev) => [
      ...prev,
      {
        id,
        type,
        label: type.charAt(0).toUpperCase() + type.slice(1) + " " + count,
        x: 100 + ((prev.length * 130) % 400),
        y: 70 + ((prev.length % 3) * 70),
      },
    ]);
  };

  const reset = () => {
    setNodes(INITIAL);
    setLinks([
      ["n1", "n2"],
      ["n2", "n3"],
    ]);
    setPending(null);
    setPath([]);
    setTravelling(false);
    counter.current = 3;
  };

  const handleNodeClick = (id: string) => {
    if (travelling) return;
    if (pending === null) {
      setPending(id);
      setPath([]);
      return;
    }
    if (pending === id) {
      setPending(null);
      return;
    }
    const from = pending;
    setLinks((prev) => {
      const exists = prev.some(
        ([a, b]) => (a === from && b === id) || (a === id && b === from)
      );
      return exists ? prev : [...prev, [from, id] as [string, string]];
    });
    setPending(null);
  };

  const sendPacket = () => {
    const source = nodes.find((n) => n.type === "device")?.id;
    const target = nodes.find((n) => n.type === "server")?.id;
    if (!source || !target) return;

    const queue: string[][] = [[source]];
    const seen = new Set<string>([source]);
    let found: string[] = [];
    while (queue.length) {
      const current = queue.shift() as string[];
      const last = current[current.length - 1];
      if (last === target) {
        found = current;
        break;
      }
      for (const next of linked.get(last) ?? []) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push([...current, next]);
        }
      }
    }
    setPath(found);
    setTravelling(found.length > 1);
  };

  React.useEffect(() => {
    if (!travelling) return;
    const id = window.setTimeout(() => setTravelling(false), path.length * 900);
    return () => window.clearTimeout(id);
  }, [travelling, path.length]);

  const hopCount = path.length > 1 ? path.length - 1 : 0;
  const totalLatency = hopCount * (hopCount > 2 ? 6 : 3) + 4;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-10">
      <div className="overflow-hidden rounded-2xl border border-line bg-paper-alt">
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2.5">
          <span className="text-2xs font-medium uppercase tracking-[0.1em] text-ink-muted">
            {t.lab.add}
          </span>
          {PALETTE.map((p) => (
            <button
              key={p.type}
              type="button"
              onClick={() => addNode(p.type)}
              title={p.hint}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-paper px-3 text-[12px] font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              + {paletteLabels[p.type]}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={sendPacket}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[12px] font-medium text-paper transition-colors hover:bg-ink-soft"
            >
              <Play size={12} />
              {t.lab.sendPacket}
            </button>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset topology"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-ink hover:text-ink"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

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
          <svg
            viewBox="0 0 640 320"
            className="relative block w-full"
            role="img"
            aria-label="Network topology with the routed packet path"
          >
            {links.map(([a, b], i) => {
              const na = byId[a];
              const nb = byId[b];
              if (!na || !nb) return null;
              const onPath =
                path.includes(a) &&
                path.includes(b) &&
                Math.abs(path.indexOf(a) - path.indexOf(b)) === 1;
              return (
                <line
                  key={i}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke={onPath ? "rgb(var(--accent))" : "rgb(var(--line-strong))"}
                  strokeWidth={onPath ? 2.4 : 1.6}
                  strokeDasharray={onPath ? undefined : "5 5"}
                />
              );
            })}

            {travelling && path.length > 1 ? (
              <circle r="6" fill="rgb(var(--accent))">
                <animateMotion
                  dur={path.length * 0.85 + "s"}
                  repeatCount="indefinite"
                  path={path
                    .map((id, i) => {
                      const n = byId[id];
                      return (i === 0 ? "M" : "L") + n.x + " " + n.y;
                    })
                    .join(" ")}
                />
              </circle>
            ) : null}

            {nodes.map((n) => {
              const onPath = path.includes(n.id);
              const isPending = pending === n.id;
              return (
                <g
                  key={n.id}
                  transform={"translate(" + n.x + ", " + n.y + ")"}
                  onClick={() => handleNodeClick(n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNodeClick(n.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={n.label}
                  className="cursor-pointer outline-none"
                >
                  <circle
                    r="30"
                    fill="rgb(var(--paper))"
                    stroke={
                      isPending || onPath
                        ? "rgb(var(--accent))"
                        : "rgb(var(--line-strong))"
                    }
                    strokeWidth={isPending ? 2.6 : onPath ? 2 : 1.5}
                  />
                  {n.type === "router" ? (
                    <path
                      d="M-11 4 L0 -8 L11 4"
                      fill="none"
                      stroke="rgb(var(--accent))"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : null}
                  {n.type === "device" ? (
                    <rect
                      x="-11"
                      y="-8"
                      width="22"
                      height="15"
                      rx="2.5"
                      fill="none"
                      stroke="rgb(var(--ink))"
                      strokeWidth="1.6"
                    />
                  ) : null}
                  {n.type === "server" ? (
                    <g stroke="rgb(var(--ink))" strokeWidth="1.6" fill="none">
                      <rect x="-9" y="-11" width="18" height="7" rx="1.5" />
                      <rect x="-9" y="-2" width="18" height="7" rx="1.5" />
                      <rect x="-9" y="7" width="18" height="7" rx="1.5" />
                    </g>
                  ) : null}
                  <text
                    y="46"
                    textAnchor="middle"
                    fontSize="10"
                    fill="rgb(var(--ink-muted))"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {t.lab.howToUse}
          </p>
          <ol className="mt-3 space-y-2.5">
            {[
              t.lab.stepSelect,
              t.lab.stepConnect,
              t.lab.stepSend,
            ].map((step, i) => (
              <li
                key={step}
                className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink-soft"
              >
                <span className="tnum grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line bg-paper-alt font-mono text-[10px]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {[
            { label: t.lab.nodes, value: String(nodes.length) },
            { label: t.lab.links, value: String(links.length) },
            { label: t.lab.hops, value: String(hopCount) },
            { label: t.lab.latency, value: totalLatency + "ms" },
          ].map((s) => (
            <div key={s.label} className="bg-paper p-4">
              <p className="text-2xs text-ink-muted">{s.label}</p>
              <p className="mt-1 font-display text-xl font-bold tracking-[-0.03em] tnum">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "rounded-2xl border p-4",
            path.length > 1
              ? "border-success/25 bg-success-soft"
              : pending
                ? "border-accent/25 bg-accent-soft"
                : "border-line bg-paper-alt"
          )}
        >
          <p className="text-[13px] font-semibold">
            {path.length > 1
              ? t.lab.routeFound + " " + hopCount + " " + t.lab.hops
              : pending
                ? t.lab.selectSecond
                : t.lab.ready}
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
            {path.length > 1
              ? path.map((id) => byId[id]?.label).join(" to ")
              : t.lab.routeHint}
          </p>
        </div>
      </div>
    </div>
  );
}

import type { Topic } from "../../types";

export const cacheTopic: Topic = {
  slug: "cache",
  title: "How Does a CPU Cache Work?",
  question: "Why is a fast CPU still often waiting around for memory?",
  summary:
    "A CPU can execute an instruction in under a nanosecond, but reaching main memory takes around a hundred. Caches are the small, fast copies that hide that gap.",
  category: "computing",
  difficultyDefault: 3,
  tags: ["SRAM", "latency", "cache line", "locality"],
  featured: true,
  glyph: "cache",
  relatedTopics: ["cpu", "ram"],
  levels: [
    {
      level: 1,
      minutes: 3,
      lede: "Your CPU is far faster than the memory it reads from. A cache is a tiny, very fast shelf of the things it just used.",
      blocks: [
        {
          type: "p",
          text: "A modern CPU can finish an instruction in less than a nanosecond. Fetching data from main memory can take around a hundred times longer. If the CPU had to wait every single time, most of the chip would sit idle.",
        },
        {
          type: "p",
          text: "So the CPU keeps a small store of recently used data close by, on the same chip. That store is the cache. When the data it needs is already there, the CPU keeps going at full speed.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Why a shelf, not the whole library",
          text: "The cache must be fast, and fast memory is expensive and takes up die area. Making it large would make it slow, exactly what it exists to avoid. Size and speed pull against each other.",
        },
      ],
    },
    {
      level: 2,
      minutes: 5,
      lede: "Caches come in levels. Each one is larger and a little slower than the one before, trading capacity for latency.",
      blocks: [
        {
          type: "p",
          text: "L1 is the smallest and fastest, sitting on each core. L2 is larger and slightly slower. L3 is shared across all the cores and measured in megabytes, but still far quicker than main memory.",
        },
        {
          type: "steps",
          items: [
            { title: "Look in L1", text: "A hit here costs a handful of cycles. Most accesses that repeat land here." },
            { title: "Look in L2", text: "A little slower and much larger. Plenty of working sets fit entirely." },
            { title: "Look in L3", text: "Shared and slower again, but still cheaper than leaving the chip." },
            { title: "Go to RAM", text: "The expensive case. Around a hundred cycles, and the result is copied back up the levels." },
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Data moves in lines",
          text: "Caches never fetch a single byte. They pull a whole cache line, typically 64 bytes, because programs rarely use one value in isolation.",
        },
      ],
    },
    {
      level: 3,
      minutes: 7,
      lede: "Caching works because programs are predictable: they reuse what they just touched, and they move forward, not randomly.",
      blocks: [
        {
          type: "p",
          text: "Temporal locality is reusing the same data soon after. Spatial locality is using data that lives next to data you already used. A loop over an array shows both: the same counter again and again, then the very next element.",
        },
        {
          type: "compare",
          left: {
            title: "Cache hit",
            items: ["Found close to the core", "A few cycles", "CPU keeps streaming"],
          },
          right: {
            title: "Cache miss",
            items: ["Fetch from main memory", "Around 100 cycles", "Core may stall"],
          },
        },
        {
          type: "p",
          text: "This is why two programs doing the same number of operations can feel completely different. One marches through memory in order; the other jumps around and misses the cache on nearly every access.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "The wrong layout is the slow layout",
          text: "A linked list visits scattered addresses, so each step is a likely miss. Storing the same data in a contiguous array turns most of those into hits without changing the algorithm at all.",
        },
      ],
    },
    {
      level: 4,
      minutes: 10,
      lede: "The cache is not passive storage. It decides what to evict, what to prefetch, and how to stay coherent across every core at once.",
      blocks: [
        {
          type: "p",
          text: "Cache lines live in sets. A given address maps to one set, and within it the cache chooses which way to keep. When all ways are full it evicts a line, usually the least recently used, though real policies approximate that to stay cheap.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Coherence is the hard part",
          text: "Every core has its own private cache but they all share one memory. If two cores hold the same line and one writes, the other must be invalidated or updated. Protocols like MESI track each line's state so cores never silently disagree.",
        },
        {
          type: "stats",
          items: [
            { label: "L1 latency", value: "~4 cycles" },
            { label: "L2 latency", value: "~12 cycles" },
            { label: "L3 latency", value: "~40 cycles" },
            { label: "Cache line", value: "64 bytes" },
            { label: "DRAM latency", value: "~200 cycles" },
          ],
        },
        {
          type: "p",
          text: "The prefetcher watches access patterns and speculatively loads ahead, so by the time a loop reaches the next line it is already resident. False sharing shows the cost of getting this wrong: two cores writing unrelated variables that happen to share one line will keep invalidating each other, and performance collapses even though the code is logically independent.",
        },
      ],
    },
  ],
  sim2d: {
    viewBox: [0, 0, 960, 430],
    lanes: [
      { label: "On the core", y: 20, h: 390 },
      { label: "On the chip", y: 20, h: 390 },
      { label: "Off the chip", y: 20, h: 390 },
    ],
    nodes: [
      { id: "addr", label: "Address Request", sub: "core asks for a value", x: 26, y: 40, w: 180, h: 86, tone: "accent", desc: "The load-store unit issues the address the core wants. Everything that follows is the hardware trying to satisfy it as cheaply as possible." },
      { id: "l1", label: "L1 Cache", sub: "~4 cycles · 64 KB", x: 246, y: 40, w: 172, h: 86, tone: "signal", desc: "The smallest and fastest level, private to a single core. Most repeated accesses are answered here." },
      { id: "l2", label: "L2 Cache", sub: "~12 cycles · 512 KB", x: 246, y: 164, w: 172, h: 86, desc: "Larger and a little slower, still private per core. Catches most accesses that L1 misses." },
      { id: "l3", label: "L3 Cache", sub: "~40 cycles · shared", x: 246, y: 288, w: 172, h: 100, desc: "Shared by every core on the chip, measured in megabytes. The last stop before leaving the die." },
      { id: "mem", label: "Main Memory", sub: "~200 cycles · RAM", x: 496, y: 288, w: 196, h: 100, tone: "muted", desc: "Large but slow. When a read reaches here the core usually stalls unless another thread can run meanwhile." },
      { id: "line", label: "Cache Line", sub: "64 bytes, not 1", x: 496, y: 40, w: 196, h: 86, tone: "accent", desc: "Every miss copies a whole line up the hierarchy, betting that nearby values will be used next." },
      { id: "prefetch", label: "Prefetcher", sub: "loads ahead", x: 496, y: 164, w: 196, h: 86, desc: "Notices a sequential pattern and loads the following lines before the code asks, hiding latency rather than avoiding it." },
      { id: "core", label: "Core Executes", sub: "hit or stall", x: 734, y: 164, w: 200, h: 100, tone: "signal", desc: "On a hit the instruction continues at full speed. On a miss the pipeline may wait, which is why cache behaviour often matters more than clock speed." },
    ],
    edges: [
      { from: "addr", to: "l1", label: "look up" },
      { from: "l1", to: "core", label: "hit", tone: "signal" },
      { from: "l1", to: "l2", label: "miss", dashed: true },
      { from: "l2", to: "l3", label: "miss", dashed: true },
      { from: "l3", to: "mem", label: "miss", dashed: true },
      { from: "mem", to: "l3", label: "line", tone: "accent" },
      { from: "line", to: "addr", label: "fill", dashed: true, tone: "accent" },
      { from: "prefetch", to: "l2", label: "ahead", dashed: true },
      { from: "core", to: "prefetch", label: "pattern", dashed: true, tone: "signal" },
    ],
    steps: [
      { id: "request", title: "1 · Request", short: "Request", description: "The core issues an address. Before anything reaches memory, the hardware checks whether that value is already held close by.", active: ["addr", "l1"], pulses: [{ from: "addr", to: "l1" }], value: "load 0x7ffd40" },
      { id: "hitmiss", title: "2 · Hit or Miss", short: "Hit/Miss", description: "L1 answers in a handful of cycles on a hit. On a miss the request falls to the next level, and the core may continue with other work while it waits.", active: ["l1", "l2", "core"], pulses: [{ from: "l1", to: "l2" }], value: "L1 miss → L2" },
      { id: "fall", title: "3 · Fall Through", short: "Miss", description: "The request walks down L2 and L3. Each level is larger and slower. Only if all of them miss does it leave the chip for main memory.", active: ["l2", "l3", "mem"], pulses: [{ from: "l2", to: "l3" }, { from: "l3", to: "mem" }], value: "L3 miss → RAM" },
      { id: "fill", title: "4 · Fill & Prefetch", short: "Fill", description: "Memory returns a whole cache line, which is copied into every level on the way back up. The prefetcher may pull following lines too, so the next request is already a hit.", active: ["mem", "line", "prefetch", "core"], pulses: [{ from: "mem", to: "l3" }, { from: "line", to: "core" }], value: "64 B filled, next hit" },
    ],
  },
  model3d: {
    kind: "cache",
    exploded: true,
    hotspots: [
      { id: "die", label: "Processor core", detail: "The core sits at the top of the stack, closest to the fastest storage.", position: [0.55, 0.74, 0.55] },
      { id: "l1", label: "L1 cache block", detail: "A few tens of kilobytes of SRAM wired directly to the core. Answers in a handful of cycles.", position: [0.55, 0.36, 0.55] },
      { id: "l2", label: "L2 cache block", detail: "Larger and slightly slower, private to each core, holding the working set that does not fit in L1.", position: [0.55, 0.06, 0.55] },
      { id: "l3", label: "L3 cache (shared)", detail: "A much larger bank shared by every core, the last stop before main memory.", position: [0.55, -0.28, 0.55] },
    ],
  },
};

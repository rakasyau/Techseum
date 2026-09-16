import type { Topic } from "../../types";

export const computingTopics: Topic[] = [
  {
    slug: "cpu",
    title: "How Does a CPU Work?",
    question: "How does a sliver of sand end up doing your thinking for you?",
    summary:
      "A CPU fetches instructions from memory, decodes what they mean, executes them, and writes the result back — billions of times per second.",
    category: "computing",
    difficultyDefault: 2,
    explorerCount: 48210,
    rating: 4.9,
    tags: ["silicon", "transistors", "instruction cycle", "clock speed"],
    featured: true,
    trending: true,
    glyph: "cpu",
    learningPath: "Understanding the Internet",
    relatedTopics: ["ram", "gpu", "ssd"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "Your CPU is the part of the computer that actually follows instructions — one tiny, incredibly fast step at a time.",
        blocks: [
          {
            type: "p",
            text: "Everything you do on a computer eventually becomes a list of extremely simple instructions: add these two numbers, compare these two, move this value over there. The CPU is the machine that reads that list and does each item in order.",
          },
          {
            type: "steps",
            items: [
              { title: "Fetch", text: "Grab the next instruction from memory." },
              { title: "Decode", text: "Work out what that instruction is asking for." },
              { title: "Execute", text: "Do the maths or logic it describes." },
              { title: "Write back", text: "Store the result and move to the next instruction." },
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Why speed feels instant",
            text: "A modern CPU runs this loop billions of times every second. The cycle is so short that a whole web page renders before your eye has finished opening.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "The fetch–decode–execute cycle only works because several specialised units hand the work to each other in lockstep.",
        blocks: [
          {
            type: "p",
            text: "The control unit is the conductor: it steps every other part through the cycle on the beat of the system clock. The program counter holds the address of the next instruction so the CPU always knows where it is. The decoder translates a raw pattern of bits into the specific control signals that drive the rest of the chip.",
          },
          {
            type: "p",
            text: "The ALU performs arithmetic and logic — addition, subtraction, comparisons, bit operations. The registers are a tiny set of ultra-fast storage slots that hold the operands and results the ALU is working on right now.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "A pipeline, not a relay race",
            text: "Real CPUs overlap these stages so that while one instruction executes, the next is being decoded and a third is being fetched. That overlap is called pipelining, and it is why design decisions in one stage ripple into the others.",
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "Memory is thousands of times slower than the core, so the CPU is surrounded by a hierarchy of caches engineered to hide that gap.",
        blocks: [
          {
            type: "p",
            text: "Reading from main memory costs on the order of a hundred CPU cycles. L1, L2 and L3 caches trade capacity for latency: L1 is a few tens of kilobytes and answers in a handful of cycles, while L3 is shared across cores and measured in megabytes.",
          },
          {
            type: "compare",
            left: {
              title: "Cache hit",
              items: ["Data found close to the core", "A few cycles", "CPU keeps streaming"],
            },
            right: {
              title: "Cache miss",
              items: ["Fetch from main memory", "Hundreds of cycles", "Pipeline may stall"],
            },
          },
          {
            type: "p",
            text: "When code accesses memory in a predictable, sequential pattern, the hardware prefetcher can guess what is coming and load it early. Random access defeats that guess and is often the real reason one program feels slower than another.",
          },
        ],
      },
      {
        level: 4,
        minutes: 10,
        lede: "Below the instruction set, everything is transistors switching, and above it everything is a bet on which instructions are worth predicting.",
        blocks: [
          {
            type: "p",
            text: "Each instruction is decomposed into micro-operations that flow through an out-of-order engine. The scheduler issues them as their inputs become ready, register renaming removes false dependencies, and a reorder buffer retires them in program order so the result still looks sequential to software.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "Speculation is a wager",
            text: "Branch prediction guesses which way a conditional will go and starts executing down that path. A correct guess is free performance; a misprediction flushes the pipeline and costs the full penalty. Spectre-class vulnerabilities are the security shadow of exactly this optimisation.",
          },
          {
            type: "stats",
            items: [
              { label: "Transistor budget", value: "10¹⁰", note: "in a modern desktop die" },
              { label: "Pipeline depth", value: "15–20", note: "stages, typical" },
              { label: "L1 latency", value: "~4 cycles" },
              { label: "DRAM latency", value: "~200 cycles" },
            ],
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      lanes: [
        { label: "Memory", y: 20, h: 390 },
        { label: "Control", y: 20, h: 390 },
        { label: "Execution", y: 20, h: 390 },
      ],
      nodes: [
        { id: "pc", label: "Program Counter", sub: "next address", x: 26, y: 34, w: 176, h: 78, desc: "Holds the address of the next instruction to fetch. Increments automatically after each fetch." },
        { id: "ram", label: "Main Memory", sub: "RAM", x: 26, y: 148, w: 176, h: 104, tone: "default", desc: "Stores both the program's instructions and its data. Large but roughly 200× slower than the registers." },
        { id: "cache", label: "Cache L1 / L2", sub: "fast staging", x: 26, y: 288, w: 176, h: 88, tone: "muted", desc: "A small, very fast copy of recently used memory. Answers in a few cycles instead of a few hundred." },
        { id: "cu", label: "Control Unit", sub: "the conductor", x: 258, y: 148, w: 182, h: 104, tone: "accent", desc: "Sequences every other unit on the clock beat and raises the control signals that make each stage happen." },
        { id: "decoder", label: "Instruction Decoder", sub: "opcode → signals", x: 258, y: 288, w: 182, h: 88, desc: "Translates a raw bit pattern into the specific control signals the rest of the chip understands." },
        { id: "alu", label: "ALU", sub: "arithmetic & logic", x: 496, y: 148, w: 178, h: 104, tone: "signal", desc: "The arithmetic logic unit: adds, subtracts, compares and applies bitwise operations to the values it is handed." },
        { id: "regs", label: "Registers", sub: "fastest storage", x: 496, y: 288, w: 178, h: 88, desc: "A handful of storage slots living on the core itself. The ALU's operands and results live here." },
        { id: "out", label: "Retire & Repeat", sub: "state advances", x: 734, y: 148, w: 200, h: 104, desc: "The result is committed to architectural state, the program counter moves on, and the whole cycle begins again." },
      ],
      edges: [
        { from: "pc", to: "cu", label: "address", dashed: true },
        { from: "ram", to: "cu", label: "instruction" },
        { from: "cu", to: "decoder" },
        { from: "cu", to: "alu", label: "control", tone: "accent" },
        { from: "decoder", to: "regs", label: "operands", dashed: true },
        { from: "regs", to: "alu", label: "operands" },
        { from: "alu", to: "regs", label: "result", tone: "signal" },
        { from: "regs", to: "out", label: "commit", tone: "accent" },
        { from: "out", to: "cache", dashed: true, tone: "signal" },
      ],
      steps: [
        {
          id: "fetch",
          title: "1 · Fetch",
          short: "Fetch",
          description: "The control unit sends the address held in the program counter to memory. The instruction stored there travels back and is latched into the instruction register.",
          active: ["pc", "ram", "cache", "cu"],
          pulses: [{ from: "pc", to: "cu" }, { from: "ram", to: "cu" }],
          value: "PC → 0x0040",
        },
        {
          id: "decode",
          title: "2 · Decode",
          short: "Decode",
          description: "The decoder splits the instruction into its opcode and operands, then raises the control lines that tell every other unit what role to play this cycle.",
          active: ["cu", "decoder"],
          pulses: [{ from: "cu", to: "decoder" }],
          value: "opcode = ADD",
        },
        {
          id: "execute",
          title: "3 · Execute",
          short: "Execute",
          description: "The register file supplies the operands and the ALU performs the operation. Control signals select the function and route the result back to a register.",
          active: ["regs", "alu"],
          pulses: [{ from: "regs", to: "alu" }, { from: "alu", to: "regs" }],
          value: "R1 + R2 = 42",
        },
        {
          id: "writeback",
          title: "4 · Write Back",
          short: "Write back",
          description: "The result is written into architectural state, the program counter advances, and the machine is ready for the next instruction — all in a fraction of a nanosecond.",
          active: ["regs", "out", "cache"],
          pulses: [{ from: "regs", to: "out" }],
          value: "R1 ← 42",
        },
      ],
    },
    model3d: {
      kind: "cpu",
      exploded: true,
      hotspots: [
        { id: "die", label: "Silicon die", detail: "The fingernail-sized square where every transistor lives, etched at a scale of a few nanometres.", position: [0, 0.34, 0] },
        { id: "ihs", label: "Integrated heat spreader", detail: "The metal cap that carries heat away from the die and into your cooler.", position: [0.8, 0.62, 0.3] },
        { id: "pins", label: "Contact array", detail: "Hundreds of pads that connect the package to the motherboard's socket.", position: [0, -0.6, 0.7] },
        { id: "cache", label: "Cache blocks", detail: "Blocks of SRAM laid out beside the cores to keep hot data close.", position: [-0.7, 0.1, 0.7] },
      ],
    },
  },
  {
    slug: "ram",
    title: "Inside RAM",
    question: "Why does closing apps make your computer faster?",
    summary:
      "Random access memory holds whatever the CPU is working on right now — and it forgets everything the moment power is cut.",
    category: "computing",
    difficultyDefault: 2,
    explorerCount: 31840,
    rating: 4.7,
    tags: ["DRAM", "capacitors", "memory controller", "refresh"],
    trending: true,
    glyph: "ram",
    relatedTopics: ["cpu", "ssd"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "RAM is your computer's desk. The storage is the filing cabinet — but you can only work on what is on the desk.",
        blocks: [
          {
            type: "p",
            text: "Every program you open, every tab you load, every photo you edit has to sit in RAM while you use it. There is far less RAM than storage, so the desk fills up fast.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Why it is called volatile",
            text: "RAM stores each bit as a tiny electrical charge. Cut the power and the charges drain within milliseconds — which is why unsaved work disappears.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "Each bit lives in a cell built from one transistor and one capacitor, arranged in a vast grid of rows and columns.",
        blocks: [
          {
            type: "p",
            text: "The capacitor holds the charge that represents a 0 or a 1. The transistor is the gate that lets the memory controller read or rewrite it. Cells are wired into rows — called word lines — and columns called bit lines.",
          },
          {
            type: "steps",
            items: [
              { title: "Row activate", text: "The controller selects a row, dumping every cell on it into sense amplifiers." },
              { title: "Sense", text: "The amplifiers detect charges too faint to read directly." },
              { title: "Column select", text: "Only the requested columns are forwarded." },
              { title: "Burst", text: "Neighbouring columns stream out together — that is why sequential access is faster." },
            ],
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "Because capacitors leak, every row must be recharged thousands of times per second — and that refresh is invisible work.",
        blocks: [
          {
            type: "p",
            text: "Refresh cycles steal bandwidth from real requests. Memory controllers schedule refreshes opportunistically and batch requests to hide them, which is one reason memory latency is quoted as a range rather than a single number.",
          },
          {
            type: "stats",
            items: [
              { label: "Typical latency", value: "10–20 ns", note: "row activate plus column access" },
              { label: "Refresh interval", value: "64 ms", note: "per row" },
              { label: "Voltage", value: "~1.2 V", note: "DDR5 nominal" },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Channels beat clock",
            text: "Two memory channels running slower often beat one channel running faster, because real workloads care about total bandwidth and parallelism, not peak clock.",
          },
        ],
      },
      {
        level: 4,
        minutes: 9,
        lede: "The memory controller is a scheduler, and DRAM performance is a study in managing row conflicts and timing constraints.",
        blocks: [
          {
            type: "p",
            text: "Opening a row is expensive, so the controller reorders queued requests to keep hitting the same open row. Its freedom is bounded by a lattice of timing parameters — tRCD, tRP, tRAS, CL — each naming a minimum delay between operations.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "Rowhammer",
            text: "Repeatedly activating the same row can leak charge into its neighbours and flip their bits. Modern chips use targeted refresh and error correction to keep this from becoming a reliability or security problem.",
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "cpu", label: "CPU Core", sub: "requests data", x: 26, y: 152, w: 168, h: 96, tone: "accent", desc: "Issues loads and stores. A cache miss sends a request down to the memory controller." },
        { id: "mctrl", label: "Memory Controller", sub: "the scheduler", x: 248, y: 152, w: 184, h: 96, tone: "signal", desc: "Translates cache misses into a precise sequence of DRAM commands, reordering them to hide latency." },
        { id: "row", label: "Row Buffer", sub: "activated row", x: 486, y: 36, w: 178, h: 86, desc: "The currently open row. Hitting it is cheap; hitting a different row forces a precharge and activate first." },
        { id: "amps", label: "Sense Amplifiers", sub: "detect faint charge", x: 486, y: 152, w: 178, h: 96, tone: "signal", desc: "Amplify the tiny voltage difference from each cell so a 0 or 1 can actually be resolved." },
        { id: "cells", label: "Cell Array", sub: "rows × columns", x: 486, y: 300, w: 178, h: 96, desc: "The grid of one-transistor, one-capacitor cells. Millions of them, each holding a single bit." },
        { id: "banks", label: "Banks", sub: "parallel units", x: 728, y: 152, w: 200, h: 96, desc: "Independent DRAM banks can serve requests in parallel, which is how the controller hides the cost of any single access." },
        { id: "refresh", label: "Refresh Engine", sub: "background sweep", x: 728, y: 300, w: 200, h: 96, tone: "muted", desc: "Periodically recharges every row before leakage erases the data. Invisible, mandatory, and it consumes bandwidth." },
      ],
      edges: [
        { from: "cpu", to: "mctrl", label: "cache miss" },
        { from: "mctrl", to: "amps", label: "commands", tone: "accent" },
        { from: "row", to: "amps" },
        { from: "amps", to: "cells", label: "read", tone: "signal" },
        { from: "banks", to: "amps" },
        { from: "refresh", to: "cells", dashed: true, tone: "signal" },
        { from: "cells", to: "mctrl", dashed: true, label: "data back" },
      ],
      steps: [
        { id: "request", title: "1 · Request", short: "Request", description: "A cache miss arrives at the memory controller carrying an address. The controller queues it alongside every other outstanding request.", active: ["cpu", "mctrl"], pulses: [{ from: "cpu", to: "mctrl" }], value: "read 0x1A4C" },
        { id: "activate", title: "2 · Activate Row", short: "Row activate", description: "The controller issues an activate command, which connects every cell in the target row to its sense amplifier.", active: ["mctrl", "row", "amps"], pulses: [{ from: "mctrl", to: "amps" }], value: "ACTIVATE row 4108" },
        { id: "sense", title: "3 · Sense", short: "Sense", description: "Sense amplifiers resolve the faint charges into clean digital bits. This is the slow part — tens of nanoseconds.", active: ["amps", "cells", "banks"], pulses: [{ from: "cells", to: "amps" }], value: "detecting 8192 bits" },
        { id: "burst", title: "4 · Burst & Refresh", short: "Burst", description: "The requested columns stream back to the CPU, while the refresh engine quietly sweeps other rows before leakage erases them.", active: ["amps", "mctrl", "refresh", "cpu"], pulses: [{ from: "mctrl", to: "cpu" }, { from: "refresh", to: "cells" }], value: "8 words @ 6400 MT/s" },
      ],
    },
    model3d: {
      kind: "ram",
      exploded: false,
      hotspots: [
        { id: "dimm", label: "DIMM module", detail: "The stick itself: a small circuit board of chips that slots into the motherboard.", position: [0, 0.4, 0] },
        { id: "chips", label: "DRAM chips", detail: "Each black package contains multiple banks of the cell array.", position: [1.1, 0.2, 0.4] },
        { id: "gold", label: "Gold contacts", detail: "Carry power and data between the module and the memory bus.", position: [0, -0.7, 0.6] },
        { id: "spd", label: "SPD hub", detail: "Tells the system what timings and speeds this module supports.", position: [-1.1, 0.15, 0.4] },
      ],
    },
  },
  {
    slug: "ssd",
    title: "Why SSDs Feel Instant",
    question: "What actually happens when a solid-state drive writes a file?",
    summary:
      "An SSD has no spinning parts. It stores charge in flash cells, and a controller juggles erase blocks, wear levelling and garbage collection to keep everything fast.",
    category: "computing",
    difficultyDefault: 3,
    explorerCount: 27620,
    rating: 4.8,
    tags: ["NAND flash", "FTL", "wear levelling", "NVMe"],
    featured: true,
    glyph: "ssd",
    relatedTopics: ["ram", "cpu"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "A hard drive has a spinning disc and a moving arm. An SSD has neither — it is pure electronics, so there is nothing to wait for.",
        blocks: [
          {
            type: "p",
            text: "With no heads to move and no platters to spin up, an SSD answers in microseconds instead of milliseconds. That is the single biggest reason a new laptop feels dramatically faster.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Silence and shock",
            text: "No moving parts also means no noise and no damage from being bumped while it works.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "Data lives as trapped charge in flash cells grouped into pages, and pages are grouped into blocks.",
        blocks: [
          {
            type: "p",
            text: "Flash is read and written one page at a time — typically a few kilobytes — but it can only be erased a whole block at a time, and a block holds hundreds of pages.",
          },
          {
            type: "compare",
            left: { title: "You can", items: ["Read a page", "Write a page", "Overwrite only if blank"] },
            right: { title: "You cannot", items: ["Overwrite a used page", "Erase a single page", "Ignore wear limits"] },
          },
          {
            type: "callout",
            tone: "tip",
            title: "The awkward rule",
            text: "To change one byte, the drive copies the whole block's live pages elsewhere, erases the block, then writes everything back. The controller exists to hide that.",
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "A flash translation layer maps the addresses your operating system uses onto physical flash locations, moving data to spread wear.",
        blocks: [
          {
            type: "p",
            text: "The FTL keeps a lookup table, so writing over an address usually means writing to a fresh page and marking the old one stale. The stale pages accumulate until garbage collection reclaims the block.",
          },
          {
            type: "stats",
            items: [
              { label: "Read latency", value: "~50 µs" },
              { label: "Write latency", value: "~200 µs" },
              { label: "Random IOPS", value: "500K+", note: "NVMe Gen4" },
              { label: "Endurance", value: "600–2400", note: "TBW, typical" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 10,
        lede: "Sustained performance depends on over-provisioning, TRIM, and keeping a pool of already-erased blocks available.",
        blocks: [
          {
            type: "p",
            text: "Write amplification measures how many physical bytes are written per logical byte requested. A write-heavy workload with no spare erased blocks can push amplification above 3×, which shows up as a steep drop in sustained speed once the SLC cache is exhausted.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "The SLC cache cliff",
            text: "Consumer drives write incoming data first to a fast cache and flush it to slower storage later. Copy a file larger than the cache and you will watch the speed fall off a cliff in real time.",
          },
          {
            type: "p",
            text: "TRIM tells the drive which blocks the filesystem no longer needs, letting it erase them in advance instead of during a write. It is why an SSD that looks nearly empty performs better than one that is 95% full.",
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "host", label: "Operating System", sub: "logical write", x: 26, y: 152, w: 168, h: 96, tone: "accent", desc: "Issues a write to a logical block address. It has no idea where that address physically lives." },
        { id: "nvme", label: "NVMe Queue", sub: "64K deep", x: 248, y: 152, w: 172, h: 96, desc: "The transport that carries commands to the drive. Deep queues let the drive reorder work for efficiency." },
        { id: "ftl", label: "Flash Translation Layer", sub: "LBA → physical", x: 474, y: 152, w: 190, h: 96, tone: "signal", desc: "The mapping table, wear leveller and garbage collector combined. This is the intelligence of the drive." },
        { id: "pages", label: "NAND Pages", sub: "write target", x: 474, y: 300, w: 190, h: 96, desc: "The unit that can be written. New data always lands in a fresh page." },
        { id: "blocks", label: "Erase Blocks", sub: "~256 pages each", x: 712, y: 300, w: 216, h: 96, desc: "The unit that can be erased. Reclaiming stale pages means copying live data out and erasing the whole block." },
        { id: "gc", label: "Free Block Pool", sub: "what keeps it fast", x: 712, y: 152, w: 216, h: 96, tone: "muted", desc: "A reserve of pre-erased blocks. As long as it is not empty, writes can land immediately at full speed." },
      ],
      edges: [
        { from: "host", to: "nvme", label: "write LBA" },
        { from: "nvme", to: "ftl", label: "command", tone: "accent" },
        { from: "ftl", to: "pages", label: "program", tone: "signal" },
        { from: "pages", to: "blocks" },
        { from: "blocks", to: "gc", label: "reclaim", dashed: true },
        { from: "gc", to: "pages", dashed: true, tone: "accent" },
      ],
      steps: [
        { id: "write", title: "1 · Logical Write", short: "Write", description: "The filesystem hands the drive a logical block address and some data. Nothing about the physical location is specified.", active: ["host", "nvme"], pulses: [{ from: "host", to: "nvme" }], value: "WRITE LBA 0x9F30" },
        { id: "map", title: "2 · Translate", short: "Translate", description: "The FTL looks up where that address currently lives and decides which fresh page the new data should occupy.", active: ["nvme", "ftl"], pulses: [{ from: "nvme", to: "ftl" }], value: "LBA → block 812, page 44" },
        { id: "program", title: "3 · Program", short: "Program", description: "The new data is written to a blank page. The old page is marked stale — it will never be read again.", active: ["ftl", "pages", "blocks"], pulses: [{ from: "ftl", to: "pages" }], value: "page 44 ← data" },
        { id: "gc", title: "4 · Garbage Collect", short: "Reclaim", description: "When stale pages pile up, live pages are copied out, the block is erased, and it returns to the free pool to keep future writes instant.", active: ["blocks", "gc", "pages"], pulses: [{ from: "blocks", to: "gc" }, { from: "gc", to: "pages" }], value: "block 812 reclaimed" },
      ],
    },
    model3d: {
      kind: "ssd",
      exploded: true,
      hotspots: [
        { id: "nand", label: "NAND packages", detail: "The black chips that actually store the charge. Capacity lives here.", position: [0.9, 0.2, 0.2] },
        { id: "ctrl", label: "Controller", detail: "A small processor running the flash translation layer. It decides everything the drive does.", position: [-0.6, 0.25, 0.4] },
        { id: "dram", label: "DRAM cache", detail: "Holds the mapping table so address translation stays fast. Some drives borrow system memory instead.", position: [0, 0.3, 0.9] },
        { id: "conn", label: "M.2 connector", detail: "Carries four PCIe lanes and power straight to the motherboard.", position: [-1.1, -0.1, 0.2] },
      ],
    },
  },
  {
    slug: "gpu",
    title: "What Makes a GPU Different?",
    question: "Why can a graphics card do in milliseconds what a CPU takes seconds to do?",
    summary:
      "A GPU trades per-thread cleverness for thousands of simple threads running at once — the right shape for images, physics and neural networks.",
    category: "computing",
    difficultyDefault: 3,
    explorerCount: 39150,
    rating: 4.8,
    tags: ["SIMT", "rasterization", "shaders", "parallelism"],
    trending: true,
    glyph: "gpu",
    relatedTopics: ["cpu", "neural-net"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "A CPU is a few brilliant workers. A GPU is thousands of ordinary ones — and for the right job, the crowd wins.",
        blocks: [
          {
            type: "p",
            text: "A CPU might have 12 fast cores that can each handle difficult, unpredictable work. A GPU has thousands of small cores that all do the same simple thing at the same time.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Embarrassingly parallel",
            text: "Colouring ten million pixels is ten million nearly identical tasks. Nothing depends on the pixel next door, so you can hand them out to everyone at once.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "A frame is drawn in stages: geometry is transformed, shapes are rasterized into pixels, and each pixel is shaded.",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Vertex stage", text: "Every corner of every triangle is moved into screen space." },
              { title: "Rasterize", text: "Triangles are chopped into the pixels they cover." },
              { title: "Fragment stage", text: "Each covered pixel runs a shader to work out its colour." },
              { title: "Output", text: "Depth and blending decide what is actually visible." },
            ],
          },
          {
            type: "p",
            text: "Every stage is massively parallel and pipelined, which is why thousands of pixels are in different stages simultaneously.",
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "SIMT execution means a group of threads shares one instruction stream, and divergence within a group is expensive.",
        blocks: [
          {
            type: "p",
            text: "Threads are grouped into warps of 32 or 64. They execute together, so if half of them take one branch and half take the other, the hardware runs both paths and masks whichever threads do not apply. The cost is exactly the divergence.",
          },
          {
            type: "stats",
            items: [
              { label: "Stream processors", value: "~16,000", note: "high-end desktop" },
              { label: "VRAM bandwidth", value: "1 TB/s" },
              { label: "FP32 throughput", value: "80 TFLOPS" },
              { label: "Board power", value: "320–450 W" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 10,
        lede: "Throughput hides latency, and a memory hierarchy tuned for streaming keeps all those threads fed.",
        blocks: [
          {
            type: "p",
            text: "Where a CPU uses a big cache to make one thread fast, a GPU uses many warps to hide the wait: when one warp stalls on memory, the scheduler switches to another. Occupancy — the number of resident warps — is the main lever on whether the machine stays busy.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "Shared memory bank conflicts",
            text: "Threads exchange data through fast on-chip shared memory, split into banks. If two threads in a warp address the same bank simultaneously, the access serialises and throughput falls.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Why AI runs here",
            text: "Matrix multiplication is almost perfectly parallel and hugely repetitive. That is precisely the shape GPUs were built for, which is why machine learning moved onto them wholesale.",
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "cpu", label: "CPU", sub: "issues draw calls", x: 26, y: 165, w: 156, h: 90, tone: "accent", desc: "Decides what needs drawing and hands a batch of commands to the GPU. It is the director, not the painter." },
        { id: "cmdbuf", label: "Command Buffer", sub: "queued work", x: 220, y: 165, w: 166, h: 90, desc: "Batches draw calls so the GPU always has work queued and never sits idle between frames." },
        { id: "vertex", label: "Vertex Units", sub: "transform corners", x: 424, y: 36, w: 176, h: 88, desc: "Run the vertex shader on every triangle corner, projecting geometry into screen space." },
        { id: "raster", label: "Rasterizer", sub: "triangles → pixels", x: 424, y: 165, w: 176, h: 90, tone: "signal", desc: "Works out which pixels each triangle covers and generates a fragment for each one." },
        { id: "frag", label: "Fragment Units", sub: "thousands of threads", x: 424, y: 300, w: 176, h: 96, tone: "accent", desc: "The massively parallel heart of the GPU. Each thread shades one fragment, all following the same program." },
        { id: "rop", label: "ROP & Blend", sub: "depth, blending", x: 640, y: 165, w: 150, h: 90, desc: "Decides which fragments survive the depth test and blends translucent ones into the frame." },
        { id: "vram", label: "VRAM", sub: "huge, fast bandwidth", x: 640, y: 300, w: 150, h: 96, tone: "muted", desc: "Holds textures, geometry and framebuffers. Bandwidth here matters more than size for streaming work." },
        { id: "display", label: "Display", sub: "the finished frame", x: 828, y: 165, w: 112, h: 90, desc: "The completed frame is scanned out — 60, 120 or more times per second." },
      ],
      edges: [
        { from: "cpu", to: "cmdbuf", label: "draw calls" },
        { from: "cmdbuf", to: "vertex", label: "geometry" },
        { from: "vertex", to: "raster", label: "triangles" },
        { from: "raster", to: "frag", label: "fragments", tone: "signal" },
        { from: "vram", to: "frag", label: "textures", dashed: true },
        { from: "frag", to: "rop", label: "shaded", tone: "accent" },
        { from: "rop", to: "display" },
      ],
      steps: [
        { id: "issue", title: "1 · Issue Work", short: "Issue", description: "The CPU submits a batch of draw calls describing geometry, materials and state. The GPU consumes them from the command buffer.", active: ["cpu", "cmdbuf"], pulses: [{ from: "cpu", to: "cmdbuf" }], value: "2,140 draw calls" },
        { id: "vertex", title: "2 · Transform", short: "Vertex", description: "Vertex units run the same shader on every corner of every triangle, all at once.", active: ["cmdbuf", "vertex"], pulses: [{ from: "cmdbuf", to: "vertex" }], value: "4.2M vertices" },
        { id: "raster", title: "3 · Rasterize", short: "Rasterize", description: "Triangles become pixel-sized fragments. This is where coverage is determined.", active: ["vertex", "raster"], pulses: [{ from: "vertex", to: "raster" }], value: "8.3M fragments" },
        { id: "shade", title: "4 · Shade & Output", short: "Shade", description: "Thousands of threads shade fragments in parallel, reading textures from VRAM. ROPs apply depth and blending, and the frame is displayed.", active: ["frag", "rop", "display", "vram"], pulses: [{ from: "raster", to: "frag" }, { from: "frag", to: "rop" }, { from: "rop", to: "display" }], value: "16.6 ms → 60 fps" },
      ],
    },
    model3d: {
      kind: "gpu",
      exploded: true,
      hotspots: [
        { id: "die", label: "GPU die", detail: "The largest silicon die in a consumer PC — tens of billions of transistors of parallel hardware.", position: [0, 0.36, 0] },
        { id: "shroud", label: "Shroud & fans", detail: "Moves 300+ watts of heat out of a dense package. Airflow is a first-class engineering problem.", position: [0, 0.7, -0.8] },
        { id: "vram", label: "VRAM modules", detail: "Ring the die to keep memory traces short and bandwidth high.", position: [-1, 0.15, 0.5] },
        { id: "pcie", label: "PCIe edge", detail: "The slot interface carrying commands, data and up to 75 W of slot power.", position: [0, -0.65, 0.5] },
      ],
    },
  },
];

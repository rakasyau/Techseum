import type { Topic } from "../../types";

export const electronicsTopics: Topic[] = [
  {
    slug: "battery",
    title: "How a Battery Delivers Power",
    question: "Where does the electricity in a battery actually come from?",
    summary:
      "A battery is a controlled chemical reaction. Lithium ions shuttle between two electrodes, and the electrons they leave behind travel the long way round — through your device.",
    category: "electronics",
    difficultyDefault: 2,
    explorerCount: 23410,
    rating: 4.6,
    tags: ["lithium-ion", "electrochemistry", "voltage", "charging"],
    glyph: "battery",
    relatedTopics: ["bluetooth", "touchscreen"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "A battery does not store electricity. It stores chemicals that are willing to react, and releasing them produces current on demand.",
        blocks: [
          {
            type: "p",
            text: "Inside a battery are two electrodes and an electrolyte between them. One side wants to give up electrons, the other wants to accept them. Blocking the direct path forces those electrons to travel through your circuit instead.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Voltage is pressure",
            text: "Voltage is not the amount of energy available — it is the push on each electron. Capacity, measured in amp-hours, is the total quantity of charge you can move.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "Lithium ions move between a graphite anode and a metal-oxide cathode, while electrons are forced through the external circuit.",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Discharge", text: "Lithium leaves the anode and travels through the electrolyte to the cathode." },
              { title: "Electrons detour", text: "Electrons cannot cross the electrolyte, so they flow through your device." },
              { title: "Charge", text: "An external voltage pushes the whole process backwards." },
              { title: "Intercalate", text: "Ions slot back into the anode's layered structure." },
            ],
          },
          {
            type: "p",
            text: "That detour is the entire point. The useful current is the electron flow through the external circuit, and it exactly balances the ion traffic inside.",
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "Charging is not a constant current — it follows a carefully staged profile to avoid damaging the cell.",
        blocks: [
          {
            type: "p",
            text: "Below about 20% the charger applies a steady current and the voltage climbs. Once the cell reaches its maximum voltage the charger holds that voltage constant and watches the current taper. The final slow stage is why phones charge quickly to 80% and then more slowly.",
          },
          {
            type: "stats",
            items: [
              { label: "Cell voltage", value: "3.0–4.2 V", note: "typical Li-ion window" },
              { label: "Peak charging", value: "0.5–1 C", note: "normalised to capacity" },
              { label: "Cycle life", value: "500–1,000", note: "to 80% capacity" },
              { label: "Self-discharge", value: "2–3%", note: "per month" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 10,
        lede: "Degradation comes from the interfaces, and thermal management is the single largest lever on longevity.",
        blocks: [
          {
            type: "p",
            text: "Every cycle grows a slightly thicker passivation layer on the anode and consumes a little lithium and electrolyte. Fast charging accelerates it because the same reaction is driven harder, which is why heat is the enemy of battery life.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "Thermal runaway",
            text: "If a cell overheats, the reactions become self-accelerating. That is why packs use shutdown separators, current-interrupt devices and per-cell monitoring.",
          },
          {
            type: "compare",
            left: { title: "Ageing faster", items: ["Sustained heat", "Charging to 100% daily", "Deep discharge", "Very fast charging"] },
            right: { title: "Ageing slower", items: ["Cool operation", "Charging to 80%", "Partial cycles", "Moderate rates"] },
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "anode", label: "Anode", sub: "graphite", x: 130, y: 140, w: 150, h: 200, tone: "accent", desc: "The negative electrode. Stores lithium ions between layers of carbon when charged." },
        { id: "cathode", label: "Cathode", sub: "metal oxide", x: 690, y: 140, w: 150, h: 200, tone: "signal", desc: "The positive electrode. Accepts lithium ions during discharge and gives them back while charging." },
        { id: "electrolyte", label: "Electrolyte", sub: "lets ions through, blocks electrons", x: 300, y: 178, w: 360, h: 124, shape: "box", tone: "muted", desc: "A medium that lets lithium ions pass but blocks electrons entirely. This is what forces the useful current outside the cell." },
        { id: "device", label: "Your Device", sub: "the load", x: 400, y: 26, w: 160, h: 74, tone: "muted", desc: "The circuit the electrons are forced through — a phone, motor or screen." },
        { id: "ions", label: "Lithium Ions", sub: "through electrolyte", x: 400, y: 330, w: 160, h: 66, desc: "Positive lithium ions shuttle back and forth between the electrodes, carrying the reaction." },
        { id: "electrons", label: "Electrons", sub: "external path only", x: 152, y: 26, w: 168, h: 74, tone: "accent", desc: "Cannot cross the electrolyte. Their only route is through the external circuit, and that route is your electricity." },
      ],
      edges: [
        { from: "anode", to: "ions", label: "release", tone: "accent" },
        { from: "ions", to: "cathode", label: "intercalate", tone: "signal" },
        { from: "anode", to: "electrons", label: "detour" },
        { from: "electrons", to: "device" },
        { from: "device", to: "cathode", label: "current" },
      ],
      steps: [
        { id: "release", title: "1 · Release Ions", short: "Release", description: "Lithium ions leave the layered graphite anode and enter the electrolyte, ready to migrate.", active: ["anode", "ions"], pulses: [{ from: "anode", to: "ions" }], value: "anode gives up Li+" },
        { id: "migrate", title: "2 · Migrate", short: "Migrate", description: "The ions drift through the electrolyte toward the cathode. Electrons cannot follow them, so they are pushed into the external circuit.", active: ["ions", "electrolyte", "electrons"], pulses: [{ from: "ions", to: "electrolyte" }], value: "ions cross ~120 um" },
        { id: "power", title: "3 · Power the Device", short: "Power", description: "Electrons flow through your device, doing the useful work — lighting the screen, driving a motor, running a radio.", active: ["electrons", "device", "anode"], pulses: [{ from: "electrons", to: "device" }], value: "3.7 V nominal" },
        { id: "arrive", title: "4 · Arrive & Reverse", short: "Arrive", description: "The electrons rejoin the cathode, completing the circuit. Apply external voltage and the entire process runs backwards, recharging the cell.", active: ["cathode", "device", "electrons"], pulses: [{ from: "device", to: "cathode" }], value: "discharge complete" },
      ],
    },
    model3d: {
      kind: "battery",
      exploded: true,
      hotspots: [
        { id: "anode", label: "Anode (graphite)", detail: "The negative electrode where lithium is stored when charged. Its layered structure is the reason ions can slot in and out.", position: [-0.6, 0.2, 0] },
        { id: "separator", label: "Separator", detail: "A porous film keeping the electrodes apart. It blocks electrons and shuts down if the cell overheats.", position: [0, 0.2, 0] },
        { id: "cathode", label: "Cathode (oxide)", detail: "The positive electrode. Its chemistry largely sets the cell's voltage and energy density.", position: [0.6, 0.2, 0] },
        { id: "bms", label: "Battery management", detail: "Monitors voltage, current and temperature per cell and balances charge across the pack.", position: [0, -0.4, 0.6] },
      ],
    },
  },
  {
    slug: "touchscreen",
    title: "How Touchscreens Sense Your Finger",
    question: "How does a sheet of glass know exactly where you pressed?",
    summary:
      "A capacitive screen maintains a grid of tiny electric fields. Your finger disturbs them, and the controller works out where by measuring which intersections changed.",
    category: "electronics",
    difficultyDefault: 2,
    explorerCount: 21260,
    rating: 4.6,
    tags: ["capacitance", "ITO", "multitouch", "controller"],
    glyph: "phone",
    relatedTopics: ["battery", "camera"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "Your finger is a conductor. The screen notices because your touch changes an electric field it is constantly measuring.",
        blocks: [
          {
            type: "p",
            text: "Behind the glass is an invisible lattice of transparent electrodes. Electricity does not flow into your finger; instead, your finger slightly changes how each intersection behaves, and the screen watches that change.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Why gloves fail",
            text: "A fabric glove is an insulator. Without a conductive path, the field barely changes and the screen cannot tell you are there.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "The screen scans row by row, measuring the capacitance at each crossing of the electrode grid.",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Drive a row", text: "A voltage is applied to one horizontal electrode." },
              { title: "Sweep columns", text: "Every vertical electrode is measured in turn." },
              { title: "Detect dips", text: "A finger pulls charge away, lowering the reading." },
              { title: "Interpolate", text: "The controller calculates a smooth coordinate." },
            ],
          },
          {
            type: "p",
            text: "Scanning the entire grid takes a few milliseconds. That fast, repeated sweep is why the screen tracks your finger as smoothly as it does.",
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "The electrodes are a transparent conductor called indium tin oxide, and the measured signal is tiny.",
        blocks: [
          {
            type: "p",
            text: "Mutual capacitance measures the coupling between a specific row and column. A touch reduces that coupling by a small amount, often under a picofarad, on top of a much larger baseline. The controller's real job is separating signal from noise.",
          },
          {
            type: "stats",
            items: [
              { label: "Grid nodes", value: "~10,000", note: "on a phone panel" },
              { label: "Signal change", value: "<1 pF" },
              { label: "Scan rate", value: "60–240 Hz" },
              { label: "Latency", value: "<10 ms" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 9,
        lede: "Touch controllers use differential sensing, filtering and prediction to survive electrical noise from the display itself.",
        blocks: [
          {
            type: "p",
            text: "A panel that both displays and senses is fighting itself: the display's drive signals couple straight into the sensing electrodes. Controllers use differential measurements, frequency schemes and timing to keep the display and touch operating without corrupting each other.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Palm rejection and prediction",
            text: "Modern controllers model contact size, pressure and motion, so they can ignore a resting palm and predict where a fast swipe is heading before it arrives.",
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "finger", label: "Finger", sub: "conductor", x: 380, y: 26, w: 200, h: 76, tone: "accent", desc: "A conductive, grounded object. It need not press hard — proximity alone changes the field." },
        { id: "glass", label: "Cover Glass", sub: "insulator", x: 340, y: 126, w: 280, h: 56, tone: "muted", desc: "Protects the electrodes beneath. It is an insulator, so charge never actually flows into your finger." },
        { id: "rx", label: "Receive Electrodes", sub: "columns", x: 340, y: 206, w: 280, h: 64, tone: "signal", desc: "Measured one at a time. A finger nearby pulls charge away and lowers the reading at that column." },
        { id: "tx", label: "Drive Electrodes", sub: "rows", x: 340, y: 296, w: 280, h: 64, tone: "accent", desc: "Rows are driven one at a time with a known voltage, so the controller always knows which row it is testing." },
        { id: "ctrl", label: "Touch Controller", sub: "finds the coordinate", x: 700, y: 196, w: 236, h: 104, desc: "Sweeps the grid, subtracts the baseline, and interpolates the exact coordinate of every contact — including several at once." },
        { id: "noise", label: "Noise Filtering", sub: "display interference", x: 24, y: 196, w: 232, h: 104, tone: "muted", desc: "The display's own drive signals couple into the sensors. Filtering them out is the hardest part of the design." },
      ],
      edges: [
        { from: "finger", to: "glass", dashed: true, label: "proximity" },
        { from: "glass", to: "rx", label: "field changes" },
        { from: "tx", to: "rx", label: "mutual C", tone: "signal" },
        { from: "rx", to: "ctrl", label: "scan" },
        { from: "noise", to: "ctrl", dashed: true, tone: "muted" },
      ],
      steps: [
        { id: "baseline", title: "1 · Baseline Scan", short: "Baseline", description: "With nothing touching, the controller measures every row-column intersection and records those values as the baseline.", active: ["tx", "rx", "ctrl"], pulses: [{ from: "tx", to: "rx" }], value: "10,000 nodes sampled" },
        { id: "approach", title: "2 · Finger Approaches", short: "Approach", description: "Your finger enters the electric field above the glass. Nothing touches anything, but nearby intersections start to change.", active: ["finger", "glass", "rx"], pulses: [{ from: "finger", to: "glass" }], value: "change of about 0.4 pF" },
        { id: "scan", title: "3 · Detect the Dip", short: "Detect", description: "Rows are driven in turn and columns swept. Intersections under the finger read lower than baseline.", active: ["tx", "rx", "noise"], pulses: [{ from: "tx", to: "rx" }], value: "peak at row 14, col 22" },
        { id: "locate", title: "4 · Locate & Track", short: "Locate", description: "The controller interpolates across neighbouring nodes to produce a smooth coordinate, then repeats the whole sweep dozens of times per second.", active: ["ctrl", "noise"], pulses: [{ from: "rx", to: "ctrl" }], value: "(x=412, y=688) at 120 Hz" },
      ],
    },
    model3d: {
      kind: "phone",
      exploded: true,
      hotspots: [
        { id: "glass", label: "Cover glass", detail: "Chemically strengthened and optically bonded so there is no air gap between glass and panel.", position: [0, 0.75, 0] },
        { id: "touch", label: "Touch sensor layer", detail: "A transparent grid of indium tin oxide electrodes, invisible because it is only nanometres thin.", position: [0, 0.4, 0] },
        { id: "oled", label: "OLED panel", detail: "Millions of self-emitting pixels. Because it emits rather than filters, it can be paper-thin and flexible.", position: [0, 0.05, 0] },
        { id: "board", label: "Logic board", detail: "The SoC, memory and controllers live here, along with the display's own driver IC.", position: [0, -0.5, 0.2] },
      ],
    },
  },
];

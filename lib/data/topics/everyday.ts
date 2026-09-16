import type { Topic } from "../../types";

export const everydayTopics: Topic[] = [
  {
    slug: "camera",
    title: "How a Camera Captures Light",
    question: "How does a lens and a sensor turn the world into a photograph?",
    summary:
      "Light passes through a lens, is focused onto a sensor, and each pixel converts photons into an electrical charge. Aperture, shutter and ISO set the exposure budget.",
    category: "everyday",
    difficultyDefault: 2,
    tags: ["optics", "CMOS", "exposure", "aperture"],
    featured: true,
    glyph: "camera",
    relatedTopics: ["touchscreen", "gpu"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "A camera is a light funnel. The lens bends incoming rays so they land in the right place on a sensor instead of spreading out.",
        blocks: [
          {
            type: "p",
            text: "The world reflects light in every direction. A lens collects a cone of those rays from each point and bends them so every point converges to a matching spot on the sensor. The sensor records how bright each spot was.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Focus is the convergence point",
            text: "When the light from a point does not quite converge on the sensor, that point spreads into a blur. Autofocus moves the lens until the blur is smallest.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "Three controls decide exposure: how wide the opening is, how long it stays open, and how much the signal is amplified.",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Aperture", text: "The size of the opening. Wider lets in more light and blurs the background more." },
              { title: "Shutter", text: "How long the sensor is exposed. Longer gathers more light but blurs motion." },
              { title: "ISO", text: "Amplification applied to the signal, at the cost of added noise." },
              { title: "Balance", text: "Together these three set the overall brightness." },
            ],
          },
          {
            type: "p",
            text: "Any change to one can be compensated by the others — a wide aperture and fast shutter can capture the same brightness as a narrow aperture and slow shutter, but the images will not look the same.",
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "A CMOS sensor converts photons to electrons, and the resulting charge is read out row by row.",
        blocks: [
          {
            type: "p",
            text: "Each pixel has a photodiode that accumulates charge proportional to the light that hits it, plus transistors that reset it and let the charge be read. The analogue value is amplified by ISO gain and digitised by an ADC.",
          },
          {
            type: "stats",
            items: [
              { label: "Full-frame size", value: "36 x 24 mm" },
              { label: "Photosite", value: "3–6 um" },
              { label: "Bit depth", value: "12–14 bit", note: "per channel, raw" },
              { label: "Readout", value: "1/250 s", note: "rolling shutter" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 10,
        lede: "Low-light quality is bounded by photon statistics, and read noise sets the floor no amount of amplification can beat.",
        blocks: [
          {
            type: "p",
            text: "In dim light the number of photons per pixel becomes small enough that random variation dominates, which is why shadows look grainy. Raising ISO makes the grain more visible; it cannot create information that was not captured.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "Rolling shutter",
            text: "Most sensors expose and read rows sequentially. If the scene or the camera moves during readout, vertical lines can tilt — a distortion that gets worse with faster motion and slower readout.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Why computational photography wins",
            text: "Stacking several frames reduces random noise because the signal is consistent while the noise is not. That is how small sensors produce clean-looking night shots.",
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "scene", label: "Scene", sub: "reflected light", x: 26, y: 160, w: 150, h: 96, tone: "muted", desc: "Every point in the scene reflects light in all directions. The camera only collects a narrow cone of it." },
        { id: "lens", label: "Lens Elements", sub: "focuses rays", x: 214, y: 160, w: 158, h: 96, tone: "accent", desc: "A stack of glass elements bends light so that rays from a point converge again on the sensor." },
        { id: "aperture", label: "Aperture", sub: "iris diameter", x: 410, y: 34, w: 168, h: 84, tone: "signal", desc: "Controls how much light enters and how deep the in-focus region is. Wide open means more light and shallower depth of field." },
        { id: "shutter", label: "Shutter", sub: "exposure time", x: 410, y: 160, w: 168, h: 96, desc: "Decides how long light is allowed to reach the sensor. Long enough to gather light, short enough to freeze motion." },
        { id: "sensor", label: "CMOS Sensor", sub: "photons to charge", x: 616, y: 160, w: 168, h: 96, tone: "accent", desc: "Millions of photodiodes, each accumulating charge in proportion to the light it receives." },
        { id: "adc", label: "Readout & ADC", sub: "charge to numbers", x: 616, y: 300, w: 168, h: 96, desc: "Row by row, each pixel's charge is amplified and digitised into a number the processor can store." },
        { id: "isp", label: "Image Processor", sub: "demosaic, denoise", x: 812, y: 160, w: 122, h: 96, tone: "signal", desc: "Turns raw numbers into a viewable image: white balance, demosaicing, noise reduction and sharpening." },
      ],
      edges: [
        { from: "scene", to: "lens", label: "rays", tone: "accent" },
        { from: "lens", to: "aperture", label: "limited by" },
        { from: "aperture", to: "shutter" },
        { from: "shutter", to: "sensor", label: "expose" },
        { from: "sensor", to: "adc", label: "charge", tone: "signal" },
        { from: "adc", to: "isp", label: "raw data" },
      ],
      steps: [
        { id: "collect", title: "1 · Collect Light", short: "Collect", description: "The lens gathers a cone of rays from every point in the scene and bends them toward the sensor.", active: ["scene", "lens"], pulses: [{ from: "scene", to: "lens" }], value: "f/2.8 cone" },
        { id: "meter", title: "2 · Set Exposure", short: "Expose", description: "The aperture widens or narrows and the shutter opens for a set time, together deciding how much light reaches the sensor.", active: ["lens", "aperture", "shutter"], pulses: [{ from: "lens", to: "aperture" }, { from: "aperture", to: "shutter" }], value: "1/250 s at f/4" },
        { id: "accumulate", title: "3 · Accumulate Charge", short: "Accumulate", description: "Each photodiode converts incoming photons into electrons. Brighter spots collect more charge than darker ones.", active: ["shutter", "sensor"], pulses: [{ from: "shutter", to: "sensor" }], value: "well capacity ~30,000 e-" },
        { id: "read", title: "4 · Read & Process", short: "Read out", description: "The sensor is read row by row, each value is digitised, and the image processor reconstructs a full colour image.", active: ["sensor", "adc", "isp"], pulses: [{ from: "sensor", to: "adc" }, { from: "adc", to: "isp" }], value: "24 MP at 14-bit" },
      ],
    },
    model3d: {
      kind: "camera",
      exploded: true,
      hotspots: [
        { id: "lens", label: "Lens assembly", detail: "Multiple glass elements, some moving to focus and some to stabilise against shake.", position: [0, 0.1, 1] },
        { id: "iris", label: "Aperture blades", detail: "Overlapping blades that open and close to set the f-number.", position: [0, 0.1, 0.45] },
        { id: "sensor", label: "Image sensor", detail: "The silicon chip where photons become electrons. Its size drives low-light performance.", position: [0, 0.05, 0] },
        { id: "shutter", label: "Shutter", detail: "Covers and uncovers the sensor for the exact exposure time.", position: [0, 0.1, -0.3] },
      ],
    },
  },
  {
    slug: "smartphone",
    title: "What Is Inside a Smartphone?",
    question: "How do a camera, radio, screen and battery fit in something that thin?",
    summary:
      "A phone is a stack of specialised systems sharing one battery: a system-on-chip, memory, radios, sensors, battery and display, all communicating over shared buses.",
    category: "everyday",
    difficultyDefault: 3,
    tags: ["SoC", "integration", "sensors", "power budget"],
    glyph: "phone",
    relatedTopics: ["cpu", "battery", "wifi"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "A smartphone is not one computer — it is several specialised computers sharing a battery and a screen.",
        blocks: [
          {
            type: "p",
            text: "The main chip handles general work, but the camera, the radio and the motion sensors each have their own dedicated processors. That is how a phone can track your steps without waking the main chip.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Everything is a power trade",
            text: "The screen and the radio are usually the two biggest drains. Most engineering decisions in a phone are really decisions about battery.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "The system-on-chip integrates the CPU, GPU, memory controller, image processor and radios into one package.",
        blocks: [
          {
            type: "p",
            text: "Putting everything on one die shortens the distances signals travel, which lowers power and increases speed. It also constrains thermal design, because all that heat is produced in a few square millimetres.",
          },
          {
            type: "steps",
            items: [
              { title: "Sensor", text: "Captures a physical quantity." },
              { title: "Hub", text: "A low-power chip aggregates readings continuously." },
              { title: "SoC", text: "The main processors handle anything demanding." },
              { title: "Radio", text: "Sends results out, if anything needs them." },
            ],
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "Components talk over shared buses, and sensors are deliberately kept on the lowest-power path possible.",
        blocks: [
          {
            type: "p",
            text: "The camera connects over MIPI, storage over UFS, and low-speed peripherals over I2C or SPI. Each bus has a bandwidth and a power cost, and designers route work to the cheapest bus that can carry it.",
          },
          {
            type: "stats",
            items: [
              { label: "SoC transistors", value: "~20 billion" },
              { label: "Battery", value: "4,500 mAh", note: "typical" },
              { label: "Display", value: "1,200 nits", note: "peak outdoor" },
              { label: "Radios", value: "6+", note: "including always-on" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 10,
        lede: "Power and thermal budgets are co-designed, and sensors run on dedicated low-power islands to stay always-on.",
        blocks: [
          {
            type: "p",
            text: "A phone cannot dissipate more than a few watts for long without becoming uncomfortable, so the SoC schedules bursts of work and then returns to a deep sleep state. Sustained performance is limited by thermals, not by peak capability.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Sensor fusion",
            text: "No single sensor is reliable alone. Combining accelerometer, gyroscope and magnetometer with software gives orientation that is more stable than any one chip could produce.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "The heat wall",
            text: "Sustained workloads such as gaming or video recording push the phone to its thermal limit, and the system deliberately lowers clocks to stay within it.",
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "sensors", label: "Sensor Cluster", sub: "accel, gyro, light", x: 26, y: 34, w: 172, h: 88, desc: "Always-on physical sensors. Each converts a real-world quantity into an electrical reading." },
        { id: "hub", label: "Low-Power Hub", sub: "stays awake", x: 26, y: 152, w: 172, h: 96, tone: "muted", desc: "An always-on chip that aggregates sensor data so the main processor can remain asleep." },
        { id: "soc", label: "System-on-Chip", sub: "CPU, GPU, NPU, ISP", x: 246, y: 152, w: 186, h: 96, tone: "accent", desc: "The main computer. Integrating so much on one die shortens signal paths, saving power and space." },
        { id: "mem", label: "Memory & Storage", sub: "RAM + UFS", x: 246, y: 300, w: 186, h: 96, desc: "Volatile working memory and fast flash storage, connected over high-bandwidth serial links." },
        { id: "radio", label: "Radios", sub: "5G, Wi-Fi, Bluetooth", x: 478, y: 34, w: 178, h: 88, tone: "signal", desc: "Separate radios for different networks, each largely independent so one can sleep while another works." },
        { id: "camera", label: "Camera Module", sub: "sensor + ISP", x: 478, y: 152, w: 178, h: 96, desc: "Optics plus sensor plus image processor, often with dedicated memory to handle bursts of frames." },
        { id: "display", label: "Display Panel", sub: "the biggest drain", x: 478, y: 300, w: 178, h: 96, tone: "accent", desc: "Frequently the largest single consumer of power, especially at high brightness outdoors." },
        { id: "battery", label: "Battery & PMIC", sub: "the shared budget", x: 716, y: 152, w: 218, h: 96, tone: "muted", desc: "Every subsystem draws from one battery. The power management IC arbitrates who gets what." },
      ],
      edges: [
        { from: "sensors", to: "hub", label: "readings" },
        { from: "hub", to: "soc", label: "wake on event", tone: "accent" },
        { from: "soc", to: "mem", label: "load / store" },
        { from: "soc", to: "radio", label: "network", tone: "signal" },
        { from: "soc", to: "camera", label: "MIPI" },
        { from: "soc", to: "display", label: "render" },
        { from: "battery", to: "soc", label: "power" },
        { from: "battery", to: "display", dashed: true, tone: "muted" },
      ],
      steps: [
        { id: "sense", title: "1 · Sense", short: "Sense", description: "An always-on sensor detects a change — motion, light, a tap — without waking the main processor.", active: ["sensors", "hub"], pulses: [{ from: "sensors", to: "hub" }], value: "tilt detected" },
        { id: "wake", title: "2 · Wake the SoC", short: "Wake", description: "When a reading matters, the low-power hub wakes the system-on-chip. The CPU, GPU and neural engine come online.", active: ["hub", "soc", "mem", "battery"], pulses: [{ from: "hub", to: "soc" }], value: "SoC active" },
        { id: "act", title: "3 · Do the Work", short: "Work", description: "The SoC renders the interface, processes camera frames and runs any neural workloads, drawing on memory and storage.", active: ["soc", "mem", "camera", "display"], pulses: [{ from: "soc", to: "mem" }, { from: "camera", to: "soc" }], value: "frame rendered" },
        { id: "broadcast", title: "4 · Broadcast & Sleep", short: "Send", description: "Anything that needs to leave goes out over the radios, and every subsystem returns to its lowest power state as quickly as possible.", active: ["radio", "battery", "display"], pulses: [{ from: "soc", to: "radio" }], value: "radio idle again" },
      ],
    },
    model3d: {
      kind: "phone",
      exploded: true,
      hotspots: [
        { id: "display", label: "Display stack", detail: "Cover glass, touch layer and OLED panel bonded into one unit a couple of millimetres thick.", position: [0, 0.7, 0] },
        { id: "battery", label: "Battery", detail: "Usually the single largest internal component, and the constraint every other part competes against.", position: [0, -0.1, 0] },
        { id: "board", label: "Logic board", detail: "The SoC, memory and radios packed into one dense area, with heavy shielding between them.", position: [0, 0.2, 0.35] },
        { id: "camera", label: "Camera module", detail: "Lens, sensor and stabiliser assembled as a single sealed part.", position: [-0.55, 0.4, 0.3] },
      ],
    },
  },
];

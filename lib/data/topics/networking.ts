import type { Topic } from "../../types";

export const networkingTopics: Topic[] = [
  {
    slug: "wifi",
    title: "How Wi-Fi Carries Data",
    question: "What is actually flying through the air between your phone and the router?",
    summary:
      "Wi-Fi is radio. Your data is modulated onto carrier waves, transmitted in tiny time slices across shared channels, and reassembled at the other end.",
    category: "networking",
    difficultyDefault: 2,
    tags: ["radio", "OFDM", "channels", "802.11"],
    featured: true,
    trending: true,
    glyph: "router",
    learningPath: "Understanding the Internet",
    relatedTopics: ["bluetooth", "cpu"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "Wi-Fi is radio — the same family of waves as FM broadcast, just much higher frequency and much shorter range.",
        blocks: [
          {
            type: "p",
            text: "Your router and phone each have an aerial. The router turns data into a rapidly changing radio signal; your phone's aerial picks it up and turns it back into data. Nothing is actually travelling as 'internet' — it is just waves.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Why walls matter",
            text: "Higher frequencies carry more data but travel shorter distances and penetrate walls worse. That is the whole trade-off behind the names 2.4 GHz and 5 GHz.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "The channel is shared politely: devices take turns in tiny slots, and each slot carries many sub-carriers at once.",
        blocks: [
          {
            type: "p",
            text: "Only one device should transmit at a time on a channel, so Wi-Fi listens first, waits a random moment, and then sends. If two devices pick the same moment, both stop and retry — that is a collision.",
          },
          {
            type: "steps",
            items: [
              { title: "Listen", text: "Check that the channel is quiet." },
              { title: "Wait", text: "Pause a random short interval." },
              { title: "Transmit", text: "Send a frame in one time slot." },
              { title: "Acknowledge", text: "The receiver confirms; silence means retry." },
            ],
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "OFDM splits one wide channel into many narrow sub-carriers that each carry a slow stream — together they are fast and robust.",
        blocks: [
          {
            type: "p",
            text: "Narrow sub-carriers are resilient to multipath: when reflections cause some frequencies to cancel, most sub-carriers still arrive intact. Modulation adapts per sub-carrier — QAM for clean conditions, a simpler scheme when the signal is weak.",
          },
          {
            type: "stats",
            items: [
              { label: "Sub-carriers", value: "~2000", note: "in a 160 MHz Wi-Fi 6 channel" },
              { label: "Highest QAM", value: "1024-QAM", note: "10 bits per symbol" },
              { label: "Slot time", value: "9 µs" },
              { label: "Range indoors", value: "10–50 m" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 10,
        lede: "MU-MIMO and OFDMA let one access point serve several clients inside a single transmission rather than one at a time.",
        blocks: [
          {
            type: "p",
            text: "OFDMA divides a channel's sub-carriers among multiple clients simultaneously, so a small packet no longer wastes an entire time slot. MU-MIMO uses multiple antennas to form separate spatial streams to different devices.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "The hidden-node problem",
            text: "Two devices that cannot hear each other can both transmit to the access point at once. RTS/CTS was designed to reduce the resulting collisions.",
          },
          {
            type: "p",
            text: "In dense environments the limit is not your link speed but airtime: everyone on the channel divides the same time budget, and an old slow client can consume far more than its share.",
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "app", label: "Your Device", sub: "data to send", x: 26, y: 165, w: 156, h: 90, tone: "accent", desc: "An application hands a packet to the network stack, which wraps it for wireless transmission." },
        { id: "baseband", label: "Baseband", sub: "bits → symbols", x: 216, y: 165, w: 160, h: 90, desc: "Groups bits into symbols and maps them onto sub-carriers using QAM. More bits per symbol means more speed but less tolerance for noise." },
        { id: "radio", label: "Radio Front End", sub: "carrier wave", x: 410, y: 165, w: 166, h: 90, tone: "signal", desc: "Modulates the symbols onto a carrier frequency in the 2.4 or 5 GHz band and drives the aerial." },
        { id: "air", label: "The Air", sub: "shared medium", x: 410, y: 34, w: 166, h: 92, desc: "A shared, noisy, half-duplex medium. Everything here competes for the same tiny time slots." },
        { id: "ant", label: "Access Point", sub: "receives", x: 610, y: 165, w: 156, h: 90, desc: "Listens on the channel, demodulates what it hears, and sends an acknowledgement." },
        { id: "router", label: "Router", sub: "routes onward", x: 800, y: 165, w: 140, h: 90, tone: "accent", desc: "Forwards the packet onto the wired network. The internet starts here." },
        { id: "retry", label: "Retry & Backoff", sub: "when it collides", x: 410, y: 300, w: 166, h: 96, tone: "muted", desc: "If no acknowledgement arrives, the device waits a random backoff and tries again. Invisible, constant, and it is why crowded networks feel slow." },
      ],
      edges: [
        { from: "app", to: "baseband", label: "packet" },
        { from: "baseband", to: "radio", label: "symbols" },
        { from: "radio", to: "air", label: "modulate", tone: "signal" },
        { from: "air", to: "ant", label: "propagate", dashed: true },
        { from: "ant", to: "router", label: "frame" },
        { from: "retry", to: "radio", dashed: true, tone: "muted" },
      ],
      steps: [
        { id: "frame", title: "1 · Build Frame", short: "Frame", description: "An application's data is wrapped in headers that name the source, destination and channel, then handed to the wireless stack.", active: ["app", "baseband"], pulses: [{ from: "app", to: "baseband" }], value: "1,500-byte payload" },
        { id: "modulate", title: "2 · Modulate", short: "Modulate", description: "Bits become QAM symbols, spread across hundreds of sub-carriers, riding on a carrier wave that the aerial launches.", active: ["baseband", "radio", "air"], pulses: [{ from: "baseband", to: "radio" }, { from: "radio", to: "air" }], value: "1024-QAM · OFDM" },
        { id: "listen", title: "3 · Contend", short: "Contend", description: "The transmitter checks the channel is idle before sending. If a collision happens, both senders back off and wait a random interval.", active: ["air", "retry"], pulses: [{ from: "retry", to: "air" }], value: "channel idle → send" },
        { id: "ack", title: "4 · Acknowledge", short: "Acknowledge", description: "The access point demodulates the frame and replies with an acknowledgement. Only then does the sender move on to the next packet.", active: ["ant", "router"], pulses: [{ from: "air", to: "ant" }, { from: "ant", to: "router" }], value: "ACK received" },
      ],
    },
    model3d: {
      kind: "router",
      exploded: false,
      hotspots: [
        { id: "antennas", label: "Antennas", detail: "Multiple aerials allow beamforming to steer signal toward a client rather than spraying it everywhere.", position: [0, 0.8, 0] },
        { id: "soc", label: "Wi-Fi SoC", detail: "Runs the baseband, modulation and MAC coordination. Most of the work happens in this one chip.", position: [0, 0.28, 0] },
        { id: "radio", label: "RF chain", detail: "Converts digital symbols to radio frequency and back, one chain per antenna stream.", position: [0.8, 0.22, 0.4] },
        { id: "ports", label: "Ethernet ports", detail: "The wired side — where the wireless network joins the internet.", position: [-0.6, -0.2, 0.7] },
      ],
    },
  },
  {
    slug: "bluetooth",
    title: "How Bluetooth Stays Connected",
    question: "How do wireless earbuds hold a call without draining your battery?",
    summary:
      "Bluetooth is designed for short range and tiny power budgets. It hops between frequencies, keeps a strict schedule, and negotiates exactly how much bandwidth each service needs.",
    category: "networking",
    difficultyDefault: 2,
    tags: ["BLE", "frequency hopping", "pairing", "piconet"],
    glyph: "module",
    relatedTopics: ["wifi", "battery"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "Bluetooth is a very low-power radio for very short distances — personal area networking, not internet access.",
        blocks: [
          {
            type: "p",
            text: "It was built to replace cables between your own devices: earbuds, watch, keyboard, mouse. Low power matters more than raw speed, so it sends far less data than Wi-Fi.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Two modes, one radio",
            text: "Classic Bluetooth streams continuously for audio, while Bluetooth Low Energy wakes up only briefly to send a reading. A watch can run for weeks on it.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "Devices pair once, then share a secret so every later connection is trusted without repeating the process.",
        blocks: [
          {
            type: "p",
            text: "During pairing the two devices agree on a shared key. That key lets them reconnect privately. This is why you only approve a device once.",
          },
          {
            type: "steps",
            items: [
              { title: "Advertise", text: "The accessory broadcasts its name and services." },
              { title: "Connect", text: "The phone requests a connection." },
              { title: "Pair", text: "A key is derived and stored on both sides." },
              { title: "Reconnect", text: "Later sessions authenticate with the stored key." },
            ],
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "Bluetooth hops rapidly between frequencies to avoid interference, and a piconet keeps a strict timing schedule.",
        blocks: [
          {
            type: "p",
            text: "By changing frequency hundreds of times per second, both ends avoid sitting on a noisy channel. If one frequency is blocked, the next hop is likely clear — which is why Bluetooth degrades gradually rather than dropping out.",
          },
          {
            type: "stats",
            items: [
              { label: "Channel count", value: "40", note: "BLE, 2 MHz apart" },
              { label: "Hop rate", value: "1600 /s", note: "classic Bluetooth" },
              { label: "Connection interval", value: "7.5 ms", note: "BLE minimum" },
              { label: "Peak power", value: "100 mW", note: "Class 1" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 9,
        lede: "BLE negotiates a connection interval and latency that trade responsiveness against battery life per service.",
        blocks: [
          {
            type: "p",
            text: "A sensor that reports temperature once a minute can use a long connection interval and skip many events, waking the radio for milliseconds per hour. Peripherals can also set a latency allowing them to ignore a number of intervals and stay asleep.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Why codecs matter to your earbuds",
            text: "Audio quality and latency are governed by the codec negotiated between devices. The radio has enough bandwidth; the codec decides what arrives in time.",
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "earbud", label: "Earbud", sub: "peripheral", x: 26, y: 168, w: 158, h: 88, tone: "accent", desc: "A battery-constrained peripheral. Its entire design is about using as little radio time as possible." },
        { id: "adv", label: "Advertiser", sub: "broadcasts presence", x: 218, y: 34, w: 172, h: 90, desc: "Periodically broadcasts a short packet naming the device and the services it offers, then sleeps again." },
        { id: "phone", label: "Phone", sub: "central device", x: 218, y: 300, w: 172, h: 92, desc: "The central device that scans, connects and coordinates the timing of the link." },
        { id: "pair", label: "Pairing & Key", sub: "trusted once", x: 428, y: 168, w: 170, h: 88, tone: "signal", desc: "Derives and stores a shared key so future connections are authenticated without repeating the handshake." },
        { id: "hop", label: "Hopping Radio", sub: "1600 hops / second", x: 428, y: 34, w: 170, h: 90, desc: "Changes frequency continuously so no single blocked channel can break the link." },
        { id: "sched", label: "Connection Schedule", sub: "wake, send, sleep", x: 428, y: 300, w: 170, h: 92, tone: "accent", desc: "Both ends agree exactly when to wake up. Every microsecond of radio time is budgeted against battery life." },
        { id: "profile", label: "Service Profile", sub: "audio / HID / sensor", x: 636, y: 168, w: 176, h: 88, desc: "Defines what the connection actually carries — headphones, keyboard, or a heart-rate reading." },
        { id: "codec", label: "Codec", sub: "quality ↔ latency", x: 636, y: 300, w: 176, h: 92, tone: "muted", desc: "Compresses and encodes audio. The negotiated codec, not the radio, sets the quality and delay you experience." },
      ],
      edges: [
        { from: "earbud", to: "adv", label: "advertise", dashed: true },
        { from: "adv", to: "phone", label: "scan & connect" },
        { from: "phone", to: "pair", label: "bond", tone: "accent" },
        { from: "pair", to: "sched", label: "agreed timing" },
        { from: "sched", to: "hop" },
        { from: "hop", to: "earbud", dashed: true, tone: "signal" },
        { from: "profile", to: "codec" },
      ],
      steps: [
        { id: "advertise", title: "1 · Advertise", short: "Advertise", description: "The earbud briefly wakes and broadcasts a tiny packet naming itself and its services, then returns to sleep.", active: ["earbud", "adv"], pulses: [{ from: "earbud", to: "adv" }], value: "ADV · every 100 ms" },
        { id: "connect", title: "2 · Connect & Pair", short: "Pair", description: "The phone responds, they perform a handshake, and a shared key is stored on both devices for future sessions.", active: ["adv", "phone", "pair"], pulses: [{ from: "adv", to: "phone" }, { from: "phone", to: "pair" }], value: "bonded · key stored" },
        { id: "schedule", title: "3 · Schedule", short: "Schedule", description: "They agree a connection interval and hop sequence. Both ends now wake at exactly the same moments and sleep in between.", active: ["pair", "sched", "hop"], pulses: [{ from: "pair", to: "sched" }], value: "interval = 15 ms" },
        { id: "stream", title: "4 · Stream", short: "Stream", description: "Audio is encoded by the negotiated codec and sent in the scheduled slots, hopping frequency continuously to dodge interference.", active: ["profile", "codec", "hop", "earbud"], pulses: [{ from: "codec", to: "hop" }, { from: "hop", to: "earbud" }], value: "AAC · 48 kHz" },
      ],
    },
    model3d: {
      kind: "module",
      exploded: true,
      hotspots: [
        { id: "radio", label: "Radio die", detail: "A single chip handling both the radio and the small processor that runs the protocol.", position: [0, 0.3, 0] },
        { id: "antenna", label: "Antenna", detail: "Frequently printed directly onto the board — the physical shape decides how well it radiates.", position: [0.7, 0.3, 0.2] },
        { id: "battery", label: "Coin cell", detail: "Bluetooth Low Energy can run for years on a cell this small.", position: [0, -0.2, 0.4] },
        { id: "clock", label: "Sleep timer", detail: "The crystal that lets the radio wake at an exact agreed instant.", position: [-0.6, 0.2, 0.3] },
      ],
    },
  },
];

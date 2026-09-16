import type { Scenario } from "../types";

export const SCENARIOS: Scenario[] = [
  {
    slug: "open-a-website",
    title: "You type a web address and press Enter",
    summary:
      "Follow a single request from your keyboard to a server on another continent and back again, in the time it takes to blink.",
    topicSlug: "wifi",
    duration: "~400 ms end to end",
    steps: [
      {
        order: 1,
        label: "The URL is parsed",
        icon: "Keyboard",
        latency: "<1 ms",
        description: "Your browser splits the address into scheme, host and path.",
        detail:
          "Typing an address triggers nothing on the network yet. The browser first checks whether the host is a search term or a real address, then breaks it into the parts it needs: how to connect, which machine to reach, and which resource to ask for.",
      },
      {
        order: 2,
        label: "DNS lookup begins",
        icon: "BookOpen",
        latency: "1–50 ms",
        description: "The hostname is translated into an IP address.",
        detail:
          "Computers route by number, not by name. A resolver is asked for the IP address behind the hostname. If the answer is cached from a recent request, this is nearly instant; otherwise the resolver walks a hierarchy of name servers to find it.",
      },
      {
        order: 3,
        label: "A connection is opened",
        icon: "Plug",
        latency: "10–100 ms",
        description: "A TCP handshake and a TLS handshake establish a trusted channel.",
        detail:
          "The browser and server exchange messages to agree that both are ready to talk, then negotiate encryption. Certificates are checked so your browser knows it is talking to the real server and not an impostor. This round trip is often the largest single cost of loading a page.",
      },
      {
        order: 4,
        label: "The request travels",
        icon: "Route",
        latency: "10–200 ms",
        description: "Your packets cross your router, your ISP and the wider internet.",
        detail:
          "Each packet carries a destination and hops from network to network. Routers only need to know the next sensible step, not the whole path. Physical distance matters: light in fibre takes real time to cross an ocean.",
      },
      {
        order: 5,
        label: "The server responds",
        icon: "Server",
        latency: "5–500 ms",
        description: "The server processes the request and sends a response.",
        detail:
          "A load balancer picks a healthy server. That server may query a database, call other services, or assemble a page from cached fragments. The work itself might take microseconds; queueing and coordination usually dominate.",
      },
      {
        order: 6,
        label: "The browser renders",
        icon: "Layout",
        latency: "50–500 ms",
        description: "HTML is parsed, styles applied, layout calculated and pixels drawn.",
        detail:
          "The browser builds a document tree, works out how much space everything needs, and paints it. JavaScript can change all of this after the first paint, which is why pages often shift as they load.",
      },
    ],
  },
  {
    slug: "take-a-photo",
    title: "You tap the shutter button",
    summary:
      "From a tap on glass to a finished JPEG in under a second, a chain of hardware and software decisions is made.",
    topicSlug: "camera",
    duration: "~700 ms",
    steps: [
      {
        order: 1,
        label: "The tap is registered",
        icon: "Fingerprint",
        latency: "<10 ms",
        description: "The touch controller reports where your finger landed.",
        detail:
          "The capacitive panel detects the disturbance in its field grid and reports coordinates to the system. The camera app recognises the tap on the shutter control.",
      },
      {
        order: 2,
        label: "Exposure is chosen",
        icon: "Sun",
        latency: "<5 ms",
        description: "Aperture, shutter time and ISO are selected for the scene.",
        detail:
          "The image signal processor analyses the live preview: how bright is it, is anything moving, is there a face. It then picks an exposure combination that balances brightness against blur and noise.",
      },
      {
        order: 3,
        label: "Autofocus locks",
        icon: "Focus",
        latency: "30–300 ms",
        description: "The lens moves until contrast is maximised at the focus point.",
        detail:
          "Phase-detection pixels on the sensor estimate how far out of focus the subject is, and the lens is driven to close that gap. Low light makes this slower because there is less contrast to measure.",
      },
      {
        order: 4,
        label: "The sensor is exposed",
        icon: "Aperture",
        latency: "1/60 s",
        description: "Photons are collected as electrical charge.",
        detail:
          "The shutter uncovers the sensor for the chosen time. Each photodiode accumulates charge in proportion to the light it receives. Motion during this window becomes visible blur.",
      },
      {
        order: 5,
        label: "The frame is read and processed",
        icon: "Cpu",
        latency: "50–200 ms",
        description: "Raw data becomes a viewable image.",
        detail:
          "The sensor is read row by row and digitised. The image processor demosaics the colour pattern, applies white balance, reduces noise, sharpens and compresses the result — all with dedicated hardware so it costs little battery.",
      },
      {
        order: 6,
        label: "The photo is stored",
        icon: "Save",
        latency: "10–50 ms",
        description: "The finished file is written to flash and indexed.",
        detail:
          "The JPEG or HEIC file is written to storage, added to the photo library, and queued for any cloud backup. At this point the operation is complete and the camera is ready for the next shot.",
      },
    ],
  },
  {
    slug: "press-power-button",
    title: "You press the power button",
    summary:
      "A short press that looks trivial hides a careful dance between the power management chip, the processor and every subsystem attached to it.",
    topicSlug: "smartphone",
    duration: "~120 ms to display on",
    steps: [
      {
        order: 1,
        label: "The button is debounced",
        icon: "Power",
        latency: "<5 ms",
        description: "The power management chip confirms a real press.",
        detail:
          "Mechanical switches produce several rapid electrical transitions for one press. The power management integrated circuit filters those into a single clean event so the system does not wake repeatedly.",
      },
      {
        order: 2,
        label: "The main processor wakes",
        icon: "Cpu",
        latency: "10–30 ms",
        description: "The SoC leaves its deepest sleep state.",
        detail:
          "Phones spend most of their life in states where most of the chip is unpowered. Waking requires restoring clock domains, re-enabling power rails and bringing up memory in the right sequence.",
      },
      {
        order: 3,
        label: "The display powers up",
        icon: "Monitor",
        latency: "20–60 ms",
        description: "Panel rails settle and the first frame is pushed.",
        detail:
          "An OLED panel needs its supply rails to stabilise before it can show anything. Meanwhile the display controller is already receiving a framebuffer, so as soon as the panel is ready there is content to show.",
      },
      {
        order: 4,
        label: "State is restored",
        icon: "RefreshCw",
        latency: "30–80 ms",
        description: "The lock screen renders from saved state.",
        detail:
          "The system does not boot from scratch. It resumes the suspended state of the running system, which is why unlocking a modern phone feels instantaneous compared with older devices that truly powered down.",
      },
      {
        order: 5,
        label: "Radios re-sync",
        icon: "Radio",
        latency: "100 ms – 2 s",
        description: "Cellular and Wi-Fi reconnect in parallel.",
        detail:
          "The radios were also asleep. They re-register with the network and re-associate with known access points. This is why notifications can arrive a moment after the screen comes on rather than before it.",
      },
    ],
  },
];

export function getScenario(slug: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.slug === slug);
}

import type { Challenge } from "../types";

export const CHALLENGES: Challenge[] = [
  {
    id: "cpu-order",
    topicSlug: "cpu",
    type: "ordering",
    question: "Put the stages of the instruction cycle in the order the CPU performs them.",
    hint: "It starts by finding the instruction, not by doing the maths.",
    xpReward: 25,
    bucket: "topic",
    options: [
      { id: "fetch", label: "Fetch", detail: "Bring the instruction in from memory." },
      { id: "decode", label: "Decode", detail: "Work out what the instruction means." },
      { id: "execute", label: "Execute", detail: "Perform the operation in the ALU." },
      { id: "writeback", label: "Write Back", detail: "Store the result and advance." },
    ],
    answer: ["fetch", "decode", "execute", "writeback"],
    explanation:
      "The cycle always begins by fetching the next instruction. Only once it is decoded can the control unit drive the ALU, and only after execution is there a result to write back.",
  },
  {
    id: "wifi-contend",
    topicSlug: "wifi",
    type: "multiple-choice",
    question: "Two devices on the same Wi-Fi channel transmit at exactly the same moment. What happens next?",
    xpReward: 25,
    bucket: "topic",
    options: [
      { id: "a", label: "Both packets are delivered normally" },
      { id: "b", label: "Both stop and retry after a random backoff", detail: "Collision detection triggers a randomised wait." },
      { id: "c", label: "The newer device wins and the older one is disconnected" },
      { id: "d", label: "The access point splits the channel in half" },
    ],
    answer: ["b"],
    explanation:
      "Wi-Fi uses carrier sense with collision avoidance. When a collision is detected, each sender waits a random interval before trying again, which makes it unlikely they collide a second time.",
  },
  {
    id: "camera-exposure",
    topicSlug: "camera",
    type: "multiple-choice",
    question: "You want to freeze a fast-moving subject in dim light. Which change helps most without making the image darker?",
    xpReward: 25,
    bucket: "topic",
    options: [
      { id: "a", label: "Narrow the aperture" },
      { id: "b", label: "Slow the shutter speed" },
      { id: "c", label: "Widen the aperture and raise ISO", detail: "More light through the lens, more gain on the signal." },
      { id: "d", label: "Reduce the ISO" },
    ],
    answer: ["c"],
    explanation:
      "A fast shutter reduces the light reaching the sensor, so something must compensate. Widening the aperture lets more light in, and raising ISO amplifies what is captured — at the cost of more visible noise.",
  },
  {
    id: "ram-refresh",
    topicSlug: "ram",
    type: "multiple-choice",
    question: "Why does DRAM need to be refreshed thousands of times per second?",
    xpReward: 25,
    bucket: "topic",
    options: [
      { id: "a", label: "To keep the clock synchronised with the CPU" },
      { id: "b", label: "Because each bit is a charge in a capacitor that leaks away", detail: "Capacitors cannot hold their charge indefinitely." },
      { id: "c", label: "Because the address lines need to be reset" },
      { id: "d", label: "To reduce power consumption" },
    ],
    answer: ["b"],
    explanation:
      "Each DRAM cell stores a bit as charge on a capacitor. That charge leaks, so every row must be read and rewritten periodically or the data is lost.",
  },
  {
    id: "battery-ioins",
    topicSlug: "battery",
    type: "ordering",
    question: "Order what happens as a lithium-ion battery discharges.",
    xpReward: 25,
    bucket: "topic",
    options: [
      { id: "release", label: "Ions leave the anode" },
      { id: "migrate", label: "Ions cross the electrolyte" },
      { id: "flow", label: "Electrons travel through the device" },
      { id: "arrive", label: "Ions and electrons rejoin at the cathode" },
    ],
    answer: ["release", "migrate", "flow", "arrive"],
    explanation:
      "Lithium leaves the anode first, then crosses the electrolyte. Because electrons cannot follow through the electrolyte, they take the external circuit — powering your device — and recombine at the cathode.",
  },
  {
    id: "ssd-write",
    topicSlug: "ssd",
    type: "multiple-choice",
    question: "You overwrite one byte in a file on an SSD. What does the drive actually do?",
    xpReward: 25,
    bucket: "topic",
    options: [
      { id: "a", label: "Rewrites that single byte in place" },
      { id: "b", label: "Writes to a fresh page and marks the old one stale", detail: "Flash cannot overwrite used pages directly." },
      { id: "c", label: "Erases the entire drive and rewrites it" },
      { id: "d", label: "Moves the file to RAM permanently" },
    ],
    answer: ["b"],
    explanation:
      "Flash can write only to blank pages. Changing data means writing it somewhere fresh and invalidating the old location, which the flash translation layer handles invisibly.",
  },
  {
    id: "neural-backprop",
    topicSlug: "neural-net",
    type: "ordering",
    question: "Order one complete training step.",
    xpReward: 25,
    bucket: "topic",
    options: [
      { id: "forward", label: "Forward pass produces a prediction" },
      { id: "loss", label: "Loss measures how wrong it was" },
      { id: "grad", label: "Gradients are computed backwards" },
      { id: "update", label: "Weights are nudged to reduce the loss" },
    ],
    answer: ["forward", "loss", "grad", "update"],
    explanation:
      "Training always moves forward first to make a prediction, then backwards to assign blame. The update happens last, using the gradients that backpropagation produced.",
  },
  {
    id: "gpu-parallel",
    topicSlug: "gpu",
    type: "multiple-choice",
    question: "Why is a GPU so much faster than a CPU at shading millions of pixels?",
    xpReward: 25,
    bucket: "topic",
    options: [
      { id: "a", label: "Its cores run at a much higher clock speed" },
      { id: "b", label: "It has thousands of simple cores doing the same task at once", detail: "Throughput through parallelism, not per-core speed." },
      { id: "c", label: "It has a much larger cache" },
      { id: "d", label: "It avoids using memory altogether" },
    ],
    answer: ["b"],
    explanation:
      "Pixel shading is thousands of nearly identical, independent tasks. A GPU wins by running them concurrently on many simple cores rather than by running one thing faster.",
  },
  {
    id: "cloud-replicate",
    topicSlug: "cloud",
    type: "ordering",
    question: "Order what happens when you upload a file to cloud storage.",
    xpReward: 25,
    bucket: "topic",
    options: [
      { id: "upload", label: "Your device sends the data" },
      { id: "route", label: "A load balancer picks healthy servers" },
      { id: "replicate", label: "Copies are written to several failure domains" },
      { id: "confirm", label: "Success is reported only once the write is durable" },
    ],
    answer: ["upload", "route", "replicate", "confirm"],
    explanation:
      "The upload is routed to available servers, replicated for redundancy, and only acknowledged after the data is safely stored in more than one independent location.",
  },
  {
    id: "daily-touchscreen",
    topicSlug: "touchscreen",
    type: "multiple-choice",
    question: "Daily Challenge: Why does a touchscreen often fail to respond through a winter glove?",
    xpReward: 30,
    bucket: "daily",
    options: [
      { id: "a", label: "The glove blocks light from the screen" },
      { id: "b", label: "Fabric is an insulator, so it barely changes the electric field", detail: "Capacitive sensing needs a conductive path." },
      { id: "c", label: "The glove is too thick for the pressure sensors" },
      { id: "d", label: "Cold temperatures disable the controller" },
    ],
    answer: ["b"],
    explanation:
      "Capacitive screens detect the change your conductive finger causes in the field grid. An insulating glove causes almost none, so the screen sees nothing.",
  },
  {
    id: "daily-bluetooth",
    topicSlug: "bluetooth",
    type: "multiple-choice",
    question: "Daily Challenge: Why does Bluetooth hop between frequencies hundreds of times per second?",
    xpReward: 30,
    bucket: "daily",
    options: [
      { id: "a", label: "To transmit more data per second" },
      { id: "b", label: "To avoid interference on any single channel", detail: "Dodging noise rather than fighting it." },
      { id: "c", label: "To save battery by using less power" },
      { id: "d", label: "To support more devices in a piconet" },
    ],
    answer: ["b"],
    explanation:
      "By constantly changing frequency, Bluetooth steps around interference. If one channel is blocked, the next hop is likely clear, so the link degrades gradually instead of failing.",
  },
  {
    id: "daily-chipset",
    topicSlug: "smartphone",
    type: "drag-drop",
    question: "Sort each task onto the component best suited to handle it.",
    hint: "The lowest-power path should win whenever it can.",
    xpReward: 30,
    bucket: "daily",
    options: [
      { id: "steps", label: "Counting your steps all day", detail: "A continuous, simple reading." },
      { id: "orient", label: "Stabilising a video frame", detail: "High-rate sensor fusion." },
      { id: "encode", label: "Encoding 4K video", detail: "Heavy, sustained computation." },
      { id: "notify", label: "Receiving a message", detail: "Arrives over the network." },
    ],
    answer: ["low-power sensor hub", "sensor fusion on the SoC", "dedicated video encoder", "the cellular radio"],
    explanation:
      "Power efficiency decides placement. Step counting runs continuously on a tiny hub; sensor fusion and video encoding need real compute; messages arrive on the radio and wake the system only at the end.",
  },
];

export function challengesForTopic(slug: string): Challenge[] {
  return CHALLENGES.filter((c) => c.topicSlug === slug && c.bucket === "topic");
}

export function dailyChallenges(): Challenge[] {
  return CHALLENGES.filter((c) => c.bucket === "daily");
}

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

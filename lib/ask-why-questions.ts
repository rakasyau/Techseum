import type { Topic } from "./types";

/* "Ask Why" is scripted, so its questions are authored per exhibit rather
   than generated. Each answer stays inside what the exhibit itself teaches. */

const SPECIFIC: Record<string, { q: string; a: string }[]> = {
  cpu: [
    {
      q: "Why does the clock speed matter so much?",
      a: "Every stage runs on the beat of the system clock, so a faster clock means more cycles per second — more instructions fetched, decoded, executed and retired. The limit is heat and signal integrity: pushing the clock harder needs more voltage, which produces more heat than the cooler can remove.",
    },
    {
      q: "What happens when there is a cache miss?",
      a: "The core asks for data that is not in L1 or L2, so the request goes to last-level cache and potentially to main memory. That costs on the order of a hundred cycles instead of a handful. Modern CPUs hide it by switching to another ready warp of work, which is why occupancy matters.",
    },
    {
      q: "Why do more cores not always mean more speed?",
      a: "Only work that can be split into independent pieces benefits. If a task has to be done in strict order, extra cores sit idle waiting. That is Amdahl's law: the sequential part sets the ceiling on your speedup.",
    },
    {
      q: "What is branch prediction for?",
      a: "The pipeline needs to know which instruction to fetch next, but a conditional has not been evaluated yet. The predictor guesses based on history and starts executing down that path. A correct guess is free performance; a wrong one flushes the pipeline.",
    },
  ],
  ram: [
    {
      q: "Why does RAM lose everything when power goes off?",
      a: "Each bit is a charge held on a tiny capacitor. Capacitors leak, so the charge drains within milliseconds of losing power. Storage avoids this by using a physical state that persists, such as magnetic orientation or trapped charge in flash.",
    },
    {
      q: "Why is RAM slower than the CPU cache?",
      a: "Cache is SRAM built from several transistors per bit and sits on the die next to the core. RAM is DRAM, one transistor plus one capacitor per bit, built on a separate chip. Cramming more bits into less silicon costs latency, so DRAM trades speed for capacity.",
    },
    {
      q: "Do I need more RAM or faster RAM?",
      a: "It depends on whether you are running out. Once the system starts swapping to storage, adding capacity helps far more than shaving a nanosecond of latency. If you are nowhere near full, faster memory with lower latency gives a smaller, more consistent gain.",
    },
  ],
  ssd: [
    {
      q: "Why can an SSD not overwrite data in place?",
      a: "Flash cells must be erased before they can be programmed, and erasure only works a whole block at a time — potentially hundreds of pages. Overwriting one byte would mean erasing and rewriting an entire block, so the controller writes the change to a fresh page instead and marks the old one stale.",
    },
    {
      q: "Why does an SSD slow down when it fills up?",
      a: "It needs erased blocks as a landing zone for incoming writes. A nearly full drive has few free blocks, so garbage collection has to run during writes, copying live pages out and erasing before anything new can land. That extra work is write amplification, and it shows up directly as speed loss.",
    },
    {
      q: "Can an SSD wear out?",
      a: "Yes, but far slower than people expect. Each cell tolerates a finite number of erase cycles, and wear levelling spreads writes across all of them so no single block is punished. Endurance is quoted in terabytes written; for normal use a modern drive outlasts the machine around it.",
    },
  ],
  gpu: [
    {
      q: "Why is a GPU bad at branchy code?",
      a: "Threads execute in lockstep groups called warps. If threads in a warp take different branches, the hardware must run both paths and mask off the threads that do not apply. The work is not wasted exactly, but it is serialised — and that is precisely the kind of code a CPU handles well.",
    },
    {
      q: "What does a shader actually do?",
      a: "A shader is a small program that runs once per vertex or per fragment. It decides where a corner goes, or what colour a pixel should be. Because it runs on thousands of pixels at once, the GPU can afford to run a genuinely interesting program per pixel.",
    },
    {
      q: "Why do GPUs need so much memory bandwidth?",
      a: "They work on enormous amounts of data with little reuse — a texture may be touched once per frame. That means performance is governed by how fast data can be streamed in, not by how cleverly it can be cached. Bandwidth matters more than latency.",
    },
  ],
  wifi: [
    {
      q: "Why is 5 GHz faster but reaches less far?",
      a: "Higher frequencies carry more data in the same time because there is more room to modulate, but they attenuate faster through obstacles and air. 2.4 GHz penetrates walls better and travels further, at the cost of a narrower, more congested channel.",
    },
    {
      q: "Why does Wi-Fi slow down when many devices connect?",
      a: "The channel is a shared, half-duplex medium. Only one transmitter at a time can be heard, so every device divides the same airtime budget. A distant or old client that must use a slow modulation scheme consumes far more airtime for the same data, slowing everyone.",
    },
    {
      q: "What does the router actually do that my phone cannot?",
      a: "The router bridges the wireless network to the wired one and coordinates who transmits when. Your phone could talk to another phone directly, but to reach the internet something has to translate between the wireless link and the provider's network.",
    },
  ],
  bluetooth: [
    {
      q: "Why is Bluetooth slower than Wi-Fi?",
      a: "It is designed around a tiny power budget rather than throughput. The radio wakes briefly, sends a small amount, and sleeps. That duty cycle is what lets earbuds and watches run for days, and it caps how much data can move.",
    },
    {
      q: "Why do my earbuds sometimes stutter?",
      a: "Usually interference or a codec that cannot keep up. Bluetooth hops frequencies to dodge noise, but in a crowded 2.4 GHz band it can still lose individual packets. The codec then has to recover, and if the buffer runs dry you hear the gap.",
    },
  ],
  camera: [
    {
      q: "Why does a bigger sensor take better low-light photos?",
      a: "Each photodiode collects light over its own area. A physically larger sensor gives each photosite more area, so more photons land per pixel. More photons means a stronger signal relative to the random arrival noise, which is exactly what low-light quality is.",
    },
    {
      q: "Why does raising ISO add noise?",
      a: "ISO amplifies the signal the sensor already captured. The signal and the random read noise get multiplied together, so the ratio between them does not improve. It brightens the image while making the grain that was always there more visible.",
    },
  ],
  battery: [
    {
      q: "Why should I avoid charging to 100% every day?",
      a: "Holding a cell at its maximum voltage accelerates the side reactions that consume lithium and thicken the passivation layer. Staying in the middle of the voltage window puts far less stress on the interfaces, so the cell keeps more of its capacity for longer.",
    },
    {
      q: "Why does fast charging heat the battery?",
      a: "Driving ions into the electrodes harder means more internal resistance losses, and those losses become heat. Since heat itself accelerates degradation, fast charging is a genuine trade between convenience and longevity.",
    },
  ],
  touchscreen: [
    {
      q: "Why does the screen respond to my finger but not a stylus?",
      a: "Capacitive sensing needs something conductive to change the field. A passive plastic stylus is an insulator, so nothing changes. An active stylus contains circuitry that deliberately couples to the panel, which is why it works.",
    },
    {
      q: "Why does water on the screen cause ghost touches?",
      a: "Water is conductive, so it couples to the electrodes just like a finger does. The controller sees a broad change it cannot distinguish from a large contact, and its palm-rejection model may guess wrong.",
    },
  ],
  smartphone: [
    {
      q: "Why does my phone get hot when gaming?",
      a: "Games drive the CPU, GPU and memory at once, and all of that electrical energy ends up as heat in a very small volume. The system cannot remove it fast enough, so it lowers clocks to stay within a safe temperature — which is why performance drops after a few minutes.",
    },
    {
      q: "Why does the battery drain faster with a bright screen?",
      a: "An OLED panel emits its own light, and brightness is directly proportional to the current it draws. At high brightness the display can become the single largest consumer in the device, ahead of the radios and the processor.",
    },
  ],
  "neural-net": [
    {
      q: "What is the difference between training and inference?",
      a: "Training runs the model forward to make a prediction, measures the error, then runs backwards to update every weight. Inference only runs forward with the weights frozen. Training is expensive and done once; inference is cheap and done per request.",
    },
    {
      q: "Why can a model be confident and wrong?",
      a: "A network outputs scores, not calibrated truths. If training data contained a pattern that does not generalise, the model has no way to know the new input falls outside what it learned. Confidence measures how sure the network is about its own function, not whether the world agrees.",
    },
    {
      q: "Why does the learning rate matter so much?",
      a: "It sets how far each update moves the weights. Too large and the optimiser overshoots the minimum and can diverge entirely; too small and training takes an impractical amount of time or settles in a poor spot.",
    },
  ],
  cloud: [
    {
      q: "Where is my data physically stored?",
      a: "In a data centre, on disks in servers inside racks. Providers replicate it across separate buildings, called regions, so no single failure loses it. You are not told exactly which machine holds a copy because the whole point is that it moves.",
    },
    {
      q: "What happens when a data centre goes down?",
      a: "A well-designed service keeps serving from replicas in other regions. Traffic is routed away from the failed location and the affected copies are rebuilt from survivors once it returns. Services that only exist in one place genuinely go down.",
    },
    {
      q: "Why is cloud storage cheap but moving data out expensive?",
      a: "Storing data costs a small amount of disk amortised across many customers. Moving it out consumes bandwidth, requires egress capacity, and locks you in — so it is priced to reflect the cost and the incentive.",
    },
  ],
};

export function buildQuestions(topic: Topic): { q: string; a: string }[] {
  const specific = SPECIFIC[topic.slug];
  if (specific) return specific;

  /* Fallback: derive honest questions from the exhibit's own structure. */
  return [
    {
      q: `What is the core idea behind ${topic.title.replace(/\?$/, "")}?`,
      a: topic.summary,
    },
    {
      q: "What should I look at first?",
      a: `Switch to the 2D diagram and press play. It runs through the ${topic.sim2d.steps.length} stages in order, and you can select any part to read what it does before moving on.`,
    },
    {
      q: "Where can I go deeper on this?",
      a: `Move up through the levels on this page — Level 3 and Level 4 cover the constraints and trade-offs. Related exhibits such as ${topic.relatedTopics
        .slice(0, 2)
        .join(" and ")} continue the same thread.`,
    },
  ];
}

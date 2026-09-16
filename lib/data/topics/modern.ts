import type { Topic } from "../../types";

export const modernTopics: Topic[] = [
  {
    slug: "neural-net",
    title: "How Neural Networks Learn",
    question: "How does a machine improve at a task without being told the rules?",
    summary:
      "A neural network makes a guess, measures how wrong it was, and adjusts millions of internal weights to be less wrong next time — repeated until the guesses are useful.",
    category: "modern",
    difficultyDefault: 3,
    explorerCount: 51960,
    rating: 4.9,
    tags: ["gradient descent", "backpropagation", "training", "inference"],
    featured: true,
    trending: true,
    glyph: "module",
    learningPath: "Machine Intelligence",
    relatedTopics: ["gpu", "cloud"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "You do not program a neural network with rules. You show it examples and let it adjust itself.",
        blocks: [
          {
            type: "p",
            text: "Traditional software says 'if this, then that'. A neural network instead has millions of adjustable numbers. Training is the process of nudging those numbers until the outputs match what you wanted.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Layers of simple units",
            text: "Each neuron takes several inputs, weighs them, adds a bias and passes the result through a simple function. The cleverness comes from how many of them are stacked and connected.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "Training alternates between a forward pass that makes a prediction and a backward pass that assigns blame.",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Forward", text: "Data flows through the layers and produces a prediction." },
              { title: "Loss", text: "The prediction is compared with the expected answer." },
              { title: "Backward", text: "Gradients show how each weight contributed to the error." },
              { title: "Update", text: "Every weight is nudged in the direction that reduces the error." },
            ],
          },
          {
            type: "p",
            text: "Repeat this over millions of examples and the network gradually discovers the patterns that separate good answers from bad ones.",
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "Gradient descent follows the slope of a loss surface, and the learning rate decides how far each step goes.",
        blocks: [
          {
            type: "p",
            text: "Backpropagation computes the gradient of the loss with respect to every weight using the chain rule. The optimizer then takes a step. A learning rate too large overshoots and can diverge; too small and training takes forever.",
          },
          {
            type: "stats",
            items: [
              { label: "Typical parameters", value: "10 million – 1 trillion" },
              { label: "Training tokens", value: ">10 trillion", note: "modern large models" },
              { label: "Precision", value: "bf16 / fp8", note: "mixed precision" },
              { label: "Ops per token", value: "~2 x params" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 11,
        lede: "Modern practice is a set of stability techniques: adaptive optimizers, regularisation, and architecture choices that keep gradients well behaved.",
        blocks: [
          {
            type: "p",
            text: "Adaptive optimizers maintain per-parameter scale estimates so rarely-updated weights still take meaningful steps. Normalisation layers keep activations in a healthy range, and residual connections give gradients a short path back through very deep networks.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "Overfitting vs generalisation",
            text: "A model can memorise its training data and still fail on anything new. Regularisation, data augmentation and held-out validation sets exist to separate genuine learning from memorisation.",
          },
          {
            type: "compare",
            left: { title: "Training", items: ["Forward plus backward pass", "Weights updated", "Expensive", "Offline, one time"] },
            right: { title: "Inference", items: ["Forward pass only", "Weights frozen", "Much cheaper", "Every request"] },
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "data", label: "Training Data", sub: "examples + labels", x: 26, y: 160, w: 158, h: 96, tone: "muted", desc: "Real examples paired with the correct answers. The quality of these pairs sets the ceiling on what the model can learn." },
        { id: "input", label: "Input Layer", sub: "raw features", x: 216, y: 160, w: 148, h: 96, desc: "Accepts the raw representation of the input, whether pixels, tokens or measurements." },
        { id: "hidden1", label: "Hidden Layer 1", sub: "weighted sums", x: 396, y: 34, w: 156, h: 88, tone: "accent", desc: "Each unit weighs its inputs, adds a bias and applies a nonlinearity. Stacking these lets the network represent complicated functions." },
        { id: "hidden2", label: "Hidden Layer 2", sub: "abstractions", x: 396, y: 160, w: 156, h: 96, tone: "accent", desc: "Later layers combine earlier features into higher-level concepts — edges become shapes, shapes become objects." },
        { id: "output", label: "Output", sub: "prediction", x: 396, y: 300, w: 156, h: 96, desc: "The final layer's activations are interpreted as a prediction, class scores, or the next token." },
        { id: "loss", label: "Loss Function", sub: "how wrong?", x: 596, y: 160, w: 158, h: 96, tone: "signal", desc: "A single number measuring the gap between prediction and truth. Training exists to shrink this number." },
        { id: "optim", label: "Optimizer", sub: "nudge the weights", x: 782, y: 160, w: 152, h: 96, tone: "accent", desc: "Uses gradients to decide how far and in what direction to move each weight. This is the learning step." },
        { id: "back", label: "Backpropagation", sub: "blame via chain rule", x: 596, y: 300, w: 338, h: 96, tone: "signal", desc: "Propagates the loss backwards through the layers, computing how much each weight contributed to the error." },
      ],
      edges: [
        { from: "data", to: "input", label: "batch" },
        { from: "input", to: "hidden1", label: "activations" },
        { from: "input", to: "hidden2" },
        { from: "hidden1", to: "hidden2", tone: "accent" },
        { from: "hidden2", to: "output", label: "forward pass" },
        { from: "output", to: "loss", label: "compare", tone: "signal" },
        { from: "loss", to: "optim", label: "gradient" },
        { from: "optim", to: "hidden2", label: "update", tone: "accent" },
        { from: "loss", to: "back", label: "chain rule", tone: "signal" },
      ],
      steps: [
        { id: "forward", title: "1 · Forward Pass", short: "Forward", description: "A batch of examples flows from the input layer through every hidden layer to produce a prediction.", active: ["data", "input", "hidden1", "hidden2", "output"], pulses: [{ from: "input", to: "hidden2" }, { from: "hidden2", to: "output" }], value: "batch of 256" },
        { id: "loss", title: "2 · Measure the Error", short: "Loss", description: "The prediction is compared with the known answer and condensed into a single loss value.", active: ["output", "loss"], pulses: [{ from: "output", to: "loss" }], value: "loss = 0.42" },
        { id: "backprop", title: "3 · Backpropagate", short: "Backprop", description: "The gradient of the loss is computed for every weight, working backwards from the output to the input.", active: ["loss", "back", "hidden2"], pulses: [{ from: "loss", to: "back" }], value: "gradients for 10M weights" },
        { id: "update", title: "4 · Update & Repeat", short: "Update", description: "The optimizer nudges every weight in the direction that reduces the loss, and the whole cycle begins again with a new batch.", active: ["optim", "hidden1", "hidden2", "data"], pulses: [{ from: "optim", to: "hidden2" }], value: "step size = 0.0001" },
      ],
    },
    model3d: {
      kind: "module",
      exploded: false,
      hotspots: [
        { id: "layers", label: "Layer stack", detail: "Successive layers of simple units. Depth lets the network build abstractions on abstractions.", position: [0, 0.2, 0] },
        { id: "weights", label: "Weight matrices", detail: "The learned numbers. Everything the model knows is stored here.", position: [0.9, 0.2, 0.3] },
        { id: "activations", label: "Activation functions", detail: "The nonlinearities that make stacking layers meaningful. Remove them and the network collapses to a single linear map.", position: [-0.9, 0.2, 0.3] },
        { id: "memory", label: "Accelerator memory", detail: "Weights must be resident in very fast memory for training to be efficient — often the real bottleneck.", position: [0, -0.4, 0.6] },
      ],
    },
  },
  {
    slug: "cloud",
    title: "What Is the Cloud, Really?",
    question: "Where is your data when you upload it to the cloud?",
    summary:
      "There is no cloud — there are buildings full of computers. What we call the cloud is software that spreads your work across many machines and makes them look like one.",
    category: "modern",
    difficultyDefault: 2,
    explorerCount: 33120,
    rating: 4.7,
    tags: ["data centers", "virtualisation", "replication", "availability"],
    glyph: "cloud",
    relatedTopics: ["neural-net", "wifi"],
    levels: [
      {
        level: 1,
        minutes: 3,
        lede: "The cloud is just other people's computers — enormous numbers of them, in warehouses, connected to the internet.",
        blocks: [
          {
            type: "p",
            text: "Your photo is not floating in the air. It is written to disks in a data centre somewhere, on hardware that someone else maintains, powers and cools. The cloud is a business model and a layer of software on top of physical machines.",
          },
          {
            type: "callout",
            tone: "info",
            title: "The advantage is scale",
            text: "Renting capacity is cheaper than buying it for most companies because utilisation at a data-centre scale is far higher than a single office could achieve.",
          },
        ],
      },
      {
        level: 2,
        minutes: 5,
        lede: "Virtualisation lets many isolated machines run on one physical server, and it lets work move from one server to another.",
        blocks: [
          {
            type: "p",
            text: "A hypervisor partitions one physical machine into several virtual ones, each believing it owns the hardware. Because a virtual machine is just data, it can be paused, copied and restarted elsewhere.",
          },
          {
            type: "steps",
            items: [
              { title: "Request", text: "Your app asks to store a file." },
              { title: "Place", text: "The system picks servers with capacity." },
              { title: "Replicate", text: "Copies are written to several machines." },
              { title: "Confirm", text: "Only after enough copies succeed does it say done." },
            ],
          },
        ],
      },
      {
        level: 3,
        minutes: 7,
        lede: "Availability is engineered by replication across failure domains — racks, rooms, and whole buildings.",
        blocks: [
          {
            type: "p",
            text: "Hardware fails constantly at scale. The strategy is not to prevent failure but to assume it: keep multiple copies in independent locations, detect loss, and rebuild automatically from a surviving copy.",
          },
          {
            type: "stats",
            items: [
              { label: "Typical durability", value: "99.999999999%", note: "eleven nines" },
              { label: "Replication factor", value: "3", note: "copies, typical" },
              { label: "Availability target", value: "99.9–99.99%" },
              { label: "Data centre power", value: "10–100 MW" },
            ],
          },
        ],
      },
      {
        level: 4,
        minutes: 10,
        lede: "Distributed storage faces a fundamental tension: consistency, availability and partition tolerance cannot all be perfect at once.",
        blocks: [
          {
            type: "p",
            text: "When a network partition separates two groups of servers, each must choose whether to refuse requests or risk returning stale data. Different systems make different choices, and those choices propagate into the guarantees your application can honestly make.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Eventual consistency",
            text: "Many cloud services accept temporary disagreement between replicas, reconciling later. It buys availability and latency at the cost of a window where two reads can differ.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "The egress bill",
            text: "Moving data out of a cloud provider is often charged separately and can dwarf storage costs, which is a real architectural constraint rather than a footnote.",
          },
        ],
      },
    ],
    sim2d: {
      viewBox: [0, 0, 960, 430],
      nodes: [
        { id: "client", label: "Your Device", sub: "upload request", x: 26, y: 160, w: 150, h: 96, tone: "accent", desc: "Sends data and a request. It genuinely has no idea which physical machine will serve it." },
        { id: "edge", label: "Edge Network", sub: "nearest point of presence", x: 210, y: 160, w: 158, h: 96, tone: "signal", desc: "Terminates the connection close to the user and forwards traffic into the provider's backbone." },
        { id: "lb", label: "Load Balancer", sub: "picks a server", x: 402, y: 160, w: 156, h: 96, desc: "Distributes incoming work across healthy servers so no single machine becomes a bottleneck or a single point of failure." },
        { id: "vm1", label: "Virtual Machine A", sub: "zone 1", x: 594, y: 34, w: 164, h: 86, tone: "accent", desc: "One isolated virtual server. If its hardware fails, the same virtual machine can be restarted elsewhere." },
        { id: "vm2", label: "Virtual Machine B", sub: "zone 2", x: 594, y: 160, w: 164, h: 96, tone: "accent", desc: "An independent replica in a separate failure domain, so one rack failure cannot lose your data." },
        { id: "vm3", label: "Virtual Machine C", sub: "zone 3", x: 594, y: 300, w: 164, h: 96, tone: "accent", desc: "The third copy. Redundancy is the entire reliability strategy." },
        { id: "recon", label: "Reconciliation", sub: "repair divergence", x: 790, y: 160, w: 144, h: 96, tone: "muted", desc: "Compares replicas and repairs any that have fallen behind or diverged during a failure." },
      ],
      edges: [
        { from: "client", to: "edge", label: "upload" },
        { from: "edge", to: "lb" },
        { from: "lb", to: "vm1", label: "replicate" },
        { from: "lb", to: "vm2" },
        { from: "lb", to: "vm3" },
        { from: "vm1", to: "recon", dashed: true },
        { from: "recon", to: "vm2", dashed: true, tone: "muted" },
      ],
      steps: [
        { id: "upload", title: "1 · Upload", short: "Upload", description: "Your device sends the data over the network. It is routed to a nearby point of presence, not to whatever machine will ultimately store it.", active: ["client", "edge"], pulses: [{ from: "client", to: "edge" }], value: "12 MB payload" },
        { id: "route", title: "2 · Route", short: "Route", description: "The load balancer chooses healthy servers with available capacity and forwards the request.", active: ["edge", "lb"], pulses: [{ from: "edge", to: "lb" }], value: "3 healthy targets" },
        { id: "replicate", title: "3 · Replicate", short: "Replicate", description: "Copies are written to servers in separate failure domains. Nothing is acknowledged until enough copies are safely stored.", active: ["lb", "vm1", "vm2", "vm3"], pulses: [{ from: "lb", to: "vm2" }], value: "2 of 3 acknowledged" },
        { id: "confirm", title: "4 · Confirm & Repair", short: "Confirm", description: "Only once the write is durable does the system report success. In the background, replicas are compared and repaired.", active: ["vm3", "recon", "client"], pulses: [{ from: "recon", to: "vm3" }], value: "write durable" },
      ],
    },
    model3d: {
      kind: "cloud",
      exploded: false,
      hotspots: [
        { id: "racks", label: "Server racks", detail: "Standardised frames holding dozens of servers, wired and cooled in predictable patterns.", position: [0, 0.2, 0] },
        { id: "power", label: "Power distribution", detail: "Redundant feeds and battery or flywheel backup bridge the gap until generators spin up.", position: [0.9, 0.2, 0.3] },
        { id: "cool", label: "Cooling", detail: "Removing heat is a first-class cost. Some facilities use outside air or liquid cooling to cut it.", position: [-0.9, 0.2, 0.3] },
        { id: "network", label: "Spine network", detail: "The internal fabric that lets any server reach any other with predictable latency.", position: [0, -0.4, 0.6] },
      ],
    },
  },
];

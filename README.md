# ◉ Techseum — Interactive Digital Technology Museum

Techseum is an interactive, visual-first digital technology museum designed to make complex computing architectures, RF waveforms, semiconductor physics, and modern tech accessible, intuitive, and deeply engaging.

---

## ✨ Features

- **🏛️ 21+ Interactive Exhibits**:
  - *Computing & Silicon*: CPU Architecture, GPU Parallelism, RAM, SSD NVMe, EUV Transistors, Quantum Computing.
  - *Networking & Communications*: Wi-Fi 6, 5G NR, DNS Resolution, Bluetooth Low Energy, Undersea Fiber Optics.
  - *Electronics & Hardware*: Camera CMOS Sensors, Lithium-Ion Batteries, MEMS Sensors, Motherboard PCB.
  - *Everyday & Mobile Tech*: Capacitive Touchscreens, GPS Satellite Trilateration, Active Noise Cancellation (ANC), OLED Displays, Face ID LiDAR, NFC.
  - *Modern Tech*: Neural Networks & Deep Learning.
- **🌐 2D & 3D Interactive Simulation Engine**:
  - Continuous 60 FPS state machine diagrams with native SVG animations.
  - Interactive Three.js 3D spatial models with exploded component views and mathematical 3D screen callout pin badges.
- **🤖 Ask AI Guide**:
  - Built-in intelligent AI docent powered by Google Gemini with multi-model failover.
- **🧪 Virtual Physics Laboratory**:
  - Hands-on interactive workbenches for Ohm's Law circuit analysis, camera optics & aperture ray tracing, and network packet MTU fragmentation.
- **🏆 Gamified Mastery & Leaderboard**:
  - Interactive verification quizzes, XP reward system, unlockable architectural badges, and real-time global leaderboard.
- **🌍 Multi-language Localization**:
  - Seamless bilingual support for **Bahasa Indonesia** (`id`) and **English** (`en`).
- **📬 Weekly Newsletter Engine**:
  - Integrated email subscription system with Resend API for automated weekly exhibit broadcasts.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Frontend & UI**: [React 19](https://react.dev/), Vanilla CSS Design Tokens, Canvas Confetti
- **3D Spatial Engine**: [Three.js](https://threejs.org/)
- **Database & Auth**: [MongoDB](https://www.mongodb.com/) via Mongoose, JWT (Jose)
- **AI Engine**: [Google Gemini AI](https://ai.google.dev/)
- **Email Delivery**: [Resend](https://resend.com/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/techseum.git
cd techseum
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local` and configure your API keys:
```bash
cp .env.example .env.local
```

Fill in the required configuration:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

---

## 📄 License

MIT License. Built for curious minds.


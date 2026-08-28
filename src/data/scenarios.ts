import { Language } from "./translations";

export interface ScenarioStep {
  order: number;
  title: string;
  category: "Browser" | "OS & Network" | "Routing & TLS" | "Server & CDN" | "Rendering Engine" | string;
  timeEstimate: string;
  summary: string;
  technicalDetails: string;
  icon: string;
}

export interface Scenario {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  totalDurationMs: string;
  steps: ScenarioStep[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "google-search",
    slug: "what-happens-when-google",
    title: "What Happens When You Type google.com and Press Enter?",
    subtitle: "A microsecond-by-microsecond journey across keyboard hardware, operating system kernels, undersea fiber optic cables, TLS handshakes, and GPU browser rendering engines.",
    totalDurationMs: "~120ms total roundtrip",
    steps: [
      {
        order: 1,
        title: "1. Keystroke & URL Parsing",
        category: "Browser",
        timeEstimate: "+2ms",
        summary: "The keyboard generates an electrical scan code, the OS dispatches a key event, and the browser checks whether you typed a URL or a search query.",
        technicalDetails: "The browser UI thread checks the address bar string against HSTS preload lists (Strict-Transport-Security) to force HTTPS before sending any unencrypted packet. Auto-complete and history algorithms are queried.",
        icon: "keyboard",
      },
      {
        order: 2,
        title: "2. DNS Resolution & ARP Cache",
        category: "OS & Network",
        timeEstimate: "+15ms",
        summary: "Your device checks browser cache, OS resolver cache, and queries the recursive DNS server to find Google's IP address (e.g. 142.250.190.46).",
        technicalDetails: "The OS network stack calls getaddrinfo(). If not cached, a UDP port 53 query is sent to 1.1.1.1 or 8.8.8.8. The host also looks up the local router's MAC address via ARP (Address Resolution Protocol) broadcast.",
        icon: "dns",
      },
      {
        order: 3,
        title: "3. TCP 3-Way Handshake & TLS 1.3 Key Exchange",
        category: "Routing & TLS",
        timeEstimate: "+35ms",
        summary: "Your computer opens a secure encrypted cryptographic tunnel with Google's edge server.",
        technicalDetails: "A TCP SYN packet is sent; Google responds with SYN-ACK; client sends ACK. In TLS 1.3, the ClientHello immediately includes Diffie-Hellman public key shares (1-RTT), negotiating AES-GCM-256 session keys in a single roundtrip.",
        icon: "lock",
      },
      {
        order: 4,
        title: "4. Undersea Routing & BGP Anycast",
        category: "Routing & TLS",
        timeEstimate: "+10ms",
        summary: "Packets pulse as laser light across thousands of miles of submarine fiber-optic cables along optimal BGP routing paths.",
        technicalDetails: "Autonomous Systems (AS) route packets through Tier-1 telecom backbones. BGP Anycast routes the request to the geographically closest Google Edge Point of Presence (PoP) in Jakarta or Singapore.",
        icon: "fiber",
      },
      {
        order: 5,
        title: "5. Server Processing & HTTP/3 QUIC Streaming",
        category: "Server & CDN",
        timeEstimate: "+20ms",
        summary: "Google's edge load balancer routes the HTTP GET request to web servers which stream HTML bytes back.",
        technicalDetails: "Borg cluster orchestration routes the query to index ranking services. The edge server immediately streams back gzip/brotli-compressed HTML chunks using HTTP/3 (UDP QUIC multiplexing).",
        icon: "server",
      },
      {
        order: 6,
        title: "6. Critical Rendering Path & GPU Composite",
        category: "Rendering Engine",
        timeEstimate: "+38ms",
        summary: "Chromium parses the HTML into a DOM tree, constructs the Render Tree, computes layout geometry, and the GPU paints pixels to your display.",
        technicalDetails: "HTML tokenizer builds the DOM; CSS parser constructs the CSSOM. The Blink engine calculates layout geometry, rasterizes layer tiles using GPU Skia/DirectX 12 shaders, and composites the final frame at 120Hz.",
        icon: "render",
      },
    ],
  },
];

export const SCENARIO_TRANSLATIONS_ID: Record<string, {
  title: string;
  subtitle: string;
  totalDurationMs: string;
  steps: {
    title: string;
    category: string;
    summary: string;
    technicalDetails: string;
  }[];
}> = {
  "what-happens-when-google": {
    title: "Apa yang Terjadi Saat Anda Mengetik google.com dan Menekan Enter?",
    subtitle: "Perjalanan mikrodetik demi mikrodetik melintasi perangkat keras keyboard, kernel sistem operasi, kabel serat optik bawah laut, jabat tangan enkripsi TLS, hingga mesin rendering visual GPU browser.",
    totalDurationMs: "~120ms total bolak-balik",
    steps: [
      {
        title: "1. Penekanan Tombol & Penguraian URL",
        category: "Browser",
        summary: "Keyboard menghasilkan sinyal scan code elektrik, sistem operasi memicu event penekanan tombol, dan browser memeriksa apakah teks adalah URL valid atau kueri pencarian.",
        technicalDetails: "Thread UI browser memeriksa string pada bilah alamat terhadap daftar preload HSTS (Strict-Transport-Security) untuk memaksa koneksi HTTPS sebelum mengirim paket. Algoritma auto-complete dan riwayat pencarian diproses secara lokal.",
      },
      {
        title: "2. Resolusi DNS & Cache ARP",
        category: "Sistem Operasi & Jaringan",
        summary: "Perangkat Anda memeriksa cache browser, cache resolver OS, lalu bertanya ke server DNS rekursif untuk menemukan alamat IP server Google (misal: 142.250.190.46).",
        technicalDetails: "Network stack OS memanggil fungsi getaddrinfo(). Jika belum tercache, kueri UDP port 53 dikirim ke DNS 1.1.1.1 atau 8.8.8.8. Host juga mencari alamat fisik MAC router lokal melalui siaran ARP (Address Resolution Protocol).",
      },
      {
        title: "3. Jabat Tangan TCP & Enkripsi TLS 1.3",
        category: "Perutean & TLS",
        summary: "Komputer Anda membuka terowongan kriptografi terenkripsi yang aman dengan server edge Google terdekat.",
        technicalDetails: "Paket TCP SYN dikirim; server Google membalas SYN-ACK; klien mengirim ACK. Pada TLS 1.3, pesan ClientHello langsung menyertakan bagian kunci publik Diffie-Hellman (1-RTT), menegosiasikan kunci sesi AES-GCM-256 hanya dalam 1 putaran bolak-balik.",
      },
      {
        title: "4. Perutean Kabel Bawah Laut & BGP Anycast",
        category: "Perutean & Fiber",
        summary: "Paket data merambat sebagai denyut sinar laser melintasi ribuan kilometer kabel serat optik bawah laut melalui jalur perutean BGP paling optimal.",
        technicalDetails: "Autonomous System (AS) meneruskan paket melalui jaringan tulang punggung telekomunikasi Tier-1. Protokol BGP Anycast secara otomatis merutekan permintaan ke Google Edge Point of Presence (PoP) terdekat (misal di Jakarta atau Singapura).",
      },
      {
        title: "5. Pemrosesan Server & Streaming HTTP/3 QUIC",
        category: "Server & CDN",
        summary: "Load balancer Google meneruskan permintaan HTTP GET ke kluster web server yang langsung mengalirkan byte HTML kembali ke browser.",
        technicalDetails: "Sistem orkestrasi kluster Borg mengarahkan kueri ke layanan perankingan indeks pencarian. Server edge langsung mengalirkan potongan data HTML terkompresi gzip/brotli menggunakan protokol HTTP/3 (multipleksing UDP QUIC tanpa jeda antrean).",
      },
      {
        title: "6. Critical Rendering Path & Komposisi GPU",
        category: "Mesin Rendering",
        summary: "Browser Chromium mem-parsing HTML menjadi pohon DOM, menyusun Render Tree, menghitung tata letak geometris, dan chip GPU menggambar piksel ke layar.",
        technicalDetails: "Tokenizer HTML membangun pohon DOM; parser CSS menyusun CSSOM. Mesin Blink menghitung geometri layout, merasterisasi layer menggunakan shader GPU Skia / DirectX 12, dan menyusun frame visual akhir secara mulus pada 120Hz.",
      },
    ],
  },
};

export function getScenarioBySlug(slug: string, lang: Language = "en"): Scenario | undefined {
  const raw = SCENARIOS.find((s) => s.slug === slug || s.id === slug);
  if (!raw) return undefined;

  if (lang === "id") {
    const trans = SCENARIO_TRANSLATIONS_ID[raw.slug] || SCENARIO_TRANSLATIONS_ID[raw.id];
    if (trans) {
      return {
        ...raw,
        title: trans.title,
        subtitle: trans.subtitle,
        totalDurationMs: trans.totalDurationMs,
        steps: raw.steps.map((step, idx) => {
          const stepTrans = trans.steps[idx];
          if (!stepTrans) return step;
          return {
            ...step,
            title: stepTrans.title,
            category: stepTrans.category,
            summary: stepTrans.summary,
            technicalDetails: stepTrans.technicalDetails,
          };
        }),
      };
    }
  }

  return raw;
}


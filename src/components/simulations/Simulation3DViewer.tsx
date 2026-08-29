"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Simulation3DViewer.module.css";

interface Simulation3DViewerProps {
  topicId: string;
  topicTitle: string;
}

export interface Component3DInfo {
  id: string;
  name: { en: string; id: string };
  role: { en: string; id: string };
  color: string;
}

export const TOPIC_3D_COMPONENTS: Record<string, Component3DInfo[]> = {
  cpu: [
    {
      id: "ihs",
      name: { en: "IHS Heat Spreader", id: "Pelindung Panas IHS" },
      role: { en: "Nickel-plated copper plate conducting heat to cooler", id: "Pelat tembaga berlapis nikel penyalur panas ke heatsink" },
      color: "#A1A1AA",
    },
    {
      id: "die",
      name: { en: "CPU Silicon Die", id: "Inti Keping Silikon CPU" },
      role: { en: "Houses billions of nanoscopic transistors and ALU cores", id: "Memuat miliaran transistor nanoskopik dan unit komputasi ALU" },
      color: "#4F46E5",
    },
    {
      id: "substrate",
      name: { en: "Substrate PCB", id: "Papan Substrat Silikon" },
      role: { en: "Interconnects silicon die to LGA gold socket contacts", id: "Menghubungkan die silikon ke pin kontak emas soket LGA" },
      color: "#064E3B",
    },
  ],
  wifi: [
    {
      id: "base",
      name: { en: "Router Base Enclosure", id: "Papan Sirkuit Router" },
      role: { en: "Baseboard with MAC controller and RF power amplifiers", id: "Papan utama pengontrol MAC dan penguat daya RF" },
      color: "#18181B",
    },
    {
      id: "antenna",
      name: { en: "5.8 GHz Antennas", id: "Antena Pengarah 5.8 GHz" },
      role: { en: "Radiates high-frequency dipole electromagnetic waves", id: "Memancarkan gelombang elektromagnetik frekuensi tinggi" },
      color: "#4F46E5",
    },
    {
      id: "wave",
      name: { en: "RF Wavefronts", id: "Gelombang Radio Elektromagnetik" },
      role: { en: "Propagating spherical wireless carrier waves", id: "Gelombang pembawa radio nirkabel yang merambat meluas" },
      color: "#38BDF8",
    },
  ],
  camera: [
    {
      id: "barrel",
      name: { en: "Lens Barrel", id: "Tabung Lensa Luar" },
      role: { en: "Structural housing for optical glass elements and iris", id: "Tabung pelindung susunan elemen kaca optik dan iris" },
      color: "#27272A",
    },
    {
      id: "optics",
      name: { en: "Optical Glass Lenses", id: "Susunan Lensa Kaca Cembung" },
      role: { en: "Refracts and focuses incoming photons onto focal plane", id: "Membias dan memfokuskan foton cahaya ke bidang sensor" },
      color: "#38BDF8",
    },
    {
      id: "sensor",
      name: { en: "CMOS Image Sensor", id: "Sensor Gambar CMOS & Bayer" },
      role: { en: "Photodiode array converting light into digital raw pixels", id: "Matriks fotodioda pengubah cahaya menjadi sinyal digital mentah" },
      color: "#059669",
    },
  ],
  ssd: [
    {
      id: "pcb",
      name: { en: "M.2 NVMe PCB", id: "Papan PCB M.2 NVMe" },
      role: { en: "Multi-layer fiberglass circuit board with PCIe traces", id: "Papan sirkuit multi-lapis dengan jalur transmisi PCIe" },
      color: "#064E3B",
    },
    {
      id: "pins",
      name: { en: "PCIe 4.0 Gold Pins", id: "Pin Emas PCIe 4.0" },
      role: { en: "64 Gbps direct DMA bus interface to motherboard", id: "Antarmuka DMA langsung 64 Gbps ke motherboard" },
      color: "#F59E0B",
    },
    {
      id: "controller",
      name: { en: "Flash Controller ASIC", id: "Chip Kontroler Flash FTL" },
      role: { en: "Manages wear leveling, DMA caching, and LDPC ECC", id: "Mengatur wear leveling, cache DMA, dan koreksi error LDPC" },
      color: "#52525B",
    },
    {
      id: "nand",
      name: { en: "3D TLC NAND Flash", id: "Tumpukan Sel 3D NAND Flash" },
      role: { en: "Non-volatile floating gate quantum charge traps", id: "Sel perangkap muatan kuantum non-volatile penyimpan bit data" },
      color: "#18181B",
    },
  ],
  gpu: [
    {
      id: "pcb",
      name: { en: "Graphics Card PCB", id: "Papan Sirkuit Utama GPU" },
      role: { en: "High-current VRM power delivery and high-speed memory bus", id: "Penyalur daya VRM arus tinggi dan bus memori berkecepatan tinggi" },
      color: "#1E293B",
    },
    {
      id: "core",
      name: { en: "GPU Silicon Core", id: "Inti Silikon GPU & CUDA Cores" },
      role: { en: "Thousands of parallel SIMD stream processors for shaders", id: "Ribuan prosesor paralel SIMD pemroses shader dan ray tracing" },
      color: "#22C55E",
    },
    {
      id: "vram",
      name: { en: "GDDR6 VRAM ICs", id: "Chip Memori VRAM GDDR6" },
      role: { en: "Ultra-high bandwidth texture and framebuffer cache", id: "Memori berkecepatan tinggi penyimpan tekstur dan framebuffer" },
      color: "#0F172A",
    },
  ],
  dns: [
    {
      id: "globe",
      name: { en: "Global Internet Grid", id: "Jaringan Internet Global" },
      role: { en: "Distributed worldwide Anycast routing network", id: "Jaringan perutean Anycast terdistribusi di seluruh dunia" },
      color: "#6366F1",
    },
    {
      id: "nodes",
      name: { en: "DNS Nameserver Nodes", id: "Node Server DNS Terdistribusi" },
      role: { en: "Root (.), TLD (.com), and Authoritative server nodes", id: "Server Akar (.), TLD (.com), dan Server Otoritatif IP" },
      color: "#10B981",
    },
  ],
  bluetooth: [
    {
      id: "master",
      name: { en: "Smartphone Host", id: "Ponsel Host / Master" },
      role: { en: "Master piconet device controlling frequency hopping", id: "Perangkat pengendali lompatan frekuensi radio 1.600 hops/dtk" },
      color: "#4F46E5",
    },
    {
      id: "slave",
      name: { en: "Wireless Earbud", id: "Earbud Nirkabel Peripheral" },
      role: { en: "Synchronized slave node receiving decoded audio packets", id: "Perangkat penerima nirkabel penangkap paket data audio" },
      color: "#10B981",
    },
    {
      id: "ring",
      name: { en: "2.4 GHz RF Carrier", id: "Gelombang Pembawa Radio 2.4 GHz" },
      role: { en: "GFSK modulated short-range ISM radio field", id: "Medan radio jarak pendek ISM termodulasi GFSK" },
      color: "#F59E0B",
    },
  ],
  ram: [
    {
      id: "pcb",
      name: { en: "DDR5 PCB Module", id: "Papan Modul PCB DDR5" },
      role: { en: "Controlled impedance length-matched serpentine substrate", id: "Papan multi-lapis jalur transmisi memori bebas timing skew" },
      color: "#064E3B",
    },
    {
      id: "dram",
      name: { en: "DRAM Memory ICs", id: "Chip IC Memori DRAM 1T1C" },
      role: { en: "High-speed volatile 1-transistor 1-capacitor memory cells", id: "Sel memori kapasitif 1T1C berkecepatan sangat tinggi" },
      color: "#18181B",
    },
  ],
  battery: [
    {
      id: "can",
      name: { en: "Aluminum Pouch / Can", id: "Casing Pelindung Aluminium" },
      role: { en: "Hermetically sealed casing protecting electrolyte from moisture", id: "Casing kedap udara pelindung cairan elektrolit dari kelembapan" },
      color: "#4F46E5",
    },
    {
      id: "spiral",
      name: { en: "Jelly Roll Spiral Core", id: "Gulungan Anoda-Katoda-Separator" },
      role: { en: "Intercalated Graphite anode, LiCoO2 cathode, and separator", id: "Lapisan anoda grafit, katoda kobalt, dan membran separator ion" },
      color: "#F59E0B",
    },
  ],
  touchscreen: [
    {
      id: "oled",
      name: { en: "AMOLED Display Panel", id: "Panel Layar AMOLED Emisif" },
      role: { en: "Emits vibrant RGB pixels directly beneath the touch grid", id: "Memancarkan piksel warna RGB tepat di bawah kisi sentuh" },
      color: "#09090B",
    },
    {
      id: "ito",
      name: { en: "ITO Capacitive Sensor", id: "Kisi Sensor Kapasitif ITO" },
      role: { en: "Diamond-patterned Indium Tin Oxide mutual capacitance grid", id: "Kisi transparan ITO pembaca distorsi medan kapasitansi jari" },
      color: "#0284C7",
    },
    {
      id: "glass",
      name: { en: "Gorilla Glass Cover", id: "Kaca Pelindung Permukaan" },
      role: { en: "Chemically strengthened scratch-resistant oleophobic cover", id: "Kaca antigores dengan lapisan oleofobik antinoda minyak" },
      color: "#38BDF8",
    },
  ],
  "ai-neural": [
    {
      id: "input",
      name: { en: "Input Layer Neurons", id: "Neuron Layer Input" },
      role: { en: "Receives raw normalized numerical feature vectors", id: "Menerima vektor fitur numerik data mentah yang dinormalisasi" },
      color: "#A855F7",
    },
    {
      id: "hidden",
      name: { en: "Hidden Layer Neurons", id: "Neuron Layer Tersembunyi" },
      role: { en: "Computes non-linear matrix activations via GELU / ReLU", id: "Menghitung aktivasi matriks non-linear melalui fungsi GELU" },
      color: "#A855F7",
    },
    {
      id: "output",
      name: { en: "Output Softmax Logits", id: "Output Klasifikasi Softmax" },
      role: { en: "Yields normalized probability distribution across classes", id: "Menghasilkan distribusi probabilitas klasifikasi akhir" },
      color: "#A855F7",
    },
  ],
  gps: [
    {
      id: "earth",
      name: { en: "Earth Target Coordinate", id: "Permukaan Bumi / Posisi Pengguna" },
      role: { en: "3D user position fixed via 4-sphere geometric intersection", id: "Posisi 3D pengguna dari titik potong 4 bola gelombang satelit" },
      color: "#0284C7",
    },
    {
      id: "satellites",
      name: { en: "GPS Satellites", id: "Konstelasi Satelit GPS MEO" },
      role: { en: "Atomic clock synchronized orbiters broadcasting time codes", id: "Satelit berjam atom yang memancarkan kode waktu presisi" },
      color: "#F59E0B",
    },
  ],
  anc: [
    {
      id: "headband",
      name: { en: "Structural Headband", id: "Rangka Bando Headphone" },
      role: { en: "Spring-steel chassis providing ergonomic clamping force", id: "Rangka baja pegas penahan posisi earcup di kepala" },
      color: "#475569",
    },
    {
      id: "earcups",
      name: { en: "Acoustic Earcups", id: "Casing Akustik Earcup" },
      role: { en: "Passive acoustic isolation sealing high-frequency noise", id: "Peredam pasif penyekat kebisingan frekuensi tinggi" },
      color: "#1E293B",
    },
    {
      id: "driver",
      name: { en: "Anti-Noise Driver", id: "Driver Speaker Anti-Noise" },
      role: { en: "Emits 180° phase-inverted soundwaves to cancel ambient noise", id: "Memancarkan gelombang suara inversi 180° pemusnah derau bising" },
      color: "#10B981",
    },
  ],
  oled: [
    {
      id: "tft",
      name: { en: "Substrate & LTPO TFT", id: "Substrat Kaca & Sirkuit TFT" },
      role: { en: "Low-temperature oxide transistors controlling pixel current", id: "Transistor oksida pengendali arus listrik per subpiksel" },
      color: "#1E293B",
    },
    {
      id: "eml",
      name: { en: "Organic Emission Layer", id: "Lapisan Emisi Organik EML" },
      role: { en: "Organic molecules emitting photons upon electron-hole recombination", id: "Molekul organik pemancar foton saat elektron dan hole bertabrakan" },
      color: "#EC4899",
    },
    {
      id: "subpixels",
      name: { en: "RGB Sub-Pixels", id: "Subpiksel Warna Merah, Hijau, Biru" },
      role: { en: "Individual Red, Green, and Blue emissive micro-elements", id: "Elemen mikro pemancar warna mandiri dengan kontras tak hingga" },
      color: "#EF4444",
    },
  ],
  "face-id": [
    {
      id: "phone",
      name: { en: "Chassis & Notch Array", id: "Rangka Ponsel & Notch Sensor" },
      role: { en: "Houses Flood Illuminator, Infrared Camera, and VCSEL laser", id: "Memuat lampu inframerah, kamera IR, dan laser VCSEL" },
      color: "#0F172A",
    },
    {
      id: "face",
      name: { en: "3D Face Topological Mesh", id: "Kontur Kedalaman Wajah 3D" },
      role: { en: "Topological depth map captured by reading 30,000 IR dot grid", id: "Peta kontur kedalaman 3D dari pantulan 30.000 titik laser" },
      color: "#6366F1",
    },
    {
      id: "projector",
      name: { en: "VCSEL Dot Projector", id: "Proyektor Kisi Titik VCSEL" },
      role: { en: "Emits invisible 940nm diffraction pattern onto user face", id: "Memancarkan pola difraksi inframerah 940nm ke wajah pengguna" },
      color: "#C084FC",
    },
  ],
  nfc: [
    {
      id: "phone",
      name: { en: "Smartphone Transmitter", id: "Ponsel Pengirim" },
      role: { en: "Houses NFC secure element and inductive driver circuit", id: "Memuat chip Secure Element dan rangkaian penggerak induktif" },
      color: "#0F172A",
    },
    {
      id: "coil",
      name: { en: "Planar Copper Coil", id: "Kumparan Induksi Tembaga" },
      role: { en: "Resonates at 13.56 MHz capturing inductive magnetic energy", id: "Beresonansi pada 13.56 MHz menangkap energi arus listrik induksi" },
      color: "#F59E0B",
    },
    {
      id: "pos",
      name: { en: "POS Terminal Reader", id: "Terminal Mesin EDC / POS" },
      role: { en: "Merchant reader verifying tokenized EMV cryptogram", id: "Mesin pembaca yang memverifikasi kriptogram pembayaran token" },
      color: "#1E293B",
    },
    {
      id: "flux",
      name: { en: "Magnetic Flux Field", id: "Gelombang Kopling Magnetik" },
      role: { en: "Near-field electromagnetic induction medium (Faraday Law)", id: "Medan fluks induksi magnetik jarak dekat (Hukum Faraday)" },
      color: "#F59E0B",
    },
  ],
  "transistor-euv": [
    {
      id: "wafer",
      name: { en: "Silicon Wafer Base", id: "Substrat Dasar Wafer Silikon" },
      role: { en: "Ultra-pure monocrystalline 300mm silicon ingot substrate", id: "Substrat wafer silikon kristal murni berdiameter 300mm" },
      color: "#1E293B",
    },
    {
      id: "source-drain",
      name: { en: "Source & Drain Terminals", id: "Terminal Source & Drain n+" },
      role: { en: "Heavily doped electron reservoir injection contacts", id: "Kontak reservoir injeksi pembawa muatan elektron" },
      color: "#F59E0B",
    },
    {
      id: "nanosheets",
      name: { en: "3 Stacked GAAFET Nanosheets", id: "3 Saluran Pita Nanosheet GAAFET" },
      role: { en: "3nm-thin horizontal ballistic electron transport channels", id: "3 lapis pita silikon 3nm untuk transportasi elektron balistik" },
      color: "#38BDF8",
    },
    {
      id: "gate",
      name: { en: "360° High-κ Metal Gate", id: "Gerbang Logam Pembungkus 360°" },
      role: { en: "Encloses nanosheets on all 4 sides for zero current leakage", id: "Membungkus saluran di ke-4 sisi untuk mencegah kebocoran arus" },
      color: "#A855F7",
    },
    {
      id: "euv",
      name: { en: "EUV Plasma Laser Cone", id: "Berkas Laser Plasma EUV 13.5nm" },
      role: { en: "13.5nm extreme ultraviolet light from tin droplet plasma", id: "Sinar ultraviolet ekstrem 13.5nm dari plasma tetesan timah" },
      color: "#E879F9",
    },
  ],
  "quantum-computing": [
    {
      id: "cryostat",
      name: { en: "Multi-Stage Cryostat Flanges", id: "Pelat Multi-Tahap Kulkas Emas" },
      role: { en: "Stepped cooling plates from 300K down to 4K liquid helium", id: "Pelat pendingin bertingkat dari 300K hingga 4K helium cair" },
      color: "#F59E0B",
    },
    {
      id: "lines",
      name: { en: "Golden Microwave Coax Lines", id: "Kabel Gelombang Mikro Emas" },
      role: { en: "Carries GHz microwave pulses to manipulate qubit superposition", id: "Mengalirkan pulsa gelombang mikro pengontrol superposisi qubit" },
      color: "#F59E0B",
    },
    {
      id: "qubit",
      name: { en: "Transmon Qubit Die", id: "Chip Qubit Superkonduktor" },
      role: { en: "Operating at 15 mK (-273.13°C) with Josephson junctions", id: "Bekerja pada 15 milikelvin memanfaatkan sambungan Josephson" },
      color: "#38BDF8",
    },
    {
      id: "bloch",
      name: { en: "Bloch Sphere Hologram", id: "Hologram Bola Bloch Superposisi" },
      role: { en: "Geometric vector representation of quantum superposition state", id: "Representasi geometris vektor status kuantum (|0⟩ + |1⟩)/√2" },
      color: "#6366F1",
    },
  ],
  "mems-sensor": [
    {
      id: "frame",
      name: { en: "Silicon Cavity Frame", id: "Rangka Rongga Kristal Silikon" },
      role: { en: "DRIE etched monocrystalline silicon vacuum enclosure", id: "Rangka pelindung vakum dari etsa silikon monokristal DRIE" },
      color: "#1E293B",
    },
    {
      id: "mass",
      name: { en: "Suspended Proof Mass", id: "Massa Beban Inersia Gantung" },
      role: { en: "Micro-machined weight physically shifting under acceleration (F=ma)", id: "Beban mikro yang bergeser saat menerima percepatan inersia" },
      color: "#38BDF8",
    },
    {
      id: "springs",
      name: { en: "Folded Silicon Springs", id: "Balok Pegas Silikon Mikro" },
      role: { en: "Compliant beams providing linear restoring mechanical force", id: "Balok pegas fleksibel penyedia gaya pemulih mekanis elastis" },
      color: "#34D399",
    },
    {
      id: "combs",
      name: { en: "Differential Comb Capacitors", id: "Gigi Sisir Kapasitor Diferensial" },
      role: { en: "Interlocking fingers measuring sub-femtofarad capacitance shifts", id: "Gigi sisir pengukur perubahan kapasitansi akibat pergeseran massa" },
      color: "#F59E0B",
    },
  ],
  "fiber-optic": [
    {
      id: "core",
      name: { en: "Pure Silica Glass Core", id: "Inti Kaca Silika Murni (n1=1.485)" },
      role: { en: "9-micron ultra-pure silica glass guiding laser light pulses", id: "Inti kaca 9-mikron ultra-murni pemandu pulsa sinar laser" },
      color: "#0284C7",
    },
    {
      id: "cladding",
      name: { en: "Optical Silica Cladding", id: "Selubung Kaca Luar (n2=1.450)" },
      role: { en: "Lower refractive index jacket enabling Total Internal Reflection", id: "Lapisan kaca berindeks bias lebih rendah pemantul cahaya total" },
      color: "#38BDF8",
    },
    {
      id: "ray",
      name: { en: "Total Internal Laser Ray", id: "Berkas Sinar Laser Pemantulan Total" },
      role: { en: "Light bouncing at θ > θc traveling at 200,000 km/s", id: "Sinar memantul pada sudut kritis merambat pada 200.000 km/dtk" },
      color: "#F59E0B",
    },
    {
      id: "pod",
      name: { en: "Subsea Armored Pod & EDFA", id: "Selubung Pelindung Bawah Laut & EDFA" },
      role: { en: "Titanium-steel pod with Erbium-doped optical signal amplifier", id: "Casing baja bawah laut dengan penguat optik ion Erbium" },
      color: "#10B981",
    },
  ],
  "pcb-motherboard": [
    {
      id: "pcb",
      name: { en: "Multi-Layer FR4 PCB", id: "Papan PCB Multi-Layer FR4" },
      role: { en: "8-layer high-density fiberglass substrate with ground planes", id: "Papan serat kaca 8-lapis dengan bidang ground peredam noise" },
      color: "#042F2E",
    },
    {
      id: "socket",
      name: { en: "LGA-1700 Socket & Die", id: "Soket CPU LGA-1700 & Prosesor" },
      role: { en: "1,700 gold contact pins connecting CPU to memory & PCIe bus", id: "1.700 pin kontak emas penghubung CPU ke bus memori & PCIe" },
      color: "#F59E0B",
    },
    {
      id: "vrm",
      name: { en: "VRM Heatsink Fins", id: "Sirip Heatsink VRM Daya" },
      role: { en: "Cooling 16-phase buck converter MOSFETs delivering 1.1V 250A", id: "Pendingin rangkaian MOSFET penyuplai daya 1.1V 250A ke prosesor" },
      color: "#1E293B",
    },
    {
      id: "dimm",
      name: { en: "DDR5 Memory Slots", id: "4 Slot Memori RAM DDR5" },
      role: { en: "High-speed dual-channel memory interface with serpentine traces", id: "Slot memori kanal ganda dengan jalur berliku penyama panjang" },
      color: "#38BDF8",
    },
    {
      id: "pcie",
      name: { en: "PCIe 5.0 x16 Slot", id: "Slot Ekspansi PCIe 5.0 x16" },
      role: { en: "Steel-armored 128 GB/s high-bandwidth expansion bus", id: "Slot ekspansi berlapis baja berkecepatan 128 GB/s" },
      color: "#94A3B8",
    },
  ],
};

interface ScreenPin {
  index: number;
  x: number;
  y: number;
  visible: boolean;
  info: Component3DInfo;
}

export default function Simulation3DViewer({ topicId }: Simulation3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [isXRay, setIsXRay] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [pins, setPins] = useState<ScreenPin[]>([]);
  const { language } = useLanguage();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const explodedGroupRef = useRef<THREE.Group | null>(null);
  const animElementsRef = useRef<THREE.Object3D[]>([]);
  const componentMeshesRef = useRef<THREE.Object3D[]>([]);
  const originalPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  const topicComponents = useMemo(() => {
    return TOPIC_3D_COMPONENTS[topicId] || TOPIC_3D_COMPONENTS.cpu;
  }, [topicId]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Reset states
    setIsExploded(false);
    setPins([]);
    originalPositionsRef.current.clear();
    componentMeshesRef.current = [];

    // ── Scene, Camera, Renderer ─────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || (typeof window !== "undefined" && window.innerWidth <= 480 ? 320 : window.innerWidth <= 768 ? 380 : 480);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    // ── Studio Lighting ─────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x818cf8, 2.5);
    keyLight.position.set(6, 8, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    fillLight.position.set(-6, -4, 6);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x34d399, 1.0);
    backLight.position.set(0, 6, -8);
    scene.add(backLight);

    // ── Build Specific 3D Geometry Based on Topic ID ───
    const rootGroup = new THREE.Group();
    explodedGroupRef.current = rootGroup;
    scene.add(rootGroup);

    const animList: THREE.Object3D[] = [];
    const compMeshes: THREE.Object3D[] = [];

    const getMat = (color: number, opacity = 1, wireframe = false) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.6,
        transparent: opacity < 1,
        opacity,
        wireframe,
      });

    switch (topicId) {
      case "wifi": {
        const baseGeo = new THREE.BoxGeometry(4.2, 0.6, 2.6);
        const baseMesh = new THREE.Mesh(baseGeo, getMat(0x18181b));
        rootGroup.add(baseMesh);
        compMeshes.push(baseMesh);

        const antGroup = new THREE.Group();
        const antGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 16);
        [-1.5, -0.5, 0.5, 1.5].forEach((x) => {
          const ant = new THREE.Mesh(antGeo, getMat(0x4f46e5));
          ant.position.set(x, 1.4, -0.9);
          antGroup.add(ant);
        });
        rootGroup.add(antGroup);
        compMeshes.push(antGroup);

        const waveGroup = new THREE.Group();
        const waveMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });
        for (let i = 1; i <= 3; i++) {
          const wave = new THREE.Mesh(new THREE.SphereGeometry(i * 1.6, 16, 16), waveMat);
          waveGroup.add(wave);
          animList.push(wave);
        }
        rootGroup.add(waveGroup);
        compMeshes.push(waveGroup);
        break;
      }

      case "camera": {
        const barrelGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.2, 32, 1, true);
        const barrelMat = getMat(0x27272a, 0.85);
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.rotation.x = Math.PI / 2;
        rootGroup.add(barrel);
        compMeshes.push(barrel);

        const lensGroup = new THREE.Group();
        const lensMat = new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transmission: 0.85,
          opacity: 0.7,
          transparent: true,
          roughness: 0.1,
          ior: 1.5,
        });
        [-1, 0, 1].forEach((z) => {
          const lens = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, 0.4), lensMat);
          lens.position.z = z;
          lens.rotation.x = Math.PI / 2;
          lensGroup.add(lens);
        });
        rootGroup.add(lensGroup);
        compMeshes.push(lensGroup);

        const sensor = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.1), getMat(0x059669));
        sensor.position.z = -1.8;
        rootGroup.add(sensor);
        compMeshes.push(sensor);
        break;
      }

      case "ssd": {
        const pcbGeo = new THREE.BoxGeometry(2.2, 0.1, 5.8);
        const pcb = new THREE.Mesh(pcbGeo, getMat(0x064e3b));
        rootGroup.add(pcb);
        compMeshes.push(pcb);

        const pins = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.4), getMat(0xf59e0b));
        pins.position.set(0, 0, 2.9);
        rootGroup.add(pins);
        compMeshes.push(pins);

        const ctrl = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 1.2), getMat(0x52525b));
        ctrl.position.set(0, 0.15, 1.3);
        rootGroup.add(ctrl);
        compMeshes.push(ctrl);

        const nandGroup = new THREE.Group();
        [-0.4, -1.8].forEach((z) => {
          const nand = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.35, 1.6), getMat(0x18181b));
          nand.position.set(0, 0.2, z);
          nandGroup.add(nand);
        });
        rootGroup.add(nandGroup);
        compMeshes.push(nandGroup);
        break;
      }

      case "gpu": {
        const dieSub = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.2, 4.4), getMat(0x1e293b));
        rootGroup.add(dieSub);
        compMeshes.push(dieSub);

        const gpuCore = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 2.2), getMat(0x22c55e));
        gpuCore.position.y = 0.2;
        rootGroup.add(gpuCore);
        compMeshes.push(gpuCore);

        const memGroup = new THREE.Group();
        const memMat = getMat(0x0f172a);
        [-1.6, 1.6].forEach((x) => {
          [-1.1, 0, 1.1].forEach((z) => {
            const mem = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.25, 0.75), memMat);
            mem.position.set(x, 0.2, z);
            memGroup.add(mem);
          });
        });
        rootGroup.add(memGroup);
        compMeshes.push(memGroup);
        break;
      }

      case "dns": {
        const globeMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true });
        const globe = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 24), globeMat);
        rootGroup.add(globe);
        compMeshes.push(globe);
        animList.push(globe);

        const nodeGroup = new THREE.Group();
        const nodeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2 });
        for (let i = 0; i < 8; i++) {
          const node = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), nodeMat);
          const angle = (i / 8) * Math.PI * 2;
          node.position.set(Math.cos(angle) * 3.0, i % 2 === 0 ? 0.7 : -0.7, Math.sin(angle) * 3.0);
          nodeGroup.add(node);
        }
        rootGroup.add(nodeGroup);
        compMeshes.push(nodeGroup);
        break;
      }

      case "bluetooth": {
        const master = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.8, 0.2), getMat(0x4f46e5));
        master.position.x = -2.0;
        rootGroup.add(master);
        compMeshes.push(master);

        const slave = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), getMat(0x10b981));
        slave.position.x = 2.0;
        rootGroup.add(slave);
        compMeshes.push(slave);

        const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.4 });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.05, 8, 32), ringMat);
        ring.rotation.y = Math.PI / 2;
        rootGroup.add(ring);
        compMeshes.push(ring);
        animList.push(ring);
        break;
      }

      case "ram": {
        const pcb = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.8, 0.15), getMat(0x064e3b));
        rootGroup.add(pcb);
        compMeshes.push(pcb);

        const dramGroup = new THREE.Group();
        for (let i = -3; i <= 3; i++) {
          if (i === 0) continue;
          const chip = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 0.12), getMat(0x18181b));
          chip.position.set(i * 0.8, 0.15, 0.1);
          dramGroup.add(chip);
        }
        rootGroup.add(dramGroup);
        compMeshes.push(dramGroup);
        break;
      }

      case "battery": {
        const canGeo = new THREE.CylinderGeometry(1.4, 1.4, 3.8, 32, 1, true);
        const can = new THREE.Mesh(canGeo, getMat(0x4f46e5, 0.5));
        rootGroup.add(can);
        compMeshes.push(can);

        const spiralGeo = new THREE.CylinderGeometry(1.1, 1.1, 3.6, 16);
        const spiral = new THREE.Mesh(spiralGeo, getMat(0xf59e0b, 0.9));
        rootGroup.add(spiral);
        compMeshes.push(spiral);
        break;
      }

      case "touchscreen": {
        const layerGeo = new THREE.BoxGeometry(3.2, 4.8, 0.08);
        const oled = new THREE.Mesh(layerGeo, getMat(0x09090b));
        const ito = new THREE.Mesh(layerGeo, getMat(0x0284c7, 0.4, true));
        ito.position.z = 0.15;
        const glass = new THREE.Mesh(layerGeo, getMat(0x38bdf8, 0.3));
        glass.position.z = 0.3;

        rootGroup.add(oled);
        rootGroup.add(ito);
        rootGroup.add(glass);

        compMeshes.push(oled);
        compMeshes.push(ito);
        compMeshes.push(glass);
        break;
      }

      case "ai-neural": {
        const neuronMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.2 });
        const lineMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.45 });

        const layers = [-2.2, 0, 2.2];
        const counts = [4, 6, 2];
        const nodePositions: THREE.Vector3[][] = [];

        layers.forEach((x, lIdx) => {
          const c = counts[lIdx];
          const curList: THREE.Vector3[] = [];
          const layerGroup = new THREE.Group();
          for (let i = 0; i < c; i++) {
            const y = (i - (c - 1) / 2) * 0.9;
            const pos = new THREE.Vector3(x, y, 0);
            curList.push(pos);
            const neuron = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), neuronMat);
            neuron.position.copy(pos);
            layerGroup.add(neuron);
          }
          rootGroup.add(layerGroup);
          compMeshes.push(layerGroup);
          nodePositions.push(curList);
        });

        for (let l = 0; l < nodePositions.length - 1; l++) {
          nodePositions[l].forEach((p1) => {
            nodePositions[l + 1].forEach((p2) => {
              const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
              const line = new THREE.Line(geo, lineMat);
              rootGroup.add(line);
            });
          });
        }
        break;
      }

      case "gps": {
        const earthGeo = new THREE.SphereGeometry(2.2, 24, 24);
        const earthMat = getMat(0x0284c7, 0.9);
        const earth = new THREE.Mesh(earthGeo, earthMat);
        rootGroup.add(earth);
        compMeshes.push(earth);

        const satGroup = new THREE.Group();
        const satPositions = [
          new THREE.Vector3(-3.8, 2.5, 1.2),
          new THREE.Vector3(3.5, 2.8, -1.5),
          new THREE.Vector3(0.5, 4.2, 2.2),
          new THREE.Vector3(2.8, -2.5, 2.8),
        ];

        satPositions.forEach((pos) => {
          const singleSat = new THREE.Group();
          singleSat.position.copy(pos);
          const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.4), getMat(0xf59e0b));
          singleSat.add(body);
          const wing1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.05), getMat(0x38bdf8));
          wing1.position.x = -0.7;
          singleSat.add(wing1);
          const wing2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.05), getMat(0x38bdf8));
          wing2.position.x = 0.7;
          singleSat.add(wing2);
          satGroup.add(singleSat);
        });
        rootGroup.add(satGroup);
        compMeshes.push(satGroup);
        break;
      }

      case "anc": {
        const arcCurve = new THREE.EllipseCurve(0, 0, 2.4, 2.2, 0, Math.PI, false, 0);
        const points = arcCurve.getPoints(32).map((p) => new THREE.Vector3(p.x, p.y + 0.5, 0));
        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
        const arcLine = new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: 0x475569, linewidth: 3 }));
        rootGroup.add(arcLine);
        compMeshes.push(arcLine);

        const cupGroup = new THREE.Group();
        const driverGroup = new THREE.Group();

        [-2.4, 2.4].forEach((x, idx) => {
          const cupGeo = new THREE.CylinderGeometry(0.85, 0.95, 1.2, 24);
          const cup = new THREE.Mesh(cupGeo, getMat(0x1e293b));
          cup.rotation.z = Math.PI / 2;
          cup.position.set(x, 0.5, 0);
          cupGroup.add(cup);

          const driver = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.2, 16), getMat(0x10b981));
          driver.rotation.z = Math.PI / 2;
          driver.position.set(x, 0.5, 0);
          driverGroup.add(driver);

          const ring = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.3, 24), getMat(idx === 0 ? 0xef4444 : 0x38bdf8, 0.6));
          ring.position.set(x > 0 ? x + 0.8 : x - 0.8, 0.5, 0);
          ring.rotation.y = Math.PI / 2;
          driverGroup.add(ring);
          animList.push(ring);
        });
        rootGroup.add(cupGroup);
        rootGroup.add(driverGroup);
        compMeshes.push(cupGroup);
        compMeshes.push(driverGroup);
        break;
      }

      case "oled": {
        const substrate = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 3.2), getMat(0x1e293b));
        substrate.position.y = -0.8;
        rootGroup.add(substrate);
        compMeshes.push(substrate);

        const eml = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.25, 3.2), getMat(0xec4899, 0.9));
        eml.position.y = 0.4;
        rootGroup.add(eml);
        compMeshes.push(eml);

        const subpixelGroup = new THREE.Group();
        [-1.2, 0.0, 1.2].forEach((x, i) => {
          const colColors = [0xef4444, 0x22c55e, 0x3b82f6];
          const subpixel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), getMat(colColors[i]));
          subpixel.position.set(x, 0.4, 0);
          subpixelGroup.add(subpixel);
        });
        rootGroup.add(subpixelGroup);
        compMeshes.push(subpixelGroup);
        break;
      }

      case "face-id": {
        const phone = new THREE.Mesh(new THREE.BoxGeometry(3.6, 5.8, 0.3), getMat(0x0f172a));
        phone.position.z = -1.8;
        rootGroup.add(phone);
        compMeshes.push(phone);

        const faceGeo = new THREE.IcosahedronGeometry(1.6, 2);
        const faceMat = new THREE.MeshStandardMaterial({
          color: 0x6366f1,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });
        const face = new THREE.Mesh(faceGeo, faceMat);
        face.position.set(0, 0, 1.6);
        rootGroup.add(face);
        compMeshes.push(face);

        const rayGeo = new THREE.ConeGeometry(1.8, 3.4, 16, 1, true);
        const rayMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.25 });
        const rayCone = new THREE.Mesh(rayGeo, rayMat);
        rayCone.rotation.x = -Math.PI / 2;
        rayCone.position.set(0, 1.2, 0);
        rootGroup.add(rayCone);
        compMeshes.push(rayCone);
        break;
      }

      case "nfc": {
        const phone = new THREE.Mesh(new THREE.BoxGeometry(3.0, 5.0, 0.25), getMat(0x0f172a));
        phone.position.set(-1.8, 0, 0);
        rootGroup.add(phone);
        compMeshes.push(phone);

        const coilMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
        const coil = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.06, 8, 32), coilMat);
        coil.position.set(-1.8, 0.4, 0.15);
        rootGroup.add(coil);
        compMeshes.push(coil);

        const posGeo = new THREE.BoxGeometry(2.8, 4.2, 1.2);
        const pos = new THREE.Mesh(posGeo, getMat(0x1e293b));
        pos.position.set(2.0, 0, 0);
        rootGroup.add(pos);
        compMeshes.push(pos);

        const fluxGroup = new THREE.Group();
        for (let r = 0.6; r <= 1.4; r += 0.4) {
          const wave = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 8, 24), getMat(0xf59e0b, 0.5));
          wave.rotation.y = Math.PI / 2;
          wave.position.set(0.1, 0.4, 0);
          fluxGroup.add(wave);
          animList.push(wave);
        }
        rootGroup.add(fluxGroup);
        compMeshes.push(fluxGroup);
        break;
      }

      case "transistor-euv": {
        const wafer = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 0.3, 32), getMat(0x1e293b));
        wafer.position.y = -1.2;
        rootGroup.add(wafer);
        compMeshes.push(wafer);

        const sdGroup = new THREE.Group();
        const source = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 1.8), getMat(0xf59e0b));
        source.position.set(-1.6, -0.2, 0);
        sdGroup.add(source);
        const drain = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 1.8), getMat(0xf59e0b));
        drain.position.set(1.6, -0.2, 0);
        sdGroup.add(drain);
        rootGroup.add(sdGroup);
        compMeshes.push(sdGroup);

        const sheetsGroup = new THREE.Group();
        [-0.5, 0.0, 0.5].forEach((y) => {
          const sheet = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 1.2), getMat(0x38bdf8));
          sheet.position.y = y;
          sheetsGroup.add(sheet);
        });
        rootGroup.add(sheetsGroup);
        compMeshes.push(sheetsGroup);

        const gate = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.8, 1.6), getMat(0xa855f7, 0.65));
        gate.position.set(0, 0, 0);
        rootGroup.add(gate);
        compMeshes.push(gate);

        const laser = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.2, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xe879f9, wireframe: true, transparent: true, opacity: 0.4 }));
        laser.rotation.x = Math.PI;
        laser.position.set(0, 2.2, 0);
        rootGroup.add(laser);
        compMeshes.push(laser);
        break;
      }

      case "quantum-computing": {
        const stageGroup = new THREE.Group();
        const stageConfigs = [
          { r: 2.2, h: 0.15, y: 2.4, color: 0x94a3b8 },
          { r: 1.8, h: 0.15, y: 1.4, color: 0xd97706 },
          { r: 1.4, h: 0.15, y: 0.4, color: 0xf59e0b },
          { r: 1.0, h: 0.15, y: -0.6, color: 0xfbbf24 },
          { r: 0.7, h: 0.25, y: -1.6, color: 0x10b981 },
        ];
        stageConfigs.forEach((st) => {
          const flange = new THREE.Mesh(new THREE.CylinderGeometry(st.r, st.r, st.h, 24), getMat(st.color));
          flange.position.y = st.y;
          stageGroup.add(flange);
        });
        rootGroup.add(stageGroup);
        compMeshes.push(stageGroup);

        const rodsGroup = new THREE.Group();
        [-1.0, 1.0].forEach((x) => {
          [-0.8, 0.8].forEach((z) => {
            const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.0, 8), getMat(0xf59e0b));
            rod.position.set(x, 0.4, z);
            rodsGroup.add(rod);
          });
        });
        rootGroup.add(rodsGroup);
        compMeshes.push(rodsGroup);

        const qchip = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), getMat(0x38bdf8));
        qchip.position.y = -1.8;
        rootGroup.add(qchip);
        compMeshes.push(qchip);

        const bloch = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.5 }));
        bloch.position.y = -2.6;
        rootGroup.add(bloch);
        compMeshes.push(bloch);
        animList.push(bloch);
        break;
      }

      case "mems-sensor": {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.4, 4.2), getMat(0x1e293b, 0.85));
        rootGroup.add(frame);
        compMeshes.push(frame);

        const mass = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 2.2), getMat(0x38bdf8));
        mass.position.y = 0.1;
        rootGroup.add(mass);
        compMeshes.push(mass);

        const springGroup = new THREE.Group();
        [-1.6, 1.6].forEach((x) => {
          const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8), getMat(0x34d399));
          spring.rotation.z = Math.PI / 2;
          spring.position.set(x > 0 ? 1.6 : -1.6, 0.1, 0);
          springGroup.add(spring);
        });
        rootGroup.add(springGroup);
        compMeshes.push(springGroup);

        const combsGroup = new THREE.Group();
        [-0.8, -0.4, 0.0, 0.4, 0.8].forEach((z) => {
          const lComb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.1), getMat(0xf59e0b));
          lComb.position.set(-1.4, 0.1, z);
          combsGroup.add(lComb);
          const rComb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.1), getMat(0xf59e0b));
          rComb.position.set(1.4, 0.1, z);
          combsGroup.add(rComb);
        });
        rootGroup.add(combsGroup);
        compMeshes.push(combsGroup);
        break;
      }

      case "fiber-optic": {
        const coreGeo = new THREE.CylinderGeometry(0.7, 0.7, 5.5, 24);
        const core = new THREE.Mesh(coreGeo, getMat(0x0284c7, 0.7));
        core.rotation.z = Math.PI / 2;
        rootGroup.add(core);
        compMeshes.push(core);

        const cladGeo = new THREE.CylinderGeometry(1.6, 1.6, 5.5, 32, 1, true);
        const clad = new THREE.Mesh(cladGeo, getMat(0x38bdf8, 0.3));
        clad.rotation.z = Math.PI / 2;
        rootGroup.add(clad);
        compMeshes.push(clad);

        const rayPoints = [
          new THREE.Vector3(-2.6, 0, 0),
          new THREE.Vector3(-1.6, 0.45, 0.3),
          new THREE.Vector3(-0.4, -0.45, -0.3),
          new THREE.Vector3(0.8, 0.45, 0.3),
          new THREE.Vector3(2.0, -0.45, -0.3),
          new THREE.Vector3(2.6, 0, 0),
        ];
        const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPoints);
        const rayLine = new THREE.Line(rayGeo, new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3 }));
        rootGroup.add(rayLine);
        compMeshes.push(rayLine);

        const pod = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.2, 16, 32), getMat(0x10b981));
        pod.rotation.y = Math.PI / 2;
        rootGroup.add(pod);
        compMeshes.push(pod);
        break;
      }

      case "pcb-motherboard": {
        const pcb = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.25, 4.8), getMat(0x042f2e));
        rootGroup.add(pcb);
        compMeshes.push(pcb);

        const socketGroup = new THREE.Group();
        const socket = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 1.8), getMat(0x0f172a));
        socket.position.set(-1.2, 0.2, -0.8);
        socketGroup.add(socket);
        const cpuDie = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.2), getMat(0xf59e0b));
        cpuDie.position.set(-1.2, 0.35, -0.8);
        socketGroup.add(cpuDie);
        rootGroup.add(socketGroup);
        compMeshes.push(socketGroup);

        const vrm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 2.4), getMat(0x1e293b));
        vrm.position.set(-2.2, 0.5, -0.8);
        rootGroup.add(vrm);
        compMeshes.push(vrm);

        const dimmGroup = new THREE.Group();
        [0.4, 0.8, 1.2, 1.6].forEach((x) => {
          const dimm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 2.6), getMat(0x38bdf8));
          dimm.position.set(x, 0.25, -0.8);
          dimmGroup.add(dimm);
        });
        rootGroup.add(dimmGroup);
        compMeshes.push(dimmGroup);

        const pcie = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 0.25), getMat(0x94a3b8));
        pcie.position.set(0, 0.25, 1.4);
        rootGroup.add(pcie);
        compMeshes.push(pcie);
        break;
      }

      default: {
        const sub = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.2, 4.0), getMat(0x064e3b));
        rootGroup.add(sub);

        const die = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 2.0), getMat(0x4f46e5));
        die.position.y = 0.2;
        rootGroup.add(die);

        const ihs = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.3, 3.4), getMat(0xa1a1aa));
        ihs.position.y = 0.4;
        rootGroup.add(ihs);

        compMeshes.push(ihs);
        compMeshes.push(die);
        compMeshes.push(sub);
        break;
      }
    }

    componentMeshesRef.current = compMeshes;

    // ── Auto-Centering & Scaling ─────────────────────────
    const bbox = new THREE.Box3().setFromObject(rootGroup);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    rootGroup.position.set(-center.x, -center.y, -center.z);

    const size = new THREE.Vector3();
    bbox.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z) || 5;
    const fovInRad = (camera.fov * Math.PI) / 180;
    let optimalDistance = Math.abs(maxDimension / 2 / Math.tan(fovInRad / 2)) * 1.45;
    optimalDistance = Math.max(optimalDistance, 6.5);

    camera.position.set(0, 0, optimalDistance);
    camera.lookAt(0, 0, 0);

    animElementsRef.current = animList;

    // ── Mouse & Touch 360° Drag Orbit Controls ──────────
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let initialPinchDistance = 0;
    let initialCameraDistance = optimalDistance;

    const getTouchDistance = (e: TouchEvent) => {
      if (e.touches.length < 2) return 0;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Pointer events (handles desktop mouse drag seamlessly)
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // Touch events handled with dedicated touch listeners
      isDragging = true;
      prevPos = { x: e.clientX, y: e.clientY };
      if (mount.setPointerCapture) {
        try {
          mount.setPointerCapture(e.pointerId);
        } catch {}
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!isDragging || !rootGroup) return;
      const deltaX = e.clientX - prevPos.x;
      const deltaY = e.clientY - prevPos.y;

      rootGroup.rotation.y += deltaX * 0.01;
      rootGroup.rotation.x += deltaY * 0.01;

      prevPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isDragging = false;
      if (mount.releasePointerCapture) {
        try {
          mount.releasePointerCapture(e.pointerId);
        } catch {}
      }
    };

    // Dedicated Mobile Touch Listeners (single-finger rotate + two-finger pinch-zoom)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDragging = false;
        initialPinchDistance = getTouchDistance(e);
        initialCameraDistance = camera.position.length();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging && rootGroup) {
        if (e.cancelable) e.preventDefault();
        const deltaX = e.touches[0].clientX - prevPos.x;
        const deltaY = e.touches[0].clientY - prevPos.y;

        rootGroup.rotation.y += deltaX * 0.012;
        rootGroup.rotation.x += deltaY * 0.012;

        prevPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && initialPinchDistance > 0) {
        if (e.cancelable) e.preventDefault();
        const currentDist = getTouchDistance(e);
        if (currentDist > 0) {
          const ratio = initialPinchDistance / currentDist;
          const newDist = THREE.MathUtils.clamp(initialCameraDistance * ratio, 3.5, 20);
          camera.position.setLength(newDist);
        }
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      initialPinchDistance = 0;
    };

    mount.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    mount.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    // ── Animation & 3D Pin Projection Loop ───────────────
    let reqId: number;
    let frameCount = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (!isDragging && rootGroup) {
        rootGroup.rotation.y += 0.005;
      }

      animElementsRef.current.forEach((obj) => {
        obj.rotation.z += 0.01;
      });

      renderer.render(scene, camera);

      // Project 3D Screen Coordinates for Exploded Callout Pins
      frameCount++;
      if (frameCount % 2 === 0 && componentMeshesRef.current.length > 0 && mountRef.current) {
        const w = mountRef.current.clientWidth || 800;
        const h = mountRef.current.clientHeight || (typeof window !== "undefined" && window.innerWidth <= 480 ? 320 : window.innerWidth <= 768 ? 380 : 480);

        const calculatedPins: ScreenPin[] = [];
        componentMeshesRef.current.forEach((mesh, idx) => {
          if (!mesh) return;
          const pos = new THREE.Vector3();
          mesh.getWorldPosition(pos);

          // Project to 2D normalized device coordinates (-1 to +1)
          pos.project(camera);

          const isBehind = pos.z > 1;
          const px = ((pos.x + 1) * w) / 2;
          const py = ((-pos.y + 1) * h) / 2;

          const info = topicComponents[idx] || {
            id: `part-${idx + 1}`,
            name: { en: `Part ${idx + 1}`, id: `Komponen ${idx + 1}` },
            role: { en: "Component part", id: "Bagian komponen sistem" },
            color: "#38BDF8",
          };

          calculatedPins.push({
            index: idx + 1,
            x: px,
            y: py,
            visible: !isBehind && px >= 24 && px <= w - 24 && py >= 24 && py <= h - 24,
            info,
          });
        });

        setPins(calculatedPins);
      }
    };
    animate();

    // ── Responsive Resize ───────────────────────────────
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 800;
      const h = mount.clientHeight || (window.innerWidth <= 480 ? 320 : window.innerWidth <= 768 ? 380 : 480);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      mount.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);

      mount.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);

      window.removeEventListener("resize", handleResize);
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [topicId, topicComponents]);

  // ── Exploded View Toggle ────────────────────────────
  const toggleExploded = () => {
    const nextExploded = !isExploded;
    setIsExploded(nextExploded);
    if (!explodedGroupRef.current) return;

    const group = explodedGroupRef.current;

    // On first explode, cache original positions
    if (originalPositionsRef.current.size === 0) {
      group.children.forEach((child, i) => {
        originalPositionsRef.current.set(`${i}`, child.position.clone());
      });
    }

    const explodeFactor = 2.0;

    group.children.forEach((child, i) => {
      const key = `${i}`;
      const origPos = originalPositionsRef.current.get(key);
      if (!origPos) return;

      if (nextExploded) {
        const direction = origPos.clone();
        if (direction.length() < 0.05) {
          // Push vertically or horizontally based on index
          const offsetIndex = (i % 4) - 1.5;
          direction.set(offsetIndex * 0.8, (i + 1) * 0.6, 0);
        }
        direction.normalize();
        const dist = Math.max(origPos.length() * explodeFactor, 1.4);
        child.position.copy(origPos.clone().add(direction.multiplyScalar(dist)));
      } else {
        child.position.copy(origPos);
      }
    });
  };

  const toggleXRay = () => {
    const nextXRay = !isXRay;
    setIsXRay(nextXRay);
    if (!explodedGroupRef.current) return;
    explodedGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if ("wireframe" in mat) mat.wireframe = nextXRay;
          });
        } else if ("wireframe" in child.material) {
          child.material.wireframe = nextXRay;
        }
      }
    });
  };

  // ── Highlight Component in 3D ───────────────────────
  const handleHighlight = (index: number | null) => {
    setHighlightedIndex(index);
    if (!componentMeshesRef.current) return;

    componentMeshesRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          if (index === null) {
            child.material.emissive.setHex(0x000000);
          } else if (idx === index) {
            child.material.emissive.setHex(0x38bdf8);
            child.material.emissiveIntensity = 0.6;
          } else {
            child.material.emissive.setHex(0x000000);
          }
        }
      });
    });
  };

  return (
    <div className={styles.container}>
      {/* 3D Canvas with Floating Screen Pins */}
      <div className={styles.canvasWrapper}>
        <div ref={mountRef} className={styles.canvas} />

        {/* 3D Floating Pin Callouts (Visible when exploded) */}
        {isExploded && pins.length > 0 && (
          <div className={styles.pinsOverlay}>
            {pins.map((pin) => {
              if (!pin.visible) return null;
              const isHigh = highlightedIndex === pin.index - 1;
              return (
                <div
                  key={pin.index}
                  className={styles.pinContainer}
                  style={{
                    left: `${pin.x}px`,
                    top: `${pin.y}px`,
                  }}
                  onMouseEnter={() => handleHighlight(pin.index - 1)}
                  onMouseLeave={() => handleHighlight(null)}
                  onClick={() => handleHighlight(pin.index - 1)}
                >
                  <div
                    className={`${styles.pinBadge} ${isHigh ? styles.pinBadgeActive : ""}`}
                    style={{
                      borderColor: pin.info.color || "#38BDF8",
                      backgroundColor: isHigh ? pin.info.color : "rgba(15, 23, 42, 0.85)",
                    }}
                  >
                    {pin.index}
                  </div>

                  <div className={`${styles.pinTooltip} ${isHigh ? styles.pinTooltipActive : ""}`}>
                    <span className={styles.pinTooltipTitle}>
                      [{pin.index}] {language === "id" ? pin.info.name.id : pin.info.name.en}
                    </span>
                    <span className={styles.pinTooltipRole}>
                      {language === "id" ? pin.info.role.id : pin.info.role.en}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exploded View Component Guide Catalog */}
      {isExploded && (
        <div className={styles.explodedGuide} id="exploded-3d-component-guide">
          <div className={styles.guideHeader}>
            <div className={styles.guideTitleWrap}>
              <span className={styles.guideBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {language === "id" ? "Peta Komponen" : "Component Map"}
              </span>
              <h4 className={styles.guideTitle}>
                {language === "id"
                  ? "Komponen yang Terurai (Exploded Parts)"
                  : "Exploded 3D Component Breakdown"}
              </h4>
            </div>
            <span className={styles.guideSubtitle}>
              {language === "id"
                ? `${topicComponents.length} Bagian Teridentifikasi`
                : `${topicComponents.length} Parts Identified`}
            </span>
          </div>

          <div className={styles.componentGrid}>
            {topicComponents.map((comp, idx) => {
              const isHigh = highlightedIndex === idx;
              return (
                <div
                  key={comp.id}
                  className={`${styles.componentCard} ${isHigh ? styles.componentCardActive : ""}`}
                  onMouseEnter={() => handleHighlight(idx)}
                  onMouseLeave={() => handleHighlight(null)}
                  onClick={() => handleHighlight(idx)}
                >
                  <div
                    className={styles.componentNumber}
                    style={{ backgroundColor: comp.color || "#38BDF8" }}
                  >
                    {idx + 1}
                  </div>
                  <div className={styles.componentInfo}>
                    <span className={styles.componentName}>
                      {language === "id" ? comp.name.id : comp.name.en}
                    </span>
                    <span className={styles.componentRole}>
                      {language === "id" ? comp.role.id : comp.role.en}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Spatial Controls */}
      <div className={styles.toolbar}>
        <div className={styles.controlsLeft}>
          <button
            onClick={toggleExploded}
            className={`${styles.toolBtn} ${isExploded ? styles.toolBtnActive : ""}`}
            id="toggle-exploded-view"
          >
            {isExploded
              ? language === "id"
                ? "Satukan Model"
                : "Collapse Model"
              : language === "id"
              ? "Uraikan Komponen 3D"
              : "Exploded View"}
          </button>
          <button
            onClick={toggleXRay}
            className={`${styles.toolBtn} ${isXRay ? styles.toolBtnActive : ""}`}
            id="toggle-xray-mode"
          >
            {isXRay
              ? language === "id"
                ? "Mode Solid"
                : "Solid Mesh"
              : language === "id"
              ? "Mode Rangka X-Ray"
              : "X-Ray Wireframe"}
          </button>
        </div>

        <div className={styles.hint}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span>
            {language === "id"
              ? "Sentuh atau geser untuk memutar 360° • Ketuk/sorot nomor komponen untuk melihat detail"
              : "Touch or drag to rotate 360° • Tap/hover component numbers to view details"}
          </span>
        </div>
      </div>
    </div>
  );
}


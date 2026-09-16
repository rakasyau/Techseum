import type { TopicTranslation } from "../types";

export const batteryId: TopicTranslation = {
  title: "Bagaimana Baterai Menyalurkan Daya?",
  question: "Dari mana sebenarnya listrik di dalam baterai berasal?",
  summary:
    "Baterai adalah reaksi kimia yang terkendali. Ion lithium berpindah-pindah antara dua elektrode, dan elektron yang mereka tinggalkan menempuh jalur memutar — melewati perangkatmu.",
  tags: ["lithium-ion", "elektrokimia", "tegangan", "pengisian"],
  levels: {
    1: {
      lede: "Baterai tidak menyimpan listrik. Ia menyimpan bahan kimia yang siap bereaksi, dan melepaskannya menghasilkan arus sesuai kebutuhan.",
      blocks: [
        {
          type: "p",
          text: "Di dalam baterai ada dua elektrode dan elektrolit di antaranya. Satu sisi ingin melepaskan elektron, sisi lain ingin menerimanya. Menghalangi jalur langsung memaksa elektron-elektron itu menempuh rangkaianmu sebagai gantinya.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Tegangan adalah tekanan",
          text: "Tegangan bukan jumlah energi yang tersedia — melainkan dorongan pada setiap elektron. Kapasitas, yang diukur dalam ampere-jam, adalah total muatan yang bisa kamu pindahkan.",
        },
      ],
    },
    2: {
      lede: "Ion lithium bergerak antara anoda grafit dan katoda oksida logam, sementara elektron dipaksa melewati rangkaian luar.",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Discharge", text: "Lithium meninggalkan anoda dan menempuh elektrolit menuju katoda." },
            { title: "Elektron memutar", text: "Elektron tidak bisa melintasi elektrolit, jadi mereka mengalir melalui perangkatmu." },
            { title: "Charge", text: "Tegangan dari luar mendorong seluruh proses ini ke arah sebaliknya." },
            { title: "Interkalasi", text: "Ion masuk kembali ke struktur berlapis anoda." },
          ],
        },
        {
          type: "p",
          text: "Jalur memutar itulah intinya. Arus yang berguna adalah aliran elektron melalui rangkaian luar, dan jumlahnya persis menyeimbangkan lalu lintas ion di dalam.",
        },
      ],
    },
    3: {
      lede: "Pengisian bukan arus yang konstan — ia mengikuti profil bertahap yang dirancang hati-hati agar sel tidak rusak.",
      blocks: [
        {
          type: "p",
          text: "Di bawah sekitar 20%, charger memberikan arus tetap dan tegangannya menanjak. Begitu sel mencapai tegangan maksimumnya, charger menahan tegangan itu konstan dan mengamati arus yang menyusut. Tahap akhir yang lambat inilah sebabnya ponsel mengisi cepat hingga 80% lalu melambat.",
        },
        {
          type: "stats",
          items: [
            { label: "Tegangan sel", value: "3,0–4,2 V", note: "rentang khas Li-ion" },
            { label: "Pengisian puncak", value: "0,5–1 C", note: "dinormalisasi terhadap kapasitas" },
            { label: "Siklus hidup", value: "500–1.000", note: "hingga 80% kapasitas" },
            { label: "Self-discharge", value: "2–3%", note: "per bulan" },
          ],
        },
      ],
    },
    4: {
      lede: "Degradasi berasal dari antarmuka, dan manajemen termal adalah faktor tunggal terbesar yang memengaruhi umur pakainya.",
      blocks: [
        {
          type: "p",
          text: "Setiap siklus menumbuhkan lapisan pasivasi yang sedikit lebih tebal di anoda dan mengonsumsi sedikit lithium serta elektrolit. Pengisian cepat mempercepatnya karena reaksi yang sama dipacu lebih keras — itulah sebabnya panas adalah musuh masa pakai baterai.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Thermal runaway",
          text: "Jika sebuah sel terlalu panas, reaksinya menjadi makin mempercepat dirinya sendiri. Itulah sebabnya pak baterai memakai separator pemutus, perangkat pemutus arus, dan pemantauan per sel.",
        },
        {
          type: "compare",
          left: { title: "Menua lebih cepat", items: ["Panas yang terus-menerus", "Mengisi hingga 100% setiap hari", "Discharge dalam", "Pengisian sangat cepat"] },
          right: { title: "Menua lebih lambat", items: ["Beroperasi sejuk", "Mengisi hingga 80%", "Siklus parsial", "Laju pengisian sedang"] },
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      anode: { label: "Anoda", sub: "grafit", desc: "Elektrode negatif. Menyimpan ion lithium di antara lapisan karbon saat terisi." },
      cathode: { label: "Katoda", sub: "oksida logam", desc: "Elektrode positif. Menerima ion lithium saat discharge dan mengembalikannya saat pengisian." },
      electrolyte: { label: "Elektrolit", sub: "melewatkan ion, menahan elektron", desc: "Medium yang membiarkan ion lithium lewat tetapi menahan elektron sepenuhnya. Inilah yang memaksa arus berguna mengalir di luar sel." },
      device: { label: "Perangkatmu", sub: "beban", desc: "Rangkaian yang dilalui elektron secara paksa — ponsel, motor, atau layar." },
      ions: { label: "Ion Lithium", sub: "melalui elektrolit", desc: "Ion lithium positif bolak-balik di antara elektrode, membawa reaksinya." },
      electrons: { label: "Elektron", sub: "hanya jalur luar", desc: "Tidak bisa melintasi elektrolit. Satu-satunya rute adalah melalui rangkaian luar, dan rute itulah listrikmu." },
    },
    edges: {
      "anode->ions": { label: "lepas" },
      "ions->cathode": { label: "interkalasi" },
      "anode->electrons": { label: "memutar" },
      "device->cathode": { label: "arus" },
    },
    steps: {
      release: { title: "1 · Lepaskan Ion", short: "Lepas", description: "Ion lithium meninggalkan anoda grafit berlapis dan masuk ke elektrolit, siap bermigrasi.", value: "anoda melepas Li+" },
      migrate: { title: "2 · Migrasi", short: "Migrasi", description: "Ion-ion bergerak melalui elektrolit menuju katoda. Elektron tidak bisa mengikutinya, jadi mereka didorong ke rangkaian luar.", value: "ion melintasi ~120 um" },
      power: { title: "3 · Menyalakan Perangkat", short: "Daya", description: "Elektron mengalir melalui perangkatmu dan melakukan kerja yang berguna — menyalakan layar, menggerakkan motor, menjalankan radio.", value: "3,7 V nominal" },
      arrive: { title: "4 · Tiba & Berbalik", short: "Tiba", description: "Elektron bergabung kembali dengan katoda, menutup rangkaian. Berikan tegangan dari luar dan seluruh proses berjalan terbalik, mengisi ulang sel.", value: "discharge selesai" },
    },
  },
  model3d: {
    hotspots: {
      anode: { label: "Anoda (grafit)", detail: "Elektrode negatif tempat lithium disimpan saat terisi. Struktur berlapisnya adalah alasan ion bisa masuk dan keluar." },
      separator: { label: "Separator", detail: "Film berpori yang menjaga kedua elektrode tetap terpisah. Ia menahan elektron dan akan mati jika sel terlalu panas." },
      cathode: { label: "Katoda (oksida)", detail: "Elektrode positif. Kimianya sebagian besar menentukan tegangan dan densitas energi sel." },
      bms: { label: "Manajemen baterai", detail: "Memantau tegangan, arus, dan suhu per sel serta menyeimbangkan muatan di seluruh pak baterai." },
    },
  },
};

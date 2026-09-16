import type { TopicTranslation } from "../types";

export const smartphoneId: TopicTranslation = {
  title: "Apa Isi di Dalam Smartphone?",
  question: "Bagaimana kamera, radio, layar, dan baterai muat dalam benda setipis itu?",
  summary:
    "Ponsel adalah tumpukan sistem terspesialisasi yang berbagi satu baterai: system-on-chip, memori, radio, sensor, baterai, dan layar, semuanya berkomunikasi lewat bus bersama.",
  tags: ["SoC", "integrasi", "sensor", "anggaran daya"],
  levels: {
    1: {
      lede: "Smartphone bukan satu komputer — ia adalah beberapa komputer terspesialisasi yang berbagi satu baterai dan satu layar.",
      blocks: [
        {
          type: "p",
          text: "Chip utama menangani pekerjaan umum, tetapi kamera, radio, dan sensor gerak masing-masing punya prosesor khususnya sendiri. Itulah cara ponsel bisa melacak langkahmu tanpa membangunkan chip utama.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Semuanya soal tukar-menukar daya",
          text: "Layar dan radio biasanya menjadi dua penguras terbesar. Sebagian besar keputusan rekayasa di ponsel sebenarnya adalah keputusan tentang baterai.",
        },
      ],
    },
    2: {
      lede: "System-on-chip menyatukan CPU, GPU, memory controller, image processor, dan radio ke dalam satu paket.",
      blocks: [
        {
          type: "p",
          text: "Menaruh semuanya di satu die memperpendek jarak yang ditempuh sinyal, yang menurunkan daya dan meningkatkan kecepatan. Ini juga membatasi desain termal, karena semua panas itu dihasilkan di beberapa milimeter persegi saja.",
        },
        {
          type: "steps",
          items: [
            { title: "Sensor", text: "Menangkap besaran fisik." },
            { title: "Hub", text: "Chip berdaya rendah mengagregasi pembacaan secara terus-menerus." },
            { title: "SoC", text: "Prosesor utama menangani apa pun yang berat." },
            { title: "Radio", text: "Mengirim hasil keluar, jika ada yang membutuhkannya." },
          ],
        },
      ],
    },
    3: {
      lede: "Komponen saling bicara lewat bus bersama, dan sensor sengaja dijaga di jalur paling hemat daya yang mungkin.",
      blocks: [
        {
          type: "p",
          text: "Kamera terhubung lewat MIPI, penyimpanan lewat UFS, dan periferal berkecepatan rendah lewat I2C atau SPI. Tiap bus punya bandwidth dan biaya daya, dan perancang mengarahkan pekerjaan ke bus termurah yang mampu menanganinya.",
        },
        {
          type: "stats",
          items: [
            { label: "Transistor SoC", value: "~20 miliar" },
            { label: "Baterai", value: "4,500 mAh", note: "umumnya" },
            { label: "Layar", value: "1,200 nits", note: "puncak di luar ruangan" },
            { label: "Radio", value: "6+", note: "termasuk yang selalu aktif" },
          ],
        },
      ],
    },
    4: {
      lede: "Anggaran daya dan termal dirancang bersama, dan sensor berjalan di pulau berdaya rendah khusus agar tetap selalu aktif.",
      blocks: [
        {
          type: "p",
          text: "Ponsel tidak bisa membuang lebih dari beberapa watt dalam waktu lama tanpa menjadi tidak nyaman, jadi SoC menjadwalkan ledakan pekerjaan lalu kembali ke keadaan tidur dalam. Performa berkelanjutan dibatasi oleh suhu, bukan oleh kemampuan puncaknya.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Sensor fusion",
          text: "Tidak ada satu sensor pun yang andal sendirian. Menggabungkan accelerometer, gyroscope, dan magnetometer dengan software menghasilkan orientasi yang lebih stabil daripada yang bisa dihasilkan satu chip mana pun.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Dinding panas",
          text: "Beban kerja berkelanjutan seperti bermain game atau merekam video mendorong ponsel ke batas termalnya, dan sistem sengaja menurunkan clock agar tetap berada di dalam batas itu.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      sensors: { label: "Klaster Sensor", sub: "accel, gyro, cahaya", desc: "Sensor fisik yang selalu aktif. Masing-masing mengubah besaran dunia nyata menjadi pembacaan elektrik." },
      hub: { label: "Hub Berdaya Rendah", sub: "tetap terjaga", desc: "Chip yang selalu aktif dan mengagregasi data sensor agar prosesor utama bisa tetap tertidur." },
      soc: { label: "System-on-Chip", sub: "CPU, GPU, NPU, ISP", desc: "Komputer utama. Menyatukan begitu banyak hal di satu die memperpendek jalur sinyal, menghemat daya dan ruang." },
      mem: { label: "Memori & Penyimpanan", sub: "RAM + UFS", desc: "Memori kerja yang volatil dan penyimpanan flash cepat, terhubung lewat jalur serial berbandwidth tinggi." },
      radio: { label: "Radio", sub: "5G, Wi-Fi, Bluetooth", desc: "Radio terpisah untuk jaringan berbeda, masing-masing cukup independen sehingga satu bisa tidur saat yang lain bekerja." },
      camera: { label: "Modul Kamera", sub: "sensor + ISP", desc: "Optik plus sensor plus image processor, sering kali dengan memori khusus untuk menangani ledakan frame." },
      display: { label: "Panel Layar", sub: "penguras terbesar", desc: "Sering menjadi konsumen daya tunggal terbesar, terutama pada kecerahan tinggi di luar ruangan." },
      battery: { label: "Baterai & PMIC", sub: "anggaran bersama", desc: "Setiap subsistem mengambil dari satu baterai. IC manajemen daya mengatur siapa mendapat berapa." },
    },
    edges: {
      "sensors->hub": { label: "pembacaan" },
      "hub->soc": { label: "bangun saat ada kejadian" },
      "soc->mem": { label: "load / store" },
      "soc->radio": { label: "jaringan" },
      "soc->camera": { label: "MIPI" },
      "soc->display": { label: "render" },
      "battery->soc": { label: "daya" },
    },
    steps: {
      sense: { title: "1 · Rasa", short: "Rasa", description: "Sensor yang selalu aktif mendeteksi perubahan — gerakan, cahaya, ketukan — tanpa membangunkan prosesor utama.", value: "kemiringan terdeteksi" },
      wake: { title: "2 · Bangunkan SoC", short: "Bangun", description: "Saat suatu pembacaan penting, hub berdaya rendah membangunkan system-on-chip. CPU, GPU, dan neural engine mulai aktif.", value: "SoC aktif" },
      act: { title: "3 · Kerjakan Tugasnya", short: "Kerja", description: "SoC merender antarmuka, memproses frame kamera, dan menjalankan beban kerja neural apa pun, dengan memanfaatkan memori dan penyimpanan.", value: "frame dirender" },
      broadcast: { title: "4 · Siarkan & Tidur", short: "Kirim", description: "Apa pun yang perlu keluar dikirim lewat radio, dan setiap subsistem kembali ke keadaan daya terendahnya secepat mungkin.", value: "radio idle lagi" },
    },
  },
  model3d: {
    hotspots: {
      display: { label: "Tumpukan layar", detail: "Kaca pelindung, lapisan sentuh, dan panel OLED yang disatukan menjadi satu unit setebal beberapa milimeter." },
      battery: { label: "Baterai", detail: "Biasanya komponen internal tunggal terbesar, dan menjadi batasan yang diperebutkan setiap bagian lain." },
      board: { label: "Logic board", detail: "SoC, memori, dan radio yang dipadatkan di satu area, dengan pelindung tebal di antaranya." },
      camera: { label: "Modul kamera", detail: "Lensa, sensor, dan stabilizer yang dirakit sebagai satu komponen tersegel." },
    },
  },
};

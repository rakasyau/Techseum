import type { TopicTranslation } from "../types";

export const cpuId: TopicTranslation = {
  title: "Bagaimana Cara Kerja CPU?",
  question: "Bagaimana sepotong kecil silikon akhirnya berpikir untukmu?",
  summary:
    "CPU mengambil instruksi dari memori, menerjemahkan maknanya, mengeksekusinya, lalu menuliskan hasilnya kembali — miliaran kali per detik.",
  tags: ["silikon", "transistor", "siklus instruksi", "kecepatan clock"],
  levels: {
    1: {
      lede: "CPU-mu adalah bagian komputer yang benar-benar mengikuti instruksi — satu langkah kecil yang sangat cepat setiap kalinya.",
      blocks: [
        {
          type: "p",
          text: "Segala hal yang kamu lakukan di komputer pada akhirnya menjadi daftar instruksi yang sangat sederhana: jumlahkan dua angka ini, bandingkan keduanya, pindahkan nilai ini ke sana. CPU adalah mesin yang membaca daftar itu dan mengerjakan setiap item secara berurutan.",
        },
        {
          type: "steps",
          items: [
            { title: "Fetch", text: "Ambil instruksi berikutnya dari memori." },
            { title: "Decode", text: "Pahami apa yang diminta instruksi itu." },
            { title: "Execute", text: "Kerjakan operasi aritmetika atau logika yang dijelaskannya." },
            { title: "Write back", text: "Simpan hasilnya dan lanjut ke instruksi berikutnya." },
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Kenapa kecepatannya terasa seketika",
          text: "CPU modern menjalankan siklus ini miliaran kali setiap detik. Siklusnya begitu singkat sehingga seluruh halaman web selesai dirender sebelum matamu selesai terbuka.",
        },
      ],
    },
    2: {
      lede: "Siklus fetch–decode–execute hanya berjalan karena beberapa unit khusus saling menyerahkan pekerjaan secara sinkron.",
      blocks: [
        {
          type: "p",
          text: "Unit kontrol adalah konduktornya: ia menggerakkan setiap bagian lain melalui siklus mengikuti ketukan clock sistem. Program counter menyimpan alamat instruksi berikutnya sehingga CPU selalu tahu posisinya. Decoder menerjemahkan pola bit mentah menjadi sinyal kontrol spesifik yang menggerakkan seluruh bagian chip.",
        },
        {
          type: "p",
          text: "ALU melakukan aritmetika dan logika — penjumlahan, pengurangan, perbandingan, operasi bit. Register adalah sekumpulan kecil slot penyimpanan super cepat yang menampung operand dan hasil yang sedang dikerjakan ALU saat ini.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Pipeline, bukan lomba estafet",
          text: "CPU sungguhan menumpuk tahap-tahap ini sehingga saat satu instruksi dieksekusi, instruksi berikutnya sedang di-decode dan yang ketiga sedang di-fetch. Tumpang tindih itulah yang disebut pipelining, dan itulah sebabnya keputusan desain di satu tahap merambat ke tahap lainnya.",
        },
      ],
    },
    3: {
      lede: "Memori ribuan kali lebih lambat daripada core, jadi CPU dikelilingi hierarki cache yang dirancang untuk menyembunyikan celah itu.",
      blocks: [
        {
          type: "p",
          text: "Membaca dari memori utama memakan waktu sekitar seratus siklus CPU. Cache L1, L2, dan L3 menukar kapasitas dengan latensi: L1 hanya beberapa puluh kilobyte dan menjawab dalam beberapa siklus, sementara L3 dibagi ke seluruh core dan diukur dalam megabyte.",
        },
        {
          type: "compare",
          left: {
            title: "Cache hit",
            items: ["Data ditemukan dekat core", "Beberapa siklus", "CPU terus mengalir"],
          },
          right: {
            title: "Cache miss",
            items: ["Diambil dari memori utama", "Ratusan siklus", "Pipeline bisa terhenti"],
          },
        },
        {
          type: "p",
          text: "Saat kode mengakses memori dengan pola yang terprediksi dan berurutan, prefetcher perangkat keras bisa menebak apa yang akan datang dan memuatnya lebih dulu. Akses acak mengalahkan tebakan itu dan sering menjadi alasan sebenarnya sebuah program terasa lebih lambat daripada program lain.",
        },
      ],
    },
    4: {
      lede: "Di bawah instruction set, semuanya adalah transistor yang berpindah; di atasnya, semuanya adalah taruhan tentang instruksi mana yang layak diprediksi.",
      blocks: [
        {
          type: "p",
          text: "Setiap instruksi diuraikan menjadi micro-operation yang mengalir melalui mesin out-of-order. Scheduler mengeluarkannya begitu input-nya siap, register renaming menghapus dependensi palsu, dan reorder buffer menyelesaikannya sesuai urutan program sehingga hasilnya tetap tampak berurutan bagi software.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Spekulasi adalah taruhan",
          text: "Branch prediction menebak ke arah mana sebuah percabangan bersyarat akan pergi dan mulai mengeksekusi jalur itu. Tebakan yang benar berarti performa gratis; salah prediksi akan membuang isi pipeline dan menanggung seluruh penaltinya. Kerentanan kelas Spectre adalah bayangan keamanan dari optimasi inilah.",
        },
        {
          type: "stats",
          items: [
            { label: "Anggaran transistor", value: "10¹⁰", note: "di die desktop modern" },
            { label: "Kedalaman pipeline", value: "15–20", note: "tahap, tipikal" },
            { label: "Latensi L1", value: "~4 siklus" },
            { label: "Latensi DRAM", value: "~200 siklus" },
          ],
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      pc: { label: "Program Counter", sub: "alamat berikutnya", desc: "Menyimpan alamat instruksi berikutnya yang akan di-fetch. Bertambah otomatis setelah setiap fetch." },
      ram: { label: "Memori Utama", sub: "RAM", desc: "Menyimpan instruksi program sekaligus datanya. Besar tetapi sekitar 200× lebih lambat daripada register." },
      cache: { label: "Cache L1 / L2", sub: "penyangga cepat", desc: "Salinan kecil dan sangat cepat dari memori yang baru dipakai. Menjawab dalam beberapa siklus, bukan beberapa ratus." },
      cu: { label: "Control Unit", sub: "sang konduktor", desc: "Mengurutkan setiap unit lain mengikuti ketukan clock dan mengaktifkan sinyal kontrol yang menjalankan tiap tahap." },
      decoder: { label: "Instruction Decoder", sub: "opcode → sinyal", desc: "Menerjemahkan pola bit mentah menjadi sinyal kontrol spesifik yang dipahami bagian lain chip." },
      alu: { label: "ALU", sub: "aritmetika & logika", desc: "Unit aritmetika dan logika: menjumlahkan, mengurangkan, membandingkan, dan menerapkan operasi bitwise pada nilai yang diberikan." },
      regs: { label: "Registers", sub: "penyimpanan tercepat", desc: "Beberapa slot penyimpanan yang berada di core itu sendiri. Operand dan hasil ALU berada di sini." },
      out: { label: "Retire & Repeat", sub: "state maju", desc: "Hasilnya dikomit ke architectural state, program counter maju, dan seluruh siklus dimulai lagi." },
    },
    edges: {
      "pc->cu": { label: "alamat" },
      "ram->cu": { label: "instruksi" },
      "cu->alu": { label: "kontrol" },
      "decoder->regs": { label: "operand" },
      "regs->alu": { label: "operand" },
      "alu->regs": { label: "hasil" },
      "regs->out": { label: "commit" },
    },
    steps: {
      fetch: { title: "1 · Fetch", short: "Fetch", description: "Unit kontrol mengirim alamat yang disimpan di program counter ke memori. Instruksi yang tersimpan di sana dikembalikan dan dikunci ke instruction register.", value: "PC → 0x0040" },
      decode: { title: "2 · Decode", short: "Decode", description: "Decoder memecah instruksi menjadi opcode dan operand-nya, lalu mengaktifkan jalur kontrol yang memberi tahu setiap unit lain peran apa yang harus dimainkan pada siklus ini.", value: "opcode = ADD" },
      execute: { title: "3 · Execute", short: "Execute", description: "Register file menyediakan operand dan ALU melakukan operasinya. Sinyal kontrol memilih fungsi dan mengarahkan hasilnya kembali ke sebuah register.", value: "R1 + R2 = 42" },
      writeback: { title: "4 · Write Back", short: "Write back", description: "Hasilnya ditulis ke architectural state, program counter maju, dan mesin siap untuk instruksi berikutnya — semuanya dalam sepersekian nanodetik.", value: "R1 ← 42" },
    },
  },
  model3d: {
    hotspots: {
      die: { label: "Die silikon", detail: "Persegi seukuran kuku yang menjadi tempat hidup setiap transistor, terukir pada skala beberapa nanometer." },
      ihs: { label: "Heat spreader terintegrasi", detail: "Tutup logam yang mengalirkan panas menjauh dari die menuju cooler-mu." },
      pins: { label: "Larik kontak", detail: "Ratusan pad yang menghubungkan package ke socket motherboard." },
      cache: { label: "Blok cache", detail: "Blok-blok SRAM yang ditata di samping core agar data panas tetap dekat." },
    },
  },
};

import type { TopicTranslation } from "../types";

export const cacheId: TopicTranslation = {
  title: "Bagaimana Cara Kerja Cache CPU?",
  question: "Kenapa CPU yang cepat masih sering menunggu memori?",
  summary:
    "CPU bisa mengeksekusi instruksi dalam waktu kurang dari satu nanodetik, tetapi mencapai memori utama butuh sekitar seratus kali lebih lama. Cache adalah salinan kecil yang cepat untuk menyembunyikan celah itu.",
  tags: ["SRAM", "latensi", "cache line", "lokalitas"],
  levels: {
    1: {
      lede: "CPU-mu jauh lebih cepat daripada memori yang dibacanya. Cache adalah rak mungil yang sangat cepat untuk hal-hal yang baru saja dipakai.",
      blocks: [
        {
          type: "p",
          text: "CPU modern bisa menyelesaikan satu instruksi dalam waktu kurang dari satu nanodetik. Mengambil data dari memori utama bisa makan waktu sekitar seratus kali lebih lama. Kalau CPU harus menunggu setiap kali, sebagian besar chip akan menganggur.",
        },
        {
          type: "p",
          text: "Karena itu CPU menyimpan sedikit data yang baru dipakai tetap dekat, di chip yang sama. Simpanan itulah cache. Saat data yang dibutuhkan sudah ada di sana, CPU terus berjalan dengan kecepatan penuh.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Kenapa rak, bukan seluruh perpustakaan",
          text: "Cache harus cepat, dan memori yang cepat itu mahal serta memakan area die. Membuatnya besar justru akan memperlambatnya — persis hal yang ingin dihindari. Ukuran dan kecepatan saling tarik-menarik.",
        },
      ],
    },
    2: {
      lede: "Cache hadir dalam beberapa tingkat. Setiap tingkat lebih besar dan sedikit lebih lambat dari sebelumnya, menukar kapasitas dengan latensi.",
      blocks: [
        {
          type: "p",
          text: "L1 adalah yang terkecil dan tercepat, berada di tiap core. L2 lebih besar dan sedikit lebih lambat. L3 dibagi ke semua core dan diukur dalam megabyte, tetapi tetap jauh lebih cepat daripada memori utama.",
        },
        {
          type: "steps",
          items: [
            { title: "Cek di L1", text: "Hit di sini hanya butuh beberapa siklus. Sebagian besar akses yang berulang berakhir di sini." },
            { title: "Cek di L2", text: "Sedikit lebih lambat dan jauh lebih besar. Banyak working set muat seluruhnya." },
            { title: "Cek di L3", text: "Dibagi bersama dan lebih lambat lagi, tetapi masih lebih murah daripada keluar dari chip." },
            { title: "Pergi ke RAM", text: "Kasus yang mahal. Sekitar seratus siklus, dan hasilnya disalin kembali ke tingkat-tingkat di atasnya." },
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Data berpindah per baris",
          text: "Cache tidak pernah mengambil satu byte saja. Cache mengambil satu cache line utuh, biasanya 64 byte, karena program jarang memakai satu nilai secara terpisah.",
        },
      ],
    },
    3: {
      lede: "Caching bekerja karena program bisa diprediksi: mereka memakai ulang yang baru saja disentuh, dan bergerak maju, bukan acak.",
      blocks: [
        {
          type: "p",
          text: "Lokalitas temporal adalah memakai ulang data yang sama tak lama setelahnya. Lokalitas spasial adalah memakai data yang berada di sebelah data yang sudah kamu pakai. Perulangan pada sebuah array menunjukkan keduanya: penghitung yang sama berulang-ulang, lalu elemen berikutnya.",
        },
        {
          type: "compare",
          left: {
            title: "Cache hit",
            items: ["Ditemukan dekat core", "Beberapa siklus", "CPU terus mengalir"],
          },
          right: {
            title: "Cache miss",
            items: ["Diambil dari memori utama", "Sekitar 100 siklus", "Core bisa terhenti"],
          },
        },
        {
          type: "p",
          text: "Inilah sebabnya dua program dengan jumlah operasi yang sama bisa terasa sangat berbeda. Yang satu menelusuri memori secara berurutan; yang lain melompat ke sana kemari dan gagal di cache pada hampir setiap akses.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Tata letak yang salah adalah tata letak yang lambat",
          text: "Linked list mengunjungi alamat yang tersebar, jadi setiap langkah kemungkinan besar miss. Menyimpan data yang sama dalam array yang bersebelahan mengubah sebagian besar langkah itu menjadi hit tanpa mengubah algoritmanya sama sekali.",
        },
      ],
    },
    4: {
      lede: "Cache bukan penyimpanan pasif. Ia memutuskan apa yang dibuang, apa yang diambil lebih dulu, dan bagaimana tetap koheren di semua core sekaligus.",
      blocks: [
        {
          type: "p",
          text: "Cache line berada dalam set. Sebuah alamat dipetakan ke satu set, dan di dalamnya cache memilih cara mana yang disimpan. Saat semua cara penuh, ia membuang satu baris, biasanya yang paling lama tidak dipakai, meskipun kebijakan nyata mendekati itu agar tetap murah.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Koherensi adalah bagian yang sulit",
          text: "Setiap core punya cache privatnya sendiri tetapi semuanya berbagi satu memori. Jika dua core memegang baris yang sama dan salah satunya menulis, yang lain harus dibatalkan atau diperbarui. Protokol seperti MESI melacak keadaan tiap baris agar core tidak diam-diam berselisih.",
        },
        {
          type: "stats",
          items: [
            { label: "Latensi L1", value: "~4 siklus" },
            { label: "Latensi L2", value: "~12 siklus" },
            { label: "Latensi L3", value: "~40 siklus" },
            { label: "Cache line", value: "64 byte" },
            { label: "Latensi DRAM", value: "~200 siklus" },
          ],
        },
        {
          type: "p",
          text: "Prefetcher mengamati pola akses dan memuat lebih dulu secara spekulatif, sehingga saat perulangan mencapai baris berikutnya data itu sudah ada. False sharing menunjukkan biaya jika ini salah: dua core yang menulis variabel tak berkaitan yang kebetulan berbagi satu baris akan terus saling membatalkan, dan performanya jatuh padahal kodenya secara logis independen.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      addr: { label: "Permintaan Alamat", sub: "core meminta nilai", desc: "Unit load-store mengeluarkan alamat yang diinginkan core. Semua yang terjadi setelahnya adalah upaya perangkat keras memenuhinya sehemat mungkin." },
      l1: { label: "Cache L1", sub: "~4 siklus · 64 KB", desc: "Tingkat terkecil dan tercepat, privat untuk satu core. Sebagian besar akses berulang dijawab di sini." },
      l2: { label: "Cache L2", sub: "~12 siklus · 512 KB", desc: "Lebih besar dan sedikit lebih lambat, tetap privat per core. Menangkap sebagian besar akses yang gagal di L1." },
      l3: { label: "Cache L3", sub: "~40 siklus · dibagi", desc: "Dibagi oleh setiap core di chip, diukur dalam megabyte. Perhentian terakhir sebelum meninggalkan die." },
      mem: { label: "Memori Utama", sub: "~200 siklus · RAM", desc: "Besar tetapi lambat. Saat pembacaan mencapai sini, core biasanya terhenti kecuali ada thread lain yang bisa berjalan." },
      line: { label: "Cache Line", sub: "64 byte, bukan 1", desc: "Setiap miss menyalin satu baris utuh ke atas hierarki, bertaruh bahwa nilai-nilai di sekitarnya akan dipakai berikutnya." },
      prefetch: { label: "Prefetcher", sub: "memuat lebih dulu", desc: "Mengenali pola berurutan dan memuat baris-baris berikutnya sebelum kode memintanya, menyembunyikan latensi alih-alih menghindarinya." },
      core: { label: "Core Mengeksekusi", sub: "hit atau terhenti", desc: "Saat hit, instruksi berlanjut dengan kecepatan penuh. Saat miss, pipeline mungkin menunggu — karena itu perilaku cache sering lebih penting daripada kecepatan clock." },
    },
    edges: {
      "addr->l1": { label: "cari" },
      "l1->core": { label: "hit" },
      "l1->l2": { label: "miss" },
      "l2->l3": { label: "miss" },
      "l3->mem": { label: "miss" },
      "mem->l3": { label: "baris" },
      "line->addr": { label: "isi" },
      "prefetch->l2": { label: "lebih dulu" },
      "core->prefetch": { label: "pola" },
    },
    steps: {
      request: { title: "1 · Permintaan", short: "Minta", description: "Core mengeluarkan alamat. Sebelum apa pun mencapai memori, perangkat keras memeriksa apakah nilai itu sudah tersimpan dekat.", value: "muat 0x7ffd40" },
      hitmiss: { title: "2 · Hit atau Miss", short: "Hit/Miss", description: "L1 menjawab dalam beberapa siklus saat hit. Saat miss, permintaan jatuh ke tingkat berikutnya, dan core bisa melanjutkan pekerjaan lain sambil menunggu.", value: "L1 miss → L2" },
      fall: { title: "3 · Menembus ke Bawah", short: "Miss", description: "Permintaan menelusuri L2 dan L3. Setiap tingkat lebih besar dan lebih lambat. Hanya jika semuanya miss, ia meninggalkan chip menuju memori utama.", value: "L3 miss → RAM" },
      fill: { title: "4 · Isi & Prefetch", short: "Isi", description: "Memori mengembalikan satu cache line utuh, yang disalin ke setiap tingkat saat naik kembali. Prefetcher juga bisa menarik baris berikutnya, jadi permintaan berikutnya sudah hit.", value: "64 B terisi, hit berikutnya" },
    },
  },
  model3d: {
    hotspots: {
      die: { label: "Core prosesor", detail: "Core berada di puncak tumpukan, paling dekat dengan penyimpanan tercepat." },
      l1: { label: "Blok cache L1", detail: "Beberapa puluh kilobyte SRAM yang terhubung langsung ke core. Menjawab dalam beberapa siklus." },
      l2: { label: "Blok cache L2", detail: "Lebih besar dan sedikit lebih lambat, privat untuk tiap core, menampung working set yang tidak muat di L1." },
      l3: { label: "Cache L3 (dibagi)", detail: "Bank yang jauh lebih besar, dibagi oleh setiap core — perhentian terakhir sebelum memori utama." },
    },
  },
};

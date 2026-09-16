import type { TopicTranslation } from "../types";

export const ssdId: TopicTranslation = {
  title: "Kenapa SSD Terasa Seketika",
  question: "Apa sebenarnya yang terjadi saat solid-state drive menulis sebuah file?",
  summary:
    "SSD tidak punya bagian yang berputar. Ia menyimpan muatan di sel flash, dan sebuah controller mengatur erase block, wear levelling, dan garbage collection agar semuanya tetap cepat.",
  tags: ["NAND flash", "FTL", "wear levelling", "NVMe"],
  levels: {
    1: {
      lede: "Hard drive punya piringan yang berputar dan lengan yang bergerak. SSD tidak punya keduanya — ia murni elektronik, jadi tidak ada yang perlu ditunggu.",
      blocks: [
        {
          type: "p",
          text: "Tanpa head yang harus digerakkan dan tanpa piringan yang harus diputar, SSD menjawab dalam mikrodetik, bukan milidetik. Itulah alasan terbesar mengapa laptop baru terasa jauh lebih cepat.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Senyap dan tahan guncangan",
          text: "Tanpa bagian bergerak, tidak ada suara dan tidak ada kerusakan akibat tersenggol saat bekerja.",
        },
      ],
    },
    2: {
      lede: "Data hidup sebagai muatan terperangkap di sel flash yang dikelompokkan menjadi page, dan page dikelompokkan menjadi block.",
      blocks: [
        {
          type: "p",
          text: "Flash dibaca dan ditulis satu page sekaligus — biasanya beberapa kilobyte — tetapi hanya bisa dihapus satu block utuh sekaligus, dan satu block menampung ratusan page.",
        },
        {
          type: "compare",
          left: { title: "Kamu bisa", items: ["Membaca satu page", "Menulis satu page", "Menimpa hanya jika masih kosong"] },
          right: { title: "Kamu tidak bisa", items: ["Menimpa page yang sudah terpakai", "Menghapus satu page saja", "Mengabaikan batas aus"] },
        },
        {
          type: "callout",
          tone: "tip",
          title: "Aturan yang merepotkan",
          text: "Untuk mengubah satu byte, drive menyalin seluruh page hidup di block itu ke tempat lain, menghapus block-nya, lalu menuliskan semuanya kembali. Controller ada untuk menyembunyikan itu.",
        },
      ],
    },
    3: {
      lede: "Flash translation layer memetakan alamat yang dipakai sistem operasimu ke lokasi flash fisik, memindahkan data untuk menyebarkan keausan.",
      blocks: [
        {
          type: "p",
          text: "FTL menyimpan tabel lookup, jadi menulis ulang sebuah alamat biasanya berarti menulis ke page baru dan menandai page lama sebagai stale. Page-page stale menumpuk sampai garbage collection mengambil kembali block-nya.",
        },
        {
          type: "stats",
          items: [
            { label: "Latensi baca", value: "~50 µs" },
            { label: "Latensi tulis", value: "~200 µs" },
            { label: "IOPS acak", value: "500K+", note: "NVMe Gen4" },
            { label: "Ketahanan", value: "600–2400", note: "TBW, tipikal" },
          ],
        },
      ],
    },
    4: {
      lede: "Performa berkelanjutan bergantung pada over-provisioning, TRIM, dan menjaga ketersediaan kumpulan block yang sudah dihapus.",
      blocks: [
        {
          type: "p",
          text: "Write amplification mengukur berapa banyak byte fisik yang ditulis untuk setiap byte logis yang diminta. Beban kerja berat tulis tanpa block kosong cadangan bisa mendorong amplification di atas 3×, yang muncul sebagai penurunan tajam kecepatan berkelanjutan setelah cache SLC habis.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Jurang cache SLC",
          text: "Drive konsumen menulis data masuk lebih dulu ke cache cepat dan menyiramnya ke penyimpanan lebih lambat nanti. Salin file yang lebih besar daripada cache-nya dan kamu akan menyaksikan kecepatannya jatuh seperti terjun bebas secara real time.",
        },
        {
          type: "p",
          text: "TRIM memberi tahu drive block mana yang sudah tidak dibutuhkan filesystem, sehingga drive bisa menghapusnya lebih dulu alih-alih saat sedang menulis. Itulah sebabnya SSD yang terlihat hampir kosong berperforma lebih baik daripada yang terisi 95%.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      host: { label: "Sistem Operasi", sub: "tulis logis", desc: "Mengeluarkan operasi tulis ke sebuah logical block address. Ia tidak tahu di mana alamat itu berada secara fisik." },
      nvme: { label: "Antrean NVMe", sub: "kedalaman 64K", desc: "Transport yang membawa perintah ke drive. Antrean yang dalam memungkinkan drive menyusun ulang pekerjaan demi efisiensi." },
      ftl: { label: "Flash Translation Layer", sub: "LBA → fisik", desc: "Gabungan tabel pemetaan, wear leveller, dan garbage collector. Inilah kecerdasan dari drive tersebut." },
      pages: { label: "NAND Pages", sub: "target tulis", desc: "Unit yang bisa ditulis. Data baru selalu mendarat di page yang masih segar." },
      blocks: { label: "Erase Blocks", sub: "~256 page masing-masing", desc: "Unit yang bisa dihapus. Mengambil kembali page stale berarti menyalin data hidup keluar dan menghapus seluruh block." },
      gc: { label: "Free Block Pool", sub: "yang menjaganya cepat", desc: "Cadangan block yang sudah dihapus sebelumnya. Selama tidak kosong, penulisan bisa langsung mendarat dengan kecepatan penuh." },
    },
    edges: {
      "host->nvme": { label: "tulis LBA" },
      "nvme->ftl": { label: "perintah" },
      "ftl->pages": { label: "program" },
      "blocks->gc": { label: "reclaim" },
    },
    steps: {
      write: { title: "1 · Tulis Logis", short: "Tulis", description: "Filesystem menyerahkan sebuah logical block address dan sejumlah data ke drive. Tidak ada informasi apa pun tentang lokasi fisiknya.", value: "WRITE LBA 0x9F30" },
      map: { title: "2 · Terjemahkan", short: "Terjemahkan", description: "FTL mencari tahu di mana alamat itu sekarang berada dan memutuskan page segar mana yang sebaiknya ditempati data baru.", value: "LBA → block 812, page 44" },
      program: { title: "3 · Program", short: "Program", description: "Data baru ditulis ke page kosong. Page lama ditandai stale — ia tidak akan pernah dibaca lagi.", value: "page 44 ← data" },
      gc: { title: "4 · Garbage Collect", short: "Reclaim", description: "Saat page stale menumpuk, page hidup disalin keluar, block-nya dihapus, dan block itu kembali ke free pool agar penulisan berikutnya tetap instan.", value: "block 812 reclaimed" },
    },
  },
  model3d: {
    hotspots: {
      nand: { label: "Package NAND", detail: "Chip hitam yang benar-benar menyimpan muatan. Kapasitas berada di sini." },
      ctrl: { label: "Controller", detail: "Prosesor kecil yang menjalankan flash translation layer. Ia memutuskan segala hal yang dilakukan drive." },
      dram: { label: "Cache DRAM", detail: "Menampung tabel pemetaan agar penerjemahan alamat tetap cepat. Sebagian drive meminjam memori sistem sebagai gantinya." },
      conn: { label: "Konektor M.2", detail: "Membawa empat lane PCIe dan daya langsung ke motherboard." },
    },
  },
};

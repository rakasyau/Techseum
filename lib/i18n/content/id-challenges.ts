import type { ChallengeTranslation } from "./types";

/* Indonesian overlays for challenge questions, options and explanations. */
export const idChallenges: Record<string, ChallengeTranslation | undefined> = {
  "cpu-order": {
    question:
      "Susun tahapan siklus instruksi sesuai urutan yang dijalankan CPU.",
    hint: "Dimulai dengan mengambil instruksi, bukan dengan menghitung.",
    explanation:
      "Siklus selalu dimulai dengan mengambil instruksi berikutnya. Setelah instruksi diterjemahkan (decode), unit kontrol baru dapat menggerakkan ALU, dan hasil baru bisa ditulis kembali setelah eksekusi.",
    options: {
      fetch: {
        label: "Ambil (Fetch)",
        detail: "Membawa instruksi masuk dari memori.",
      },
      decode: {
        label: "Dekode (Decode)",
        detail: "Menerjemahkan arti instruksi.",
      },
      execute: {
        label: "Eksekusi (Execute)",
        detail: "Menjalankan operasi di dalam ALU.",
      },
      writeback: {
        label: "Tulis Balik (Write Back)",
        detail: "Menyimpan hasil dan melanjutkan.",
      },
    },
  },
  "wifi-contend": {
    question:
      "Dua perangkat pada kanal Wi-Fi yang sama mengirim tepat pada saat yang sama. Apa yang terjadi selanjutnya?",
    explanation:
      "Wi-Fi menggunakan carrier sense dengan collision avoidance. Saat tabrakan terdeteksi, setiap pengirim menunggu interval acak sebelum mencoba lagi, sehingga kemungkinan keduanya bertabrakan untuk kedua kalinya menjadi kecil.",
    options: {
      a: { label: "Kedua paket terkirim normal" },
      b: {
        label: "Keduanya berhenti dan mencoba lagi setelah backoff acak",
        detail: "Deteksi tabrakan memicu jeda acak.",
      },
      c: {
        label: "Perangkat yang lebih baru menang dan yang lama terputus",
      },
      d: { label: "Access point membelah kanal menjadi dua" },
    },
  },
  "camera-exposure": {
    question:
      "Anda ingin membekukan subjek yang bergerak cepat dalam cahaya redup. Perubahan mana yang paling membantu tanpa membuat gambar lebih gelap?",
    explanation:
      "Kecepatan rana yang tinggi mengurangi cahaya yang mencapai sensor, jadi harus ada yang mengimbanginya. Melebarkan aperture memasukkan lebih banyak cahaya, dan menaikkan ISO memperkuat apa yang tertangkap — dengan konsekuensi noise yang lebih terlihat.",
    options: {
      a: { label: "Mempersempit aperture" },
      b: { label: "Memperlambat kecepatan rana (shutter speed)" },
      c: {
        label: "Melebarkan aperture dan menaikkan ISO",
        detail: "Lebih banyak cahaya lewat lensa, lebih banyak gain pada sinyal.",
      },
      d: { label: "Menurunkan ISO" },
    },
  },
  "ram-refresh": {
    question: "Mengapa DRAM perlu di-refresh ribuan kali per detik?",
    explanation:
      "Setiap sel DRAM menyimpan bit sebagai muatan pada kapasitor. Muatan itu bocor, sehingga setiap baris harus dibaca dan ditulis ulang secara berkala atau datanya hilang.",
    options: {
      a: { label: "Agar clock tetap tersinkronisasi dengan CPU" },
      b: {
        label: "Karena setiap bit berupa muatan di kapasitor yang bocor",
        detail: "Kapasitor tidak dapat menahan muatannya tanpa batas.",
      },
      c: { label: "Karena jalur alamat perlu di-reset" },
      d: { label: "Untuk mengurangi konsumsi daya" },
    },
  },
  "battery-ioins": {
    question:
      "Urutkan apa yang terjadi ketika baterai lithium-ion melepas muatan (discharge).",
    explanation:
      "Lithium meninggalkan anoda terlebih dahulu, lalu melintasi elektrolit. Karena elektron tidak dapat mengikuti melalui elektrolit, elektron melewati rangkaian eksternal — memberi daya pada perangkat Anda — dan bergabung kembali di katoda.",
    options: {
      release: { label: "Ion meninggalkan anoda" },
      migrate: { label: "Ion melintasi elektrolit" },
      flow: { label: "Elektron mengalir melalui perangkat" },
      arrive: { label: "Ion dan elektron bergabung kembali di katoda" },
    },
  },
  "ssd-write": {
    question:
      "Anda menimpa (overwrite) satu byte dalam sebuah file di SSD. Apa yang sebenarnya dilakukan drive tersebut?",
    explanation:
      "Flash hanya dapat menulis ke page yang masih kosong. Mengubah data berarti menulisnya ke lokasi baru dan membuat lokasi lama tidak valid, yang ditangani secara transparan oleh flash translation layer.",
    options: {
      a: { label: "Menulis ulang byte tunggal itu di tempat yang sama" },
      b: {
        label: "Menulis ke page baru dan menandai page lama sebagai stale",
        detail: "Flash tidak dapat menimpa page yang sudah terpakai secara langsung.",
      },
      c: { label: "Menghapus seluruh drive dan menulisnya ulang" },
      d: { label: "Memindahkan file ke RAM secara permanen" },
    },
  },
  "neural-backprop": {
    question: "Urutkan satu langkah training yang lengkap.",
    explanation:
      "Training selalu bergerak maju terlebih dahulu untuk membuat prediksi, lalu mundur untuk menetapkan kesalahan. Pembaruan terjadi terakhir, menggunakan gradien yang dihasilkan backpropagation.",
    options: {
      forward: { label: "Forward pass menghasilkan prediksi" },
      loss: { label: "Loss mengukur seberapa salah prediksinya" },
      grad: { label: "Gradien dihitung secara mundur" },
      update: { label: "Bobot disesuaikan sedikit untuk mengurangi loss" },
    },
  },
  "gpu-parallel": {
    question:
      "Mengapa GPU jauh lebih cepat daripada CPU dalam melakukan shading jutaan piksel?",
    explanation:
      "Pixel shading adalah ribuan tugas yang hampir identik dan independen. GPU menang dengan menjalankannya secara bersamaan di banyak core sederhana, bukan dengan menjalankan satu hal lebih cepat.",
    options: {
      a: { label: "Core-nya berjalan pada kecepatan clock yang jauh lebih tinggi" },
      b: {
        label: "GPU memiliki ribuan core sederhana yang mengerjakan tugas sama sekaligus",
        detail: "Throughput melalui paralelisme, bukan kecepatan per-core.",
      },
      c: { label: "GPU memiliki cache yang jauh lebih besar" },
      d: { label: "GPU menghindari penggunaan memori sama sekali" },
    },
  },
  "cloud-replicate": {
    question:
      "Urutkan apa yang terjadi saat Anda mengunggah file ke cloud storage.",
    explanation:
      "Unggahan dirutekan ke server yang tersedia, direplikasi untuk redundansi, dan baru diakui setelah data tersimpan dengan aman di lebih dari satu lokasi independen.",
    options: {
      upload: { label: "Perangkat Anda mengirimkan data" },
      route: { label: "Load balancer memilih server yang sehat" },
      replicate: { label: "Salinan ditulis ke beberapa failure domain" },
      confirm: {
        label: "Keberhasilan dilaporkan hanya setelah penulisan durable",
      },
    },
  },
  "daily-touchscreen": {
    question:
      "Tantangan Harian: Mengapa layar sentuh sering gagal merespons saat memakai sarung tangan musim dingin?",
    explanation:
      "Layar kapasitif mendeteksi perubahan yang ditimbulkan jari konduktif Anda pada grid medan listrik. Sarung tangan yang bersifat isolator hampir tidak menimbulkan perubahan, sehingga layar tidak melihat apa pun.",
    options: {
      a: { label: "Sarung tangan menghalangi cahaya dari layar" },
      b: {
        label: "Kain adalah insulator, sehingga hampir tidak mengubah medan listrik",
        detail: "Pendeteksian kapasitif membutuhkan jalur konduktif.",
      },
      c: { label: "Sarung tangan terlalu tebal untuk sensor tekanan" },
      d: { label: "Suhu dingin menonaktifkan controller" },
    },
  },
  "daily-bluetooth": {
    question:
      "Tantangan Harian: Mengapa Bluetooth berpindah antar frekuensi ratusan kali per detik?",
    explanation:
      "Dengan terus mengubah frekuensi, Bluetooth menghindari interferensi. Jika satu kanal terblokir, hop berikutnya kemungkinan besar bebas, sehingga koneksi menurun secara bertahap alih-alih langsung gagal.",
    options: {
      a: { label: "Untuk mengirim lebih banyak data per detik" },
      b: {
        label: "Untuk menghindari interferensi pada kanal mana pun",
        detail: "Menghindari noise, bukan melawannya.",
      },
      c: { label: "Untuk menghemat baterai dengan memakai daya lebih sedikit" },
      d: { label: "Untuk mendukung lebih banyak perangkat dalam satu piconet" },
    },
  },
  "daily-chipset": {
    question:
      "Kelompokkan setiap tugas ke komponen yang paling cocok untuk menanganinya.",
    hint: "Jalur dengan daya paling rendah harus menang kapan pun memungkinkan.",
    explanation:
      "Efisiensi daya menentukan penempatannya. Penghitungan langkah berjalan terus-menerus di hub kecil; sensor fusion dan encoding video butuh komputasi sungguhan; pesan tiba di radio dan baru membangunkan sistem di akhir.",
    options: {
      steps: {
        label: "Menghitung langkah Anda sepanjang hari",
        detail: "Pembacaan sederhana yang berkelanjutan.",
      },
      orient: {
        label: "Menstabilkan frame video",
        detail: "Sensor fusion berkecepatan tinggi.",
      },
      encode: {
        label: "Encoding video 4K",
        detail: "Komputasi berat yang berkelanjutan.",
      },
      notify: {
        label: "Menerima pesan",
        detail: "Tiba melalui jaringan.",
      },
    },
  },
  "cache-latency-order": {
    question:
      "Sebuah read mengalami miss di L1. Urutkan tempat yang diperiksa permintaan berikutnya.",
    hint: "Ia bergerak keluar dari core, dan setiap level lebih besar serta lebih lambat.",
    explanation:
      "Sebuah miss menjalar keluar dari core melalui L2 dan L3, dan baru kemudian ke memori utama. Saat memori menjawab, ia mengembalikan satu cache line penuh, yang disalin ke setiap level dalam perjalanan kembali agar akses berikutnya ke area itu menjadi hit.",
    options: {
      l2: {
        label: "L2 cache",
        detail: "Khusus untuk core, lebih besar dan lebih lambat dari L1.",
      },
      l3: {
        label: "L3 cache",
        detail: "Dibagi oleh setiap core, perhentian terakhir di dalam chip.",
      },
      ram: {
        label: "Memori utama",
        detail: "Di luar chip, sekitar seratus siklus jauhnya.",
      },
      fill: {
        label: "Isi ulang line",
        detail: "Salin line 64-byte ke setiap level dalam perjalanan pulang.",
      },
    },
  },
};

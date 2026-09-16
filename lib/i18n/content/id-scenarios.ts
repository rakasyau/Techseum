import type { ScenarioTranslation } from "./types";

/* Indonesian overlays for scenario titles, summaries and steps. */
export const idScenarios: Record<string, ScenarioTranslation | undefined> = {
  "open-a-website": {
    title: "Kamu mengetik alamat web dan menekan Enter",
    summary:
      "Ikuti satu permintaan dari keyboard-mu ke server di benua lain dan kembali lagi, dalam waktu sekejap mata.",
    steps: {
      "1": {
        label: "URL diuraikan",
        description: "Browser memecah alamat menjadi skema, host, dan path.",
        detail:
          "Mengetik alamat belum memicu apa pun di jaringan. Browser lebih dulu memeriksa apakah host berupa kata pencarian atau alamat sungguhan, lalu memecahnya menjadi bagian-bagian yang dibutuhkan: cara terhubung, mesin mana yang dituju, dan resource apa yang diminta.",
      },
      "2": {
        label: "Pencarian DNS dimulai",
        description: "Nama host diterjemahkan menjadi alamat IP.",
        detail:
          "Komputer melakukan routing berdasarkan angka, bukan nama. Sebuah resolver diminta mencari alamat IP di balik nama host. Jika jawabannya tersimpan di cache dari permintaan sebelumnya, ini nyaris instan; jika tidak, resolver menyusuri hierarki name server untuk menemukannya.",
      },
      "3": {
        label: "Koneksi dibuka",
        description:
          "Handshake TCP dan handshake TLS membangun kanal yang tepercaya.",
        detail:
          "Browser dan server bertukar pesan untuk memastikan keduanya siap bicara, lalu menegosiasikan enkripsi. Sertifikat diverifikasi agar browser tahu ia sedang bicara dengan server yang asli, bukan penyusup. Round trip ini sering kali menjadi biaya tunggal terbesar saat memuat halaman.",
      },
      "4": {
        label: "Permintaan dalam perjalanan",
        description:
          "Paket-paketmu melewati router, ISP, dan internet yang lebih luas.",
        detail:
          "Setiap paket membawa tujuan dan melompat dari jaringan ke jaringan. Router hanya perlu tahu langkah berikutnya yang masuk akal, bukan seluruh jalurnya. Jarak fisik berpengaruh: cahaya di serat optik butuh waktu nyata untuk menyeberangi samudra.",
      },
      "5": {
        label: "Server merespons",
        description: "Server memproses permintaan dan mengirim respons.",
        detail:
          "Load balancer memilih server yang sehat. Server itu mungkin mengakses database, memanggil layanan lain, atau merakit halaman dari fragmen yang di-cache. Pekerjaannya sendiri bisa memakan mikrodetik; antrean dan koordinasi biasanya lebih mendominasi.",
      },
      "6": {
        label: "Browser merender",
        description:
          "HTML diuraikan, style diterapkan, layout dihitung, dan piksel digambar.",
        detail:
          "Browser membangun pohon dokumen, menghitung berapa ruang yang dibutuhkan setiap elemen, lalu menggambarnya. JavaScript bisa mengubah semua ini setelah paint pertama, itulah sebabnya halaman sering bergeser saat dimuat.",
      },
    },
  },
  "take-a-photo": {
    title: "Kamu menekan tombol shutter",
    summary:
      "Dari satu ketukan di kaca sampai menjadi JPEG jadi dalam waktu kurang dari satu detik, serangkaian keputusan perangkat keras dan perangkat lunak diambil.",
    steps: {
      "1": {
        label: "Ketukan terdeteksi",
        description:
          "Touch controller melaporkan di mana jarimu menyentuh layar.",
        detail:
          "Panel kapasitif mendeteksi gangguan pada grid medannya dan melaporkan koordinat ke sistem. Aplikasi kamera mengenali ketukan pada kontrol shutter.",
      },
      "2": {
        label: "Exposure dipilih",
        description:
          "Aperture, waktu shutter, dan ISO dipilih untuk pemandangan tersebut.",
        detail:
          "Image signal processor menganalisis live preview: seberapa terang, ada sesuatu yang bergerak atau tidak, ada wajah atau tidak. Lalu ia memilih kombinasi exposure yang menyeimbangkan kecerahan dengan blur dan noise.",
      },
      "3": {
        label: "Autofokus terkunci",
        description:
          "Lensa bergerak sampai kontras maksimal pada titik fokus.",
        detail:
          "Piksel phase-detection di sensor memperkirakan seberapa jauh subjek dari fokus, dan lensa digerakkan untuk menutup selisih itu. Cahaya redup membuat ini lebih lambat karena kontras yang bisa diukur lebih sedikit.",
      },
      "4": {
        label: "Sensor terekspos",
        description: "Foton dikumpulkan sebagai muatan listrik.",
        detail:
          "Shutter membuka sensor selama waktu yang dipilih. Setiap fotodioda mengakumulasi muatan sebanding dengan cahaya yang diterimanya. Gerakan selama jendela ini menjadi blur yang terlihat.",
      },
      "5": {
        label: "Frame dibaca dan diproses",
        description: "Data mentah menjadi gambar yang bisa dilihat.",
        detail:
          "Sensor dibaca baris demi baris dan didigitalkan. Image processor melakukan demosaic pola warna, menerapkan white balance, mengurangi noise, menajamkan, dan mengompres hasilnya — semuanya dengan perangkat keras khusus sehingga hemat baterai.",
      },
      "6": {
        label: "Foto disimpan",
        description: "File jadi ditulis ke flash dan diindeks.",
        detail:
          "File JPEG atau HEIC ditulis ke penyimpanan, ditambahkan ke galeri foto, dan dimasukkan ke antrean backup cloud jika ada. Pada titik ini operasinya selesai dan kamera siap untuk jepretan berikutnya.",
      },
    },
  },
  "press-power-button": {
    title: "Kamu menekan tombol power",
    summary:
      "Tekanan singkat yang tampak sepele menyembunyikan tarian hati-hati antara chip manajemen daya, prosesor, dan setiap subsistem yang terhubung padanya.",
    steps: {
      "1": {
        label: "Tombol di-debounce",
        description: "Chip manajemen daya memastikan ini tekanan sungguhan.",
        detail:
          "Sakelar mekanis menghasilkan beberapa transisi listrik cepat untuk satu tekanan. Power management integrated circuit menyaringnya menjadi satu event bersih agar sistem tidak bangun berulang kali.",
      },
      "2": {
        label: "Prosesor utama bangun",
        description: "SoC keluar dari kondisi tidur terdalamnya.",
        detail:
          "Ponsel menghabiskan sebagian besar waktunya dalam kondisi di mana sebagian besar chip tidak dialiri daya. Bangun berarti memulihkan clock domain, mengaktifkan kembali power rail, dan menyalakan memori dalam urutan yang tepat.",
      },
      "3": {
        label: "Layar menyala",
        description: "Power rail panel stabil dan frame pertama dikirim.",
        detail:
          "Panel OLED membutuhkan power rail yang stabil sebelum bisa menampilkan apa pun. Sementara itu display controller sudah menerima framebuffer, jadi begitu panel siap sudah ada konten untuk ditampilkan.",
      },
      "4": {
        label: "Status dipulihkan",
        description: "Layar kunci dirender dari status yang tersimpan.",
        detail:
          "Sistem tidak boot dari awal. Ia melanjutkan status suspend dari sistem yang berjalan, itulah sebabnya membuka kunci ponsel modern terasa instan dibandingkan perangkat lama yang benar-benar dimatikan.",
      },
      "5": {
        label: "Radio sinkron ulang",
        description: "Cellular dan Wi-Fi tersambung kembali secara paralel.",
        detail:
          "Radio-nya juga ikut tidur. Mereka mendaftar ulang ke jaringan dan terhubung kembali ke access point yang dikenal. Itulah sebabnya notifikasi bisa datang sesaat setelah layar menyala, bukan sebelumnya.",
      },
    },
  },
};

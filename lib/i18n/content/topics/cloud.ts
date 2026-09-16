import type { TopicTranslation } from "../types";

export const cloudId: TopicTranslation = {
  title: "Sebenarnya Apa Itu Cloud?",
  question: "Di mana datamu saat kamu mengunggahnya ke cloud?",
  summary:
    "Tidak ada yang namanya cloud — yang ada adalah gedung-gedung penuh komputer. Yang kita sebut cloud adalah software yang menyebarkan pekerjaanmu ke banyak mesin dan membuatnya tampak seperti satu.",
  tags: ["data center", "virtualisasi", "replikasi", "ketersediaan"],
  levels: {
    1: {
      lede: "Cloud hanyalah komputer milik orang lain — jumlahnya sangat banyak, di gudang-gudang, terhubung ke internet.",
      blocks: [
        {
          type: "p",
          text: "Fotomu tidak melayang di udara. Foto itu ditulis ke disk di sebuah data center di suatu tempat, pada perangkat keras yang dipelihara, diberi daya, dan didinginkan orang lain. Cloud adalah model bisnis dan lapisan software di atas mesin-mesin fisik.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Keunggulannya adalah skala",
          text: "Menyewa kapasitas lebih murah daripada membelinya bagi sebagian besar perusahaan karena utilisasi pada skala data center jauh lebih tinggi daripada yang bisa dicapai satu kantor.",
        },
      ],
    },
    2: {
      lede: "Virtualisasi memungkinkan banyak mesin terisolasi berjalan pada satu server fisik, dan memungkinkan pekerjaan berpindah dari satu server ke server lain.",
      blocks: [
        {
          type: "p",
          text: "Sebuah hypervisor membagi satu mesin fisik menjadi beberapa mesin virtual, masing-masing merasa memiliki perangkat kerasnya sendiri. Karena virtual machine hanyalah data, ia bisa dijeda, disalin, dan dinyalakan ulang di tempat lain.",
        },
        {
          type: "steps",
          items: [
            { title: "Permintaan", text: "Aplikasimu meminta menyimpan sebuah file." },
            { title: "Penempatan", text: "Sistem memilih server yang masih punya kapasitas." },
            { title: "Replikasi", text: "Salinan ditulis ke beberapa mesin." },
            { title: "Konfirmasi", text: "Baru setelah cukup banyak salinan berhasil, sistem menyatakan selesai." },
          ],
        },
      ],
    },
    3: {
      lede: "Ketersediaan direkayasa lewat replikasi lintas failure domain — rak, ruangan, dan seluruh gedung.",
      blocks: [
        {
          type: "p",
          text: "Perangkat keras terus-menerus gagal pada skala besar. Strateginya bukan mencegah kegagalan melainkan mengasumsikannya: simpan beberapa salinan di lokasi independen, deteksi kehilangan, dan bangun ulang secara otomatis dari salinan yang masih hidup.",
        },
        {
          type: "stats",
          items: [
            { label: "Durabilitas umum", value: "99.999999999%", note: "sebelas sembilan" },
            { label: "Faktor replikasi", value: "3", note: "salinan, umumnya" },
            { label: "Target ketersediaan", value: "99.9–99.99%" },
            { label: "Daya data center", value: "10–100 MW" },
          ],
        },
      ],
    },
    4: {
      lede: "Penyimpanan terdistribusi menghadapi ketegangan mendasar: consistency, availability, dan partition tolerance tidak bisa semuanya sempurna sekaligus.",
      blocks: [
        {
          type: "p",
          text: "Saat partisi jaringan memisahkan dua kelompok server, masing-masing harus memilih antara menolak permintaan atau berisiko mengembalikan data basi. Sistem yang berbeda membuat pilihan yang berbeda, dan pilihan itu merambat ke jaminan yang bisa diberikan aplikasimu secara jujur.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Eventual consistency",
          text: "Banyak layanan cloud menerima ketidaksesuaian sementara antar replika dan merekonsiliasinya kemudian. Ini membeli ketersediaan dan latensi dengan harga adanya jendela waktu di mana dua pembacaan bisa berbeda.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Tagihan egress",
          text: "Memindahkan data keluar dari penyedia cloud sering ditagih terpisah dan bisa jauh melebihi biaya penyimpanan, yang merupakan batasan arsitektur nyata, bukan sekadar catatan kaki.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      client: { label: "Perangkatmu", sub: "permintaan unggah", desc: "Mengirim data dan permintaan. Ia benar-benar tidak tahu mesin fisik mana yang akan melayaninya." },
      edge: { label: "Jaringan Edge", sub: "point of presence terdekat", desc: "Mengakhiri koneksi dekat pengguna dan meneruskan lalu lintas ke backbone penyedia." },
      lb: { label: "Load Balancer", sub: "memilih server", desc: "Mendistribusikan pekerjaan yang masuk ke server yang sehat agar tidak ada satu mesin pun menjadi hambatan atau titik kegagalan tunggal." },
      vm1: { label: "Virtual Machine A", sub: "zona 1", desc: "Satu server virtual terisolasi. Jika perangkat kerasnya gagal, virtual machine yang sama bisa dinyalakan ulang di tempat lain." },
      vm2: { label: "Virtual Machine B", sub: "zona 2", desc: "Replika independen di failure domain terpisah, sehingga satu kegagalan rak tidak bisa menghilangkan datamu." },
      vm3: { label: "Virtual Machine C", sub: "zona 3", desc: "Salinan ketiga. Redundansi adalah keseluruhan strategi keandalannya." },
      recon: { label: "Rekonsiliasi", sub: "perbaiki perbedaan", desc: "Membandingkan replika dan memperbaiki yang tertinggal atau berbeda selama terjadi kegagalan." },
    },
    edges: {
      "client->edge": { label: "unggah" },
      "lb->vm1": { label: "replikasi" },
    },
    steps: {
      upload: { title: "1 · Unggah", short: "Unggah", description: "Perangkatmu mengirim data lewat jaringan. Data dirutekan ke point of presence terdekat, bukan ke mesin mana pun yang akhirnya akan menyimpannya.", value: "payload 12 MB" },
      route: { title: "2 · Rutekan", short: "Rutekan", description: "Load balancer memilih server yang sehat dan masih punya kapasitas, lalu meneruskan permintaan.", value: "3 target sehat" },
      replicate: { title: "3 · Replikasi", short: "Replikasi", description: "Salinan ditulis ke server di failure domain terpisah. Tidak ada yang diakui sampai cukup banyak salinan tersimpan dengan aman.", value: "2 dari 3 terkonfirmasi" },
      confirm: { title: "4 · Konfirmasi & Perbaikan", short: "Konfirmasi", description: "Baru setelah penulisan tahan lama, sistem melaporkan berhasil. Di latar belakang, replika dibandingkan dan diperbaiki.", value: "penulisan tahan lama" },
    },
  },
  model3d: {
    hotspots: {
      racks: { label: "Rak server", detail: "Kerangka terstandar yang menampung puluhan server, terkelola kabel dan pendinginannya dengan pola yang dapat diprediksi." },
      power: { label: "Distribusi daya", detail: "Suplai redundan dan cadangan baterai atau flywheel menjembatani celah sampai genset berputar." },
      cool: { label: "Pendinginan", detail: "Membuang panas adalah biaya kelas utama. Sebagian fasilitas memakai udara luar atau pendinginan cair untuk menekannya." },
      network: { label: "Jaringan spine", detail: "Fabric internal yang membuat server mana pun bisa menjangkau server lain dengan latensi yang dapat diprediksi." },
    },
  },
};

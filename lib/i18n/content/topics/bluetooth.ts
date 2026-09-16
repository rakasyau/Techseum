import type { TopicTranslation } from "../types";

export const bluetoothId: TopicTranslation = {
  title: "Bagaimana Bluetooth Tetap Terhubung?",
  question: "Bagaimana earbud nirkabel menjaga panggilan tanpa menguras bateraimu?",
  summary:
    "Bluetooth dirancang untuk jarak pendek dan anggaran daya yang sangat kecil. Ia melompat di antara frekuensi, menjaga jadwal yang ketat, dan menegosiasikan secara tepat berapa bandwidth yang dibutuhkan tiap layanan.",
  tags: ["BLE", "frequency hopping", "pairing", "piconet"],
  levels: {
    1: {
      lede: "Bluetooth adalah radio berdaya sangat rendah untuk jarak yang sangat pendek — personal area networking, bukan akses internet.",
      blocks: [
        {
          type: "p",
          text: "Ia dibuat untuk menggantikan kabel di antara perangkatmu sendiri: earbud, jam tangan, keyboard, mouse. Daya rendah lebih penting daripada kecepatan mentah, jadi ia mengirim data jauh lebih sedikit daripada Wi-Fi.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Dua mode, satu radio",
          text: "Bluetooth klasik mengalirkan audio terus-menerus, sedangkan Bluetooth Low Energy hanya bangun sebentar untuk mengirim satu bacaan. Jam tangan bisa bertahan berminggu-minggu dengannya.",
        },
      ],
    },
    2: {
      lede: "Perangkat melakukan pairing sekali, lalu berbagi sebuah kunci rahasia sehingga setiap koneksi berikutnya dipercaya tanpa mengulang prosesnya.",
      blocks: [
        {
          type: "p",
          text: "Saat pairing, kedua perangkat menyepakati kunci bersama. Kunci itu memungkinkan mereka menyambung kembali secara privat. Inilah sebabnya kamu hanya perlu menyetujui sebuah perangkat satu kali.",
        },
        {
          type: "steps",
          items: [
            { title: "Advertise", text: "Aksesori menyiarkan namanya dan layanan yang ditawarkannya." },
            { title: "Connect", text: "Ponsel meminta koneksi." },
            { title: "Pair", text: "Sebuah kunci diturunkan dan disimpan di kedua sisi." },
            { title: "Reconnect", text: "Sesi berikutnya diotentikasi dengan kunci yang tersimpan." },
          ],
        },
      ],
    },
    3: {
      lede: "Bluetooth melompat dengan cepat di antara frekuensi untuk menghindari interferensi, dan sebuah piconet menjaga jadwal waktu yang ketat.",
      blocks: [
        {
          type: "p",
          text: "Dengan mengganti frekuensi ratusan kali per detik, kedua ujung menghindari berlama-lama di kanal yang berisik. Jika satu frekuensi terblokir, hop berikutnya kemungkinan besar bersih — itulah sebabnya Bluetooth menurun perlahan alih-alih langsung terputus.",
        },
        {
          type: "stats",
          items: [
            { label: "Jumlah kanal", value: "40", note: "BLE, berjarak 2 MHz" },
            { label: "Laju hop", value: "1600 /s", note: "Bluetooth klasik" },
            { label: "Connection interval", value: "7,5 ms", note: "minimum BLE" },
            { label: "Daya puncak", value: "100 mW", note: "Class 1" },
          ],
        },
      ],
    },
    4: {
      lede: "BLE menegosiasikan connection interval dan latency yang menukar daya tanggap dengan masa pakai baterai per layanan.",
      blocks: [
        {
          type: "p",
          text: "Sensor yang melaporkan suhu sekali semenit bisa memakai connection interval panjang dan melewati banyak event, membangunkan radio hanya dalam hitungan milidetik per jam. Peripheral juga bisa menetapkan latency yang memungkinkannya mengabaikan sejumlah interval dan tetap tertidur.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Kenapa codec penting untuk earbudmu",
          text: "Kualitas audio dan latency diatur oleh codec yang dinegosiasikan antara perangkat. Radio punya bandwidth yang cukup; codec-lah yang menentukan apa yang tiba tepat waktu.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      earbud: { label: "Earbud", sub: "peripheral", desc: "Peripheral yang dibatasi baterai. Seluruh desainnya berfokus pada penggunaan waktu radio sesedikit mungkin." },
      adv: { label: "Advertiser", sub: "menyiarkan keberadaan", desc: "Secara berkala menyiarkan paket pendek yang menyebutkan perangkat dan layanan yang ditawarkannya, lalu tidur lagi." },
      phone: { label: "Ponsel", sub: "perangkat central", desc: "Perangkat central yang memindai, menyambung, dan mengoordinasikan waktu link." },
      pair: { label: "Pairing & Kunci", sub: "dipercaya sekali", desc: "Menurunkan dan menyimpan kunci bersama agar koneksi berikutnya diotentikasi tanpa mengulang handshake." },
      hop: { label: "Radio Hopping", sub: "1600 hop / detik", desc: "Terus-menerus mengganti frekuensi sehingga tidak ada satu kanal yang terblokir yang bisa memutus link." },
      sched: { label: "Jadwal Koneksi", sub: "bangun, kirim, tidur", desc: "Kedua ujung menyepakati secara tepat kapan harus bangun. Setiap mikrodetik waktu radio dianggarkan terhadap masa pakai baterai." },
      profile: { label: "Service Profile", sub: "audio / HID / sensor", desc: "Menentukan apa yang sebenarnya dibawa koneksi — headphone, keyboard, atau bacaan detak jantung." },
      codec: { label: "Codec", sub: "kualitas ↔ latency", desc: "Memampatkan dan mengodekan audio. Codec yang dinegosiasikan, bukan radio, yang menentukan kualitas dan jeda yang kamu rasakan." },
    },
    edges: {
      "earbud->adv": { label: "advertise" },
      "adv->phone": { label: "scan & connect" },
      "phone->pair": { label: "bond" },
      "pair->sched": { label: "waktu disepakati" },
      "hop->earbud": { label: "audio" },
    },
    steps: {
      advertise: { title: "1 · Advertise", short: "Advertise", description: "Earbud bangun sebentar dan menyiarkan paket mungil yang menyebut dirinya dan layanannya, lalu kembali tidur.", value: "ADV · setiap 100 ms" },
      connect: { title: "2 · Connect & Pair", short: "Pair", description: "Ponsel merespons, keduanya melakukan handshake, dan kunci bersama disimpan di kedua perangkat untuk sesi berikutnya.", value: "ter-bonding · kunci tersimpan" },
      schedule: { title: "3 · Jadwal", short: "Jadwal", description: "Keduanya menyepakati connection interval dan urutan hop. Kedua ujung kini bangun pada momen yang persis sama dan tidur di antaranya.", value: "interval = 15 ms" },
      stream: { title: "4 · Streaming", short: "Streaming", description: "Audio dikodekan oleh codec yang dinegosiasikan dan dikirim dalam slot terjadwal, sambil terus melompat frekuensi untuk menghindari interferensi.", value: "AAC · 48 kHz" },
    },
  },
  model3d: {
    hotspots: {
      radio: { label: "Die radio", detail: "Satu chip yang menangani radio sekaligus prosesor kecil yang menjalankan protokolnya." },
      antenna: { label: "Antena", detail: "Sering dicetak langsung ke papan — bentuk fisiknya menentukan seberapa baik ia memancarkan sinyal." },
      battery: { label: "Baterai koin", detail: "Bluetooth Low Energy bisa bertahan bertahun-tahun dengan sel sekecil ini." },
      clock: { label: "Timer tidur", detail: "Kristal yang memungkinkan radio bangun pada saat yang tepat yang telah disepakati." },
    },
  },
};

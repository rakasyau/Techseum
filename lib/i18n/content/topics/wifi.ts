import type { TopicTranslation } from "../types";

export const wifiId: TopicTranslation = {
  title: "Bagaimana Wi-Fi Mengirim Data?",
  question: "Sebenarnya apa yang beterbangan di udara antara ponselmu dan router?",
  summary:
    "Wi-Fi adalah radio. Datamu dimodulasi ke gelombang pembawa, dikirim dalam irisan waktu yang sangat kecil melintasi kanal bersama, lalu disusun kembali di ujung seberang.",
  tags: ["radio", "OFDM", "kanal", "802.11"],
  levels: {
    1: {
      lede: "Wi-Fi adalah radio — keluarga gelombang yang sama dengan siaran FM, hanya saja frekuensinya jauh lebih tinggi dan jangkauannya jauh lebih pendek.",
      blocks: [
        {
          type: "p",
          text: "Router dan ponselmu masing-masing punya antena. Router mengubah data menjadi sinyal radio yang berubah dengan sangat cepat; antena ponselmu menangkapnya dan mengubahnya kembali menjadi data. Tidak ada 'internet' yang benar-benar terbang — yang ada hanyalah gelombang.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Kenapa dinding jadi masalah",
          text: "Frekuensi yang lebih tinggi membawa lebih banyak data tetapi menempuh jarak yang lebih pendek dan lebih sulit menembus dinding. Itulah inti pertukaran di balik nama 2,4 GHz dan 5 GHz.",
        },
      ],
    },
    2: {
      lede: "Kanal dipakai bersama dengan sopan: perangkat bergiliran dalam slot waktu kecil, dan setiap slot membawa banyak sub-carrier sekaligus.",
      blocks: [
        {
          type: "p",
          text: "Hanya satu perangkat yang boleh mengirim pada satu waktu di sebuah kanal, jadi Wi-Fi mendengarkan lebih dulu, menunggu jeda acak, baru kemudian mengirim. Jika dua perangkat memilih saat yang sama, keduanya berhenti dan mencoba lagi — itulah yang disebut collision.",
        },
        {
          type: "steps",
          items: [
            { title: "Dengarkan", text: "Periksa bahwa kanal sedang sepi." },
            { title: "Tunggu", text: "Jeda sejenak dengan durasi acak." },
            { title: "Kirim", text: "Kirim satu frame dalam satu slot waktu." },
            { title: "Konfirmasi", text: "Penerima mengakuinya; jika diam, kirim ulang." },
          ],
        },
      ],
    },
    3: {
      lede: "OFDM memecah satu kanal lebar menjadi banyak sub-carrier sempit yang masing-masing membawa aliran lambat — bersama-sama keduanya cepat dan tangguh.",
      blocks: [
        {
          type: "p",
          text: "Sub-carrier yang sempit tahan terhadap multipath: ketika pantulan membuat sebagian frekuensi saling meniadakan, sebagian besar sub-carrier tetap tiba utuh. Modulasinya menyesuaikan per sub-carrier — QAM saat kondisi bersih, skema yang lebih sederhana saat sinyal lemah.",
        },
        {
          type: "stats",
          items: [
            { label: "Sub-carrier", value: "~2000", note: "pada kanal Wi-Fi 6 160 MHz" },
            { label: "QAM tertinggi", value: "1024-QAM", note: "10 bit per simbol" },
            { label: "Slot time", value: "9 µs" },
            { label: "Jangkauan dalam ruangan", value: "10–50 m" },
          ],
        },
      ],
    },
    4: {
      lede: "MU-MIMO dan OFDMA memungkinkan satu access point melayani beberapa klien dalam satu transmisi, bukan satu per satu.",
      blocks: [
        {
          type: "p",
          text: "OFDMA membagi sub-carrier sebuah kanal ke beberapa klien secara bersamaan, sehingga paket kecil tidak lagi membuang satu slot waktu penuh. MU-MIMO memakai beberapa antena untuk membentuk aliran spasial terpisah ke perangkat yang berbeda.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Masalah hidden node",
          text: "Dua perangkat yang tidak bisa saling mendengar bisa mengirim ke access point secara bersamaan. RTS/CTS dirancang untuk mengurangi collision yang timbul akibatnya.",
        },
        {
          type: "p",
          text: "Di lingkungan yang padat, batasnya bukan kecepatan link-mu melainkan airtime: semua orang di kanal itu berbagi anggaran waktu yang sama, dan klien lama yang lambat bisa menghabiskan jauh lebih banyak dari bagiannya.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      app: { label: "Perangkatmu", sub: "data yang akan dikirim", desc: "Aplikasi menyerahkan sebuah paket ke network stack, yang membungkusnya untuk transmisi nirkabel." },
      baseband: { label: "Baseband", sub: "bit → simbol", desc: "Mengelompokkan bit menjadi simbol dan memetakannya ke sub-carrier memakai QAM. Semakin banyak bit per simbol berarti semakin cepat tetapi semakin rentan terhadap noise." },
      radio: { label: "Front End Radio", sub: "gelombang pembawa", desc: "Memodulasi simbol ke frekuensi pembawa pada pita 2,4 atau 5 GHz dan menggerakkan antena." },
      air: { label: "Udara", sub: "medium bersama", desc: "Medium bersama, berisik, dan half-duplex. Semua yang ada di sini memperebutkan slot waktu kecil yang sama." },
      ant: { label: "Access Point", sub: "menerima", desc: "Mendengarkan kanal, mendemodulasi apa yang didengarnya, dan mengirimkan acknowledgement." },
      router: { label: "Router", sub: "meneruskan", desc: "Meneruskan paket ke jaringan kabel. Internet dimulai dari sini." },
      retry: { label: "Retry & Backoff", sub: "saat terjadi collision", desc: "Jika tidak ada acknowledgement yang datang, perangkat menunggu backoff acak dan mencoba lagi. Tak terlihat, terus-menerus, dan itulah sebabnya jaringan yang padat terasa lambat." },
    },
    edges: {
      "app->baseband": { label: "paket" },
      "baseband->radio": { label: "simbol" },
      "radio->air": { label: "modulasi" },
      "air->ant": { label: "merambat" },
      "ant->router": { label: "frame" },
    },
    steps: {
      frame: { title: "1 · Susun Frame", short: "Frame", description: "Data dari aplikasi dibungkus dalam header yang menyebutkan sumber, tujuan, dan kanal, lalu diserahkan ke wireless stack.", value: "payload 1.500 byte" },
      modulate: { title: "2 · Modulasi", short: "Modulasi", description: "Bit menjadi simbol QAM, disebar ke ratusan sub-carrier, menumpang gelombang pembawa yang diluncurkan antena.", value: "1024-QAM · OFDM" },
      listen: { title: "3 · Perebutan Kanal", short: "Rebut", description: "Pengirim memeriksa bahwa kanal sedang idle sebelum mengirim. Jika terjadi collision, kedua pengirim melakukan backoff dan menunggu jeda acak.", value: "kanal idle → kirim" },
      ack: { title: "4 · Acknowledgement", short: "Ack", description: "Access point mendemodulasi frame dan membalas dengan acknowledgement. Baru setelah itu pengirim melanjutkan ke paket berikutnya.", value: "ACK diterima" },
    },
  },
  model3d: {
    hotspots: {
      antennas: { label: "Antena", detail: "Beberapa antena memungkinkan beamforming untuk mengarahkan sinyal ke klien, bukan menyemprotkannya ke segala arah." },
      soc: { label: "SoC Wi-Fi", detail: "Menjalankan baseband, modulasi, dan koordinasi MAC. Sebagian besar pekerjaan terjadi di satu chip ini." },
      radio: { label: "Rantai RF", detail: "Mengubah simbol digital menjadi frekuensi radio dan sebaliknya, satu rantai per aliran antena." },
      ports: { label: "Port Ethernet", detail: "Sisi kabel — tempat jaringan nirkabel bergabung dengan internet." },
    },
  },
};

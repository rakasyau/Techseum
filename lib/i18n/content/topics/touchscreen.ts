import type { TopicTranslation } from "../types";

export const touchscreenId: TopicTranslation = {
  title: "Bagaimana Layar Sentuh Merasakan Jarimu?",
  question: "Bagaimana selembar kaca tahu persis di mana kamu menekannya?",
  summary:
    "Layar kapasitif mempertahankan jaringan medan listrik kecil. Jarimu mengganggunya, dan controller menghitung lokasinya dengan mengukur persilangan mana yang berubah.",
  tags: ["kapasitansi", "ITO", "multitouch", "controller"],
  levels: {
    1: {
      lede: "Jarimu adalah konduktor. Layar menyadarinya karena sentuhanmu mengubah medan listrik yang terus-menerus diukurnya.",
      blocks: [
        {
          type: "p",
          text: "Di balik kaca ada kisi elektrode transparan yang tak terlihat. Listrik tidak mengalir ke jarimu; sebaliknya, jarimu sedikit mengubah perilaku setiap persilangan, dan layar mengamati perubahan itu.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Kenapa sarung tangan gagal",
          text: "Sarung tangan kain adalah isolator. Tanpa jalur konduktif, medannya nyaris tidak berubah dan layar tidak bisa tahu kamu ada di sana.",
        },
      ],
    },
    2: {
      lede: "Layar memindai baris demi baris, mengukur kapasitansi di setiap persilangan kisi elektrode.",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Drive satu baris", text: "Tegangan diberikan ke satu elektrode horizontal." },
            { title: "Sapu kolom", text: "Setiap elektrode vertikal diukur satu per satu." },
            { title: "Deteksi penurunan", text: "Jari menarik sebagian muatan, sehingga bacaannya turun." },
            { title: "Interpolasi", text: "Controller menghitung koordinat yang mulus." },
          ],
        },
        {
          type: "p",
          text: "Memindai seluruh kisi memakan waktu beberapa milidetik. Sapuan cepat yang berulang itulah sebabnya layar melacak jarimu semulus ini.",
        },
      ],
    },
    3: {
      lede: "Elektrode-elektrode itu terbuat dari konduktor transparan bernama indium tin oxide, dan sinyal yang terukur sangat kecil.",
      blocks: [
        {
          type: "p",
          text: "Mutual capacitance mengukur kopling antara baris dan kolom tertentu. Sentuhan mengurangi kopling itu dengan jumlah kecil, sering kali di bawah satu pikofarad, di atas baseline yang jauh lebih besar. Tugas nyata controller adalah memisahkan sinyal dari noise.",
        },
        {
          type: "stats",
          items: [
            { label: "Node kisi", value: "~10.000", note: "pada panel ponsel" },
            { label: "Perubahan sinyal", value: "<1 pF" },
            { label: "Laju pemindaian", value: "60–240 Hz" },
            { label: "Latency", value: "<10 ms" },
          ],
        },
      ],
    },
    4: {
      lede: "Controller sentuh memakai penginderaan diferensial, penyaringan, dan prediksi untuk bertahan dari noise listrik dari layar itu sendiri.",
      blocks: [
        {
          type: "p",
          text: "Panel yang sekaligus menampilkan dan mengindera sedang bertarung dengan dirinya sendiri: sinyal drive layar langsung terkopel ke elektrode pengindera. Controller memakai pengukuran diferensial, skema frekuensi, dan pengaturan waktu agar layar dan sentuhan tetap beroperasi tanpa saling merusak.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Palm rejection dan prediksi",
          text: "Controller modern memodelkan ukuran kontak, tekanan, dan gerakan, sehingga bisa mengabaikan telapak yang beristirahat dan memprediksi ke mana sapuan cepat mengarah sebelum tiba.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      finger: { label: "Jari", sub: "konduktor", desc: "Objek konduktif dan terhubung ground. Tidak perlu menekan keras — kedekatan saja sudah mengubah medannya." },
      glass: { label: "Kaca Pelindung", sub: "isolator", desc: "Melindungi elektrode di bawahnya. Ia isolator, jadi muatan tidak pernah benar-benar mengalir ke jarimu." },
      rx: { label: "Elektrode Penerima", sub: "kolom", desc: "Diukur satu per satu. Jari di dekatnya menarik muatan dan menurunkan bacaan pada kolom itu." },
      tx: { label: "Elektrode Drive", sub: "baris", desc: "Baris dipacu satu per satu dengan tegangan yang diketahui, sehingga controller selalu tahu baris mana yang sedang diuji." },
      ctrl: { label: "Controller Sentuh", sub: "menemukan koordinat", desc: "Menyapu kisi, mengurangi baseline, dan menginterpolasi koordinat tepat setiap kontak — termasuk beberapa sekaligus." },
      noise: { label: "Penyaringan Noise", sub: "interferensi layar", desc: "Sinyal drive layar itu sendiri terkopel ke sensor. Menyaringnya keluar adalah bagian tersulit dari desainnya." },
    },
    edges: {
      "finger->glass": { label: "kedekatan" },
      "glass->rx": { label: "medan berubah" },
      "tx->rx": { label: "mutual C" },
      "rx->ctrl": { label: "pindai" },
      "noise->ctrl": { label: "noise" },
    },
    steps: {
      baseline: { title: "1 · Pemindaian Baseline", short: "Baseline", description: "Tanpa ada yang menyentuh, controller mengukur setiap persilangan baris-kolom dan mencatat nilai-nilainya sebagai baseline.", value: "10.000 node disampel" },
      approach: { title: "2 · Jari Mendekat", short: "Mendekat", description: "Jarimu memasuki medan listrik di atas kaca. Tidak ada yang benar-benar tersentuh, tetapi persilangan di dekatnya mulai berubah.", value: "perubahan sekitar 0,4 pF" },
      scan: { title: "3 · Deteksi Penurunan", short: "Deteksi", description: "Baris dipacu bergantian dan kolom disapu. Persilangan di bawah jari terbaca lebih rendah daripada baseline.", value: "puncak di baris 14, kolom 22" },
      locate: { title: "4 · Lokalisasi & Pelacakan", short: "Lokasi", description: "Controller menginterpolasi antar node tetangga untuk menghasilkan koordinat yang mulus, lalu mengulang seluruh sapuan puluhan kali per detik.", value: "(x=412, y=688) pada 120 Hz" },
    },
  },
  model3d: {
    hotspots: {
      glass: { label: "Kaca pelindung", detail: "Diperkuat secara kimia dan direkatkan secara optis sehingga tidak ada celah udara antara kaca dan panel." },
      touch: { label: "Lapisan sensor sentuh", detail: "Kisi elektrode indium tin oxide yang transparan, tak terlihat karena tebalnya hanya beberapa nanometer." },
      oled: { label: "Panel OLED", detail: "Jutaan piksel yang memancarkan cahayanya sendiri. Karena memancarkan alih-alih menyaring, ia bisa setipis kertas dan lentur." },
      board: { label: "Logic board", detail: "SoC, memori, dan controller berada di sini, bersama IC driver layar itu sendiri." },
    },
  },
};

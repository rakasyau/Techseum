import type { TopicTranslation } from "../types";

export const cameraId: TopicTranslation = {
  title: "Bagaimana Kamera Menangkap Cahaya",
  question: "Bagaimana lensa dan sensor mengubah dunia menjadi sebuah foto?",
  summary:
    "Cahaya melewati lensa, difokuskan ke sensor, dan tiap piksel mengubah foton menjadi muatan listrik. Aperture, shutter, dan ISO menentukan anggaran eksposur.",
  tags: ["optik", "CMOS", "eksposur", "aperture"],
  levels: {
    1: {
      lede: "Kamera adalah corong cahaya. Lensa membelokkan sinar yang masuk agar jatuh di tempat yang tepat pada sensor, bukan menyebar.",
      blocks: [
        {
          type: "p",
          text: "Dunia memantulkan cahaya ke segala arah. Lensa mengumpulkan kerucut sinar dari tiap titik dan membelokkannya sehingga setiap titik bertemu di satu spot yang sesuai pada sensor. Sensor mencatat seberapa terang tiap spot.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Fokus adalah titik pertemuan",
          text: "Saat cahaya dari suatu titik tidak tepat bertemu di sensor, titik itu menyebar menjadi bayangan kabur. Autofocus menggeser lensa sampai kaburnya paling kecil.",
        },
      ],
    },
    2: {
      lede: "Tiga kontrol menentukan eksposur: seberapa lebar bukaannya, seberapa lama terbuka, dan seberapa besar sinyalnya diperkuat.",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Aperture", text: "Ukuran bukaan. Makin lebar, makin banyak cahaya masuk dan makin kabur latar belakangnya." },
            { title: "Shutter", text: "Berapa lama sensor terpapar. Makin lama, makin banyak cahaya terkumpul tetapi gerakan jadi kabur." },
            { title: "ISO", text: "Penguatan yang diterapkan pada sinyal, dengan konsekuensi noise bertambah." },
            { title: "Keseimbangan", text: "Ketiganya bersama-sama menentukan kecerahan keseluruhan." },
          ],
        },
        {
          type: "p",
          text: "Perubahan pada salah satunya bisa dikompensasi oleh yang lain — aperture lebar dan shutter cepat bisa menangkap kecerahan yang sama dengan aperture sempit dan shutter lambat, tetapi hasil gambarnya tidak akan sama.",
        },
      ],
    },
    3: {
      lede: "Sensor CMOS mengubah foton menjadi elektron, dan muatan yang dihasilkan dibaca baris demi baris.",
      blocks: [
        {
          type: "p",
          text: "Tiap piksel punya photodiode yang mengakumulasi muatan sebanding dengan cahaya yang mengenainya, plus transistor yang mereset-nya dan memungkinkan muatan dibaca. Nilai analog itu diperkuat oleh gain ISO dan didigitalkan oleh ADC.",
        },
        {
          type: "stats",
          items: [
            { label: "Ukuran full-frame", value: "36 x 24 mm" },
            { label: "Photosite", value: "3–6 um" },
            { label: "Kedalaman bit", value: "12–14 bit", note: "per kanal, raw" },
            { label: "Readout", value: "1/250 s", note: "rolling shutter" },
          ],
        },
      ],
    },
    4: {
      lede: "Kualitas cahaya rendah dibatasi oleh statistik foton, dan read noise menetapkan batas bawah yang tidak bisa dikalahkan oleh penguatan sebesar apa pun.",
      blocks: [
        {
          type: "p",
          text: "Dalam cahaya redup, jumlah foton per piksel menjadi cukup kecil sehingga variasi acak mendominasi, itulah sebabnya area gelap tampak berbintik. Menaikkan ISO membuat bintik itu makin terlihat; ISO tidak bisa menciptakan informasi yang tidak tertangkap.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Rolling shutter",
          text: "Sebagian besar sensor mengekspos dan membaca baris secara berurutan. Jika scene atau kamera bergerak selama readout, garis vertikal bisa miring — distorsi yang makin parah dengan gerakan lebih cepat dan readout lebih lambat.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Kenapa computational photography unggul",
          text: "Menumpuk beberapa frame mengurangi noise acak karena sinyalnya konsisten sedangkan noise-nya tidak. Itulah cara sensor kecil menghasilkan foto malam yang tampak bersih.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      scene: { label: "Adegan", sub: "cahaya terpantul", desc: "Setiap titik dalam adegan memantulkan cahaya ke segala arah. Kamera hanya mengumpulkan kerucut sempitnya." },
      lens: { label: "Elemen Lensa", sub: "memfokuskan sinar", desc: "Tumpukan elemen kaca membelokkan cahaya sehingga sinar dari satu titik bertemu kembali di sensor." },
      aperture: { label: "Aperture", sub: "diameter iris", desc: "Mengontrol berapa banyak cahaya yang masuk dan seberapa dalam area yang fokus. Terbuka lebar berarti lebih banyak cahaya dan depth of field yang lebih dangkal." },
      shutter: { label: "Shutter", sub: "waktu eksposur", desc: "Menentukan berapa lama cahaya dibiarkan mencapai sensor. Cukup lama untuk mengumpulkan cahaya, cukup singkat untuk membekukan gerakan." },
      sensor: { label: "Sensor CMOS", sub: "foton menjadi muatan", desc: "Jutaan photodiode, masing-masing mengakumulasi muatan sebanding dengan cahaya yang diterimanya." },
      adc: { label: "Readout & ADC", sub: "muatan menjadi angka", desc: "Baris demi baris, muatan tiap piksel diperkuat dan didigitalkan menjadi angka yang bisa disimpan prosesor." },
      isp: { label: "Image Processor", sub: "demosaic, denoise", desc: "Mengubah angka mentah menjadi gambar yang bisa dilihat: white balance, demosaicing, pengurangan noise, dan penajaman." },
    },
    edges: {
      "scene->lens": { label: "sinar" },
      "lens->aperture": { label: "dibatasi oleh" },
      "shutter->sensor": { label: "ekspos" },
      "sensor->adc": { label: "muatan" },
      "adc->isp": { label: "data mentah" },
    },
    steps: {
      collect: { title: "1 · Kumpulkan Cahaya", short: "Kumpulkan", description: "Lensa mengumpulkan kerucut sinar dari setiap titik dalam adegan dan membelokkannya menuju sensor.", value: "kerucut f/2.8" },
      meter: { title: "2 · Atur Eksposur", short: "Ekspos", description: "Aperture melebar atau menyempit dan shutter terbuka selama waktu tertentu, bersama-sama menentukan berapa banyak cahaya yang mencapai sensor.", value: "1/250 s pada f/4" },
      accumulate: { title: "3 · Akumulasi Muatan", short: "Akumulasi", description: "Tiap photodiode mengubah foton yang masuk menjadi elektron. Spot yang lebih terang mengumpulkan lebih banyak muatan daripada yang lebih gelap.", value: "kapasitas well ~30,000 e-" },
      read: { title: "4 · Baca & Proses", short: "Baca", description: "Sensor dibaca baris demi baris, tiap nilai didigitalkan, dan image processor merekonstruksi gambar berwarna penuh.", value: "24 MP pada 14-bit" },
    },
  },
  model3d: {
    hotspots: {
      lens: { label: "Rangkaian lensa", detail: "Beberapa elemen kaca, sebagian bergerak untuk fokus dan sebagian lagi menstabilkan terhadap guncangan." },
      iris: { label: "Bilah aperture", detail: "Bilah yang saling menumpuk dan membuka-menutup untuk mengatur angka f." },
      sensor: { label: "Sensor gambar", detail: "Chip silikon tempat foton menjadi elektron. Ukurannya menentukan performa cahaya rendah." },
      shutter: { label: "Shutter", detail: "Menutup dan membuka sensor selama waktu eksposur yang tepat." },
    },
  },
};

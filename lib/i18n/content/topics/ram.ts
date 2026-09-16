import type { TopicTranslation } from "../types";

export const ramId: TopicTranslation = {
  title: "Di Dalam RAM",
  question: "Kenapa menutup aplikasi membuat komputermu lebih cepat?",
  summary:
    "Random access memory menyimpan apa pun yang sedang dikerjakan CPU saat ini — dan melupakan semuanya begitu daya diputus.",
  tags: ["DRAM", "kapasitor", "memory controller", "refresh"],
  levels: {
    1: {
      lede: "RAM adalah meja kerjamu. Penyimpanan adalah lemari arsipnya — tetapi kamu hanya bisa mengerjakan apa yang ada di atas meja.",
      blocks: [
        {
          type: "p",
          text: "Setiap program yang kamu buka, setiap tab yang kamu muat, setiap foto yang kamu edit harus berada di RAM selama kamu memakainya. RAM jauh lebih sedikit daripada penyimpanan, jadi meja itu cepat penuh.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Kenapa disebut volatile",
          text: "RAM menyimpan setiap bit sebagai muatan listrik kecil. Putuskan dayanya dan muatan itu habis dalam hitungan milidetik — itulah sebabnya pekerjaan yang belum disimpan menghilang.",
        },
      ],
    },
    2: {
      lede: "Setiap bit hidup dalam sel yang dibangun dari satu transistor dan satu kapasitor, tersusun dalam grid besar berisi baris dan kolom.",
      blocks: [
        {
          type: "p",
          text: "Kapasitor menampung muatan yang mewakili 0 atau 1. Transistor adalah gerbang yang memungkinkan memory controller membacanya atau menulis ulangnya. Sel-sel dirangkai menjadi baris — disebut word line — dan kolom yang disebut bit line.",
        },
        {
          type: "steps",
          items: [
            { title: "Aktivasi baris", text: "Controller memilih satu baris, mencurahkan setiap sel di dalamnya ke sense amplifier." },
            { title: "Sense", text: "Amplifier mendeteksi muatan yang terlalu lemah untuk dibaca langsung." },
            { title: "Pilih kolom", text: "Hanya kolom yang diminta yang diteruskan." },
            { title: "Burst", text: "Kolom-kolom di sekitarnya mengalir keluar bersamaan — itulah sebabnya akses berurutan lebih cepat." },
          ],
        },
      ],
    },
    3: {
      lede: "Karena kapasitor bocor, setiap baris harus diisi ulang ribuan kali per detik — dan refresh itu adalah pekerjaan yang tak terlihat.",
      blocks: [
        {
          type: "p",
          text: "Siklus refresh mencuri bandwidth dari permintaan sungguhan. Memory controller menjadwalkan refresh secara oportunistik dan mengelompokkan permintaan untuk menyembunyikannya, yang menjadi salah satu alasan latensi memori dinyatakan sebagai rentang, bukan satu angka.",
        },
        {
          type: "stats",
          items: [
            { label: "Latensi tipikal", value: "10–20 ns", note: "aktivasi baris plus akses kolom" },
            { label: "Interval refresh", value: "64 ms", note: "per baris" },
            { label: "Tegangan", value: "~1,2 V", note: "nominal DDR5" },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Channel mengalahkan clock",
          text: "Dua channel memori yang berjalan lebih lambat sering mengalahkan satu channel yang lebih cepat, karena beban kerja nyata mementingkan bandwidth total dan paralelisme, bukan clock puncak.",
        },
      ],
    },
    4: {
      lede: "Memory controller adalah scheduler, dan performa DRAM adalah studi tentang mengelola konflik baris dan batasan timing.",
      blocks: [
        {
          type: "p",
          text: "Membuka baris itu mahal, jadi controller menyusun ulang permintaan yang mengantre agar tetap mengenai baris yang sama. Kebebasannya dibatasi oleh kisi parameter timing — tRCD, tRP, tRAS, CL — yang masing-masing menamai jeda minimum antar operasi.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Rowhammer",
          text: "Mengaktifkan baris yang sama berulang kali bisa membuat muatannya bocor ke baris tetangga dan membalik bit mereka. Chip modern memakai refresh tertarget dan koreksi galat agar ini tidak menjadi masalah keandalan atau keamanan.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      cpu: { label: "Core CPU", sub: "meminta data", desc: "Mengeluarkan load dan store. Cache miss mengirim permintaan turun ke memory controller." },
      mctrl: { label: "Memory Controller", sub: "sang scheduler", desc: "Menerjemahkan cache miss menjadi urutan presisi perintah DRAM, menyusun ulangnya untuk menyembunyikan latensi." },
      row: { label: "Row Buffer", sub: "baris aktif", desc: "Baris yang sedang terbuka. Mengenainya murah; mengenai baris lain memaksa precharge dan aktivasi terlebih dahulu." },
      amps: { label: "Sense Amplifiers", sub: "mendeteksi muatan lemah", desc: "Memperkuat perbedaan tegangan kecil dari setiap sel agar 0 atau 1 benar-benar bisa ditentukan." },
      cells: { label: "Cell Array", sub: "baris × kolom", desc: "Grid sel satu-transistor, satu-kapasitor. Berjuta-juta jumlahnya, masing-masing menampung satu bit." },
      banks: { label: "Banks", sub: "unit paralel", desc: "Bank DRAM yang independen dapat melayani permintaan secara paralel, dan begitulah controller menyembunyikan biaya setiap akses." },
      refresh: { label: "Refresh Engine", sub: "sapuan latar", desc: "Secara berkala mengisi ulang setiap baris sebelum kebocoran menghapus datanya. Tak terlihat, wajib, dan memakan bandwidth." },
    },
    edges: {
      "cpu->mctrl": { label: "cache miss" },
      "mctrl->amps": { label: "perintah" },
      "amps->cells": { label: "baca" },
      "cells->mctrl": { label: "data kembali" },
    },
    steps: {
      request: { title: "1 · Permintaan", short: "Minta", description: "Sebuah cache miss tiba di memory controller dengan membawa alamat. Controller mengantrekannya bersama setiap permintaan lain yang masih berjalan.", value: "baca 0x1A4C" },
      activate: { title: "2 · Aktivasi Baris", short: "Aktivasi baris", description: "Controller mengeluarkan perintah activate, yang menghubungkan setiap sel di baris target ke sense amplifier-nya.", value: "ACTIVATE baris 4108" },
      sense: { title: "3 · Sense", short: "Sense", description: "Sense amplifier menentukan muatan lemah itu menjadi bit digital yang bersih. Inilah bagian yang lambat — puluhan nanodetik.", value: "mendeteksi 8192 bit" },
      burst: { title: "4 · Burst & Refresh", short: "Burst", description: "Kolom yang diminta mengalir kembali ke CPU, sementara refresh engine diam-diam menyapu baris lain sebelum kebocoran menghapusnya.", value: "8 words @ 6400 MT/s" },
    },
  },
  model3d: {
    hotspots: {
      dimm: { label: "Modul DIMM", detail: "Stick-nya sendiri: papan sirkuit kecil berisi chip yang ditancapkan ke motherboard." },
      chips: { label: "Chip DRAM", detail: "Setiap package hitam berisi beberapa bank dari cell array." },
      gold: { label: "Kontak emas", detail: "Membawa daya dan data antara modul dan bus memori." },
      spd: { label: "Hub SPD", detail: "Memberi tahu sistem timing dan kecepatan apa yang didukung modul ini." },
    },
  },
};

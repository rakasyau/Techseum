import type { TopicTranslation } from "../types";

export const gpuId: TopicTranslation = {
  title: "Apa yang Membuat GPU Berbeda?",
  question: "Kenapa sebuah kartu grafis bisa melakukan dalam milidetik apa yang CPU butuhkan beberapa detik?",
  summary:
    "GPU menukar kecerdasan per-thread dengan ribuan thread sederhana yang berjalan bersamaan — bentuk yang tepat untuk gambar, fisika, dan jaringan saraf.",
  tags: ["SIMT", "rasterisasi", "shader", "paralelisme"],
  levels: {
    1: {
      lede: "CPU adalah beberapa pekerja brilian. GPU adalah ribuan pekerja biasa — dan untuk pekerjaan yang tepat, kerumunan itulah yang menang.",
      blocks: [
        {
          type: "p",
          text: "Sebuah CPU mungkin punya 12 core cepat yang masing-masing bisa menangani pekerjaan sulit dan tak terduga. Sebuah GPU punya ribuan core kecil yang semuanya melakukan hal sederhana yang sama pada waktu yang sama.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Paralel yang sangat mudah",
          text: "Mewarnai sepuluh juta piksel adalah sepuluh juta tugas yang nyaris identik. Tidak ada yang bergantung pada piksel di sebelahnya, jadi semuanya bisa dibagikan ke semua orang sekaligus.",
        },
      ],
    },
    2: {
      lede: "Satu frame digambar dalam beberapa tahap: geometri ditransformasi, bentuk dirasterisasi menjadi piksel, dan setiap piksel di-shading.",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Tahap vertex", text: "Setiap sudut dari setiap segitiga dipindahkan ke ruang layar." },
            { title: "Rasterisasi", text: "Segitiga dipotong menjadi piksel-piksel yang dicakupnya." },
            { title: "Tahap fragment", text: "Setiap piksel yang tercakup menjalankan shader untuk menentukan warnanya." },
            { title: "Output", text: "Depth dan blending menentukan apa yang benar-benar terlihat." },
          ],
        },
        {
          type: "p",
          text: "Setiap tahap bersifat sangat paralel dan ber-pipeline, itulah sebabnya ribuan piksel berada di tahap yang berbeda secara bersamaan.",
        },
      ],
    },
    3: {
      lede: "Eksekusi SIMT berarti sekelompok thread berbagi satu aliran instruksi, dan divergensi di dalam kelompok itu mahal.",
      blocks: [
        {
          type: "p",
          text: "Thread dikelompokkan menjadi warp berisi 32 atau 64. Mereka mengeksekusi bersama, jadi jika separuhnya mengambil satu cabang dan separuhnya lagi mengambil cabang lain, perangkat keras menjalankan kedua jalur dan menutupi thread yang tidak berlaku. Biayanya persis sebesar divergensi itu.",
        },
        {
          type: "stats",
          items: [
            { label: "Stream processor", value: "~16.000", note: "desktop kelas atas" },
            { label: "Bandwidth VRAM", value: "1 TB/s" },
            { label: "Throughput FP32", value: "80 TFLOPS" },
            { label: "Daya board", value: "320–450 W" },
          ],
        },
      ],
    },
    4: {
      lede: "Throughput menyembunyikan latensi, dan hierarki memori yang disetel untuk streaming menjaga semua thread itu tetap terisi.",
      blocks: [
        {
          type: "p",
          text: "Jika CPU memakai cache besar untuk membuat satu thread cepat, GPU memakai banyak warp untuk menyembunyikan penantian: saat satu warp terhenti menunggu memori, scheduler berpindah ke warp lain. Occupancy — jumlah warp yang menetap — adalah tuas utama apakah mesin tetap sibuk.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Konflik bank shared memory",
          text: "Thread bertukar data melalui shared memory on-chip yang cepat, terbagi menjadi bank-bank. Jika dua thread dalam satu warp mengakses bank yang sama secara bersamaan, akses itu diserialisasi dan throughput-nya turun.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Kenapa AI berjalan di sini",
          text: "Perkalian matriks hampir sempurna paralel dan sangat berulang. Itu persis bentuk yang dirancang untuk GPU, itulah sebabnya machine learning berpindah ke sana secara menyeluruh.",
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      cpu: { label: "CPU", sub: "mengeluarkan draw call", desc: "Menentukan apa yang perlu digambar dan menyerahkan sekumpulan perintah ke GPU. Ia sutradaranya, bukan pelukisnya." },
      cmdbuf: { label: "Command Buffer", sub: "pekerjaan mengantre", desc: "Mengelompokkan draw call agar GPU selalu punya pekerjaan dalam antrean dan tidak pernah menganggur di antara frame." },
      vertex: { label: "Vertex Units", sub: "transformasi sudut", desc: "Menjalankan vertex shader pada setiap sudut segitiga, memproyeksikan geometri ke ruang layar." },
      raster: { label: "Rasterizer", sub: "segitiga → piksel", desc: "Menentukan piksel mana yang dicakup setiap segitiga dan menghasilkan satu fragment untuk masing-masingnya." },
      frag: { label: "Fragment Units", sub: "ribuan thread", desc: "Jantung GPU yang sangat paralel. Setiap thread men-shading satu fragment, semuanya mengikuti program yang sama." },
      rop: { label: "ROP & Blend", sub: "depth, blending", desc: "Menentukan fragment mana yang lolos uji depth dan mem-blend yang transparan ke dalam frame." },
      vram: { label: "VRAM", sub: "bandwidth besar dan cepat", desc: "Menampung tekstur, geometri, dan framebuffer. Bandwidth di sini lebih penting daripada ukuran untuk pekerjaan streaming." },
      display: { label: "Display", sub: "frame yang selesai", desc: "Frame yang sudah jadi dipindai keluar — 60, 120, atau lebih kali per detik." },
    },
    edges: {
      "cpu->cmdbuf": { label: "draw call" },
      "cmdbuf->vertex": { label: "geometri" },
      "vertex->raster": { label: "segitiga" },
      "raster->frag": { label: "fragment" },
      "vram->frag": { label: "tekstur" },
      "frag->rop": { label: "ter-shading" },
    },
    steps: {
      issue: { title: "1 · Keluarkan Pekerjaan", short: "Keluarkan", description: "CPU mengirim sekumpulan draw call yang menjelaskan geometri, material, dan state. GPU mengonsumsinya dari command buffer.", value: "2.140 draw call" },
      vertex: { title: "2 · Transformasi", short: "Vertex", description: "Vertex unit menjalankan shader yang sama pada setiap sudut dari setiap segitiga, sekaligus.", value: "4,2 juta vertex" },
      raster: { title: "3 · Rasterisasi", short: "Rasterisasi", description: "Segitiga menjadi fragment seukuran piksel. Di sinilah cakupan ditentukan.", value: "8,3 juta fragment" },
      shade: { title: "4 · Shading & Output", short: "Shading", description: "Ribuan thread men-shading fragment secara paralel, membaca tekstur dari VRAM. ROP menerapkan depth dan blending, lalu frame ditampilkan.", value: "16,6 ms → 60 fps" },
    },
  },
  model3d: {
    hotspots: {
      die: { label: "Die GPU", detail: "Die silikon terbesar di PC konsumen — puluhan miliar transistor berisi perangkat keras paralel." },
      shroud: { label: "Shroud & kipas", detail: "Membuang panas 300+ watt dari package yang padat. Aliran udara menjadi masalah rekayasa kelas utama." },
      vram: { label: "Modul VRAM", detail: "Mengelilingi die agar jalur memori tetap pendek dan bandwidth tetap tinggi." },
      pcie: { label: "Tepi PCIe", detail: "Antarmuka slot yang membawa perintah, data, dan daya slot hingga 75 W." },
    },
  },
};

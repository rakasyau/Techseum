import type { TopicTranslation } from "../types";

export const neuralNetId: TopicTranslation = {
  title: "Bagaimana Neural Network Belajar",
  question: "Bagaimana mesin menjadi lebih baik pada suatu tugas tanpa diberi tahu aturannya?",
  summary:
    "Neural network membuat tebakan, mengukur seberapa salah tebakan itu, lalu menyesuaikan jutaan bobot internalnya agar tidak terlalu salah di lain kali — diulang sampai tebakannya berguna.",
  tags: ["gradient descent", "backpropagation", "training", "inference"],
  levels: {
    1: {
      lede: "Kamu tidak memprogram neural network dengan aturan. Kamu menunjukkan contoh, lalu membiarkannya menyesuaikan diri.",
      blocks: [
        {
          type: "p",
          text: "Software tradisional berkata 'jika begini, maka begitu'. Neural network justru punya jutaan angka yang bisa disesuaikan. Training adalah proses menggeser angka-angka itu sedikit demi sedikit sampai outputnya sesuai dengan yang kamu inginkan.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Lapisan-lapisan unit sederhana",
          text: "Setiap neuron menerima beberapa input, menimbangnya, menambahkan bias, lalu meneruskan hasilnya melalui fungsi sederhana. Kecerdasannya muncul dari seberapa banyak unit itu ditumpuk dan dihubungkan.",
        },
      ],
    },
    2: {
      lede: "Training bergantian antara forward pass yang membuat prediksi dan backward pass yang membagi kesalahannya.",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Forward", text: "Data mengalir melalui lapisan-lapisan dan menghasilkan prediksi." },
            { title: "Loss", text: "Prediksi dibandingkan dengan jawaban yang diharapkan." },
            { title: "Backward", text: "Gradient menunjukkan seberapa besar tiap bobot menyumbang pada error." },
            { title: "Update", text: "Setiap bobot digeser ke arah yang mengurangi error." },
          ],
        },
        {
          type: "p",
          text: "Ulangi ini pada jutaan contoh dan jaringan perlahan menemukan pola yang memisahkan jawaban baik dari yang buruk.",
        },
      ],
    },
    3: {
      lede: "Gradient descent mengikuti kemiringan permukaan loss, dan learning rate menentukan seberapa jauh tiap langkahnya.",
      blocks: [
        {
          type: "p",
          text: "Backpropagation menghitung gradient loss terhadap setiap bobot menggunakan chain rule. Optimizer lalu mengambil satu langkah. Learning rate yang terlalu besar melampaui target dan bisa divergen; terlalu kecil dan training berjalan sangat lama.",
        },
        {
          type: "stats",
          items: [
            { label: "Parameter umum", value: "10 juta – 1 triliun" },
            { label: "Token training", value: ">10 triliun", note: "model besar modern" },
            { label: "Presisi", value: "bf16 / fp8", note: "presisi campuran" },
            { label: "Operasi per token", value: "~2 x parameter" },
          ],
        },
      ],
    },
    4: {
      lede: "Praktik modern adalah sekumpulan teknik stabilitas: optimizer adaptif, regularisasi, dan pilihan arsitektur yang menjaga gradient tetap berperilaku baik.",
      blocks: [
        {
          type: "p",
          text: "Optimizer adaptif menyimpan estimasi skala per parameter sehingga bobot yang jarang diperbarui tetap mengambil langkah yang berarti. Lapisan normalisasi menjaga aktivasi tetap di rentang yang sehat, dan residual connection memberi gradient jalur pendek untuk kembali melewati jaringan yang sangat dalam.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Overfitting vs generalisasi",
          text: "Sebuah model bisa menghafal data training-nya dan tetap gagal pada hal baru. Regularisasi, augmentasi data, dan validation set yang disisihkan ada untuk memisahkan pembelajaran yang sejati dari sekadar penghafalan.",
        },
        {
          type: "compare",
          left: { title: "Training", items: ["Forward plus backward pass", "Bobot diperbarui", "Mahal", "Offline, sekali saja"] },
          right: { title: "Inference", items: ["Hanya forward pass", "Bobot dibekukan", "Jauh lebih murah", "Setiap permintaan"] },
        },
      ],
    },
  },
  sim2d: {
    nodes: {
      data: { label: "Data Training", sub: "contoh + label", desc: "Contoh nyata yang dipasangkan dengan jawaban yang benar. Kualitas pasangan ini menetapkan batas atas apa yang bisa dipelajari model." },
      input: { label: "Lapisan Input", sub: "fitur mentah", desc: "Menerima representasi mentah dari input, entah piksel, token, atau hasil pengukuran." },
      hidden1: { label: "Lapisan Hidden 1", sub: "jumlah terbobot", desc: "Tiap unit menimbang input-nya, menambahkan bias, dan menerapkan nonlinearitas. Menumpuk unit seperti ini memungkinkan jaringan merepresentasikan fungsi yang rumit." },
      hidden2: { label: "Lapisan Hidden 2", sub: "abstraksi", desc: "Lapisan berikutnya menggabungkan fitur sebelumnya menjadi konsep tingkat lebih tinggi — tepi menjadi bentuk, bentuk menjadi objek." },
      output: { label: "Output", sub: "prediksi", desc: "Aktivasi lapisan terakhir ditafsirkan sebagai prediksi, skor kelas, atau token berikutnya." },
      loss: { label: "Fungsi Loss", sub: "seberapa salah?", desc: "Satu angka yang mengukur jarak antara prediksi dan kebenaran. Training ada untuk mengecilkan angka ini." },
      optim: { label: "Optimizer", sub: "geser bobotnya", desc: "Menggunakan gradient untuk menentukan seberapa jauh dan ke arah mana tiap bobot digerakkan. Inilah langkah pembelajarannya." },
      back: { label: "Backpropagation", sub: "menyalahkan lewat chain rule", desc: "Merambatkan loss ke belakang melalui lapisan-lapisan, menghitung seberapa besar tiap bobot menyumbang pada error." },
    },
    edges: {
      "data->input": { label: "batch" },
      "input->hidden1": { label: "aktivasi" },
      "hidden2->output": { label: "forward pass" },
      "output->loss": { label: "bandingkan" },
      "loss->optim": { label: "gradient" },
      "optim->hidden2": { label: "update" },
      "loss->back": { label: "chain rule" },
    },
    steps: {
      forward: { title: "1 · Forward Pass", short: "Forward", description: "Sekumpulan contoh mengalir dari lapisan input melewati setiap lapisan hidden untuk menghasilkan prediksi.", value: "batch berisi 256" },
      loss: { title: "2 · Ukur Error-nya", short: "Loss", description: "Prediksi dibandingkan dengan jawaban yang diketahui dan diringkas menjadi satu nilai loss.", value: "loss = 0.42" },
      backprop: { title: "3 · Backpropagate", short: "Backprop", description: "Gradient loss dihitung untuk setiap bobot, bekerja mundur dari output ke input.", value: "gradient untuk 10M bobot" },
      update: { title: "4 · Update & Ulangi", short: "Update", description: "Optimizer menggeser setiap bobot ke arah yang mengurangi loss, dan seluruh siklus dimulai lagi dengan batch baru.", value: "ukuran langkah = 0.0001" },
    },
  },
  model3d: {
    hotspots: {
      layers: { label: "Tumpukan lapisan", detail: "Lapisan-lapisan unit sederhana yang berurutan. Kedalaman memungkinkan jaringan membangun abstraksi di atas abstraksi." },
      weights: { label: "Matriks bobot", detail: "Angka-angka yang dipelajari. Semua yang diketahui model tersimpan di sini." },
      activations: { label: "Fungsi aktivasi", detail: "Nonlinearitas yang membuat penumpukan lapisan bermakna. Hilangkan itu dan jaringan runtuh menjadi satu peta linear." },
      memory: { label: "Memori akselerator", detail: "Bobot harus berada di memori yang sangat cepat agar training efisien — sering kali inilah hambatan sebenarnya." },
    },
  },
};

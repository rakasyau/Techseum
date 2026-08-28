export type Language = "id" | "en";

export interface Translations {
  nav: {
    explore: string;
    howItWorks: string;
    lab: string;
    challenges: string;
    leaderboard: string;
    about: string;
    login: string;
    logout: string;
    myPass: string;
    switchTheme: string;
  };
  hero: {
    headlineLine1: string;
    headlineLine2: string;
    headlineLine3: string;
    subtitle: string;
    startExploring: string;
    watchDemo: string;
    topicsCount: string;
    simsCount: string;
    learnersCount: string;
  };
  featured: {
    title: string;
    subtitle: string;
    seeAll: string;
  };
  categories: {
    all: string;
    computing: string;
    networking: string;
    electronics: string;
    everyday: string;
    modern: string;
  };
  levels: {
    all: string;
    simple: string;
    beginner: string;
    technical: string;
    deepDive: string;
  };
  explore: {
    kicker: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    showingCount: string;
    mastered: string;
    learners: string;
  };
  topicDetail: {
    directory: string;
    markMastered: string;
    masteredReward: string;
    bookmark: string;
    bookmarked: string;
    audioGuide: string;
    audioListening: string;
    simTitle: string;
    simKicker: string;
    sim2D: string;
    sim3D: string;
    depthTitle: string;
    depthKicker: string;
    targetAudience: string;
    keyTakeaways: string;
    verifyAnswer: string;
    tryAgain: string;
    relatedTitle: string;
    exploreExhibit: string;
    mustLoginTitle: string;
    mustLoginSubtitle: string;
    loginToAccess: string;
  };
  lab: {
    kicker: string;
    title: string;
    subtitle: string;
    electronics: string;
    camera: string;
    network: string;
  };
  challenges: {
    kicker: string;
    title: string;
    subtitle: string;
    currentLevel: string;
    totalXp: string;
    dailyStreak: string;
    badgesTitle: string;
    collected: string;
    exhibitsTitle: string;
    launchChallenge: string;
  };
  leaderboard: {
    kicker: string;
    title: string;
    subtitle: string;
    thisWeek: string;
    allTime: string;
    rank: string;
    explorer: string;
    topCategory: string;
    streak: string;
    totalXp: string;
  };
  scenarios: {
    kicker: string;
    phases: string;
    underTheHood: string;
    readyToExplore: string;
    exploreDns: string;
    exploreCpu: string;
    notFoundTitle: string;
    returnCatalog: string;
  };
  footer: {
    newsletterTitle: string;
    newsletterDesc: string;
    subscribe: string;
    subscribing: string;
    newsletterSuccess: string;
    newsletterAlready: string;
    newsletterInvalid: string;
    newsletterError: string;
    brandDesc: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  id: {
    nav: {
      explore: "Eksplorasi",
      howItWorks: "Cara Kerja Web",
      lab: "Laboratorium",
      challenges: "Tantangan",
      leaderboard: "Peringkat",
      about: "Tentang",
      login: "Masuk Museum",
      logout: "Keluar",
      myPass: "Tiket Museum",
      switchTheme: "Ganti Tema",
    },
    hero: {
      headlineLine1: "Pahami",
      headlineLine2: "Cara Kerja Teknologi",
      headlineLine3: "Yang Sebenarnya",
      subtitle: "Lihat. Pahami. Jelajahi — dari arsitektur CPU hingga gelombang Wi-Fi dan Jaringan Syaraf Tiruan AI.",
      startExploring: "Mulai Eksplorasi",
      watchDemo: "Lihat Demo Interaktif",
      topicsCount: "50+ Topik Eksibit",
      simsCount: "120+ Simulasi Visual",
      learnersCount: "10K+ Penjelajah Aktif",
    },
    featured: {
      title: "Eksibit Pilihan",
      subtitle: "Jelajahi teknologi paling populer dengan simulasi interaktif mendalam",
      seeAll: "Lihat Semua Eksibit →",
    },
    categories: {
      all: "Semua Eksibit",
      computing: "Komputasi",
      networking: "Jaringan",
      electronics: "Elektronika",
      everyday: "Teknologi Harian",
      modern: "Teknologi Modern",
    },
    levels: {
      all: "Semua Tingkat",
      simple: "Sederhana",
      beginner: "Pemula",
      technical: "Teknis",
      deepDive: "Mendalam",
    },
    explore: {
      kicker: "Katalog & Direktori Eksibit",
      title: "Jelajahi Eksibit Teknologi",
      subtitle: "Telusuri 11+ eksibit teknologi interaktif. Selami mikroarsitektur, gelombang RF, dan sirkuit silikon sesuai kecepatan belajarmu.",
      searchPlaceholder: "Cari topik eksibit (misal: CPU, Wi-Fi, Kamera, GPU, Baterai)...",
      showingCount: "Menampilkan",
      mastered: "Dikuasai",
      learners: "penjelajah",
    },
    topicDetail: {
      directory: "Direktori Museum",
      markMastered: "Tandai Selesai (+50 XP)",
      masteredReward: "Eksibit Dikuasai (+50 XP)",
      bookmark: "Simpan Eksibit",
      bookmarked: "Tersimpan",
      audioGuide: "Panduan Suara",
      audioListening: "Mendengarkan...",
      simTitle: "Mesin Simulasi Langsung",
      simKicker: "Visualisasi Eksibit Interaktif",
      sim2D: "Diagram Alur 2D",
      sim3D: "Model Spasial 3D",
      depthTitle: "Pilih Tingkat Kedalaman",
      depthKicker: "Kurasi Tingkat Pemahaman",
      targetAudience: "Sasaran Pembaca:",
      keyTakeaways: "Poin Kunci Utama",
      verifyAnswer: "Verifikasi Jawaban",
      tryAgain: "Coba Lagi",
      relatedTitle: "Eksibit Terkait Lainnya",
      exploreExhibit: "Jelajahi eksibit",
      mustLoginTitle: "Akses Eksibit Terkunci",
      mustLoginSubtitle: "Silakan masuk dengan Akun Museum Pass Anda untuk mengakses simulasi interaktif, materi mendalam, dan tantangan XP.",
      loginToAccess: "Masuk Sekarang untuk Membuka",
    },
    lab: {
      kicker: "Lokakarya Fisika & Sistem Interaktif",
      title: "Laboratorium Virtual Techseum",
      subtitle: "Workbench virtual hands-on. Sesuaikan variabel fisik secara langsung dan saksikan hukum dasar komputasi, listrik, dan optik bekerja.",
      electronics: "Lab Elektronika",
      camera: "Lab Optik Kamera",
      network: "Lab Paket Jaringan",
    },
    challenges: {
      kicker: "Verifikasi Pemahaman Gamifikasi",
      title: "Tantangan & Penguasaan Eksibit",
      subtitle: "Uji model mental komputasi, sinyal RF, dan fisika silikon Anda. Kumpulkan XP, pertahankan streak harian, dan raih lencana arsitek.",
      currentLevel: "Level Saat Ini",
      totalXp: "Total Pengalaman",
      dailyStreak: "Streak Harian",
      badgesTitle: "Artefak & Lencana Terbuka",
      collected: "Lencana Terkumpul",
      exhibitsTitle: "Tantangan Mini Eksibit",
      launchChallenge: "Buka Tantangan",
    },
    leaderboard: {
      kicker: "Aula Kehormatan Komunitas",
      title: "Papan Peringkat Global & Mingguan",
      subtitle: "Penjelajah teratas yang memajukan pemahaman arsitektur komputasi, jaringan RF, dan fisika semikonduktor.",
      thisWeek: "Minggu Ini",
      allTime: "Sepanjang Masa",
      rank: "Peringkat",
      explorer: "Penjelajah",
      topCategory: "Kategori Unggulan",
      streak: "Streak",
      totalXp: "Total XP",
    },
    scenarios: {
      kicker: "Skenario Eksplorasi Mendalam Mikrodetik",
      phases: "Tahap Arsitektur",
      underTheHood: "Di Balik Layar (Teknis):",
      readyToExplore: "Siap menjelajahi teknologi pendukungnya?",
      exploreDns: "Jelajahi Eksibit DNS →",
      exploreCpu: "Jelajahi Pipeline CPU →",
      notFoundTitle: "Panduan Skenario Tidak Ditemukan",
      returnCatalog: "← Kembali ke Katalog Museum",
    },
    footer: {
      newsletterTitle: "Dapatkan eksibit baru setiap minggu",
      newsletterDesc: "Tetap penasaran. Kami akan mengirimkan eksibit interaktif dan tantangan terbaru langsung ke email Anda.",
      subscribe: "Berlangganan",
      subscribing: "Memproses...",
      newsletterSuccess: "✓ Berhasil Berlangganan! Topik eksibit baru akan dikirimkan ke email Anda setiap minggu.",
      newsletterAlready: "✓ Email Anda sudah terdaftar dalam buletin mingguan Techseum.",
      newsletterInvalid: "Masukkan format email yang valid (contoh: nama@domain.com).",
      newsletterError: "Gagal memproses langganan. Silakan coba lagi.",
      brandDesc: "Museum teknologi digital interaktif tempat Anda dapat melihat, memvisualisasikan, dan memahami cara kerja teknologi.",
      copyright: "Hak Cipta Dilindungi. Dibuat untuk pikiran yang ingin tahu.",
    },
  },
  en: {
    nav: {
      explore: "Explore",
      howItWorks: "How Web Works",
      lab: "Laboratory",
      challenges: "Challenges",
      leaderboard: "Leaderboard",
      about: "About",
      login: "Museum Pass",
      logout: "Log Out",
      myPass: "My Pass",
      switchTheme: "Toggle Theme",
    },
    hero: {
      headlineLine1: "Discover",
      headlineLine2: "How Technology",
      headlineLine3: "Really Works",
      subtitle: "See it. Understand it. Explore it — from CPU microarchitectures to Wi-Fi waves and Neural Networks.",
      startExploring: "Start Exploring",
      watchDemo: "Watch Interactive Demo",
      topicsCount: "50+ Topic Exhibits",
      simsCount: "120+ Visual Simulations",
      learnersCount: "10K+ Active Explorers",
    },
    featured: {
      title: "Featured Exhibits",
      subtitle: "Step inside our most popular interactive technology deep dives",
      seeAll: "View All Exhibits →",
    },
    categories: {
      all: "All Exhibits",
      computing: "Computing",
      networking: "Networking",
      electronics: "Electronics",
      everyday: "Everyday Tech",
      modern: "Modern Tech",
    },
    levels: {
      all: "All Levels",
      simple: "Simple",
      beginner: "Beginner",
      technical: "Technical",
      deepDive: "Deep Dive",
    },
    explore: {
      kicker: "Museum Catalog & Directory",
      title: "Explore Technology Exhibits",
      subtitle: "Walk through 11+ interactive technology exhibits. Dive into microarchitectures, RF waveforms, and silicon circuits at your pace.",
      searchPlaceholder: "Search exhibits (e.g. CPU, Wi-Fi, Camera, GPU, Battery)...",
      showingCount: "Showing",
      mastered: "Mastered",
      learners: "explorers",
    },
    topicDetail: {
      directory: "Museum Directory",
      markMastered: "Mark as Mastered (+50 XP)",
      masteredReward: "Exhibit Mastered (+50 XP)",
      bookmark: "Bookmark Exhibit",
      bookmarked: "Bookmarked",
      audioGuide: "Audio Guide",
      audioListening: "Listening...",
      simTitle: "Live Simulation Engine",
      simKicker: "Interactive Exhibit Visualization",
      sim2D: "2D State Diagram",
      sim3D: "3D Spatial Model",
      depthTitle: "Choose Your Level of Depth",
      depthKicker: "Curated Learning Depth",
      targetAudience: "Target Audience:",
      keyTakeaways: "Key Takeaways",
      verifyAnswer: "Verify Answer",
      tryAgain: "Try Again",
      relatedTitle: "Related Technology Exhibits",
      exploreExhibit: "Explore exhibit",
      mustLoginTitle: "Exhibit Access Locked",
      mustLoginSubtitle: "Please sign in with your Museum Pass account to explore interactive simulations, deep dive content, and earn XP.",
      loginToAccess: "Sign In Now to Unlock",
    },
    lab: {
      kicker: "Interactive Physics & System Workshops",
      title: "The Techseum Laboratory",
      subtitle: "Hands-on virtual workbenches. Adjust physical variables in real-time and witness fundamental laws of computing, electricity, and optics in action.",
      electronics: "Electronics Lab",
      camera: "Camera Optics Lab",
      network: "Network Packet Lab",
    },
    challenges: {
      kicker: "Gamified Skill Verification",
      title: "Museum Challenges & Mastery",
      subtitle: "Test your mental model of computing, RF signals, and silicon physics. Earn XP, build daily streaks, and unlock architectural badges.",
      currentLevel: "Current Level",
      totalXp: "Total Experience",
      dailyStreak: "Daily Streak",
      badgesTitle: "Unlocked Artifacts & Badges",
      collected: "Badges Collected",
      exhibitsTitle: "Exhibit Mini-Challenges",
      launchChallenge: "Launch Challenge",
    },
    leaderboard: {
      kicker: "Community Hall of Fame",
      title: "Global & Weekly Leaderboard",
      subtitle: "Top explorers advancing their mental models across computing architectures, RF networks, and semiconductor physics.",
      thisWeek: "This Week",
      allTime: "All-Time",
      rank: "Rank",
      explorer: "Explorer",
      topCategory: "Top Category",
      streak: "Streak",
      totalXp: "Total XP",
    },
    scenarios: {
      kicker: "Microsecond Deep-Dive Scenario",
      phases: "Architecture Phases",
      underTheHood: "Under the Hood:",
      readyToExplore: "Ready to explore the underlying technologies?",
      exploreDns: "Explore DNS Exhibit →",
      exploreCpu: "Explore CPU Pipeline →",
      notFoundTitle: "Scenario Walkthrough Not Found",
      returnCatalog: "← Return to Museum Catalog",
    },
    footer: {
      newsletterTitle: "Get new topics every week",
      newsletterDesc: "Stay curious. We will send you the latest exhibits and challenges.",
      subscribe: "Subscribe",
      subscribing: "Subscribing...",
      newsletterSuccess: "✓ Subscribed! You will receive new topics every week.",
      newsletterAlready: "✓ You are already subscribed to the Techseum weekly newsletter.",
      newsletterInvalid: "Please enter a valid email address (e.g. name@domain.com).",
      newsletterError: "Failed to process subscription. Please try again.",
      brandDesc: "An interactive digital technology museum where you can explore, visualize, and understand how technology works.",
      copyright: "All Rights Reserved. Built for curious minds.",
    },
  },
};

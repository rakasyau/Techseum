import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageProvider } from "@/components/language-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { DICTIONARIES } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Techseum — Discover How Technology Really Works",
    template: "%s · Techseum",
  },
  description:
    "An interactive technology museum. Explore CPU, Wi-Fi, cameras, SSDs and AI through 2D diagrams, 3D models, live simulations and challenges.",
  keywords: [
    "how does it work",
    "technology explained",
    "interactive learning",
    "CPU",
    "Wi-Fi",
    "neural networks",
    "3D visualization",
  ],
  openGraph: {
    title: "Techseum — Discover How Technology Really Works",
    description: "See it. Understand it. Explore it — from CPU to Wi-Fi to AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0B" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The language cookie is read on the server so the first paint is already
  // in the right language, with no flash of English.
  const cookieLocale = cookies().get("techseum_lang")?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const dict = DICTIONARIES[locale];

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider initialLocale={locale}>
            <AuthProvider>
              <a
                href="#main"
                className="sr-only rounded-full bg-ink px-4 py-2 text-sm text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
              >
                {dict.common.skipToContent}
              </a>
              <SiteHeader />
              <main id="main">{children}</main>
              <SiteFooter />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

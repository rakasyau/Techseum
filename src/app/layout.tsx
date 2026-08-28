import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserProgressProvider } from "@/context/UserProgressContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Techseum — Discover How Technology Really Works",
  description:
    "An interactive technology museum where you can explore, visualize, and understand how everyday technology works — from CPU to Wi-Fi to AI. See it. Understand it. Explore it.",
  keywords: [
    "technology education",
    "interactive learning",
    "CPU",
    "Wi-Fi",
    "how technology works",
    "digital museum",
    "tech visualization",
  ],
  openGraph: {
    title: "Techseum — Discover How Technology Really Works",
    description:
      "An interactive technology museum. Explore 50+ topics with 2D/3D visualizations and hands-on simulations.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700,800&f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <ThemeProvider>
            <UserProgressProvider>{children}</UserProgressProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

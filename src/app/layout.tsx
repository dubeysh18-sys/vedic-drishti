import type { Metadata } from "next";
import { DM_Sans, Literata, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AudioProvider } from "@/context/audio-context";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Drishti — Modern Vedic Reflection Companion",
  description: "Timeless perspectives from the Bhagavad Gita for navigating modern life with equanimity and clarity.",
  keywords: ["Vedic Wisdom", "Bhagavad Gita", "Reflection", "Mindfulness", "Philosophy", "Equanimity", "Drishti"],
  authors: [{ name: "Drishti Team" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${literata.variable} ${notoDevanagari.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans relative overflow-x-hidden selection:bg-secondary-container selection:text-on-secondary-container">
        {/* Background Decorative Lotus Motifs */}
        <div className="fixed top-24 -left-12 opacity-5 pointer-events-none transform -rotate-12 z-0">
          <svg width="220" height="220" viewBox="0 0 100 100" fill="none" stroke="#D4AF37" strokeWidth="1.5">
            <path d="M50 85 C30 75 20 55 20 40 C20 25 35 15 50 15 C65 15 80 25 80 40 C80 55 70 75 50 85 Z" />
            <path d="M50 85 C40 70 35 55 35 45 C35 35 42 25 50 25 C58 25 65 35 65 45 C65 55 60 70 50 85 Z" />
            <path d="M50 85 C46 75 44 60 44 50 C44 40 47 30 50 30 C53 30 56 40 56 50 C56 60 54 75 50 85 Z" />
          </svg>
        </div>
        <div className="fixed bottom-36 -right-16 opacity-5 pointer-events-none transform rotate-12 z-0">
          <svg width="260" height="260" viewBox="0 0 100 100" fill="none" stroke="#735c00" strokeWidth="1.5">
            <path d="M50 85 C30 75 20 55 20 40 C20 25 35 15 50 15 C65 15 80 25 80 40 C80 55 70 75 50 85 Z" />
            <path d="M50 85 C40 70 35 55 35 45 C35 35 42 25 50 25 C58 25 65 35 65 45 C65 55 60 70 50 85 Z" />
            <path d="M50 85 C46 75 44 60 44 50 C44 40 47 30 50 30 C53 30 56 40 56 50 C56 60 54 75 50 85 Z" />
          </svg>
        </div>

        <AudioProvider>
          <Header />
          <main className="flex-1 z-10 flex flex-col">{children}</main>
          <Footer />
        </AudioProvider>
      </body>
    </html>
  );
}

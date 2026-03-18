import type { Metadata } from "next";
import { Oswald, Bebas_Neue, Inter, Source_Sans_3, Racing_Sans_One } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/navigation/MobileNav";
import MobileTopHeader from "@/components/navigation/MobileTopHeader";
import DesktopNav from "@/components/navigation/DesktopNav";
import ToastProvider from "@/components/ToastProvider";
import Footer from "@/components/Footer";
import Script from "next/script";
import { ConfirmationProvider } from "@/context/ConfirmationContext";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const racingSansOne = Racing_Sans_One({
  variable: "--font-racing",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "Mancave Barbershops | High Performance Haircuts",
    template: "%s | Mancave Barbershops"
  },
  description: "Experience high-performance grooming at Mancave Barbershops. Engineered for speed and precision with an automotive performance theme.",
  keywords: ["barbershop", "mancave", "performance haircuts", "automotive theme", "grooming garage", "precision grooming", "tuning shop"],
  authors: [{ name: "Mancave Barbershops" }],
  creator: "Mancave Barbershops",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mancavebarbershops.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Mancave Barbershops",
    title: "Mancave Barbershops | High Performance Haircuts",
    description: "High speed, high precision grooming at Mancave Barbershops. Engineered for the modern driver.",
    images: [
      {
        url: "/images/high-performance-haircuts-branded-design.png",
        width: 1200,
        height: 630,
        alt: "Mancave Barbershops",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mancave Barbershops | High Performance Haircuts",
    description: "High speed, high precision grooming at Mancave Barbershops. Engineered for the modern driver.",
    images: ["/images/high-performance-haircuts-branded-design.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${oswald.variable} ${bebasNeue.variable} ${inter.variable} ${sourceSans3.variable} ${racingSansOne.variable} antialiased overflow-x-hidden bg-obsidian`}
      >
        <ConfirmationProvider>
          <DesktopNav />
          <MobileTopHeader />
          <ToastProvider />
          <div className="min-h-screen">
            {children}
          </div>
          <Script src="https://now-hiring-eta.vercel.app/widget.js" strategy="afterInteractive" data-icon="Scissors" />
          <Footer />
          <MobileNav />
        </ConfirmationProvider>
      </body>
    </html>
  );
}

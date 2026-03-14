import type { Metadata } from "next";
import { Oswald, Bebas_Neue, Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/navigation/MobileNav";
import MobileTopHeader from "@/components/navigation/MobileTopHeader";
import DesktopNav from "@/components/navigation/DesktopNav";
import ToastProvider from "@/components/ToastProvider";
import Footer from "@/components/Footer";
import Script from "next/script";

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

export const metadata: Metadata = {
  title: {
    default: "Membership Barbershop | Exclusive Grooming & Lounge",
    template: "%s | Membership Barbershop"
  },
  description: "Experience precision fast haircuts and lounge-level luxury. Join our exclusive membership for bespoke grooming, private suites, and curated artisan services.",
  keywords: ["barbershop", "membership barbershop", "luxury haircut", "private barbershop", "grooming lounge", "artisan barbers", "bespoke grooming"],
  authors: [{ name: "Membership Barbershop" }],
  creator: "Membership Barbershop",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://membershipbarbershop.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Membership Barbershop",
    title: "Membership Barbershop | Exclusive Grooming & Lounge",
    description: "Precision Fast. Lounge-Level Luxury. Join the circle of precision with our exclusive membership tiers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Membership Barbershop - Exclusive Grooming Lounge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Membership Barbershop | Exclusive Grooming & Lounge",
    description: "Precision Fast. Lounge-Level Luxury. Join the circle of precision.",
    images: ["/og-image.png"],
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
        className={`${oswald.variable} ${bebasNeue.variable} ${inter.variable} ${sourceSans3.variable} antialiased overflow-x-hidden`}
      >
        <DesktopNav />
        <MobileTopHeader />
        <ToastProvider />
        {children}
        <Script src="https://now-hiring-eta.vercel.app/widget.js" strategy="afterInteractive" />
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}

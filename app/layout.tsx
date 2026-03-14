import type { Metadata } from "next";
import { Oswald, Bebas_Neue, Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/navigation/MobileNav";
import MobileTopHeader from "@/components/navigation/MobileTopHeader";
import DesktopNav from "@/components/navigation/DesktopNav";

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
  title: "Membership Barbershop",
  description: "Precision Fast. Lounge-Level Luxury.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${bebasNeue.variable} ${inter.variable} ${sourceSans3.variable} antialiased`}
      >
        <DesktopNav />
        <MobileTopHeader />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";

export default function MobileTopHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-slate/95 backdrop-blur-xl border-b border-gold-champagne/20">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain flex-shrink-0"
          />
          <div>
            <h1 className="font-display text-lg font-bold text-bone leading-tight">
              Membership Barbershop
            </h1>
            <p className="text-xs text-gold-champagne leading-tight">
              Pit-Stop Fast. Lounge-Level Luxury.
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

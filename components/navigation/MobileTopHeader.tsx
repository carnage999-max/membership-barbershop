"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/hooks";
import { User as UserIcon, LogIn } from "lucide-react";

export default function MobileTopHeader() {
  const { user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-obsidian/95 backdrop-blur-xl border-b border-gold-champagne/20">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-auto object-contain flex-shrink-0"
          />
          <div>
            <h1 className="font-display text-sm font-bold text-bone leading-tight">
              Membership Barbershop
            </h1>
            <p className="text-[10px] text-gold-champagne leading-tight font-medium uppercase tracking-wider">
              Luxury Garage
            </p>
          </div>
        </Link>

        <div className="flex items-center">
          {user ? (
            <Link
              href="/account"
              className="p-2 rounded-full bg-gold-champagne/10 border border-gold-champagne/30 text-gold-champagne"
            >
              <UserIcon className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-crimson text-bone text-xs font-bold rounded-lg shadow-lg shadow-red-crimson/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

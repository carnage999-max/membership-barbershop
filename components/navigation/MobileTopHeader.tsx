"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/hooks";
import { User as UserIcon, LogIn } from "lucide-react";

export default function MobileTopHeader() {
  const { user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-obsidian border-b border-white/5 shadow-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/new-logo.png"
            alt="Man Cave"
            width={120}
            height={40}
            className="h-8 w-auto object-contain flex-shrink-0"
          />
          <div className="flex flex-col justify-center">
            <span className="font-display text-xl font-black text-white italic tracking-tighter leading-[0.8]">
              MAN CAVE
            </span>
            <span className="text-[8px] font-black text-neon-red italic tracking-[0.2em] mt-0.5">
              BARBER SHOPS
            </span>
          </div>
        </Link>

        <div className="flex items-center">
          {user ? (
            <Link
              href="/account"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-chrome"
            >
              <UserIcon className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 bg-neon-red text-white text-[10px] font-black uppercase italic tracking-widest rounded-lg shadow-neon-red"
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

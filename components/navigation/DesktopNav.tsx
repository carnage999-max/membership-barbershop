"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { User as UserIcon, LogIn } from "lucide-react";

import { useUser } from "@/lib/hooks";

const navItems = [
  { href: "/locations", label: "Garages" },
  { href: "/membership", label: "Performance Grades" },
  { href: "/book", label: "Book a Cut" },
  { href: "/stylists", label: "Technicians" },
  { href: "/shop-experience", label: "The Parts Shop" },
];

export default function DesktopNav() {
  const pathname = usePathname();
  const { user, isAdmin } = useUser();

  return (
    <nav className="hidden md:flex items-center justify-between px-6 lg:px-12 py-5 bg-obsidian border-b border-white/5 sticky top-0 z-50 backdrop-blur-2xl bg-obsidian/95 shadow-2xl">
      <Link href="/" className="flex items-center gap-3 group">
        <Image
          src="/images/new-logo.png"
          alt="Man Cave Logo"
          width={180}
          height={60}
          className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
        />
        <div className="flex flex-col justify-center">
          <span className="font-display text-2xl lg:text-3xl font-black text-white italic tracking-tighter leading-[0.8] group-hover:text-neon-red transition-colors duration-300">
            MAN CAVE
          </span>
          <span className="text-[10px] font-black text-neon-red italic tracking-[0.3em] mt-1">
            BARBER SHOPS
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        {[
          ...navItems,
          ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : [])
        ].map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-5 py-2 rounded-lg font-display text-sm font-black uppercase italic tracking-widest transition-all duration-300 ${
                isActive
                  ? "text-neon-red"
                  : "text-chrome hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDesktopNav"
                  className="absolute bottom-0 left-5 right-5 h-0.5 bg-neon-red shadow-neon-red"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <Link
            href="/account"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-chrome hover:bg-white/10 hover:text-white transition-all duration-300 group/acc"
          >
            <UserIcon className="w-4 h-4 group-hover:text-neon-red transition-colors" />
            <span className="text-xs font-black uppercase italic tracking-widest truncate max-w-[100px]">
              {user.firstName || "Driver"}
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="relative flex items-center gap-2 px-8 py-2.5 bg-neon-red hover:bg-racing-red text-white font-display text-sm font-black uppercase italic tracking-widest rounded-xl transition-all duration-300 shadow-neon-red group/login overflow-hidden"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover/login:translate-x-[250%] transition-transform duration-700" />
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}


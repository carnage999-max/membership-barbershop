"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { User as UserIcon, LogIn } from "lucide-react";

import { useUser } from "@/lib/hooks";

const navItems = [
  { href: "/locations", label: "Locations" },
  { href: "/membership", label: "Membership Barbershop" },
  { href: "/services", label: "Services" },
  { href: "/stylists", label: "The Crew" },
  { href: "/wait", label: "Waitlist" },
  { href: "/shop-experience", label: "Shop Experience" },
  { href: "/gift", label: "Gift" },
];

export default function DesktopNav() {
  const pathname = usePathname();
  const { user, isAdmin } = useUser();

  return (
    <nav className="hidden md:flex items-center justify-between px-6 lg:px-12 py-4 bg-obsidian border-b border-gold-champagne/20 sticky top-0 z-50 backdrop-blur-xl bg-obsidian/95">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={40}
          className="h-8 w-auto"
        />
      </Link>

      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150 ${
                isActive
                  ? "text-gold-champagne"
                  : "text-bone/70 hover:text-bone"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDesktopNav"
                  className="absolute inset-0 bg-gold-champagne/10 rounded-lg border border-gold-champagne/30"
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
        {isAdmin && (
          <Link
            href="/admin"
            className={`relative px-4 py-2 rounded-lg font-bold text-sm text-gold-champagne hover:bg-gold-champagne/10 transition-colors duration-150`}
          >
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <Link
            href="/account"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-champagne/10 border border-gold-champagne/30 text-gold-champagne hover:bg-gold-champagne/20 transition-all duration-150"
          >
            <UserIcon className="w-4 h-4" />
            <span className="text-sm font-bold truncate max-w-[100px]">
              {user.firstName || "Profile"}
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-2 bg-red-crimson hover:bg-red-crimson/90 text-bone font-bold rounded-lg transition-all duration-150 text-sm shadow-lg shadow-red-crimson/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}


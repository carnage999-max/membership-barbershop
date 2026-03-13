"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Calendar, Crown, User, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { tokenStorage } from "@/lib/api-client";

const baseNavItems = [
  { href: "/locations", icon: MapPin, label: "Map" },
  { href: "/wait", icon: Clock, label: "Wait" },
  { href: "/book", icon: Calendar, label: "Book" },
  { href: "/membership", icon: Crown, label: "Membership" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount and when pathname changes
    const token = tokenStorage.get();
    setIsAuthenticated(!!token);
  }, [pathname]);

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 px-4 py-3 bg-slate/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-gold-champagne/20"
      >
        {/* Logo on the left */}
        <Link
          href="/"
          className={`relative flex items-center justify-center w-14 h-14 transition-all duration-150 mr-1 border-2 rounded-2xl ${
            isHomePage ? "border-red-crimson bg-red-crimson/10" : "border-wood-espresso/50 bg-wood-espresso/10"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </Link>

        {/* Vertical divider */}
        <div className="w-px h-10 bg-gold-champagne/20" />

        {/* Navigation items */}
        {baseNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-150"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-obsidian rounded-2xl border-2 border-gold-champagne"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <Icon
                className={`relative z-10 w-5 h-5 transition-colors duration-150 ${
                  isActive ? "text-gold-champagne" : "text-bone/70"
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium mt-0.5 transition-colors duration-150 ${
                  isActive ? "text-gold-champagne" : "text-bone/50"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Auth-dependent item: Account or Login */}
        {isAuthenticated ? (
          <Link
            href="/account"
            className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-150"
          >
            {pathname?.startsWith("/account") && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 bg-obsidian rounded-2xl border-2 border-gold-champagne"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            <User
              className={`relative z-10 w-5 h-5 transition-colors duration-150 ${
                pathname?.startsWith("/account") ? "text-gold-champagne" : "text-bone/70"
              }`}
            />
            <span
              className={`relative z-10 text-[10px] font-medium mt-0.5 transition-colors duration-150 ${
                pathname?.startsWith("/account") ? "text-gold-champagne" : "text-bone/50"
              }`}
            >
              Account
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-150"
          >
            {pathname?.startsWith("/login") && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 bg-obsidian rounded-2xl border-2 border-gold-champagne"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            <LogIn
              className={`relative z-10 w-5 h-5 transition-colors duration-150 ${
                pathname?.startsWith("/login") ? "text-gold-champagne" : "text-bone/70"
              }`}
            />
            <span
              className={`relative z-10 text-[10px] font-medium mt-0.5 transition-colors duration-150 ${
                pathname?.startsWith("/login") ? "text-gold-champagne" : "text-bone/50"
              }`}
            >
              Login
            </span>
          </Link>
        )}
      </motion.div>
    </nav>
  );
}


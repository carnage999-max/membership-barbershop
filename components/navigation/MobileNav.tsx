"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Calendar, Crown, User, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";

const baseNavItems = [
  { href: "/locations", icon: MapPin, label: "Map" },
  { href: "/membership", icon: Crown, label: "Membership" },
  { href: "/book", icon: Calendar, label: "Book" }, // Reordered slightly for better thumb flow
];

export default function MobileNav() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { user } = useUser();
  const isAuthenticated = !!user;
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setIsFooterVisible(entries[0].isIntersecting);
    }, { threshold: 0.1 });

    const footer = document.getElementById("global-footer");
    if (footer) {
      observer.observe(footer);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-[400px] transition-all duration-300 ${
      isFooterVisible ? "bottom-[-100px] opacity-0" : "bottom-8 opacity-100"
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex items-center justify-around px-2 py-2 bg-obsidian/85 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-champagne/15 ring-1 ring-white/5"
      >

        {/* Navigation items */}
        {baseNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-14 transition-all duration-150"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-x-1 inset-y-0.5 bg-gold-champagne/10 rounded-[2rem] border border-gold-champagne/30"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <Icon
                className={`relative z-10 w-5 h-5 transition-all duration-150 ${
                  isActive ? "text-gold-champagne scale-110" : "text-bone/50 hover:text-bone/80"
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-bold mt-1 tracking-tight transition-colors duration-150 ${
                  isActive ? "text-gold-champagne" : "text-bone/40"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

      </motion.div>
    </nav>
  );
}


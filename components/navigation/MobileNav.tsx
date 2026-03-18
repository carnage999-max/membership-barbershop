"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Zap, Wrench, User, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";

const baseNavItems = [
  { href: "/locations", icon: MapPin, label: "Garages" },
  { href: "/membership", icon: Zap, label: "Performance" },
  { href: "/book", icon: Wrench, label: "Service" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { user, isAdmin } = useUser();

  const navItems = [...baseNavItems];
  if (isAdmin) {
    navItems.push({ href: "/admin", icon: Shield, label: "Admin" });
  }
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
    <nav className={`fixed left-1/2 -translate-x-1/2 z-50 md:hidden w-[95%] max-w-[400px] transition-all duration-300 ${
      isFooterVisible ? "bottom-[-100px] opacity-0" : "bottom-6 opacity-100"
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-around px-2 py-2 bg-obsidian/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10"
      >
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-14"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`relative z-10 w-5 h-5 transition-all duration-300 ${
                  isActive ? "text-neon-red drop-shadow-[0_0_8px_rgba(255,49,49,0.8)]" : "text-chrome/50"
                }`}
              />
              <span
                className={`relative z-10 text-[9px] font-black uppercase italic tracking-widest mt-1.5 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-chrome/40"
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


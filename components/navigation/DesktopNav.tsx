"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/locations", label: "Locations" },
  { href: "/membership", label: "Membership" },
  { href: "/services", label: "Services" },
  { href: "/stylists", label: "Stylists" },
  { href: "/wait", label: "Wait Times" },
  { href: "/shop-experience", label: "Shop Experience" },
  { href: "/gift", label: "Gift" },
];

export default function DesktopNav() {
  const pathname = usePathname();

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
      </div>

      <Link
        href="/account"
        className="px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm"
      >
        Login
      </Link>
    </nav>
  );
}


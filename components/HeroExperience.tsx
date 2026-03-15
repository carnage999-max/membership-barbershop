"use client";

import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { memberships as membershipsApi } from "@/lib/api-client";
import WaitTimeBadge from "./WaitTimeBadge";
import Image from "next/image";
import Link from "next/link";

export default function HeroExperience() {
  const [zipCode, setZipCode] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMinPrice() {
      try {
        const result = await membershipsApi.getPlans();
        if (result.plans && result.plans.length > 0) {
          const prices = result.plans.map((p: any) => p.price);
          setMinPrice(Math.min(...prices));
        }
      } catch (error) {
        console.error("Failed to fetch min price:", error);
      }
    }
    fetchMinPrice();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with dark wood + supercar silhouette effect */}
      <div className="absolute inset-0 bg-wood-espresso">
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/60 to-obsidian/80" />
        <div className="absolute inset-0 opacity-10">
          {/* Subtle pattern/texture */}
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(200,162,74,0.1)_0%,transparent_70%)]" />
        </div>
      </div>

      {/* Gold trim line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-champagne to-transparent" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Headline + Find Shop */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={240}
              height={80}
              className="h-16 md:h-20 w-auto mb-12"
              priority
            />
            <h1 className="font-display text-5xl md:text-7xl font-bold text-bone leading-tight">
              Your Cut.
              <br />
              Your Crew.
              <br />
              <span className="text-gold-champagne">Your Lane.</span>
            </h1>

            <p className="text-bone/70 text-lg max-w-md">
              The high-performance grooming experience. Lamborghini speed. Bugatti luxury.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bone/40" />
                  <input
                    type="text"
                    placeholder="Enter zip code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate/50 backdrop-blur-sm border border-gold-champagne/20 rounded-lg text-bone placeholder:text-bone/40 focus:outline-none focus:border-gold-champagne transition-colors duration-150"
                  />
                </div>
                <button className="px-8 py-4 bg-red-crimson hover:bg-red-crimson/90 text-bone font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap">
                  Find My Shop
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Live Wait + Membership Anchor */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Nearest Wait Tile */}
            <div className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gold-champagne" />
                <h3 className="font-display text-xl font-bold text-bone">
                  Live Status
                </h3>
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-bone/70">Membership Status</p>
                <div className="px-3 py-1 bg-gold-champagne/20 border border-gold-champagne text-gold-champagne rounded-full text-xs font-bold uppercase tracking-wider">
                  Open Registration
                </div>
              </div>
              <p className="text-sm text-bone/60">
                Priority access for members at all locations.
              </p>
            </div>

            {/* Membership Price Anchor */}
            <div className="bg-wood-espresso/30 rounded-xl p-6 border-2 border-gold-champagne/40">
              <p className="text-bone/70 text-sm mb-2">Signature Access</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-display text-4xl font-bold text-bone">
                  Exclusive
                </span>
                <span className="text-gold-champagne font-bold">Tiers</span>
              </div>
              <p className="text-sm text-bone/80 mb-4">
                Join the circle of precision. <span className="text-gold-champagne">Starting from {minPrice ? `$${minPrice}` : "-"}.</span>
              </p>
              <Link href="/membership" className="block text-center w-full px-6 py-3 bg-gold-champagne hover:bg-gold-champagne/90 text-ink font-semibold rounded-lg transition-colors duration-150">
                View Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


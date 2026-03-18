"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Star } from "lucide-react";
import WaitTimeBadge from "./WaitTimeBadge";
import Link from "next/link";

interface LocationCardProps {
  id: string;
  name: string;
  address: string;
  waitMinutes: number;
  confidenceBand?: [number, number];
  status: "available" | "limited" | "high" | "closed";
  rating?: number;
  topStylist?: string;
  nextAvailable?: string;
  slug?: string;
  onCheckIn?: () => void;
}

export default function LocationCard({
  name,
  address,
  waitMinutes,
  confidenceBand,
  status,
  rating,
  topStylist,
  nextAvailable,
  slug,
  onCheckIn,
}: LocationCardProps) {
  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-steel-dark/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 relative group"
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="flex items-start justify-between gap-3 mb-6 relative">
        <div className="flex-1">
          <h3 className="font-display text-2xl font-black text-white mb-1 uppercase italic tracking-tighter">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-chrome/50 text-xs italic">
            <MapPin className="w-3 h-3 text-neon-red" />
            <span>{address}</span>
          </div>
        </div>
        <WaitTimeBadge
          minutes={waitMinutes}
          confidenceBand={confidenceBand}
          status={status}
          pulse={status === "high"}
        />
      </div>

      <div className="space-y-3 mb-8 relative">
        {rating && (
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-neon-red text-neon-red shadow-neon-red" />
            <span className="text-sm text-white font-black italic">{rating}</span>
          </div>
        )}

        {topStylist && (
          <p className="text-sm text-chrome/70 italic">
            Lead Tech: <span className="text-white font-bold">{topStylist}</span>
          </p>
        )}

        {nextAvailable && (
          <p className="text-xs text-neon-red font-bold uppercase tracking-widest italic animate-pulse">
            Next Bay opens in {nextAvailable}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 relative">
        <Link
          href={`/locations/${slug || name.toLowerCase().replace(/\s+/g, "-")}`}
          className="flex-1 px-6 py-3 bg-neon-red hover:bg-racing-red text-white font-display text-sm font-black uppercase italic tracking-widest rounded-xl transition-all duration-300 shadow-neon-red text-center relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover/btn:translate-x-[250%] transition-transform duration-700" />
          Enter Bay
        </Link>
        <button
          onClick={handleGetDirections}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 group/nav"
          aria-label="Get directions"
        >
          <Navigation className="w-5 h-5 text-chrome group-hover:text-neon-red transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}


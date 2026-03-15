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
      transition={{ duration: 0.3 }}
      className="bg-slate/50 backdrop-blur-sm rounded-xl p-4 border border-gold-champagne/10 hover:border-gold-champagne/30 transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-bone mb-1">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-bone/60 text-sm">
            <MapPin className="w-3.5 h-3.5" />
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

      {rating && (
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-4 h-4 fill-gold-champagne text-gold-champagne" />
          <span className="text-sm text-bone/80 font-medium">{rating}</span>
        </div>
      )}

      {topStylist && (
        <p className="text-sm text-bone/70 mb-2">
          Top stylist: <span className="text-gold-champagne">{topStylist}</span>{" "}
          on shift
        </p>
      )}

      {nextAvailable && (
        <p className="text-xs text-bone/60 mb-3">
          Next chair opens in {nextAvailable}
        </p>
      )}

      <div className="flex items-center gap-2 mt-4">
        <Link
          href={`/locations/${slug || name.toLowerCase().replace(/\s+/g, "-")}`}
          className="flex-1 px-4 py-2 bg-red-crimson hover:bg-red-crimson/90 text-bone font-semibold rounded-lg transition-colors duration-150 text-center text-sm"
        >
          Check-in
        </Link>
        <button
          onClick={handleGetDirections}
          className="p-2 bg-slate hover:bg-slate/80 rounded-lg transition-colors duration-150"
          aria-label="Get directions"
        >
          <Navigation className="w-4 h-4 text-bone/80" />
        </button>
      </div>
    </motion.div>
  );
}


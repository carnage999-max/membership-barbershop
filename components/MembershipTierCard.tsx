"use client";

import { motion } from "framer-motion";
import { Check, Crown, Sparkles } from "lucide-react";

interface MembershipTierCardProps {
  name: string;
  price: number;
  visitsIncluded: number;
  rollover: boolean;
  bookingPriority: boolean;
  guestPasses: number;
  effectiveCostPerCut: number;
  isHighlighted?: boolean;
  isUnlimited?: boolean;
  track: "haircut-only" | "mvp";
  onSelect?: () => void;
}

export default function MembershipTierCard({
  name,
  price,
  visitsIncluded,
  rollover,
  bookingPriority,
  guestPasses,
  effectiveCostPerCut,
  isHighlighted = false,
  isUnlimited = false,
  track,
  onSelect,
}: MembershipTierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-xl p-6 border-2 transition-all duration-150 ${
        isHighlighted
          ? "bg-wood-espresso/30 border-gold-champagne shadow-lg shadow-gold-champagne/20"
          : "bg-slate/50 border-gold-champagne/20"
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold-champagne text-ink font-display text-sm font-bold rounded-full">
          RECOMMENDED
        </div>
      )}

      {isUnlimited && (
        <div className="absolute top-4 right-4">
          <Sparkles className="w-5 h-5 text-gold-champagne" />
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Crown className={`w-6 h-6 ${isHighlighted ? "text-gold-champagne" : "text-bone/60"}`} />
        <h3 className="font-display text-2xl font-bold text-bone">{name}</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-4xl font-bold text-bone">${price}</span>
          <span className="text-bone/60">/month</span>
        </div>
        <p className="text-sm text-bone/70">
          Effective <span className="font-semibold text-gold-champagne">${effectiveCostPerCut}</span> per cut
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-success flex-shrink-0" />
          <span className="text-bone/80 text-sm">
            {isUnlimited ? "Unlimited" : visitsIncluded} {track === "mvp" ? "Concours Detail" : "Haircut"} visits
          </span>
        </div>
        {rollover && (
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-bone/80 text-sm">Unused visits roll over</span>
          </div>
        )}
        {bookingPriority && (
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-bone/80 text-sm">Busy-hour priority booking</span>
          </div>
        )}
        {guestPasses > 0 && (
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-bone/80 text-sm">{guestPasses} guest pass{guestPasses > 1 ? "es" : ""}</span>
          </div>
        )}
      </div>

      <button
        onClick={onSelect}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-150 ${
          isHighlighted
            ? "bg-gold-champagne hover:bg-gold-champagne/90 text-ink"
            : "bg-red-crimson hover:bg-red-crimson/90 text-bone"
        }`}
      >
        Join {name}
      </button>
    </motion.div>
  );
}


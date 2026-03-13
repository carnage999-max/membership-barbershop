"use client";

import { motion } from "framer-motion";
import { Star, Clock, Bell } from "lucide-react";
import Image from "next/image";

interface StylistCardProps {
  id: string;
  name: string;
  photo?: string;
  specialties: string[];
  avgCutTime: number;
  rating: number;
  onShift: boolean;
  onBreak?: boolean;
  onFollow?: () => void;
  isFollowing?: boolean;
  nextShift?: string;
}

export default function StylistCard({
  name,
  photo,
  specialties,
  avgCutTime,
  rating,
  onShift,
  onBreak,
  onFollow,
  isFollowing,
  nextShift,
}: StylistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="bg-slate/50 backdrop-blur-sm rounded-xl p-4 border border-gold-champagne/10 hover:border-gold-champagne/30 transition-all duration-150"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-wood-espresso flex-shrink-0">
          {photo ? (
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold-champagne font-display text-xl">
              {name.charAt(0)}
            </div>
          )}
          {onShift && !onBreak && (
            <div className="absolute top-1 right-1 w-3 h-3 bg-success rounded-full border-2 border-slate" />
          )}
          {onBreak && (
            <div className="absolute top-1 right-1 w-3 h-3 bg-warning rounded-full border-2 border-slate" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-bold text-bone mb-1 truncate">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-4 h-4 fill-gold-champagne text-gold-champagne" />
            <span className="text-sm text-bone/80 font-medium">{rating}</span>
            <span className="text-xs text-bone/50">•</span>
            <div className="flex items-center gap-1 text-xs text-bone/60">
              <Clock className="w-3 h-3" />
              <span>{avgCutTime} min avg</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-2 py-0.5 bg-wood-espresso/50 text-bone/70 text-xs rounded"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      {onShift && !onBreak && (
        <div className="mb-3 px-3 py-1.5 bg-success/20 border border-success/30 rounded-lg">
          <p className="text-xs text-success font-medium">On shift now</p>
        </div>
      )}

      {onBreak && (
        <div className="mb-3 px-3 py-1.5 bg-warning/20 border border-warning/30 rounded-lg">
          <p className="text-xs text-warning font-medium">On break</p>
        </div>
      )}

      {!onShift && nextShift && (
        <div className="mb-3 px-3 py-1.5 bg-slate/50 rounded-lg">
          <p className="text-xs text-bone/60">
            Next shift in <span className="text-gold-champagne font-medium">{nextShift}</span>
          </p>
        </div>
      )}

      {onFollow && (
        <button
          onClick={onFollow}
          className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 flex items-center justify-center gap-2 ${
            isFollowing
              ? "bg-gold-champagne/20 text-gold-champagne border border-gold-champagne/30"
              : "bg-red-crimson hover:bg-red-crimson/90 text-bone"
          }`}
        >
          <Bell className="w-4 h-4" />
          {isFollowing ? "Following" : "Follow for alerts"}
        </button>
      )}
    </motion.div>
  );
}


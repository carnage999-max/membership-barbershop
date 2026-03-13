"use client";

import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";

interface ConfiguratorOptionTileProps {
  name: string;
  icon?: React.ReactNode;
  timeEstimate: number;
  includedInTier?: string[];
  isSelected?: boolean;
  onToggle?: () => void;
}

export default function ConfiguratorOptionTile({
  name,
  icon,
  timeEstimate,
  includedInTier,
  isSelected,
  onToggle,
}: ConfiguratorOptionTileProps) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-4 rounded-lg border-2 transition-all duration-150 text-left ${
        isSelected
          ? "bg-gold-champagne/20 border-gold-champagne"
          : "bg-slate/50 border-gold-champagne/10 hover:border-gold-champagne/30"
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-gold-champagne rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-ink" />
        </div>
      )}

      <div className="flex items-start gap-3">
        {icon && <div className="text-gold-champagne">{icon}</div>}
        <div className="flex-1">
          <h4 className="font-display text-lg font-bold text-bone mb-1">
            {name}
          </h4>
          <div className="flex items-center gap-2 text-sm text-bone/60">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeEstimate} min</span>
          </div>
          {includedInTier && includedInTier.length > 0 && (
            <p className="text-xs text-gold-champagne mt-2">
              Included in: {includedInTier.join(", ")}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}


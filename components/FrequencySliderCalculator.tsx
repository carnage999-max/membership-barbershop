"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FrequencySliderCalculatorProps {
  onFrequencyChange?: (frequency: number, recommendedTier: string) => void;
}

const frequencies = [
  { value: 1, label: "1x/month", visits: 12 },
  { value: 2, label: "2x/month", visits: 24 },
  { value: 4, label: "Weekly", visits: 52 },
  { value: 8, label: "Unlimited", visits: Infinity },
];

const tiers = [
  { name: "Essential", price: 29, visits: 1, track: "haircut-only" },
  { name: "Pro", price: 49, visits: 2, track: "haircut-only" },
  { name: "Elite", price: 79, visits: 4, track: "haircut-only" },
  { name: "Unlimited", price: 99, visits: Infinity, track: "haircut-only" },
];

export default function FrequencySliderCalculator({
  onFrequencyChange,
}: FrequencySliderCalculatorProps) {
  const [selectedFrequency, setSelectedFrequency] = useState(2);

  const handleFrequencyChange = (value: number) => {
    setSelectedFrequency(value);
    const freq = frequencies.find((f) => f.value === value);
    if (!freq) return;

    let recommendedTier = "Essential";
    if (freq.visits === Infinity) {
      recommendedTier = "Unlimited";
    } else if (freq.visits >= 52) {
      recommendedTier = "Unlimited";
    } else if (freq.visits >= 24) {
      recommendedTier = "Elite";
    } else if (freq.visits >= 12) {
      recommendedTier = "Pro";
    }

    onFrequencyChange?.(freq.visits, recommendedTier);
  };

  const currentFreq = frequencies.find((f) => f.value === selectedFrequency);
  const recommendedTier = tiers.find((t) => {
    if (currentFreq?.visits === Infinity) return t.name === "Unlimited";
    if (currentFreq && currentFreq.visits >= 52) return t.name === "Unlimited";
    if (currentFreq && currentFreq.visits >= 24) return t.name === "Elite";
    if (currentFreq && currentFreq.visits >= 12) return t.name === "Pro";
    return t.name === "Essential";
  });

  const effectiveCostPerCut = recommendedTier
    ? currentFreq?.visits === Infinity
      ? (recommendedTier.price / 8).toFixed(2)
      : (recommendedTier.price / (currentFreq?.visits || 1)).toFixed(2)
    : "0.00";

  return (
    <div className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20">
      <h3 className="font-display text-2xl font-bold text-bone mb-6">
        How often do you cut?
      </h3>

      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {frequencies.map((freq) => (
            <button
              key={freq.value}
              onClick={() => handleFrequencyChange(freq.value)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                selectedFrequency === freq.value
                  ? "bg-gold-champagne text-ink"
                  : "bg-slate text-bone/60 hover:text-bone"
              }`}
            >
              {freq.label}
            </button>
          ))}
        </div>

        <div className="relative h-2 bg-wood-espresso rounded-full">
          <motion.div
            className="absolute h-full bg-gold-champagne rounded-full"
            initial={{ width: "50%" }}
            animate={{
              width: `${((selectedFrequency - 1) / 7) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {recommendedTier && currentFreq && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-wood-espresso/30 rounded-lg p-4 border border-gold-champagne/30"
        >
          <p className="text-bone/80 text-sm mb-2">
            Recommended: <span className="font-bold text-gold-champagne">{recommendedTier.name}</span>
          </p>
          <p className="text-bone/80 text-sm mb-2">
            Effective cost per cut: <span className="font-bold text-gold-champagne">${effectiveCostPerCut}</span>
          </p>
          {currentFreq.visits !== Infinity && (
            <p className="text-bone/60 text-xs">
              {currentFreq.visits} visits/year × ${recommendedTier.price}/month = ${effectiveCostPerCut} per cut
            </p>
          )}
        </motion.div>
      )}

      <div className="flex gap-3 mt-6">
        <button className="flex-1 px-6 py-3 bg-red-crimson hover:bg-red-crimson/90 text-bone font-semibold rounded-lg transition-colors duration-150">
          Join Membership
        </button>
        <button className="flex-1 px-6 py-3 bg-slate hover:bg-slate/80 text-bone font-semibold rounded-lg transition-colors duration-150 border border-gold-champagne/30">
          Try MVP Ritual
        </button>
      </div>
    </div>
  );
}


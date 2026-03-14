"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { memberships as membershipsApi } from "@/lib/api-client";

interface FrequencySliderCalculatorProps {
  onFrequencyChange?: (frequency: number, recommendedTier: string) => void;
  onJoinClick?: () => void;
}

const frequencies = [
  { value: 1, label: "1x/month", visits: 12 },
  { value: 2, label: "2x/month", visits: 24 },
  { value: 4, label: "Weekly", visits: 52 },
  { value: 8, label: "Unlimited", visits: 999 }, // 999 for infinity in math
];

export default function FrequencySliderCalculator({
  onFrequencyChange,
  onJoinClick
}: FrequencySliderCalculatorProps) {
  const [selectedFrequency, setSelectedFrequency] = useState(2);
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const result = await membershipsApi.getPlans();
        if (result.plans && result.plans.length > 0) {
          // Sort plans by price/cuts to make sure we have a logical order
          const sortedPlans = result.plans.sort((a: any, b: any) => a.price - b.price);
          setTiers(sortedPlans);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleFrequencyChange = (value: number) => {
    setSelectedFrequency(value);
    const freq = frequencies.find((f) => f.value === value);
    if (!freq) return;

    // Determine recommended tier based on cutsPerMonth
    let recTier = "Essential";
    if (tiers.length > 0) {
      const cutsPerMonth = value; // value 1, 2, 4, 8 mapped to frequencies
      const match = tiers.find(t => t.cutsPerMonth >= cutsPerMonth) || tiers[tiers.length - 1];
      recTier = match?.name || "Essential";
    }

    onFrequencyChange?.(freq.visits, recTier);
  };

  const currentFreq = frequencies.find((f) => f.value === selectedFrequency);
  
  // Logic to find recommended tier from dynamic data
  const recommendedTier = tiers.length > 0 
    ? (tiers.find(t => t.cutsPerMonth >= selectedFrequency) || tiers[tiers.length - 1])
    : null;

  const calculateEffectiveCost = () => {
    if (!recommendedTier || !currentFreq) return "-";
    if (currentFreq.visits >= 999) {
      // For unlimited, assume 8 visits/month for the math
      return (recommendedTier.price / 8).toFixed(2);
    }
    return ((recommendedTier.price * 12) / currentFreq.visits).toFixed(2);
  };

  const effectiveCostPerCut = calculateEffectiveCost();

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
            Effective cost per cut: <span className="font-bold text-gold-champagne">{effectiveCostPerCut !== "-" ? `$${effectiveCostPerCut}` : "-"}</span>
          </p>
          {currentFreq.visits < 999 && (
            <p className="text-bone/60 text-xs text-balance">
              (${recommendedTier.price} × 12 months) ÷ {currentFreq.visits} visits/year = ${effectiveCostPerCut} per cut
            </p>
          )}
        </motion.div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={onJoinClick} className="flex-1 px-6 py-3 bg-red-crimson hover:bg-red-crimson/90 text-bone font-semibold rounded-lg transition-colors duration-150">
          Join Membership
        </button>
        <button className="flex-1 px-6 py-3 bg-slate hover:bg-slate/80 text-bone font-semibold rounded-lg transition-colors duration-150 border border-gold-champagne/30">
          Try Signature Treatment
        </button>
      </div>
    </div>
  );
}


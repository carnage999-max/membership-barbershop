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

    // Determine recommended tier based on visitsPerMonth
    let recTier = "Essential";
    if (tiers.length > 0) {
      const visitsPerMonth = value; // value 1, 2, 4, 8 mapped to frequencies
      const match = tiers.find(t => t.visitsPerMonth >= visitsPerMonth) || tiers[tiers.length - 1];
      recTier = match?.name || "Essential";
    }

    onFrequencyChange?.(freq.visits, recTier);
  };

  const currentFreq = frequencies.find((f) => f.value === selectedFrequency);
  
  // Logic to find recommended tier from dynamic data
  const recommendedTier = tiers.length > 0 
    ? (tiers.find(t => t.visitsPerMonth >= selectedFrequency) || tiers[tiers.length - 1])
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
    <div className="bg-steel-dark/40 backdrop-blur-2xl rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-red/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <h3 className="font-display text-2xl md:text-3xl font-black text-white mb-8 uppercase italic tracking-tighter">
        How often do you <span className="text-neon-red text-shadow-neon">Pit Stop?</span>
      </h3>

      <div className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {frequencies.map((freq) => (
            <button
              key={freq.value}
              onClick={() => handleFrequencyChange(freq.value)}
              className={`px-4 py-3 rounded-xl font-black text-[10px] uppercase italic tracking-[0.2em] transition-all duration-300 border ${
                selectedFrequency === freq.value
                  ? "bg-neon-red text-white border-neon-red shadow-neon-red translate-y-[-2px]"
                  : "bg-obsidian/60 text-chrome/40 border-white/5 hover:border-white/20 hover:text-white"
              }`}
            >
              {freq.label}
            </button>
          ))}
        </div>

        <div className="relative h-2 bg-obsidian rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="absolute h-full bg-neon-red shadow-neon-red"
            initial={{ width: "50%" }}
            animate={{
              width: `${((selectedFrequency - 1) / 7) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {recommendedTier && currentFreq && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-obsidian/60 rounded-2xl p-6 border border-white/5 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-chrome/40 font-black uppercase tracking-widest mb-1 italic">Recommended Grade</p>
              <p className="font-display text-3xl font-black text-white italic uppercase tracking-tighter">
                {recommendedTier.name}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] text-chrome/40 font-black uppercase tracking-widest mb-1 italic">Effective Value</p>
              <p className="font-display text-4xl font-black text-neon-red italic tracking-tighter shadow-neon-red">
                {effectiveCostPerCut !== "-" ? `$${effectiveCostPerCut}` : "-"}
                <span className="text-xs text-chrome/40 ml-2 uppercase">/ Cut</span>
              </p>
            </div>
          </div>
          
          {currentFreq.visits < 999 && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[9px] text-chrome/30 font-bold italic tracking-widest leading-relaxed uppercase">
                Optimization Formula: (${recommendedTier.price} × 12m) ÷ {currentFreq.visits} visits/yr 
              </p>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <button 
          onClick={onJoinClick} 
          className="flex-1 relative group px-8 py-5 bg-neon-red hover:bg-racing-red text-white font-display text-xl font-black rounded-xl transition-all duration-300 overflow-hidden shadow-neon-red"
        >
          <div className="absolute inset-0 bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700" />
          <span className="relative z-10 italic uppercase tracking-widest">INITIALIZE GRADE</span>
        </button>
        <button className="flex-1 px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-display text-xl font-black rounded-xl transition-all duration-300 border border-white/10 italic uppercase tracking-widest">
          VIEW FULL SPECS
        </button>
      </div>
    </div>
  );
}


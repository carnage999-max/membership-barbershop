"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ConfiguratorOptionTile from "@/components/ConfiguratorOptionTile";
import { Scissors, Zap, Shield, Gauge, Fuel, Wrench, Users } from "lucide-react";

const baseService = {
  name: "Standard Body Work",
  icon: <Scissors className="w-6 h-6" />,
  timeEstimate: 20,
  includedInTier: ["STOCK", "MODIFIED", "TURBO", "SUPERCHARGED"],
};

const addOns = [
  {
    name: "Beard Calibration",
    icon: <Wrench className="w-6 h-6" />,
    timeEstimate: 10,
    includedInTier: ["MODIFIED", "TURBO", "SUPERCHARGED"],
  },
  {
    name: "Line-up Optimization",
    icon: <Zap className="w-6 h-6" />,
    timeEstimate: 5,
    includedInTier: ["TURBO", "SUPERCHARGED"],
  },
  {
    name: "Thermo-Towal Coolant",
    icon: <Fuel className="w-6 h-6" />,
    timeEstimate: 5,
    includedInTier: ["TURBO", "SUPERCHARGED"],
  },
  {
    name: "Signature Hydro-Massage",
    icon: <Gauge className="w-6 h-6" />,
    timeEstimate: 15,
    includedInTier: ["SUPERCHARGED"],
  },
  {
    name: "Junior Driver Cut",
    icon: <Users className="w-6 h-6" />,
    timeEstimate: 15,
    includedInTier: ["MODIFIED", "TURBO", "SUPERCHARGED"],
  },
];

export default function ServicesPage() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showMembershipCoverage, setShowMembershipCoverage] = useState(false);

  const toggleOption = (name: string) => {
    setSelectedOptions((prev) =>
      prev.includes(name)
        ? prev.filter((opt) => opt !== name)
        : [...prev, name]
    );
  };

  const totalTime = baseService.timeEstimate +
    addOns
      .filter((addon) => selectedOptions.includes(addon.name))
      .reduce((sum, addon) => sum + addon.timeEstimate, 0);

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-8xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
            Service <span className="text-neon-red">Bay</span>
          </h1>
          <p className="text-chrome/60 text-lg italic uppercase tracking-widest font-bold max-w-2xl mx-auto">
            Configure your build. High pressure treatments for maximum performance.
          </p>
        </div>

        {/* Membership Coverage Toggle */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-steel-dark/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-neon-red drop-shadow-[0_0_8px_rgba(255,49,49,0.5)]" />
                <div>
                  <h3 className="font-display text-2xl font-black text-white mb-1 uppercase italic tracking-tighter">
                    Analyze Grade Coverage
                  </h3>
                  <p className="text-sm text-chrome/50 font-bold uppercase tracking-widest italic">
                    See what's included in your Performance Grade
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMembershipCoverage(!showMembershipCoverage)}
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                  showMembershipCoverage ? "bg-neon-red shadow-neon-red" : "bg-white/10"
                }`}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ x: showMembershipCoverage ? 36 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Base Service */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-black text-white mb-6 uppercase italic tracking-tighter flex items-center gap-3">
            <span className="w-8 h-1 bg-neon-red inline-block" />
            Standard Body Work
          </h2>
          <ConfiguratorOptionTile
            name={baseService.name}
            icon={baseService.icon}
            timeEstimate={baseService.timeEstimate}
            includedInTier={showMembershipCoverage ? baseService.includedInTier : undefined}
            isSelected={true}
          />
        </div>

        {/* Add-ons */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-black text-white mb-6 uppercase italic tracking-tighter flex items-center gap-3">
            <span className="w-8 h-1 bg-neon-red inline-block" />
            Aftermarket Upgrades
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {addOns.map((addon) => (
              <ConfiguratorOptionTile
                key={addon.name}
                name={addon.name}
                icon={addon.icon}
                timeEstimate={addon.timeEstimate}
                includedInTier={showMembershipCoverage ? addon.includedInTier : undefined}
                isSelected={selectedOptions.includes(addon.name)}
                onToggle={() => toggleOption(addon.name)}
              />
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-steel-dark/80 backdrop-blur-xl rounded-2xl p-10 border border-neon-red/30 shadow-neon-red relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent" />
            
            <h3 className="font-display text-4xl font-black text-white mb-8 uppercase italic tracking-tighter">
              Build Specs
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-chrome/60 font-black uppercase italic tracking-widest text-sm">
                <span>{baseService.name}</span>
                <span>{baseService.timeEstimate} MIN</span>
              </div>
              {selectedOptions.map((option) => {
                const addon = addOns.find((a) => a.name === option);
                return addon ? (
                  <div key={option} className="flex justify-between text-chrome/60 font-black uppercase italic tracking-widest text-sm">
                    <span>{addon.name}</span>
                    <span>{addon.timeEstimate} MIN</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="pt-8 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="font-display text-2xl font-black text-white uppercase italic tracking-tighter">
                  Total Build Time
                </span>
                <span className="font-display text-5xl font-black text-neon-red italic tracking-tighter shadow-neon-red">
                  {totalTime} MIN
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}


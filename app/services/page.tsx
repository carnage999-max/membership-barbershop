"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ConfiguratorOptionTile from "@/components/ConfiguratorOptionTile";
import { Scissors, Sparkles, Zap, Droplets, Hand, Sparkle, Users } from "lucide-react";

const baseService = {
  name: "Haircut + Style",
  icon: <Scissors className="w-6 h-6" />,
  timeEstimate: 20,
  includedInTier: ["Essential", "Pro", "Elite", "Unlimited"],
};

const addOns = [
  {
    name: "Beard Trim",
    icon: <Sparkles className="w-6 h-6" />,
    timeEstimate: 10,
    includedInTier: ["Pro", "Elite", "Unlimited"],
  },
  {
    name: "Line-up",
    icon: <Zap className="w-6 h-6" />,
    timeEstimate: 5,
    includedInTier: ["Elite", "Unlimited"],
  },
  {
    name: "Hot Towel",
    icon: <Droplets className="w-6 h-6" />,
    timeEstimate: 5,
    includedInTier: ["MVP Tiers"],
  },
  {
    name: "MVP Wash + Massage",
    icon: <Hand className="w-6 h-6" />,
    timeEstimate: 15,
    includedInTier: ["MVP Tiers"],
  },
  {
    name: "Kids Cut",
    icon: <Users className="w-6 h-6" />,
    timeEstimate: 15,
    includedInTier: ["Pro", "Elite", "Unlimited"],
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
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4">
            Services
          </h1>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Build your service like a car configurator. Base service plus premium add-ons.
          </p>
        </div>

        {/* Membership Coverage Toggle */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-bone mb-1">
                  Show Membership Barbershop Coverage
                </h3>
                <p className="text-sm text-bone/60">
                  See which services are included in your membership tier
                </p>
              </div>
              <button
                onClick={() => setShowMembershipCoverage(!showMembershipCoverage)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-150 ${
                  showMembershipCoverage ? "bg-gold-champagne" : "bg-slate"
                }`}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-bone rounded-full shadow-lg"
                  animate={{ x: showMembershipCoverage ? 26 : 2 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Base Service */}
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="font-display text-2xl font-bold text-bone mb-4">
            Base Service
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
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="font-display text-2xl font-bold text-bone mb-4">
            Add-ons
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-wood-espresso/30 rounded-xl p-6 border-2 border-gold-champagne"
          >
            <h3 className="font-display text-2xl font-bold text-bone mb-4">
              Service Summary
            </h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-bone/80">
                <span>{baseService.name}</span>
                <span>{baseService.timeEstimate} min</span>
              </div>
              {selectedOptions.map((option) => {
                const addon = addOns.find((a) => a.name === option);
                return addon ? (
                  <div key={option} className="flex justify-between text-bone/80">
                    <span>{addon.name}</span>
                    <span>{addon.timeEstimate} min</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="pt-4 border-t border-gold-champagne/20">
              <div className="flex justify-between items-center">
                <span className="font-display text-xl font-bold text-bone">
                  Total Time
                </span>
                <span className="font-display text-2xl font-bold text-gold-champagne">
                  {totalTime} min
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}


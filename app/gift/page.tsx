"use client";

import { motion } from "framer-motion";
import { Gift, Zap, Gauge, Fuel } from "lucide-react";
import MembershipTierCard from "@/components/MembershipTierCard";

const giftTiers = [
  {
    name: "Stock Gift",
    price: 29,
    visitsIncluded: 1,
    rollover: false,
    bookingPriority: false,
    guestPasses: 0,
    effectiveCostPerCut: 2.42,
    track: "haircut-only" as const,
  },
  {
    name: "Modified Gift",
    price: 49,
    visitsIncluded: 2,
    rollover: true,
    bookingPriority: false,
    guestPasses: 1,
    effectiveCostPerCut: 2.04,
    track: "haircut-only" as const,
  },
  {
    name: "Turbo Gift",
    price: 79,
    visitsIncluded: 4,
    rollover: true,
    bookingPriority: true,
    guestPasses: 2,
    effectiveCostPerCut: 1.52,
    track: "haircut-only" as const,
  },
];

export default function GiftPage() {
  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-neon-red/10 rounded-full mb-8 border border-neon-red/20 shadow-neon-red animate-pulse">
            <Gift className="w-12 h-12 text-neon-red" />
          </div>
          <h1 className="font-display text-5xl md:text-8xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
            Gift <span className="text-neon-red">The Man Cave</span>
          </h1>
          <p className="text-chrome/60 text-lg italic uppercase tracking-widest font-bold max-w-2xl mx-auto">
            Give the gift of high-performance grooming. Pass the keys to the garage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {giftTiers.map((tier) => (
            <MembershipTierCard
              key={tier.name}
              {...tier}
              onSelect={() => console.log(`Gift ${tier.name}`)}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-steel-dark/80 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-red/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <h2 className="font-display text-3xl font-black text-white mb-8 uppercase italic tracking-tighter">
            Pit Pass <span className="text-neon-red">Activation</span>
          </h2>
          <ul className="space-y-6 text-chrome/60 font-bold uppercase italic tracking-widest text-xs">
            <li className="flex items-start gap-4">
              <span className="text-neon-red font-black text-xl italic leading-none">01.</span>
              <span>Select the Performance Grade and finalize the Pit Pass purchase.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-neon-red font-black text-xl italic leading-none">02.</span>
              <span>We'll dispatch a digital garage manifest to your recipient driver.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-neon-red font-black text-xl italic leading-none">03.</span>
              <span>Recipient activates their grade and enters the bay for treatment.</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}


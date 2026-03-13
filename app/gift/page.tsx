"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import MembershipTierCard from "@/components/MembershipTierCard";

const giftTiers = [
  {
    name: "Essential Gift",
    price: 29,
    visitsIncluded: 1,
    rollover: false,
    bookingPriority: false,
    guestPasses: 0,
    effectiveCostPerCut: 2.42,
    track: "haircut-only" as const,
  },
  {
    name: "Pro Gift",
    price: 49,
    visitsIncluded: 2,
    rollover: true,
    bookingPriority: false,
    guestPasses: 1,
    effectiveCostPerCut: 2.04,
    track: "haircut-only" as const,
  },
  {
    name: "Elite Gift",
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
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-champagne/20 rounded-full mb-6">
            <Gift className="w-10 h-10 text-gold-champagne" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4">
            Gift Membership
          </h1>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Give the gift of premium grooming. Perfect for any occasion.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {giftTiers.map((tier) => (
            <MembershipTierCard
              key={tier.name}
              {...tier}
              onSelect={() => console.log(`Gift ${tier.name}`)}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-slate/50 backdrop-blur-sm rounded-xl p-8 border border-gold-champagne/20">
          <h2 className="font-display text-2xl font-bold text-bone mb-4">
            How It Works
          </h2>
          <ul className="space-y-4 text-bone/70">
            <li className="flex items-start gap-3">
              <span className="text-gold-champagne font-bold">1.</span>
              <span>Select a membership tier and purchase as a gift</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold-champagne font-bold">2.</span>
              <span>We'll send a digital gift card to your recipient</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold-champagne font-bold">3.</span>
              <span>Recipient activates their membership and starts enjoying premium cuts</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}


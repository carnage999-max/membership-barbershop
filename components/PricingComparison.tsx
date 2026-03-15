"use client";

import { motion } from "framer-motion";
import { Check, X, Scissors, ShieldCheck, Zap } from "lucide-react";

const walkInServices = [
  { name: "Standard Haircut", price: 19.99 },
  { name: "Kids / Senior Cut", price: 17.99 },
  { name: "Beard Sculpt / Razor", price: 15.00 },
  { name: "Beard Trim / Line Up", price: 10.00 },
  { name: "5m Stress Recovery", price: 10.00 },
  { name: "15m Massage Upgrade", price: 20.00 },
  { name: "Back Shave / Neck", price: 5.00 },
  { name: "Hot Towel Treatment", price: 5.00 },
  { name: "Nose / Ear Waxing", price: 15.00 },
];

const membershipBenefits = [
  "Significant savings per visit",
  "Priority booking access",
  "Included MVP rituals (MVP Plans)",
  "Unlimited cuts (Unlimited Plans)",
  "Member-only lounge access",
  "Automated monthly renewals",
];

export default function PricingComparison() {
  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-champagne/5 -skew-x-12 translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4 italic uppercase tracking-tighter">
            Pricing <span className="text-gold-champagne">Structure</span>
          </h2>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Transparent value. Choose between the flexibility of walk-ins or the premium benefits of the membership circle.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Walk-In Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate/30 backdrop-blur-md rounded-3xl p-8 border border-bone/10 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-bone/10 rounded-xl flex items-center justify-center">
                <Scissors className="text-bone w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-bone uppercase italic">Walk-In Access</h3>
                <p className="text-[10px] text-bone/40 font-bold uppercase tracking-widest">Pay-Per-Visit Protocol</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {walkInServices.map((service) => (
                <div key={service.name} className="flex justify-between items-center py-3 border-b border-bone/5">
                  <span className="text-bone/80 font-medium">{service.name}</span>
                  <span className="text-bone font-bold">${service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-bone/40 italic">
              * Walk-in availability is subject to physical shop capacity and queue volume.
            </p>
          </motion.div>

          {/* Membership Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gold-champagne/10 backdrop-blur-md rounded-3xl p-8 border-2 border-gold-champagne shadow-[0_0_50px_rgba(223,186,110,0.1)] flex flex-col relative"
          >
            {/* Recommendation Badge */}
            <div className="absolute -top-4 right-8 px-4 py-1.5 bg-gold-champagne text-ink text-[10px] font-bold uppercase rounded-full tracking-widest">
              Highly Recommended
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gold-champagne rounded-xl flex items-center justify-center shadow-lg shadow-gold-champagne/20">
                <Zap className="text-ink w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-bone uppercase italic">Membership Circle</h3>
                <p className="text-[10px] text-gold-champagne font-bold uppercase tracking-widest">Subscription Optimization</p>
              </div>
            </div>

            <div className="space-y-6 mb-8 flex-1">
              <div className="p-6 bg-obsidian/40 rounded-2xl border border-gold-champagne/20">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[10px] text-gold-champagne font-bold uppercase tracking-widest">Starting From</span>
                  <span className="font-display text-4xl font-bold text-bone">$29.99</span>
                  <span className="text-bone/40">/mo</span>
                </div>
                <p className="text-sm text-bone/60 leading-relaxed">
                  Engineered for the recurring client. Members save an average of 35% compared to walk-in pricing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {membershipBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 bg-gold-champagne/20 rounded flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-gold-champagne" />
                    </div>
                    <span className="text-sm text-bone/80 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/membership'}
                className="w-full py-5 bg-gold-champagne hover:bg-white text-ink font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-gold-champagne/10 uppercase italic tracking-widest"
              >
                View Membership Tiers
              </motion.button>
              <div className="mt-4 flex flex-col items-center gap-1">
                <div className="flex items-center justify-center gap-2 text-[10px] text-success font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Profitability Logic Applied
                </div>
                <p className="text-[9px] text-bone/30 uppercase tracking-tighter">
                  * Unlimited plans subject to fair-use policy
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

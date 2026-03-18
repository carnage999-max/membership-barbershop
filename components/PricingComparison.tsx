"use client";

import { motion } from "framer-motion";
import { Check, Scissors, Gauge, Zap, Star } from "lucide-react";
import Link from "next/link";

const standardServices = [
  { name: "Haircut", price: 19.99 },
  { name: "Beard Trim", price: 5.00 },
  { name: "Ear Wax", price: 15.00 },
  { name: "5 Minute Massage", price: 10.00 },
  { name: "15 Minute Massage", price: 20.00 },
];

const membershipHighlights = [
  "Unlimited High Performance Haircuts",
  "Priority Member Scheduling",
  "Express Member Lane Access",
  "Exclusive Member Add-on Pricing",
  "Precision Beard Trims (Turbo+)",
  "Thermal Massage Recovery (Supercharged)",
];

export default function PricingComparison() {
  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      {/* Carbon Fiber Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Red Neon Accent */}
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-neon-red via-transparent to-transparent opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter">
            Choose Your <span className="neon-text-red">Driving Style</span>
          </h2>
          <p className="text-chrome/60 text-lg max-w-2xl mx-auto italic font-body">
            Whether you're a standard commuter or a high-performance track day regular, we have the setup for your grooming regimen.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Panel A: Standard Haircut Pricing */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group bg-steel-dark/50 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-chrome/20 transition-all duration-500 relative flex flex-col"
          >
            {/* Corner Accent */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-chrome/20 rounded-tl-2xl" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-chrome/40 transition-colors">
                <Scissors className="text-chrome w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-black text-white uppercase italic tracking-tight">Standard Pricing</h3>
                <p className="text-[10px] text-chrome/40 font-bold uppercase tracking-[0.2em]">Pay-As-You-Go</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {standardServices.map((service) => (
                <div key={service.name} className="flex justify-between items-center py-4 border-b border-white/5 group-hover:border-white/10 transition-colors">
                  <span className="text-chrome/80 font-display uppercase italic tracking-wide">{service.name}</span>
                  <span className="text-white font-black font-display text-xl tracking-tighter">${service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Link 
              href="/book"
              className="w-full py-4 border border-white/20 text-white font-display text-lg font-bold uppercase italic tracking-widest hover:bg-white hover:text-obsidian transition-all duration-300 text-center"
            >
              Book Standard Cut
            </Link>
          </motion.div>

          {/* Panel B: Membership Program */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative bg-carbon rounded-2xl p-8 border-2 border-neon-red shadow-[0_0_40px_rgba(255,49,49,0.1)] flex flex-col overflow-hidden"
          >
            {/* Best Value Callout */}
            <div className="absolute top-6 -right-12 px-12 py-1.5 bg-neon-red text-white text-[10px] font-black uppercase tracking-[0.3em] rotate-45 shadow-neon-red">
               Best Value
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-neon-red rounded-xl flex items-center justify-center shadow-neon-red">
                <Zap className="text-white w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-black text-white uppercase italic tracking-tight">Membership Program</h3>
                <p className="text-[10px] text-neon-red font-bold uppercase tracking-[0.2em]">High Performance Tiers</p>
              </div>
            </div>

            <div className="space-y-6 mb-8 flex-1">
              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[10px] text-neon-red font-black uppercase tracking-widest">Starting At</span>
                  <span className="font-display text-5xl font-black text-white tracking-tighter">$29.99</span>
                  <span className="text-chrome/30 font-display italic">/mo</span>
                </div>
                <p className="text-sm text-chrome/60 italic">
                  Engineered for men who maintain peak aesthetics. Save over 40% on monthly maintenance.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {membershipHighlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-neon-red/20 flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-neon-red fill-neon-red" />
                    </div>
                    <span className="text-sm text-chrome font-medium italic">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link 
              href="/membership"
              className="group relative w-full py-5 bg-neon-red hover:bg-racing-red text-white font-display text-xl font-black uppercase italic tracking-widest transition-all duration-300 shadow-neon-red overflow-hidden text-center"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
              View Membership Levels
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

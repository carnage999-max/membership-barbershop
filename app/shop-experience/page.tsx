"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import PrivacyBoothFeaturePanel from "@/components/PrivacyBoothFeaturePanel";
import { Scissors, Sparkles, Zap, Droplets, Hand, Sparkle } from "lucide-react";

const mvpSteps = [
  { icon: <Zap className="w-6 h-6" />, title: "Check-in", description: "Seamless entry" },
  { icon: <Scissors className="w-6 h-6" />, title: "Cut", description: "Precision trim" },
  { icon: <Droplets className="w-6 h-6" />, title: "Hot Towel", description: "Steam treatment" },
  { icon: <Sparkles className="w-6 h-6" />, title: "Wash", description: "Deep clean" },
  { icon: <Hand className="w-6 h-6" />, title: "Massage", description: "Scalp & neck" },
  { icon: <Sparkle className="w-6 h-6" />, title: "Style", description: "Final finish" },
];

export default function ShopExperiencePage() {
  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4 italic uppercase tracking-tighter">
            The <span className="text-gold-champagne">Membership</span> Lounge
          </h1>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Automotive luxury meets barbershop excellence
          </p>
        </div>

        {/* Car Theme Story */}
        <section className="mb-20">
          <div className="relative h-96 rounded-2xl overflow-hidden bg-wood-espresso mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-obsidian/80 via-transparent to-wood-espresso/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center z-10">
                <h2 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4">
                  Choose Your Lane
                </h2>
                <p className="text-bone/70 text-xl max-w-2xl">
                  Each location features unique automotive themes: Classics, Supercars, and Track Day vibes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MVP Ritual Story */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4 italic uppercase tracking-tighter">
              The <span className="text-gold-champagne">Concours</span> Detail
            </h2>
            <p className="text-bone/70 text-lg max-w-2xl mx-auto">
              Haircut as the tune-up. Shampoo and massage as the full detail.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mvpSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20 hover:border-gold-champagne/40 transition-all duration-150 text-center"
              >
                <div className="text-gold-champagne mb-3 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-bone mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-bone/60">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Privacy Booths Story */}
        <section className="space-y-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4">
              Privacy Booths
            </h2>
            <p className="text-bone/70 text-lg">
              Premium privacy, not secrecy
            </p>
          </div>

          <PrivacyBoothFeaturePanel
            title="Divider Display"
            description="Elegant dividers create intimate spaces while maintaining the open, luxurious atmosphere of our garage-inspired lounges."
            reverse={false}
          />

          <PrivacyBoothFeaturePanel
            title="Rear Curtains"
            description="Optional privacy curtains provide complete seclusion when you need it, available on request for your comfort."
            reverse={true}
          />

          <PrivacyBoothFeaturePanel
            title="Quiet Lighting"
            description="Warm, focused lighting creates a calming environment that frames privacy as premium luxury, not isolation."
            reverse={false}
          />
        </section>
      </div>
    </main>
  );
}


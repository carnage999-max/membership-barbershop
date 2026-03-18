"use client";

import { motion } from "framer-motion";
import { Zap, Gauge, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroExperience() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/high-performance-haircuts-branded-design.png"
          alt="High Performance Garage"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/50" />
      </div>

      {/* Red Neon Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neon-red shadow-neon-red z-20" />

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
               <div className="h-0.5 w-12 bg-neon-red" />
               <span className="text-neon-red font-display tracking-[0.3em] uppercase text-sm font-bold">
                 Est. Precision 2026
               </span>
            </div>

            <Image
              src="/images/new-logo.png"
              alt="Man Cave Barber Shops"
              width={400}
              height={120}
              className="h-24 md:h-32 w-auto mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              priority
            />

            <h1 className="font-display text-5xl md:text-8xl font-black text-white leading-[0.9] uppercase italic tracking-tighter">
              High Performance<br />
              <span className="chrome-text">Haircuts</span>
            </h1>

            <p className="text-chrome/80 text-xl md:text-2xl font-body max-w-xl italic">
              Two Ways to Drive Your Style. 
              <br className="hidden md:block" />
              Engineered for the modern man.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link 
                href="/book" 
                className="group relative px-8 py-5 bg-neon-red hover:bg-racing-red text-white font-display text-xl font-bold uppercase italic tracking-wider transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
                <Gauge className="w-6 h-6" />
                Book Standard Cut
              </Link>

              <Link 
                href="/membership" 
                className="group px-8 py-5 border-2 border-white/20 hover:border-white text-white font-display text-xl font-bold uppercase italic tracking-wider transition-all duration-300 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm"
              >
                Join Membership
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-chrome/60 text-sm uppercase tracking-widest font-bold">
                  Pit Crew Ready
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-neon-red" />
                <span className="text-chrome/60 text-sm uppercase tracking-widest font-bold">
                  Express Lanes Open
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Scroll to Inspect</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-neon-red to-transparent" />
      </motion.div>
    </section>
  );
}


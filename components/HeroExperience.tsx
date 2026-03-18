"use client";

import { motion } from "framer-motion";
import { Zap, Gauge, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroExperience() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 bg-obsidian">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-[70vh] md:h-full object-cover opacity-80"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-transparent md:via-obsidian/80 to-transparent z-10" />
        {/* Gradients for smooth fade into the background */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent md:via-transparent z-10" />
      </div>

      {/* Red Neon Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neon-red shadow-neon-red z-20" />

      <div className="container mx-auto px-4 relative z-10 pt-10 md:pt-20">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex justify-center md:justify-start mb-8 md:mb-10 w-full">
              <Image
                src="/images/new-logo.png"
                alt="Man Cave Barber Shops"
                width={500}
                height={150}
                className="w-[90%] max-w-[360px] md:max-w-none md:w-auto h-auto md:h-32 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-2xl"
                priority
              />
            </div>

            <h1 className="font-display text-5xl md:text-8xl font-black text-white leading-[0.9] uppercase italic tracking-tighter pr-[0.5em] overflow-visible w-fit lg:inline-block">
              High Performance{"\u00A0"}<br />
              <span className="chrome-text">Haircuts{"\u00A0"}</span>
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


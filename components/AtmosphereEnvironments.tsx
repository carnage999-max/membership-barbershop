"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Crown, Zap, Trophy } from "lucide-react";

const environments = [
  {
    id: "classics",
    name: "Classics",
    description: "Vintage elegance with dark woods and the soul of the open road",
    color: "from-wood-espresso to-obsidian",
    icon: Crown,
  },
  {
    id: "supercars",
    name: "Supercars",
    description: "Aerodynamic luxury focusing on Ferrari red and Lamborghini black",
    color: "from-red-crimson/20 to-obsidian",
    icon: Zap,
  },
  {
    id: "track-day",
    name: "Track Day",
    description: "High-adrenaline precision inspired by Bugatti and track engineering",
    color: "from-slate/40 to-obsidian",
    icon: Trophy,
  },
];

export default function AtmosphereEnvironments() {
  const [activeEnvironment, setActiveEnvironment] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden bg-obsidian">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Laser line divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl font-black text-white mb-4 italic uppercase tracking-tighter pr-[0.5em] overflow-visible lg:inline-block">
            Custom <span className="text-neon-red text-shadow-neon">Environments</span>
          </h2>
          <p className="text-chrome/60 text-lg uppercase tracking-widest font-black italic text-xs">
            Every shop is a high-performance performance facility
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Carousel */}
          <div className="relative h-[450px] md:h-[600px] rounded-[2.5rem] overflow-hidden bg-steel-dark content-box shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5">
            {environments.map((env, index) => {
              const Icon = env.icon;
              const isActive = index === activeEnvironment;

              return (
                <motion.div
                  key={env.id}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: (index - activeEnvironment) * 100 + "%",
                    scale: isActive ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute inset-0 flex items-center justify-center p-8 md:p-20`}
                  style={{ 
                    pointerEvents: isActive ? 'auto' : 'none',
                    background: `linear-gradient(135deg, ${env.color.split(' ')[0].replace('from-', '')}, #0B0C10)` 
                  }}
                >
                  <div className="absolute inset-0 bg-obsidian/40 backdrop-blur-[2px]" />
                  
                  <div className="relative z-10 text-center space-y-8 max-w-3xl">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                      animate={{ scale: isActive ? 1 : 0.8, opacity: isActive ? 1 : 0, rotate: isActive ? 0 : -10 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="flex justify-center"
                    >
                      <div className="w-24 h-24 md:w-40 md:h-40 rounded-3xl bg-obsidian/60 border border-white/10 flex items-center justify-center shadow-2xl relative group/icon overflow-hidden">
                        <div className="absolute inset-0 bg-neon-red opacity-0 group-hover/icon:opacity-10 transition-opacity" />
                        <Icon className="w-12 h-12 md:w-20 md:h-20 text-neon-red drop-shadow-neon-red" />
                      </div>
                    </motion.div>
                    
                    <div>
                      <h3 className="font-display text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter italic pr-[0.5em] overflow-visible lg:inline-block pb-1">
                        {env.name}
                      </h3>
                      <p className="text-chrome/70 text-lg md:text-2xl font-bold italic leading-relaxed uppercase tracking-tight">
                        {env.description}
                      </p>
                    </div>

                    <div className="pt-8">
                      <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-black uppercase italic tracking-widest text-xs transition-all">
                        View Spec Sheet
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Side Navigation Buttons (Desktop) */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none hidden md:flex">
              <button
                onClick={() => setActiveEnvironment((prev) => (prev > 0 ? prev - 1 : environments.length - 1))}
                className="p-4 bg-obsidian/60 hover:bg-neon-red hover:text-white rounded-full transition-all duration-300 border border-white/10 text-chrome pointer-events-auto backdrop-blur-md group"
                aria-label="Previous environment"
              >
                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => setActiveEnvironment((prev) => (prev < environments.length - 1 ? prev + 1 : 0))}
                className="p-4 bg-obsidian/60 hover:bg-neon-red hover:text-white rounded-full transition-all duration-300 border border-white/10 text-chrome pointer-events-auto backdrop-blur-md group"
                aria-label="Next environment"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <div className="flex gap-3 p-2 bg-steel-dark/50 rounded-full border border-white/5 backdrop-blur-xl">
              {environments.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveEnvironment(index)}
                  className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden ${
                    index === activeEnvironment
                      ? "bg-neon-red w-12 shadow-neon-red"
                      : "bg-white/10 w-2 hover:bg-white/30"
                  }`}
                  aria-label={`Go to ${environments[index].name}`}
                >
                  {index === activeEnvironment && (
                    <motion.div 
                      className="absolute inset-0 bg-white/30"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


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
    <section className="py-20 relative overflow-hidden">
      {/* Curved divider */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-obsidian to-transparent" />
      <svg
        className="absolute top-0 left-0 right-0 w-full h-24"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
          fill="#0B0C10"
        />
      </svg>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4 italic uppercase tracking-tighter">
            Choose Your <span className="text-gold-champagne">Atmosphere</span>
          </h2>
          <p className="text-bone/70 text-lg">
            Each shop features curated decor packages and custom environments
          </p>
        </div>

        <div className="relative">
          {/* Carousel */}
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-slate/30">
            {environments.map((env, index) => {
              const Icon = env.icon;
              const isActive = index === activeEnvironment;

              return (
                <motion.div
                  key={env.id}
                  initial={{ opacity: 0, x: index === activeEnvironment ? 0 : index > activeEnvironment ? 100 : -100 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: (index - activeEnvironment) * 100,
                    scale: isActive ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className={`absolute inset-0 bg-linear-to-br ${env.color} flex items-center justify-center`}
                  style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                >
                  <div className="text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: isActive ? 1 : 0.8, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="flex justify-center"
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gold-champagne/20 border-2 border-gold-champagne flex items-center justify-center">
                        <Icon className="w-12 h-12 md:w-16 md:h-16 text-gold-champagne" />
                      </div>
                    </motion.div>
                    <h3 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4 uppercase tracking-tighter">
                      {env.name}
                    </h3>
                    <p className="text-bone/70 text-xl max-w-2xl mx-auto px-4 italic">{env.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveEnvironment((prev) => (prev > 0 ? prev - 1 : environments.length - 1))}
              className="p-3 bg-slate/50 hover:bg-slate/80 rounded-full transition-colors duration-150 border border-gold-champagne/20"
              aria-label="Previous environment"
            >
              <ChevronLeft className="w-6 h-6 text-bone" />
            </button>

            <div className="flex gap-2">
              {environments.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveEnvironment(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-150 ${
                    index === activeEnvironment
                      ? "bg-gold-champagne w-8"
                      : "bg-bone/30 hover:bg-bone/50"
                  }`}
                  aria-label={`Go to ${environments[index].name}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveEnvironment((prev) => (prev < environments.length - 1 ? prev + 1 : 0))}
              className="p-3 bg-slate/50 hover:bg-slate/80 rounded-full transition-colors duration-150 border border-gold-champagne/20"
              aria-label="Next environment"
            >
              <ChevronRight className="w-6 h-6 text-bone" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


"use client";

import { motion } from "framer-motion";
import { Check, Zap, Gauge, Settings, Shield, Award } from "lucide-react";

interface MembershipTierCardProps {
  name: string;
  price: number;
  visitsIncluded: number;
  description?: string;
  isHighlighted?: boolean;
  isUnlimited?: boolean;
  onSelect?: () => void;
}

export default function MembershipTierCard({
  name,
  price,
  description,
  isHighlighted = false,
  isUnlimited = false,
  onSelect,
}: MembershipTierCardProps) {
  // Map names to icons
  const getIcon = (tierName: string) => {
    const n = tierName.toUpperCase();
    if (n === "STOCK") return <Settings className="w-6 h-6" />;
    if (n === "MODIFIED") return <Gauge className="w-6 h-6" />;
    if (n === "TURBO") return <Zap className="w-6 h-6" />;
    if (n === "SUPERCHARGED") return <Award className="w-6 h-6" />;
    return <Shield className="w-6 h-6" />;
  };

  const getTierColor = (tierName: string) => {
    const n = tierName.toUpperCase();
    if (n === "SUPERCHARGED") return "text-neon-red shadow-neon-red";
    return "text-chrome";
  };

  const features = description?.split(',').map(f => f.trim()) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl p-8 border-2 transition-all duration-300 overflow-hidden flex flex-col h-full ${
        isHighlighted
          ? "bg-carbon border-neon-red shadow-[0_0_30px_rgba(255,49,49,0.15)] scale-105 z-10"
          : "bg-steel-dark/80 border-white/10 hover:border-white/30"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {isHighlighted && (
        <div className="absolute top-0 right-0 px-6 py-1.5 bg-neon-red text-white font-display text-[10px] font-black uppercase tracking-[0.2em] -rotate-0 rounded-bl-xl shadow-neon-red">
          Recommended Gear
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 relative">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${isHighlighted ? "border-neon-red/50 text-neon-red" : "text-chrome"}`}>
          {getIcon(name)}
        </div>
        <div>
          <h3 className={`font-display text-3xl font-black uppercase italic tracking-tighter ${isHighlighted ? "text-white" : "text-chrome"}`}>
            {name}
          </h3>
          <p className="text-[10px] text-chrome/40 font-bold uppercase tracking-[0.2em]">Grade Level</p>
        </div>
      </div>

      <div className="mb-8 relative">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-5xl font-black text-white italic tracking-tighter">${price}</span>
          <span className="text-chrome/50 font-display italic">/mo</span>
        </div>
        <p className="text-xs text-chrome/60 uppercase font-bold tracking-widest italic">
          High Performance Protocol
        </p>
      </div>

      <div className="space-y-4 mb-10 flex-1 relative">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${isHighlighted ? "bg-neon-red shadow-neon-red" : "bg-chrome/30 group-hover:bg-chrome"}`} />
            <span className={`text-sm font-body transition-colors duration-300 ${isHighlighted ? "text-white" : "text-chrome/70 group-hover:text-chrome"}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onSelect}
        className={`w-full py-4 rounded-xl font-display text-lg font-black uppercase italic tracking-widest transition-all duration-300 relative overflow-hidden group/btn ${
          isHighlighted
            ? "bg-neon-red text-white shadow-neon-red hover:bg-racing-red"
            : "bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white"
        }`}
      >
        <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover/btn:translate-x-[250%] transition-transform duration-700" />
        Select {name}
      </button>
    </motion.div>
  );
}


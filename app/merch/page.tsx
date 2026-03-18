import { ShoppingBag, Wrench, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Merch | Mancave Barbershops",
  description: "Official Mancave Barbershops gear and provisions. Coming soon.",
};

export default function MerchPage() {
  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="container mx-auto px-4 py-16 relative z-10 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          <div className="w-24 h-24 bg-neon-red/10 border border-neon-red/30 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,49,49,0.2)]">
            <ShoppingBag className="w-10 h-10 text-neon-red" />
          </div>

          <h1 className="font-display text-5xl md:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter">
            Garage <span className="text-neon-red">Provisions</span>
          </h1>
          
          <p className="text-chrome/60 text-lg md:text-xl font-bold uppercase italic tracking-widest max-w-xl mx-auto mb-16 leading-relaxed">
            The supply line is currently under construction. High-performance gear and premium grooming products drop soon.
          </p>

          <div className="relative mb-16 group inline-block">
            <div className="absolute inset-0 bg-neon-red blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
            <Image
              src="/images/merch.png"
              alt="Mancave Merch Preview"
              width={400}
              height={400}
              className="relative z-10 drop-shadow-2xl opacity-80 group-hover:opacity-100 grayscale transform group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 mx-auto"
            />
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase italic tracking-widest rounded-xl transition-all border border-white/10 group"
          >
            <ArrowLeft className="w-5 h-5 text-neon-red group-hover:-translate-x-1 transition-transform" />
            Return to Hub
          </Link>

        </div>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/hooks";

export default function Footer() {
  const { user, isAdmin } = useUser();

  return (
    <footer id="global-footer" className="bg-obsidian border-t border-white/5 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-2 md:col-span-3">
          <Image src="/images/new-logo.png" alt="Mancave Logo" width={180} height={60} className="mb-6 h-10 w-auto" />
          <h4 className="font-display text-4xl md:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none pr-[0.4em] overflow-visible w-fit">Mancave <span className="chrome-text">Barbershops{"\u00A0"}</span></h4>
          <p className="text-chrome/50 text-sm italic">High Performance Haircuts. Engineered Aesthetics.</p>
        </div>
        <div>
          <h4 className="font-display font-black text-white mb-6 uppercase tracking-[0.2em] text-[10px] italic">Operational Hub</h4>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-chrome/60">
            <li><Link href="/locations" className="hover:text-neon-red transition-colors italic">Garages</Link></li>
            <li><Link href="/membership" className="hover:text-neon-red transition-colors italic">Performance Grades</Link></li>
            <li><Link href="/book" className="hover:text-neon-red transition-colors italic">Service Bay</Link></li>
            <li><Link href="/stylists" className="hover:text-neon-red transition-colors italic">Technicians</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-black text-white mb-6 uppercase tracking-[0.2em] text-[10px] italic">Dashboard</h4>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-chrome/60">
            {user && (
              <li><Link href="/account" className="hover:text-neon-red transition-colors italic">Driver Account</Link></li>
            )}
            {isAdmin && (
              <li><Link href="/admin" className="hover:text-neon-red transition-colors italic">Mission Control</Link></li>
            )}
            {!user && (
              <>
                <li><Link href="/login" className="hover:text-neon-red transition-colors italic">Login</Link></li>
                <li><Link href="/register" className="hover:text-neon-red transition-colors italic">Register</Link></li>
              </>
            )}
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col justify-end mt-8 md:mt-0">
          <p className="text-chrome/20 text-[10px] font-bold uppercase tracking-[0.1em]">© {new Date().getFullYear()} Man Cave Barber Shops. All Rights Reserved. Engineered by V8 Digital.</p>
        </div>

        {/* Merch Image - Bottom Right */}
        <div className="col-span-2 md:col-span-2 flex justify-center md:justify-end items-end mt-12 md:mt-0">
          <Link href="/merch" className="group">
            <Image 
              src="/images/merch.png" 
              alt="Mancave Merch" 
              width={250} 
              height={250} 
              className="w-48 md:w-56 h-auto object-contain drop-shadow-[0_10px_20px_rgba(255,49,49,0.15)] group-hover:scale-105 group-hover:drop-shadow-[0_10px_25px_rgba(255,49,49,0.3)] transition-all duration-500" 
            />
            <p className="text-center md:text-right text-neon-red font-display italic uppercase text-[10px] tracking-widest mt-4 group-hover:text-racing-red transition-colors">
              Cop the Uniform {"\u2192"}
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
}

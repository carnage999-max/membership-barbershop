"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, ShoppingBag, Loader2, Phone, Calendar, Check, Zap, Users, Gauge, Fuel, Shield, Wrench } from "lucide-react";
import WaitTimeBadge from "@/components/WaitTimeBadge";
import StylistCard from "@/components/StylistCard";
import QueueTokenWidget from "@/components/QueueTokenWidget";
import Image from "next/image";
import { locations as locationsApi, tokenStorage, queue as queueApi } from "@/lib/api-client";
import { useParams, useRouter } from "next/navigation";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";

export default function LocationDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { alert } = useConfirmation();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [joiningQueue, setJoiningQueue] = useState(false);
  const [signatureSelected, setSignatureSelected] = useState(false);

  useEffect(() => {
    async function loadLocation() {
      try {
        const result = await locationsApi.getById(slug as string);
        setLocation(result.location);
        
        // Check if user is already in queue here
        const token = tokenStorage.get();
        if (token) {
          try {
            const queuePos = await queueApi.getMyPosition(token);
            if (queuePos.queueEntry && queuePos.queueEntry.locationId === result.location.id) {
              setCheckedIn(true);
            }
          } catch (e) {}
        }
      } catch (error) {
        console.error("Failed to load location:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadLocation();
  }, [slug]);

  const handleCheckIn = async () => {
    const token = tokenStorage.get();
    if (!token) {
      router.push(`/login?redirect=/locations/${slug}`);
      return;
    }

    setJoiningQueue(true);
    try {
      await queueApi.join(location.id, token);
      setCheckedIn(true);
      toast.success(`Check-in successful at ${location.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Diagnostics failed");
    } finally {
      setJoiningQueue(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-red/20 border-t-neon-red rounded-full animate-spin mb-6 shadow-neon-red" />
        <p className="text-chrome/50 font-black italic uppercase tracking-[0.3em] text-xs animate-pulse">Scanning Shop Details...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center text-white">
        <h1 className="text-6xl font-display font-black mb-4 uppercase italic tracking-tighter">Shop Offline</h1>
        <p className="text-chrome/60 mb-8 uppercase font-bold italic tracking-widest">This location is currently offline.</p>
        <button onClick={() => router.push('/locations')} className="px-10 py-4 bg-neon-red text-white font-display font-black uppercase italic tracking-widest rounded-xl shadow-neon-red">
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {checkedIn && (
        <QueueTokenWidget
          locationName={location.name}
          estimatedWait={location.currentWaitTime}
          queuePosition={1} // In a real app, fetch actual position
          onSwitchLocation={() => setCheckedIn(false)}
          onCancel={() => setCheckedIn(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="relative h-64 md:h-[500px] rounded-[2rem] overflow-hidden bg-steel-dark mb-10 border border-white/10 shadow-2xl">
            <Image
              src={location.photoUrl || "/images/new-logo.png"}
              alt={location.name}
              fill
              className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neon-red text-white text-[10px] font-black uppercase italic tracking-widest rounded-lg mb-6 shadow-neon-red">
                Premium Shop Location
              </div>
              <h1 className="font-display text-6xl md:text-9xl font-black text-white mb-4 italic uppercase tracking-tighter leading-none contrast-125">
                {location.name}
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-6 text-chrome/80">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-neon-red" />
                  <span className="font-black italic uppercase tracking-widest text-sm">{location.address}, {location.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-neon-red" />
                  <span className="font-black italic uppercase tracking-widest text-sm">{location.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-[10px] text-chrome/50 px-8 font-black uppercase tracking-[0.2em] italic">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neon-red" />
              <span>{location.openTime} — {location.closeTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-neon-red text-neon-red" />
              <span className="text-white">4.9 MASTER GRADE</span>
            </div>
            <div className="flex items-center gap-2 bg-neon-red/10 text-neon-red px-3 py-1 rounded-lg border border-neon-red/30 shadow-neon-red">
              <div className="w-1.5 h-1.5 bg-neon-red rounded-full animate-pulse shadow-[0_0_8px_rgba(255,49,49,1)]" />
              <span className="font-black">Shop Open</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Live Wait Module */}
            <div className="bg-steel-dark/60 backdrop-blur-2xl rounded-[2rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-red/5 rounded-full blur-3xl -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="font-display text-4xl font-black text-white uppercase italic tracking-tighter mb-1">
                    Shop <span className="text-neon-red">Status</span>
                  </h2>
                  <p className="text-[10px] text-chrome/40 font-black uppercase tracking-widest italic leading-none">Real-time Performance Data</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-chrome/40 font-black uppercase tracking-widest mb-1 italic">Active Queue</p>
                  <p className="font-display text-7xl font-black text-neon-red leading-none italic tracking-tighter shadow-neon-red">
                    {location.queueLength || 0}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
                <div className="flex-1 w-full bg-obsidian/60 rounded-2xl p-8 border border-white/5 group/wait transition-all">
                  <p className="text-[10px] text-chrome/40 font-black uppercase tracking-widest mb-6 italic">Estimated Wait</p>
                  <WaitTimeBadge
                    minutes={location.currentWaitTime}
                    confidenceBand={location.confidenceBand}
                    status={location.status}
                    pulse={true}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6 w-full md:w-auto min-w-[320px]">
                  <div className="bg-obsidian/40 rounded-2xl p-6 border border-white/5">
                    <p className="text-[10px] text-chrome/40 font-black uppercase tracking-widest mb-2 italic">Pit Crew</p>
                    <p className="font-display text-3xl font-black text-white italic tracking-tighter">
                      {location.stylistsOnShift || 0} STAFF
                    </p>
                  </div>
                  <div className="bg-obsidian/40 rounded-2xl p-6 border border-white/5">
                    <p className="text-[10px] text-chrome/40 font-black uppercase tracking-widest mb-2 italic">Cycle Time</p>
                    <p className="font-display text-3xl font-black text-white italic tracking-tighter">
                      20M
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckIn}
                disabled={joiningQueue || checkedIn}
                className={`w-full relative group px-8 py-6 ${checkedIn ? 'bg-white/5 cursor-not-allowed text-chrome/50' : 'bg-neon-red hover:bg-racing-red text-white shadow-neon-red'} font-display md:text-2xl text-xl font-black rounded-2xl transition-all duration-500 overflow-hidden`}
              >
                <div className="relative z-10 flex items-center justify-center gap-4">
                  {joiningQueue ? <Loader2 className="w-8 h-8 animate-spin" /> : <>
                    <span className="italic uppercase tracking-[0.2em] text-center">{checkedIn ? "You are already on the queue" : "JOIN THE QUEUE"}</span>
                    {!checkedIn && <Check className="w-6 h-6 text-white flex-shrink-0 group-hover:animate-bounce" />}
                  </>}
                </div>
                {!checkedIn && <div className="absolute inset-0 bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />}
              </button>
            </div>

            {/* Crew Roster */}
            <div>
              <div className="flex items-center justify-between mb-10 text-white">
                <h2 className="font-display text-5xl font-black italic uppercase tracking-tighter">
                  Shop <span className="text-neon-red">Stylists</span>
                </h2>
                <div className="hidden md:block h-px bg-white/10 flex-1 mx-10" />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {location.stylists && location.stylists.length > 0 ? (
                  location.stylists.map((stylist: any) => (
                    <StylistCard 
                      key={stylist.id} 
                      {...stylist} 
                      name={`${stylist.firstName} ${stylist.lastName}`}
                      photo={stylist.photoUrl}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-chrome/30 font-black uppercase italic tracking-[0.3em]">No Active Stylists</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-12">

            {/* Performance Grade Promo */}
            <div className="bg-obsidian/80 rounded-[2rem] p-10 border border-neon-red/20 text-center relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all duration-1000 rotate-12">
                 <Gauge className="w-48 h-48 text-neon-red" />
               </div>
               <h3 className="font-display text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">UNLIMITED CUTS. ONE PRICE.</h3>
               <p className="text-sm text-chrome/50 mb-10 font-bold italic uppercase tracking-widest leading-relaxed">Join the Elite Members who treat their grooming like a high-performance engine.</p>
               <button onClick={() => router.push('/membership')} className="w-full relative py-5 bg-white text-black font-display font-black rounded-xl hover:bg-neon-red hover:text-white transition-all duration-500 uppercase italic tracking-widest text-lg group/btn overflow-hidden shadow-xl">
                 <span className="relative z-10">VIEW MEMBERSHIPS</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

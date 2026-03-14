"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, ShoppingBag, Loader2, Phone, Calendar, Check } from "lucide-react";
import WaitTimeBadge from "@/components/WaitTimeBadge";
import StylistCard from "@/components/StylistCard";
import QueueTokenWidget from "@/components/QueueTokenWidget";
import Image from "next/image";
import { locations as locationsApi, tokenStorage, queue as queueApi } from "@/lib/api-client";
import { useParams, useRouter } from "next/navigation";

export default function LocationDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
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
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to join queue");
    } finally {
      setJoiningQueue(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold-champagne animate-spin" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center text-bone">
        <h1 className="text-4xl font-display font-bold mb-4 uppercase italic">Location Not Found</h1>
        <p className="text-bone/60 mb-8">This location has been decommissioned or moved.</p>
        <button onClick={() => router.push('/locations')} className="px-8 py-3 bg-gold-champagne text-ink font-bold rounded-xl">
          Return to Map
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      {checkedIn && (
        <QueueTokenWidget
          locationName={location.name}
          estimatedWait={location.currentWaitTime}
          queuePosition={1} // In a real app, fetch actual position
          onSwitchLocation={() => setCheckedIn(false)}
          onCancel={() => setCheckedIn(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden bg-wood-espresso mb-6 border border-gold-champagne/20">
            <Image
              src={location.photoUrl || "/logo.png"}
              alt={location.name}
              fill
              className="object-cover opacity-40 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-champagne text-ink text-[10px] font-bold uppercase rounded-full mb-4 mt-2">
                Flagship Lounge
              </div>
              <h1 className="font-display text-5xl md:text-8xl font-bold text-bone mb-3 italic uppercase tracking-tighter">
                {location.name}
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-bone/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold-champagne" />
                  <span className="font-medium">{location.address}, {location.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gold-champagne" />
                  <span className="font-medium">{location.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-bone/70 px-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-champagne" />
              <span className="uppercase font-bold tracking-widest">{location.openTime} — {location.closeTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-gold-champagne text-gold-champagne" />
              <span className="font-bold">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-success/10 text-success px-2 py-1 rounded border border-success/20">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Store Open</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Live Wait Module */}
            <div className="bg-slate/50 backdrop-blur-md rounded-3xl p-8 border border-gold-champagne/20 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-3xl font-bold text-bone uppercase italic mb-1">
                    Waitlist <span className="text-gold-champagne">Stats</span>
                  </h2>
                  <p className="text-xs text-bone/40 font-bold uppercase tracking-widest">Real-time Telemetry</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-bone/40 font-bold uppercase tracking-widest mb-1">Active Queue</p>
                  <p className="font-display text-5xl font-bold text-gold-champagne leading-none">
                    {location.queueLength || 0}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="flex-1 w-full bg-obsidian/40 rounded-2xl p-6 border border-gold-champagne/10">
                  <p className="text-[10px] text-bone/40 font-bold uppercase tracking-widest mb-4">Estimated Readiness</p>
                  <WaitTimeBadge
                    minutes={location.currentWaitTime}
                    confidenceBand={location.confidenceBand}
                    status={location.status}
                    pulse={true}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto min-w-[300px]">
                  <div className="bg-obsidian/20 rounded-xl p-4 border border-gold-champagne/5">
                    <p className="text-[10px] text-bone/40 font-bold uppercase tracking-widest mb-1">Crew On-Shift</p>
                    <p className="font-display text-2xl font-bold text-bone">
                      {location.stylistsOnShift || 0}
                    </p>
                  </div>
                  <div className="bg-obsidian/20 rounded-xl p-4 border border-gold-champagne/5">
                    <p className="text-[10px] text-bone/40 font-bold uppercase tracking-widest mb-1">Avg Align Time</p>
                    <p className="font-display text-2xl font-bold text-bone">
                      20m
                    </p>
                  </div>
                </div>
              </div>

              {!checkedIn && (
                <button
                  onClick={handleCheckIn}
                  disabled={joiningQueue}
                  className="w-full relative group px-6 py-5 bg-red-crimson hover:bg-red-crimson/90 text-bone font-bold rounded-2xl transition-all duration-300 overflow-hidden shadow-2xl shadow-red-crimson/20"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {joiningQueue ? <Loader2 className="w-6 h-6 animate-spin" /> : <>
                      <span className="italic uppercase tracking-wider">Join Waitlist</span>
                    </>}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              )}
            </div>

            {/* Crew Roster */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-4xl font-bold text-bone italic uppercase tracking-tighter">
                  The <span className="text-gold-champagne">Crew</span> Roster
                </h2>
                <div className="hidden md:block h-px bg-gold-champagne/20 flex-1 mx-8" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
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
                  <div className="col-span-full py-12 text-center bg-slate/10 rounded-2xl border border-gold-champagne/5">
                    <p className="text-bone/40 font-bold uppercase tracking-widest">No Crew Active in Shop</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Concours Detail Add-on */}
            <div className="bg-slate/50 backdrop-blur-md rounded-3xl p-8 border border-gold-champagne/20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-bone uppercase italic">
                    <span className="text-gold-champagne">Concours</span> Detail
                  </h3>
                  <p className="text-[10px] text-bone/40 font-bold uppercase tracking-widest mt-1">Full Maintenance Protocol</p>
                </div>
                <button
                  onClick={() => setSignatureSelected(!signatureSelected)}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                    signatureSelected ? "bg-gold-champagne" : "bg-obsidian border border-gold-champagne/20"
                  }`}
                >
                  <motion.div
                    className={`absolute top-1 w-6 h-6 rounded-full shadow-lg ${signatureSelected ? "bg-ink" : "bg-bone/20"}`}
                    animate={{ x: signatureSelected ? 26 : 2 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-bone/70">
                  <div className="w-5 h-5 rounded-full bg-gold-champagne/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-gold-champagne" />
                  </div>
                  <span>High-Pressure Steam Treatment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-bone/70">
                  <div className="w-5 h-5 rounded-full bg-gold-champagne/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-gold-champagne" />
                  </div>
                  <span>Chassis (Scalp) Calibration</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-bone/70">
                  <div className="w-5 h-5 rounded-full bg-gold-champagne/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-gold-champagne" />
                  </div>
                  <span>Concours Polish (Styling)</span>
                </div>
              </div>

              {signatureSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold-champagne/5 border border-gold-champagne/20 rounded-xl p-4 text-center"
                >
                  <p className="text-[10px] font-bold text-gold-champagne uppercase tracking-widest mb-1">Estimated Extension</p>
                  <p className="text-bone font-display text-xl">+15 MINUTES</p>
                </motion.div>
              )}
            </div>

            {/* Membership Barbershop Promo */}
            <div className="bg-wood-espresso/40 rounded-3xl p-8 border border-gold-champagne/30 text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Star className="w-24 h-24" />
               </div>
               <h3 className="font-display text-xl font-bold text-bone mb-2">NEVER PAY PER CUT</h3>
               <p className="text-sm text-bone/60 mb-6 font-medium">Join 4,000+ members who treat their grooming like a performance shop.</p>
               <button onClick={() => router.push('/membership')} className="w-full py-4 bg-bone text-ink font-bold rounded-2xl hover:bg-white transition-colors uppercase italic tracking-widest text-sm">
                 View Membership Plans
               </button>
            </div>

            {/* Retail Pickup Strip */}
            <div className="bg-slate/50 backdrop-blur-md rounded-3xl p-8 border border-gold-champagne/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-gold-champagne" />
                <h3 className="font-display text-2xl font-bold text-bone uppercase italic">
                  Barbershop <span className="text-gold-champagne">Retail</span>
                </h3>
              </div>
              <div className="space-y-6">
                {[
                  { name: "Chassis Wax", price: 24, cat: "Hair Product" },
                  { name: "Clear Coat Shine", price: 18, cat: "Finishing Spray" }
                ].map((product, i) => (
                  <div
                    key={i}
                    className="group bg-obsidian/20 rounded-2xl p-4 border border-gold-champagne/5 hover:border-gold-champagne/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] text-bone/40 font-bold uppercase tracking-widest">{product.cat}</p>
                        <p className="text-bone font-bold">{product.name}</p>
                      </div>
                      <p className="text-gold-champagne font-display text-xl font-bold">${product.price}</p>
                    </div>
                    <button className="w-full py-2 bg-slate/50 group-hover:bg-gold-champagne group-hover:text-ink text-bone text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all">
                      Add to Pickup
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

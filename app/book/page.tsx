"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import LocationCard from "@/components/LocationCard";
import { locations as locationsApi, queue as queueApi, tokenStorage } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";

export default function BookPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { alert } = useConfirmation();

  useEffect(() => {
    async function loadLocations() {
      try {
        const result = await locationsApi.getAll();
        setLocations(result.locations);
      } catch (error) {
        console.error("Failed to load locations:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLocations();
  }, []);

  const handleCheckIn = async () => {
    if (!selectedLocation) return;
    
    const token = tokenStorage.get();
    if (!token) {
      router.push("/login?redirect=/book");
      return;
    }

    setJoining(true);
    try {
      await queueApi.join(selectedLocation, token);
      setSuccess(true);
      setTimeout(() => {
        router.push("/account");
      }, 2000);
      toast.success("Pit lane access granted. Heading to bay...");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Diagnostics failed");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-red/20 border-t-neon-red rounded-full animate-spin mb-6 shadow-neon-red" />
        <p className="text-chrome/50 font-black italic uppercase tracking-[0.3em] text-xs animate-pulse">Scanning Garages...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-8xl font-black text-white mb-4 italic uppercase tracking-tighter leading-none">
            Enter <span className="text-neon-red">The Bay</span>
          </h1>
          <p className="text-chrome/60 text-lg italic uppercase tracking-widest font-bold">
            Secure your spot in the Man Cave Barber Shops pit lane.
          </p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto py-24 text-center bg-steel-dark border border-neon-red/30 rounded-3xl shadow-neon-red"
          >
            <CheckCircle2 className="w-24 h-24 text-neon-red mx-auto mb-8 drop-shadow-[0_0_15px_rgba(255,49,49,0.5)]" />
            <h2 className="text-4xl font-display font-black text-white mb-2 uppercase italic tracking-tighter">Pit Spot Reserved</h2>
            <p className="text-chrome/60 italic">Navigating to driver dashboard...</p>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {locations.length > 0 ? (
                locations.map((location) => (
                  <motion.div
                    key={location.id}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedLocation(location.id)}
                    className={`cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden group ${
                      selectedLocation === location.id
                        ? "ring-4 ring-neon-red shadow-neon-red"
                        : "opacity-80 hover:opacity-100 border border-white/5"
                    }`}
                  >
                    <LocationCard 
                      {...location} 
                      waitMinutes={location.currentWaitTime}
                      address={`${location.address}, ${location.city}`}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-24 text-center bg-steel-dark rounded-3xl border border-white/5">
                  <p className="text-chrome/40 uppercase font-black italic tracking-widest">No service bays detected in your sector.</p>
                </div>
              )}
            </div>

            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-steel-dark/95 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-red/5 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <div className="flex items-center gap-6 mb-10 relative z-10">
                  <div className="w-16 h-16 bg-neon-red rounded-2xl flex items-center justify-center shadow-neon-red group overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/10 skew-x-[-20deg] -translate-x-full animate-[shimmer_2s_infinite]" />
                    <Clock className="text-white w-8 h-8 relative z-10" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-black text-white uppercase italic tracking-tighter">
                      Secure Pit Spot
                    </h2>
                    <p className="text-xs text-chrome/60 font-black uppercase tracking-widest mt-1">Real-time Bay Synchronization Active</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <button 
                    disabled={joining}
                    onClick={handleCheckIn}
                    className="group relative px-8 py-6 bg-neon-red hover:bg-racing-red text-white font-display text-xl font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-4 overflow-hidden shadow-neon-red"
                  >
                    {joining ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <span className="relative z-10 italic uppercase tracking-widest">ENTER PIT LANE</span>
                        <div className="absolute inset-0 bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
                      </>
                    )}
                  </button>
                  <button 
                    className="px-8 py-6 bg-white/5 hover:bg-white/10 text-chrome font-black rounded-xl transition-all duration-300 border border-white/10 italic uppercase tracking-widest text-sm"
                  >
                    RESERVE SESSION
                  </button>
                </div>
                
                <p className="mt-10 text-[10px] text-center text-chrome/30 font-black uppercase tracking-[0.4em] italic">
                  MAN CAVE GARAGE ENGINE v1.0
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

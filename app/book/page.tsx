"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import LocationCard from "@/components/LocationCard";
import { locations as locationsApi, queue as queueApi, tokenStorage } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function BookPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to join queue");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold-champagne animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4 italic uppercase tracking-tighter">
            Book <span className="text-gold-champagne">Appointment</span>
          </h1>
          <p className="text-bone/70 text-lg">
            Secure your spot in the Membership Barbershop waitlist.
          </p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto py-16 text-center bg-slate/20 rounded-3xl border border-success/30"
          >
            <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold text-bone mb-2">Check-in Confirmed</h2>
            <p className="text-bone/60">Heading to your dashboard...</p>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {locations.length > 0 ? (
                locations.map((location) => (
                  <motion.div
                    key={location.id}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedLocation(location.id)}
                    className={`cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${
                      selectedLocation === location.id
                        ? "ring-4 ring-gold-champagne shadow-2xl shadow-gold-champagne/20"
                        : "opacity-70 hover:opacity-100"
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
                <div className="col-span-full py-20 text-center bg-slate/10 rounded-3xl border border-gold-champagne/5">
                  <p className="text-bone/40">No Membership Barbershop locations found near you now.</p>
                </div>
              )}
            </div>

            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-slate/80 backdrop-blur-xl rounded-3xl p-8 border border-gold-champagne/30 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-red-crimson rounded-xl flex items-center justify-center shadow-lg shadow-red-crimson/30">
                    <Clock className="text-bone w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-bone uppercase tracking-wide">
                      Authorize Entry
                    </h2>
                    <p className="text-sm text-bone/60">Real-time queue synchronization active</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    disabled={joining}
                    onClick={handleCheckIn}
                    className="group relative px-6 py-5 bg-red-crimson hover:bg-red-crimson/90 text-bone font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                  >
                    {joining ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <span className="relative z-10 italic">CHECK IN</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </>
                    )}
                  </button>
                  <button 
                    className="px-6 py-5 bg-slate/50 hover:bg-slate/80 text-bone/70 hover:text-bone font-bold rounded-2xl transition-all duration-300 border border-gold-champagne/10 italic"
                  >
                    SCHEDULE LATER
                  </button>
                </div>
                
                <p className="mt-6 text-[10px] text-center text-bone/40 uppercase tracking-widest font-bold">
                  Membership Barbershop Operating System v1.0
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

"use client";

import HeroExperience from "@/components/HeroExperience";
import LocationCard from "@/components/LocationCard";
import FrequencySliderCalculator from "@/components/FrequencySliderCalculator";
import SuiteFeaturePanel from "@/components/SuiteFeaturePanel";
import AtmosphereEnvironments from "@/components/AtmosphereEnvironments";
import StylistCard from "@/components/StylistCard";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import PricingComparison from "@/components/PricingComparison";
import { motion } from "framer-motion";
import { Scissors, Zap, Gauge, BadgeCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { locations as locationsApi, stylists as stylistsApi } from "@/lib/api-client";

export default function Home() {
  const [nearbyShops, setNearbyShops] = useState<any[]>([]);
  const [featuredStylists, setFeaturedStylists] = useState<any[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingStylists, setLoadingStylists] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const shopsResult = await locationsApi.getAll();
        setNearbyShops(shopsResult.locations.slice(0, 3));
        setLoadingShops(false);

        const stylistsResult = await stylistsApi.getAll();
        setFeaturedStylists(stylistsResult.stylists.slice(0, 3));
        setLoadingStylists(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoadingShops(false);
        setLoadingStylists(false);
      }
    }
    fetchData();
  }, []);




  return (
    <main className="min-h-screen pt-[60px] md:pt-0">
      {/* HeroExperience */}
      <HeroExperience />

      {/* Live Wait Grid - Waitlist Cards */}
      <section className="py-20 bg-obsidian relative">
        {/* Curved divider */}
        <svg
          className="absolute top-0 left-0 right-0 w-full h-24 -translate-y-1"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 50C480 60 600 60 720 55C840 50 960 40 1080 35C1200 30 1320 30 1380 30L1440 30V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z"
            fill="#0B0C10"
          />
        </svg>

        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4">
              Live Wait Times
            </h2>
            <p className="text-bone/70 text-lg">
              Real-time availability at nearby shops
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {loadingShops ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-gold-champagne animate-spin mb-4" />
                <p className="text-bone/60">Verifying live availability...</p>
              </div>
            ) : nearbyShops.length > 0 ? (
              nearbyShops.map((shop, index) => (
                <LocationCard key={shop.id} {...shop} waitMinutes={shop.currentWaitTime} address={`${shop.address}, ${shop.city}`} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-bone/40">
                No locations available near you now.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Comparison - Choose Your Driving Style */}
      <PricingComparison />

      {/* The Build Process - Step-by-step */}
      <section className="py-24 bg-carbon relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter pr-[0.4em] overflow-visible lg:inline-block">
              The <span className="neon-text-red text-shadow-neon">Build Process{"\u00A0"}</span>
            </h2>
            <p className="text-chrome/60 text-lg max-w-2xl mx-auto italic font-body">
              Precision engineering for your profile. Every visit follows our rigorous performance protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", icon: <Gauge className="w-8 h-8" />, title: "Book Appointment", description: "Select your technician and time slot online." },
              { step: "02", icon: <Scissors className="w-8 h-8" />, title: "Choose Your Style", description: "Consult with our specialist on your desired setup." },
              { step: "03", icon: <Zap className="w-8 h-8" />, title: "Precision Cut", description: "Execute the build with master-level calibration." },
              { step: "04", icon: <BadgeCheck className="w-8 h-8" />, title: "Drive Out Fresh", description: "Final inspection and polishing before departure." },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 bg-steel-dark/50 border border-white/5 hover:border-neon-red/30 transition-all duration-300 rounded-2xl relative"
              >
                <div className="absolute top-4 right-6 font-display text-4xl font-black text-white/5 group-hover:text-neon-red/10 transition-colors">
                  {step.step}
                </div>
                <div className="text-neon-red mb-6">
                  {step.icon}
                </div>
                <h3 className="font-display text-2xl font-black text-white mb-2 uppercase italic tracking-tight">
                  {step.title}
                </h3>
                <p className="text-chrome/50 italic text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Garage - Philosophy */}
      <section className="py-24 bg-obsidian relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                  <span className="text-[10px] text-chrome font-black uppercase tracking-[0.3em]">Operational Philosophy</span>
                </div>
                <h2 className="font-display text-5xl md:text-7xl font-black text-white mb-8 uppercase italic tracking-tighter leading-none pr-[0.4em] overflow-visible w-fit">
                  The <span className="chrome-text">Garage{"\u00A0"}</span>
                </h2>
                <p className="text-chrome/70 text-xl italic font-body mb-8 leading-relaxed">
                  We don't just cut hair; we engineer aesthetics. Our shops are designed as high-performance havens where the tools are sharp, the technicians are experts, and the atmosphere is pure adrenaline. 
                </p>
                <div className="space-y-4">
                  {[
                    "Automotive Performance Aesthetic",
                    "Master-Craftsman Calibration",
                    "Priority Membership Lanes",
                    "VIP Recovery Lounges"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-neon-red shadow-neon-red" />
                       <span className="text-white font-display uppercase italic font-bold tracking-wide">{item}</span>
                    </div>
                  ))}
                </div>
             </motion.div>
             
             <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden border-2 border-white/10"
             >
                <Image 
                  src="/images/men-barbing hair-mancave-theme.png"
                  alt="Man Cave Experience"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
             </motion.div>
          </div>
        </div>
      </section>

      {/* The Pit Crew - Stylists */}
      <section className="py-24 bg-carbon relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-7xl font-black text-white mb-4 italic uppercase tracking-tighter pr-[0.4em] overflow-visible lg:inline-block">
              The <span className="neon-text-red text-shadow-neon">Pit Crew{"\u00A0"}</span>
            </h2>
            <p className="text-chrome/60 text-lg max-w-2xl mx-auto italic">
              Meet our master technicians. Highly trained specialists ready to calibrate your specific style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loadingStylists ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-16 h-16 text-neon-red animate-spin mb-4 shadow-neon-red" />
                <p className="text-chrome/60 font-display uppercase tracking-widest italic animate-pulse">Scanning Technician Roster...</p>
              </div>
            ) : featuredStylists.length > 0 ? (
              featuredStylists.map((stylist) => (
                <StylistCard
                  key={stylist.id}
                  {...stylist}
                  name={`${stylist.firstName} ${stylist.lastName}`}
                  onFollow={() => console.log(`Follow ${stylist.firstName}`)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-chrome/40 font-display uppercase italic">All Technicians currently in maintenance.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Locations - Live Hubs */}
      <section className="py-24 bg-obsidian relative border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter pr-[0.5em] overflow-visible lg:inline-block">
              Performance <span className="chrome-text">Hubs{"\u00A0"}</span>
            </h2>
            <p className="text-chrome/60 text-lg">
              Real-time availability at our regional garages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loadingShops ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-neon-red animate-spin mb-4" />
                <p className="text-chrome/60 font-display uppercase italic tracking-[0.2em]">Locating Garages...</p>
              </div>
            ) : nearbyShops.length > 0 ? (
              nearbyShops.map((shop) => (
                <LocationCard key={shop.id} {...shop} waitMinutes={shop.currentWaitTime} address={`${shop.address}, ${shop.city}`} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-chrome/30 font-display uppercase italic">
                No active hubs detected in your sector.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Performance Metrics - Hidden until real data is available */}
      {/* <PerformanceMetrics /> */}

</main>
  );
}

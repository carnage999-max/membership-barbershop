"use client";

import HeroGarageDoor from "@/components/HeroGarageDoor";
import LocationCard from "@/components/LocationCard";
import FrequencySliderCalculator from "@/components/FrequencySliderCalculator";
import PrivacyBoothFeaturePanel from "@/components/PrivacyBoothFeaturePanel";
import CarsWall from "@/components/CarsWall";
import StylistCard from "@/components/StylistCard";
import ReviewsLapTimes from "@/components/ReviewsLapTimes";
import { motion } from "framer-motion";
import { Scissors, Sparkles, Zap, Droplets, Hand, Sparkle, Loader2 } from "lucide-react";
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

  const mvpSteps = [
    { icon: <Zap className="w-6 h-6" />, title: "Precision Entry", description: "Seamless intake" },
    { icon: <Scissors className="w-6 h-6" />, title: "Precision Alignment", description: "Profile trim" },
    { icon: <Droplets className="w-6 h-6" />, title: "Thermal Gasket Reset", description: "Steam treatment" },
    { icon: <Sparkles className="w-6 h-6" />, title: "High-Pressure Degrease", description: "Deep clean" },
    { icon: <Hand className="w-6 h-6" />, title: "Chassis Calibration", description: "Scalp & neck" },
    { icon: <Sparkle className="w-6 h-6" />, title: "Clear Coat Polish", description: "Final finish" },
  ];


  return (
    <main className="min-h-screen pt-[60px] md:pt-0">
      {/* HeroGarageDoor */}
      <HeroGarageDoor />

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
                <p className="text-bone/60">Loading engine stats...</p>
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

      {/* Membership First with Calculator */}
      <section className="py-20 bg-slate/10 relative">
        {/* Curved divider */}
        <svg
          className="absolute top-0 left-0 right-0 w-full h-24 -translate-y-1"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#2A2E36"
            fillOpacity="0.1"
          />
        </svg>

        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4">
              Membership Barbershop First
            </h2>
            <p className="text-bone/70 text-lg">
              Find your perfect plan based on how often you cut
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FrequencySliderCalculator />
          </div>
        </div>
      </section>

      {/* MVP Ritual - Car-themed Service Steps */}
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
              The Concours Detail
            </h2>
            <p className="text-bone/70 text-lg max-w-2xl mx-auto">
              Haircut as the tune-up. Shampoo and massage as the full detail.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mvpSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20 hover:border-gold-champagne/40 transition-all duration-150 text-center"
              >
                <div className="text-gold-champagne mb-3 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-bone mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-bone/60">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Booths */}
      <section className="py-20 bg-slate/10 relative">
        {/* Curved divider */}
        <svg
          className="absolute top-0 left-0 right-0 w-full h-24 -translate-y-1"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#2A2E36"
            fillOpacity="0.1"
          />
        </svg>

        <div className="container mx-auto px-4 space-y-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4">
              Privacy Booths
            </h2>
            <p className="text-bone/70 text-lg">
              Premium privacy, not secrecy
            </p>
          </div>

          <PrivacyBoothFeaturePanel
            title="Divider Display"
            description="Elegant dividers create intimate spaces while maintaining the open, luxurious atmosphere of our garage-inspired lounges."
            reverse={false}
          />

          <PrivacyBoothFeaturePanel
            title="Rear Curtains"
            description="Optional privacy curtains provide complete seclusion when you need it, available on request for your comfort."
            reverse={true}
          />

          <PrivacyBoothFeaturePanel
            title="Quiet Lighting"
            description="Warm, focused lighting creates a calming environment that frames privacy as premium luxury, not isolation."
            reverse={false}
          />
        </div>
      </section>

      {/* Cars Wall */}
      <CarsWall />

      {/* Stylists You Can Follow */}
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
              Stylists You Can Follow
            </h2>
            <p className="text-bone/70 text-lg">
              Get alerts when your preferred stylist is on shift
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {loadingStylists ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-gold-champagne animate-spin mb-4" />
                <p className="text-bone/60">Syncing crew roster...</p>
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
              <div className="col-span-full text-center py-20 text-bone/40">
                No crew members available now.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews as Lap Times */}
      <ReviewsLapTimes />

      {/* Footer */}
      <footer className="bg-wood-espresso py-16 relative">
        {/* Curved divider */}
        <svg
          className="absolute top-0 left-0 right-0 w-full h-24 -translate-y-1"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 50C480 60 600 60 720 55C840 50 960 40 1080 35C1200 30 1320 30 1380 30L1440 30V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z"
            fill="#2B1D14"
          />
        </svg>

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="mb-4"
              />
              <p className="text-bone/60 text-sm">
                Precision Fast. Lounge-Level Luxury.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-bone mb-4">
                Locations
              </h3>
              <ul className="space-y-2 text-sm text-bone/60">
                <li><Link href="/locations" className="hover:text-gold-champagne transition-colors">Find a Shop</Link></li>
                <li><Link href="/locations/map" className="hover:text-gold-champagne transition-colors">Map View</Link></li>
                <li><Link href="/franchise" className="hover:text-gold-champagne transition-colors">Franchise</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-bone mb-4">
                Membership Barbershop
              </h3>
              <ul className="space-y-2 text-sm text-bone/60">
                <li><Link href="/membership" className="hover:text-gold-champagne transition-colors">View Plans</Link></li>
                <li><Link href="/membership/billing" className="hover:text-gold-champagne transition-colors">Billing</Link></li>
                <li><Link href="/gift" className="hover:text-gold-champagne transition-colors">Gift Membership</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-bone mb-4">
                Support
              </h3>
              <ul className="space-y-2 text-sm text-bone/60">
                <li><Link href="/support" className="hover:text-gold-champagne transition-colors">Help Center</Link></li>
                <li><Link href="/legal" className="hover:text-gold-champagne transition-colors">Legal</Link></li>
                <li><Link href="/careers" className="hover:text-gold-champagne transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gold-champagne/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-bone/60">
              <p>© 2026 Membership Barbershop. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/legal/terms" className="hover:text-gold-champagne transition-colors">Terms</Link>
                <Link href="/legal/privacy" className="hover:text-gold-champagne transition-colors">Privacy</Link>
                <Link href="/legal/auto-renew" className="hover:text-gold-champagne transition-colors">Auto-Renew</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

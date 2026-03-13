"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, Check, ShoppingBag } from "lucide-react";
import WaitTimeBadge from "@/components/WaitTimeBadge";
import StylistCard from "@/components/StylistCard";
import QueueTokenWidget from "@/components/QueueTokenWidget";
import Image from "next/image";

const locationData = {
  name: "Downtown Garage",
  address: "123 Main St, Downtown",
  hours: "Mon-Sat: 9am-8pm, Sun: 10am-6pm",
  waitMinutes: 12,
  confidenceBand: [10, 15] as [number, number],
  status: "available" as const,
  rating: 4.9,
  photo: "/logo.png",
  stylists: [
    {
      id: "1",
      name: "Mike Rodriguez",
      photo: undefined,
      specialties: ["Fade", "Beard", "Kids"],
      avgCutTime: 18,
      rating: 4.9,
      onShift: true,
      onBreak: false,
    },
    {
      id: "2",
      name: "Alex Chen",
      photo: undefined,
      specialties: ["Classic", "Line-up"],
      avgCutTime: 15,
      rating: 4.8,
      onShift: true,
      onBreak: true,
    },
    {
      id: "3",
      name: "Chris Johnson",
      photo: undefined,
      specialties: ["Fade", "Beard"],
      avgCutTime: 20,
      rating: 4.9,
      onShift: false,
    },
  ],
  queue: {
    active: 3,
    nextAvailable: "12 minutes",
    stylistsCutting: 2,
    stylistsFinishing: 1,
    onBreak: 1,
  },
};

export default function LocationDetailPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [mvpSelected, setMvpSelected] = useState(false);

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      {checkedIn && (
        <QueueTokenWidget
          locationName={locationData.name}
          estimatedWait={locationData.waitMinutes}
          queuePosition={4}
          onSwitchLocation={() => setCheckedIn(false)}
          onCancel={() => setCheckedIn(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-wood-espresso mb-6">
            <Image
              src={locationData.photo}
              alt={locationData.name}
              fill
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="font-display text-4xl md:text-6xl font-bold text-bone mb-2">
                {locationData.name}
              </h1>
              <div className="flex items-center gap-2 text-bone/80">
                <MapPin className="w-5 h-5" />
                <span>{locationData.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-bone/70">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{locationData.hours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-gold-champagne text-gold-champagne" />
              <span>{locationData.rating}</span>
            </div>
          </div>
        </div>

        {/* Live Wait Module */}
        <div className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20 mb-8">
          <h2 className="font-display text-2xl font-bold text-bone mb-4">
            Live Wait Time
          </h2>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-bone/70 mb-2">Next available in</p>
              <WaitTimeBadge
                minutes={locationData.waitMinutes}
                confidenceBand={locationData.confidenceBand}
                status={locationData.status}
                pulse={false}
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-bone/60 mb-1">Queue</p>
              <p className="font-display text-3xl font-bold text-bone">
                {locationData.queue.active}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-wood-espresso/30 rounded-lg p-4">
              <p className="text-xs text-bone/60 mb-1">Cutting now</p>
              <p className="font-display text-2xl font-bold text-bone">
                {locationData.queue.stylistsCutting}
              </p>
            </div>
            <div className="bg-wood-espresso/30 rounded-lg p-4">
              <p className="text-xs text-bone/60 mb-1">Finishing soon</p>
              <p className="font-display text-2xl font-bold text-bone">
                {locationData.queue.stylistsFinishing}
              </p>
            </div>
            <div className="bg-wood-espresso/30 rounded-lg p-4">
              <p className="text-xs text-bone/60 mb-1">On break</p>
              <p className="font-display text-2xl font-bold text-bone">
                {locationData.queue.onBreak}
              </p>
            </div>
          </div>

          {!checkedIn && (
            <button
              onClick={() => setCheckedIn(true)}
              className="w-full px-6 py-4 bg-red-crimson hover:bg-red-crimson/90 text-bone font-semibold rounded-lg transition-colors duration-150"
            >
              Check-in now, walk in confident
            </button>
          )}
        </div>

        {/* MVP Add-on Toggle */}
        <div className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-bone mb-1">
                MVP Ritual
              </h3>
              <p className="text-sm text-bone/60">
                Includes hot towel, wash, and scalp massage
              </p>
            </div>
            <button
              onClick={() => setMvpSelected(!mvpSelected)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-150 ${
                mvpSelected ? "bg-gold-champagne" : "bg-slate"
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-bone rounded-full shadow-lg"
                animate={{ x: mvpSelected ? 26 : 2 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
          {mvpSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 text-sm text-bone/70"
            >
              <p>MVP Ritual available today. Adds 15 minutes to your service.</p>
            </motion.div>
          )}
        </div>

        {/* Staff Roster */}
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-bone mb-6">
            Staff Roster
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {locationData.stylists.map((stylist) => (
              <StylistCard key={stylist.id} {...stylist} />
            ))}
          </div>
        </div>

        {/* Retail Pickup Strip */}
        <div className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-gold-champagne" />
            <h3 className="font-display text-xl font-bold text-bone">
              Featured Products
            </h3>
          </div>
          <p className="text-bone/60 text-sm mb-4">
            Add products to your pickup for checkout
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-wood-espresso/30 rounded-lg p-4 border border-gold-champagne/10"
              >
                <div className="h-32 bg-slate/50 rounded mb-3" />
                <p className="text-bone/80 font-medium mb-1">Product {i}</p>
                <p className="text-sm text-bone/60 mb-3">$24.99</p>
                <button className="w-full px-4 py-2 bg-slate hover:bg-slate/80 text-bone text-sm font-medium rounded-lg transition-colors duration-150">
                  Add to Pickup
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}


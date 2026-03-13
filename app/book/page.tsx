"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import LocationCard from "@/components/LocationCard";

const locations = [
  {
    id: "1",
    name: "Downtown Garage",
    address: "123 Main St, Downtown",
    waitMinutes: 5,
    confidenceBand: [3, 8] as [number, number],
    status: "available" as const,
    rating: 4.9,
    topStylist: "Mike",
    nextAvailable: "5 minutes",
  },
  {
    id: "2",
    name: "Highway 101",
    address: "456 Highway 101",
    waitMinutes: 12,
    confidenceBand: [10, 15] as [number, number],
    status: "available" as const,
    rating: 4.8,
    topStylist: "Alex",
    nextAvailable: "12 minutes",
  },
];

export default function BookPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4">
            Book Appointment
          </h1>
          <p className="text-bone/70 text-lg">
            Choose a location and check in or schedule
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {locations.map((location) => (
            <motion.div
              key={location.id}
              onClick={() => setSelectedLocation(location.id)}
              className={`cursor-pointer transition-all duration-150 ${
                selectedLocation === location.id
                  ? "ring-2 ring-gold-champagne"
                  : ""
              }`}
            >
              <LocationCard {...location} />
            </motion.div>
          ))}
        </div>

        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
          >
            <h2 className="font-display text-2xl font-bold text-bone mb-4">
              Select Time
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button className="px-6 py-4 bg-red-crimson hover:bg-red-crimson/90 text-bone font-semibold rounded-lg transition-colors duration-150">
                Check-in Now
              </button>
              <button className="px-6 py-4 bg-slate hover:bg-slate/80 text-bone font-semibold rounded-lg transition-colors duration-150 border border-gold-champagne/30">
                Schedule Later
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}


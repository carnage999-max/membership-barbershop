"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Filter, X } from "lucide-react";
import LocationCard from "@/components/LocationCard";
import WaitTimeBadge from "@/components/WaitTimeBadge";
import { locations as locationsApi } from "@/lib/api-client";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  currentWaitTime: number;
  confidenceBand: [number, number];
  status: "available" | "limited" | "high" | "closed";
  queueLength: number;
  stylistsOnShift: number;
  distance?: number;
  latitude?: number;
  longitude?: number;
}

const filters = [
  { id: "open-now", label: "Open now" },
  { id: "under-10", label: "<10 min" },
  { id: "mvp", label: "MVP available" },
  { id: "kids", label: "Kids friendly" },
  { id: "quiet", label: "Quiet booths" },
  { id: "wheelchair", label: "Wheelchair access" },
];

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [myStylistToggle, setMyStylistToggle] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    async function loadLocations() {
      try {
        setLoading(true);

        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ lat: latitude, lng: longitude });

              const result = await locationsApi.getAll(latitude, longitude);
              setLocations(result.locations);
              setLoading(false);
            },
            async () => {
              // Fallback: load without geolocation
              const result = await locationsApi.getAll();
              setLocations(result.locations);
              setLoading(false);
            }
          );
        } else {
          const result = await locationsApi.getAll();
          setLocations(result.locations);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load locations:', error);
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredLocations = locations.filter((location) => {
    if (activeFilters.includes("open-now") && location.status === "closed") return false;
    if (activeFilters.includes("under-10") && location.currentWaitTime >= 10) return false;
    // Note: MVP, kids, quiet, wheelchair filters require additional location metadata
    // These can be added to the Location model later
    return true;
  });

  if (loading) {
    return (
      <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gold-champagne/20 border-t-gold-champagne rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-bone/70">Loading locations...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4">
            Find Your Shop
          </h1>
          <p className="text-bone/70 text-lg">
            Map-first discovery with live wait times
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                activeFilters.includes(filter.id)
                  ? "bg-gold-champagne text-ink"
                  : "bg-slate/50 text-bone/70 hover:bg-slate/80 hover:text-bone"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* My Stylist Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setMyStylistToggle(!myStylistToggle)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
              myStylistToggle
                ? "bg-gold-champagne text-ink"
                : "bg-slate/50 text-bone/70 hover:bg-slate/80"
            }`}
          >
            My Stylist
          </button>
          {myStylistToggle && (
            <p className="text-sm text-bone/60">
              Showing locations with your preferred stylists first
            </p>
          )}
        </div>

        {/* Map Placeholder + Results List */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Map Area */}
          <div className="relative h-[600px] rounded-xl overflow-hidden bg-slate/30 border border-gold-champagne/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gold-champagne/30 mx-auto mb-4" />
                <p className="text-bone/40 font-display text-xl">Map View</p>
                <p className="text-bone/30 text-sm mt-2">
                  Map integration with color-coded pins
                </p>
              </div>
            </div>

            {/* Map Pins (simulated) */}
            {filteredLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`absolute top-${20 + index * 10}% left-${30 + index * 15}% w-4 h-4 rounded-full border-2 border-bone ${
                  location.status === "available"
                    ? "bg-success"
                    : location.status === "limited"
                    ? "bg-warning"
                    : "bg-danger"
                }`}
                title={location.name}
              />
            ))}
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  id={location.id}
                  name={location.name}
                  address={`${location.address}, ${location.city}, ${location.state}`}
                  waitMinutes={location.currentWaitTime}
                  confidenceBand={location.confidenceBand}
                  status={location.status}
                  rating={4.5}
                  topStylist="Available"
                  nextAvailable={`${location.currentWaitTime} min`}
                  lat={location.latitude || 0}
                  lng={location.longitude || 0}
                  open={location.status !== "closed"}
                  mvpAvailable={true}
                  kidsFriendly={true}
                  quietBooths={true}
                  wheelchairAccess={true}
                />
              ))
            ) : (
              <div className="bg-slate/50 rounded-xl p-8 text-center">
                <p className="text-bone/60">No locations match your filters</p>
                <button
                  onClick={() => setActiveFilters([])}
                  className="mt-4 text-gold-champagne hover:text-gold-champagne/80 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


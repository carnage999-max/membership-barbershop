"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Filter, X } from "lucide-react";
import LocationCard from "@/components/LocationCard";
import WaitTimeBadge from "@/components/WaitTimeBadge";
import { locations as locationsApi, queue as queueApi, tokenStorage } from "@/lib/api-client";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-obsidian">
      <div className="w-8 h-8 border-4 border-gold-champagne/20 border-t-gold-champagne rounded-full animate-spin"></div>
    </div>
  )
});

interface Location {
  id: string;
  slug: string;
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
  { id: "signature", label: "Concours Detail" },
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
  const [myQueuePosition, setMyQueuePosition] = useState<any>(null);
  const [joiningQueue, setJoiningQueue] = useState(false);

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

        // Check if user is in queue
        const token = tokenStorage.get();
        if (token) {
          try {
            const queueResult = await queueApi.getMyPosition(token);
            if (queueResult.queueEntry) {
              setMyQueuePosition(queueResult.queueEntry);
            }
          } catch (err) {
            // User not in queue, that's fine
          }
        }
      } catch (error) {
        console.error('Failed to load locations:', error);
        setLoading(false);
      }
    }

    loadLocations();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadLocations, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleJoinQueue(locationId: string) {
    try {
      const token = tokenStorage.get();
      if (!token) {
        alert('Please login to join the queue');
        window.location.href = '/login?redirect=/locations';
        return;
      }

      setJoiningQueue(true);
      const result = await queueApi.join(locationId, token);
      setMyQueuePosition(result.queueEntry);
      setJoiningQueue(false);

      alert(`You're #${result.queueEntry.position} in line at ${result.queueEntry.locationName}!`);
    } catch (error: any) {
      console.error('Failed to join queue:', error);
      alert(error.message || 'Failed to join queue');
      setJoiningQueue(false);
    }
  }

  async function handleLeaveQueue() {
    try {
      const token = tokenStorage.get();
      if (!token) return;

      await queueApi.leave(token);
      setMyQueuePosition(null);
      alert('Left the queue successfully');
      // Force reload to update wait times
      window.location.reload();
    } catch (error: any) {
      console.error('Failed to leave queue:', error);
      alert(error.message || 'Failed to leave queue');
    }
  }

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

        {/* My Queue Position */}
        {myQueuePosition && (
          <div className="mb-8 bg-gold-champagne/10 border-2 border-gold-champagne rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-bone mb-2">
                  Authorized in Shop
                </h3>
                <p className="text-bone/70 mb-2">
                  Position <span className="text-gold-champagne font-bold text-3xl">#{myQueuePosition.position}</span> at {myQueuePosition.location.name}
                </p>
                <p className="text-bone/60">
                  Estimated wait: <span className="text-bone font-semibold">{myQueuePosition.estimatedWait} minutes</span>
                </p>
              </div>
              <button
                onClick={handleLeaveQueue}
                className="px-6 py-3 bg-danger hover:bg-danger/90 text-bone font-semibold rounded-lg transition-colors"
              >
                Leave Queue
              </button>
            </div>
          </div>
        )}

        {/* Map Placeholder + Results List */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Map Area */}
          <div className="relative h-[600px] rounded-xl overflow-hidden bg-slate/30 border border-gold-champagne/20">
            <MapComponent locations={filteredLocations} userLocation={userLocation} />
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <div key={location.id} className="relative">
                  <LocationCard
                    id={location.id}
                    name={location.name}
                    address={`${location.address}, ${location.city}, ${location.state}`}
                    waitMinutes={location.currentWaitTime}
                    confidenceBand={location.confidenceBand}
                    status={location.status}
                    rating={4.5}
                    topStylist="Available"
                    nextAvailable={`${location.currentWaitTime} min`}
                    slug={location.slug}
                  />
                  {!myQueuePosition && location.status !== "closed" && (
                    <button
                      onClick={() => handleJoinQueue(location.id)}
                      disabled={joiningQueue}
                      className="mt-4 w-full px-6 py-3 bg-red-crimson hover:bg-red-crimson/90 disabled:bg-slate/50 text-bone font-semibold rounded-lg transition-colors"
                    >
                      {joiningQueue ? "Joining..." : "Join Queue"}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-slate/50 rounded-xl p-8 text-center">
                <p className="text-bone/60">No locations found near you now.</p>
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


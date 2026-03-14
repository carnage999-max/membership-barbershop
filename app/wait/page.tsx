"use client";

import { useEffect, useState } from "react";
import LocationCard from "@/components/LocationCard";
import { locations as locationsApi, queue as queueApi, tokenStorage } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  currentWaitTime: number;
  confidenceBand: [number, number];
  status: "available" | "limited" | "high" | "closed";
  queueLength: number;
  stylistsOnShift: number;
}

export default function WaitPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [myQueuePosition, setMyQueuePosition] = useState<any>(null);
  const [joiningQueue, setJoiningQueue] = useState(false);

  useEffect(() => {
    loadData();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const locationsResult = await locationsApi.getAll();
      setLocations(locationsResult.locations);

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

      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  }

  async function handleJoinQueue(locationId: string) {
    try {
      const token = tokenStorage.get();
      if (!token) {
        alert('Please login to join the queue');
        router.push('/login');
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
      loadData(); // Reload to update wait times
    } catch (error: any) {
      console.error('Failed to leave queue:', error);
      alert(error.message || 'Failed to leave queue');
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gold-champagne/20 border-t-gold-champagne rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-bone/70">Synchronizing waitlist data...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4 italic uppercase tracking-tighter">
            Location <span className="text-gold-champagne">Wait Times</span>
          </h1>
          <p className="text-bone/70 text-lg">
            Real-time wait times at all locations
          </p>
        </div>

        {/* My Queue Position */}
        {myQueuePosition && (
          <div className="mb-8 bg-gold-champagne/10 border-2 border-gold-champagne rounded-xl p-6">
            <div className="flex items-center justify-between">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
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
          ))}
        </div>
      </div>
    </main>
  );
}


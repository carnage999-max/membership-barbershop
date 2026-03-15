"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StylistCard from "@/components/StylistCard";
import { Search } from "lucide-react";
import { useConfirmation } from "@/context/ConfirmationContext";
import { stylists as stylistsApi, tokenStorage } from "@/lib/api-client";
import { toast } from "react-hot-toast";

interface Stylist {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  specialties: string[];
  avgCutTime: number;
  rating: number;
  totalReviews: number;
  onShift: boolean;
  onBreak: boolean;
  nextShiftAt?: string;
  isFollowing: boolean;
}

export default function StylistsPage() {
  const { alert } = useConfirmation();
  const [allStylists, setAllStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followedOnly, setFollowedOnly] = useState(false);

  useEffect(() => {
    async function loadStylists() {
      try {
        setLoading(true);
        const token = tokenStorage.get();
        const result = await stylistsApi.getAll(undefined, undefined, token || undefined);
        setAllStylists(result.stylists);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load stylists:', error);
        setLoading(false);
      }
    }

    loadStylists();
  }, []);

  const handleFollow = async (stylistId: string, isCurrentlyFollowing: boolean) => {
    try {
      const token = tokenStorage.get();
      if (!token) {
        await alert({ title: "Authorization Required", message: "Please login to follow stylists." });
        return;
      }

      if (isCurrentlyFollowing) {
        await stylistsApi.unfollow(stylistId, token);
        toast.success("Unfollowed successfully");
      } else {
        await stylistsApi.follow(stylistId, token);
        toast.success("Now following for shift alerts");
      }

      // Reload stylists to update follow status
      const result = await stylistsApi.getAll(undefined, undefined, token);
      setAllStylists(result.stylists);
    } catch (error) {
      console.error('Failed to update follow status:', error);
      toast.error("Failed to update follow status");
    }
  };

  const filteredStylists = allStylists.filter((stylist) => {
    if (followedOnly && !stylist.isFollowing) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${stylist.firstName} ${stylist.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        stylist.specialties.some((s) => s.toLowerCase().includes(query))
      );
    }
    return true;
  });

  if (loading) {
    return (
      <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gold-champagne/20 border-t-gold-champagne rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-bone/70">Loading stylists...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4 italic uppercase tracking-tighter">
            The <span className="text-gold-champagne">Crew</span> Roster
          </h1>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Find your preferred crew member and follow them for on-shift alerts.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-3xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bone/40" />
            <input
              type="text"
              placeholder="Search by crew member or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate/50 backdrop-blur-sm border border-gold-champagne/20 rounded-lg text-bone placeholder:text-bone/40 focus:outline-none focus:border-gold-champagne transition-colors duration-150"
            />
          </div>

          <button
            onClick={() => setFollowedOnly(!followedOnly)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
              followedOnly
                ? "bg-gold-champagne text-ink"
                : "bg-slate/50 text-bone/70 hover:bg-slate/80"
            }`}
          >
            {followedOnly ? "Show All" : "Show Followed Only"}
          </button>
        </div>

        {/* Stylist Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStylists.length > 0 ? (
            filteredStylists.map((stylist) => (
              <StylistCard
                key={stylist.id}
                id={stylist.id}
                name={`${stylist.firstName} ${stylist.lastName}`}
                photo={stylist.photoUrl}
                specialties={stylist.specialties}
                avgCutTime={stylist.avgCutTime}
                rating={stylist.rating}
                onShift={stylist.onShift}
                onBreak={stylist.onBreak}
                isFollowing={stylist.isFollowing}
                nextShift={stylist.nextShiftAt ? "Soon" : undefined}
                onFollow={() => handleFollow(stylist.id, stylist.isFollowing)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-bone/60">No crew members found at this time.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";
import { tokenStorage } from "@/lib/api-client";
import { Loader2, Save, Trash2, Plus, ArrowLeft, Building, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, isAdmin, loading: userLoading } = useUser();
  const [plans, setPlans] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const router = useRouter();

  // New Plan State
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    price: 29,
    visitsPerMonth: 2,
    mvpAccess: false,
    priority: false,
    locationId: ""
  });

  // New Location State
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });

  useEffect(() => {
    if (!userLoading && !isAdmin) {
      router.push("/login");
    }
  }, [userLoading, isAdmin, router]);

  const fetchData = async () => {
    const token = tokenStorage.get();
    if (!token) return;

    try {
      const [plansRes, locsRes] = await Promise.all([
        fetch("/api/memberships/plans"),
        fetch("/api/admin/locations", {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      const plansData = await plansRes.json();
      const locsData = await locsRes.json();

      setPlans(plansData.plans || []);
      setLocations(locsData.locations || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenStorage.get();
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newLocation)
      });
      if (res.ok) {
        setShowLocationModal(false);
        fetchData();
        setNewLocation({ name: "", address: "", city: "", state: "", zipCode: "", phone: "" });
      }
    } catch (error) {
      alert("Failed to add location");
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenStorage.get();
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newPlan,
          locationId: newPlan.locationId || undefined
        })
      });
      if (res.ok) {
        setShowPlanModal(false);
        fetchData();
        setNewPlan({ name: "", description: "", price: 29, visitsPerMonth: 2, mvpAccess: false, priority: false, locationId: "" });
      }
    } catch (error) {
      alert("Failed to add plan");
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold-champagne animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-obsidian pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-bone/60 hover:text-gold-champagne transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-bone uppercase tracking-tight">
              Command <span className="text-gold-champagne">Center</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowLocationModal(true)}
              className="px-6 py-2 bg-slate text-bone font-bold rounded-lg border border-gold-champagne/30 hover:bg-slate/80 transition-all flex items-center gap-2"
            >
              <Building className="w-4 h-4" /> Add Shop
            </button>
            <button 
              onClick={() => setShowPlanModal(true)}
              className="px-6 py-2 bg-gold-champagne text-ink font-bold rounded-lg hover:bg-gold-champagne/90 transition-all flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Add Plan
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Locations Section */}
          <div className="bg-slate/20 border border-gold-champagne/10 rounded-2xl p-6">
            <h2 className="font-display text-2xl font-bold text-bone mb-6">Active Shops</h2>
            {locations.length > 0 ? (
              <div className="space-y-4">
                {locations.map(loc => (
                  <div key={loc.id} className="p-4 bg-obsidian/40 rounded-xl border border-gold-champagne/5 flex justify-between items-center text-bone">
                    <div>
                      <h3 className="font-bold">{loc.name}</h3>
                      <p className="text-sm text-bone/50">{loc.city}, {loc.state}</p>
                    </div>
                    <span className="text-xs text-gold-champagne uppercase font-medium">{loc.openTime} - {loc.closeTime}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-gold-champagne/10 rounded-xl">
                <p className="text-bone/40">No locations available in system.</p>
              </div>
            )}
          </div>

          {/* Plans Section */}
          <div className="bg-slate/20 border border-gold-champagne/10 rounded-2xl p-6">
            <h2 className="font-display text-2xl font-bold text-bone mb-6">Membership Tiers</h2>
            {plans.length > 0 ? (
              <div className="space-y-4">
                {plans.map(plan => (
                  <div key={plan.id} className="p-4 bg-obsidian/40 rounded-xl border border-gold-champagne/5 flex justify-between items-center text-bone">
                    <div>
                      <h3 className="font-bold">{plan.name}</h3>
                      <p className="text-sm text-bone/50">{plan.visitsPerMonth} sessions • {plan.mvpAccess ? "Concours" : "Standard"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-gold-champagne">${plan.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-gold-champagne/10 rounded-xl">
                <p className="text-bone/40">No plans available to you now.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-sm">
          <div className="bg-slate border border-gold-champagne/30 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="font-display text-3xl font-bold text-bone mb-6 uppercase">Register New Shop</h2>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <input 
                required placeholder="Shop Name" 
                className="w-full bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none"
                value={newLocation.name} onChange={e => setNewLocation({...newLocation, name: e.target.value})}
              />
              <input 
                required placeholder="Street Address" 
                className="w-full bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none"
                value={newLocation.address} onChange={e => setNewLocation({...newLocation, address: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" className="bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none" value={newLocation.city} onChange={e => setNewLocation({...newLocation, city: e.target.value})} />
                <input required placeholder="State (e.g. NY)" maxLength={2} className="bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none" value={newLocation.state} onChange={e => setNewLocation({...newLocation, state: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Zip Code" className="bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none" value={newLocation.zipCode} onChange={e => setNewLocation({...newLocation, zipCode: e.target.value})} />
                <input required placeholder="Phone" className="bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none" value={newLocation.phone} onChange={e => setNewLocation({...newLocation, phone: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowLocationModal(false)} className="flex-1 px-6 py-3 bg-obsidian text-bone/60 font-bold rounded-lg border border-gold-champagne/10 hover:text-bone">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-gold-champagne text-ink font-bold rounded-lg hover:shadow-lg hover:shadow-gold-champagne/20 transition-all">Launch Shop</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-sm">
          <div className="bg-slate border border-gold-champagne/30 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="font-display text-3xl font-bold text-bone mb-6 uppercase">Create Tier</h2>
            <form onSubmit={handleAddPlan} className="space-y-4">
              <input required placeholder="Plan Name (e.g. Pro Unlimited)" className="w-full bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} />
              <textarea required placeholder="Brief Description" className="w-full bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none min-h-[80px]" value={newPlan.description} onChange={e => setNewPlan({...newPlan, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-bone/50 uppercase font-bold px-1">Price per Mo</label>
                  <input type="number" required placeholder="Price" className="w-full bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-bone/50 uppercase font-bold px-1">Visits per Mo</label>
                  <input type="number" required placeholder="Visits" className="w-full bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none" value={newPlan.visitsPerMonth} onChange={e => setNewPlan({...newPlan, visitsPerMonth: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex items-center gap-6 p-3 bg-obsidian/50 rounded-xl">
                 <label className="flex items-center gap-2 cursor-pointer group">
                   <input type="checkbox" className="w-4 h-4 accent-gold-champagne" checked={newPlan.mvpAccess} onChange={e => setNewPlan({...newPlan, mvpAccess: e.target.checked})} />
                   <span className="text-sm text-bone/70 group-hover:text-bone transition-colors font-bold uppercase tracking-wider">Concours Ritual</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer group">
                   <input type="checkbox" className="w-4 h-4 accent-gold-champagne" checked={newPlan.priority} onChange={e => setNewPlan({...newPlan, priority: e.target.checked})} />
                   <span className="text-sm text-bone/70 group-hover:text-bone transition-colors font-bold uppercase tracking-wider">Priority Lane</span>
                 </label>
              </div>
              <select className="w-full bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none" value={newPlan.locationId} onChange={e => setNewPlan({...newPlan, locationId: e.target.value})}>
                <option value="">Global (All Shops)</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowPlanModal(false)} className="flex-1 px-6 py-3 bg-obsidian text-bone/60 font-bold rounded-lg border border-gold-champagne/10 hover:text-bone">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-gold-champagne text-ink font-bold rounded-lg hover:shadow-lg hover:shadow-gold-champagne/20 transition-all">Authorize Tier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

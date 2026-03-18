"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";
import { useConfirmation } from "@/context/ConfirmationContext";
import { tokenStorage } from "@/lib/api-client";
import { 
  Loader2, Pencil, Trash2, Plus, ArrowLeft, Building, CreditCard, 
  Users, Scissors, BarChart3, Shield, Eye, EyeOff, Save, Check, X, Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Tab = "shops" | "plans" | "artisans" | "users" | "analytics";

export default function AdminDashboard() {
  const { user, isAdmin, loading: userLoading } = useUser();
  const { confirm, alert } = useConfirmation();
  const [activeTab, setActiveTab] = useState<Tab>("shops");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Data States
  const [plans, setPlans] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [stylists, setStylists] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Modal States
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showStylistModal, setShowStylistModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [editingStylist, setEditingStylist] = useState<any>(null);

  // New Item States
  const [newPlan, setNewPlan] = useState({
    name: "", description: "", price: 29, visitsPerMonth: 2, mvpAccess: false, priority: false, locationId: ""
  });
  const [newLocation, setNewLocation] = useState({
    name: "", address: "", city: "", state: "", zipCode: "", phone: ""
  });
  const [newStylist, setNewStylist] = useState({
    firstName: "", lastName: "", locationId: "", bio: "", specialties: [] as string[]
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
      const headers = { "Authorization": `Bearer ${token}` };
      const [plansRes, locsRes, stylistsRes, usersRes, analyticsRes] = await Promise.all([
        fetch("/api/memberships/plans"),
        fetch("/api/admin/locations", { headers }),
        fetch("/api/admin/stylists", { headers }),
        fetch("/api/admin/users?limit=100", { headers }),
        fetch("/api/admin/analytics", { headers })
      ]);

      setPlans((await plansRes.json()).plans || []);
      setLocations((await locsRes.json()).locations || []);
      setStylists((await stylistsRes.json()).stylists || []);
      setUsers((await usersRes.json()).users || []);
      setAnalytics((await analyticsRes.json()).stats || null);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  // Actions
  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenStorage.get();
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newLocation)
      });
      if (res.ok) {
        setShowLocationModal(false);
        fetchData();
        setNewLocation({ name: "", address: "", city: "", state: "", zipCode: "", phone: "" });
        toast.success("Shop registered successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add location");
      }
    } catch (error) { 
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeleteLocation = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Remove Shop",
      message: "🚨 DANGER: Are you sure you want to delete this shop? This action is irreversible and may affect active bookings.",
      confirmText: "Delete Shop",
      isDanger: true
    });
    
    if (!isConfirmed) return;
    
    const token = tokenStorage.get();
    try {
      const res = await fetch(`/api/admin/locations/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        toast.success("Shop removed from system");
      } else {
        toast.error("Failed to delete location");
      }
    } catch (error) { 
      toast.error("Connection error while deleting shop");
    }
  };

  const handleToggleLocationActive = async (id: string, currentStatus: boolean) => {
    const action = currentStatus ? "HIDE" : "SHOW";
    
    const isConfirmed = await confirm({
      title: `${action} Shop`,
      message: `Confirm ${action} shop? This will update visibility for users.`,
      confirmText: action === "HIDE" ? "Hide Shop" : "Show Shop",
      isDanger: currentStatus // Danger if hiding
    });

    if (!isConfirmed) return;

    const token = tokenStorage.get();
    try {
      const res = await fetch(`/api/admin/locations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        fetchData();
        toast.success(`Shop ${action === "HIDE" ? "hidden from" : "visible to"} public`);
      } else {
        toast.error("Failed to update shop status");
      }
    } catch (error) { 
      toast.error("Error communicating with shop registry");
    }
  };

  const handleEditLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenStorage.get();
    try {
      const res = await fetch(`/api/admin/locations/${editingLocation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(editingLocation)
      });
      if (res.ok) { 
        setEditingLocation(null); 
        fetchData(); 
        toast.success("Shop intelligence updated");
      } else {
        toast.error("Failed to update location details");
      }
    } catch (error) { 
      toast.error("Update stream interrupted");
    }
  };

  const handleDeletePlan = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Membership Tier",
      message: "🚨 DANGER: Delete this membership plan? This will NOT cancel existing subscriptions but will prevent new ones.",
      confirmText: "Delete Tier",
      isDanger: true
    });

    if (!isConfirmed) return;

    const token = tokenStorage.get();
    try {
      const res = await fetch(`/api/admin/plans/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        toast.success("Membership tier decommissioned");
      } else {
        toast.error("Failed to delete plan");
      }
    } catch (error) { 
      toast.error("Command failure during plan removal");
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
        toast.success("New membership tier authorized");
      } else {
        toast.error("Failed to add plan");
      }
    } catch (error) {
      toast.error("System error creating membership plan");
    }
  };

  const handleAddStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenStorage.get();
    try {
      const res = await fetch("/api/admin/stylists", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newStylist)
      });
      if (res.ok) { 
        setShowStylistModal(false); 
        fetchData(); 
        setNewStylist({ firstName: "", lastName: "", locationId: "", bio: "", specialties: [] }); 
        toast.success("Artisan enlisted to roster");
      } else {
        toast.error("Failed to enlist artisan");
      }
    } catch (error) { 
      toast.error("Protocol error during enlistment");
    }
  };

  const handleDeleteStylist = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Remove Artisan",
      message: "🚨 DANGER: Remove this artisan from the roster? This may affect scheduled appointments.",
      confirmText: "Remove Artisan",
      isDanger: true
    });

    if (!isConfirmed) return;

    const token = tokenStorage.get();
    try {
      const res = await fetch(`/api/admin/stylists/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        toast.success("Artisan removed from active roster");
      } else {
        toast.error("Failed to delete artisan");
      }
    } catch (error) { 
      toast.error("Roster update protocol failed");
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const isConfirmed = await confirm({
      title: "Security Clearance Change",
      message: `Are you sure you want to change this user's role to ${newRole}? This affects system permissions immediately.`,
      confirmText: `Promote to ${newRole}`,
      isDanger: newRole === "ADMIN"
    });

    if (!isConfirmed) return;

    const token = tokenStorage.get();
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ id: userId, role: newRole })
      });
      if (res.ok) {
        fetchData();
        toast.success(`Security clearance updated to ${newRole}`);
      } else {
        toast.error("Authorization update failed");
      }
    } catch (error) { 
      toast.error("Citizen database access error");
    }
  };

  if (userLoading || loading) {
    return <div className="min-h-screen bg-obsidian flex items-center justify-center"><Loader2 className="w-12 h-12 text-gold-champagne animate-spin" /></div>;
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-obsidian pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-bone/40 uppercase tracking-[0.2em] font-bold text-xs mb-2">
              <Shield className="w-4 h-4 text-gold-champagne" />
              Administrative Domain
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-bone uppercase italic tracking-tighter">
              Site <span className="text-gold-champagne">Management</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2 bg-slate/30 p-1.5 rounded-2xl border border-gold-champagne/10">
            {[
              { id: "shops", icon: Building, label: "Shops" },
              { id: "plans", icon: CreditCard, label: "Tiers" },
              { id: "artisans", icon: Scissors, label: "Artisans" },
              { id: "users", icon: Users, label: "Users" },
              { id: "analytics", icon: BarChart3, label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                  ? "bg-gold-champagne text-black shadow-lg shadow-gold-champagne/20" 
                  : "text-bone/40 hover:text-bone/80 hover:bg-slate/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate/10 backdrop-blur-md rounded-3xl border border-gold-champagne/15 p-8 shadow-2xl overflow-hidden">
          
          {/* SHOPS TAB */}
          {activeTab === "shops" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-3xl font-bold text-bone uppercase italic">Managed <span className="text-gold-champagne">Shops</span></h2>
                <button 
                  onClick={() => setShowLocationModal(true)}
                  className="px-6 py-2.5 bg-gold-champagne text-ink font-bold rounded-xl hover:shadow-lg hover:shadow-gold-champagne/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Register New Shop
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map(loc => (
                  <div key={loc.id} className={`p-6 bg-obsidian/40 rounded-2xl border transition-all ${loc.isActive ? "border-gold-champagne/10 hover:border-gold-champagne/30" : "border-red-crimson/30 opacity-60"}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gold-champagne/10 flex items-center justify-center text-gold-champagne">
                        <Building className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingLocation(loc)} className="p-2 text-bone/40 hover:text-gold-champagne transition-colors" title="Edit details"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleToggleLocationActive(loc.id, loc.isActive)} className="p-2 text-bone/40 hover:text-gold-champagne transition-colors" title={loc.isActive ? "Hide from public" : "Show to public"}>
                          {loc.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDeleteLocation(loc.id)} className="p-2 text-bone/40 hover:text-red-crimson transition-colors" title="Remove permanently"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-bold text-bone mb-1">{loc.name}</h3>
                    <p className="text-sm text-bone/50 mb-4">{loc.address}, {loc.city}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gold-champagne/5">
                      <span className="text-[10px] font-bold text-gold-champagne uppercase tracking-widest">{loc.isActive ? "Operational" : "Hidden"}</span>
                      <span className="text-xs text-bone/40">{loc.openTime} — {loc.closeTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLANS TAB */}
          {activeTab === "plans" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-3xl font-bold text-bone uppercase italic">Membership <span className="text-gold-champagne">Tiers</span></h2>
                <button 
                  onClick={() => setShowPlanModal(true)}
                  className="px-6 py-2.5 bg-gold-champagne text-ink font-bold rounded-xl hover:shadow-lg hover:shadow-gold-champagne/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Issue New Tier
                </button>
              </div>
              <div className="space-y-4">
                {plans.map(plan => (
                  <div key={plan.id} className="p-5 bg-obsidian/60 rounded-2xl border border-gold-champagne/10 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gold-champagne/5 rounded-xl border border-gold-champagne/20 flex flex-col items-center justify-center">
                        <CreditCard className="w-5 h-5 text-gold-champagne mb-1" />
                        <span className="text-[8px] font-bold text-bone uppercase">Elite</span>
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-bone">{plan.name}</h3>
                        <p className="text-sm text-bone/50">{plan.visitsPerMonth} visits/mo • {plan.mvpAccess ? "MVP Status" : "Standard Status"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <span className="text-xs text-bone/30 uppercase font-bold block mb-1">Monthly Cost</span>
                        <span className="font-display text-2xl font-bold text-gold-champagne">${plan.price}</span>
                      </div>
                      <button onClick={() => handleDeletePlan(plan.id)} className="p-3 bg-red-crimson/10 text-red-crimson rounded-xl hover:bg-red-crimson hover:text-bone transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARTISANS TAB */}
          {activeTab === "artisans" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-3xl font-bold text-bone uppercase italic">The <span className="text-gold-champagne">Artisans</span></h2>
                <button 
                  onClick={() => setShowStylistModal(true)}
                  className="px-6 py-2.5 bg-gold-champagne text-ink font-bold rounded-xl hover:shadow-lg hover:shadow-gold-champagne/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Enlist New Artisan
                </button>
              </div>
              <div className="grid gap-4">
                {stylists.map(s => (
                  <div key={s.id} className="p-5 bg-obsidian/60 rounded-2xl border border-gold-champagne/10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-wood-espresso flex items-center justify-center font-display text-2xl text-gold-champagne border border-gold-champagne/20">
                        {s.firstName[0]}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-bone">{s.firstName} {s.lastName}</h3>
                        <p className="text-sm text-gold-champagne font-bold uppercase tracking-wider">{s.location?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center px-4">
                        <span className="text-xs text-bone/30 uppercase font-bold block mb-1">Avg Time</span>
                        <span className="text-bone font-medium">{s.avgCutTime}m</span>
                      </div>
                      <button onClick={() => handleDeleteStylist(s.id)} className="p-3 bg-red-crimson/10 text-red-crimson rounded-xl hover:bg-red-crimson hover:text-bone transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div>
              <div className="mb-8">
                <h2 className="font-display text-3xl font-bold text-bone uppercase italic">Citizen <span className="text-gold-champagne">Database</span></h2>
                <p className="text-bone/40 text-sm mt-1 uppercase tracking-widest font-bold">Total Personnel: {users.length}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gold-champagne/10">
                    <tr>
                      <th className="py-4 px-2 text-[10px] font-bold text-bone/30 uppercase tracking-[0.2em]">Personnel</th>
                      <th className="py-4 px-2 text-[10px] font-bold text-bone/30 uppercase tracking-[0.2em]">Email</th>
                      <th className="py-4 px-2 text-[10px] font-bold text-bone/30 uppercase tracking-[0.2em]">Role Rank</th>
                      <th className="py-4 px-2 text-[10px] font-bold text-bone/30 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-champagne/5">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate/5 transition-colors group">
                        <td className="py-4 px-2 font-bold text-bone text-sm">{u.firstName} {u.lastName}</td>
                        <td className="py-4 px-2 text-bone/50 text-xs">{u.email}</td>
                        <td className="py-4 px-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            u.role === "ADMIN" ? "bg-gold-champagne text-black" : 
                            u.role === "STAFF" ? "bg-slate text-bone border border-gold-champagne/40" : 
                            "bg-obsidian text-bone/40"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex flex-wrap justify-end gap-2 transition-opacity">
                            <button onClick={() => handleUpdateUserRole(u.id, "ADMIN")} className="text-[10px] font-bold text-gold-champagne hover:underline uppercase whitespace-nowrap">Promote Admin</button>
                            <button onClick={() => handleUpdateUserRole(u.id, "STAFF")} className="text-[10px] font-bold text-bone/40 hover:text-bone uppercase whitespace-nowrap">Assign Staff</button>
                            <button onClick={() => handleUpdateUserRole(u.id, "USER")} className="text-[10px] font-bold text-red-crimson/60 hover:text-red-crimson uppercase whitespace-nowrap">Reset User</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="font-display text-3xl font-bold text-bone uppercase italic mb-8">System <span className="text-gold-champagne">Intelligence</span></h2>
              {analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Total Members", val: analytics.activeMemberships, icon: CreditCard, sub: "Active Subscriptions" },
                    { label: "Active Queue", val: analytics.activeQueue, icon: Clock, sub: "Total Waiting" },
                    { label: "Shops Online", val: analytics.totalLocations, icon: Building, sub: "Public Facing" },
                    { label: "Total Users", val: analytics.totalUsers, icon: Users, sub: "Registered Citizens" },
                    { label: "Est. Revenue", val: `$${analytics.monthlyRevenue.toLocaleString()}`, icon: BarChart3, sub: "Monthly Potential" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-obsidian/40 border border-gold-champagne/10 p-6 rounded-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-champagne/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-gold-champagne/10 transition-all" />
                      <stat.icon className="w-8 h-8 text-gold-champagne mb-4" />
                      <p className="text-[10px] font-bold text-bone/40 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <h3 className="font-display text-4xl font-bold text-bone mb-2 italic">{stat.val}</h3>
                      <p className="text-xs text-bone/30 uppercase font-bold">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-bone/40">Aggregating system data...</p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODALS */}
      
      {/* Edit Location Modal */}
      {editingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-md">
          <div className="bg-slate border border-gold-champagne/30 rounded-3xl p-8 w-full max-w-lg shadow-[0_0_100px_rgba(206,178,131,0.15)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-bold text-bone uppercase italic">Shop <span className="text-gold-champagne">Correction</span></h2>
              <button onClick={() => setEditingLocation(null)} className="text-bone/40 hover:text-red-crimson transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleEditLocation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-bone/30 uppercase tracking-widest px-1">Designation</label>
                <input required className="w-full bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none" value={editingLocation.name} onChange={e => setEditingLocation({...editingLocation, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-bone/30 uppercase tracking-widest px-1">Deployment Address</label>
                <input required className="w-full bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none" value={editingLocation.address} onChange={e => setEditingLocation({...editingLocation, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required className="bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none" placeholder="City" value={editingLocation.city} onChange={e => setEditingLocation({...editingLocation, city: e.target.value})} />
                <input required maxLength={2} className="bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none" placeholder="ST" value={editingLocation.state} onChange={e => setEditingLocation({...editingLocation, state: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required className="bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none" placeholder="Zip" value={editingLocation.zipCode} onChange={e => setEditingLocation({...editingLocation, zipCode: e.target.value})} />
                <input required className="bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none" placeholder="Phone" value={editingLocation.phone} onChange={e => setEditingLocation({...editingLocation, phone: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 mt-4 bg-gold-champagne text-ink font-bold rounded-xl shadow-xl shadow-gold-champagne/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Commit Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Stylist Modal */}
      {showStylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-md">
          <div className="bg-slate border border-gold-champagne/30 rounded-3xl p-8 w-full max-w-lg shadow-[0_0_100px_rgba(206,178,131,0.15)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-bold text-bone uppercase italic">Artisan <span className="text-gold-champagne">Enlistment</span></h2>
              <button onClick={() => setShowStylistModal(false)} className="text-bone/40 hover:text-red-crimson transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddStylist} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="First Name" className="bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none" value={newStylist.firstName} onChange={e => setNewStylist({...newStylist, firstName: e.target.value})} />
                <input required placeholder="Last Name" className="bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none" value={newStylist.lastName} onChange={e => setNewStylist({...newStylist, lastName: e.target.value})} />
              </div>
              <select required className="w-full bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none" value={newStylist.locationId} onChange={e => setNewStylist({...newStylist, locationId: e.target.value})}>
                <option value="">Assigned Shop Depot</option>
                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
              </select>
              <textarea placeholder="Artisan Bio / Protocol Experience" className="w-full bg-obsidian/80 border border-gold-champagne/20 rounded-xl p-3 text-bone focus:border-gold-champagne outline-none min-h-[100px]" value={newStylist.bio} onChange={e => setNewStylist({...newStylist, bio: e.target.value})} />
              <button type="submit" className="w-full py-4 mt-4 bg-gold-champagne text-ink font-bold rounded-xl shadow-xl shadow-gold-champagne/20 transition-all flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Confirm Enlistment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Shop Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/10 backdrop-blur-sm">
          <div className="bg-slate border border-gold-champagne/30 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="font-display text-3xl font-bold text-bone mb-6 uppercase italic">Register <span className="text-gold-champagne">Shop</span></h2>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <input required placeholder="Shop Name" className="w-full bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newLocation.name} onChange={e => setNewLocation({...newLocation, name: e.target.value})} />
              <input required placeholder="Street Address" className="w-full bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newLocation.address} onChange={e => setNewLocation({...newLocation, address: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" className="bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newLocation.city} onChange={e => setNewLocation({...newLocation, city: e.target.value})} />
                <input required placeholder="ST" className="bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newLocation.state} onChange={e => setNewLocation({...newLocation, state: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Zip" className="bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newLocation.zipCode} onChange={e => setNewLocation({...newLocation, zipCode: e.target.value})} />
                <input required placeholder="Phone" className="bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newLocation.phone} onChange={e => setNewLocation({...newLocation, phone: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowLocationModal(false)} className="flex-1 py-4 bg-obsidian text-bone/40 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-gold-champagne text-ink font-bold rounded-xl">Launch Shop</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/10 backdrop-blur-sm">
          <div className="bg-slate border border-gold-champagne/30 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="font-display text-3xl font-bold text-bone mb-6 uppercase italic">Issue <span className="text-gold-champagne">Tier</span></h2>
            <form onSubmit={handleAddPlan} className="space-y-4">
              <input required placeholder="Tier Designation (e.g. Premium)" className="w-full bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} />
              <textarea required placeholder="Description of services" className="w-full bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none min-h-[80px]" value={newPlan.description} onChange={e => setNewPlan({...newPlan, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" required placeholder="Price" className="bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})} />
                <input type="number" required placeholder="Visits/Mo" className="bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newPlan.visitsPerMonth} onChange={e => setNewPlan({...newPlan, visitsPerMonth: Number(e.target.value)})} />
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
              <select className="w-full bg-obsidian border border-gold-champagne/20 rounded-xl p-3 text-bone outline-none" value={newPlan.locationId} onChange={e => setNewPlan({...newPlan, locationId: e.target.value})}>
                <option value="">Global (All Shops)</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowPlanModal(false)} className="flex-1 py-4 bg-obsidian text-bone/40 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-gold-champagne text-ink font-bold rounded-xl">Authorize Tier</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}

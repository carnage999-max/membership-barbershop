"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Clock, Bell, History, Users, CreditCard, LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { memberships as membershipsApi, queue as queueApi, checkIns as checkInsApi, stylists as stylistsApi, payments as paymentsApi, tokenStorage, session } from "@/lib/api-client";
import { useUser } from "@/lib/hooks";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";

export default function AccountPage() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { alert, confirm } = useConfirmation();
  const [membership, setMembership] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myQueuePosition, setMyQueuePosition] = useState<any>(null);
  const [visitHistory, setVisitHistory] = useState<any[]>([]);
  const [followingStylistsCount, setFollowingStylistsCount] = useState(0);

  useEffect(() => {
    const token = tokenStorage.get();
    const currentUser = session.getCurrentUser();

    if (!token || !currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    loadMembership(token);
  }, [router]);

  async function loadMembership(token: string) {
    try {
      const [membershipResult, queueResult, checkInsResult, stylistsResult] = await Promise.all([
        membershipsApi.getMyMembership(token).catch(() => ({ membership: null })),
        queueApi.getMyPosition(token).catch(() => ({ queueEntry: null })),
        checkInsApi.getHistory(token, 5).catch(() => ({ checkIns: [] })),
        stylistsApi.getAll(undefined, undefined, token).catch(() => ({ stylists: [] }))
      ]);
      setMembership(membershipResult.membership);
      setMyQueuePosition(queueResult.queueEntry || null);
      setVisitHistory(checkInsResult.checkIns || []);
      
      const followedCount = (stylistsResult.stylists || []).filter((s: any) => s.isFollowing).length;
      setFollowingStylistsCount(followedCount);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLeaveQueue() {
    const isConfirmed = await confirm({
      title: "Exit Pit Lane",
      message: "Are you sure you want to surrender your position? You'll lose your spot in the service bay.",
      confirmText: "Surrender Spot",
      isDanger: true
    });

    if (!isConfirmed) return;

    try {
      const token = tokenStorage.get();
      if (!token) return;
      await queueApi.leave(token);
      setMyQueuePosition(null);
      toast.success("Pit spot surrendered");
    } catch (error: any) {
      toast.error(error.message || 'Failed to exit queue');
    }
  }

  async function handleManagePayments() {
    try {
      const token = tokenStorage.get();
      if (!token) return;
      
      const result = await paymentsApi.createPortalSession(token);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to open billing portal');
    }
  }

  function handleLogout() {
    session.logout();
    router.push('/');
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 border-4 border-neon-red/20 border-t-neon-red rounded-full animate-spin mx-auto mb-6 shadow-neon-red"></div>
          <p className="text-chrome/50 font-black italic uppercase tracking-widest text-sm animate-pulse">Syncing Data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="font-display text-5xl md:text-8xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
              My Dashboard
            </h1>
            <p className="text-chrome/60 text-lg italic uppercase tracking-widest font-bold">
              Welcome back, <span className="text-neon-red">{user?.firstName || 'Racer'}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-chrome font-black uppercase italic tracking-widest rounded-xl transition-all border border-white/10 group"
          >
            <LogOut className="w-4 h-4 group-hover:text-neon-red transition-colors" />
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* My Performance Grade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-steel-dark/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 relative group"
          >
            <div className="flex items-center gap-4 mb-8">
              <Zap className="w-8 h-8 text-neon-red drop-shadow-[0_0_8px_rgba(255,49,49,0.5)]" />
              <h2 className="font-display text-3xl font-black text-white italic uppercase tracking-tighter">
                Performance Grade
              </h2>
            </div>
            {membership ? (
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center bg-obsidian/40 p-4 rounded-xl border border-white/5">
                  <span className="text-chrome/40 text-[10px] uppercase font-black tracking-widest">Active Grade</span>
                  <span className="font-black text-white italic text-xl uppercase tracking-tighter shadow-neon-red">{membership.plan.name}</span>
                </div>
                <div className="flex justify-between items-center bg-obsidian/40 p-4 rounded-xl border border-white/5">
                  <span className="text-chrome/40 text-[10px] uppercase font-black tracking-widest">Service Usage</span>
                  <span className="font-black text-white italic">{membership.cutsRemaining} / {membership.plan.visitsPerMonth} Visits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-chrome/40 text-[10px] uppercase font-black tracking-widest">Status</span>
                  <span className="font-black text-neon-red italic uppercase tracking-widest text-xs animate-pulse">{membership.status}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                <p className="text-chrome/40 italic">No active performance optimizations detected.</p>
                <Link
                  href="/membership"
                  className="inline-block px-8 py-4 bg-neon-red hover:bg-racing-red text-white font-display font-black uppercase italic tracking-widest rounded-xl transition-all shadow-neon-red"
                >
                  Select Grade
                </Link>
              </div>
            )}
            {membership && (
              <button
                onClick={handleManagePayments}
                className="w-full px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase italic tracking-widest rounded-xl transition-all border border-white/10 text-center text-sm"
              >
                Manage Subscription
              </button>
            )}
          </motion.div>

          {/* Pit Pass */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-steel-dark/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 relative group"
          >
            <div className="flex items-center gap-4 mb-8">
              <History className="w-8 h-8 text-chrome" />
              <h2 className="font-display text-3xl font-black text-white italic uppercase tracking-tighter">
                Pit Pass
              </h2>
            </div>
            {myQueuePosition ? (
              <div className="space-y-4 mb-8">
                <div className="bg-obsidian/40 p-6 rounded-xl border border-neon-red/20 text-center">
                  <div className="text-[10px] text-chrome/40 uppercase font-black tracking-widest mb-1">Queue Position</div>
                  <div className="text-6xl font-display font-black text-neon-red italic tracking-tighter shadow-neon-red">#{myQueuePosition.position}</div>
                  <div className="text-chrome/60 italic text-sm mt-2">{myQueuePosition.location.name}</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-chrome/40 text-[10px] uppercase font-black tracking-widest">Estimated Wait</span>
                  <span className="font-black text-white italic">{myQueuePosition.estimatedWait} MIN</span>
                </div>
                <button
                  onClick={handleLeaveQueue}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-chrome font-black uppercase italic tracking-widest rounded-xl transition-all border border-white/10 mt-4"
                >
                  Exit Pit Lane
                </button>
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                <p className="text-chrome/40 italic">Vehicle not currently in the service queue.</p>
                <Link
                  href="/locations"
                  className="inline-block px-8 py-4 bg-neon-red hover:bg-racing-red text-white font-display font-black uppercase italic tracking-widest rounded-xl transition-all shadow-neon-red"
                >
                  Search Garages
                </Link>
              </div>
            )}
          </motion.div>

          {/* Tech Crew */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-steel-dark/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 relative"
          >
            <div className="flex items-center gap-4 mb-8">
              <Users className="w-8 h-8 text-chrome" />
              <h2 className="font-display text-3xl font-black text-white italic uppercase tracking-tighter">
                Tech Crew
              </h2>
            </div>
            <p className="text-chrome/60 italic text-sm mb-8">
              You are currently optimized by {followingStylistsCount} master technician{followingStylistsCount === 1 ? '' : 's'}.
            </p>
            <Link
              href="/stylists"
              className="inline-block px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase italic tracking-widest rounded-xl transition-all border border-white/10 text-sm"
            >
              Recruit Technicians
            </Link>
          </motion.div>


          {/* Mission Control - Only for Admins */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 bg-neon-red/10 backdrop-blur-md rounded-2xl p-10 border border-neon-red/30 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,49,49,0.1),transparent)]" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <Shield className="w-12 h-12 text-neon-red shadow-neon-red" />
                  <div>
                    <h2 className="font-display text-4xl font-black text-white italic uppercase tracking-tighter">
                      Site Management
                    </h2>
                    <p className="text-white/60 text-sm mt-1 font-bold italic uppercase tracking-widest">
                      Admin Operations Center
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin"
                  className="px-10 py-5 bg-neon-red hover:bg-racing-red text-white font-display text-xl font-black uppercase italic tracking-widest rounded-xl transition-all shadow-neon-red group/adm"
                >
                  Enter Site Management
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}


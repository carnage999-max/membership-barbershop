"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, Clock, Bell, History, Users, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { memberships as membershipsApi, queue as queueApi, checkIns as checkInsApi, stylists as stylistsApi, payments as paymentsApi, tokenStorage, session } from "@/lib/api-client";

export default function AccountPage() {
  const router = useRouter();
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
    try {
      const token = tokenStorage.get();
      if (!token) return;
      await queueApi.leave(token);
      setMyQueuePosition(null);
    } catch (error) {
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
      alert(err.message || 'Failed to open billing portal');
    }
  }

  function handleLogout() {
    session.logout();
    router.push('/');
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gold-champagne/20 border-t-gold-champagne rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-bone/70">Loading account...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4">
              Account
            </h1>
            <p className="text-bone/70 text-lg">
              Welcome back, {user?.firstName || 'Member'}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate/50 hover:bg-slate/80 text-bone rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* My Membership */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-6 h-6 text-gold-champagne" />
              <h2 className="font-display text-2xl font-bold text-bone">
                My Membership Barbershop
              </h2>
            </div>
            {membership ? (
              <div className="space-y-2 mb-4">
                <p className="text-bone/80">
                  <span className="text-bone/60">Plan:</span>{" "}
                  <span className="font-semibold text-gold-champagne">{membership.plan.name}</span>
                </p>
                <p className="text-bone/80">
                  <span className="text-bone/60">Cuts Remaining:</span>{" "}
                  <span className="font-semibold">{membership.cutsRemaining}/{membership.plan.cutsPerMonth}</span>
                </p>
                <p className="text-bone/80">
                  <span className="text-bone/60">Status:</span>{" "}
                  <span className="font-semibold text-success">{membership.status}</span>
                </p>
                <p className="text-bone/80">
                  <span className="text-bone/60">Renewal:</span>{" "}
                  <span className="font-semibold">{membership.autoRenew ? 'Auto-renews monthly' : 'Manual renewal'}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <p className="text-bone/60">No active membership</p>
                <Link
                  href="/membership"
                  className="inline-block px-4 py-2 bg-red-crimson hover:bg-red-crimson/90 text-bone font-medium rounded-lg transition-colors duration-150 text-sm"
                >
                  Get Membership Barbershop
                </Link>
              </div>
            )}
            {membership && (
              <Link
                href="/membership"
                className="inline-block px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm"
              >
                Manage Billing
              </Link>
            )}
          </motion.div>

          {/* Queue Token */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-red-crimson" />
              <h2 className="font-display text-2xl font-bold text-bone">
                My Queue Token
              </h2>
            </div>
            {myQueuePosition ? (
              <>
                <p className="text-bone/80 mb-2">
                  <span className="text-bone/60">Position:</span>{" "}
                  <span className="font-semibold text-gold-champagne">#{myQueuePosition.position}</span> at {myQueuePosition.location.name}
                </p>
                <p className="text-bone/80 mb-4">
                  <span className="text-bone/60">Wait:</span>{" "}
                  <span className="font-semibold">{myQueuePosition.estimatedWait} minutes</span>
                </p>
                <button
                  onClick={handleLeaveQueue}
                  className="inline-block px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm"
                >
                  Leave Queue
                </button>
              </>
            ) : (
              <>
                <p className="text-bone/60 text-sm mb-4">
                  You're not currently checked in
                </p>
                <Link
                  href="/book"
                  className="inline-block px-4 py-2 bg-red-crimson hover:bg-red-crimson/90 text-bone font-medium rounded-lg transition-colors duration-150 text-sm"
                >
                  Check In Now
                </Link>
              </>
            )}
          </motion.div>

          {/* My Stylists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-gold-champagne" />
              <h2 className="font-display text-2xl font-bold text-bone">
                My Stylists
              </h2>
            </div>
            <p className="text-bone/60 text-sm mb-4">
              You're following {followingStylistsCount} stylist{followingStylistsCount === 1 ? '' : 's'}
            </p>
            <Link
              href="/stylists"
              className="inline-block px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm"
            >
              View All Stylists
            </Link>
          </motion.div>

          {/* Visit History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <History className="w-6 h-6 text-bone/60" />
              <h2 className="font-display text-2xl font-bold text-bone">
                Visit History
              </h2>
            </div>
            {visitHistory.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {visitHistory.slice(0, 2).map((visit: any) => (
                  <li key={visit.id} className="text-bone/80 text-sm flex justify-between">
                    <span>{new Date(visit.checkInTime).toLocaleDateString()}</span>
                    <span className="text-gold-champagne">{visit.location.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-bone/60 text-sm mb-4">
                No recent visits found
              </p>
            )}
            <Link 
              href="/account"
              className="inline-block px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm cursor-not-allowed opacity-50"
            >
              Full History (Coming Soon)
            </Link>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-bone/60" />
              <h2 className="font-display text-2xl font-bold text-bone">
                Payment Methods
              </h2>
            </div>
            <p className="text-bone/60 text-sm mb-4">
              Manage your payment methods and receipts securely via Stripe
            </p>
            <button onClick={handleManagePayments} className="px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm">
              Manage Payments
            </button>
          </motion.div>

        </div>
      </div>
    </main>
  );
}


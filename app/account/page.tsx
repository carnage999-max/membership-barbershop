"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, Clock, Bell, History, Users, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { memberships as membershipsApi, tokenStorage, session } from "@/lib/api-client";

export default function AccountPage() {
  const router = useRouter();
  const [membership, setMembership] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      const result = await membershipsApi.getMyMembership(token);
      setMembership(result.membership);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load membership:', error);
      setLoading(false);
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
            <p className="text-bone/60 text-sm mb-4">
              You're not currently checked in
            </p>
            <Link
              href="/book"
              className="inline-block px-4 py-2 bg-red-crimson hover:bg-red-crimson/90 text-bone font-medium rounded-lg transition-colors duration-150 text-sm"
            >
              Check In Now
            </Link>
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
              You're following 2 stylists
            </p>
            <Link
              href="/stylists"
              className="inline-block px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm"
            >
              View All
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
            <p className="text-bone/60 text-sm mb-4">
              View your past visits and preferences
            </p>
            <button className="px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm">
              View History
            </button>
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
              Manage your payment methods and receipts
            </p>
            <button className="px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm">
              Manage Payments
            </button>
          </motion.div>

          {/* Family Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-bone/60" />
              <h2 className="font-display text-2xl font-bold text-bone">
                Family Members
              </h2>
            </div>
            <p className="text-bone/60 text-sm mb-4">
              Manage profiles for family members
            </p>
            <button className="px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm">
              Add Member
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}


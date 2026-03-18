"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MembershipTierCard from "@/components/MembershipTierCard";
import FrequencySliderCalculator from "@/components/FrequencySliderCalculator";
import { Check, X, Gauge, ShieldAlert, BadgeCheck } from "lucide-react";
import { memberships as membershipsApi, tokenStorage } from "@/lib/api-client";
import SubscribeModal from "@/components/modals/SubscribeModal";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  visitsPerMonth: number;
  isUnlimited: boolean;
  mvpAccess: boolean;
  priority: boolean;
}

export default function MembershipPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedTier, setRecommendedTier] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        const result = await membershipsApi.getPlans();
        // Sort plans by price
        const sortedPlans = result.plans.sort((a: any, b: any) => a.price - b.price);
        setPlans(sortedPlans);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load membership plans:', error);
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-t-4 border-neon-red border-solid rounded-full animate-spin mx-auto mb-6 shadow-neon-red"></div>
          <p className="font-display text-xl text-white uppercase italic tracking-widest animate-pulse">
            Syncing Performance Data...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-obsidian pb-32">
      {/* Hero Header */}
      <section className="relative py-24 overflow-hidden border-b border-white/5">
         <div className="absolute inset-0 z-0">
            <Image 
              src="/images/grades-stock_modified_turbo_supercharged.png"
              alt="Performance Grades"
              fill
              className="object-cover opacity-20 filter grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent" />
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
               <h1 className="font-display text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-6">
                 High Performance <span className="chrome-text">Memberships</span>
               </h1>
               <p className="text-chrome/60 text-xl max-w-2xl mx-auto italic font-body">
                 Engineered for the recurring client. Members save an average of 40% compared to standard pricing.
               </p>
            </div>
         </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Frequency Calculator */}
        <div className="max-w-4xl mx-auto mb-24 -mt-20 relative z-20">
          <div className="bg-steel-dark/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <FrequencySliderCalculator
              onFrequencyChange={(visits, tier) => setRecommendedTier(tier)}
              onJoinClick={() => {
                const el = document.getElementById("membership-tiers");
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
          </div>
        </div>

        {/* Tier Cards */}
        <div id="membership-tiers" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <MembershipTierCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                visitsIncluded={plan.visitsPerMonth}
                isUnlimited={plan.isUnlimited}
                isHighlighted={recommendedTier?.toUpperCase() === plan.name.toUpperCase()}
                onSelect={() => {
                  const token = tokenStorage.get();
                  if (!token) {
                    router.push("/login?redirect=/membership");
                    return;
                  }
                  setSelectedPlan(plan);
                  setIsModalOpen(true);
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/5">
               <ShieldAlert className="w-12 h-12 text-neon-red mx-auto mb-4" />
               <p className="font-display text-2xl text-white uppercase italic">No Performance Grades Available</p>
            </div>
          )}
        </div>

        {/* Comparison Radar */}
        <section className="mb-24">
           <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-black text-white italic tracking-tight uppercase">
                Technical <span className="text-neon-red">Specifications</span>
              </h2>
           </div>

           <div className="bg-carbon rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="py-6 px-8 font-display text-xl font-black text-white uppercase italic tracking-wider">Features</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="py-6 px-8 text-center font-display text-xl font-black text-white uppercase italic">
                           {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                       <td className="py-5 px-8 text-chrome/60 font-medium">Monthly Investment</td>
                       {plans.map(p => <td key={p.id} className="py-5 px-8 text-center text-white font-black font-display text-lg">${p.price}</td>)}
                    </tr>
                    <tr>
                       <td className="py-5 px-8 text-chrome/60 font-medium">Haircut Access</td>
                       {plans.map(p => <td key={p.id} className="py-5 px-8 text-center text-chrome italic">{p.isUnlimited ? "Unlimited" : `${p.visitsPerMonth} / mo`}</td>)}
                    </tr>
                    <tr>
                       <td className="py-5 px-8 text-chrome/60 font-medium">Scheduling Priority</td>
                       {plans.map(p => <td key={p.id} className="py-5 px-8 text-center">
                          {p.name !== 'STOCK' ? <BadgeCheck className="w-6 h-6 text-neon-red mx-auto" /> : <X className="w-5 h-5 text-white/10 mx-auto" />}
                       </td>)}
                    </tr>
                    <tr>
                       <td className="py-5 px-8 text-chrome/60 font-medium">Thermal Reset (Hot Towel)</td>
                       {plans.map(p => <td key={p.id} className="py-5 px-8 text-center">
                          {p.name !== 'STOCK' ? <Check className="w-6 h-6 text-success mx-auto" /> : <X className="w-5 h-5 text-white/10 mx-auto" />}
                       </td>)}
                    </tr>
                    <tr>
                       <td className="py-5 px-8 text-chrome/60 font-medium">Precision Cleanup (Beard)</td>
                       {plans.map(p => <td key={p.id} className="py-5 px-8 text-center">
                          {['TURBO', 'SUPERCHARGED'].includes(p.name.toUpperCase()) ? <Check className="w-6 h-6 text-success mx-auto" /> : <X className="w-5 h-5 text-white/10 mx-auto" />}
                       </td>)}
                    </tr>
                    <tr>
                       <td className="py-5 px-8 text-chrome/60 font-medium">Masssage Recovery</td>
                       {plans.map(p => <td key={p.id} className="py-5 px-8 text-center">
                          {p.name.toUpperCase() === 'SUPERCHARGED' ? <Check className="w-6 h-6 text-success mx-auto" /> : <X className="w-5 h-5 text-white/10 mx-auto" />}
                       </td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
           </div>
        </section>

        {/* Performance FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl font-black text-white italic tracking-tight uppercase text-center mb-12">
            Service <span className="text-neon-red">Bulletin</span> (FAQ)
          </h2>
          <div className="grid gap-4">
          {[
            {
              q: "Can I upgrade my performance grade?",
              a: "Absolutely. You can move up to a higher grade level at any time through your dashboard. Adjustments are instantly calibrated.",
            },
            {
              q: "Does hair growth rollover?",
              a: "Since we've moved to a high-performance unlimited model, rollover is no longer necessary. Maintain your look without limits.",
            },
            {
              q: "What is the Express Member Lane?",
              a: "Modified grade and above members bypass the standard queue for priority bench time, ensuring you're back on the road faster.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
            >
              <h3 className="font-display text-xl font-bold text-white mb-2 uppercase italic tracking-tight">
                {faq.q}
              </h3>
              <p className="text-chrome/60 italic">{faq.a}</p>
            </motion.div>
          ))}
          </div>
        </div>
      </div>

      <SubscribeModal
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          router.push("/account");
        }}
      />
    </main>
  );
}


"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MembershipTierCard from "@/components/MembershipTierCard";
import FrequencySliderCalculator from "@/components/FrequencySliderCalculator";
import { Check, X } from "lucide-react";
import { memberships as membershipsApi, tokenStorage } from "@/lib/api-client";
import SubscribeModal from "@/components/modals/SubscribeModal";
import { useRouter } from "next/navigation";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  visitsPerMonth: number;
  isUnlimited: boolean;
  mvpAccess: boolean;
  priority: boolean;
  location?: {
    name: string;
    city: string;
    state: string;
  };
}

const haircutOnlyTiers = [
  {
    name: "Basic",
    price: 29.99,
    visitsIncluded: 1,
    rollover: false,
    bookingPriority: false,
    guestPasses: 0,
    track: "haircut-only" as const,
  },
  {
    name: "Standard",
    price: 39.99,
    visitsIncluded: 2,
    rollover: true,
    bookingPriority: false,
    guestPasses: 1,
    track: "haircut-only" as const,
  },
  {
    name: "Premium",
    price: 49.99,
    visitsIncluded: 4,
    rollover: true,
    bookingPriority: true,
    guestPasses: 2,
    track: "haircut-only" as const,
  },
  {
    name: "Unlimited",
    price: 65.99,
    visitsIncluded: Infinity,
    rollover: false,
    bookingPriority: true,
    guestPasses: 3,
    track: "haircut-only" as const,
    isUnlimited: true,
  },
];

const signatureTiers = [
  {
    name: "MVP Basic",
    price: 39.99,
    visitsIncluded: 1,
    rollover: false,
    bookingPriority: false,
    guestPasses: 0,
    track: "signature" as const,
  },
  {
    name: "MVP Standard",
    price: 49.99,
    visitsIncluded: 2,
    rollover: true,
    bookingPriority: false,
    guestPasses: 1,
    track: "signature" as const,
  },
  {
    name: "MVP Premium",
    price: 59.99,
    visitsIncluded: 4,
    rollover: true,
    bookingPriority: true,
    guestPasses: 2,
    track: "signature" as const,
  },
  {
    name: "MVP Unlimited",
    price: 79.99,
    visitsIncluded: Infinity,
    rollover: false,
    bookingPriority: true,
    guestPasses: 3,
    track: "signature" as const,
    isUnlimited: true,
  },
];

export default function MembershipPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<"haircut-only" | "signature">("haircut-only");
  const [recommendedTier, setRecommendedTier] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        const result = await membershipsApi.getPlans();
        setPlans(result.plans);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load membership plans:', error);
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  // Separate plans by MVP access
  const haircutOnlyPlans = plans.filter(p => !p.mvpAccess);
  const signaturePlans = plans.filter(p => p.mvpAccess);

  const tiers = selectedTrack === "haircut-only" ? haircutOnlyPlans : signaturePlans;

  if (loading) {
    return (
      <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gold-champagne/20 border-t-gold-champagne rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-bone/70">Loading Membership Barbershop plans...</p>
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
          <h1 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4">
            Membership Barbershop
          </h1>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Premium subscription product, not a haircut coupon. Choose your track and find your perfect plan.
          </p>
        </div>

        {/* Track Selector */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedTrack("haircut-only")}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-150 ${
              selectedTrack === "haircut-only"
                ? "bg-gold-champagne text-ink"
                : "bg-slate/50 text-bone/70 hover:bg-slate/80"
            }`}
          >
            Haircut-Only
          </button>
          <button
            onClick={() => setSelectedTrack("signature")}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-150 ${
              selectedTrack === "signature"
                ? "bg-gold-champagne text-ink"
                : "bg-slate/50 text-bone/70 hover:bg-slate/80"
            }`}
          >
            Concours Detail (High-Pressure Wash + Massage)
          </button>
        </div>

        {/* Frequency Calculator */}
        <div className="max-w-3xl mx-auto mb-16">
          <FrequencySliderCalculator
            onFrequencyChange={(visits, tier) => setRecommendedTier(tier)}
            onJoinClick={() => {
              const el = document.getElementById("membership-tiers");
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Tier Cards */}
        <div id="membership-tiers" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tiers.length > 0 ? (
            tiers.map((plan) => (
              <MembershipTierCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                visitsIncluded={plan.visitsPerMonth}
                rollover={false}
                bookingPriority={plan.priority}
                guestPasses={0}
                effectiveCostPerCut={plan.isUnlimited ? 0 : plan.price / plan.visitsPerMonth}
                track={plan.mvpAccess ? "signature" : "haircut-only"}
                isUnlimited={plan.isUnlimited}
                isHighlighted={recommendedTier === plan.name}
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
            <div className="col-span-full text-center py-12">
              <p className="text-bone/60">No plans available to you now</p>
            </div>
          )}
        </div>

        {/* Compare Table */}
        <div className="bg-slate/50 backdrop-blur-sm rounded-xl p-8 border border-gold-champagne/20 mb-12">
          <h2 className="font-display text-3xl font-bold text-bone mb-8 text-center">
            Compare Plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-champagne/20">
                  <th className="text-left py-4 px-4 font-display text-lg font-bold text-bone">
                    Feature
                  </th>
                  {tiers.map((tier) => (
                    <th
                      key={tier.name}
                      className="text-center py-4 px-4 font-display text-lg font-bold text-bone"
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gold-champagne/10">
                  <td className="py-4 px-4 text-bone/80">Monthly Price</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="py-4 px-4 text-center text-bone font-semibold">
                      ${tier.price}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gold-champagne/10">
                  <td className="py-4 px-4 text-bone/80">Visits Included</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="py-4 px-4 text-center text-bone">
                      {tier.visitsPerMonth >= 99 ? "Unlimited" : tier.visitsPerMonth}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gold-champagne/10">
                  <td className="py-4 px-4 text-bone/80">Rollover</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="py-4 px-4 text-center">
                      {(tier as any).rollover || tier.visitsPerMonth > 1 && tier.visitsPerMonth < 99 ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-bone/30 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gold-champagne/10">
                  <td className="py-4 px-4 text-bone/80">Back Shave + Hot Towel</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="py-4 px-4 text-center">
                      {tier.mvpAccess ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-bone/30 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gold-champagne/10">
                  <td className="py-4 px-4 text-bone/80">5m Stress Recovery</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="py-4 px-4 text-center">
                      {tier.mvpAccess ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-bone/30 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gold-champagne/10">
                  <td className="py-4 px-4 text-bone/80">Booking Priority</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="py-4 px-4 text-center">
                      {tier.priority ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-bone/30 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-bone/80">Guest Passes</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="py-4 px-4 text-center text-bone">
                      {tier.visitsPerMonth > 2 ? "1 / mo" : "0"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-display text-3xl font-bold text-bone mb-8 text-center">
            Frequently Asked Questions
          </h2>
          {[
            {
              q: "Can I upgrade or downgrade my tier?",
              a: "Yes, you can change your membership tier at any time. Changes take effect on your next billing cycle with proration applied.",
            },
            {
              q: "What happens to unused visits?",
              a: "Unused visits roll over on Pro and Elite tiers. Essential tier visits expire at the end of each month.",
            },
            {
              q: "Can I pause my membership?",
              a: "Yes, you can pause your membership for up to 3 months per year. Contact support to pause.",
            },
            {
              q: "What is booking priority?",
              a: "Elite and Unlimited members get priority access to busy-hour slots and Concours Detail appointments.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
            >
              <h3 className="font-display text-xl font-bold text-bone mb-2">
                {faq.q}
              </h3>
              <p className="text-bone/70">{faq.a}</p>
            </motion.div>
          ))}
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


"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ChevronRight, Check, ShieldCheck, Loader2 } from "lucide-react";
import { memberships, tokenStorage } from "@/lib/api-client";

interface SubscribeModalProps {
  plan: {
    id: string;
    name: string;
    price: number;
    cutsPerMonth: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubscribeModal({ plan, isOpen, onClose, onSuccess }: SubscribeModalProps) {
  const [loading, setLoading] = useState(false);
  const [cardHolder, setCardHolder] = useState("");
  const [success, setSuccess] = useState(false);

  if (!plan) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenStorage.get();
    if (!token) return;

    setLoading(true);
    try {
      // Simulate Stripe payment method creation + subscription
      // In a real app, you'd use Stripe Elements here
      const mockPaymentMethodId = "pm_card_visa";
      
      await memberships.subscribe(plan.id, mockPaymentMethodId, token);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-slate border border-gold-champagne/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gold-champagne/10 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-bone">
                Activate {plan.name}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-bone/60" />
              </button>
            </div>

            {success ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-success" />
                </motion.div>
                <h3 className="text-2xl font-display font-bold text-bone mb-2">
                  Membership Activated
                </h3>
                <p className="text-bone/60">
                  Welcome to the Brotherhood. Your membership is ready.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="p-6">
                {/* Order Summary */}
                <div className="bg-obsidian/40 rounded-xl p-4 border border-gold-champagne/10 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-bone/60">Subscription Tier</span>
                    <span className="text-bone font-bold">{plan.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-bone/60">Monthly Sessions</span>
                    <span className="text-bone">{plan.cutsPerMonth} sessions</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gold-champagne/10 flex justify-between items-center">
                    <span className="text-bone font-bold">Total Due Now</span>
                    <span className="text-2xl font-display font-bold text-gold-champagne">
                      ${plan.price}/mo
                    </span>
                  </div>
                </div>

                {/* Secure Checkout Info */}
                <div className="flex items-center gap-2 mb-6 text-success text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  Standard Encryption Active
                </div>

                {/* Card Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-bone/50 font-bold uppercase mb-1.5 ml-1">
                      Member Name (on card)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Lewis Hamilton"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-obsidian border border-gold-champagne/20 rounded-lg p-3 text-bone focus:border-gold-champagne outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-bone/50 font-bold uppercase mb-1.5 ml-1">
                      Card Details (Simulated)
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bone/30" />
                      <div className="w-full bg-obsidian/40 border border-gold-champagne/10 rounded-lg p-3 pl-12 text-bone/40">
                        •••• •••• •••• 4242
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gold-champagne text-ink font-bold rounded-xl hover:shadow-[0_0_20px_rgba(200,162,74,0.3)] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Authorize Membership <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-bone/40 leading-relaxed px-4">
                    By clicking Authorize, you agree to our Terms of Service and authorize Membership Barbershop to charge your payment method monthly until you cancel.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

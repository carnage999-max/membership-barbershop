"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ChevronRight, Check, ShieldCheck, Loader2 } from "lucide-react";
import { memberships, tokenStorage } from "@/lib/api-client";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";

interface SubscribeModalProps {
  plan: {
    id: string;
    name: string;
    price: number;
    visitsPerMonth: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubscribeModal({ plan, isOpen, onClose, onSuccess }: SubscribeModalProps) {
  const { alert } = useConfirmation();
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
      const mockPaymentMethodId = "pm_card_visa";
      await memberships.subscribe(plan.id, mockPaymentMethodId, token);
      
      setSuccess(true);
      toast.success(`${plan.name} Grade Optimized`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Diagnostics failed");
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
            className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-steel-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between relative z-10">
              <h2 className="font-display text-2xl font-black text-white italic uppercase tracking-tighter">
                Install {plan.name}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-chrome/60" />
              </button>
            </div>

            {success ? (
              <div className="p-12 text-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-neon-red/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-red/30 shadow-neon-red"
                >
                  <Check className="w-12 h-12 text-neon-red" />
                </motion.div>
                <h3 className="text-3xl font-display font-black text-white mb-2 uppercase italic tracking-tighter">
                  Grade Activated
                </h3>
                <p className="text-chrome/60 italic">
                  Welcome to the Garage. System optimized.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="p-8 relative z-10">
                {/* Order Summary */}
                <div className="bg-obsidian/60 rounded-xl p-5 border border-white/5 mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-chrome/50 text-xs font-bold uppercase tracking-widest italic">Performance Grade</span>
                    <span className="text-white font-black italic">{plan.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-chrome/50 text-xs font-bold uppercase tracking-widest italic">Service Cycles</span>
                    <span className="text-white font-black italic">{plan.visitsPerMonth >= 99 ? 'UNLIMITED' : plan.visitsPerMonth} / month</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-white font-black italic text-xs uppercase tracking-widest">Monthly Fuel</span>
                    <span className="text-3xl font-display font-black text-neon-red italic tracking-tighter shadow-neon-red">
                      ${plan.price}
                    </span>
                  </div>
                </div>

                {/* Secure Checkout Info */}
                <div className="flex items-center gap-2 mb-8 text-chrome text-[10px] font-black uppercase tracking-[0.2em] italic">
                  <ShieldCheck className="w-4 h-4 text-neon-red" />
                  End-to-End Encryption Secured
                </div>

                {/* Card Information */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] text-chrome/40 font-black uppercase tracking-widest mb-2 italic">
                      Driver Name (on card)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="E.G. LEWIS HAMILTON"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-obsidian border border-white/10 rounded-xl p-4 text-white placeholder:text-white/10 focus:border-neon-red outline-none transition-all font-bold italic uppercase text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-chrome/40 font-black uppercase tracking-widest mb-2 italic">
                      Fueling Details (Simulated)
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chrome/20" />
                      <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-14 text-white/30 font-bold italic tracking-widest text-sm">
                        •••• •••• •••• 4242
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full relative flex items-center justify-center gap-3 py-5 bg-neon-red hover:bg-racing-red text-white font-display text-lg font-black uppercase italic tracking-widest rounded-xl transition-all shadow-neon-red group overflow-hidden disabled:opacity-50"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Authorize Grade <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-chrome/30 font-bold uppercase tracking-widest leading-relaxed px-6 italic">
                    By clicking Authorize, you agree to our Terms of Service and authorize Man Cave Barber Shops to charge your payment method monthly until cancelled.
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

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  showCancel?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  showCancel = true,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-obsidian/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-slate border border-gold-champagne/30 rounded-3xl p-8 shadow-[0_0_100px_rgba(206,178,131,0.15)] overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-champagne/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl font-display" />

            <div className="flex items-start gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isDanger ? "bg-red-crimson/10 text-red-crimson" : "bg-gold-champagne/10 text-gold-champagne"}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-bone uppercase italic tracking-tight leading-tight">
                  {title}
                </h2>
              </div>
              <button 
                onClick={onCancel}
                className="ml-auto text-bone/30 hover:text-red-crimson transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-bone/60 mb-8 leading-relaxed">
              {message}
            </p>

            <div className="flex gap-3">
              {showCancel && (
                <button
                  onClick={onCancel}
                  className="flex-1 py-4 px-6 bg-obsidian text-bone/40 font-bold rounded-xl border border-gold-champagne/10 hover:text-bone hover:border-gold-champagne/30 transition-all uppercase tracking-widest text-xs"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={() => {
                  onConfirm();
                }}
                className={`py-4 px-6 font-bold rounded-xl shadow-lg transition-all uppercase tracking-widest text-xs ${showCancel ? "flex-1" : "w-full"} ${
                  isDanger 
                  ? "bg-red-crimson text-bone shadow-red-crimson/20 hover:bg-red-crimson/90" 
                  : "bg-gold-champagne text-ink shadow-gold-champagne/20 hover:bg-gold-champagne/90"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

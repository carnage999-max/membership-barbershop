"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface WaitTimeBadgeProps {
  minutes: number;
  confidenceBand?: [number, number];
  status?: "available" | "limited" | "high" | "closed";
  pulse?: boolean;
}

export default function WaitTimeBadge({
  minutes,
  confidenceBand,
  status = "available",
  pulse = false,
}: WaitTimeBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "bg-success text-bone";
      case "limited":
        return "bg-warning text-ink";
      case "high":
        return "bg-danger text-bone";
      case "closed":
        return "bg-slate text-bone/50";
      default:
        return "bg-success text-bone";
    }
  };

  const displayTime = confidenceBand
    ? `${confidenceBand[0]}-${confidenceBand[1]} min`
    : `${minutes} min`;

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display text-sm font-semibold tabular-nums ${getStatusColor()}`}
      animate={pulse && status === "high" ? { scale: [1, 1.05, 1] } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{displayTime}</span>
    </motion.div>
  );
}


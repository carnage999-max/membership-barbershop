"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, X } from "lucide-react";
import { useState } from "react";

interface QueueTokenWidgetProps {
  locationName: string;
  estimatedWait: number;
  queuePosition?: number;
  onSwitchLocation?: () => void;
  onCancel?: () => void;
}

export default function QueueTokenWidget({
  locationName,
  estimatedWait,
  queuePosition,
  onSwitchLocation,
  onCancel,
}: QueueTokenWidgetProps) {
  const [timeRemaining, setTimeRemaining] = useState(estimatedWait);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 bg-slate/95 backdrop-blur-xl rounded-xl p-4 border-2 border-gold-champagne shadow-2xl"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display text-lg font-bold text-bone mb-1">
            You're checked in
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-bone/70">
            <MapPin className="w-4 h-4" />
            <span>{locationName}</span>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate rounded transition-colors duration-150"
            aria-label="Cancel check-in"
          >
            <X className="w-4 h-4 text-bone/60" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-red-crimson/20 border border-red-crimson/30 rounded-lg">
          <Clock className="w-4 h-4 text-red-crimson" />
          <span className="font-display text-lg font-bold text-bone tabular-nums">
            {timeRemaining} min
          </span>
        </div>
        {queuePosition && (
          <div className="text-sm text-bone/60">
            Position: <span className="font-semibold text-bone">{queuePosition}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-bone/60 mb-4">
        Check-in now, walk in confident. We'll notify you when it's your turn.
      </p>

      {onSwitchLocation && (
        <button
          onClick={onSwitchLocation}
          className="w-full px-4 py-2 bg-slate hover:bg-slate/80 text-bone font-medium rounded-lg transition-colors duration-150 text-sm border border-gold-champagne/20"
        >
          Switch Location
        </button>
      )}
    </motion.div>
  );
}


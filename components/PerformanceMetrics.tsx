"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ReviewMetric {
  category: string;
  rating: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
  last30Days: number;
}

const reviews: ReviewMetric[] = [
  { category: "Best Fade", rating: 4.9, trend: "up", trendValue: 0.2, last30Days: 127 },
  { category: "Fastest In/Out", rating: 4.8, trend: "up", trendValue: 0.1, last30Days: 98 },
  { category: "Best Signature Wash", rating: 4.9, trend: "stable", trendValue: 0, last30Days: 89 },
];

export default function PerformanceMetrics() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-danger" />;
      default:
        return <Minus className="w-4 h-4 text-bone/40" />;
    }
  };

  return (
    <section className="py-20 bg-slate/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-bone mb-4 italic uppercase tracking-tighter">
            Signature <span className="text-gold-champagne">Performance</span>
          </h2>
          <p className="text-bone/70 text-lg">
            Certified excellence in every category
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl font-bold text-bone">
                  {review.category}
                </h3>
                {getTrendIcon(review.trend)}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display text-4xl font-bold text-gold-champagne tabular-nums">
                    {review.rating}
                  </span>
                  <span className="text-bone/60">/ 5.0</span>
                </div>
                {review.trend !== "stable" && (
                  <p className={`text-sm ${review.trend === "up" ? "text-success" : "text-danger"}`}>
                    {review.trend === "up" ? "+" : "-"}{Math.abs(review.trendValue)} vs last month
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gold-champagne/10">
                <p className="text-sm text-bone/60">
                  <span className="font-semibold text-bone">{review.last30Days}</span> reviews in last 30 days
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


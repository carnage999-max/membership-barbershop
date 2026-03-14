"use client";

import { motion } from "framer-motion";

interface SuiteFeaturePanelProps {
  title: string;
  description: string;
  reverse?: boolean;
}

export default function SuiteFeaturePanel({
  title,
  description,
  reverse = false,
}: SuiteFeaturePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto text-center space-y-4"
    >
      <h3 className="font-display text-3xl font-bold text-bone">{title}</h3>
      <p className="text-bone/70 text-lg leading-relaxed">{description}</p>
    </motion.div>
  );
}


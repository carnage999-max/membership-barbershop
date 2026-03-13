"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const legalSections = [
  {
    title: "Terms of Service",
    slug: "terms",
    description: "Our terms and conditions for using our services",
  },
  {
    title: "Privacy Policy",
    slug: "privacy",
    description: "How we collect, use, and protect your personal information",
  },
  {
    title: "Auto-Renew Policy",
    slug: "auto-renew",
    description: "Information about automatic membership renewal",
  },
  {
    title: "Cancellation Policy",
    slug: "cancellation",
    description: "How to cancel your membership and refund information",
  },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4">
            Legal
          </h1>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Important legal information and policies
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {legalSections.map((section, index) => (
            <motion.div
              key={section.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20 hover:border-gold-champagne/40 transition-all duration-150"
            >
              <Link href={`/legal/${section.slug}`}>
                <h2 className="font-display text-2xl font-bold text-bone mb-2 hover:text-gold-champagne transition-colors">
                  {section.title}
                </h2>
                <p className="text-bone/70">{section.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}


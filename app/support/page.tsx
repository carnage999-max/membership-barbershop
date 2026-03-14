"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Membership",
    questions: [
      {
        q: "How do I cancel my membership?",
        a: "You can cancel your membership at any time from your account settings. Cancellations take effect at the end of your current billing cycle.",
      },
      {
        q: "Can I pause my membership?",
        a: "Yes, you can pause your membership for up to 3 months per year. Contact support to request a pause.",
      },
      {
        q: "What happens if I don't use all my visits?",
        a: "Pro and Elite tier unused visits roll over to the next month. Essential tier visits expire at month end.",
      },
    ],
  },
  {
    category: "Billing",
    questions: [
      {
        q: "How does billing work?",
        a: "Memberships are billed monthly on the same date you signed up. You'll receive an email receipt for each payment.",
      },
      {
        q: "Can I change my payment method?",
        a: "Yes, you can update your payment method anytime from your account settings under Billing.",
      },
      {
        q: "What is your refund policy?",
        a: "Membership fees are non-refundable, but you can cancel at any time to stop future charges.",
      },
    ],
  },
  {
    category: "Services",
    questions: [
      {
        q: "What is the Signature Treatment?",
        a: "The Signature Treatment includes your haircut plus hot towel treatment, premium wash, and scalp/neck massage. Available with Signature membership tiers.",
      },
      {
        q: "Can I bring my child?",
        a: "Yes! Many of our locations are kid-friendly. Check location details for specific amenities.",
      },
      {
        q: "Do you offer walk-ins?",
        a: "Yes, walk-ins are welcome. Check-in through the app or at the location for the fastest service.",
      },
    ],
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-champagne/20 rounded-full mb-6">
            <HelpCircle className="w-10 h-10 text-gold-champagne" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4">
            Support
          </h1>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Find answers to common questions or contact us for help
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((category, categoryIndex) => (
            <motion.section
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
            >
              <h2 className="font-display text-3xl font-bold text-bone mb-6">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (index * 0.05) }}
                    className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20"
                  >
                    <h3 className="font-display text-xl font-bold text-bone mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-bone/70">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16 bg-slate/50 backdrop-blur-sm rounded-xl p-8 border border-gold-champagne/20 text-center">
          <h2 className="font-display text-2xl font-bold text-bone mb-4">
            Still Need Help?
          </h2>
          <p className="text-bone/70 mb-6">
            Contact our support team and we'll get back to you within 24 hours.
          </p>
          <button className="px-8 py-4 bg-red-crimson hover:bg-red-crimson/90 text-bone font-semibold rounded-lg transition-colors duration-150">
            Contact Support
          </button>
        </div>
      </div>
    </main>
  );
}


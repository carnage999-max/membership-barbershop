"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const positions = [
  {
    title: "Master Barber",
    location: "Multiple Locations",
    type: "Full-time",
    description: "Lead our team with precision cuts and exceptional service. 5+ years experience required.",
  },
  {
    title: "Barber",
    location: "Downtown Garage",
    type: "Full-time",
    description: "Join our team of skilled barbers. Competitive pay, benefits, and growth opportunities.",
  },
  {
    title: "Apprentice Barber",
    location: "All Locations",
    type: "Part-time / Full-time",
    description: "Learn from the best. We're looking for passionate individuals ready to grow their craft.",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-champagne/20 rounded-full mb-6">
            <Briefcase className="w-10 h-10 text-gold-champagne" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-bone mb-4">
            Careers
          </h1>
          <p className="text-bone/70 text-lg max-w-2xl mx-auto">
            Join our team of skilled barbers and help us deliver premium grooming experiences
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {positions.map((position, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-slate/50 backdrop-blur-sm rounded-xl p-6 border border-gold-champagne/20 hover:border-gold-champagne/40 transition-all duration-150"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-bone mb-2">
                    {position.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-bone/60">
                    <span>{position.location}</span>
                    <span>•</span>
                    <span>{position.type}</span>
                  </div>
                </div>
                <button className="px-6 py-2 bg-red-crimson hover:bg-red-crimson/90 text-bone font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap">
                  Apply Now
                </button>
              </div>
              <p className="text-bone/70">{position.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16 bg-slate/50 backdrop-blur-sm rounded-xl p-8 border border-gold-champagne/20 text-center">
          <h2 className="font-display text-2xl font-bold text-bone mb-4">
            Don't See a Position?
          </h2>
          <p className="text-bone/70 mb-6">
            We're always looking for talented barbers. Send us your resume and we'll keep you in mind for future openings.
          </p>
          <button className="px-8 py-4 bg-slate hover:bg-slate/80 text-bone font-semibold rounded-lg transition-colors duration-150 border border-gold-champagne/30">
            Submit Resume
          </button>
        </div>
      </div>
    </main>
  );
}


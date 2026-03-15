"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { auth, tokenStorage, session } from "@/lib/api-client";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await auth.login(email, password);

      // Save token and user data
      tokenStorage.set(result.token);
      session.setCurrentUser(result.user);

      // Redirect to account page
      toast.success("Welcome back!");
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast.error(err.message || "Failed to login");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-bone mb-4">
                Welcome Back
              </h1>
              <p className="text-bone/70">
                Login to your Membership Barbershop account
              </p>
            </div>

            <div className="bg-slate/50 backdrop-blur-sm rounded-xl p-8 border border-gold-champagne/20">
              {error && (
                <div className="mb-6 p-4 bg-danger/20 border border-danger/30 rounded-lg">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-bone mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-obsidian border border-gold-champagne/20 rounded-lg text-bone placeholder:text-bone/40 focus:outline-none focus:border-gold-champagne transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-bone mb-2 font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-obsidian border border-gold-champagne/20 rounded-lg text-bone placeholder:text-bone/40 focus:outline-none focus:border-gold-champagne transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-red-crimson hover:bg-red-crimson/90 disabled:bg-slate/50 text-bone font-semibold rounded-lg transition-colors duration-150"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-bone/60 text-sm">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-gold-champagne hover:text-gold-champagne/80 transition-colors font-medium"
                  >
                    Create one
                  </Link>
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

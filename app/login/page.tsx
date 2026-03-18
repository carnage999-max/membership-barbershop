"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { auth, tokenStorage, session } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useUser } from "@/lib/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/account");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-red/20 border-t-neon-red rounded-full animate-spin mb-6 shadow-neon-red" />
        <p className="text-chrome/50 font-black italic uppercase tracking-[0.3em] text-xs animate-pulse">Syncing Data...</p>
      </div>
    );
  }

  // Prevent flash before redirect
  if (user) return null;

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
      toast.success("Engine Started. Welcome back!");
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Diagnostics failed");
      toast.error(err.message || "Failed to login");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32 relative overflow-hidden flex items-center">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neon-red/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter">
                User <span className="text-neon-red">Portal</span>
              </h1>
              <p className="text-chrome/60 font-black uppercase tracking-widest text-xs italic">
                Authentication Required for Pit Lane Access
              </p>
            </div>

            <div className="bg-steel-dark/80 backdrop-blur-2xl rounded-2xl p-10 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon-red/5 rounded-full blur-3xl -mr-16 -mb-16" />
              
              {error && (
                <div className="mb-8 p-4 bg-neon-red/10 border border-neon-red/30 rounded-xl">
                  <p className="text-neon-red text-xs font-black uppercase italic tracking-widest">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div>
                  <label htmlFor="email" className="block text-white text-[10px] uppercase font-black tracking-widest mb-2 italic">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-obsidian border border-white/10 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-neon-red transition-all font-bold italic text-sm"
                    placeholder="E.G. LEWIS@MCB.COM"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-white text-[10px] uppercase font-black tracking-widest mb-2 italic">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-5 py-4 bg-obsidian border border-white/10 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-neon-red transition-all font-bold italic text-sm pr-14"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-neon-red transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full px-8 py-5 bg-neon-red hover:bg-racing-red disabled:opacity-50 text-white font-display text-xl font-black rounded-xl transition-all shadow-neon-red overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700" />
                  <span className="relative z-10 italic uppercase tracking-widest">
                    {loading ? "INITIALIZING..." : "LOGIN"}
                  </span>
                </button>
              </form>

              <div className="mt-10 text-center relative z-10">
                <p className="text-chrome/30 text-[10px] uppercase font-black tracking-widest italic">
                  Not registered yet?{" "}
                  <Link
                    href="/register"
                    className="text-white hover:text-neon-red transition-colors ml-1"
                  >
                    Join the Shop
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

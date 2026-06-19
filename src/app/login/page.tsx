"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Briefcase, Building2, User, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role, phone, isSignUp })
      });

      const data = await res.json();
      if (data.success) {
        if (role === "seeker") {
          router.push("/seeker");
        } else {
          router.push("/recruiter");
        }
        router.refresh();
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex flex-col justify-center items-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Brand logo */}
      <div className="flex items-center gap-2 mb-8 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          AuraHire
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md glass p-8 rounded-3xl relative z-10 border border-white/5 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-slate-400">Access your personalized professional workspace</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="bg-white/5 p-1.5 rounded-2xl flex gap-1 mb-8 border border-white/5">
          <button
            type="button"
            onClick={() => setRole("seeker")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200
              ${role === "seeker" 
                ? "bg-white text-black shadow-lg" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
          >
            <Briefcase className="w-4 h-4" />
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200
              ${role === "recruiter" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
          >
            <Building2 className="w-4 h-4" />
            Recruiter
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  required={isSignUp}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-white placeholder-slate-500"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-white placeholder-slate-500"
                placeholder="e.g. john@example.com"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contact Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">📞</span>
                <input
                  required={isSignUp}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-white placeholder-slate-500"
                  placeholder="e.g. +1 234 567 8900"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mb-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Login"} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="w-full py-4 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all flex items-center justify-center"
            >
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-300 transition-colors">← Back to home</Link>
      </div>
    </div>
  );
}

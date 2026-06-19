"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminSecret, setAdminSecret] = useState("");
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
        body: JSON.stringify({ role: "admin", adminSecret })
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
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
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex flex-col justify-center items-center p-6 relative overflow-hidden selection:bg-red-500/30">
      {/* Background Glows for Admin */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

      {/* Brand logo */}
      <div className="flex items-center gap-2 mb-8 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          AuraHire Security
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md glass p-8 rounded-3xl relative z-10 border border-red-500/20 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Restricted Access</h1>
          <p className="text-sm text-slate-400">Enter master security key to proceed</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Master Security Key</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                required
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all text-white placeholder-slate-500"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-xl shadow-red-500/10 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Unlock Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-xs text-slate-500 flex gap-4">
        <Link href="/login" className="hover:text-slate-300 transition-colors">← User Login</Link>
        <span>|</span>
        <Link href="/" className="hover:text-slate-300 transition-colors">Home Page</Link>
      </div>
    </div>
  );
}

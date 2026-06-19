"use client";

import Link from "next/link";
import { Building2, Save, ArrowLeft, Loader2, CheckCircle2, LogOut, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("HR Recruiter");
  const [userEmail, setUserEmail] = useState("");
  
  // Dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    employmentType: "Full-time",
    salaryRange: "",
    domain: "",
    description: ""
  });

  useEffect(() => {
    const matchName = document.cookie.match(new RegExp('(^| )userName=([^;]*)'));
    if (matchName) setUserName(decodeURIComponent(matchName[2]));

    const matchEmail = document.cookie.match(new RegExp('(^| )userEmail=([^;]*)'));
    if (matchEmail) setUserEmail(decodeURIComponent(matchEmail[2]));

    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleSwitchRole = async () => {
    try {
      const res = await fetch("/api/auth/switch-role", { method: "POST" });
      if (res.ok) {
        router.push("/seeker");
        router.refresh();
      }
    } catch (err) {
      console.error("Error switching role:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ title: "", location: "", employmentType: "Full-time", salaryRange: "", domain: "", description: "" });
      } else {
        alert(data.error || "Failed to post job");
      }
    } catch (err) {
      alert("Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="bg-white/5 border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                AuraHire <span className="font-normal text-indigo-400">Recruit</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/recruiter" className="text-slate-400 hover:text-white px-1 py-5 text-sm font-medium transition-colors">
                ATS Dashboard
              </Link>
              <Link href="/recruiter/post-job" className="text-indigo-400 border-b-2 border-indigo-500 px-1 py-5 text-sm font-medium transition-colors">
                Post a Job
              </Link>
            </div>
            
            <div className="flex items-center gap-4 relative">
              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform border-2 border-white/10"
                >
                  {userName ? userName.charAt(0).toUpperCase() : "R"}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                      <p className="text-sm font-bold text-white truncate">{userName}</p>
                      <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={handleSwitchRole}
                        className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-400" /> Switch to Seeker Mode
                      </button>
                    </div>

                    <div className="p-2 border-t border-white/5 bg-black/20">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-slate-400" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Link href="/recruiter" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl font-extrabold mb-6 tracking-tight text-white drop-shadow-md">Create New Job Posting</h1>
          
          {success && (
            <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">Success!</p>
                <p className="text-xs opacity-80">Job posted successfully to the database. AI matching is now active.</p>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Job Title</label>
              <input 
                required 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-white placeholder-slate-500" 
                placeholder="e.g. Senior Frontend Engineer" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">City, State & Company Location</label>
                <input 
                  required
                  type="text" 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  className="w-full bg-indigo-500/5 border border-indigo-500/30 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500 shadow-inner" 
                  placeholder="e.g. Ahmedabad, Gujarat (Inno HQ)" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Employment Type</label>
                <select 
                  value={formData.employmentType} 
                  onChange={e => setFormData({...formData, employmentType: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-white [&>option]:bg-slate-900"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Salary Range</label>
                <input 
                  type="text" 
                  value={formData.salaryRange} 
                  onChange={e => setFormData({...formData, salaryRange: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-white placeholder-slate-500" 
                  placeholder="e.g. $120k - $150k" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Domain / Industry</label>
                <input 
                  type="text" 
                  value={formData.domain} 
                  onChange={e => setFormData({...formData, domain: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-white placeholder-slate-500" 
                  placeholder="e.g. Healthcare, Finance" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Job Description</span>
                <span className="text-indigo-400 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Ranked</span>
              </label>
              <textarea 
                required 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows={8} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all text-white placeholder-slate-500 custom-scrollbar" 
                placeholder="Describe the role, responsibilities, and required skills..."
              ></textarea>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Our AI will parse this description to automatically score and rank incoming resumes.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
              <Link href="/recruiter" className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-bold rounded-2xl transition-all flex items-center">
                Cancel
              </Link>
              <button disabled={loading} type="submit" className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Publish Job
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

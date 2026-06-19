"use client";

import { Briefcase, Building2, MapPin, Search, Sparkles, LogOut, Trash2, Repeat, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface JobBrowseClientProps {
  allJobs: any[];
  userName: string;
  userEmail: string;
}

export default function JobBrowseClient({ allJobs, userName, userEmail }: JobBrowseClientProps) {
  const router = useRouter();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
  // Extract unique locations and titles from jobs for autocomplete
  const uniqueTitles = Array.from(new Set(allJobs.map(j => j.title))).filter(Boolean);
  const uniqueLocations = Array.from(new Set(allJobs.map(j => j.location))).filter(Boolean);
  
  const titleSuggestions = uniqueTitles.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()) && t.toLowerCase() !== searchQuery.toLowerCase()).slice(0, 5);
  const locationSuggestions = uniqueLocations.filter(l => l.toLowerCase().includes(locationQuery.toLowerCase()) && l.toLowerCase() !== locationQuery.toLowerCase()).slice(0, 5);
  
  // Dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
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
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
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
        router.push("/recruiter");
        router.refresh();
      }
    } catch (err) {
      console.error("Error switching role:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const res = await fetch("/api/auth/me", { method: "DELETE" });
        if (res.ok) {
          router.push("/login");
          router.refresh();
        }
      } catch (err) {
        console.error("Error deleting account:", err);
      }
    }
  };

  // Real-time filtering
  const filteredJobs = allJobs.filter((job) => {
    const titleMatch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       job.company?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = locationQuery === "" || (job.location && job.location.toLowerCase().includes(locationQuery.toLowerCase()));
    
    return titleMatch && locationMatch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                AuraHire
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/seeker" className="text-slate-400 hover:text-white px-1 py-5 text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/seeker/jobs" className="text-white border-b-2 border-indigo-500 px-1 py-5 text-sm font-medium">
                Find Jobs
              </Link>
            </div>
            <div className="flex items-center gap-4 relative">
              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform border-2 border-white/10"
                >
                  {userName ? userName.charAt(0).toUpperCase() : "S"}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                      <p className="text-sm font-bold text-white truncate">{userName || "Job Seeker"}</p>
                      <p className="text-xs text-slate-400 truncate">{userEmail || "No email"}</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={handleSwitchRole}
                        className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Repeat className="w-4 h-4 text-indigo-400" /> Switch to Recruiter Mode
                      </button>
                      <button 
                        onClick={handleDeleteAccount}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Account
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">Browse All Jobs</h1>
          
          {/* Search & Filter Bar */}
          <div className="glass p-4 rounded-2xl flex flex-wrap gap-4 items-center border border-white/5 relative z-20">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search job titles or keywords..." 
                value={searchQuery}
                onFocus={() => setShowTitleSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
              {showTitleSuggestions && titleSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  {titleSuggestions.map(title => (
                    <button 
                      key={title}
                      onClick={() => {
                        setSearchQuery(title);
                        setShowTitleSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <Search className="w-3.5 h-3.5 inline mr-2 text-slate-500" /> {title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative w-full md:w-64">
              <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="City, state, or remote" 
                value={locationQuery}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  {locationSuggestions.map(loc => (
                    <button 
                      key={loc}
                      onClick={() => {
                        setLocationQuery(loc);
                        setShowLocationSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <MapPin className="w-3.5 h-3.5 inline mr-2 text-slate-500" /> {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors pointer-events-none">
              Find Jobs
            </button>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-slate-400">No jobs match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="glass p-6 rounded-3xl hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col border border-white/5">
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-400 border border-white/5">
                    {job.company?.logoUrl || job.company?.name.charAt(0) || "C"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company?.name}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.location && <span className="px-2 py-1 bg-white/5 rounded text-xs text-slate-300 flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>}
                  {job.employmentType && <span className="px-2 py-1 bg-white/5 rounded text-xs text-slate-300 flex items-center gap-1"><Briefcase className="w-3 h-3"/> {job.employmentType}</span>}
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-medium text-slate-300 text-sm">{job.salaryRange || 'Competitive'}</span>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

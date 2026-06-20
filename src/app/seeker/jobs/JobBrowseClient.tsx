"use client";

import { Briefcase, Building2, MapPin, Search, Sparkles, LogOut, Trash2, Repeat, X, Loader2, CheckCircle2, FileText, ChevronRight } from "lucide-react";
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
  
  // Extracted data state from user profile
  const [jobs, setJobs] = useState<any[]>(allJobs);
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [structuredResume, setStructuredResume] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [submittingJobs, setSubmittingJobs] = useState<Record<string, boolean>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // Selection state for View Details Modal
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

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

  // Fetch current user details on mount to populate resume and applications state
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.user) {
          const dbUser = data.user;
          setResumeText(dbUser.resumeText || "");
          setResumeName(dbUser.resumeName || "");
          setStructuredResume(dbUser.structuredResume || "");
          
          if (dbUser.applications) {
            const appliedMap: Record<string, boolean> = {};
            dbUser.applications.forEach((app: any) => {
              appliedMap[app.jobId] = true;
            });
            setAppliedJobs(appliedMap);
          }

          // If they have a saved resume, run auto-matching on mount to get match scores!
          if (dbUser.resumeText && allJobs.length > 0) {
            setIsAnalyzing(true);
            try {
              const matchRes = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  resumeText: dbUser.resumeText,
                  resumeName: dbUser.resumeName || 'resume.pdf',
                  jobs: allJobs.map(j => ({ id: j.id, title: j.title, description: j.description }))
                })
              });
              const matchData = await matchRes.json();
              if (matchData.success && matchData.analysis) {
                const analysis = matchData.analysis;
                const scoredJobs = allJobs.map(job => {
                  const scoreData = analysis.scores?.find((s: any) => s.jobId === job.id);
                  if (scoreData) {
                    return {
                      ...job,
                      matchScore: scoreData.matchScore,
                      matchReason: scoreData.matchReason
                    };
                  }
                  return { ...job, matchScore: 0, matchReason: "Awaiting resume match score." };
                });
                
                // Sort by highest match score
                scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
                setJobs(scoredJobs);
              }
            } catch (err) {
              console.error("Error auto-matching jobs in JobBrowseClient:", err);
            } finally {
              setIsAnalyzing(false);
            }
          }
        }
      } catch (err) {
        console.error("Error loading user data in JobBrowseClient:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    loadData();
  }, [allJobs]);

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

  // Easy Apply function
  const handleApply = async (jobId: string, matchScore: number, matchReason: string) => {
    if (!resumeText) {
      alert("Please upload your resume first on the Dashboard so we can submit it to the employer.");
      router.push("/seeker");
      return;
    }

    if (submittingJobs[jobId]) return;
    setSubmittingJobs(prev => ({ ...prev, [jobId]: true }));

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          resumeText,
          resumeName,
          aiMatchScore: matchScore || null,
          aiMatchReason: matchReason || null
        })
      });

      const data = await res.json();
      if (data.success) {
        setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
        alert(data.updatedExisting ? "Application updated successfully with your active resume!" : "Application submitted successfully!");
      } else {
        alert(data.error || "Failed to apply");
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Error submitting application");
    } finally {
      setSubmittingJobs(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // Real-time filtering
  const filteredJobs = jobs.filter((job) => {
    const titleMatch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       job.company?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = locationQuery === "" || (job.location && job.location.toLowerCase().includes(locationQuery.toLowerCase()));
    
    return titleMatch && locationMatch;
  });

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading job listings...</p>
      </div>
    );
  }

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
                onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 250)}
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
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 250)}
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
              <div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className="glass p-6 rounded-3xl hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col border border-white/5 relative overflow-hidden"
              >
                {/* Matching Score Circle */}
                {job.matchScore > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className={`flex flex-col items-center justify-center w-11 h-11 rounded-full border-2 shadow-lg ${
                      job.matchScore >= 80 ? 'border-green-500/20 text-green-400 bg-green-500/10' :
                      job.matchScore >= 50 ? 'border-indigo-500/20 text-indigo-400 bg-indigo-500/10' :
                      'border-yellow-500/20 text-yellow-400 bg-yellow-500/10'
                    }`}>
                      <span className="text-xs font-bold">{job.matchScore}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mb-4 pr-10">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-400 border border-white/5 shrink-0">
                    {job.company?.logoUrl || job.company?.name.charAt(0) || "C"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{job.title}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company?.name}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.location && <span className="px-2 py-1 bg-white/5 rounded text-xs text-slate-300 flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>}
                  {job.employmentType && <span className="px-2 py-1 bg-white/5 rounded text-xs text-slate-300 flex items-center gap-1"><Briefcase className="w-3 h-3"/> {job.employmentType}</span>}
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-300 text-sm">{job.salaryRange || 'Competitive'}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors"
                    >
                      View Details
                    </button>
                    
                    {appliedJobs[job.id] ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(job.id, job.matchScore, job.matchReason);
                        }}
                        disabled={submittingJobs[job.id]}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                        title="Re-apply with your updated resume"
                      >
                        {submittingJobs[job.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />} Re-apply
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(job.id, job.matchScore, job.matchReason);
                        }}
                        disabled={submittingJobs[job.id]}
                        className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {submittingJobs[job.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Easy Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedJob(null)}
        >
          <div 
            className="bg-[#0f0f11] border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header banner */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[75vh]">
              <div className="flex gap-4 items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-2xl font-black text-slate-300 border border-white/10 shadow-inner">
                  {selectedJob.company?.logoUrl || selectedJob.company?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white leading-tight">{selectedJob.title}</h2>
                  <p className="text-indigo-400 font-semibold text-sm flex items-center gap-1 mt-1.5">
                    <Building2 className="w-4 h-4 text-indigo-400" /> {selectedJob.company?.name}
                  </p>
                </div>
              </div>

              {/* Meta information tags */}
              <div className="flex flex-wrap gap-2.5 mb-6 border-b border-white/10 pb-6">
                {selectedJob.location && (
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedJob.location}
                  </span>
                )}
                {selectedJob.employmentType && (
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {selectedJob.employmentType}
                  </span>
                )}
                {selectedJob.salaryRange && (
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {selectedJob.salaryRange}
                  </span>
                )}
                {selectedJob.domain && (
                  <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> {selectedJob.domain}
                  </span>
                )}
              </div>

              {/* Semantic AI Match score banner inside modal */}
              {selectedJob.matchScore > 0 && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/25 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full border-4 flex flex-col items-center justify-center font-bold text-sm shrink-0 shadow-lg ${
                    selectedJob.matchScore >= 80 ? 'border-green-500/20 text-green-400 bg-green-500/5' :
                    selectedJob.matchScore >= 50 ? 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5' :
                    'border-yellow-500/20 text-yellow-400 bg-yellow-500/5'
                  }`}>
                    {selectedJob.matchScore}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Semantic AI Match Evaluation</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedJob.matchReason}</p>
                  </div>
                </div>
              )}

              {/* Job Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-widest">Job Description</h3>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white/[0.02] p-5 rounded-2xl border border-white/5 max-h-[300px] overflow-y-auto">
                  {selectedJob.description}
                </div>
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="p-6 bg-black/45 border-t border-white/10 flex items-center justify-between gap-4">
              <button 
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2.5 bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-sm rounded-xl transition-all"
              >
                Close
              </button>
              
              {appliedJobs[selectedJob.id] ? (
                <button 
                  onClick={() => handleApply(selectedJob.id, selectedJob.matchScore, selectedJob.matchReason)}
                  disabled={submittingJobs[selectedJob.id]}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {submittingJobs[selectedJob.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />} Re-apply With Active Resume
                </button>
              ) : (
                <button 
                  onClick={() => handleApply(selectedJob.id, selectedJob.matchScore, selectedJob.matchReason)}
                  disabled={submittingJobs[selectedJob.id]}
                  className="px-6 py-2.5 bg-white text-black font-extrabold text-sm rounded-xl hover:bg-slate-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingJobs[selectedJob.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Easy Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Building2, ChevronDown, FileText, Search, Sparkles, LogOut, X, Mail, Download, User, Trash2, Repeat } from "lucide-react";
import Link from "next/link";
import ResumeRenderer from "@/components/ResumeRenderer";

interface RecruiterDashboardClientProps {
  initialApplications: any[];
  initialJobs: any[];
  currentUser: any;
}

export default function RecruiterDashboardClient({ initialApplications, initialJobs, currentUser }: RecruiterDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"applicants" | "jobs">("applicants");
  const [applications, setApplications] = useState<any[]>(initialApplications);
  const [jobs, setJobs] = useState<any[]>(initialJobs || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState("all");
  const [sortBy, setSortBy] = useState("highest-score");
  const [viewingApplication, setViewingApplication] = useState<any | null>(null);
  
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

  const handleDownloadResume = (app: any) => {
    if (!app || !app.resumeText) return;
    const element = document.createElement("a");
    const file = new Blob([app.resumeText], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${app.seeker.name.replace(/\\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFormattedResume = (text: string, structured: string | null) => {
    if (!structured) return text;
    try {
      const parsed = JSON.parse(structured);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return structured;
    }
  };

  const uniqueJobs = Array.from(new Set(jobs.map(job => job.title)));

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

  const filteredApplications = applications
    .filter(app => {
      const candidateName = app.seeker.name.toLowerCase();
      const jobTitle = app.job.title.toLowerCase();
      const email = app.seeker.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      const matchesSearch = candidateName.includes(query) || jobTitle.includes(query) || email.includes(query);
      const matchesJob = selectedJob === "all" || app.job.title === selectedJob;

      return matchesSearch && matchesJob;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "highest-score") {
        return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
      }
      return 0;
    });

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
              <Link href="/recruiter" className="text-indigo-400 border-b-2 border-indigo-500 px-1 py-5 text-sm font-medium transition-colors">
                ATS Dashboard
              </Link>
              <Link href="/recruiter/post-job" className="text-slate-400 hover:text-white px-1 py-5 text-sm font-medium transition-colors">
                Post a Job
              </Link>
            </div>

            <div className="flex items-center gap-4 relative">
              <Link href="/recruiter/post-job" className="hidden sm:flex px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
                Post a Job
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform border-2 border-white/10"
                >
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "R"}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                      <p className="text-sm font-bold text-white truncate">{currentUser?.name || "Recruiter"}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser?.email || "No email"}</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={handleSwitchRole}
                        className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Repeat className="w-4 h-4 text-indigo-400" /> Switch to Seeker Mode
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-indigo-400 mb-2 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Applicant Tracking System</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Candidate Dashboard</h1>
          </div>
          
          <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-sm text-slate-400 font-medium">Total Applicants</span>
              <span className="text-2xl font-black text-white">{applications.length}</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-sm text-indigo-300 font-medium flex items-center gap-1">High Matches</span>
              <span className="text-2xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                {applications.filter(a => (a.aiMatchScore || 0) >= 80).length}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-white/10 mb-8 bg-white/5 p-1.5 rounded-2xl max-w-md backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("applicants")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300
              ${activeTab === "applicants" 
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"}`}
          >
            <Sparkles className="w-4 h-4" />
            Applicants ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300
              ${activeTab === "jobs" 
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"}`}
          >
            <Briefcase className="w-4 h-4" />
            Posted Jobs ({jobs.length})
          </button>
        </div>

        {activeTab === "applicants" ? (
          <>
            {/* Filters Bar */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center flex-wrap gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search candidates..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 w-64 text-white placeholder-slate-500 transition-all"
                  />
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <span>Role:</span>
                  <select 
                    value={selectedJob} 
                    onChange={e => setSelectedJob(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 [&>option]:bg-slate-900"
                  >
                    <option value="all">All Posted Roles</option>
                    {uniqueJobs.map(job => (
                      <option key={job} value={job}>{job}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <span>Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 [&>option]:bg-slate-900"
                >
                  <option value="newest">Date Applied (Newest)</option>
                  <option value="highest-score">AI Match Score (Highest)</option>
                </select>
              </div>
            </div>

            {/* Candidate List */}
            <div className="bg-white/5 rounded-2xl border border-white/10 shadow-xl overflow-hidden backdrop-blur-md">
              <div className="hidden lg:grid grid-cols-12 gap-4 p-5 border-b border-white/10 bg-black/20 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-3">Candidate & Resume</div>
                <div className="col-span-2">Applied For</div>
                <div className="col-span-1 text-center">Score</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-3">AI Recruiter Summary</div>
                <div className="col-span-1 text-right">Action</div>
              </div>
              
              {filteredApplications.length === 0 ? (
                <div className="p-16 text-center text-slate-500 font-medium">
                  No matching applications found.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredApplications.map((app) => (
                    <div key={app.id} className="p-5 hover:bg-white/5 transition-colors group">
                      
                      {/* Desktop Layout */}
                      <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-black text-lg shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                            {app.seeker.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{app.seeker.name}</h3>
                            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" /> {app.seeker.email}
                            </p>
                            {app.resumeName && (
                              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                                <FileText className="w-3 h-3 text-slate-600" />
                                <span className="truncate max-w-[150px]">{app.resumeName}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <p className="text-sm text-slate-300 font-semibold truncate">{app.job.title}</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wide">{new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="col-span-1 flex justify-center">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 shadow-lg ${
                            (app.aiMatchScore || 0) >= 80 ? 'border-green-500/30 bg-green-500/10 text-green-400 font-black shadow-green-500/10' :
                            (app.aiMatchScore || 0) >= 50 ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-black shadow-indigo-500/10' :
                            'border-orange-500/30 bg-orange-500/10 text-orange-400 font-black'
                          }`}>
                            <span className="text-base drop-shadow-md">{app.aiMatchScore || '-'}</span>
                          </div>
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          {(app.aiMatchScore || 0) > 65 ? (
                            <span className="px-3 py-1.5 text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg shadow-lg uppercase tracking-widest flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" /> Shortlisted
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 text-[10px] font-bold bg-white/5 border border-white/10 text-slate-400 rounded-lg uppercase tracking-widest flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Under Review
                            </span>
                          )}
                        </div>

                        <div className="col-span-3">
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400 inline mr-1.5 shrink-0" />
                            {app.aiMatchReason || "Awaiting calculation."}
                          </p>
                        </div>

                        <div className="col-span-1 flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setViewingApplication(app)}
                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all border border-transparent hover:border-indigo-500/20" 
                            title="View Parsed Resume"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadResume(app)}
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-500/20" 
                            title="Download Parsed Resume"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile/Tablet Card Layout */}
                      <div className="lg:hidden space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-sm shrink-0">
                              {app.seeker.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-white">{app.seeker.name}</h3>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {app.seeker.email}</p>
                            </div>
                          </div>
                          <div className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 shadow-sm shrink-0 ${
                            (app.aiMatchScore || 0) >= 80 ? 'border-green-500/30 bg-green-500/10 text-green-400 font-bold' :
                            (app.aiMatchScore || 0) >= 50 ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-bold' :
                            'border-orange-500/30 bg-orange-500/10 text-orange-400 font-bold'
                          }`}>
                            <span className="text-sm">{app.aiMatchScore || '-'}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-bold text-slate-300 bg-white/10 border border-white/5 px-2.5 py-1 rounded-lg">{app.job.title}</span>
                          {(app.aiMatchScore || 0) > 65 ? (
                            <span className="px-2 py-1 text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Shortlisted
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-[10px] font-bold bg-white/5 border border-white/10 text-slate-400 rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Under Review
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-medium">{new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 inline mr-1.5" />
                          {app.aiMatchReason || "Awaiting calculation."}
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                          <button 
                            onClick={() => setViewingApplication(app)}
                            className="flex-1 py-2.5 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Resume
                          </button>
                          <button 
                            onClick={() => handleDownloadResume(app)}
                            className="flex-1 py-2.5 text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {jobs.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center backdrop-blur-xl">
                <Briefcase className="w-16 h-16 text-slate-600 mb-6" />
                <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">No Jobs Posted Yet</h3>
                <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">Create a job posting to start matching with candidate resumes using our AI recruiter engine.</p>
                <Link href="/recruiter/post-job" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
                  Create Your First Job
                </Link>
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl border border-white/10 shadow-xl overflow-hidden backdrop-blur-md">
                <div className="p-5 border-b border-white/10 bg-black/20 flex justify-between items-center">
                  <h2 className="text-sm font-black text-white uppercase tracking-wider">Your Posted Jobs ({jobs.length})</h2>
                  <Link href="/recruiter/post-job" className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 hover:scale-105">
                    <span className="text-lg leading-none">+</span> Add New Job
                  </Link>
                </div>

                <div className="divide-y divide-white/5">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-bold text-white">{job.title}</h3>
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                              {job.employmentType || "Full-time"}
                            </span>
                            {job.domain && (
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" /> {job.domain}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
                            {job.location && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-500">📍</span> {job.location}
                              </div>
                            )}
                            {job.salaryRange && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-500">💰</span> {job.salaryRange}
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">📅</span> Posted on {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <p className="text-sm text-slate-400 line-clamp-3 mt-4 leading-relaxed pr-8">
                            {job.description}
                          </p>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-5 flex items-center gap-4 shrink-0 min-w-[160px] justify-center text-center shadow-inner">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Applicants</span>
                            <span className="text-3xl font-black text-white drop-shadow-md">{job.applications?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Resume Viewer Modal */}
      {viewingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#111] rounded-3xl w-full max-w-4xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[85vh] border border-white/10">
            
            {/* Modal Header */}
            <div className="bg-black/50 text-white px-8 py-5 flex items-center justify-between shrink-0 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-black text-lg shadow-lg">
                  {viewingApplication.seeker.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{viewingApplication.seeker.name}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                    <span>{viewingApplication.seeker.email}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span>Applied for {viewingApplication.job.title}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleDownloadResume(viewingApplication)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold hover:text-white"
                  title="Download Resume"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button 
                  onClick={() => setViewingApplication(null)}
                  className="p-2.5 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Metadata / Match Stats */}
            <div className="bg-white/5 border-b border-white/5 px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
              <div className="flex-1">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">AI Match Evaluation</span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <Sparkles className="w-4 h-4 text-indigo-500 inline mr-2 shrink-0" />
                  {viewingApplication.aiMatchReason || "Awaiting score."}
                </p>
              </div>
              
              <div className="flex items-center gap-4 shrink-0 bg-black/20 p-3 pr-5 rounded-2xl border border-white/5">
                <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center shadow-lg bg-black/40
                  ${(viewingApplication.aiMatchScore || 0) >= 80 ? 'border-green-500/50 text-green-400 shadow-green-500/20' :
                    (viewingApplication.aiMatchScore || 0) >= 50 ? 'border-indigo-500/50 text-indigo-400 shadow-indigo-500/20' :
                    'border-orange-500/50 text-orange-400 shadow-orange-500/20'
                  }`}
                >
                  <span className="text-xl font-black drop-shadow-md">{viewingApplication.aiMatchScore || '-'}</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">AI Match Score</span>
                  <span className="text-[10px] text-slate-500 font-medium">Based on semantic match</span>
                </div>
              </div>
            </div>

            {/* Resume Content Container */}
            <div className="flex-1 p-8 overflow-hidden flex flex-col min-h-0 bg-[#0a0a0a]">
              <ResumeRenderer 
                resumeText={viewingApplication.resumeText} 
                structuredResumeStr={viewingApplication.structuredResume}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

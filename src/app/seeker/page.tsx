"use client";

import { Briefcase, Building2, ChevronRight, FileText, MapPin, Sparkles, Loader2, CheckCircle2, LogOut, Award, AlertTriangle, Lightbulb, Trash2, Repeat, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ResumeRenderer from "@/components/ResumeRenderer";

export default function JobSeekerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"jobs" | "ats-check">("jobs");
  const [jobs, setJobs] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [structuredResume, setStructuredResume] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [submittingJobs, setSubmittingJobs] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // ATS Feedback state
  const [atsScore, setAtsScore] = useState<number>(0);
  const [formattingErrors, setFormattingErrors] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 1. Fetch User and Jobs on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch jobs first
        const jobsRes = await fetch('/api/jobs');
        const jobsData = await jobsRes.json();
        let fetchedJobs: any[] = [];
        if (jobsData.success) {
          fetchedJobs = jobsData.jobs.map((j: any) => ({
            ...j,
            matchScore: 0,
            matchReason: "Awaiting AI resume analysis."
          }));
          setJobs(fetchedJobs);
        }

        // Fetch user profile
        const userRes = await fetch('/api/auth/me');
        const userData = await userRes.json();
        if (userData.success && userData.user) {
          const dbUser = userData.user;
          setUser(dbUser);
          setResumeName(dbUser.resumeName || "");
          setResumeText(dbUser.resumeText || "");
          setStructuredResume(dbUser.structuredResume || "");
          
          if (dbUser.skills) {
            setSkills(dbUser.skills.split(', '));
          } else {
            setSkills(['React', 'Next.js', 'TypeScript']);
          }

          if (dbUser.applications) {
            const appliedMap: Record<string, boolean> = {};
            dbUser.applications.forEach((app: any) => {
              appliedMap[app.jobId] = true;
            });
            setAppliedJobs(appliedMap);
          }

          if (dbUser.atsFeedback) {
            try {
              const parsedFeedback = JSON.parse(dbUser.atsFeedback);
              setAtsScore(parsedFeedback.score || 0);
              setFormattingErrors(parsedFeedback.formattingErrors || []);
              setSuggestions(parsedFeedback.suggestions || []);
            } catch (e) {
              console.error("Failed to parse saved ATS feedback JSON", e);
            }
          }

          // If user already has a resume saved, run auto-matching on mount!
          if (dbUser.resumeText && fetchedJobs.length > 0) {
            setIsAnalyzing(true);
            const matchRes = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                resumeText: dbUser.resumeText,
                resumeName: dbUser.resumeName || 'resume.pdf',
                jobs: fetchedJobs.map(j => ({ id: j.id, title: j.title, description: j.description }))
              })
            });
            const matchData = await matchRes.json();
            if (matchData.success && matchData.analysis) {
              const analysis = matchData.analysis;
              
              // Update state
              if (analysis.skills && analysis.skills.length > 0) {
                setSkills(analysis.skills);
              }
              if (analysis.atsFeedback) {
                setAtsScore(analysis.atsFeedback.score || 0);
                setFormattingErrors(analysis.atsFeedback.formattingErrors || []);
                setSuggestions(analysis.atsFeedback.suggestions || []);
              }
              if (analysis.structuredResume) {
                setStructuredResume(JSON.stringify(analysis.structuredResume, null, 2));
              }

              // Update jobs list with scores
              const scoredJobs = fetchedJobs.map(job => {
                const scoreData = analysis.scores.find((s: any) => s.jobId === job.id);
                if (scoreData) {
                  return {
                    ...job,
                    matchScore: scoreData.matchScore,
                    matchReason: scoreData.matchReason
                  };
                }
                return job;
              });
              
              // Sort by highest match score
              scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
              setJobs(scoredJobs);
            }
            setIsAnalyzing(false);
          }
        }
      } catch (err) {
        console.error("Error loading seeker data:", err);
      } finally {
        setLoadingUser(false);
      }
    }

    loadData();
  }, []);

  // 2. Handle File Upload (New resume)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setResumeName(file.name);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      // Pass the real job details to score against
      formData.append('jobs', JSON.stringify(jobs.map(j => ({ id: j.id, title: j.title, description: j.description }))));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success && data.analysis) {
        const analysis = data.analysis;
        setResumeText(data.resumeText || "");
        if (analysis.structuredResume) {
          setStructuredResume(JSON.stringify(analysis.structuredResume, null, 2));
        } else {
          setStructuredResume("");
        }
        setSkills(analysis.skills || []);

        if (analysis.atsFeedback) {
          setAtsScore(analysis.atsFeedback.score || 0);
          setFormattingErrors(analysis.atsFeedback.formattingErrors || []);
          setSuggestions(analysis.atsFeedback.suggestions || []);
        }
        
        // Update jobs with new scores
        const newJobs = jobs.map(job => {
          const scoreData = analysis.scores.find((s: any) => s.jobId === job.id);
          if (scoreData) {
            return {
              ...job,
              matchScore: scoreData.matchScore,
              matchReason: scoreData.matchReason
            };
          }
          return job;
        });

        // Sort by highest score
        newJobs.sort((a, b) => b.matchScore - a.matchScore);
        setJobs(newJobs);
      } else {
        alert(data.error || "Failed to analyze resume.");
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze resume. Check console for details.");
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 3. Easy Apply to job
  const handleApply = async (jobId: string, matchScore: number, matchReason: string) => {
    if (!resumeText) {
      alert("Please upload your resume first so we can send it to the employer.");
      return;
    }

    // Prevent double-click
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
          aiMatchScore: matchScore,
          aiMatchReason: matchReason
        })
      });

      const data = await res.json();
      if (data.success) {
        setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
        alert(data.updatedExisting ? "Application updated successfully with your new resume!" : "Application submitted successfully!");
      } else {
        alert(data.error || "Failed to apply");
      }
    } catch (err) {
      alert("Error submitting application");
    } finally {
      setSubmittingJobs(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // 4. Logout
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

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading candidate portal...</p>
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
            
            <div className="hidden md:flex space-x-6 items-center">
              <button 
                onClick={() => setActiveTab("jobs")}
                className={`px-1 py-5 text-sm font-medium transition-all ${
                  activeTab === "jobs" 
                    ? "text-white border-b-2 border-indigo-500" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab("ats-check")}
                className={`px-1 py-5 text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === "ats-check" 
                    ? "text-indigo-400 border-b-2 border-indigo-500" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Award className="w-4 h-4" /> ATS Feedback
              </button>
              <Link href="/seeker/jobs" className="text-slate-400 hover:text-white px-1 py-5 text-sm font-medium transition-colors">
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
                  {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                      <p className="text-sm font-bold text-white truncate">{user?.name || "Job Seeker"}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email || "No email"}</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Profile Card Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white/5 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
            <Sparkles className="w-40 h-40 text-white" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-0.5">Welcome, {user?.name}</h1>
              <p className="text-slate-400 text-sm">Role: Job Seeker (Employee) Portal</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setActiveTab("jobs")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "jobs"
                  ? "bg-white text-black"
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
              }`}
            >
              Recommended Jobs
            </button>
            <button 
              onClick={() => setActiveTab("ats-check")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "ats-check"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
              }`}
            >
              <Award className="w-4 h-4" /> ATS Report
            </button>
          </div>
        </div>

        {activeTab === "jobs" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Job Feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" /> Recommended For You
                </h2>
                {isAnalyzing && (
                  <span className="text-xs text-indigo-400 animate-pulse flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI calculations running...
                  </span>
                )}
              </div>
              
              {jobs.length === 0 ? (
                <p className="text-slate-500 bg-white/5 p-8 rounded-2xl text-center border border-white/5">No jobs available in the database.</p>
              ) : jobs.map((job) => (
                <div key={job.id} className="glass p-6 rounded-3xl hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
                  
                  {/* Matching Score Circle */}
                  <div className="absolute top-0 right-0 p-6">
                    <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-4 shadow-lg ${
                      job.matchScore >= 80 ? 'border-green-500/20 text-green-400 bg-green-500/5' :
                      job.matchScore >= 50 ? 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5' :
                      job.matchScore > 0 ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/5' :
                      'border-slate-800 text-slate-600'
                    }`} title="AI Job Match Score">
                      <span className="text-base font-extrabold">{job.matchScore || '-'}</span>
                      <span className="text-[7px] font-semibold tracking-wider text-slate-500 uppercase">Score</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-xl font-black text-slate-400 border border-white/5 group-hover:scale-105 transition-transform duration-300">
                      {job.company?.logoUrl || job.company?.name.charAt(0) || "C"}
                    </div>
                    <div className="pr-12">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company?.name}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.employmentType || 'Full-time'}</span>
                        {job.domain && <span className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md"><Sparkles className="w-3 h-3" /> {job.domain}</span>}
                      </div>
                    </div>
                  </div>

                  {/* AI match evaluation block */}
                  <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-start gap-3">
                      {isAnalyzing ? (
                        <Loader2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <span className="font-bold text-white">Semantic AI Match Check:</span> {job.matchReason}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="font-semibold text-slate-300 text-sm">{job.salaryRange || 'Competitive Salary'}</span>
                    {appliedJobs[job.id] ? (
                      <button 
                        onClick={() => handleApply(job.id, job.matchScore, job.matchReason)}
                        disabled={submittingJobs[job.id]}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
                        title="Submit your newly uploaded resume to this job"
                      >
                        {submittingJobs[job.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />} {submittingJobs[job.id] ? 'Submitting...' : 'Re-apply'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApply(job.id, job.matchScore, job.matchReason)}
                        disabled={submittingJobs[job.id]}
                        className="px-5 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors duration-200 flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {submittingJobs[job.id] ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying...</> : <>Easy Apply <ChevronRight className="w-3.5 h-3.5" /></>}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Sidebar (Active Resume info & Skill Vector) */}
            <div className="space-y-6">
              
              {/* Resume Upload Card */}
              <div className="glass p-6 rounded-3xl border-indigo-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 pointer-events-none" />
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">Resume Attachment</h3>
                <p className="text-xs text-slate-400 mb-6 relative z-10">Upload a fresh PDF resume to automatically recalculate matches.</p>
                
                {resumeName && (
                  <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 text-xs relative z-10 text-slate-300">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate font-semibold" title={resumeName}>{resumeName}</span>
                  </div>
                )}

                <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                
                <div 
                  onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                  className={`border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative z-10
                    ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-500/50 hover:bg-white/5'}`}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-7 h-7 text-indigo-400 mb-3 animate-spin" />
                  ) : (
                    <FileText className="w-7 h-7 text-slate-400 mb-3" />
                  )}
                  <span className="text-xs font-bold text-white">
                    {isAnalyzing ? 'Analyzing Resume...' : resumeName ? 'Replace PDF Resume' : 'Click to Upload PDF'}
                  </span>
                </div>
              </div>

              {/* Skills Card */}
              <div className="glass p-6 rounded-3xl border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Your Extracted Skill Vector</h3>
                {skills.length === 0 ? (
                  <p className="text-xs text-slate-500">No skills parsed yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:border-indigo-500/20 hover:text-white transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ATS Feedback Tab Section */
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Award className="w-60 h-60 text-white" />
            </div>

            <div className="border-b border-white/10 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-indigo-400" /> ATS Optimization Analyzer
                </h2>
                <p className="text-slate-400 text-xs mt-1">AI-driven inspection of your uploaded resume content and structure.</p>
              </div>
              
              {/* ATS Score Display */}
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center shadow-lg
                  ${atsScore >= 80 ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                    atsScore >= 50 ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                    atsScore > 0 ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5' :
                    'border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-lg font-black">{atsScore || '-'}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Overall ATS Score</span>
                  <span className="text-[10px] text-slate-400">Target for 80+ to bypass ATS filters</span>
                </div>
              </div>
            </div>

            {!resumeText ? (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <FileText className="w-12 h-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">No Resume Uploaded</h3>
                <p className="text-slate-400 text-sm max-w-sm">Please upload a PDF resume in the dashboard to review optimization details and AI recommendations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column: Errors & Suggestions */}
                <div className="space-y-6">
                  {/* Warnings/Formatting errors */}
                  <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
                    <h3 className="text-sm font-extrabold text-red-400 flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-4.5 h-4.5" /> Formatting Errors & Warnings ({formattingErrors.length})
                    </h3>
                    {formattingErrors.length === 0 ? (
                      <p className="text-xs text-slate-400">Perfect formatting! No structural issues found by AI.</p>
                    ) : (
                      <ul className="space-y-3">
                        {formattingErrors.map((err, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                            <span>{err}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Suggestions */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6">
                    <h3 className="text-sm font-extrabold text-indigo-400 flex items-center gap-2 mb-4">
                      <Lightbulb className="w-4.5 h-4.5" /> Resume Optimization Suggestions ({suggestions.length})
                    </h3>
                    {suggestions.length === 0 ? (
                      <p className="text-xs text-slate-400">No suggestions. Your resume is highly optimized!</p>
                    ) : (
                      <ul className="space-y-3">
                        {suggestions.map((sug, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Right Column: Parsed Resume Text Preview */}
                <div className="h-[450px]">
                  <ResumeRenderer 
                    resumeText={resumeText} 
                    structuredResumeStr={structuredResume}
                  />
                </div>

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

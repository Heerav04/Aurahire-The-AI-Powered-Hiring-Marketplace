"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Building2, MapPin, Briefcase, FileText, Star, Mail, User, Users, ShieldAlert, X, Info } from "lucide-react";
import Link from "next/link";
import ResumeRenderer from "@/components/ResumeRenderer";

type Seeker = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  headline: string | null;
};

type Application = {
  id: string;
  seekerId: string;
  resumeText: string;
  resumeName: string;
  structuredResume: string | null;
  aiMatchScore: number | null;
  aiMatchReason: string | null;
  createdAt: string;
  seeker: Seeker;
};

type JobDetail = {
  id: string;
  title: string;
  description: string;
  domain: string | null;
  location: string | null;
  employmentType: string | null;
  salaryRange: string | null;
  createdAt: string;
  company: {
    name: string;
    owner: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    }
  };
  applications: Application[];
};

export default function JobApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for active applicant
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`);
      const data = await res.json();
      
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      
      if (data.success) {
        setJob(data.job);
        if (data.job.applications && data.job.applications.length > 0) {
          setSelectedAppId(data.job.applications[0].id);
        }
      } else {
        setError(data.error || "Failed to load job details.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="mb-4">{error || "Job not found."}</p>
        <Link href="/admin" className="text-red-400 hover:text-red-300">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const selectedApplication = job.applications.find(app => app.id === selectedAppId);

  return (
    <div className="h-full flex flex-col mx-auto max-w-7xl">
      <Link href={`/admin/recruiters/${job.company.owner.id}`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Recruiter
      </Link>

      {/* Job Header */}
      <div className="glass p-6 rounded-3xl border border-white/10 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-red-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5 text-red-400 font-medium bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
              <Building2 className="w-4 h-4" />
              {job.company.name}
            </span>
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                {job.location}
              </span>
            )}
            {job.employmentType && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-500" />
                {job.employmentType}
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {job.applications.length} Applicants
            </span>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <button 
            onClick={() => setShowJobDetails(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-semibold transition-colors"
          >
            <Info className="w-4 h-4 text-slate-400" />
            Job & Recruiter Details
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-semibold shadow-inner">
            <ShieldAlert className="w-4 h-4" />
            Admin View
          </div>
        </div>
      </div>

      {/* Split Pane View */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Pane: Applicants List */}
        <div className="w-full lg:w-1/3 flex flex-col glass rounded-3xl border border-white/10 overflow-hidden shrink-0 h-[400px] lg:h-auto">
          <div className="p-4 border-b border-white/10 bg-white/5 shrink-0">
            <h2 className="font-semibold text-white">All Applicants</h2>
            <p className="text-xs text-slate-400 mt-1">{job.applications.length} total applications</p>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {job.applications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No applicants yet.
              </div>
            ) : (
              <div className="space-y-2">
                {job.applications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-2
                      ${selectedAppId === app.id 
                        ? 'bg-red-500/10 border-red-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                        : 'glass border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                          ${selectedAppId === app.id ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}
                        `}>
                          {app.seeker.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-medium truncate ${selectedAppId === app.id ? 'text-white' : 'text-slate-200'}`}>
                            {app.seeker.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{app.seeker.email}</p>
                        </div>
                      </div>
                      {app.aiMatchScore !== null && (
                        <div className={`px-2 py-1 rounded-md text-xs font-bold shrink-0 flex items-center gap-1
                          ${app.aiMatchScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                            app.aiMatchScore >= 60 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                            'bg-red-500/10 text-red-400 border border-red-500/20'}
                        `}>
                          {app.aiMatchScore}%
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <FileText className="w-3 h-3" />
                      <span className="truncate">{app.resumeName}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Application Details */}
        <div className="w-full lg:w-2/3 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden h-[600px] lg:h-auto shadow-xl">
          {!selectedApplication ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <FileText className="w-12 h-12 text-slate-600 mb-4" />
              <p>Select an applicant from the left to view their details</p>
            </div>
          ) : (
            <>
              {/* Detail Header */}
              <div className="p-6 md:p-8 border-b border-white/10 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-inner border border-white/5">
                        {selectedApplication.seeker.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{selectedApplication.seeker.name}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md">
                            <Mail className="w-3.5 h-3.5" />
                            {selectedApplication.seeker.email}
                          </span>
                          <span className="text-xs">
                            Applied {new Date(selectedApplication.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedApplication.aiMatchScore !== null && (
                      <div className="flex items-center gap-3 bg-black/40 px-5 py-3 rounded-2xl border border-white/10">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">AI Match Score</span>
                          <span className="text-sm text-slate-300">Based on job description</span>
                        </div>
                        <div className={`text-3xl font-extrabold flex items-center gap-1
                          ${selectedApplication.aiMatchScore >= 80 ? 'text-emerald-400' : 
                            selectedApplication.aiMatchScore >= 60 ? 'text-yellow-400' : 
                            'text-red-400'}
                        `}>
                          {selectedApplication.aiMatchScore}
                          <span className="text-lg opacity-50">%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedApplication.aiMatchReason && (
                    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                      <div className="flex items-center gap-2 mb-2 font-semibold text-white">
                        <Star className="w-4 h-4 text-yellow-400" />
                        AI Analysis
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {selectedApplication.aiMatchReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Details Content */}
              <div className="flex-1 overflow-hidden p-6 md:p-8 flex flex-col bg-black/20">
                <ResumeRenderer 
                  resumeText={selectedApplication.resumeText} 
                  structuredResumeStr={selectedApplication.structuredResume}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Job & Recruiter Details Modal */}
      {showJobDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-red-400" />
                Job & Recruiter Details
              </h2>
              <button 
                onClick={() => setShowJobDetails(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Recruiter Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-white/10 pb-2">Posted By</h3>
                <div className="flex items-center gap-4 glass p-4 rounded-2xl border border-white/5">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {job.company.owner.avatarUrl ? (
                      <img src={job.company.owner.avatarUrl} alt={job.company.owner.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white mb-1">{job.company.owner.name}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Mail className="w-4 h-4" />
                      {job.company.owner.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-white/10 pb-2">Job Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <div className="text-xs text-slate-500 mb-1">Domain/Industry</div>
                    <div className="text-sm text-white font-medium">{job.domain || 'Not specified'}</div>
                  </div>
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <div className="text-xs text-slate-500 mb-1">Salary Range</div>
                    <div className="text-sm text-white font-medium">{job.salaryRange || 'Not specified'}</div>
                  </div>
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <div className="text-xs text-slate-500 mb-1">Posted On</div>
                    <div className="text-sm text-white font-medium">{new Date(job.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <div className="text-xs text-slate-500 mb-1">Company</div>
                    <div className="text-sm text-white font-medium">{job.company.name}</div>
                  </div>
                </div>
                
                <div className="mt-4 glass p-6 rounded-2xl border border-white/5">
                  <div className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">Job Description</div>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end shrink-0">
              <button 
                onClick={() => setShowJobDetails(false)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

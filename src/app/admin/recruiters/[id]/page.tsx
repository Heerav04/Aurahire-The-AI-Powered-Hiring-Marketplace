"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Building2, Mail, MapPin, Briefcase, ChevronRight, Users } from "lucide-react";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  location: string | null;
  employmentType: string | null;
  createdAt: string;
  _count: { applications: number };
};

type Company = {
  id: string;
  name: string;
  industry: string | null;
  description: string | null;
  jobs: Job[];
};

type RecruiterDetail = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  companies: Company[];
};

export default function RecruiterDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [recruiter, setRecruiter] = useState<RecruiterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchRecruiterDetails();
    }
  }, [id]);

  const fetchRecruiterDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/recruiters/${id}`);
      const data = await res.json();
      
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      
      if (data.success) {
        setRecruiter(data.recruiter);
      } else {
        setError(data.error || "Failed to load recruiter.");
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

  if (error || !recruiter) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="mb-4">{error || "Recruiter not found."}</p>
        <Link href="/admin" className="text-red-400 hover:text-red-300">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>

      {/* Recruiter Profile Header */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center shadow-inner border border-indigo-500/20">
            {recruiter.avatarUrl ? (
              <img src={recruiter.avatarUrl} alt={recruiter.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="text-4xl font-bold text-indigo-400">{recruiter.name.charAt(0)}</span>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{recruiter.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Mail className="w-4 h-4 text-indigo-400" />
                {recruiter.email}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Recruiter
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Companies & Jobs */}
      <div className="space-y-8">
        {recruiter.companies.length === 0 ? (
          <div className="glass p-8 rounded-2xl border border-white/10 text-center text-slate-400">
            This recruiter hasn't created any companies or job postings yet.
          </div>
        ) : (
          recruiter.companies.map((company) => (
            <div key={company.id} className="space-y-4">
              {/* Company Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{company.name}</h2>
                  {company.industry && <p className="text-sm text-slate-400">{company.industry}</p>}
                </div>
              </div>

              {/* Jobs List */}
              <div className="grid gap-4">
                {company.jobs.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-sm text-slate-500">
                    No active job postings for this company.
                  </div>
                ) : (
                  company.jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/admin/jobs/${job.id}`}
                      className="group glass p-5 rounded-2xl border border-white/10 hover:border-red-500/30 hover:bg-white/[0.03] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors mb-1">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {job.location}
                            </span>
                          )}
                          {job.employmentType && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5" />
                              {job.employmentType}
                            </span>
                          )}
                          <span className="text-slate-500">
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-white">
                            {job._count.applications}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                            Applicants
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white text-slate-400 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

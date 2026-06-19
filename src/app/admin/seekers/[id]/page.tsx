"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Mail, MapPin, Briefcase, Building2, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type Application = {
  id: string;
  createdAt: string;
  aiMatchScore: number | null;
  job: {
    id: string;
    title: string;
    location: string | null;
    employmentType: string | null;
    company: {
      name: string;
      owner: {
        id: string;
      };
    };
  };
};

type SeekerDetail = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  headline: string | null;
  applications: Application[];
};

export default function SeekerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [seeker, setSeeker] = useState<SeekerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchSeekerDetails();
    }
  }, [id]);

  const fetchSeekerDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/seekers/${id}`);
      const data = await res.json();
      
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      
      if (data.success) {
        setSeeker(data.seeker);
      } else {
        setError(data.error || "Failed to load seeker.");
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

  if (error || !seeker) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="mb-4">{error || "Seeker not found."}</p>
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

      {/* Seeker Profile Header */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center shadow-inner border border-emerald-500/20">
            {seeker.avatarUrl ? (
              <img src={seeker.avatarUrl} alt={seeker.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="text-4xl font-bold text-emerald-400">{seeker.name.charAt(0)}</span>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{seeker.name}</h1>
            {seeker.headline && <p className="text-slate-300 mb-3">{seeker.headline}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Mail className="w-4 h-4 text-emerald-400" />
                {seeker.email}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Job Seeker
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Job Applications</h2>
            <p className="text-sm text-slate-400">Track all jobs this candidate has applied for.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {seeker.applications.length === 0 ? (
            <div className="p-8 rounded-3xl glass border border-dashed border-white/10 text-center text-slate-500">
              This user hasn't applied to any jobs yet.
            </div>
          ) : (
            seeker.applications.map((app) => (
              <Link
                key={app.id}
                href={`/admin/jobs/${app.job.id}`}
                className="group glass p-5 rounded-2xl border border-white/10 hover:border-red-500/30 hover:bg-white/[0.03] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors mb-1">
                    {app.job.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                      <Building2 className="w-3.5 h-3.5" />
                      {app.job.company.name}
                    </span>
                    {app.job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.job.location}
                      </span>
                    )}
                    {app.job.employmentType && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {app.job.employmentType}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {app.aiMatchScore !== null && (
                    <div className="flex flex-col items-end">
                      <span className={`text-2xl font-bold flex items-center gap-1
                        ${app.aiMatchScore >= 80 ? 'text-emerald-400' : 
                          app.aiMatchScore >= 60 ? 'text-yellow-400' : 
                          'text-red-400'}
                      `}>
                        {app.aiMatchScore}<span className="text-sm opacity-50">%</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        AI Match
                      </span>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white text-slate-400 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

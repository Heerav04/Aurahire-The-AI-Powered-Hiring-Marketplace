import Link from "next/link";
import { Building2, Search, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex flex-col selection:bg-indigo-500/30">
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
            <div className="flex space-x-4">
              <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-300 to-indigo-500">
          The AI-Powered <br/> Hiring Marketplace
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12">
          Experience the future of hiring. Intelligent semantic matching for job seekers and automated applicant tracking for recruiters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Seeker Card */}
          <Link href="/login" className="group glass p-8 rounded-3xl hover:border-indigo-500/50 transition-all flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-white">I am a Job Seeker</h2>
            <p className="text-slate-400 mb-8">Upload your resume and let our AI instantly match you with the perfect roles based on semantic skills.</p>
            <div className="mt-auto flex items-center gap-2 text-indigo-400 font-medium group-hover:gap-4 transition-all">
              Enter Seeker Portal <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Recruiter Card */}
          <Link href="/login" className="group glass p-8 rounded-3xl hover:border-blue-500/50 transition-all flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-white">I am a Recruiter</h2>
            <p className="text-slate-400 mb-8">Post jobs and get automated ATS scoring for all incoming applications. Hire the best talent, faster.</p>
            <div className="mt-auto flex items-center gap-2 text-blue-400 font-medium group-hover:gap-4 transition-all">
              Enter Recruiter Portal <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

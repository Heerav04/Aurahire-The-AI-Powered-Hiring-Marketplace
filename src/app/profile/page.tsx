import Link from "next/link";
import { Sparkles, Home, Users, Briefcase, UserCircle, Pencil, Plus, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#f3f2ef] text-slate-900 font-sans">
      {/* Global Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/feed" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block">AuraHire</span>
            </Link>
            
            <div className="flex space-x-2 md:space-x-8">
              <Link href="/feed" className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">Home</span>
              </Link>
              <Link href="/network" className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors">
                <Users className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">My Network</span>
              </Link>
              <Link href="/seeker/jobs" className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors">
                <Briefcase className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">Jobs</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center justify-center text-indigo-600 border-b-2 border-indigo-600 px-2 py-1">
                <UserCircle className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">Me</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md transition-colors">
              <Pencil className="w-5 h-5" />
            </button>
          </div>
          
          <div className="px-8 pb-8 relative">
            <div className="flex justify-between items-end -mt-16 mb-4">
              <img src="https://ui-avatars.com/api/?name=Your+Name&background=random" className="w-32 h-32 rounded-full border-4 border-white bg-white relative z-10" />
              <div className="flex gap-3">
                <button className="px-5 py-1.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">Open to work</button>
                <button className="px-5 py-1.5 border border-indigo-600 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-colors">Add profile section</button>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Your Name</h1>
                <p className="text-lg text-slate-700 mt-1">Aspiring Software Engineer | React, Next.js, Node.js</p>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">San Francisco, California, United States <span className="text-indigo-600 hover:underline cursor-pointer font-medium">Contact info</span></p>
                <p className="text-sm text-indigo-600 font-semibold mt-2 hover:underline cursor-pointer">105 connections</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold hover:underline cursor-pointer flex items-center gap-2 justify-end">TechNova University <ExternalLink className="w-4 h-4"/></p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative">
          <button className="absolute top-6 right-6 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Pencil className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-4">About</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Passionate software developer with experience in modern web technologies. I love building fast, accessible, and beautiful web applications. Looking for a full-time role to leverage my skills in React and Node.js. Our AI parsed resume will automatically populate sections below!
          </p>
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative">
          <div className="absolute top-6 right-6 flex gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Plus className="w-5 h-5" /></button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Pencil className="w-5 h-5" /></button>
          </div>
          <h2 className="text-xl font-bold mb-6">Experience</h2>
          
          <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-lg">N</div>
            <div>
              <h3 className="font-bold text-slate-800">Software Engineering Intern</h3>
              <p className="text-sm text-slate-700">Nexus Dynamics · Internship</p>
              <p className="text-xs text-slate-500 mt-1">Jun 2024 - Present · 3 mos</p>
              <p className="text-xs text-slate-500">San Francisco, CA</p>
              <p className="text-sm text-slate-700 mt-3">Developed internal dashboard tools using Next.js and Tailwind CSS. Improved API response times by 20% through query optimization.</p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative">
          <div className="absolute top-6 right-6 flex gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Plus className="w-5 h-5" /></button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Pencil className="w-5 h-5" /></button>
          </div>
          <h2 className="text-xl font-bold mb-6">Skills (AI Extracted)</h2>
          
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-800">React.js</h3>
              <p className="text-sm text-slate-500 flex items-center gap-2"><Briefcase className="w-4 h-4"/> Nexus Dynamics</p>
            </div>
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-800">TypeScript</h3>
              <p className="text-sm text-slate-500 flex items-center gap-2"><Briefcase className="w-4 h-4"/> Nexus Dynamics</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Next.js</h3>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

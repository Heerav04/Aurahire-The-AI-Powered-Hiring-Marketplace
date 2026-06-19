import Link from "next/link";
import { Sparkles, Home, Users, Briefcase, UserCircle, UserPlus, X } from "lucide-react";

export default function NetworkPage() {
  const connections = [
    { id: 1, name: "David Chen", role: "Product Manager at TechNova", mutual: 12 },
    { id: 2, name: "Emily Blunt", role: "HR Director at Nexus", mutual: 4 },
    { id: 3, name: "Ahmed Kahn", role: "Software Engineer", mutual: 23 },
    { id: 4, name: "Sarah Jenkins", role: "Senior Frontend Engineer", mutual: 8 },
  ];

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
              <Link href="/network" className="flex flex-col items-center justify-center text-indigo-600 border-b-2 border-indigo-600 px-2 py-1">
                <Users className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">My Network</span>
              </Link>
              <Link href="/seeker/jobs" className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors">
                <Briefcase className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">Jobs</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors">
                <UserCircle className="w-6 h-6" />
                <span className="text-xs font-medium hidden md:block">Me</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sidebar */}
        <div className="col-span-1 hidden md:block">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <h2 className="p-4 border-b border-slate-100 font-semibold text-slate-700">Manage my network</h2>
            <ul className="p-2 space-y-1">
              <li className="flex justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-600 font-medium">
                <span className="flex items-center gap-2"><Users className="w-5 h-5 text-slate-400"/> Connections</span>
                <span>105</span>
              </li>
              <li className="flex justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-600 font-medium">
                <span className="flex items-center gap-2"><UserCircle className="w-5 h-5 text-slate-400"/> Following & followers</span>
                <span>42</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Center/Right Content */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-semibold text-slate-800 mb-4">Pending Invitations</h2>
            <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <img src="https://ui-avatars.com/api/?name=Alex+Carter&background=random" className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-semibold text-sm">Alex Carter</h3>
                  <p className="text-xs text-slate-500">Recruiter at InnovateTech</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                <button className="px-4 py-1.5 border border-indigo-600 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-colors">Accept</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-semibold text-slate-800 mb-6">People you may know</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map(person => (
                <div key={person.id} className="border border-slate-200 rounded-xl overflow-hidden text-center relative group">
                  <div className="h-16 bg-gradient-to-r from-slate-200 to-slate-300"></div>
                  <button className="absolute top-2 right-2 p-1 bg-black/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"><X className="w-4 h-4" /></button>
                  <div className="px-4 pb-4 flex flex-col items-center">
                    <img src={`https://ui-avatars.com/api/?name=${person.name.replace(' ','+')}&background=random`} className="w-20 h-20 rounded-full border-4 border-white -mt-10 mb-2" />
                    <h3 className="font-bold text-slate-800 hover:underline cursor-pointer">{person.name}</h3>
                    <p className="text-xs text-slate-500 h-8 line-clamp-2 mt-1">{person.role}</p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><Users className="w-3 h-3"/> {person.mutual} mutual connections</p>
                    <button className="mt-4 w-full py-1.5 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" /> Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

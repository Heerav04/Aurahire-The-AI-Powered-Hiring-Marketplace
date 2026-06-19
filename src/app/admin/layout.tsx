"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, LogOut, LayoutDashboard, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Middleware already enforces admin role server-side.
    // Here we only read the display name from the cookie.
    const name = document.cookie.split('; ').find(row => row.startsWith('userName='))?.split('=')[1];
    if (name) {
      setUserName(decodeURIComponent(name));
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 glass border-r border-white/10 flex flex-col z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin</h1>
              <p className="text-xs text-slate-400">Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                  ${isActive 
                    ? "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 font-bold text-sm">
                {userName ? userName.charAt(0).toUpperCase() : "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName || "Admin"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />
        
        <main className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

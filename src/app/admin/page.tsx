"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Loader2, Building2, Briefcase, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    posts: number;
    companies: number;
    applications: number;
  };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, roleFilter, sortBy, order]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: debouncedSearch,
        role: roleFilter,
        sortBy,
        order
      });
      const res = await fetch(`/api/admin/users?${query}`);
      const data = await res.json();
      
      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }
      
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Directory</h1>
          <p className="text-slate-400">Manage all recruiters and job seekers in the system.</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.push('/admin/login');
            }}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold shadow-lg shadow-red-500/5"
          >
            Secure Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full mb-8">
        <div className="relative flex-1 sm:min-w-[250px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 text-white placeholder-slate-500 transition-all"
          />
        </div>

        <div className="relative min-w-[140px]">
          <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 text-white appearance-none cursor-pointer"
          >
            <option value="all" className="bg-[#1a1a1a]">All Roles</option>
            <option value="recruiter" className="bg-[#1a1a1a]">Recruiters</option>
            <option value="seeker" className="bg-[#1a1a1a]">Job Seekers</option>
          </select>
        </div>
      </div>

      <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                  User {sortBy === 'name' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('role')}>
                  Role {sortBy === 'role' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('createdAt')}>
                  Joined {sortBy === 'createdAt' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 font-medium">Stats</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-4" />
                      <p>Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.role === 'recruiter' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'recruiter' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        {user.role === 'recruiter' ? <Building2 className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                        {user.role === 'recruiter' ? 'Recruiter' : 'Seeker'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-slate-400">
                        {user.role === 'recruiter' ? (
                          <span>{user._count.companies} Companies</span>
                        ) : (
                          <span>{user._count.applications} Applications</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/${user.role === 'recruiter' ? 'recruiters' : 'seekers'}/${user.id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
                      >
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

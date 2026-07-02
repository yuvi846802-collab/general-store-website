import { useState } from "react";
import { Search, Plus, RefreshCw, Shield, UserCheck, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return data.users || [];
  };

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["adminUsersTab"],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter((u: any) => 
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management & Permissions</h1>
          <p className="text-sm text-muted-foreground">Manage administrative accounts and store role privileges.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-all shadow-sm"
        >
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground animate-pulse">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No users found.</td></tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground text-sm flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name || "Anonymous User"}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 w-fit ${
                        user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      }`}>
                        <Shield size={12} />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-600 font-medium text-xs flex items-center gap-1">
                        <UserCheck size={14} /> Active
                      </span>
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

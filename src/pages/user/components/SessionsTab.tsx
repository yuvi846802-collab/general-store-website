import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Monitor, Smartphone, Trash2, Globe, ShieldAlert, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiClient from "@/lib/api";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";

export function SessionsTab() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const logout = useAuthStore(state => state.logout);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await ApiClient.get("/users/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to fetch sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (id: string) => {
    try {
      const res = await ApiClient.delete(`/users/sessions/${id}`);
      if (res.ok) {
        toast({ title: "Session Revoked", description: "Device has been disconnected." });
        setSessions(sessions.filter(s => s.id !== id));
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to revoke session." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Network error." });
    }
  };

  const handleRevokeAll = async () => {
    setIsLoading(true);
    try {
      const res = await ApiClient.delete("/users/sessions");
      if (res.ok) {
        toast({ title: "Logged out from all devices." });
        logout();
        setLocation("/login");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to logout from all devices." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Active Sessions</h3>
              <p className="text-sm text-slate-500">Manage devices logged into your account.</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={handleRevokeAll} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
            Logout All Devices
          </Button>
        </div>

        <div className="space-y-4">
          {sessions.map((session, idx) => {
            const isDesktop = session.deviceType === "Desktop" || !session.deviceType?.toLowerCase().includes("mobile");
            return (
              <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                    {isDesktop ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{session.os || "Unknown OS"}</p>
                      {idx === 0 && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Current Device</span>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {session.browser || "Unknown Browser"}</span>
                      <span>•</span>
                      <span>{session.ipAddress}</span>
                    </div>
                  </div>
                </div>
                {idx !== 0 && (
                  <Button variant="ghost" size="sm" onClick={() => handleRevokeSession(session.id)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}
          {sessions.length === 0 && (
            <div className="text-center py-8 text-slate-500">No active sessions found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

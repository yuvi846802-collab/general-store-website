import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
// Tabs removed as per user request
// Icons removed with tabs
import { io } from "socket.io-client";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { PersonalInfoTab } from "./components/PersonalInfoTab";
import { SecurityTab } from "./components/SecurityTab";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const { toast } = useToast();

  useEffect(() => {
    // Connect to Socket.IO for realtime updates
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"]
    });

    socket.on('connect', () => {
      console.log('Profile connected to realtime server');
    });

    socket.on('profileUpdated', (data) => {
      if (data.userId === user?.id) {
        updateUser(data.user);
        toast({ title: "Profile updated remotely", description: "Your profile changes have been synchronized." });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, updateUser, toast]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ProfileSidebar user={user} updateUser={updateUser} />
          
          <div className="md:col-span-3">
            <div className="space-y-8">
              <PersonalInfoTab user={user} updateUser={updateUser} />
              <SecurityTab user={user} updateUser={updateUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

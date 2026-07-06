import { useState, useEffect } from "react";
import { 
  User, Mail, Phone, Lock, Edit3, CheckCircle2, 
  Calendar, Shield, Clock, Save, Eye, EyeOff, 
  Monitor, Smartphone, LogOut, ShieldAlert, Key, 
  Fingerprint, Activity, ShieldCheck, Camera, Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { getImageUrl, fetchWithAuth, API_URL } from "@/services/api";

export default function AdminProfile() {
  const { toast } = useToast();
  const { user, login } = useAuth();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });
  
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await fetchWithAuth(`${API_URL}/users/sessions`);
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions", err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const parts = profileData.name.trim().split(" ");
      const firstName = parts[0];
      const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
      
      const res = await fetchWithAuth(`${API_URL}/users/profile`, {
        method: "PUT",
        body: JSON.stringify({
          firstName,
          lastName,
          phone: profileData.phone,
          email: profileData.email
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      
      if (user) {
        login({ ...user, ...data.user });
      }
      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast({ variant: "destructive", title: "Error", description: "New passwords do not match." });
    }
    try {
      setIsUpdatingPassword(true);
      const res = await fetchWithAuth(`${API_URL}/users/update-password`, {
        method: "PUT",
        body: JSON.stringify(passwordData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      
      toast({ title: "Success", description: "Password updated successfully." });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleRevokeSession = async (id: string) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/users/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to revoke session");
      toast({ title: "Session Terminated", description: "Logged out of device successfully." });
      fetchSessions();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const res = await fetchWithAuth(`${API_URL}/users/sessions`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to revoke all sessions");
      toast({ title: "All Sessions Terminated", description: "Logged out of all other devices." });
      fetchSessions();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Validate image type (JPG, JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({ variant: "destructive", title: "Invalid File", description: "Only JPG, JPEG, PNG, and WEBP formats are allowed." });
      return;
    }

    // Validate maximum file size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File Too Large", description: "Maximum file size is 5 MB." });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingImage(true);
    try {
      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
      
      const updateRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImage: uploadData.url }),
        credentials: "include"
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.error || "Profile update failed");
      
      if (user) {
        login({ ...user, profileImage: uploadData.url, avatar: uploadData.url });
      }

      toast({ title: "Success", description: "Profile photo updated successfully." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
  };

  const getSessionIcon = (deviceInfo: string = "") => {
    const info = deviceInfo.toLowerCase();
    if (info.includes("mac") || info.includes("windows") || info.includes("pc")) return Monitor;
    return Smartphone;
  };

  return (
    <div className="space-y-6 pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1 tracking-tight">Profile & Security</h1>
          <p className="text-sm text-muted-foreground">Manage your advanced security preferences and active sessions.</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-12 gap-6"
      >
        
        {/* Left Column - Profile & Score */}
        <div className="xl:col-span-4 space-y-6">
          {/* Main Profile Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden group hover:border-primary/30 transition-colors duration-500 relative"
          >
            {/* Animated Gradient Background */}
            <div className="h-36 relative overflow-hidden bg-emerald-950">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 via-primary/20 to-transparent mix-blend-overlay"></div>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400 rounded-full blur-[80px]"
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full blur-[80px]"
              />
              
              {/* Glassmorphism Wave overlay */}
              <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-card to-transparent backdrop-blur-[2px]"></div>
            </div>
            
            <div className="px-6 pb-6 relative z-10">
              <div className="flex flex-col items-center -mt-16 mb-4">
                <div className="relative group/avatar">
                  <div className="w-28 h-28 rounded-full bg-card p-1 shadow-2xl relative">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-4xl font-heading font-bold overflow-hidden relative">
                      {user?.profileImage || user?.avatar ? (
                        <img src={getImageUrl(user.profileImage || user.avatar!)} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.substring(0, 2).toUpperCase() || 'AU'
                      )}
                      
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                          <Loader2 size={28} className="text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    {/* Camera Button placed at the bottom right edge */}
                    <label className="absolute bottom-0 right-0 w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-emerald-600 transition-colors border-4 border-card z-20">
                      <Camera size={14} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
                    </label>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-foreground mt-4 tracking-tight">{user?.name || "Admin User"}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 flex items-center gap-1.5">
                    <ShieldCheck size={12} /> {user?.role || "Super Administrator"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Active
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-6 mt-4 border-t border-border/50">
                {[
                  { icon: Mail, label: "Email Address", value: user?.email || "admin@hakeemstore.com" },
                  { icon: Phone, label: "Phone Number", value: user?.phone || "Not set" },
                  { icon: Calendar, label: "Member Since", value: "May 15, 2024" },
                  { icon: Clock, label: "Last Login", value: "Today, 10:30 AM" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 group/item">
                    <div className="p-2 rounded-xl bg-accent/50 text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors shrink-0">
                      <item.icon size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Security Health Score */}
          <motion.div 
            variants={itemVariants}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform duration-500">
              <ShieldAlert size={120} />
            </div>
            
            <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider text-muted-foreground">Security Health</h3>
            
            <div className="flex items-center gap-6">
              {/* Circular Progress Ring */}
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-accent" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * 85) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                    strokeLinecap="round" strokeDasharray="283"
                    className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">85<span className="text-sm">%</span></span>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-emerald-500 flex items-center gap-2 mb-1">
                  Excellent <CheckCircle2 size={16} />
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Your account is highly secure. Turn on 2FA to reach 100%.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle Column - Advanced Forms */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Personal Info */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">Personal Details</h3>
                <p className="text-xs text-muted-foreground mt-1">Update your core identity information.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-indigo-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-accent/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-border/80" 
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-indigo-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full bg-accent/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-border/80" 
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-indigo-500 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full bg-accent/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-border/80" 
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                  Save Details
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security & Passwords */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Key size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">Access & Passwords</h3>
                <p className="text-xs text-muted-foreground mt-1">Ensure your account uses a strong password.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="Enter current password" 
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" 
                  />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="New password" 
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" 
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm password" 
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" 
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Password Strength */}
              <div className="bg-background border border-border rounded-xl p-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-foreground">Password Strength</span>
                  <span className="text-xs font-bold text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded-md">Strong</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-1.5 flex-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                  <div className="h-1.5 flex-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                  <div className="h-1.5 flex-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                  <div className="h-1.5 flex-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                  <div className="h-1.5 flex-1 bg-muted rounded-full"></div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">Use 8+ characters with a mix of letters, numbers & symbols.</p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                  className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 w-max shadow-sm disabled:opacity-50"
                >
                  {isUpdatingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Update Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Advanced Features */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Two-Factor Auth Toggle */}
          <motion.div 
            variants={itemVariants}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Fingerprint size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground">Two-Factor Auth</h3>
            </div>
            
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Add an extra layer of security to your account by requiring a code from your authenticator app.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
              <div>
                <p className="text-sm font-bold text-foreground">Authenticator App</p>
                <p className={`text-[10px] font-semibold mt-0.5 ${is2FAEnabled ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {is2FAEnabled ? 'Currently Enabled' : 'Currently Disabled'}
                </p>
              </div>
              
              {/* Animated Toggle */}
              <button 
                onClick={() => {
                  setIs2FAEnabled(!is2FAEnabled);
                  toast({ title: is2FAEnabled ? "2FA Disabled" : "2FA Enabled", description: "Your security settings have been updated.", variant: is2FAEnabled ? "destructive" : "default" });
                }}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${is2FAEnabled ? 'bg-primary' : 'bg-muted'}`}
              >
                <motion.div 
                  className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ x: is2FAEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </motion.div>

          {/* Active Sessions */}
          <motion.div 
            variants={itemVariants}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Active Sessions</h3>
              <div className="p-1.5 bg-accent rounded-lg text-muted-foreground"><Activity size={14} /></div>
            </div>
            
            <div className="space-y-4">
              {isLoadingSessions ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-muted-foreground" size={24} />
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground bg-accent/20 rounded-xl">No active sessions found</div>
              ) : (
                sessions.map((session) => {
                  const Icon = getSessionIcon(session.deviceInfo);
                  const isCurrent = false; // We could determine this if we had the current session ID
                  return (
                    <div key={session.id} className="p-4 bg-background border border-border rounded-xl hover:border-primary/30 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${isCurrent ? 'bg-primary/10 text-primary' : 'bg-accent text-muted-foreground'}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground flex items-center gap-2">
                              {session.deviceInfo || "Unknown Device"}
                              {isCurrent && <span className="text-[9px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">This Device</span>}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{session.ipAddress || "Unknown IP"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border border-dashed">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-medium">Expires: {new Date(session.expiresAt).toLocaleDateString()}</p>
                          <p className={`text-[10px] font-semibold mt-0.5 ${isCurrent ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                            Started: {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {!isCurrent && (
                          <button 
                            onClick={() => handleRevokeSession(session.id)}
                            className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                            title="Log out of device"
                          >
                            <LogOut size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <button 
              onClick={handleRevokeAllSessions}
              disabled={sessions.length === 0}
              className="w-full mt-4 py-2.5 text-xs font-bold text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 rounded-xl transition-colors disabled:opacity-50"
            >
              Sign out of all other devices
            </button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

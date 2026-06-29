import { useState } from "react";
import { 
  User, Mail, Phone, Lock, Edit3, CheckCircle2, 
  Calendar, Shield, Clock, Save, Eye, EyeOff, 
  Monitor, Smartphone, LogOut, ShieldAlert, Key, 
  Fingerprint, Activity, ShieldCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AdminProfile() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  const sessions = [
    { id: 1, device: "MacBook Pro M3", os: "macOS Sonoma", browser: "Chrome", ip: "192.168.1.105", location: "Mumbai, India", time: "Active now", isCurrent: true, icon: Monitor },
    { id: 2, device: "iPhone 15 Pro", os: "iOS 17.2", browser: "Safari", ip: "117.214.32.12", location: "Mumbai, India", time: "2 hours ago", isCurrent: false, icon: Smartphone },
  ];

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
                <div className="relative group/avatar cursor-pointer">
                  <div className="w-28 h-28 rounded-full bg-card p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-4xl font-heading font-bold overflow-hidden relative">
                      {user?.name?.substring(0, 2).toUpperCase() || 'AU'}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm" onClick={() => toast({ title: "Camera", description: "Opening file browser to upload photo..." })}>
                        <Edit3 size={24} className="text-white mb-1" />
                        <span className="text-[10px] font-medium tracking-wider uppercase">Update</span>
                      </div>
                    </div>
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
                  { icon: Mail, label: "Email Address", value: "admin@hakeemstore.com" },
                  { icon: Phone, label: "Phone Number", value: "+91 9876543210" },
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
              {[
                { label: "Full Name", icon: User, type: "text", value: "Admin User" },
                { label: "Email Address", icon: Mail, type: "email", value: "admin@hakeemstore.com" },
                { label: "Phone Number", icon: Phone, type: "text", value: "+91 9876543210" }
              ].map((field, idx) => (
                <div key={idx} className="group">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{field.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-indigo-500 transition-colors">
                      <field.icon size={18} />
                    </div>
                    <input 
                      type={field.type} 
                      defaultValue={field.value} 
                      className="w-full bg-accent/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-border/80" 
                    />
                  </div>
                </div>
              ))}
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
                  onClick={() => toast({ title: "Security Updated", description: "Your new password is now active." })}
                  className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 w-max shadow-sm"
                >
                  <Lock size={16} /> Update Password
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
              {sessions.map((session) => (
                <div key={session.id} className="p-4 bg-background border border-border rounded-xl hover:border-primary/30 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${session.isCurrent ? 'bg-primary/10 text-primary' : 'bg-accent text-muted-foreground'}`}>
                        <session.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground flex items-center gap-2">
                          {session.device}
                          {session.isCurrent && <span className="text-[9px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">This Device</span>}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{session.browser} on {session.os}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border border-dashed">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium">{session.location} • {session.ip}</p>
                      <p className={`text-[10px] font-semibold mt-0.5 ${session.isCurrent ? 'text-emerald-500' : 'text-muted-foreground'}`}>{session.time}</p>
                    </div>
                    
                    {!session.isCurrent && (
                      <button 
                        onClick={() => toast({ title: "Session Terminated", description: `Logged out of ${session.device} successfully.` })}
                        className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                        title="Log out of device"
                      >
                        <LogOut size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => toast({ title: "All Sessions Terminated", description: "You have been logged out of all other devices." })}
              className="w-full mt-4 py-2.5 text-xs font-bold text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 rounded-xl transition-colors"
            >
              Sign out of all other devices
            </button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

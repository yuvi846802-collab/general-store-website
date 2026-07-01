import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  User, Mail, Phone, Lock, LogOut, ShieldCheck, 
  Smartphone, Monitor, Eye, EyeOff, Save, CheckCircle2,
  Calendar, ShieldAlert, Key, Bell
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import ApiClient from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserProfile() {
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    } else {
      fetchSessions();
    }
  }, [isAuthenticated, setLocation]);

  const fetchSessions = async () => {
    try {
      const res = await ApiClient.get("/user/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await ApiClient.put("/user/profile", formData);
      const data = await res.json();
      if (res.ok) {
        updateUser(data.user);
        toast({ title: "Success", description: "Profile updated successfully." });
      } else {
        toast({ variant: "destructive", title: "Error", description: data.error || "Update failed." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
    }
    
    setIsLoading(true);
    try {
      const res = await ApiClient.put("/user/update-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        toast({ title: "Success", description: "Password updated successfully." });
      } else {
        toast({ variant: "destructive", title: "Error", description: data.error || "Update failed." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight text-slate-900">My Profile</h1>
            <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 relative shadow-sm transition-colors">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
            </button>
            <Button variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 shadow-sm transition-colors" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" /> Logout
            </Button>
          </div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - User Card */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm pb-8">
              {/* Wavy gradient background */}
              <div className="h-32 relative overflow-hidden bg-gradient-to-br from-[#00b09b] to-[#00897b]">
                <svg className="absolute bottom-0 w-full h-16 text-white translate-y-1" preserveAspectRatio="none" viewBox="0 0 1440 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,50 C320,150 420,-50 740,50 C1060,150 1160,-50 1440,50 L1440,100 L0,100 Z"></path>
                </svg>
                {/* Dotted pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
              </div>
              
              <div className="px-6 relative z-10 -mt-14 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-white p-1 mb-4 shadow-sm relative">
                  <div className="w-full h-full rounded-full bg-[#00b09b] flex items-center justify-center text-white text-4xl font-heading font-bold uppercase shadow-inner">
                    {user.name ? user.name.charAt(0) : (user.email ? user.email.charAt(0) : 'U')}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{user.name || user.firstName || 'User'}</h2>
                <p className="text-sm text-slate-500 mb-5">{user.email}</p>
                
                <div className="flex items-center justify-center gap-3 mb-6">
                  {user.isVerified ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold flex items-center gap-1.5 border border-emerald-100">
                      <ShieldCheck size={14} /> Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold flex items-center gap-1.5 border border-amber-100">
                      <ShieldAlert size={14} /> Unverified
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center gap-1.5 border border-blue-100">
                    <User size={14} /> {user.role === 'USER' ? 'Customer' : user.role}
                  </span>
                </div>
              </div>

              <div className="px-8">
                <hr className="border-slate-100 mb-6" />
                <div className="space-y-6 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#00b09b] shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Member Since</p>
                      <p className="text-sm text-slate-500 mt-0.5">May 15, 2024</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#00b09b] shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Account Type</p>
                      <p className="text-sm text-slate-500 mt-0.5">{user.role === 'USER' ? 'Customer' : user.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#00b09b] shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Status</p>
                      <p className="text-sm font-semibold text-[#00b09b] flex items-center gap-1.5 mt-0.5">
                        Active <span className="w-1.5 h-1.5 rounded-full bg-[#00b09b]"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Tabs */}
          <motion.div variants={itemVariants} className="lg:col-span-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="flex w-full bg-white border border-slate-200 p-1 mb-6 rounded-2xl shadow-sm gap-1">
                <TabsTrigger value="personal" className="flex-1 rounded-xl py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#00b09b] relative group font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <User size={18} /> Personal Info
                  </div>
                  <div className="absolute bottom-0 left-[15%] right-[15%] h-[3px] bg-[#00b09b] rounded-t-full scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-center"></div>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex-1 rounded-xl py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#00b09b] relative group font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <Lock size={18} /> Security
                  </div>
                  <div className="absolute bottom-0 left-[15%] right-[15%] h-[3px] bg-[#00b09b] rounded-t-full scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-center"></div>
                </TabsTrigger>
                <TabsTrigger value="sessions" className="flex-1 rounded-xl py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#00b09b] relative group font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <Monitor size={18} /> Active Sessions
                  </div>
                  <div className="absolute bottom-0 left-[15%] right-[15%] h-[3px] bg-[#00b09b] rounded-t-full scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-center"></div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-0">
                <div className="bg-white border border-slate-200 rounded-[20px] p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                    <User className="text-[#00b09b]" size={22} /> Personal Information
                  </h3>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label htmlFor="firstName" className="font-semibold text-slate-900">First Name</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User size={18} />
                          </div>
                          <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="John" className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#00b09b] h-12 rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="lastName" className="font-semibold text-slate-900">Last Name</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User size={18} />
                          </div>
                          <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#00b09b] h-12 rounded-xl" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <Label htmlFor="email" className="font-semibold text-slate-900">Email Address</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail size={18} />
                        </div>
                        <Input id="email" value={user.email} disabled className="pl-10 bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed h-12 rounded-xl" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">Email address cannot be changed.</p>
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="phone" className="font-semibold text-slate-900">Phone Number</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone size={18} />
                        </div>
                        <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+92 300 0000000" className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#00b09b] h-12 rounded-xl" />
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                      <Button type="submit" disabled={isLoading} className="bg-[#00b09b] hover:bg-[#009b88] text-white px-6 h-12 rounded-xl font-semibold shadow-md shadow-emerald-500/20">
                        {isLoading ? "Saving..." : <><Save size={18} className="mr-2" /> Save Changes</>}
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="bg-white border border-slate-200 rounded-[20px] p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                    <Lock className="text-[#00b09b]" size={22} /> Update Password
                  </h3>
                  
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="currentPassword" className="font-semibold text-slate-900">Current Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock size={18} />
                        </div>
                        <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} placeholder="Enter current password" required className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#00b09b] h-12 rounded-xl pr-10" />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <Label htmlFor="newPassword" className="font-semibold text-slate-900">New Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Key size={18} />
                        </div>
                        <Input id="newPassword" type={showNewPassword ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} placeholder="Enter new password" required minLength={6} className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#00b09b] h-12 rounded-xl pr-10" />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="confirmPassword" className="font-semibold text-slate-900">Confirm New Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Key size={18} />
                        </div>
                        <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="Confirm new password" required minLength={6} className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#00b09b] h-12 rounded-xl" />
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                      <Button type="submit" disabled={isLoading} className="bg-[#00b09b] hover:bg-[#009b88] text-white px-6 h-12 rounded-xl font-semibold shadow-md shadow-emerald-500/20">
                        {isLoading ? "Updating..." : <><Save size={18} className="mr-2" /> Update Password</>}
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="mt-0">
                <div className="bg-white border border-slate-200 rounded-[20px] p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Monitor className="text-[#00b09b]" size={22} /> Active Sessions
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {sessions.length > 0 ? sessions.map((session, index) => (
                      <div key={session.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-[#00b09b]/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${index === 0 ? 'bg-[#00b09b]/10 text-[#00b09b]' : 'bg-white text-slate-400 border border-slate-200'}`}>
                            {session.deviceInfo?.toLowerCase().includes('mobile') || session.deviceInfo?.toLowerCase().includes('iphone') ? <Smartphone size={20} /> : <Monitor size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 flex items-center gap-2">
                              {session.deviceInfo || "Unknown Device"}
                              {index === 0 && <span className="text-[10px] bg-[#00b09b]/10 text-[#00b09b] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold border border-[#00b09b]/20">Current</span>}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              IP: {session.ipAddress || "Unknown"} • Last active: {new Date(session.updatedAt || session.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {index !== 0 && (
                          <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 shrink-0 h-10 rounded-lg font-semibold">
                            Revoke Access
                          </Button>
                        )}
                      </div>
                    )) : (
                      <p className="text-sm text-slate-500 text-center py-8">Loading sessions...</p>
                    )}
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

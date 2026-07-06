import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  User, Mail, Phone, Lock, LogOut, ShieldCheck, 
  Smartphone, Monitor, Eye, EyeOff, Save, CheckCircle2,
  Calendar, ShieldAlert, Key, Bell, Camera, ImagePlus, Globe, MapPin, Map, Clock, 
  Loader2, Trash2, Shield, Check, ChevronsUpDown
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import ApiClient from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", 
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
  "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", 
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
  "Fiji", "Finland", "France", 
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", 
  "Haiti", "Holy See", "Honduras", "Hungary", 
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", 
  "Jamaica", "Japan", "Jordan", 
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", 
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", 
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", 
  "Oman", 
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
  "Qatar", 
  "Romania", "Russia", "Rwanda", 
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", 
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", 
  "Vanuatu", "Venezuela", "Vietnam", 
  "Yemen", 
  "Zambia", "Zimbabwe"
];

export default function UserProfile() {
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [countryOpen, setCountryOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    country: user?.country || "",
    state: user?.state || "",
    city: user?.city || "",
    timezone: user?.timezone || "",
    language: user?.language || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    } else {
      fetchSessions();
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
        country: user?.country || "",
        state: user?.state || "",
        city: user?.city || "",
        timezone: user?.timezone || "",
        language: user?.language || "",
      });
    }
  }, [isAuthenticated, setLocation, user]);

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({ variant: "destructive", title: "Invalid File", description: "Only JPG, PNG and WEBP images are supported." });
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File Too Large", description: "Image size should be less than 5MB." });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const res = await ApiClient.post("/user/avatar", formData, {});
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        toast({ title: "Avatar Updated", description: "Your profile picture has been updated successfully." });
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: "Upload Failed", description: data.error || "Failed to upload image." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Error", description: "Something went wrong during upload." });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
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
    if (passwordData.newPassword.length < 8) {
      return toast({ variant: "destructive", title: "Weak Password", description: "Password must be at least 8 characters." });
    }
    
    setIsLoading(true);
    try {
      const res = await ApiClient.put("/user/update-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
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

  const handleRevokeSession = async (id: string) => {
    try {
      const res = await ApiClient.delete(`/user/sessions/${id}`);
      if (res.ok) {
        toast({ title: "Session Revoked", description: "Device has been disconnected." });
        setSessions(sessions.filter(s => s.id !== id));
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to revoke session." });
    }
  };

  const handleLogout = async () => {
    try {
      await ApiClient.post("/auth/logout");
      logout();
      toast({ title: "Logged Out", description: "You have been logged out successfully." });
      setLocation("/login");
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to log out." });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0A0A0A] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-muted transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card"></span>
            </button>
            <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => setShowLogoutConfirm(true)}>
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden backdrop-blur-xl"
            >
              {/* Card Banner with gradient */}
              <div className="h-32 w-full bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-8 pt-0 relative flex flex-col items-center">
                
                {/* Avatar with Camera Button */}
                <div className="relative -mt-16 mb-4 group">
                  <div className="w-32 h-32 rounded-full border-4 border-card shadow-xl overflow-hidden bg-muted relative flex items-center justify-center">
                    {isUploading ? (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-sm z-10">
                        <Loader2 className="animate-spin mb-1" size={24} />
                        <span className="text-xs font-semibold">{uploadProgress}%</span>
                      </div>
                    ) : null}
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center">
                        <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                          {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Button */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-1 right-1 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-card transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 z-20"
                  >
                    <Camera size={18} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/jpeg, image/png, image/webp" 
                    onChange={handleAvatarUpload}
                  />
                </div>

                <div className="text-center w-full">
                  <h2 className="text-2xl font-bold text-foreground mb-1 font-heading">{user.name || "User"}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {user.isVerified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium uppercase tracking-wider">
                      <User size={14} /> {user.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider">Member Since</p>
                        <p className="text-sm font-semibold text-foreground">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Shield size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider">Account Type</p>
                        <p className="text-sm font-semibold text-foreground">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider">Status</p>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Active</p>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </motion.div>
          </div>

          {/* Right Column - Tabs & Content */}
          <div className="lg:col-span-8 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              
              <TabsList className="w-full bg-card border border-border shadow-sm p-1 rounded-2xl h-auto flex flex-col sm:flex-row mb-6">
                <TabsTrigger value="personal" className="flex-1 rounded-xl py-3 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm transition-all text-sm font-medium">
                  <User className="w-4 h-4 mr-2" /> Personal Info
                </TabsTrigger>
                <TabsTrigger value="security" className="flex-1 rounded-xl py-3 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all text-sm font-medium">
                  <Lock className="w-4 h-4 mr-2" /> Security
                </TabsTrigger>
                <TabsTrigger value="sessions" className="flex-1 rounded-xl py-3 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all text-sm font-medium">
                  <Monitor className="w-4 h-4 mr-2" /> Active Sessions
                </TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal" className="mt-0 outline-none">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 sm:p-8 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <User size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
                      <p className="text-sm text-muted-foreground">Update your personal details and keep your profile up to date.</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <User size={16} />
                          </div>
                          <Input 
                            id="firstName" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-border/60 focus:border-emerald-500 focus:ring-emerald-500/20" 
                            placeholder="First Name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <User size={16} />
                          </div>
                          <Input 
                            id="lastName" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-border/60 focus:border-emerald-500 focus:ring-emerald-500/20" 
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Mail size={16} />
                        </div>
                        <Input 
                          id="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-border/60 focus:border-emerald-500 focus:ring-emerald-500/20" 
                          placeholder="Email Address"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 ml-1">You will need to use your new email to log in.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <Phone size={16} />
                          </div>
                          <Input 
                            id="phone" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-border/60 focus:border-emerald-500 focus:ring-emerald-500/20" 
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={countryOpen}
                              className={cn(
                                "h-12 w-full justify-between rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-border/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 pl-10 relative font-normal",
                                !formData.country && "text-muted-foreground"
                              )}
                            >
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground z-10">
                                <Globe size={16} />
                              </div>
                              <span className="truncate">
                                {formData.country || "Select country..."}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 sm:w-[350px]" align="start">
                            <Command>
                              <CommandInput placeholder="Search country..." />
                              <CommandEmpty>No country found.</CommandEmpty>
                              <CommandList className="max-h-60 overflow-auto">
                                <CommandGroup>
                                  {COUNTRIES.map((country) => (
                                    <CommandItem
                                      key={country}
                                      value={country}
                                      onSelect={() => {
                                        setFormData({ ...formData, country });
                                        setCountryOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          formData.country === country ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {country}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-0 outline-none">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 sm:p-8 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Password & Security</h2>
                      <p className="text-sm text-muted-foreground">Update your password and secure your account.</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Key size={16} />
                        </div>
                        <Input 
                          id="currentPassword" 
                          type={showCurrentPassword ? "text" : "password"} 
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="pl-10 pr-10 h-12 rounded-xl bg-slate-50/50 dark:bg-slate-900/50" 
                          required
                        />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Lock size={16} />
                        </div>
                        <Input 
                          id="newPassword" 
                          type={showNewPassword ? "text" : "password"} 
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="pl-10 pr-10 h-12 rounded-xl bg-slate-50/50 dark:bg-slate-900/50" 
                          required
                        />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground" onClick={() => setShowNewPassword(!showNewPassword)}>
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      
                      {/* Password Strength Meter - Simple */}
                      {passwordData.newPassword.length > 0 && (
                        <div className="pt-2">
                          <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${passwordData.newPassword.length > 3 ? 'bg-red-500' : ''} w-1/4 transition-all duration-300`}></div>
                            <div className={`h-full ${passwordData.newPassword.length > 5 ? 'bg-orange-500' : ''} w-1/4 transition-all duration-300`}></div>
                            <div className={`h-full ${passwordData.newPassword.length > 7 && /[A-Z]/.test(passwordData.newPassword) ? 'bg-yellow-500' : ''} w-1/4 transition-all duration-300`}></div>
                            <div className={`h-full ${passwordData.newPassword.length > 7 && /[A-Z]/.test(passwordData.newPassword) && /[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'bg-emerald-500' : ''} w-1/4 transition-all duration-300`}></div>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1.5 text-right">Must be at least 8 characters with uppercase & symbol</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <ShieldCheck size={16} />
                        </div>
                        <Input 
                          id="confirmPassword" 
                          type={showNewPassword ? "text" : "password"} 
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className={`pl-10 h-12 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 ${
                            passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'border-destructive focus:ring-destructive' : ''
                          }`} 
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword} 
                        className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 text-white font-semibold transition-all"
                      >
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </TabsContent>

              {/* Sessions Tab */}
              <TabsContent value="sessions" className="mt-0 outline-none">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 sm:p-8 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <Monitor size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Active Sessions</h2>
                        <p className="text-sm text-muted-foreground">Manage devices currently logged into your account.</p>
                      </div>
                    </div>
                    {sessions.length > 1 && (
                      <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 hidden sm:flex">
                        Revoke All Other Sessions
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {sessions.map((session, index) => {
                      const isCurrentSession = index === 0; // Assuming first is current, or backend could flag it
                      return (
                        <div key={session.id} className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border ${isCurrentSession ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-border/60 bg-slate-50/50 dark:bg-slate-900/30'} transition-all hover:shadow-md`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCurrentSession ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                              {session.deviceInfo?.toLowerCase().includes('mobile') ? <Smartphone size={20} /> : <Monitor size={20} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">{session.deviceInfo || 'Unknown Device'}</p>
                                {isCurrentSession && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><MapPin size={12} /> {session.ipAddress || 'Unknown IP'}</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(session.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          {!isCurrentSession && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRevokeSession(session.id)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={18} />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                    
                    {sessions.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No active sessions found.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl p-6 z-50"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <LogOut size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Confirm Logout</h3>
              <p className="text-muted-foreground mb-6">Are you sure you want to log out of your account? You will need to sign in again to access your profile.</p>
              
              <div className="flex items-center gap-3 justify-end">
                <Button variant="outline" className="rounded-xl" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
                <Button variant="destructive" className="rounded-xl" onClick={handleLogout}>Log Out</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

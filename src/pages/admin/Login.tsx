import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, 
  CloudLightning, Users, BarChart3, CheckCircle2, Lock, 
  ShieldAlert, Hexagon, Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "yuvrajpaajisardar@gmail.com",
      password: "admin123",
      rememberMe: false,
    },
  });

  const emailValue = watch("email");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data.email, data.password);
      login(response.user);
      toast({
        title: "Welcome back",
        description: "Successfully logged into the admin dashboard.",
      });
      setLocation("/admin/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans selection:bg-primary/30">
      
      {/* Left Side - Deep Space Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-card overflow-hidden flex-col justify-between p-12 xl:p-16 border-r border-border/10">
        
        {/* Abstract Aurora Glowing Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-teal-600/20 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute top-[10%] right-[-20%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[10%] w-[80%] h-[80%] bg-cyan-600/10 rounded-full blur-[150px] mix-blend-screen" />
        </div>
        
        <div className="relative z-10 text-foreground max-w-[600px] w-full mx-auto flex flex-col h-full justify-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col mb-12"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="relative flex items-center justify-center">
                <Hexagon className="text-teal-400 w-10 h-10 fill-teal-400/20" strokeWidth={1.5} />
                <div className="absolute w-4 h-4 bg-teal-300 rounded-sm rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold leading-none tracking-tight">Hakeem</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-teal-400 leading-tight">WORKSPACE</span>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 w-fit backdrop-blur-md">
              <ShieldCheck size={14} className="text-teal-400" />
              <span className="text-xs font-medium text-muted-foreground">Trusted by 25,000+ Businesses</span>
            </div>

            {/* Main Title */}
            <h1 className="text-[3.5rem] leading-[1.1] font-bold mb-6 tracking-tight">
              Manage Your Business <br />
              <span className="text-teal-400">Smarter</span>, <span className="text-cyan-400">Faster</span>, <span className="text-purple-400">Better</span>
            </h1>
            
            <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg mb-12">
              The all-in-one enterprise dashboard designed to help you grow, analyze and scale effortlessly.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-14">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-teal-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">Secure & Encrypted</h3>
                  <p className="text-xs text-muted-foreground font-medium">256-bit protection</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <CloudLightning size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">99.99% Uptime</h3>
                  <p className="text-xs text-muted-foreground font-medium">Reliable & Fast</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Users size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">Role Management</h3>
                  <p className="text-xs text-muted-foreground font-medium">Team & Permissions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <BarChart3 size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">Real-time Analytics</h3>
                  <p className="text-xs text-muted-foreground font-medium">Live Business Insights</p>
                </div>
              </div>
            </div>

            {/* CSS Dashboard Mockup */}
            <div className="relative w-full h-[220px] rounded-t-xl border border-border/10 bg-background p-4 overflow-hidden shadow-2xl flex flex-col opacity-90">
              <div className="absolute top-0 left-0 w-full h-8 bg-black/40 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-4 gap-3">
                {/* Mock Sidebar */}
                <div className="col-span-1 flex flex-col gap-2">
                  <div className="h-6 rounded bg-teal-500/20 w-3/4 mb-2"></div>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-4 rounded bg-white/5 w-full"></div>
                  ))}
                </div>
                {/* Mock Main Content */}
                <div className="col-span-3 flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col justify-center">
                      <div className="w-1/2 h-2 bg-white/20 rounded mb-2"></div>
                      <div className="w-3/4 h-4 bg-white/80 rounded"></div>
                    </div>
                    <div className="h-16 rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col justify-center">
                      <div className="w-1/2 h-2 bg-white/20 rounded mb-2"></div>
                      <div className="w-3/4 h-4 bg-white/80 rounded"></div>
                    </div>
                    <div className="h-16 rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col justify-center">
                      <div className="w-1/2 h-2 bg-white/20 rounded mb-2"></div>
                      <div className="w-3/4 h-4 bg-white/80 rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1 rounded-lg bg-white/5 border border-white/5 p-3 relative overflow-hidden">
                    <div className="w-1/3 h-2 bg-white/20 rounded mb-4"></div>
                    {/* Mock Chart Line */}
                    <svg className="absolute bottom-0 left-0 w-full h-[60%] text-teal-500" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,100 L0,80 L20,75 L40,85 L60,50 L80,30 L100,10 L100,100 Z" fill="currentColor" fillOpacity="0.1" />
                      <path d="M0,80 L20,75 L40,85 L60,50 L80,30 L100,10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="20" cy="75" r="2" fill="white" />
                      <circle cx="40" cy="85" r="2" fill="white" />
                      <circle cx="60" cy="50" r="2" fill="white" />
                      <circle cx="80" cy="30" r="2" fill="white" />
                      <circle cx="100" cy="10" r="2" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* Footer Users */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {['https://i.pravatar.cc/100?img=1', 'https://i.pravatar.cc/100?img=2', 'https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=4'].map((src, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-card bg-muted overflow-hidden shadow-lg">
                    <img src={src} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-500 mb-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <span className="text-xs text-muted-foreground font-medium">Loved by 10,000+ users worldwide</span>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background">
        
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        {/* Mobile Branding (only visible on small screens) */}
        <div className="absolute top-6 left-6 z-20 lg:hidden flex items-center gap-2">
          <Hexagon className="text-teal-500 w-6 h-6 fill-teal-500/20" strokeWidth={2} />
          <span className="font-bold text-foreground tracking-tight">Hakeem</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] relative z-10"
        >
          <div className="bg-card border border-border shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
                <Lock className="text-teal-500 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Welcome Back 👋</h2>
                <p className="text-sm text-muted-foreground font-medium">Sign in to continue to your dashboard</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full bg-background border ${
                      errors.email ? "border-destructive focus:ring-destructive/20" : "border-input focus:border-teal-500 focus:ring-teal-500/20"
                    } rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm`}
                    placeholder="yuvrajpaajisardar@gmail.com"
                  />
                  {isEmailValid && !errors.email && (
                    <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500" />
                  )}
                </div>
                {errors.email && <p className="text-destructive text-xs font-medium mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Password</label>
                  <a href="#" className="text-xs text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 font-semibold transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full bg-background border pl-10 pr-12 ${
                      errors.password ? "border-destructive focus:ring-destructive/20" : "border-input focus:border-teal-500 focus:ring-teal-500/20"
                    } rounded-xl py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm font-medium tracking-wider`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs font-medium mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center pt-1 pb-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="peer appearance-none w-5 h-5 border-2 border-input rounded bg-background checked:bg-teal-500 checked:border-teal-500 transition-all cursor-pointer shadow-sm"
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Remember me for 30 days
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-teal-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:bg-teal-700 hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed group shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-semibold">OR</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button className="flex items-center justify-center gap-2 bg-background border border-border hover:bg-accent/50 text-foreground font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-background border border-border hover:bg-accent/50 text-foreground font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm">
                <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 10H0V0H10V10Z" fill="#F25022"/>
                  <path d="M21 10H11V0H21V10Z" fill="#7FBA00"/>
                  <path d="M10 21H0V11H10V21Z" fill="#00A4EF"/>
                  <path d="M21 21H11V11H21V21Z" fill="#FFB900"/>
                </svg>
                Sign in with Microsoft
              </button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-background border border-border hover:bg-accent/50 text-foreground font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm mb-8">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              Sign in with GitHub
            </button>

            {/* Security Badges */}
            <div className="flex flex-col sm:flex-row gap-4 bg-accent/20 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
                  <Lock size={14} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">256-bit Encryption</h4>
                  <p className="text-[10px] text-muted-foreground font-medium">Your data is 100% secure</p>
                </div>
              </div>
              <div className="hidden sm:block w-px bg-border"></div>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <ShieldAlert size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">SSL Secured</h4>
                  <p className="text-[10px] text-muted-foreground font-medium">Protected by SSL</p>
                </div>
              </div>
            </div>

          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground font-medium gap-4">
            <p>© 2025 Hakeem Workspace. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <span className="ml-2 text-foreground/50">v2.5.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

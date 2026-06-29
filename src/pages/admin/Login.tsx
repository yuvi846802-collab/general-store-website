import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Store, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

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
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data.email, data.password);
      login(response.user, response.token);
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
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Luxury Branding Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 overflow-hidden items-center justify-center p-12">
        {/* Dynamic Abstract Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full blur-[140px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/30 rounded-full blur-[140px] mix-blend-screen" />
        
        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex bg-white/10 p-4 rounded-2xl mb-8 backdrop-blur-md border border-white/10 shadow-2xl">
              <Store className="text-blue-400 w-10 h-10" />
            </div>
            <h1 className="text-5xl font-heading font-bold mb-6 leading-tight">
              Manage your commerce empire with precision.
            </h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed mb-12">
              The all-in-one enterprise dashboard designed for growth, speed, and beautiful insights.
            </p>
            
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800" />
                ))}
              </div>
              <p>Trusted by 10,000+ top tier merchants</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background">
        {/* Mobile Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full lg:hidden overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden mb-8 text-center flex flex-col items-center">
            <div className="inline-flex bg-primary/10 p-3 rounded-2xl mb-4 text-primary">
              <Store className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your dashboard account</p>
          </div>

          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full bg-background border ${
                      errors.email ? "border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
                    } rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm`}
                    placeholder="admin@hakeemstore.com"
                  />
                </div>
                {errors.email && <p className="text-destructive text-xs font-medium">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Password</label>
                  <a href="#" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full bg-background border ${
                      errors.password ? "border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
                    } rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm`}
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
                {errors.password && <p className="text-destructive text-xs font-medium">{errors.password.message}</p>}
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="peer appearance-none w-5 h-5 border-2 border-input rounded bg-background checked:bg-primary checked:border-primary transition-all cursor-pointer"
                    />
                    <svg className="absolute w-3 h-3 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                className="w-full relative overflow-hidden bg-primary text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowRight size={16} className="rotate-180" />
              Back to Storefront
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

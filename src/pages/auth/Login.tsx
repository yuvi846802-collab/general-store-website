import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, Link } from 'wouter';
import { useAuthStore } from '@/store/authStore';
import ApiClient from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const setAuth = useAuthStore(state => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.post('/auth/login', data);
      const resData = await res.json();
      
      if (!res.ok) {
        throw new Error(resData.error || resData.message || 'Login failed');
      }

      setAuth(resData.user, resData.accessToken);
      toast.success('Successfully logged in!');
      setLocation(resData.user.role === 'ADMIN' || resData.user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/profile');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-2xl border border-border/50 backdrop-blur-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Hakeem Store account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password">
                <span className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</span>
              </Link>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-semibold rounded-xl" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link href="/register">
            <span className="text-primary hover:underline font-semibold cursor-pointer">Create one</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

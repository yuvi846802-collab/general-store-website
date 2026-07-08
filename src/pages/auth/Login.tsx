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
import { Loader2, ArrowRight } from 'lucide-react';
import { OtpInput } from '@/components/ui/OtpInput';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [otpError, setOtpError] = useState(false);
  
  const [, setLocation] = useLocation();
  const setAuth = useAuthStore(state => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onRequestOtp = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.post('/auth/login', data);
      const resData = await res.json();
      
      if (!res.ok) {
        throw new Error(resData.error || resData.message || 'Login failed');
      }

      setIdentifier(data.identifier);
      setIsOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError(true);
      toast.error('OTP must be 6 digits');
      return;
    }
    
    setIsLoading(true);
    setOtpError(false);
    try {
      const res = await ApiClient.post('/auth/verify-otp', { 
        identifier, 
        purpose: 'LOGIN', 
        otp 
      });
      const resData = await res.json();
      
      if (!res.ok) {
        setOtpError(true);
        throw new Error(resData.error || resData.message || 'Invalid OTP');
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

  const onResendOtp = async () => {
    try {
      const res = await ApiClient.post('/auth/resend-otp', { identifier, purpose: 'LOGIN' });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || resData.message || 'Failed to resend OTP');
      toast.success('OTP resent successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background/50">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-3xl shadow-2xl shadow-primary/5 border border-border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Sign in to your Hakeem Store account securely</p>
        </div>

        {!isOtpSent ? (
          <form onSubmit={handleSubmit(onRequestOtp)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Phone Number</Label>
                <Input 
                  id="identifier" 
                  type="text" 
                  placeholder="you@example.com or +91..." 
                  {...register('identifier')}
                  className={`h-12 ${errors.identifier ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.identifier && <p className="text-xs text-destructive">{errors.identifier.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password">
                    <span className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</span>
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  {...register('password')}
                  className={`h-12 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-medium rounded-xl group" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                <span className="flex items-center">
                  Continue <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={onVerifyOtp} className="space-y-8">
             <div className="space-y-4 text-center">
              <Label className="text-base text-muted-foreground">We sent a secure code to<br/><strong className="text-foreground">{identifier}</strong></Label>
              <div className="pt-4">
                <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={isLoading} />
              </div>
            </div>
            
            <div className="space-y-4">
              <Button type="submit" className="w-full h-12 text-lg font-medium rounded-xl" disabled={isLoading || otp.length !== 6}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Verify & Login'}
              </Button>
              
              <div className="flex justify-between text-sm">
                <Button type="button" variant="link" className="text-muted-foreground p-0 h-auto" onClick={() => setIsOtpSent(false)} disabled={isLoading}>
                  Change Email/Phone
                </Button>
                <Button type="button" variant="link" className="text-primary p-0 h-auto font-medium" onClick={onResendOtp} disabled={isLoading}>
                  Resend Code
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{' '}
          <Link href="/register">
            <span className="text-primary hover:underline font-medium cursor-pointer">Create one</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

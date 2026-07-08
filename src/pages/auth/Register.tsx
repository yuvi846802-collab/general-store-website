import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, Link } from 'wouter';
import ApiClient from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { OtpInput } from '@/components/ui/OtpInput';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupValues = z.infer<typeof signupSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  
  // Track identifier (email or phone) for OTP verification
  const [identifier, setIdentifier] = useState('');
  
  const [, setLocation] = useLocation();
  const setAuth = useAuthStore(state => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmitSignup = async (data: SignupValues) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.post('/auth/signup', data);
      const resData = await res.json();
      
      if (!res.ok) {
        throw new Error(resData.error || resData.message || 'Registration failed');
      }

      setIdentifier(data.email); // We'll verify using email, although phone was also sent an OTP.
      setIsOtpSent(true);
      toast.success('OTP sent successfully to your email and phone!');
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
        purpose: 'SIGNUP', 
        otp 
      });
      const resData = await res.json();
      
      if (!res.ok) {
        setOtpError(true);
        throw new Error(resData.error || resData.message || 'Invalid OTP');
      }

      setAuth(resData.user, resData.accessToken);
      toast.success('Account created successfully!');
      setLocation('/profile');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    try {
      const res = await ApiClient.post('/auth/resend-otp', { identifier, purpose: 'SIGNUP' });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || resData.message || 'Failed to resend OTP');
      toast.success('OTP resent successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background/50">
      <div className="w-full max-w-xl p-8 space-y-8 bg-card rounded-3xl shadow-2xl shadow-primary/5 border border-border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-muted-foreground">Join Hakeem Store and start shopping today</p>
        </div>

        {!isOtpSent ? (
          <form onSubmit={handleSubmit(onSubmitSignup)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  type="text" 
                  placeholder="John" 
                  {...register('firstName')}
                  className={`h-11 ${errors.firstName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  type="text" 
                  placeholder="Doe" 
                  {...register('lastName')}
                  className={`h-11 ${errors.lastName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  {...register('email')}
                  className={`h-11 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="text" 
                  placeholder="+91..." 
                  {...register('phone')}
                  className={`h-11 ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  {...register('password')}
                  className={`h-11 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  {...register('confirmPassword')}
                  className={`h-11 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-medium rounded-xl group" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                <span className="flex items-center">
                  Create Account <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
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
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Verify & Complete'}
              </Button>
              
              <div className="flex justify-between text-sm">
                <Button type="button" variant="link" className="text-muted-foreground p-0 h-auto" onClick={() => setIsOtpSent(false)} disabled={isLoading}>
                  Change Details
                </Button>
                <Button type="button" variant="link" className="text-primary p-0 h-auto font-medium" onClick={onResendOtp} disabled={isLoading}>
                  Resend Code
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link href="/login">
            <span className="text-primary hover:underline font-medium cursor-pointer">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

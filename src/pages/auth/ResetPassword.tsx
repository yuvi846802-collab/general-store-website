import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRoute, useLocation, Link } from 'wouter';
import ApiClient from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [match, params] = useRoute('/reset-password/:token');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  if (!match || !params?.token) {
    return <div className="p-20 text-center">Invalid or missing reset token.</div>;
  }

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.post('/auth/reset-password', {
        token: params.token,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      const resData = await res.json();
      
      if (!res.ok) throw new Error(resData.error || resData.message || 'Failed to reset password');
      
      setIsSuccess(true);
      toast.success('Password successfully reset!');
      setTimeout(() => setLocation('/login'), 3000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-2xl border border-border/50 backdrop-blur-xl">
        {isSuccess ? (
          <div className="text-center space-y-4 py-8">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-2xl font-bold">Password Reset</h1>
            <p className="text-muted-foreground">Your password has been successfully reset. Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Set New Password</h1>
              <p className="text-muted-foreground">Create a strong new password for your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} className={errors.password ? 'border-destructive' : ''} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} className={errors.confirmPassword ? 'border-destructive' : ''} />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold rounded-xl" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Reset Password'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

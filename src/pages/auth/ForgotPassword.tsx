import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'wouter';
import ApiClient from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<{email: string}>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: {email: string}) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.post('/auth/forgot-password', data);
      const resData = await res.json();
      
      if (!res.ok) throw new Error(resData.error || resData.message || 'Failed to send token');
      
      setIsSent(true);
      toast.success('Password reset link sent to your email.');
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
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground">
            {isSent ? "Check your email for the reset link" : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-semibold rounded-xl" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <Button variant="outline" className="w-full h-12 text-lg rounded-xl" onClick={() => setIsSent(false)}>
            Try another email
          </Button>
        )}

        <div className="text-center text-sm text-muted-foreground mt-6">
          Remember your password?{' '}
          <Link href="/login">
            <span className="text-primary hover:underline font-semibold cursor-pointer">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

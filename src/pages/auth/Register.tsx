import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, Link } from 'wouter';
import ApiClient from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false }
  });

  const acceptTerms = watch('acceptTerms');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.post('/auth/register', data);
      const resData = await res.json();
      
      if (!res.ok) {
        throw new Error(resData.error || resData.message || 'Registration failed');
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      setLocation('/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background py-12">
      <div className="w-full max-w-xl p-8 space-y-6 bg-card rounded-2xl shadow-2xl border border-border/50 backdrop-blur-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
          <p className="text-muted-foreground">Join Hakeem Store today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register('firstName')} className={errors.firstName ? 'border-destructive' : ''} />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register('lastName')} className={errors.lastName ? 'border-destructive' : ''} />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" {...register('phone')} className={errors.phone ? 'border-destructive' : ''} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} className={errors.password ? 'border-destructive' : ''} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} className={errors.confirmPassword ? 'border-destructive' : ''} />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean, { shouldValidate: true })} />
            <Label htmlFor="terms" className="text-sm font-normal">
              I accept the <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a>
            </Label>
          </div>
          {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>}

          <Button type="submit" className="w-full h-12 text-lg font-semibold rounded-xl mt-4" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Create Account'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login">
            <span className="text-primary hover:underline font-semibold cursor-pointer">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

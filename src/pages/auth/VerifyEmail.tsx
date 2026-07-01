import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import ApiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link. Missing token or email.');
      return;
    }

    const verify = async () => {
      try {
        const res = await ApiClient.post('/auth/verify-email', { token, email });
        const data = await res.json();
        
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email successfully verified!');
        } else {
          setStatus('error');
          setMessage(data.error || data.message || 'Verification failed');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'An error occurred during verification');
      }
    };

    verify();
  }, [token, email]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-2xl border border-border/50 backdrop-blur-xl text-center">
        {status === 'loading' && (
          <div className="space-y-4 py-8">
            <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h1 className="text-2xl font-bold">Verifying Email</h1>
            <p className="text-muted-foreground">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Account Verified!</h1>
            <p className="text-muted-foreground">{message}</p>
            <Link href="/login">
              <Button className="mt-4 w-full h-12 text-lg rounded-xl">Proceed to Login</Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-8">
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Verification Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            <Link href="/login">
              <Button variant="outline" className="mt-4 w-full h-12 text-lg rounded-xl">Back to Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

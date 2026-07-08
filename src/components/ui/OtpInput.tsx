import React, { useState, useRef, KeyboardEvent, ClipboardEvent, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({ length = 6, value, onChange, error, disabled, className }: OtpInputProps) {
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const newValues = value.split('').slice(0, length);
    while (newValues.length < length) newValues.push('');
    setOtpValues(newValues);
  }, [value, length]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, ''); // only allow numbers
    if (!val) return;

    const newOtp = [...otpValues];
    newOtp[index] = val.slice(-1); // Take only the last character if multiple are typed somehow
    
    const combinedValue = newOtp.join('');
    onChange(combinedValue);
    
    if (val && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otpValues];
      
      if (otpValues[index]) {
        newOtp[index] = '';
        onChange(newOtp.join(''));
      } else if (index > 0) {
        newOtp[index - 1] = '';
        onChange(newOtp.join(''));
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (!pastedData) return;

    const newOtp = [...otpValues];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    onChange(newOtp.join(''));
    
    const focusIndex = Math.min(pastedData.length, length - 1);
    focusInput(focusIndex);
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {otpValues.map((digit, index) => (
        <input
          key={index}
          ref={el => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={cn(
            "w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none",
            "focus:ring-4 focus:ring-primary/20",
            error 
              ? "border-destructive text-destructive focus:border-destructive animate-shake" 
              : "border-border focus:border-primary",
            disabled ? "opacity-50 cursor-not-allowed bg-muted" : "bg-background"
          )}
        />
      ))}
    </div>
  );
}

import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-[#0F0F0F] shadow-[0_1px_2px_rgba(0,0,0,0.05)] placeholder-black/30 outline-none transition-all duration-120 focus-within:border-[#1B3A6B] focus-within:ring-2 focus-within:ring-[#EEF3FB] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

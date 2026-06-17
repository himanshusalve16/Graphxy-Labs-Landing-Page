import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'brand', 
  size = 'md', 
  children, 
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-full line-height-none transition-all duration-120 ease-[cubic-bezier(0.16,1,0.3,1)] select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-[#1B3A6B] text-white shadow-[0_2px_8px_rgba(27,58,107,0.22)] hover:bg-[#2B52A0] hover:shadow-[0_4px_14px_rgba(27,58,107,0.28)] hover:-translate-y-0.5 focus-visible:ring-[#1B3A6B]":
            variant === 'brand',
          "bg-[#0066CC] text-white shadow-[0_2px_8px_rgba(0,102,204,0.22)] hover:bg-[#0057AA] hover:shadow-[0_4px_14px_rgba(0,102,204,0.30)] hover:-translate-y-0.5 focus-visible:ring-[#0066CC]":
            variant === 'graphzy',
          "bg-[#92400E] text-white shadow-[0_2px_8px_rgba(146,64,14,0.22)] hover:bg-[#B45309] hover:shadow-[0_4px_14px_rgba(146,64,14,0.28)] hover:-translate-y-0.5 focus-visible:ring-[#92400E]":
            variant === 'forkline',
          "bg-white text-[#0F0F0F] border border-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-black/20 hover:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 focus-visible:ring-[#1B3A6B]":
            variant === 'secondary',
          "bg-transparent text-[#525252] border border-black/5 hover:border-black/15 hover:text-[#0F0F0F]":
            variant === 'outline',
          "bg-transparent text-[#1B3A6B] p-0 rounded-none hover:underline hover:underline-offset-4 active:scale-100":
            variant === 'ghost',
        },
        {
          "text-xs px-4 py-2": size === 'sm',
          "text-sm px-5 py-2.5": size === 'md',
          "text-base px-6 py-3.5": size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

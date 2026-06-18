import React from 'react';
import { cn } from '../../utils/cn';

export const Tag = React.forwardRef(({ className, variant = 'brand', children, ...props }, ref) => {
  const variantClasses = {
    math: 'bg-[#EBF3FF] text-[#0066CC] border-[#0066CC]/10',
    chem: 'bg-[#E8F5EE] text-[#1E8A4A] border-[#1E8A4A]/10',
    bio: 'bg-[#FEF3E6] text-[#B85C00] border-[#B85C00]/10',
    phys: 'bg-[#F2ECFB] text-[#6B3FA0] border-[#6B3FA0]/10',
    forkline: 'bg-[#FEF7EC] text-[#92400E] border-[#92400E]/10',
    brand: 'bg-[#EEF3FB] text-[#1B3A6B] border-[#1B3A6B]/10',
    clampbox: 'bg-[#F0F7F7] text-[#0D9488] border-[#0D9488]/10',
  };

  const dotClasses = {
    math: 'bg-[#0066CC]',
    chem: 'bg-[#1E8A4A]',
    bio: 'bg-[#B85C00]',
    phys: 'bg-[#6B3FA0]',
    forkline: 'bg-[#92400E]',
    brand: 'bg-[#1B3A6B]',
    clampbox: 'bg-[#0D9488]',
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold font-mono tracking-wider uppercase",
        variantClasses[variant] || variantClasses.brand,
        className
      )}
      {...props}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotClasses[variant] || dotClasses.brand)} />
      {children}
    </span>
  );
});

Tag.displayName = 'Tag';

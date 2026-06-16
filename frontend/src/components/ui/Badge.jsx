import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black/5 bg-white font-mono text-[10px] font-semibold tracking-wider uppercase text-black/40",
        className
      )}
      {...props}
    >
      <span className="w-1.25 h-1.25 rounded-full bg-black/40" />
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

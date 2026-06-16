import React from 'react';
import { cn } from '../../utils/cn';

export const Card = React.forwardRef(({ className, variant = 'surface', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        {
          "bg-white border border-black/[0.06] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)]":
            variant === 'surface',
          "bg-white/85 backdrop-blur-md border border-white/75 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]":
            variant === 'glass',
          "bg-white border border-black/[0.06] rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.07)]":
            variant === 'raised',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

import React from 'react';
import { cn } from '../../utils/cn';

export const Divider = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <hr
      ref={ref}
      className={cn("h-[1px] bg-black/[0.06] border-none", className)}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';

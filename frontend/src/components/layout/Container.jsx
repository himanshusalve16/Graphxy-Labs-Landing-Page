import React from 'react';
import { cn } from '../../utils/cn';

export default function Container({ className, children, ...props }) {
  return (
    <div
      className={cn("max-w-6xl mx-auto px-6 md:px-10 w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

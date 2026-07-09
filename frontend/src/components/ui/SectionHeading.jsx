import React from 'react';
import { cn } from '../../utils/cn';

export const SectionHeading = React.forwardRef(({ 
  className, 
  eyebrow, 
  heading, 
  description,
  align = 'left',
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col mb-8 md:mb-12",
        {
          "items-start text-left": align === 'left',
          "items-center text-center": align === 'center',
        },
        className
      )}
      {...props}
    >
      {eyebrow && (
        <div className="font-mono text-[10px] font-medium tracking-[0.10em] uppercase text-black/40 mb-2">
          {eyebrow}
        </div>
      )}
      {heading && (
        <h2 className="font-serif text-[24px] sm:text-[28px] md:text-[32px] leading-tight tracking-[-0.015em] text-[#0F0F0F] max-w-lg">
          {heading}
        </h2>
      )}
      {description && (
        <p className="text-[#525252] text-sm md:text-base leading-relaxed mt-4 max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
});

SectionHeading.displayName = 'SectionHeading';

import React from 'react';
import { Tag } from '../ui/Tag';

export default function ForklineHero() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
      <Tag variant="forkline" className="mb-6">COMING SOON</Tag>
      <h1 className="font-serif text-[34px] md:text-[48px] font-light leading-[1.15] tracking-[-0.022em] text-[#0F0F0F] mb-4">
        Forkline - Restaurant Operations Platform
      </h1>
      <p className="text-sm md:text-base text-[#525252] leading-[1.68] max-w-md">
        An upcoming restaurant operations and billing engine engineered for Indian dine-ins, cafes, and quick-service hubs. Designed to eliminate expensive POS hardware lock-ins, coordinate tables with KOT displays, auto-calculate CGST/SGST, and capture dining margins automatically. Join the waitlist below.
      </p>
    </div>
  );
}

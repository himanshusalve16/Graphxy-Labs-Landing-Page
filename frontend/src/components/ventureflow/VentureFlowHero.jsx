import React from 'react';
import { Tag } from '../ui/Tag';

export default function VentureFlowHero() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
      <Tag variant="brand" className="mb-6">Early Concept</Tag>
      <h1 className="font-serif text-[34px] md:text-[48px] font-light leading-[1.15] tracking-[-0.022em] text-[#0F0F0F] mb-4">
        VentureFlow Startup Operating System
      </h1>
      <p className="text-sm md:text-base text-[#525252] leading-[1.68] max-w-md">
        An upcoming SaaS operating system built to streamline early-stage fundraising operations, track investor interactions, and coordinate CRM deal stages. Register your email for early exploration updates.
      </p>
    </div>
  );
}

import React from 'react';
import { Tag } from '../ui/Tag';

export default function ClampboxHero() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
      <Tag variant="clampbox" className="mb-6">COMING SOON</Tag>
      <h1 className="font-serif text-[34px] md:text-[48px] font-light leading-[1.15] tracking-[-0.022em] text-[#0F0F0F] mb-4">
        Clampbox - Confidential Execution Infrastructure
      </h1>
      <p className="text-sm md:text-base text-[#525252] leading-[1.68] max-w-md">
        AI infrastructure that doesn't leak. An upcoming confidential execution layer for AI workloads, agents, and sensitive data. Run workloads inside hardware-attested, isolated CPU enclaves with zero host access. Join the waitlist below.
      </p>
    </div>
  );
}

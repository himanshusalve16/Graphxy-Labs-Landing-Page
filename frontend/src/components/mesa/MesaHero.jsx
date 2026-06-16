import React from 'react';
import { Tag } from '../ui/Tag';

export default function MesaHero() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
      <Tag variant="serva" className="mb-6">Concept Preview</Tag>
      <h1 className="font-serif text-[34px] md:text-[48px] font-light leading-[1.15] tracking-[-0.022em] text-[#0F0F0F] mb-4">
        Mesa Restaurant Operating System
      </h1>
      <p className="text-sm md:text-base text-[#525252] leading-[1.68] max-w-md">
        An upcoming restaurant operating system designed to eliminate hardware lock-ins, synchronize floor tables with kitchen monitors, and capture margins automatically. Join the preview waitlist below.
      </p>
    </div>
  );
}

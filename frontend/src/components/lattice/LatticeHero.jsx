import React from 'react';
import { Tag } from '../ui/Tag';

export default function LatticeHero() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
      <Tag variant="brand" className="mb-6">COMING SOON</Tag>
      <h1 className="font-serif text-[34px] md:text-[48px] font-light leading-[1.15] tracking-[-0.022em] text-[#0F0F0F] mb-4">
        Lattice - Startup Operations Platform
      </h1>
      <p className="text-sm md:text-base text-[#525252] leading-[1.68] max-w-md">
        An upcoming structured workspace for startup execution and operational clarity. Lattice coordinates fundraising CRM pipelines, pitch deck telemetry, roadmap execution, and team workflows into a single dashboard. Register your email for early exploration updates.
      </p>
    </div>
  );
}

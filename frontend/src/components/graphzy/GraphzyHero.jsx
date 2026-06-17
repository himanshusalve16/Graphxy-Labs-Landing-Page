import React from 'react';
import { Tag } from '../ui/Tag';

export default function GraphzyHero() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
      <Tag variant="math" className="mb-6">Interactive Prototype • Under Active Development</Tag>
      <h1 className="font-serif text-[36px] md:text-[48px] font-light leading-[1.2] tracking-[-0.015em] text-[#0F0F0F] mb-4">
        Type a STEM concept to visualize it.
      </h1>
      <p className="text-sm md:text-base text-[#525252] leading-[1.6] max-w-lg">
        Graphzy translates natural language queries into interactive STEM animations, equations, physics models, and chemical structures. (Prototype Mockup)
      </p>
    </div>
  );
}

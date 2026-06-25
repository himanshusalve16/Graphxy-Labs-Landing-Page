import React from 'react';
import { Tag } from '../ui/Tag';

export default function ClampboxHero() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
      <Tag variant="clampbox" className="mb-6">ACTIVE PRODUCT</Tag>
      <h1 className="font-serif text-[34px] md:text-[48px] font-light leading-[1.15] tracking-[-0.022em] text-[#0F0F0F] mb-4">
        Clampbox — AI Security Gateway
      </h1>
      <p className="text-sm md:text-base text-[#525252] leading-[1.68] max-w-md">
        An enterprise-grade governance layer sitting between your users, applications, and external LLM providers. Inspect prompts, detect API keys and secrets, redact sensitive data spans, and compile immutable audit logs in real time.
      </p>
    </div>
  );
}

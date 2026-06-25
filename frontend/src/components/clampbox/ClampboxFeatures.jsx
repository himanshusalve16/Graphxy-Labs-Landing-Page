import React from 'react';
import { Card } from '../ui/Card';

export default function ClampboxFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-16 max-w-4xl mx-auto">
      <Card variant="surface" className="p-8 bg-white border-[#0D9488]/14 hover:border-[#0D9488]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Prompt & Secret Scanning</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Scan LLM submissions for API keys, AWS credentials, SSH keys, private database links, and proprietary source code fragments.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#0D9488]/14 hover:border-[#0D9488]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Dynamic Policy Engine</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Configure rule priorities and enforcement actions (Allow, Warn, Redact, Block) tailored to organizations, specific providers, or user contexts.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#0D9488]/14 hover:border-[#0D9488]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Immutable Compliance Audit</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Write secure telemetry records including policy execution logs, detection counts, and prompt hashes suitable for SOC 2 reviews.
        </p>
      </Card>
    </div>
  );
}

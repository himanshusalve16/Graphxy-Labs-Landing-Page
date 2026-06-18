import React from 'react';
import { Card } from '../ui/Card';

export default function ClampboxFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-16 max-w-4xl mx-auto">
      <Card variant="surface" className="p-8 bg-white border-[#0D9488]/14 hover:border-[#0D9488]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Hardware Enclaves</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Run workloads in fully isolated CPU enclaves (AWS Nitro, Intel SGX) that block host OS, hypervisor, and operator visibility.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#0D9488]/14 hover:border-[#0D9488]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Zero-Knowledge Agents</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Deploy autonomous AI agents that process sensitive API keys, user databases, and prompts without ever exposing them to host nodes.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#0D9488]/14 hover:border-[#0D9488]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Memory Encryption</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Cryptographically seal RAM with hardware-managed keys, preventing side-channel memory scraping and cold-boot attacks.
        </p>
      </Card>
    </div>
  );
}

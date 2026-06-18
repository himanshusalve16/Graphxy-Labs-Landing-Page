import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import ClampboxHero from '../components/clampbox/ClampboxHero';
import ClampboxWaitlist from '../components/clampbox/ClampboxWaitlist';
import ClampboxFeatures from '../components/clampbox/ClampboxFeatures';
import ClampboxBenefits from '../components/clampbox/ClampboxBenefits';
import { Card } from '../components/ui/Card';
import { Shield, Lock, Cpu, Server } from 'lucide-react';
import { ClampboxPreview } from '../components/sections/ProductShowcase';

export default function Clampbox() {
  return (
    <PageShell>
      {/* Background Mesh Overlays */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        {/* Glow textures and radial meshes */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#0D9488]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#1B3A6B]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        {/* Sub-section grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808026_1px,transparent_1px),linear-gradient(to_bottom,#80808026_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <ClampboxHero />
            <ClampboxWaitlist />
            
            {/* Rich Interactive Enclave Mockup directly on the page */}
            <div className="w-full max-w-md mt-16 animate-fade-in">
              <ClampboxPreview />
            </div>

            <ClampboxFeatures />
            
            <div className="w-full mt-24">
              <div className="text-center mb-10 max-w-lg mx-auto">
                <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Infrastructure Grade</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mt-2 mb-3 font-light">Execution that doesn't compromise.</h2>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Clampbox guarantees that your data, prompts, model weights, and execution steps are cryptographically secure, fully isolated, and mathematically private.
                </p>
              </div>
              <ClampboxBenefits />
            </div>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}

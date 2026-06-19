import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import ForklineHero from '../components/forkline/ForklineHero';
import WaitlistForm from '../components/ui/WaitlistForm';
import ForklineFeatures from '../components/forkline/ForklineFeatures';
import ForklineBenefits from '../components/forkline/ForklineBenefits';
import { Card } from '../components/ui/Card';
import { Clock } from 'lucide-react';
import { ForklinePreview } from '../components/sections/ProductShowcase';

export default function Forkline() {
  return (
    <PageShell>
      {/* Background Mesh Overlays */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        {/* Glow textures and radial meshes */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#B45309]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#1B3A6B]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        {/* Sub-section grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808026_1px,transparent_1px),linear-gradient(to_bottom,#80808026_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <ForklineHero />
            <WaitlistForm product="Forkline" />

            
            {/* Rich Interactive Floor Map Mockup directly on the page */}
            <div className="w-full max-w-md mt-16 animate-fade-in">
              <ForklinePreview />
            </div>

            <ForklineFeatures />
            
            <div className="w-full mt-24">
              <div className="text-center mb-10 max-w-lg mx-auto">
                <span className="font-mono text-[9px] font-bold text-[#92400E] uppercase tracking-wider">Ecosystem Values</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mt-2 mb-3 font-light">Built for modern hospitality.</h2>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Forkline is designed to eliminate operational friction, optimize table rotation speeds, and protect restaurant labor margins.
                </p>
              </div>
              <ForklineBenefits />
            </div>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}

import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import PageBackground from '../components/layout/PageBackground';
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
      <div className="relative overflow-hidden bg-[#FAFAF8] py-12 sm:py-16 md:py-24 border-b border-black/[0.04]">
        <PageBackground />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <ForklineHero />
            
            {/* Rich Interactive Floor Map Mockup directly on the page */}
            <div className="w-full max-w-md mt-10 md:mt-16 animate-fade-in">
              <ForklinePreview />
            </div>

            <ForklineFeatures />
            
            <div className="w-full mt-12 md:mt-20">
              <div className="text-center mb-10 max-w-lg mx-auto">
                <span className="font-mono text-[9px] font-bold text-[#92400E] uppercase tracking-wider">Ecosystem Values</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mt-2 mb-3 font-light">Built for modern hospitality.</h2>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Forkline is designed to eliminate operational friction, optimize table rotation speeds, and protect restaurant labor margins.
                </p>
              </div>
              <ForklineBenefits />
            </div>

            {/* Waitlist Form Section at the bottom */}
            <div className="w-full max-w-md mt-10 md:mt-16 flex flex-col items-center">
              <div className="w-full flex items-center gap-3 my-4 text-[#A3A3A3] font-mono text-[9px] uppercase tracking-wider select-none">
                <div className="h-[1px] bg-black/5 flex-1" />
                <span>Join the waitlist</span>
                <div className="h-[1px] bg-black/5 flex-1" />
              </div>
              <WaitlistForm product="Forkline" />
            </div>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}

import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import LatticeHero from '../components/lattice/LatticeHero';
import LatticeWaitlist from '../components/lattice/LatticeWaitlist';
import LatticeFeatures from '../components/lattice/LatticeFeatures';
import { Card } from '../components/ui/Card';
import { Sparkles, TrendingUp, Check } from 'lucide-react';
import { LatticePreview } from '../components/sections/ProductShowcase';

export default function Lattice() {
  return (
    <PageShell>
      {/* Background Mesh Overlays */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        {/* Glow textures and radial meshes */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#1B3A6B]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#0066CC]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        {/* Sub-section grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808026_1px,transparent_1px),linear-gradient(to_bottom,#80808026_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <LatticeHero />
            <LatticeWaitlist />
            
            {/* Rich Interactive CRM/Pipeline Mockup directly on the page */}
            <div className="w-full max-w-md mt-16 animate-fade-in">
              <LatticePreview />
            </div>

            <LatticeFeatures />
            
            <div className="w-full mt-24">
              <div className="text-center mb-10 max-w-lg mx-auto">
                <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Operational Core</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mt-2 mb-3 font-light">Eliminate fundraising chaos.</h2>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Lattice is built to replace disconnected spreadsheets, disorganized pitch deck links, and unmonitored investor outreach.
                </p>
              </div>
              
              {/* Extra benefit cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-12 max-w-4xl mx-auto">
                <Card variant="surface" className="p-8 bg-white border-[#1B3A6B]/10 shadow-sm hover:shadow-md duration-200">
                  <h3 className="font-serif text-[17px] text-[#0f0f0f] mb-3 font-normal">All-in-One CRM</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">Track contacts, historical emails, schedules, and document updates in a centralized view.</p>
                </Card>
                <Card variant="surface" className="p-8 bg-white border-[#1B3A6B]/10 shadow-sm hover:shadow-md duration-200">
                  <h3 className="font-serif text-[17px] text-[#0f0f0f] mb-3 font-normal">Secure Data Rooms</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">Manage cap tables, historical financials, and diligence documentation with robust permissions.</p>
                </Card>
                <Card variant="surface" className="p-8 bg-white border-[#1B3A6B]/10 shadow-sm hover:shadow-md duration-200">
                  <h3 className="font-serif text-[17px] text-[#0f0f0f] mb-3 font-normal">Smart Reminders</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">Receive automated notifications on investor follow-up timelines, SAFE expirations, and updates.</p>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}

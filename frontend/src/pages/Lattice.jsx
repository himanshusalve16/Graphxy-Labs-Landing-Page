import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import PageBackground from '../components/layout/PageBackground';
import LatticeHero from '../components/lattice/LatticeHero';
import WaitlistForm from '../components/ui/WaitlistForm';
import LatticeFeatures from '../components/lattice/LatticeFeatures';
import { Card } from '../components/ui/Card';
import { Sparkles, TrendingUp, Check } from 'lucide-react';
import { LatticePreview } from '../components/sections/ProductShowcase';

export default function Lattice() {
  return (
    <PageShell>
      {/* Background Mesh Overlays */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-12 sm:py-16 md:py-24 border-b border-black/[0.04]">
        <PageBackground />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <LatticeHero />

            {/* Rich Interactive CRM/Pipeline Mockup directly on the page */}
            <div className="w-full max-w-md mt-10 md:mt-16 animate-fade-in">
              <LatticePreview />
            </div>

            <LatticeFeatures />
            
            <div className="w-full mt-12 md:mt-20">
              <div className="text-center mb-10 max-w-lg mx-auto">
                <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Operational Core</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mt-2 mb-3 font-light">Eliminate fundraising chaos.</h2>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Lattice is built to replace disconnected spreadsheets, disorganized pitch deck links, and unmonitored investor outreach.
                </p>
              </div>
              
              {/* Extra benefit cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-12 max-w-4xl mx-auto">
                <Card variant="surface" className="p-5 md:p-8 bg-white border-[#1B3A6B]/10 shadow-sm hover:shadow-md duration-200">
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

            {/* Waitlist Form Section at the bottom */}
            <div className="w-full max-w-md mt-10 md:mt-16 flex flex-col items-center">
              <div className="w-full flex items-center gap-3 my-4 text-[#A3A3A3] font-mono text-[9px] uppercase tracking-wider select-none">
                <div className="h-[1px] bg-black/5 flex-1" />
                <span>Join the waitlist</span>
                <div className="h-[1px] bg-black/5 flex-1" />
              </div>
              <WaitlistForm product="Lattice" />
            </div>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}

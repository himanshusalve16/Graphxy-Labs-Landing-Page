import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import LatticeHero from '../components/lattice/LatticeHero';
import LatticeWaitlist from '../components/lattice/LatticeWaitlist';
import LatticeFeatures from '../components/lattice/LatticeFeatures';
import { Card } from '../components/ui/Card';
import { Sparkles, TrendingUp, Check } from 'lucide-react';

export default function Lattice() {
  return (
    <PageShell>
      {/* Background Mesh Overlays */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        {/* Glow textures and radial meshes */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#1B3A6B]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#0066CC]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        {/* Sub-section grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <LatticeHero />
            <LatticeWaitlist />
            
            {/* Rich Interactive CRM/Pipeline Mockup directly on the page */}
            <div className="w-full max-w-2xl mt-16 animate-fade-in">
              <Card variant="surface" className="p-6 bg-white/80 border-[#1B3A6B]/15 shadow-sm backdrop-blur-sm overflow-hidden flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-black/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  </div>
                  <span className="font-mono text-[10px] text-black/40">lattice.graphxy.com/dashboard/fundraising</span>
                </div>

                {/* Pipeline Dashboard Visual */}
                <div className="bg-[#FAFAF8]/50 border border-black/5 rounded-xl p-5 min-h-[260px] flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#1B3A6B] uppercase tracking-wider block">Investor Pipeline CRM</span>
                      <span className="text-[11px] text-[#A3A3A3]">Seed Round • Target: $1.5M</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#0f0f0f] block">$450K Committed</span>
                      <span className="text-[10px] text-black/40">30% of target</span>
                    </div>
                  </div>

                  {/* Kanban Pipeline Stages */}
                  <div className="grid grid-cols-3 gap-3 my-2">
                    {/* Stage 1: Contacted */}
                    <div className="border border-black/5 bg-white p-3 rounded-lg flex flex-col gap-2 shadow-sm">
                      <div className="flex justify-between items-center border-b border-black/[0.04] pb-1.5">
                        <span className="font-mono text-[9px] font-bold text-black/50 uppercase">Contacted</span>
                        <span className="font-mono text-[8px] bg-black/[0.04] px-1.5 py-0.2 rounded-full">3</span>
                      </div>
                      <div className="border border-black/5 bg-[#FAFAF8] p-2 rounded text-left">
                        <span className="text-[10px] font-semibold text-[#0F0F0F] block">Blue Horizon Ventures</span>
                        <span className="text-[9px] text-black/40">Initial Intro Sent</span>
                      </div>
                      <div className="border border-black/5 bg-[#FAFAF8] p-2 rounded text-left">
                        <span className="text-[10px] font-semibold text-[#0F0F0F] block">Apex Partners</span>
                        <span className="text-[9px] text-black/40">Cold Reach Out</span>
                      </div>
                    </div>

                    {/* Stage 2: Meeting Scheduled */}
                    <div className="border border-[#1B3A6B]/20 bg-[#EEF3FB]/30 p-3 rounded-lg flex flex-col gap-2 shadow-sm">
                      <div className="flex justify-between items-center border-b border-[#1B3A6B]/15 pb-1.5">
                        <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase">Meetings</span>
                        <span className="font-mono text-[8px] bg-[#EEF3FB] text-[#1B3A6B] px-1.5 py-0.2 rounded-full font-semibold">1</span>
                      </div>
                      <div className="border border-[#1B3A6B]/10 bg-white p-2 rounded text-left shadow-sm">
                        <span className="text-[10px] font-semibold text-[#0F0F0F] block">Summit Capital</span>
                        <span className="text-[9px] text-[#1B3A6B] font-medium">Partner Meeting 6/18</span>
                      </div>
                    </div>

                    {/* Stage 3: Term Sheet */}
                    <div className="border border-black/5 bg-white p-3 rounded-lg flex flex-col gap-2 opacity-65 shadow-sm">
                      <div className="flex justify-between items-center border-b border-black/[0.04] pb-1.5">
                        <span className="font-mono text-[9px] font-bold text-black/50 uppercase">Term Sheet</span>
                        <span className="font-mono text-[8px] bg-black/[0.04] px-1.5 py-0.2 rounded-full">0</span>
                      </div>
                      <div className="border border-dashed border-black/10 p-3 rounded text-center text-[10px] text-black/30">
                        Drag investor here
                      </div>
                    </div>
                  </div>

                  {/* Fundraising Progress Bar */}
                  <div className="mt-4 bg-white border border-black/5 p-3 rounded-xl shadow-sm">
                    <div className="flex justify-between text-[10px] font-medium text-black/60 mb-1.5">
                      <span>Fundraising Progress</span>
                      <span className="font-mono font-bold text-[#1B3A6B]">$450,000 / $1,500,000</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#1B3A6B] to-[#0066CC] rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>

                {/* Integration status */}
                <div className="bg-[#FAFAF8]/50 rounded-xl p-4 border border-[#1B3A6B]/10 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[11px] font-semibold text-[#0F0F0F] block">Pitch Deck Analytics & Views</span>
                    <span className="text-[10px] text-[#A3A3A3]">Dynamic tracking on presentation interactions</span>
                  </div>
                  <span className="font-mono text-[9px] bg-[#EEF3FB] border border-[#1B3A6B]/15 text-[#1B3A6B] px-2.5 py-1 rounded-full font-semibold">12 views this week</span>
                </div>
              </Card>
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

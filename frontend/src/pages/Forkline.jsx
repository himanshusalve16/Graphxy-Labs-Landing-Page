import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import ForklineHero from '../components/forkline/ForklineHero';
import ForklineWaitlist from '../components/forkline/ForklineWaitlist';
import ForklineFeatures from '../components/forkline/ForklineFeatures';
import ForklineBenefits from '../components/forkline/ForklineBenefits';
import { Card } from '../components/ui/Card';
import { Clock } from 'lucide-react';

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
            <ForklineWaitlist />
            
            {/* Rich Interactive Floor Map Mockup directly on the page */}
            <div className="w-full max-w-2xl mt-16 animate-fade-in">
              <Card variant="surface" className="p-6 bg-white/80 border-[#B45309]/15 shadow-sm backdrop-blur-sm overflow-hidden flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-black/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  </div>
                  <span className="font-mono text-[10px] text-black/40">forkline.graphxy.com/console/floor-live</span>
                </div>

                {/* Restaurant Floor grid representation */}
                <div className="bg-[#FAFAF8]/50 border border-black/5 rounded-xl p-6 min-h-[260px] flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#92400E] uppercase tracking-wider block">Dining Room Status</span>
                      <span className="text-[11px] text-[#A3A3A3]">Active Floor sync - Local Mesh Network</span>
                    </div>
                    <span className="font-mono text-[9px] bg-[#E8F5EE] border border-[#1E8A4A]/10 text-[#1E8A4A] px-2.5 py-1 rounded-full font-semibold">92% OCCUPIED</span>
                  </div>

                  {/* Grid table map */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-2">
                    {/* Table 1 */}
                    <div className="border border-black/5 bg-white p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="text-xs font-bold text-[#0F0F0F]">Table 01</div>
                      <span className="text-[10px] text-black/40">4 Guests</span>
                      <span className="font-mono text-[8px] text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-full mt-2 font-medium">Entree Stage</span>
                    </div>

                    {/* Table 2 */}
                    <div className="border border-[#B45309]/20 bg-[#FEF7EC] p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="text-xs font-bold text-[#0F0F0F]">Table 02</div>
                      <span className="text-[10px] text-[#92400E]/70">2 Guests</span>
                      <span className="font-mono text-[8px] text-[#B45309] bg-[#FFFBEB] px-2 py-0.5 rounded-full mt-2 font-medium">Appetizer</span>
                    </div>

                    {/* Table 3 */}
                    <div className="border border-black/5 bg-white p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="text-xs font-bold text-[#0F0F0F]">Table 03</div>
                      <span className="text-[10px] text-black/40">6 Guests</span>
                      <span className="font-mono text-[8px] text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-full mt-2 font-medium">Dessert</span>
                    </div>

                    {/* Table 4 */}
                    <div className="border border-black/5 bg-white p-4 rounded-xl flex flex-col items-center justify-center text-center opacity-50 shadow-sm">
                      <div className="text-xs font-bold text-[#0F0F0F]">Table 04</div>
                      <span className="text-[10px] text-black/40">Empty</span>
                      <span className="font-mono text-[8px] text-[#A3A3A3] bg-black/[0.04] px-2 py-0.5 rounded-full mt-2 font-medium">Ready</span>
                    </div>
                  </div>

                  {/* Warning / Notification bar */}
                  <div className="bg-[#FEF2F2] border border-[#EF4444]/10 rounded-xl p-3 flex items-center justify-between text-left mt-4 shadow-sm">
                    <span className="text-[10px] font-semibold text-[#EF4444] flex items-center gap-2">
                      <Clock size={13} /> Table 02 over duration limit for appetizers
                    </span>
                    <span className="font-mono text-[9px] font-bold text-[#EF4444] bg-white border border-[#EF4444]/15 px-2 py-0.5 rounded">42 min</span>
                  </div>
                </div>

                {/* Queue status */}
                <div className="bg-[#FAFAF8]/50 rounded-xl p-4 border border-[#B45309]/10 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[11px] font-semibold text-[#0F0F0F] block">Active Kitchen Display Queue</span>
                    <span className="text-[10px] text-[#A3A3A3]">Continuous sync with dining room terminals</span>
                  </div>
                  <span className="font-mono text-[9px] bg-[#FEF7EC] border border-[#B45309]/20 text-[#B45309] px-2.5 py-1 rounded-full font-semibold">5 orders active</span>
                </div>
              </Card>
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

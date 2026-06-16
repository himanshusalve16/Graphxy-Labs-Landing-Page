import React from 'react';
import { Card } from '../ui/Card';

export default function VentureFlowFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-16 max-w-4xl mx-auto">
      <Card variant="surface" className="p-8 bg-white border-[#1B3A6B]/10 hover:border-[#1B3A6B]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Fundraising CRM</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          An intuitive workspace pipeline to track conversations, follow-up intervals, and next milestones with angel investors and VCs.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#1B3A6B]/10 hover:border-[#1B3A6B]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Pitch Deck Telemetry</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Detailed metrics showing slide-by-slide reading durations, bounce locations, and engagement scores for shared presentation files.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#1B3A6B]/10 hover:border-[#1B3A6B]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Cap Table Modeling</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          dilution modeling utilities designed to run mock scenario runs on equity allocations, SAFE notes, and options pool expansions.
        </p>
      </Card>
    </div>
  );
}

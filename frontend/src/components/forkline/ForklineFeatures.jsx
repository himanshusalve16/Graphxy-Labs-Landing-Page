import React from 'react';
import { Card } from '../ui/Card';

export default function ForklineFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-16 max-w-4xl mx-auto">
      <Card variant="surface" className="p-8 bg-white border-[#B45309]/14 hover:border-[#B45309]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">KOT & Billing Operations</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          A software-first billing and KOT queue designed to synchronize dine-in tables, takeaway orders, and kitchen display terminals.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#B45309]/14 hover:border-[#B45309]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Floor Plans & Table Turns</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Visual dining room layouts with live service-duration alerts to improve table rotation speeds and optimize waiter allocations.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#B45309]/14 hover:border-[#B45309]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Operational Compliance</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Automated GST/tax calculations, real-time inventory alerts, shift planning, and direct KOT billing approval controls.
        </p>
      </Card>
    </div>
  );
}

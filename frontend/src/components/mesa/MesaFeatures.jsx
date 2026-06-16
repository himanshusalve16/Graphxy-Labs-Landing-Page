import React from 'react';
import { Card } from '../ui/Card';

export default function MesaFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-16 max-w-4xl mx-auto">
      <Card variant="surface" className="p-8 bg-white border-[#B45309]/14 hover:border-[#B45309]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Order Management & POS</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          A software-first ordering queue designed to synchronize floor orders with kitchen displays on any tablet.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#B45309]/14 hover:border-[#B45309]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Interactive Floor Plans</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Table-status overlays reflecting order velocity and floor durations to help turn tables faster.
        </p>
      </Card>
      
      <Card variant="surface" className="p-8 bg-white border-[#B45309]/14 hover:border-[#B45309]/30 duration-200">
        <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Workforce Automation</h3>
        <p className="text-[12px] text-[#525252] leading-relaxed">
          Automatic low-inventory alarms, shifts planning logs, and internal approval flows for managers.
        </p>
      </Card>
    </div>
  );
}

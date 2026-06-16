import React from 'react';
import { Card } from '../ui/Card';

export default function MesaBenefits() {
  const benefits = [
    {
      title: "Bring Your Own Device",
      desc: "No expensive hardware lock-ins. Mesa works seamlessly on iPads, Android tablets, and generic touch monitors."
    },
    {
      title: "Immediate Syncing",
      desc: "Zero-lag order updates between floor servers and kitchen displays using local mesh networks and cloud backplanes."
    },
    {
      title: "Data-Driven Decisions",
      desc: "Gain deep reporting on labor efficiency, table turn durations, and menu item margins automatically."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-12 max-w-4xl mx-auto">
      {benefits.map((item, idx) => (
        <Card key={idx} variant="surface" className="p-8 bg-white border-[#B45309]/14 shadow-sm hover:shadow-md duration-200">
          <h3 className="font-serif text-[17px] text-[#0f0f0f] mb-3 font-normal">{item.title}</h3>
          <p className="text-xs text-[#525252] leading-relaxed">{item.desc}</p>
        </Card>
      ))}
    </div>
  );
}

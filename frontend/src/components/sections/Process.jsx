import React from 'react';
import Container from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

const steps = [
  { num: "01", title: "Discovery", desc: "Aligning product scope, business intent, and technical feasibility parameters." },
  { num: "02", title: "Research", desc: "Investigating user workflows, database requirements, and competitor products." },
  { num: "03", title: "Product Strategy", desc: "Mapping core features and formulating high-fidelity PRD specifications." },
  { num: "04", title: "UX Design", desc: "Creating spatial wireframes, layout rules, and component grids." },
  { num: "05", title: "Architecture", desc: "Designing database models, API structures, and scale pipelines." },
  { num: "06", title: "Development", desc: "Writing clean, componentized React code and decoupled backend logic." },
  { num: "07", title: "Testing", desc: "Executing unit tests, breakpoint audits, and security vulnerability runs." },
  { num: "08", title: "Deployment", desc: "Packaging builds for immediate edge hosting and global CDN roots." },
  { num: "09", title: "Monitoring", desc: "Tracking active server performance logs, error telemetry, and speed metrics." },
  { num: "10", title: "Iteration & Scale", desc: "Upgrading capacities, refining layouts, and expanding product features." }
];

export default function Process() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAFAF8] border-b border-black/[0.06] relative overflow-hidden">
      {/* Background overlay grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Container>
        <SectionHeading 
          eyebrow="Methodology"
          heading="A connected 10-step lifecycle from scope to release."
          description="How Graphxy Labs engineers scalable software products and client systems with design restraint."
        />

        {/* CONNECTED PROCESS FLOW PIPELINE */}
        {/* Desktop Pipeline (Grid of 2 rows with SVG connection paths) */}
        <div className="hidden lg:block relative mt-12 max-w-5xl mx-auto">
          {/* Connector Paths (background layers) */}
          <div className="absolute inset-x-0 top-[65px] h-[1px] bg-black/[0.06]" />
          <div className="absolute inset-x-0 top-[225px] h-[1px] bg-black/[0.06]" />
          <div className="absolute right-[90px] top-[65px] bottom-[90px] w-[1px] bg-black/[0.06] border-dashed" />

          {/* Row 1 (Steps 1-5) */}
          <div className="grid grid-cols-5 gap-6 relative z-10 mb-14">
            {steps.slice(0, 5).map((step, idx) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-xs font-mono text-xs font-bold text-[#1B3A6B] relative group hover:border-[#1B3A6B]/30 duration-200">
                  {step.num}
                  <div className="absolute -inset-1 rounded-full border border-[#1B3A6B] opacity-0 group-hover:opacity-20 group-hover:scale-105 duration-200" />
                </div>
                <h3 className="font-serif text-sm text-[#0F0F0F] font-bold mt-4 mb-2">{step.title}</h3>
                <p className="text-[11px] text-[#A3A3A3] leading-relaxed px-2">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Row 2 (Steps 6-10) */}
          <div className="grid grid-cols-5 gap-6 relative z-10">
            {steps.slice(5, 10).map((step, idx) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-xs font-mono text-xs font-bold text-[#1B3A6B] relative group hover:border-[#1B3A6B]/30 duration-200">
                  {step.num}
                  <div className="absolute -inset-1 rounded-full border border-[#1B3A6B] opacity-0 group-hover:opacity-20 group-hover:scale-105 duration-200" />
                </div>
                <h3 className="font-serif text-sm text-[#0F0F0F] font-bold mt-4 mb-2">{step.title}</h3>
                <p className="text-[11px] text-[#A3A3A3] leading-relaxed px-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / Tablet vertical timeline layout */}
        <div className="block lg:hidden relative mt-12 max-w-md mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-[20px] top-[10px] bottom-[10px] w-[1.5px] bg-black/[0.06]" />

          <div className="flex flex-col gap-8 text-left">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-xs font-mono text-xs font-bold text-[#1B3A6B] flex-shrink-0">
                  {step.num}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-serif text-sm text-[#0F0F0F] font-bold">{step.title}</h3>
                  <p className="text-[11px] text-[#A3A3A3] leading-relaxed mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

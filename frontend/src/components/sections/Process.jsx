import React, { useState } from 'react';
import Container from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
  const [openStep, setOpenStep] = useState(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAFAF8] border-b border-black/[0.06] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Container>
        <SectionHeading
          eyebrow="Methodology"
          heading="A connected 10-step lifecycle from scope to release."
          description="How Graphxy Labs engineers scalable software products and client systems with design restraint."
        />

        {/* ── DESKTOP PIPELINE (lg+) ── */}
        <div className="hidden lg:block relative mt-12 max-w-5xl mx-auto">
          <div className="absolute inset-x-0 top-[65px] h-[1px] bg-black/[0.06]" />
          <div className="absolute inset-x-0 top-[225px] h-[1px] bg-black/[0.06]" />
          <div className="absolute right-[90px] top-[65px] bottom-[90px] w-[1px] bg-black/[0.06] border-dashed" />

          <div className="grid grid-cols-5 gap-6 relative z-10 mb-14">
            {steps.slice(0, 5).map((step) => (
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

          <div className="grid grid-cols-5 gap-6 relative z-10">
            {steps.slice(5, 10).map((step) => (
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

        {/* ── TABLET TIMELINE (md–lg) ── */}
        <div className="hidden md:block lg:hidden relative mt-10 max-w-2xl mx-auto">
          <div className="absolute left-[23px] top-[10px] bottom-[10px] w-[2px] bg-black/[0.06]" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4 relative z-10 items-start">
                <div className="w-11 h-11 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-xs font-mono text-xs font-bold text-[#1B3A6B] flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-serif text-sm text-[#0F0F0F] font-bold">{step.title}</h3>
                  <p className="text-[11px] text-[#A3A3A3] leading-relaxed mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MOBILE TAP-TO-EXPAND TIMELINE (< md) ── */}
        <div className="block md:hidden relative mt-8 max-w-md mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-[23px] top-3 bottom-3 w-[2px] bg-black/[0.06]" />

          <div className="flex flex-col gap-1">
            {steps.map((step) => {
              const isOpen = openStep === step.num;
              return (
                <div key={step.num} className="relative z-10">
                  <button
                    onClick={() => setOpenStep(isOpen ? null : step.num)}
                    style={{ touchAction: 'manipulation' }}
                    className="w-full flex gap-4 items-center text-left py-3 pr-2 active:bg-black/[0.01] transition-colors rounded-xl"
                    aria-expanded={isOpen}
                  >
                    {/* Step circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xs font-mono text-xs font-bold flex-shrink-0 transition-colors duration-150 border ${
                      isOpen
                        ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                        : 'bg-white text-[#1B3A6B] border-black/5'
                    }`}>
                      {step.num}
                    </div>
                    {/* Title + chevron */}
                    <div className="flex-1 flex items-center justify-between gap-2 min-h-[44px]">
                      <h3 className="font-serif text-sm text-[#0F0F0F] font-bold">{step.title}</h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown size={14} className={isOpen ? 'text-[#1B3A6B]' : 'text-black/25'} />
                      </motion.div>
                    </div>
                  </button>

                  {/* Expandable description */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-[#525252] leading-relaxed ml-16 pb-3 pr-2">
                          {step.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

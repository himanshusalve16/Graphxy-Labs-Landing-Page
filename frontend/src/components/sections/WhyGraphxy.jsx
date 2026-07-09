import React from 'react';
import Container from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';

const reasons = [
  {
    title: "Engineering Excellence",
    desc: "We believe code quality serves the end user. We build robust, highly performant systems and responsive UX that prioritize utility and reliability."
  },
  {
    title: "Minimalist Design Grammar",
    desc: "Symmetric spacing, clean layouts, and typographic hierarchies over noisy, unnecessary visual embellishments."
  },
  {
    title: "Modular, Scalable Organization",
    desc: "Our code bases are structured with shared libraries, monorepos, and clear boundaries to scale effortlessly."
  }
];

export default function WhyGraphxy() {
  return (
    <section className="py-10 sm:py-14 md:py-20 bg-white border-b border-black/[0.06]">
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <div>
          <SectionHeading 
            eyebrow="Our Philosophy"
            heading="Building software with precision and architectural durability."
            description="We reject software clutter. Graphxy Labs engineers digital systems focused on clean code, utility, and design restraint."
          />
          
          <div className="flex flex-col gap-3 mt-8">
            {reasons.map((item, idx) => (
              <div 
                key={idx} 
                data-reveal 
                style={{ transitionDelay: `${idx * 100}ms` }}
                className="flex items-start gap-4 p-4 rounded-xl border border-black/[0.06] bg-[#FAFAF8] hover:translate-y-[-1px] hover:shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B] flex-shrink-0 mt-2" />
                <div>
                  <div className="text-sm font-semibold text-[#0F0F0F]">{item.title}</div>
                  <div className="text-xs text-[#525252] mt-1 font-normal leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:sticky md:top-24 mt-8 md:mt-0">
          <p data-reveal className="font-serif text-[17px] sm:text-[20px] md:text-[24px] leading-[1.6] tracking-[-0.015em] text-[#525252] border-l-2 border-[#1B3A6B] pl-5 md:pl-7 italic">
            "Slowing down to design with precision and writing modular, clean software is the only way to build systems that scale."
          </p>
        </div>
      </Container>
    </section>
  );
}

import React from 'react';
import Container from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';

export default function CompanyOverview() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-black/[0.06]">
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <SectionHeading 
            eyebrow="Who We Are"
            heading="An engineering-driven software product studio."
            description="Graphxy Labs designs and builds high-performance technology ecosystems. We operate both as a creator of proprietary visual tools and management platforms, and as a specialized engineering partner for companies requiring scalable digital systems."
          />
        </div>
        <div>
          <p data-reveal className="font-serif text-[18px] md:text-[22px] leading-[1.6] tracking-[-0.010em] text-[#525252] border-l-2 border-[#1B3A6B] pl-6 italic">
            "We believe complex engineering issues are best resolved through product clarity, architectural restraint, and visual simplicity."
          </p>
        </div>
      </Container>
    </section>
  );
}

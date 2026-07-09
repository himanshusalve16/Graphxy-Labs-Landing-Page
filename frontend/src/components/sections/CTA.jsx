import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import Container from '../layout/Container';

export default function CTA() {
  return (
    <section className="py-10 sm:py-14 md:py-20 bg-[#FAFAF8]">
      <Container>
        <div data-reveal className="bg-white border border-black/[0.06] rounded-2xl p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="font-serif text-[22px] sm:text-[26px] md:text-[32px] leading-tight tracking-[-0.015em] text-[#0F0F0F] mb-3 md:mb-4">
              Work with an engineering studio that delivers.
            </h2>
            <p className="text-sm text-[#525252] leading-relaxed">
              Whether you need to scale a web platform, engineer an AI-powered pipeline, automate complex workflows, or build custom enterprise systems, we are ready to partner with you.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full md:w-auto">
            <Link to="/services" className="w-full sm:w-auto">
              <Button variant="brand" size="md" className="w-full">Explore Services</Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';

export default function TermsOfService() {
  return (
    <PageShell>
      <div className="bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        <Container className="max-w-3xl mx-auto">
          <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Ecosystem Policies</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light text-[#0F0F0F] mt-2 mb-8 tracking-tight">
            Terms of Service
          </h1>
          <div className="font-mono text-[10px] text-[#A3A3A3] mb-10 pb-6 border-b border-black/[0.06]">
            LAST MODIFIED: JUNE 16, 2026
          </div>

          <div className="prose prose-sm max-w-none text-xs md:text-sm text-[#525252] leading-relaxed flex flex-col gap-8">
            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing graphxylabs.com or utilizing our interactive mathematical calculators (Graphzy), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">2. Acceptable Use</h2>
              <p>
                Our visual modules and calculator presets are designed for educational and operational planning review. You agree not to:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-2 mt-1">
                <li>Attempt to scrape, script, or overload our API hooks or endpoints.</li>
                <li>Submit fraudulent email addresses to our waitlist configurations.</li>
                <li>Utilize visual simulations or graphing templates in a commercial production setting without separate licensing.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">3. Intellectual Property Rights</h2>
              <p>
                The proprietary components, site design parameters, layout styles, custom assets, and source codes are the sole intellectual property of Graphxy Labs. Desmos graphing libraries and matching API CDNs are owned and copyrighted by Desmos Inc. All rights not explicitly granted are reserved by the respective owners.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">4. Disclaimers & Limitations of Liability</h2>
              <p>
                Our visual products and simulations are provided "as is" and "as available". We make no warranties of any kind, explicit or implied, concerning the grading correctness, equation accuracy, or operational uptime of Graphzy, Forkline, and Lattice. We shall not be liable for any direct, indirect, incidental, or consequential damages resulting from platform downtime or data loss.
              </p>
            </section>


          </div>
        </Container>
      </div>
    </PageShell>
  );
}

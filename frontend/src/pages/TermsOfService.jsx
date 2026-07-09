import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import PageBackground from '../components/layout/PageBackground';

export default function TermsOfService() {
  return (
    <PageShell>
      <div className="relative overflow-hidden bg-[#FAFAF8] py-12 sm:py-16 md:py-24 border-b border-black/[0.04]">
        <PageBackground />
        <Container className="relative z-10 max-w-3xl mx-auto">
          <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Ecosystem Policies</span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-[#0F0F0F] mt-2 mb-6 md:mb-8 tracking-tight">
            Terms of Service
          </h1>
          <div className="font-mono text-[10px] text-[#A3A3A3] mb-10 pb-6 border-b border-black/[0.06]">
            LAST MODIFIED: JULY 10, 2026
          </div>

          <div className="prose prose-sm max-w-none text-xs md:text-sm text-[#525252] leading-relaxed flex flex-col gap-8">
            
            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing this website, communicating with us, or utilizing any of our engineering, consulting, or software development services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue your use of our website and services immediately.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">2. Website Usage</h2>
              <p>
                You are granted a non-exclusive, non-transferable, revocable license to access our website for informational purposes in accordance with these Terms. You agree not to use the website in any manner that could disable, damage, or impair the site, or interfere with any other user's access.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">3. Services</h2>
              <p>
                Graphxy Labs offers professional consulting, design, architecture, and custom software development services. Any engagement for these services is governed by a separate, signed Master Services Agreement (MSA) or Statement of Work (SOW). The descriptions of services on this website do not constitute binding commercial offers.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">4. Intellectual Property</h2>
              <p>
                The designs, layout structures, logo files, proprietary graphics, codebase components, and textual materials published on this website are the intellectual property of Graphxy Labs. You may not reproduce, copy, or repurpose any elements without our explicit, written authorization.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">5. User Responsibilities</h2>
              <p>
                If you interact with our website contact forms, you agree to provide truthful, accurate, and current contact details. You agree not to submit unsolicited marketing pitches, script injections, or malicious payloads through our input surfaces.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">6. Third-Party Links</h2>
              <p>
                Our website may contain links to external sites operated by clients, partners, or service providers. Graphxy Labs has no control over, and assumes no responsibility for, the content, privacy policies, or operational standards of any third-party websites.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">7. Disclaimer</h2>
              <p>
                This website and its contents are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. We do not guarantee that the website will be secure, error-free, or continuously accessible.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Graphxy Labs and its engineers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your access to, or inability to access, this website or its informational resources.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">9. Changes to Terms</h2>
              <p>
                We reserve the right to revise these Terms of Service at any time. The modified terms become effective immediately upon posting. Your continued use of the website following any changes indicates your acceptance of the updated terms.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">10. Contact Through Website</h2>
              <p>
                For any inquiries regarding these Terms of Service, please contact us directly using the form provided on our Contact page.
              </p>
            </section>

          </div>
        </Container>
      </div>
    </PageShell>
  );
}

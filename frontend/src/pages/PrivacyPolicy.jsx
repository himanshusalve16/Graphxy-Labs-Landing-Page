import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';

export default function PrivacyPolicy() {
  return (
    <PageShell>
      <div className="bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        <Container className="max-w-3xl mx-auto">
          <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Ecosystem Policies</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light text-[#0F0F0F] mt-2 mb-8 tracking-tight">
            Privacy Policy
          </h1>
          <div className="font-mono text-[10px] text-[#A3A3A3] mb-10 pb-6 border-b border-black/[0.06]">
            LAST MODIFIED: JUNE 16, 2026
          </div>

          <div className="prose prose-sm max-w-none text-xs md:text-sm text-[#525252] leading-relaxed flex flex-col gap-8">
            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">1. Information Collection</h2>
              <p>
                We collect information directly provided by users when interacting with our digital interfaces. This includes your name, email address, company name, and details supplied through our waitlists and contact systems. We also temporarily cache query parameters inside your browser's local storage to save your Graphzy conceptual history across session breaks.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">2. Form Submissions & Email Processing</h2>
              <p>
                All form payloads submitted through the Forkline Waitlist, Lattice Waitlist, and Contact Us portals are processed securely using our custom email routing system. Submissions are securely delivered to our operational inbox. By submitting forms, you consent to our retrieval and storage of your contact information to reply to your inquiry.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">3. Analytics & Cookies</h2>
              <p>
                We do not track you across other websites. We use minimal local storage parameters and functional cookies solely to save your calculator preferences, dashboard concept history, and weak area flags. These elements are stored locally inside your browser and can be deleted by purging your browser's cache.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">4. Third-Party Services</h2>
              <p>
                Our services integrate CDN scripts and third-party tools to load active code assets.
              </p>
            </section>


          </div>
        </Container>
      </div>
    </PageShell>
  );
}

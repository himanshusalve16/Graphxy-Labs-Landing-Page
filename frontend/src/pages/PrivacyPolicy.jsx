import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import PageBackground from '../components/layout/PageBackground';

export default function PrivacyPolicy() {
  return (
    <PageShell>
      <div className="relative overflow-hidden bg-[#FAFAF8] py-12 sm:py-16 md:py-24 border-b border-black/[0.04]">
        <PageBackground />
        <Container className="relative z-10 max-w-3xl mx-auto">
          <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Ecosystem Policies</span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-[#0F0F0F] mt-2 mb-6 md:mb-8 tracking-tight">
            Privacy Policy
          </h1>
          <div className="font-mono text-[10px] text-[#A3A3A3] mb-10 pb-6 border-b border-black/[0.06]">
            LAST MODIFIED: JULY 10, 2026
          </div>

          <div className="prose prose-sm max-w-none text-xs md:text-sm text-[#525252] leading-relaxed flex flex-col gap-8">
            
            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">1. Introduction</h2>
              <p>
                At Graphxy Labs, we design, architecture, and engineer custom digital systems, including web and mobile applications, AI & machine learning solutions, data engineering pipelines, automation workflows, cloud solutions, and management systems. We are committed to protecting the privacy of visitors to our website and users of our platform and services. This policy describes how we collect, process, protect, and respect your personal data.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">2. Information We Collect</h2>
              <p>
                We collect information that you explicitly submit to us when interacting with our website, platform, or services. This includes contact details such as your name, company name, and email address submitted during inquiries or partner communications. We also collect metadata and technical log data, such as your IP address, browser type, and navigation patterns when you visit our website.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">3. How Information Is Used</h2>
              <p>
                We use the information we collect to communicate with you about our services, process requests submitted through our website, analyze aggregate system performance, and customize your experience with our services. We do not sell or lease your personal information to third parties.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">4. Cookies & Analytics</h2>
              <p>
                We utilize minimal, privacy-centric cookies and local storage tokens to maintain functional states across user sessions and optimize website navigation. We may use third-party analytics utilities to review aggregate traffic patterns, which do not build identifying profile histories of our visitors.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">5. Third-Party Services</h2>
              <p>
                Our website integrates asset CDNs and code packages from external infrastructure providers to build our digital services. These third-party services collect request parameters (such as browser user-agent and IP addresses) necessary for file delivery and network routing under their respective privacy protocols.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">6. Data Security</h2>
              <p>
                We employ standard security controls, including encrypted transport protocols (HTTPS/TLS) and secure database access configurations, to protect your personal details against unauthorized access, loss, or manipulation.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">7. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the operational business inquiries or service contracts for which it was originally collected, or to comply with our statutory obligations.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">8. User Rights</h2>
              <p>
                Depending on your location, you may have statutory rights regarding your personal information, including the right to request access to, correction of, or erasure of your data. You may contact us regarding these rights via our website contact form.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">9. Children's Privacy</h2>
              <p>
                Our services, website, and custom software systems are intended for professional organizations and adult operators. We do not knowingly collect personal data from individuals under the age of 18.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">10. Policy Updates</h2>
              <p>
                We may modify this Privacy Policy at our discretion to match operational changes or compliance updates. The revised policy will be posted on this page with an updated modification date.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-[#0F0F0F] font-semibold">11. Contact Through Website</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please submit an inquiry directly through our official website contact form.
              </p>
            </section>

          </div>
        </Container>
      </div>
    </PageShell>
  );
}

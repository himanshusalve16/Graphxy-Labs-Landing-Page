import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import PageBackground from '../components/layout/PageBackground';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import FounderImage from '../assets/Founder_transparent.png';
import {
  Shield,
  Layers,
  Code,
  Target,
  CheckCircle,
  Terminal,
  Activity,
  Cpu,
  Layers as LayersIcon
} from 'lucide-react';

const coreValues = [
  {
    title: "Engineering Integrity",
    desc: "We write clean, documented, and tested code. We do not use placeholders or shortcuts that introduce technical debt.",
    icon: Code,
    color: "#0066CC"
  },
  {
    title: "Architectural Restraint",
    desc: "We reject bloated software architectures. We build minimal, fast, and highly reliable systems optimized for performance.",
    icon: Layers,
    color: "#0D9488"
  },
  {
    title: "Product Clarity",
    desc: "We ensure every line of code and interface element serves a clear, validated user objective and delivers real utility.",
    icon: Target,
    color: "#92400E"
  },
  {
    title: "Secure Infrastructure",
    desc: "From encrypted databases to secure API proxies, security is treated as an active engineering parameter, not an afterthought.",
    icon: Shield,
    color: "#1B3A6B"
  }
];

const philosophyPrinciples = [
  {
    id: "p0",
    name: "Architectural Restraint",
    short: "Restraint",
    subtitle: "Eliminating dependency bloat & runtime overhead.",
    desc: "Only build code that is strictly required. Reject bloated dependencies, premature horizontal scaling, and unnecessary architectural complexity.",
    tabHeader: "system-bundle-audit.sh",
    logs: [
      { text: "$ audit-bundle --production", color: "text-[#A1A1AA]" },
      { text: "[INFO] Scanning workspace directories...", color: "text-blue-400/90" },
      { text: "[INFO] Auditing external node modules & assets", color: "text-blue-400/90" },
      { text: " ", color: "" },
      { text: "✓ index.css ........................ 76.17 kB  [OPTIMAL]", color: "text-emerald-400" },
      { text: "✓ main.js .......................... 857.02 kB [OPTIMAL]", color: "text-emerald-400" },
      { text: "✓ logo.svg ......................... 4.89 kB   [OPTIMAL]", color: "text-emerald-400" },
      { text: " ", color: "" },
      { text: "[AUDIT] External Dependency Count: 4 (Zod, React, Framer-Motion, Lucide)", color: "text-yellow-400/90" },
      { text: "[AUDIT] Unused Imports / Dead Code: 0%", color: "text-emerald-400" },
      { text: "[AUDIT] Initial Load Time: 7.00ms (Edge Cache)", color: "text-emerald-400" },
      { text: "[STATUS] Production readiness: 100% compliant", color: "text-emerald-400 font-bold" }
    ]
  },
  {
    id: "p1",
    name: "Product Clarity",
    short: "Clarity",
    subtitle: "Aligning interface layout grids with absolute utility.",
    desc: "Visual layouts must serve absolute utility. We align visual spacing, typography, and interactive components with real user requirements.",
    tabHeader: "ui-grid-inspector.json",
    logs: [
      { text: "$ inspect-layout --page=Home --grid=true", color: "text-[#A1A1AA]" },
      { text: "[GRID] Initializing design token validator...", color: "text-blue-400/90" },
      { text: " ", color: "" },
      { text: "● Font Family: Inter, Fraunces, JetBrains Mono", color: "text-indigo-400" },
      { text: "● Container Max Width: 1200px (4xl layout grid)", color: "text-indigo-400" },
      { text: "● Baseline Alignment Grid: 20px / 24px increments", color: "text-indigo-400" },
      { text: "● Spacing Audit: 100% compliant with design tokens", color: "text-emerald-400" },
      { text: "● Interactive Target Sizes: 44x44px minWCAG [PASS]", color: "text-emerald-400" },
      { text: "● Contrast Ratio (Zinc-750/FAFAF8): 8.4:1 [PASS]", color: "text-emerald-400" },
      { text: " ", color: "" },
      { text: "[STATUS] Layout verification: 100% compliant", color: "text-emerald-400 font-bold" }
    ]
  },
  {
    id: "p2",
    name: "Modular Isolation",
    short: "Isolation",
    subtitle: "Decoupling systems into isolated operational layers.",
    desc: "Structure systems into decoupled services, monorepos, and shared packages to preserve independence and scale cleanly.",
    tabHeader: "dependency-graph-check.py",
    logs: [
      { text: "$ python check_boundaries.py --strict", color: "text-[#A1A1AA]" },
      { text: "[MONOREPO] Checking workspace dependency limits...", color: "text-blue-400/90" },
      { text: " ", color: "" },
      { text: "● frontend/clampbox/extension ──> ISOLATED (Client Only)", color: "text-indigo-400" },
      { text: "● db/clampbox/schema ───────────> RESTRICTED (Drizzle ORM)", color: "text-indigo-400" },
      { text: "● backend/clampbox/services ────> ISOLATED (Gateway API Layer)", color: "text-indigo-400" },
      { text: " ", color: "" },
      { text: "✓ 0 boundary violations detected.", color: "text-emerald-400" },
      { text: "✓ Shared library structures validated.", color: "text-emerald-400" },
      { text: "[STATUS] Systems architecture integrity: SECURE", color: "text-emerald-400 font-bold" }
    ]
  },
  {
    id: "p3",
    name: "Absolute Security",
    short: "Security",
    subtitle: "Cryptographic credentials validation & secure gateways.",
    desc: "Enforce cryptographic validation, symmetric AES enclaves for provider secrets, and strict CORS. Security is an immutable standard.",
    tabHeader: "auth-gate-inspection.log",
    logs: [
      { text: "$ tail -n 8 /var/log/clampbox/gateway.log", color: "text-[#A1A1AA]" },
      { text: "[AUTH] Incoming Gateway connection validation...", color: "text-blue-400/90" },
      { text: "[AUTH] Checking signature for header X-Clampbox-Key...", color: "text-blue-400/90" },
      { text: " ", color: "" },
      { text: "[AUTH] Key hash match found in active Vault (AES-256 decrypted)", color: "text-indigo-400" },
      { text: "[AUTH] Checking CORS allowed origin list...", color: "text-blue-400/90" },
      { text: "Origin matches: https://graphxylabs.dev [PASS]", color: "text-emerald-400" },
      { text: " ", color: "" },
      { text: "[STATUS] Request allowed. Routing traffic to LLM proxy...", color: "text-emerald-400 font-bold" }
    ]
  }
];

const industries = [
  "Financial Technology (FinTech)",
  "Hospitality & Operations Systems",
  "Intelligent Automation & AI Integration",
  "Cloud & Container Orchestration",
  "Developer Tools & Infrastructure",
  "Data Engineering & Analytics Panels"
];

export default function About() {
  const [activeTab, setActiveTab] = useState("p0");

  const activePrinciple = philosophyPrinciples.find(p => p.id === activeTab) || philosophyPrinciples[0];

  return (
    <PageShell>
      {/* Shared Engineering Mesh Background */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-12 sm:py-16 md:py-24 border-b border-black/[0.04] flex-grow">
        <PageBackground />

        <Container className="relative z-10">

          {/* Header */}
          <div className="max-w-3xl mx-auto mb-10 md:mb-16 text-center">
            <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-[0.15em]">About Our Studio</span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-[#0F0F0F] mt-3 mb-4 tracking-tight leading-[1.15]">
              Built on engineering standards, <br />
              <em className="not-italic text-black/40">engineered with restraint</em>
            </h1>
            <p className="text-sm md:text-base text-[#525252] leading-relaxed max-w-xl mx-auto">
              Graphxy Labs is a software engineering and technology solutions company. We design and build clean, scalable systems for startups, businesses, and enterprise systems.
            </p>
          </div>

          {/* Grid Layout: Story and Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mt-8 md:mt-12 mb-10 md:mb-16">
            <div>
              <SectionHeading
                eyebrow="Our Story"
                heading="Founded to eliminate software complexity."
                description="We started Graphxy Labs because we observed a growing trend in software development: bloated systems, fragile dependencies, and visual clutter. We believe the best technology is simple, robust, and designed with absolute restraint."
              />
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mt-4 font-normal">
                We operate as a high-fidelity specialized engineering studio. Startups and businesses partner with us to transform complex system needs into precise React applications, secure cloud environments, and modular automation pipelines. We reject templates, placeholders, and ad-hoc code.
              </p>
            </div>

            <div className="border-l-2 border-[#1B3A6B] pl-6 md:pl-8 italic mt-4 md:mt-12">
              <h3 className="font-serif text-lg md:text-xl text-[#0F0F0F] font-semibold mb-2">Our Mission</h3>
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed font-normal">
                To build digital systems that perform reliably under high scale, utilizing clean and maintainable codebase principles, visual restraint, and secure cryptographic enclaves.
              </p>
              <h3 className="font-serif text-lg md:text-xl text-[#0F0F0F] font-semibold mb-2 mt-6">Our Vision</h3>
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed font-normal">
                To establish Graphxy Labs as the premium engineering partner for organizations that value precise execution, software durability, and absolute design consistency.
              </p>
            </div>
          </div>

          {/* Founder Story Section */}
          <div className="border-t border-black/[0.04] pt-12 md:pt-20 my-12 md:my-20 animate-fade-in" data-reveal>
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">The Origin Story</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#0F0F0F] font-light mt-2">From Freelancer to Founder</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Image wrapper with minimal Liquid Glass refraction */}
              <div className="order-1 lg:order-none lg:col-span-5 relative flex justify-center py-6 sm:py-8 select-none">
                {/* Translucent Glass refraction container */}
                <div
                  className="relative p-3 rounded-3xl w-full max-w-[340px]"
                  style={{
                    border: "1.2px solid rgba(0, 0, 0, 0.18)",
                    boxShadow: "inset 1px 1px 0px rgba(255, 255, 255, 0.3), inset -1px -1px 0px rgba(0, 0, 0, 0.06), inset 0 0 12px rgba(255, 255, 255, 0.05), 0 16px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  {/* Image container: completely transparent background */}
                  <div className="overflow-hidden rounded-2xl w-full bg-transparent">
                    <img
                      src={FounderImage}
                      alt="Himanshu Salve"
                      className="w-full h-auto object-cover select-none pointer-events-none origin-top"
                      style={{ clipPath: 'inset(0% 0% 5% 0%)', marginBottom: '-5%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Founder details & story with responsive ordering */}
              <div className="order-2 lg:order-none lg:col-span-7 flex flex-col text-left">
                <h3 className="order-1 font-serif text-3xl font-light tracking-tight text-[#0F0F0F] mb-1">
                  Himanshu Salve
                </h3>

                <span className="order-3 lg:order-2 font-mono text-[9.5px] font-bold text-[#1B3A6B] uppercase tracking-wider mb-6 mt-1 block">
                  Founder & Software Engineer
                </span>

                <div className="order-2 lg:order-3 flex flex-col gap-4 text-xs sm:text-sm text-[#525252] leading-relaxed font-normal">
                  <p>
                    "In 2024, my first freelancing paycheck was ₹500.
                  </p>
                  <p>
                    That same freelancing slowly grew to cover my trips, my expenses, and my own independent growth — completely on its own.
                  </p>
                  <p>
                    Two years of consistent work later, all of that freelancing — every service, every project, and every client — now officially comes under one roof.
                  </p>
                  <p>
                    <strong>Graphxy Labs</strong>.
                  </p>
                  <p>
                    This is the result of that journey. A technology company focused on Web Development, Mobile Applications, AI & Machine Learning, Management Systems, Data Science, Automation, and Custom Software.
                  </p>
                  <p>
                    From a small paycheck to building an engineering studio that's just getting started."
                  </p>
                </div>

                <div className="order-4 mt-8 border-t border-black/[0.04] pt-6">
                  <blockquote className="m-0">
                    <p className="font-serif text-sm sm:text-base italic text-[#525252] border-l-2 border-[#1B3A6B] pl-5 my-0 leading-relaxed">
                      "Every great company starts with solving one problem well. Graphxy Labs is simply the next step in that journey."
                    </p>
                  </blockquote>
                  <cite className="font-mono text-[9px] font-bold text-black/45 uppercase tracking-widest block not-italic mt-3 pl-5">— Himanshu Salve</cite>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Engineering Principles Interactive Console Dashboard */}
          <div className="my-12 md:my-24">
            <SectionHeading
              eyebrow="Engineering Principles"
              heading="Architectural check routines in our daily code bases."
              description="Select a principle to see how we validate and enforce architectural standards in our client deliverables."
              className="text-center max-w-2xl mx-auto mb-12"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto mt-6">

              {/* Left Selector Panel: 4 Columns on Mobile, Vertical on Desktop */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                {philosophyPrinciples.map(p => {
                  const isActive = p.id === activeTab;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActiveTab(p.id)}
                      style={{ touchAction: 'manipulation' }}
                      className={`text-left p-4 rounded-xl border transition-all duration-150 relative cursor-pointer outline-none ${isActive
                        ? 'bg-white border-[#1B3A6B]/20 shadow-sm ring-1 ring-[#1B3A6B]/5'
                        : 'bg-white/40 hover:bg-white/80 border-black/5'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute left-0 top-3 bottom-3 w-1 bg-[#1B3A6B] rounded-r"
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        />
                      )}
                      <h4 className={`font-serif text-sm font-semibold transition-colors ${isActive ? 'text-[#1B3A6B]' : 'text-[#0F0F0F]'}`}>
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-[#525252] leading-tight mt-1 font-normal">
                        {p.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Right Content Console: Mock developer terminal screen */}
              <div className="lg:col-span-8">
                <Card variant="glass" className="bg-[#18181B] border-white/10 p-5 sm:p-6 shadow-xl rounded-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[300px] text-left">

                  {/* Console Header Bar */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/35 border-b border-white/[0.08] pb-3 mb-4 select-none">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-2 font-semibold text-white/50">{activePrinciple.tabHeader}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Terminal size={11} className="text-white/20" />
                      <span className="uppercase tracking-wider">console</span>
                    </div>
                  </div>

                  {/* Terminal Outputs */}
                  <div className="font-mono text-[10.5px] leading-relaxed flex-grow flex flex-col gap-1 overflow-x-auto select-text scrollbar-thin">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="flex flex-col gap-0.5"
                      >
                        {activePrinciple.logs.map((log, lIdx) => (
                          <div key={lIdx} className={`${log.color || 'text-white/80'}`}>
                            {log.text}
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom description overlay */}
                  <div className="mt-6 pt-4 border-t border-white/[0.08] text-[11px] text-[#A1A1AA] font-sans flex items-start gap-2.5 select-none leading-relaxed">
                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="font-normal">{activePrinciple.desc}</p>
                  </div>

                </Card>
              </div>

            </div>
          </div>

          {/* Core Values Cards */}
          <div className="my-12 md:my-20">
            <SectionHeading
              eyebrow="Core Values"
              heading="How we govern our studio code bases."
              description="We adhere to a set of core values that ensure architectural standards and client project durability."
              className="text-center max-w-2xl mx-auto mb-10"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <Card key={idx} variant="surface" className="p-5 bg-white border-black/5 hover:border-black/10 duration-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-[#FAFAF8] border border-black/5 flex items-center justify-center mb-4 text-[#1B3A6B]">
                        <Icon size={16} />
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-[#0F0F0F] mb-2">{val.title}</h4>
                      <p className="text-[11px] leading-relaxed text-[#525252] font-normal">
                        {val.desc}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Industries We Serve */}
          <div className="my-10 md:my-20 bg-white border border-black/[0.05] rounded-2xl p-6 sm:p-8 md:p-12 shadow-xs">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Expertise Sectors</span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#0F0F0F] font-semibold mt-1">Industries We Serve</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              {industries.map((ind, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-black/[0.04] bg-[#FAFAF8]">
                  <CheckCircle size={14} className="text-[#0D9488] flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-[#0F0F0F]">{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why Graphxy Labs & CTA */}
          <div className="max-w-4xl mx-auto mt-10 md:mt-16 text-center" data-reveal>
            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 sm:p-10 md:p-12 shadow-xs">
              <h2 className="font-serif text-xl sm:text-2xl text-[#0F0F0F] font-light mb-3">
                Partner with Graphxy Labs
              </h2>
              <p className="text-xs sm:text-sm text-[#525252] max-w-lg mx-auto mb-6 leading-relaxed">
                Whether you need to scale existing web and mobile systems or request bespoke AI models and workflow automation, our engineering studio is ready to execute.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xs mx-auto">
                <Link to="/services" className="w-full">
                  <Button variant="brand" size="md" className="w-full">Explore Services</Button>
                </Link>
                <Link to="/contact" className="w-full">
                  <Button variant="outline" size="md" className="w-full">Get in Touch</Button>
                </Link>
              </div>
            </div>
          </div>

        </Container>
      </div>
    </PageShell>
  );
}

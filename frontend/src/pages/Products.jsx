import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import PageBackground from '../components/layout/PageBackground';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import { Link } from 'react-router-dom';
import { ClampboxPreview, ForklinePreview, LatticePreview } from '../components/sections/ProductShowcase';
import {
  CheckCircle, Compass, TrendingUp, Shield
} from 'lucide-react';

const STATUS = 'UNDER CONSIDERATION';

export default function Products() {
  return (
    <PageShell>
      {/* Page Header */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-12 sm:py-20 md:py-24 border-b border-black/[0.04]">
        <PageBackground />

        <Container className="relative z-10 text-center">
          <div className="max-w-2xl mx-auto mb-10 md:mb-16 text-center">
            <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Product Labs</span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-[#0F0F0F] mt-2 mb-4 tracking-tight">
              Software divisions under long-term consideration.
            </h1>
            <p className="text-sm md:text-base text-[#525252] leading-relaxed max-w-lg mx-auto">
              These products originate from deep research into real, underserved problems. Each is currently being evaluated, refined, and strategically planned — not yet committed to a release timeline.
            </p>
          </div>

          <div className="flex flex-col gap-16 sm:gap-20 md:gap-24 mt-8 md:mt-12 max-w-5xl mx-auto">

            {/* PRODUCT 1: CLAMPBOX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center text-left" id="clampbox">
              <div className="lg:col-span-5">
                <ClampboxPreview />
              </div>
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Tag variant="clampbox">{STATUS}</Tag>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">Clampbox</h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">AI Security Gateway & Prompt Governance</span>
                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  Enterprise-grade security gate for prompt evaluation and data leak prevention. Intercept browser chats or secure backend API integrations to scrub credentials, enforce compliance rules, and log decisions automatically — within a hardware-attested confidential enclave. Under long-term feasibility evaluation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Prompt Inspection</li><li>Secret Detection</li><li>Data Redaction</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Integration Layers</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Browser Extension</li><li>Developer API Proxy</li><li>Admin Policy Engine</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Research Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Semantic Threat Scan</li><li>LLM Classifiers</li><li>Confidential Enclaves</li>
                    </ul>
                  </div>
                </div>
                <Link to="/clampbox">
                  <Button variant="clampbox" size="md">Explore Clampbox</Button>
                </Link>
              </div>
            </div>

            {/* PRODUCT 3: FORKLINE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center text-left border-t border-black/[0.04] pt-12 sm:pt-16 md:pt-20" id="forkline">
              <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Tag variant="forkline">{STATUS}</Tag>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">Forkline</h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Restaurant Operations Platform</span>
                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  A hospitality operations engine designed to eliminate expensive hardware lock-ins. Forkline runs natively on generic touch displays, synchronizing seating layouts, kitchen queues, and order flows in real time. Being assessed for the mid-market hospitality sector.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Interactive Floor Maps</li><li>Mesh Kitchen Queue</li><li>Inventory Webhooks</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Use Cases</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Quick Service Dining</li><li>Floor Seating Tune-up</li><li>Shift Log Overviews</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Research Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>POS Terminal Syncs</li><li>Multi-location Console</li><li>Labor Planning Metrics</li>
                    </ul>
                  </div>
                </div>
                <Link to="/forkline">
                  <Button variant="forkline" size="md">Explore Forkline</Button>
                </Link>
              </div>
              <div className="lg:col-span-5 order-1 lg:order-2">
                <ForklinePreview />
              </div>
            </div>

            {/* PRODUCT 4: LATTICE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center text-left border-t border-black/[0.04] pt-12 sm:pt-16 md:pt-20" id="lattice">
              <div className="lg:col-span-5">
                <LatticePreview />
              </div>
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Tag variant="brand">{STATUS}</Tag>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">Lattice</h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Startup Operations Platform</span>
                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  Structured workspace for startup execution and operational clarity, consolidating fundraising trackers, runway logs, and team coordination workflows into a single, high-visibility dashboard for founders. Actively being scoped for early-stage startup teams.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Founder Milestone Logs</li><li>Interactive Runway Metrics</li><li>Deck Share Analytics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Use Cases</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Milestone Task Syncs</li><li>Fundraising CRM Stage</li><li>Equity SAFE Modeling</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Research Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Data Dilution Charts</li><li>Advisor Options Pools</li><li>Legal Document Vault</li>
                    </ul>
                  </div>
                </div>
                <Link to="/lattice">
                  <Button variant="brand" size="md">Explore Lattice</Button>
                </Link>
              </div>
            </div>

          </div>

          {/* Research pipeline note */}
          <div className="mt-16 pt-8 border-t border-black/[0.04]">
            <p className="text-xs text-[#A3A3A3] leading-relaxed max-w-xl mx-auto font-mono">
              Several additional product concepts are currently in our internal research pipeline and will be announced when they reach a level of strategic clarity appropriate for public disclosure.
            </p>
          </div>

        </Container>
      </div>
    </PageShell>
  );
}

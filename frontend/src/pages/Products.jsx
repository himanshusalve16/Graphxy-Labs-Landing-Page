import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import { Link } from 'react-router-dom';
import { GraphzyPreview, ClampboxPreview, ForklinePreview, LatticePreview } from '../components/sections/ProductShowcase';

// ==========================================
// MAIN PAGE EXPORT
// ==========================================

export default function Products() {
  return (
    <PageShell>
      {/* Page Header with radial grids */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#1B3A6B]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#B45309]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808026_1px,transparent_1px),linear-gradient(to_bottom,#80808026_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <Container className="relative z-10 text-center">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Product Labs</span>
            <h1 className="font-serif text-3xl md:text-5xl font-light text-[#0F0F0F] mt-2 mb-4 tracking-tight">
              Software divisions built on engineering precision.
            </h1>
            <p className="text-sm md:text-base text-[#525252] leading-relaxed max-w-lg mx-auto">
              We design and maintain focused digital products. Explore active prototypes, dev previews, and software concepts emerging from our studio.
            </p>
          </div>

          <div className="flex flex-col gap-24 mt-12 max-w-5xl mx-auto">
            
            {/* PRODUCT 1: GRAPHZY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center text-left" id="graphzy">
              <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Tag variant="math">COMING SOON</Tag>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                  Graphzy
                </h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Visualization Platform</span>

                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  An interactive learning web application that transforms plain-language questions into visual, parameter-rich math models. Built on a custom interactive math engine, it converts equations into coordinate grids that users can analyze and manipulate dynamically.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Interactive Graph Canvas</li>
                      <li>Parameter Auto-Mapping</li>
                      <li>Dynamic Sliders</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Use Cases</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>High School Algebra</li>
                      <li>Calculus Visuals</li>
                      <li>STEM Resource Guides</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>3D Molecule Canvas</li>
                      <li>Vector Fields Visuals</li>
                      <li>Biology SVG Maps</li>
                    </ul>
                  </div>
                </div>

                <Link to="/graphzy">
                  <Button variant="graphzy" size="md">Explore Graphzy</Button>
                </Link>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2">
                <GraphzyPreview />
              </div>
            </div>

            {/* PRODUCT 2: CLAMPBOX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center text-left border-t border-black/[0.04] pt-20" id="clampbox">
              <div className="lg:col-span-5">
                <ClampboxPreview />
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Tag variant="clampbox">ACTIVE</Tag>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                  Clampbox
                </h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">AI Security Gateway & Prompt Governance</span>

                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  Enterprise-grade security gate for prompt evaluation and data leak prevention. Intercept browser chats or secure backend API integrations to scrub credentials, enforce compliance rules, and log decisions automatically.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Prompt Inspection</li>
                      <li>Secret Detection</li>
                      <li>Data Redaction</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Use Cases</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Browser Guarding</li>
                      <li>Programmatic API Proxy</li>
                      <li>SOC 2 Compliance Audit</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Semantic Threat Scan</li>
                      <li>LLM Classifiers</li>
                      <li>Confidential Enclaves</li>
                    </ul>
                  </div>
                </div>

                <Link to="/clampbox">
                  <Button variant="clampbox" size="md">Explore Clampbox</Button>
                </Link>
              </div>
            </div>

            {/* PRODUCT 3: FORKLINE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center text-left border-t border-black/[0.04] pt-20" id="forkline">
              <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Tag variant="forkline">COMING SOON</Tag>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                  Forkline
                </h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Restaurant Operations Platform</span>

                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  An upcoming restaurant management and hospitality operations engine. Designed to eliminate expensive hardware lock-ins, Forkline runs natively on generic touch displays and monitors, synchronizing seating layouts, orders, and food prep speeds.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Interactive Floor Maps</li>
                      <li>Mesh Kitchen Queue</li>
                      <li>Inventory Webhooks</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Use Cases</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Quick Service Dining</li>
                      <li>Floor Seating Tune-up</li>
                      <li>Shift Log Overviews</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>POS Terminal Syncs</li>
                      <li>Multi-location Console</li>
                      <li>Labor Planning Metrics</li>
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center text-left border-t border-black/[0.04] pt-20" id="lattice">
              <div className="lg:col-span-5">
                <LatticePreview />
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Tag variant="brand">COMING SOON</Tag>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                  Lattice
                </h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Startup Operations Platform</span>

                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  Structured workspace for startup execution and operational clarity, consolidating fundraising trackers, runway logs, and team coordination workflows.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Founder Milestone Logs</li>
                      <li>Interactive Runway metrics</li>
                      <li>Deck Share Analytics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Use Cases</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Milestone Task Syncs</li>
                      <li>Fundraising CRM Stage</li>
                      <li>Equity SAFE modeling</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Data dilutive charts</li>
                      <li>Advisor Options Pools</li>
                      <li>Legal Document Vault</li>
                    </ul>
                  </div>
                </div>

                <Link to="/lattice">
                  <Button variant="brand" size="md">Explore Lattice</Button>
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </div>
    </PageShell>
  );
}

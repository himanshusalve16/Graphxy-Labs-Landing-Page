import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { 
  Building2, 
  Globe, 
  Smartphone, 
  Cpu, 
  BarChart3, 
  Terminal, 
  Workflow, 
  TrendingUp,
  Server,
  Network
} from 'lucide-react';

// ==========================================
// 1. DISTRIBUTED DATABASE SYNC PIPELINE VISUAL
// ==========================================
function DatabaseSyncVisual() {
  return (
    <div className="relative w-full h-[160px] bg-white border border-black/5 rounded-xl overflow-hidden flex items-center justify-center shadow-xs">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      
      <svg className="w-full h-full p-4" viewBox="0 0 320 140">
        {/* Connection Paths */}
        <line x1="40" y1="70" x2="160" y2="70" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
        <line x1="160" y1="70" x2="280" y2="70" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
        <path d="M 160,70 Q 220,110 280,70" stroke="rgba(27,58,107,0.1)" strokeWidth="1" strokeDasharray="3 3" fill="none" />

        {/* Pulsing particles */}
        <motion.circle
          r="3"
          fill="#1B3A6B"
          animate={{ cx: [40, 160], cy: [70, 70] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          r="3"
          fill="#0066CC"
          animate={{ cx: [160, 280], cy: [70, 70] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 0.8 }}
        />

        {/* Client Node */}
        <g transform="translate(40, 70)">
          <circle r="18" fill="#FAFAF8" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
          <foreignObject x="-9" y="-9" width="18" height="18">
            <div className="text-black/50 flex items-center justify-center w-full h-full">
              <Smartphone size={11} />
            </div>
          </foreignObject>
          <text y="28" textAnchor="middle" className="font-mono text-[7px] fill-black/40 uppercase">Terminal</text>
        </g>

        {/* Gateway Auth Node */}
        <g transform="translate(160, 70)">
          <circle r="20" fill="#EEF3FB" stroke="#1B3A6B" strokeWidth="1.5" />
          <motion.circle
            r="24"
            fill="none"
            stroke="#1B3A6B"
            strokeWidth="1"
            strokeDasharray="4 4"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <foreignObject x="-9" y="-9" width="18" height="18">
            <div className="text-[#1B3A6B] flex items-center justify-center w-full h-full">
              <Network size={11} />
            </div>
          </foreignObject>
          <text y="32" textAnchor="middle" className="font-mono text-[7px] fill-[#1B3A6B] uppercase font-bold">API Sync</text>
        </g>

        {/* Database cluster */}
        <g transform="translate(280, 70)">
          <circle r="18" fill="#FAFAF8" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
          <foreignObject x="-9" y="-9" width="18" height="18">
            <div className="text-black/50 flex items-center justify-center w-full h-full">
              <Server size={11} />
            </div>
          </foreignObject>
          <text y="28" textAnchor="middle" className="font-mono text-[7px] fill-black/40 uppercase">Cloud DB</text>
        </g>
      </svg>
    </div>
  );
}

// ==========================================
// 2. AI/ML NEURAL NETWORK VISUAL
// ==========================================
function NeuralPropagationVisual() {
  // Coords for input, hidden, output layers
  const inputY = [35, 70, 105];
  const hiddenY = [25, 55, 85, 115];
  const outputY = [50, 90];

  return (
    <div className="relative w-full h-[160px] bg-white border border-black/5 rounded-xl overflow-hidden flex items-center justify-center shadow-xs">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      
      <svg className="w-full h-full p-4" viewBox="0 0 320 140">
        {/* Draw Fully Connected Lines */}
        {inputY.map(y1 => hiddenY.map(y2 => (
          <line key={`l1-${y1}-${y2}`} x1="50" y1={y1} x2="160" y2={y2} stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
        )))}
        {hiddenY.map(y1 => outputY.map(y2 => (
          <line key={`l2-${y1}-${y2}`} x1="160" y1={y1} x2="270" y2={y2} stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
        )))}

        {/* Propagation pulse paths */}
        <motion.line x1="50" y1="70" x2="160" y2="55" stroke="#0066CC" strokeWidth="1.5" 
          initial={{ strokeDasharray: "10, 100", strokeDashoffset: 110 }}
          animate={{ strokeDashoffset: -110 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.line x1="160" y1="55" x2="270" y2="90" stroke="#0066CC" strokeWidth="1.5" 
          initial={{ strokeDasharray: "10, 100", strokeDashoffset: 110 }}
          animate={{ strokeDashoffset: -110 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />

        {/* Input Nodes */}
        {inputY.map((y, i) => (
          <circle key={`in-${i}`} cx="50" cy={y} r="5" fill="#FAFAF8" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        ))}
        {/* Hidden Nodes */}
        {hiddenY.map((y, i) => (
          <circle key={`hid-${i}`} cx="160" cy={y} r="5" fill="#EBF3FF" stroke="#0066CC" strokeWidth="1" />
        ))}
        {/* Output Nodes */}
        {outputY.map((y, i) => (
          <circle key={`out-${i}`} cx="270" cy={y} r="6" fill="#FAFAF8" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        ))}

        <text x="50" y="128" textAnchor="middle" className="font-mono text-[7px] fill-black/40 uppercase">Inputs</text>
        <text x="160" y="134" textAnchor="middle" className="font-mono text-[7px] fill-[#0066CC] uppercase font-bold">Heuristic</text>
        <text x="270" y="128" textAnchor="middle" className="font-mono text-[7px] fill-black/40 uppercase">Classify</text>
      </svg>
    </div>
  );
}

const servicesGrid = [
  { icon: Globe, title: "Web Development", desc: "Server-rendered React applications, responsive interfaces, and marketing frontends." },
  { icon: Smartphone, title: "Mobile Clients", desc: "iOS and Android client builds developed natively or through high-performance cross-platform engines." },
  { icon: Terminal, title: "Custom Logic Portals", desc: "Bespoke algorithmic routines, client-facing databases, and backend services." },
  { icon: BarChart3, title: "Data Analytics", desc: "Interactive metrics pipelines, business intelligence tools, and aggregated operations logs." },
  { icon: TrendingUp, title: "Scalable SaaS MVPs", desc: "Cloud database design, scalable architectures, and feature roadmap planning." },
  { icon: Workflow, title: "Workflow Automation", desc: "Event-triggered notification loops, Shift operations logs, and approval systems." }
];

export default function VerticalSections() {
  return (
    <section id="services" className="relative overflow-hidden py-12 sm:py-16 bg-[#FAFAF8] border-b border-black/[0.06]">
      {/* Background radial depth and grid overlay */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-[#1B3A6B]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-[#0066CC]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <Container className="relative z-10">
        <SectionHeading 
          eyebrow="Core Verticals"
          heading="Specialized engineering divisions focused on system execution."
          description="We operate across specialized technology sectors, demonstrating architectural authority and rigorous design standards."
        />

        {/* 1. FEATURED EXPERTISE BLOCKS (TWO COLUMNS WITH DYNAMIC DIAGRAMS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mb-10">
          {/* Featured Column 1: Distributed Architectures */}
          <Card variant="surface" className="p-6 bg-white border-black/5 hover:border-[#1B3A6B]/30 duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3FB] text-[#1B3A6B] flex items-center justify-center">
                  <Server size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#0F0F0F] font-bold">Custom Systems & ERP Architecture</h4>
                  <span className="font-mono text-[8px] text-black/40 uppercase">High-volume transactional pipelines</span>
                </div>
              </div>
              
              <p className="text-[11px] text-[#525252] leading-relaxed mb-6">
                We engineer robust business databases, customized CRM workflows, and multi-location sync protocols. Our architectures prioritize localized speed, data-integrity layers, and automated backups on generic servers.
              </p>
            </div>
            
            <DatabaseSyncVisual />
          </Card>

          {/* Featured Column 2: Advanced Intelligent Pipelines */}
          <Card variant="surface" className="p-6 bg-white border-black/5 hover:border-[#0066CC]/30 duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#EBF3FF] text-[#0066CC] flex items-center justify-center">
                  <Cpu size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#0F0F0F] font-bold">AI Heuristics & ML Classifiers</h4>
                  <span className="font-mono text-[8px] text-black/40 uppercase">Predictive modeling & natural parsing</span>
                </div>
              </div>
              
              <p className="text-[11px] text-[#525252] leading-relaxed mb-6">
                Integrating predictive algorithms and LLM contextual layers directly into client applications. We design secure heuristics to parse logs, classify user feedback patterns, and trigger smart business logic loops.
              </p>
            </div>
            
            <NeuralPropagationVisual />
          </Card>
        </div>

        {/* 2. SPECIALIZED SERVICES COMPACT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-black/[0.06] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm">
          {servicesGrid.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="p-5 border-b border-r border-black/[0.06] last:border-b-0 last:border-r-0 lg:[&:nth-child(3n)]:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0 sm:[&:nth-child(n+5)]:border-b-0 hover:bg-[#EEF3FB]/50 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-black/[0.06] flex items-center justify-center mb-3 text-[#1B3A6B] group-hover:scale-105 group-hover:bg-white transition-all duration-200">
                  <Icon size={16} />
                </div>
                <div className="text-xs font-semibold text-[#0F0F0F] mb-1">{item.title}</div>
                <div className="text-[11px] text-[#A3A3A3] leading-[1.55]">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

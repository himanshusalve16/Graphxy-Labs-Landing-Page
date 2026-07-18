import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import PageBackground from '../layout/PageBackground';
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
  Network,
  Code,
  Layers,
  GitMerge
} from 'lucide-react';

// ==========================================
// 1. DISTRIBUTED DATABASE SYNC PIPELINE VISUAL
// ==========================================
function DatabaseSyncVisual() {
  return (
    <div className="relative w-full h-[160px] bg-white border border-black/5 rounded-xl overflow-hidden flex items-center justify-center shadow-xs">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800f_1px,transparent_1px),linear-gradient(to_bottom,#8080800f_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      
      <svg className="w-full h-full p-4" viewBox="0 0 320 140">
        {/* Connection Paths */}
        <line x1="40" y1="70" x2="160" y2="70" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
        <line x1="160" y1="70" x2="280" y2="70" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
        <path d="M 160,70 Q 220,110 280,70" stroke="rgba(27,58,107,0.1)" strokeWidth="1" strokeDasharray="3 3" fill="none" />

        {/* Pulsing particles */}
        <motion.circle
          r="3"
          fill="#1B3A6B"
          cx="40"
          cy="70"
          animate={{ cx: [40, 160], cy: [70, 70] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          r="3"
          fill="#0066CC"
          cx="160"
          cy="70"
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
            cx="0"
            cy="0"
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800f_1px,transparent_1px),linear-gradient(to_bottom,#8080800f_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      
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
  { icon: Globe, title: "Web Development", desc: "Server-rendered React applications, highly responsive interfaces, and performant web portals." },
  { icon: Smartphone, title: "Mobile App Development", desc: "Native and cross-platform mobile client builds engineered for speed, responsiveness, and fluid interaction." },
  { icon: Cpu, title: "AI & Machine Learning", desc: "Integrating intelligent models, predictive analytics, and natural language processing engines directly into workflows." },
  { icon: GitMerge, title: "Automation Systems", desc: "Event-triggered processing loops, automated pipelines, and operations logs to remove manual friction." },
  { icon: Code, title: "Custom Software", desc: "Bespoke algorithmic routines, client-facing management databases, and performant backend engines." },
  { icon: Layers, title: "Cloud & DevOps", desc: "Robust database configurations, server replication, security vault enclaves, and scalable deployment pipelines." }
];

export default function VerticalSections() {
  return (
    <section id="services" className="relative overflow-hidden py-10 sm:py-14 md:py-20 bg-[#FAFAF8] border-b border-black/[0.06]">
      <PageBackground />
      
      <Container className="relative z-10">
        <SectionHeading 
          eyebrow="Core Services"
          heading="Rigorous engineering services for custom digital products."
          description="We deliver specialized engineering capabilities across critical technology domains, demonstrating high architectural standards and execution quality."
        />

        {/* 1. FEATURED EXPERTISE BLOCKS (TWO COLUMNS WITH DYNAMIC DIAGRAMS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-8 md:mt-10 mb-6 md:mb-10">
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

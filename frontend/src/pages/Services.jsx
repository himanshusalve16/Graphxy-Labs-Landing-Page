import React, { useState } from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Globe, 
  Smartphone, 
  Cpu, 
  BarChart3, 
  Terminal, 
  Workflow, 
  TrendingUp,
  ArrowRight,
  Server,
  Network,
  GitMerge,
  Shield,
  Activity
} from 'lucide-react';

// ==========================================
// 1. DATABASE SYNC INTERACTIVE PIPELINE
// ==========================================
function InteractiveDBSync() {
  const [pulseCount, setPulseCount] = useState(0);
  const [dbLogs, setDbLogs] = useState([
    { id: '1', msg: 'Terminal sync initialized', type: 'info' },
    { id: '2', msg: 'Cloud replica heartbeat: OK', type: 'success' }
  ]);

  const triggerSync = () => {
    setPulseCount(p => p + 1);
    const newLog = {
      id: Date.now().toString(),
      msg: `Pushed transaction batch #${Math.floor(Math.random() * 900) + 100}`,
      type: 'success'
    };
    setDbLogs(l => [newLog, ...l.slice(0, 3)]);
  };

  return (
    <div className="relative w-full bg-white border border-black/5 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
      <div className="flex justify-between items-center text-[9px] font-mono text-black/40">
        <span>TRANSACTIONAL DATABASE CLUSTER</span>
        <button 
          onClick={triggerSync}
          className="text-[#1B3A6B] hover:underline font-bold"
        >
          FORCE RETRY SYNC
        </button>
      </div>

      <svg className="w-full h-[90px]" viewBox="0 0 320 90">
        <line x1="40" y1="45" x2="160" y2="45" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
        <line x1="160" y1="45" x2="280" y2="45" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
        
        {/* Pulsing dots */}
        <motion.circle
          key={`pulse-${pulseCount}`}
          r="4"
          fill="#1B3A6B"
          animate={{ cx: [40, 160], cy: [45, 45] }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.circle
          key={`pulse2-${pulseCount}`}
          r="4"
          fill="#0066CC"
          animate={{ cx: [160, 280], cy: [45, 45] }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />

        {/* Nodes */}
        <g transform="translate(40, 45)">
          <circle r="14" fill="#FAFAF8" stroke="rgba(0,0,0,0.08)" />
          <foreignObject x="-7" y="-7" width="14" height="14">
            <div className="text-black/50 flex items-center justify-center w-full h-full"><Smartphone size={9} /></div>
          </foreignObject>
        </g>
        <g transform="translate(160, 45)">
          <circle r="16" fill="#EEF3FB" stroke="#1B3A6B" strokeWidth="1.5" />
          <foreignObject x="-8" y="-8" width="16" height="16">
            <div className="text-[#1B3A6B] flex items-center justify-center w-full h-full"><Network size={9} /></div>
          </foreignObject>
        </g>
        <g transform="translate(280, 45)">
          <circle r="14" fill="#FAFAF8" stroke="rgba(0,0,0,0.08)" />
          <foreignObject x="-7" y="-7" width="14" height="14">
            <div className="text-black/50 flex items-center justify-center w-full h-full"><Server size={9} /></div>
          </foreignObject>
        </g>
      </svg>

      <div className="bg-[#FAFAF8] rounded border border-black/5 p-2 font-mono text-[8.5px] text-left flex flex-col gap-1">
        {dbLogs.map(log => (
          <div key={log.id} className="flex justify-between items-center">
            <span className="text-black/60 truncate">{log.msg}</span>
            <span className={log.type === 'success' ? 'text-[#1E8A4A]' : 'text-[#1B3A6B]'}>[OK]</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. AI MODEL LAYER ANIMATION
// ==========================================
function InteractiveNeuralML() {
  const [activeNode, setActiveNode] = useState(null);
  
  const nodeInfo = {
    0: 'Raw Telemetry Input Layer (Client Metrics)',
    1: 'Heuristic Vector Space Weights Map',
    2: 'Sigmoid Probability Output (Classifier Flag)'
  };

  return (
    <div className="relative w-full bg-white border border-black/5 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
      <div className="flex justify-between items-center text-[9px] font-mono text-black/40">
        <span>NEURAL GRAPH PROPAGATION</span>
        <span>{activeNode !== null ? nodeInfo[activeNode] : 'HOVER NODES TO MAP WEIGHTS'}</span>
      </div>

      <svg className="w-full h-[95px]" viewBox="0 0 320 95">
        {/* Layer lines */}
        {[20, 50, 80].map(y1 => [15, 38, 61, 84].map(y2 => (
          <line key={`l1-${y1}-${y2}`} x1="50" y1={y1} x2="160" y2={y2} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
        )))}
        {[15, 38, 61, 84].map(y1 => [30, 70].map(y2 => (
          <line key={`l2-${y1}-${y2}`} x1="160" y1={y1} x2="270" y2={y2} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
        )))}

        {/* Pulse paths */}
        <motion.line x1="50" y1="50" x2="160" y2="38" stroke="#0066CC" strokeWidth="1.5" 
          initial={{ strokeDasharray: "10, 80", strokeDashoffset: 90 }}
          animate={{ strokeDashoffset: -90 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.line x1="160" y1="38" x2="270" y2="70" stroke="#0066CC" strokeWidth="1.5" 
          initial={{ strokeDasharray: "10, 80", strokeDashoffset: 90 }}
          animate={{ strokeDashoffset: -90 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 0.7 }}
        />

        {/* Node interaction mappings */}
        <circle cx="50" cy="50" r="7" fill="#FFFFFF" stroke="rgba(0,0,0,0.15)" className="cursor-pointer hover:stroke-[#0066CC]" onMouseEnter={() => setActiveNode(0)} onMouseLeave={() => setActiveNode(null)} />
        <circle cx="160" cy="38" r="7" fill="#EEF3FB" stroke="#0066CC" strokeWidth="1.5" className="cursor-pointer" onMouseEnter={() => setActiveNode(1)} onMouseLeave={() => setActiveNode(null)} />
        <circle cx="270" cy="70" r="7" fill="#FFFFFF" stroke="rgba(0,0,0,0.15)" className="cursor-pointer hover:stroke-[#0066CC]" onMouseEnter={() => setActiveNode(2)} onMouseLeave={() => setActiveNode(null)} />
      </svg>
    </div>
  );
}

// ==========================================
// 3. CAPABILITY MAP DIAGRAM
// ==========================================
function CapabilityMap({ onHoverNode, hoveredNode }) {
  const verticalsNodes = [
    { id: 'management', name: 'Management Systems', x: 160, y: 30, color: '#1B3A6B' },
    { id: 'web', name: 'Web Development', x: 70, y: 75, color: '#0066CC' },
    { id: 'mobile', name: 'Mobile Clients', x: 250, y: 75, color: '#92400E' },
    { id: 'ai', name: 'AI & Machine Learning', x: 160, y: 120, color: '#1B3A6B' }
  ];

  return (
    <Card variant="glass" className="w-full p-6 bg-white/70 border-white/80 shadow-md relative overflow-hidden">
      <div className="text-[10px] font-mono text-black/40 border-b border-black/[0.04] pb-3 mb-4 flex justify-between items-center">
        <span>ACTIVE ENGINEERING DIVISION LINKS</span>
        <span className="text-[#1B3A6B] font-bold uppercase tracking-wider">
          {hoveredNode ? hoveredNode : 'Hover nodes to visualize mapping'}
        </span>
      </div>

      <div className="w-full aspect-[320/160] relative">
        <svg viewBox="0 0 320 160" className="w-full h-full select-none">
          {/* Parent to branches */}
          <line x1="160" y1="30" x2="70" y2="75" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2" />
          <line x1="160" y1="30" x2="250" y2="75" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2" />
          <line x1="70" y1="75" x2="160" y2="120" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2" />
          <line x1="250" y1="75" x2="160" y2="120" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2" />
          <line x1="160" y1="30" x2="160" y2="120" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2" strokeDasharray="3 3" />

          {/* Active highlighted links */}
          {verticalsNodes.map((n) => {
            const isSelf = hoveredNode === n.name;
            return (
              <g 
                key={n.id}
                className="cursor-pointer"
                onMouseEnter={() => onHoverNode(n.name)}
                onMouseLeave={() => onHoverNode(null)}
              >
                <circle 
                  cx={n.x} 
                  cy={n.y} 
                  r={isSelf ? 15 : 12}
                  fill={isSelf ? n.color : '#FFFFFF'} 
                  stroke={isSelf ? '#FFFFFF' : 'rgba(0,0,0,0.08)'}
                  strokeWidth={isSelf ? 2 : 1}
                  className="transition-all duration-150 shadow-xs"
                />
                <circle 
                  cx={n.x} 
                  cy={n.y} 
                  r={isSelf ? 20 : 16}
                  fill="none" 
                  stroke={n.color}
                  strokeWidth={1}
                  className={`opacity-10 transition-all ${isSelf ? 'animate-ping' : ''}`}
                />
                <text 
                  x={n.x} 
                  y={n.y + (n.y > 75 ? 24 : -18)} 
                  textAnchor="middle" 
                  className={`font-mono text-[8px] font-semibold tracking-tight transition-colors duration-150 ${
                    isSelf ? 'fill-[#0F0F0F] font-bold' : 'fill-black/45'
                  }`}
                >
                  {n.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

// ==========================================
// 4. MAIN CAPABILITIES COMPONENT
// ==========================================
export default function Services() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const capabilities = [
    {
      id: "management-systems",
      icon: Building2,
      title: "Management Systems",
      desc: "Enterprise resource planning (ERP), client relation platforms (CRM), and central management suites tailored to aggregate operations.",
      features: ["ERP & CRM Platforms", "Internal Operations Dashboards", "Resource Allocators", "Administrative Suites"],
      visual: <InteractiveDBSync />
    },
    {
      id: "web-development",
      icon: Globe,
      title: "Web Development",
      desc: "Aesthetic, high-performance web applications built on reactive frameworks with speed, responsiveness, and premium design details.",
      features: ["SaaS Core Interfaces", "Corporate Landing Portals", "Responsive Web Apps", "SEO & Speed Optimization"],
      visual: (
        <div className="border border-black/5 bg-white p-4 rounded-xl flex flex-col gap-2 shadow-xs text-left">
          <span className="font-mono text-[9px] text-[#0066CC] font-bold uppercase">React Server Components Sync</span>
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066CC] animate-pulse" />
            <span className="text-[10px] text-black/60 font-sans leading-relaxed">Continuous delivery pipeline rendering dynamic layouts with CSS containment modules on Edge CDN roots.</span>
          </div>
        </div>
      )
    },
    {
      id: "mobile-apps",
      icon: Smartphone,
      title: "Mobile App Development",
      desc: "Native iOS and Android mobile platforms engineered for user retention, clean layouts, and smooth gesture animations.",
      features: ["Native iOS & Android", "Cross-Platform Frameworks", "Consumer App Ecosystems", "Offline-First Architectures"],
      visual: (
        <div className="border border-black/5 bg-[#FEF7EC] border-[#B45309]/10 p-4 rounded-xl flex items-center justify-between shadow-xs text-left">
          <div>
            <span className="font-mono text-[9px] text-[#92400E] font-bold uppercase block">Native Device Sync</span>
            <span className="text-[10px] text-black/60 leading-relaxed block mt-1">Accelerated graphic rendering loops utilizing native view controllers.</span>
          </div>
          <Smartphone size={24} className="text-[#92400E] opacity-45" />
        </div>
      )
    },
    {
      id: "ai-ml",
      icon: Cpu,
      title: "AI & Machine Learning",
      desc: "Integrating predictive models, natural language classification pipelines, recommendation logic, and generative agents securely.",
      features: ["Generative AI Pipelines", "Intent & Subject Classifiers", "Predictive Analytics", "Automated Agents"],
      visual: <InteractiveNeuralML />
    },
    {
      id: "data-science",
      icon: BarChart3,
      title: "Data Science & Analytics",
      desc: "Aggregating telemetry streams and raw databases into interactive graphs, metrics summaries, and automated reporting systems.",
      features: ["KPI & Metrics Dashboards", "Data Lake Consolidation", "Business Intelligence reporting", "Real-time Telemetry Maps"],
      visual: (
        <div className="border border-black/5 bg-white p-4 rounded-xl flex flex-col gap-2 shadow-xs text-left">
          <span className="font-mono text-[9px] text-[#1B3A6B] font-bold uppercase">Data Stream Aggregator</span>
          <div className="w-full h-1 bg-black/[0.05] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#1B3A6B] to-[#0066CC]" 
              animate={{ width: ['20%', '85%', '20%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-[9.5px] text-black/50 font-mono">Heartbeat Telemetry: 984 req/sec</span>
        </div>
      )
    },
    {
      id: "custom-software",
      icon: Terminal,
      title: "Custom Software",
      desc: "Bespoke development addressing workflow bottlenecks, API bridge integrations, and proprietary business applications.",
      features: ["Bespoke Business Logic", "Legacy Integration Bridges", "API Infrastructure Setup", "Secure Client Portals"],
      visual: (
        <div className="border border-black/5 bg-white p-4 rounded-xl flex flex-col gap-2 shadow-xs text-left font-mono text-[9px] text-black/60">
          <div className="flex justify-between border-b border-black/[0.04] pb-1.5 font-bold text-black/40">
            <span>TERMINAL MODULE</span>
            <span>STATUS</span>
          </div>
          <div className="flex justify-between">
            <span>&gt;_ api_bridge.js</span>
            <span className="text-[#1E8A4A]">CONNECTED</span>
          </div>
          <div className="flex justify-between">
            <span>&gt;_ crypto_verification</span>
            <span className="text-[#1B3A6B]">SECURED</span>
          </div>
        </div>
      )
    },
    {
      id: "automation",
      icon: Workflow,
      title: "Automation & Workflows",
      desc: "Replacing repetitive manual spreadsheets with scheduled webhooks, alert systems, approval pipelines, and task routers.",
      features: ["Approval & Verification Loops", "Third-party Webhook Syncs", "Scheduled Task Checkers", "Error Alert Dashboards"],
      visual: (
        <div className="border border-black/5 bg-white p-4 rounded-xl flex justify-between items-center shadow-xs text-left">
          <div>
            <span className="font-mono text-[9px] text-black/40 font-bold uppercase block">AUTOMATED PIPELINE</span>
            <span className="text-[10px] text-black/60 block mt-1">Scheduled cron webhook trigger status.</span>
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-[#1B3A6B]/40"
          >
            <GitMerge size={20} />
          </motion.div>
        </div>
      )
    },
    {
      id: "scalable-products",
      icon: TrendingUp,
      title: "Scalable Tech Products",
      desc: "Assisting startups from initial blueprint and database architecture design up to launch-ready Minimal Viable Products (MVPs).",
      features: ["MVP Engineering & Launch", "High-Volume Architecture", "Feature Priority Roadmap", "Cloud Infrastructure Setup"],
      visual: (
        <div className="border border-black/5 bg-white p-4 rounded-xl flex flex-col gap-2 shadow-xs text-left">
          <span className="font-mono text-[9px] text-black/45 font-bold uppercase">MVP RUNWAY TELEMETRY</span>
          <div className="flex justify-between items-center text-[10px] text-black/60 font-sans">
            <span>Estimated Launch Time</span>
            <span className="font-mono font-bold text-[#1E8A4A]">28 Days</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <PageShell>
      {/* Background Gradients & Mesh overlay */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#1B3A6B]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#0066CC]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <Container className="relative z-10">
          
          {/* Layout Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
            <div className="lg:col-span-7 max-w-xl text-left">
              <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Active Capabilities</span>
              <h1 className="font-serif text-3xl md:text-5xl font-light text-[#0F0F0F] mt-2 mb-4 tracking-tight">
                Eight divisions of technological execution.
              </h1>
              <p className="text-sm md:text-base text-[#525252] leading-relaxed">
                We design and engineer corporate portals, local systems, and predictive software dashboards. Explore the visual nodes mapping our active development divisions.
              </p>
            </div>
            
            <div className="lg:col-span-5 w-full">
              <CapabilityMap 
                onHoverNode={setHoveredNode} 
                hoveredNode={hoveredNode} 
              />
            </div>
          </div>

          {/* Active capability pipelines instead of static grid cards */}
          <div className="flex flex-col gap-12 mt-12 max-w-4xl mx-auto">
            {capabilities.map((c) => {
              const IconComp = c.icon;
              const isHighlighted = hoveredNode === c.title;

              return (
                <Card 
                  key={c.id} 
                  id={c.id}
                  variant="surface" 
                  className={`p-6 md:p-8 bg-white border-black/5 flex flex-col md:grid md:grid-cols-12 gap-8 items-center transition-all duration-300 ${
                    isHighlighted ? 'border-[#1B3A6B]/25 shadow-md scale-[1.01]' : ''
                  }`}
                >
                  {/* Left Column: text specifications */}
                  <div className="md:col-span-7 text-left flex flex-col justify-center w-full">
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150 ${
                        isHighlighted ? 'bg-[#1B3A6B] text-white' : 'bg-[#EEF3FB] text-[#1B3A6B]'
                      }`}>
                        <IconComp size={18} />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-[#0F0F0F] font-semibold">{c.title}</h3>
                        <span className="font-mono text-[8.5px] text-black/40 uppercase block">Active capability node</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#525252] leading-relaxed mb-6">
                      {c.desc}
                    </p>

                    <div className="border-t border-black/[0.04] pt-4">
                      <span className="font-mono text-[8px] text-[#A3A3A3] uppercase tracking-wider block mb-2.5">Key Offerings</span>
                      <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {c.features.map((f, idx) => (
                          <li key={idx} className="font-sans text-[10.5px] text-[#525252] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B]/30" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: active visual simulation workflow */}
                  <div className="md:col-span-5 w-full">
                    {c.visual}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Dedicated Section CTA */}
          <div className="mt-20 max-w-3xl mx-auto">
            <Card variant="glass" className="p-8 md:p-12 bg-white/70 border-white text-center shadow-md">
              <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-4 font-light">Have a custom software requirement?</h2>
              <p className="text-xs md:text-sm text-[#525252] max-w-lg mx-auto leading-relaxed mb-8">
                Whether you need to outsource full-stack system architecture or prototype a new mobile app, our engineers are ready to build it.
              </p>
              <Link to="/contact">
                <Button variant="brand" className="px-8 shadow-sm">
                  Schedule a Consultation
                </Button>
              </Link>
            </Card>
          </div>

        </Container>
      </div>
    </PageShell>
  );
}

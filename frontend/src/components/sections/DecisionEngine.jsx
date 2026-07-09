import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../layout/Container';
import PageBackground from '../layout/PageBackground';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { 
  Cpu, Database, Shield, Server, Cloud, Code, LineChart, Layers, HelpCircle
} from 'lucide-react';

const REQUIREMENTS = [
  {
    id: 'ai-saas',
    name: 'AI SaaS Platform',
    description: 'High-scale multi-tenant platform with real-time LLM inference, embedding search, and usage-based billing.',
    nodes: [
      { id: 'type', label: 'Application Type', val: 'Multi-tenant SaaS Platform', icon: Layers, desc: 'Isolates tenant metadata, billing quotas, and configuration parameters safely.' },
      { id: 'frontend', label: 'Frontend Stack', val: 'Next.js App Router & Tailwind', icon: Code, desc: 'Server-side rendering optimizes page loads, and React Server Components fetch DB records directly.' },
      { id: 'backend', label: 'Backend Architecture', val: 'Go Microservices (gRPC)', icon: Server, desc: 'High-concurrency Go services provide sub-millisecond network speeds and low memory footprints.' },
      { id: 'auth', label: 'Authentication', val: 'Clerk + Row-Level Security', icon: Shield, desc: 'Delegates auth state to edge nodes, verifying JSON Web Tokens without roundtrips to primary DB.' },
      { id: 'db', label: 'Primary Database', val: 'PostgreSQL + pgvector', icon: Database, desc: 'Stores tabular user records alongside high-dimensional vector embeddings in unified SQL tables.' },
      { id: 'cloud', label: 'Cloud Infrastructure', val: 'AWS EKS (Kubernetes)', icon: Cloud, desc: 'Scales application pods automatically based on CPU and custom memory triggers.' },
      { id: 'ai', label: 'AI Integration', val: 'OpenAI Gateway & Redis Cache', icon: Cpu, desc: 'Proxies AI api keys through a rate-limited gateway, caching frequent query outputs in Redis.' },
      { id: 'scale', label: 'Scalability Plan', val: 'Read Replicas & Edge Caching', icon: LineChart, desc: 'Spreads read traffic across geo-distributed database replicas, caching assets on Cloudflare CDN.' }
    ]
  },
  {
    id: 'restaurant-pos',
    name: 'Restaurant Management POS',
    description: 'High-concurrency point-of-sale system requiring zero offline latency, kitchen queuing, and live orders.',
    nodes: [
      { id: 'type', label: 'Application Type', val: 'Real-time POS & Kitchen Engine', icon: Layers, desc: 'Synchronizes order ticket states continuously across dining floors and kitchen displays.' },
      { id: 'frontend', label: 'Frontend Stack', val: 'Vite React SPA + Tailwind', icon: Code, desc: 'Lightweight client bundle runs inside local tablets, connecting via persistent WebSockets.' },
      { id: 'backend', label: 'Backend Architecture', val: 'Node.js + NestJS (WebSockets)', icon: Server, desc: 'Event-driven server process pushes order updates to client screens in under 10 milliseconds.' },
      { id: 'auth', label: 'Authentication', val: 'JWT + Local Pin Enforcer', icon: Shield, desc: 'Fast pin-based employee shifts authentication, operating fully offline if the WAN connection drops.' },
      { id: 'db', label: 'Primary Database', val: 'PostgreSQL + TimescaleDB', icon: Database, desc: 'Tracks fast table ticket state transitions, storing aggregated historical sales records.' },
      { id: 'cloud', label: 'Cloud Infrastructure', val: 'Render Cloud + Local Sync', icon: Cloud, desc: 'Deploys stateless servers to managed containers, maintaining local gateway fallbacks.' },
      { id: 'ai', label: 'AI Integration', val: 'Local Demand Forecaster (Scikit)', icon: Cpu, desc: 'Runs background regressions on past order logs to predict daily inventory depletion metrics.' },
      { id: 'scale', label: 'Scalability Plan', val: 'Redis Pub/Sub Sync', icon: LineChart, desc: 'Ensures real-time synchronization between independent client terminals and kitchen monitors.' }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare Management System',
    description: 'HIPAA-compliant patient portal with end-to-end audit logs, encrypted records, and tele-health routing.',
    nodes: [
      { id: 'type', label: 'Application Type', val: 'HIPAA-Compliant Patient Portal', icon: Layers, desc: 'Enforces strict data classification, patient access logs, and E2E encryption schemes.' },
      { id: 'frontend', label: 'Frontend Stack', val: 'Next.js App Router (SSG / SSR)', icon: Code, desc: 'Optimizes compliance layouts, statically compiling marketing resources while rendering patient logs dynamically.' },
      { id: 'backend', label: 'Backend Architecture', val: 'Java Spring Boot (Microservices)', icon: Server, desc: 'Provides enterprise-grade type safety, thread pooling, and built-in OAuth/SAML plugins.' },
      { id: 'auth', label: 'Authentication', val: 'SAML SSO + Multi-factor SMS', icon: Shield, desc: 'Integrates with hospital directory systems using federated authentication and hardware keys.' },
      { id: 'db', label: 'Primary Database', val: 'AWS Aurora PostgreSQL (Encrypted)', icon: Database, desc: 'Implements AES-256 storage volume encryption and immutable audit logs on separate tables.' },
      { id: 'cloud', label: 'Cloud Infrastructure', val: 'AWS GovCloud VPC', icon: Cloud, desc: 'Isolates patient data in federal-grade secure regions, routing traffic through secure VPN tunnels.' },
      { id: 'ai', label: 'AI Integration', val: 'AWS Comprehend Medical', icon: Cpu, desc: 'Scans unstructured clinical notes to extract symptoms, prescriptions, and dosage metrics.' },
      { id: 'scale', label: 'Scalability Plan', val: 'Multi-AZ Auto-Failover', icon: LineChart, desc: 'Maintains live hot-standby databases in separate availability zones for near-zero failover downtime.' }
    ]
  },
  {
    id: 'startup-ops',
    name: 'Startup Operations Suite',
    description: 'Fast, collaborative dashboard consolidating SAFE calculators, runways, and documents.',
    nodes: [
      { id: 'type', label: 'Application Type', val: 'Collaborative Workspace Platform', icon: Layers, desc: 'Handles simultaneous document edits, runway projections, and equity calculations.' },
      { id: 'frontend', label: 'Frontend Stack', val: 'React + Radix UI + Tailwind', icon: Code, desc: 'Builds responsive layouts using unstyled Radix primitives to guarantee high accessibility.' },
      { id: 'backend', label: 'Backend Architecture', val: 'Node.js Express + TS', icon: Server, desc: 'Maintains low latency, processing JSON calculations quickly without heavy backend overhead.' },
      { id: 'auth', label: 'Authentication', val: 'Supabase Auth (Magic Links)', icon: Shield, desc: 'Simplifies registration using passwordless sign-ins and secure OAuth provider links.' },
      { id: 'db', label: 'Primary Database', val: 'Supabase PostgreSQL (Serverless)', icon: Database, desc: 'Scales connection pools dynamically, letting early startups run at near-zero costs.' },
      { id: 'cloud', label: 'Cloud Infrastructure', val: 'Vercel Edge Functions', icon: Cloud, desc: 'Serves dynamic files and API responses from the nearest edge server location.' },
      { id: 'ai', label: 'AI Integration', val: 'Vector Search Summary', icon: Cpu, desc: 'Indexes shared deck materials, letting users query operational data via natural language.' },
      { id: 'scale', label: 'Scalability Plan', val: 'Serverless Database Scaling', icon: LineChart, desc: 'Autoscales compute resources instantly during user traffic surges, saving capital during idle hours.' }
    ]
  }
];

const NODE_DETAILS = {
  // Types
  'Multi-tenant SaaS Platform': {
    why: 'Required to isolate tenant schemas, control user tier permissions, and limit resource usage.',
    benefits: 'Centralized updates, uniform data schema, easier tenant backup extraction.',
    tradeoffs: 'High risk of noisy-neighbor issues if container CPU pools are poorly partitioned.',
    integrations: 'Integrates directly with billing gateways (Stripe) and identity systems.'
  },
  'Real-time POS & Kitchen Engine': {
    why: 'Designed to prevent server delay bottlenecks on active dining room floors.',
    benefits: 'Instant notifications, concurrent ticket orders, offload computation to client.',
    tradeoffs: 'Higher frontend state complexity; requires local backup storage to handle packet drops.',
    integrations: 'Connects directly with WebSocket managers and network printers.'
  },
  'HIPAA-Compliant Patient Portal': {
    why: 'Demanded by healthcare regulations to secure PHI (Protected Health Information).',
    benefits: 'Zero regulatory risk, complete compliance trace, secure record access.',
    tradeoffs: 'Higher development overhead and latency due to continuous application-layer encryption.',
    integrations: 'Integrates with hospital EHR servers via FHIR standard APIs.'
  },
  'Collaborative Workspace Platform': {
    why: 'Enables instant coordination across remote startup teams without reload delays.',
    benefits: 'Cohesive workflow, unified user roles, real-time reactive UI indicators.',
    tradeoffs: 'Requires custom operational-transformation or CRDT libraries to resolve overlapping updates.',
    integrations: 'Links operational spreadsheets with document generation services.'
  },
  // Frontend
  'Next.js App Router & Tailwind': {
    why: 'Provides optimal mix of static pre-rendering and dynamic page updates.',
    benefits: 'Fast initial load, standard design system tokens, CSS bundles compiled automatically.',
    tradeoffs: 'React Server Component execution paths require careful data serialization.',
    integrations: 'Directly hooks into edge hosting layers like Vercel or Netlify.'
  },
  'Vite React SPA + Tailwind': {
    why: 'Builds a pure client asset bundle that doesn\'t depend on server-side rendering.',
    benefits: 'Instant local load times, predictable offline routing, easy desktop packaging.',
    tradeoffs: 'Zero SEO capability (acceptable for logged-in employee dashboards).',
    integrations: 'Embeddable in Electron or Capacitor wrappers for tablet hardware.'
  },
  'React + Radix UI + Tailwind': {
    why: 'Guarantees clean, keyboard-accessible interaction states across the platform.',
    benefits: 'Highly accessible out-of-the-box, flexible design style override.',
    tradeoffs: 'Requires developer implementation for raw focus behaviors.',
    integrations: 'Links cleanly with standard client-side state managers.'
  },
  'Next.js App Router (SSG / SSR)': {
    why: 'Allows secure medical checklists to be loaded instantly from global locations.',
    benefits: 'Near-zero server costs for landing pages, high uptime.',
    tradeoffs: 'Frequent page updates require cache invalidation strategies.',
    integrations: 'Secured behind global firewall nodes.'
  },
  // Backend
  'Go Microservices (gRPC)': {
    why: 'Provides native compiled speed and tiny memory footprints under high load.',
    benefits: 'Sub-millisecond API speeds, strongly typed gRPC proto definitions.',
    tradeoffs: 'Requires boilerplate code for routine operations compared to framework-heavy platforms.',
    integrations: 'Communicates inside inner cluster networks using HTTP/2 protocols.'
  },
  'Node.js + NestJS (WebSockets)': {
    why: 'Simplifies event routing and connection management for live sockets.',
    benefits: 'Highly structure codebase, easy JavaScript sharing with client interfaces.',
    tradeoffs: 'Single-threaded event loop can block under complex math calculation routines.',
    integrations: 'Exposes clean REST APIs alongside real-time gateway connections.'
  },
  'Java Spring Boot (Microservices)': {
    why: 'Ensures absolute security, concurrency, and industry-standard regulatory testing.',
    benefits: 'Robust transaction boundaries, enterprise-grade dependencies.',
    tradeoffs: 'Slow server boot times, high memory runtime footprint.',
    integrations: 'Accesses LDAP directory services and legacy medical databases.'
  },
  'Node.js Express + TS': {
    why: 'Quick setup, highly modular, scales cleanly with minimal configuration.',
    benefits: 'Fast routing layer, simple middleware architecture.',
    tradeoffs: 'No built-in architectural structure; relies on developer self-discipline.',
    integrations: 'Pairs with serverless hosting and serverless SQL query clients.'
  },
  // Database
  'PostgreSQL + pgvector': {
    why: 'Avoids complex multi-database synchronization problems by using relational SQL for vector data.',
    benefits: 'Unified transactions, standard SQL syntax, ACID compliance for vector collections.',
    tradeoffs: 'Indices require custom tuning compared to dedicated vector-only servers.',
    integrations: 'Links natively with standard ORMs like Prisma or Drizzle.'
  },
  'PostgreSQL + TimescaleDB': {
    why: 'Stores sales histories and system events efficiently in auto-partitioned hyper-tables.',
    benefits: 'Fast time-series calculations, handles millions of events without performance drop.',
    tradeoffs: 'Increases local database resource requirements.',
    integrations: 'Exposes metrics cleanly to SQL dashboard tools.'
  },
  'AWS Aurora PostgreSQL (Encrypted)': {
    why: 'Deploys high-performance SQL with automated replication and encryption.',
    benefits: 'Near-infinite storage scaling, secure data storage at rest.',
    tradeoffs: 'Locks infrastructure configuration to AWS tools.',
    integrations: 'Directly hooks into secure VPC endpoints.'
  },
  'Supabase PostgreSQL (Serverless)': {
    why: 'Allows scaling serverless compute instances from zero to maximum capacity instantly.',
    benefits: 'Autoscaling connection pools, built-in REST API generation.',
    tradeoffs: 'Cold-start latency spikes when databases are dormant.',
    integrations: 'Hooks cleanly to client-side real-time database listeners.'
  }
};

const DEFAULT_DETAIL = {
  why: 'Select any node in the decision tree to inspect Graphxy Labs\' strategic architectural reasoning.',
  benefits: 'Displays advantages and efficiency gains.',
  tradeoffs: 'Details real-world architectural compromises.',
  integrations: 'Shows how different stack components coordinate.'
};

export default function DecisionEngine() {
  const [selectedReq, setSelectedReq] = useState(REQUIREMENTS[0]);
  const [activeNode, setActiveNode] = useState(null);

  // Reset active node detail view when requirement changes
  useEffect(() => {
    setActiveNode(null);
  }, [selectedReq]);

  const activeNodeInfo = activeNode 
    ? (NODE_DETAILS[activeNode.val] || {
        why: activeNode.desc,
        benefits: 'Reduces developmental overhead, fits system runtime specs.',
        tradeoffs: 'Requires developer discipline and correct environment configuration.',
        integrations: 'Integrates with neighbouring nodes in the architecture pipeline.'
      })
    : DEFAULT_DETAIL;

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-[#FAFAF8] border-b border-black/[0.06] relative overflow-hidden">
      {/* Grid Blueprint Overlay */}
      <PageBackground />
      
      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Architectural Scoping"
          heading="Interactive Engineering Decision Engine"
          description="Explore how Graphxy Labs maps complex customer specifications to production-grade software architectures before writing the first line of code."
        />

        {/* Selection Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 mt-6">
          {REQUIREMENTS.map(req => {
            const active = req.id === selectedReq.id;
            return (
              <button
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all duration-200 ${
                  active 
                    ? 'bg-[#1B3A6B] border-[#1B3A6B] text-white shadow-md' 
                    : 'bg-white border-black/5 text-[#525252] hover:bg-[#F4F4F4] hover:text-[#0F0F0F]'
                }`}
              >
                {req.name}
              </button>
            );
          })}
        </div>

        {/* Workspace Card */}
        <Card variant="surface" className="bg-white/80 backdrop-blur-sm border-black/5 shadow-sm rounded-3xl p-5 md:p-8 overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Tree Workspace Visualizer */}
            <div className="flex-1 min-h-[380px] bg-[#071328] rounded-2xl relative p-6 overflow-hidden flex flex-col justify-between border border-white/5">
              {/* Workspace grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              
              {/* Workspace Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="font-mono text-[9px] text-white/50 tracking-wider">WORKSPACE // DECISION_TREE.SYS</span>
                </div>
                <span className="font-mono text-[8.5px] text-[#00AAFF] font-bold">{selectedReq.name.toUpperCase()}</span>
              </div>

              {/* Responsive Node Layout */}
              <div className="flex-1 flex flex-col justify-center relative py-4 z-10">
                {/* SVG Connecting lines behind nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 280" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1B3A6B" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#00AAFF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#1B3A6B" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  {/* Draw vertical connections for progressive nodes */}
                  <motion.line 
                    x1="250" y1="20" x2="250" y2="260" 
                    stroke="url(#lineGrad)" strokeWidth={1}
                    initial={{ strokeDasharray: "10 5" }} 
                    animate={{ strokeDashoffset: [0, -30] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </svg>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                  <AnimatePresence mode="popLayout">
                    {selectedReq.nodes.map((node, index) => {
                      const NodeIcon = node.icon;
                      const active = activeNode?.id === node.id;
                      return (
                        <motion.button
                          key={`${selectedReq.id}-${node.id}`}
                          initial={{ opacity: 0, scale: 0.9, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -15 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          onClick={() => setActiveNode(node)}
                          className={`p-3 rounded-xl border flex flex-col text-left group transition-all duration-200 ${
                            active 
                              ? 'bg-white border-[#00AAFF] text-[#071328] shadow-[0_0_15px_rgba(0,170,255,0.4)]' 
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-mono text-[7px] ${active ? 'text-[#00AAFF]' : 'text-white/40'}`}>
                              NODE_{index + 1}
                            </span>
                            <NodeIcon size={12} className={active ? 'text-[#00AAFF]' : 'text-white/60'} />
                          </div>
                          <div className={`text-[8.5px] font-bold uppercase tracking-wider ${active ? 'text-black/50' : 'text-white/40'}`}>
                            {node.label}
                          </div>
                          <div className={`text-[10.5px] font-semibold font-serif truncate w-full mt-0.5 ${active ? 'text-[#071328]' : 'text-white/90'}`}>
                            {node.val}
                          </div>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footnote instruction */}
              <div className="mt-4 border-t border-white/5 pt-2 z-10 flex justify-between items-center text-white/30 font-mono text-[8px]">
                <span>STATUS: STABLE</span>
                <span>TAP ANY ARCHITECTURAL NODE TO INSPECT</span>
              </div>
            </div>

            {/* Glass Info Panel */}
            <div className="w-full lg:w-[320px] flex flex-col justify-between bg-black/[0.02] border border-black/5 rounded-2xl p-5 md:p-6">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-black/[0.04] pb-3">
                  <HelpCircle size={14} className="text-[#1B3A6B]" />
                  <span className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest">
                    {activeNode ? `${activeNode.label} Analysis` : 'Node Analysis'}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNode ? activeNode.id : 'default'}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4 text-xs"
                  >
                    {activeNode && (
                      <div>
                        <div className="font-mono text-[8px] text-[#1B3A6B] font-bold uppercase mb-0.5">SELECTED SYSTEM</div>
                        <div className="font-serif text-sm font-semibold text-[#0F0F0F] mb-1">{activeNode.val}</div>
                      </div>
                    )}

                    <div>
                      <div className="font-mono text-[8px] text-black/35 font-bold uppercase mb-1">Architectural Rationale</div>
                      <p className="text-[#525252] leading-relaxed">{activeNodeInfo.why}</p>
                    </div>

                    {activeNode && (
                      <>
                        <div>
                          <div className="font-mono text-[8px] text-[#1E8A4A] font-bold uppercase mb-1">Key Benefits</div>
                          <p className="text-[#525252] leading-relaxed">{activeNodeInfo.benefits}</p>
                        </div>

                        <div>
                          <div className="font-mono text-[8px] text-[#B45309] font-bold uppercase mb-1">Core Tradeoffs</div>
                          <p className="text-[#525252] leading-relaxed">{activeNodeInfo.tradeoffs}</p>
                        </div>

                        <div>
                          <div className="font-mono text-[8px] text-[#1B3A6B] font-bold uppercase mb-1">Integration Layer</div>
                          <p className="text-[#525252] leading-relaxed">{activeNodeInfo.integrations}</p>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {!activeNode && (
                <div className="mt-8 border-t border-black/[0.04] pt-4 text-center">
                  <p className="font-mono text-[8.5px] text-[#A3A3A3]">
                    Click any architectural component in the workspace grid to analyze tradeoffs, benefits, and system integrations.
                  </p>
                </div>
              )}
            </div>

          </div>
        </Card>
      </Container>
    </section>
  );
}

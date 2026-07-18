import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../layout/Container';
import PageBackground from '../layout/PageBackground';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { 
  Users, Layers, Shield, Server, Database, Zap, Cpu, Terminal, ArrowRight, Play, Pause
} from 'lucide-react';

// Modules in the system
const MODULES = [
  { id: 'users', label: 'Users & Traffic', icon: Users, x: 50, y: 140, color: '#3B82F6' },
  { id: 'gateway', label: 'API Gateway', icon: Layers, x: 170, y: 140, color: '#10B981' },
  { id: 'auth', label: 'Auth Service', icon: Shield, x: 170, y: 50, color: '#EF4444' },
  { id: 'app', label: 'App Server', icon: Server, x: 290, y: 140, color: '#8B5CF6' },
  { id: 'cache', label: 'Redis Cache', icon: Zap, x: 290, y: 50, color: '#F59E0B' },
  { id: 'db', label: 'PostgreSQL DB', icon: Database, x: 410, y: 140, color: '#EC4899' },
  { id: 'ai', label: 'AI Inference', icon: Cpu, x: 410, y: 230, color: '#06B6D4' }
];

// Paths connecting modules (source -> target)
const CONNECTIONS = [
  { from: 'users', to: 'gateway', flow: 'bidirectional' },
  { from: 'gateway', to: 'auth', flow: 'bidirectional' },
  { from: 'gateway', to: 'app', flow: 'forward' },
  { from: 'app', to: 'cache', flow: 'bidirectional' },
  { from: 'app', to: 'db', flow: 'bidirectional' },
  { from: 'app', to: 'ai', flow: 'bidirectional' }
];

export default function SystemSimulation() {
  const [hoveredModule, setHoveredModule] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [metrics, setMetrics] = useState({
    rps: 1240,
    latency: 28,
    cacheHit: 94.2,
    queue: 2,
    dbConns: 48,
    aiRequests: 18
  });
  const [logs, setLogs] = useState([
    { time: '21:14:02', event: 'SYS: API Gateway routing initialization: SUCCESS' },
    { time: '21:14:03', event: 'AUTH: Token validation completed for tenant_idx_8' },
    { time: '21:14:04', event: 'DB: pg_stat_activity connection pool scaled to 48' }
  ]);
  const [packets, setPackets] = useState([]);
  const packetIdCounter = useRef(0);

  // Periodic metrics update
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMetrics(prev => ({
        rps: Math.max(900, Math.min(1600, prev.rps + Math.floor(Math.random() * 80 - 40))),
        latency: Math.max(18, Math.min(65, prev.latency + Math.floor(Math.random() * 6 - 3))),
        cacheHit: Math.max(90, Math.min(99, parseFloat((prev.cacheHit + (Math.random() * 0.4 - 0.2)).toFixed(1)))),
        queue: Math.max(0, Math.min(8, prev.queue + Math.floor(Math.random() * 3 - 1.5))),
        dbConns: Math.max(40, Math.min(80, prev.dbConns + Math.floor(Math.random() * 4 - 2))),
        aiRequests: Math.max(10, Math.min(30, prev.aiRequests + Math.floor(Math.random() * 4 - 2)))
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Telemetry Log Updates
  useEffect(() => {
    if (!isPlaying) return;
    const logTemplates = [
      'GW: Route matched: GET /api/v1/auth/session',
      'CACHE: Cache HIT on key: user_profile:tenant_31',
      'DB: Query execution: SELECT * FROM patient_records LIMIT 5',
      'AI: Vector embeddings generated: 1536 dimensions',
      'GW: Payload decrypted successfully via AES-GCM-256',
      'SYS: Memory heap cleanup completed'
    ];

    const interval = setInterval(() => {
      const timeStr = new Date().toTimeString().split(' ')[0];
      const randomLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      setLogs(prev => [...prev.slice(-4), { time: timeStr, event: randomLog }]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Packets Simulator Loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const targetConn = CONNECTIONS[Math.floor(Math.random() * CONNECTIONS.length)];
      const sourceNode = MODULES.find(m => m.id === targetConn.from);
      const destNode = MODULES.find(m => m.id === targetConn.to);
      if (sourceNode && destNode) {
        const newPacket = {
          id: packetIdCounter.current++,
          startX: sourceNode.x,
          startY: sourceNode.y,
          endX: destNode.x,
          endY: destNode.y,
          color: sourceNode.color
        };
        setPackets(prev => [...prev.slice(-15), newPacket]);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const isModuleHighlighted = (id) => {
    if (!hoveredModule) return true;
    if (hoveredModule === id) return true;
    // Check if connected
    return CONNECTIONS.some(conn => 
      (conn.from === hoveredModule && conn.to === id) || 
      (conn.to === hoveredModule && conn.from === id)
    );
  };

  const isConnectionHighlighted = (from, to) => {
    if (!hoveredModule) return true;
    return (from === hoveredModule || to === hoveredModule);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-black/[0.06] relative overflow-hidden">
      <PageBackground />
      
      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Telemetry Dashboard"
          heading="Live Software System Simulation"
          description="Observe the real-time runtime behavior of systems built by Graphxy Labs. Interact with components to isolate database queries, cache hits, and background execution loops."
        />

        <div className="mt-10 sm:mt-12 bg-[#090D16] border border-white/5 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col xl:flex-row gap-8">
          
          {/* Main Visualizer Area */}
          <div className="flex-1 flex flex-col justify-between min-h-[380px] relative">
            
            {/* Visualizer Toolbar */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-mono text-[10px] text-white/60 tracking-wider">LIVE PRODUCTION SIMULATOR // REGION_US_EAST</span>
              </div>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 font-mono text-[9px] text-[#A3A3A3] hover:text-white transition-colors bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-md"
              >
                {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
            </div>

            {/* Architecture SVG canvas */}
            <div className="flex-1 relative flex items-center justify-center py-6 min-h-[320px]">
              <svg 
                className="w-full max-w-[500px] h-[280px] overflow-visible" 
                viewBox="0 0 500 280"
              >
                <defs>
                  {MODULES.map(m => (
                    <radialGradient key={`grad-${m.id}`} id={`glow-${m.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={m.color} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={m.color} stopOpacity="0" />
                    </radialGradient>
                  ))}
                </defs>

                {/* SVG connection lines */}
                {CONNECTIONS.map((conn, idx) => {
                  const source = MODULES.find(m => m.id === conn.from);
                  const dest = MODULES.find(m => m.id === conn.to);
                  if (!source || !dest) return null;
                  const highlighted = isConnectionHighlighted(conn.from, conn.to);
                  return (
                    <g key={`conn-${idx}`}>
                      {/* Outer glow line */}
                      <line 
                        x1={source.x} y1={source.y} 
                        x2={dest.x} y2={dest.y} 
                        stroke={source.color} 
                        strokeWidth={highlighted ? 3 : 1} 
                        opacity={highlighted ? 0.35 : 0.04}
                        style={{ transition: 'all 0.3s' }}
                      />
                      {/* Inner route line */}
                      <line 
                        x1={source.x} y1={source.y} 
                        x2={dest.x} y2={dest.y} 
                        stroke={highlighted ? '#ffffff' : 'rgba(255,255,255,0.06)'} 
                        strokeWidth={highlighted ? 1.5 : 1}
                        style={{ transition: 'all 0.3s' }}
                      />
                    </g>
                  );
                })}

                {/* Flow packets */}
                {packets.map(p => (
                  <motion.circle
                    key={p.id}
                    r={2.5}
                    fill={p.color}
                    cx={p.startX}
                    cy={p.startY}
                    initial={{ cx: p.startX, cy: p.startY }}
                    animate={{ cx: p.endX, cy: p.endY }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                  />
                ))}

                {/* Module Nodes */}
                {MODULES.map(m => {
                  const NodeIcon = m.icon;
                  const highlighted = isModuleHighlighted(m.id);
                  const active = hoveredModule === m.id;
                  return (
                    <g 
                      key={m.id} 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredModule(m.id)}
                      onMouseLeave={() => setHoveredModule(null)}
                    >
                      {/* Pulse Glow when hovered */}
                      {active && (
                        <circle 
                          cx={m.x} 
                          cy={m.y} 
                          r={35} 
                          fill={`url(#glow-${m.id})`}
                          className="animate-pulse" 
                        />
                      )}
                      
                      {/* Node Circle */}
                      <circle 
                        cx={m.x} 
                        cy={m.y} 
                        r={22} 
                        fill={active ? m.color : '#0A0E1A'} 
                        stroke={highlighted ? m.color : 'rgba(255,255,255,0.1)'} 
                        strokeWidth={active ? 3 : 1.5}
                        style={{ transition: 'all 0.25s' }}
                      />

                      {/* Icon overlay */}
                      <foreignObject x={m.x - 9} y={m.y - 9} width={18} height={18} className="pointer-events-none">
                        <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: highlighted ? '#ffffff' : 'rgba(255,255,255,0.3)' }}>
                          <NodeIcon size={14} strokeWidth={2.2} />
                        </div>
                      </foreignObject>

                      {/* Text Label */}
                      <text 
                        x={m.x} 
                        y={m.y + 36} 
                        textAnchor="middle" 
                        fontSize="9.5" 
                        fontWeight="700"
                        fontFamily="sans-serif"
                        fill={highlighted ? '#ffffff' : 'rgba(255,255,255,0.3)'}
                        style={{ transition: 'all 0.25s' }}
                      >
                        {m.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Live Telemetry Log Feed */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[9px] text-[#A3A3A3] mt-6 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[8px] text-white/40 mb-1">
                <span>SYSTEM OBSERVABILITY TRACE LOGS</span>
                <span>UTC TIMESTAMP</span>
              </div>
              <AnimatePresence mode="popLayout">
                {logs.map((log, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="flex justify-between items-center"
                  >
                    <span>{log.event}</span>
                    <span className="text-[#3B82F6]">{log.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Metrics Panel */}
          <div className="w-full xl:w-[280px] bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Terminal size={14} className="text-[#3B82F6]" />
                <span className="font-mono text-[9px] font-bold text-white/50 uppercase tracking-widest">System Telemetry</span>
              </div>

              {/* Dynamic stats row */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'API RPS', val: `${metrics.rps} req/s` },
                  { label: 'Latency', val: `${metrics.latency} ms` },
                  { label: 'Cache Hit', val: `${metrics.cacheHit} %` },
                  { label: 'Queue Depth', val: `${metrics.queue}` },
                  { label: 'Active DB', val: `${metrics.dbConns} pools` },
                  { label: 'AI Infer', val: `${metrics.aiRequests} ops/s` }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col text-left">
                    <span className="font-mono text-[7.5px] text-white/40 uppercase mb-0.5">{stat.label}</span>
                    <span className="font-mono text-[13px] font-bold text-white tracking-tight">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4 text-center">
              <p className="font-mono text-[8.5px] text-[#A3A3A3] leading-relaxed">
                Dependency routing is highlighted automatically when hovering modules on the engineering dashboard.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../layout/Container';
import PageBackground from '../layout/PageBackground';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

// ─── Software Lifecycle Engine — Circular Phase Dial ─────────────────────────
// 6 phases arranged in a circle. Auto-cycles. Tap/hover to pause & explore.

const PHASES = [
  {
    id: 'plan',
    label: 'Plan',
    angle: -90, // top
    color: '#1B3A6B',
    accent: '#EEF3FB',
    desc: 'Define scope, identify constraints, and establish engineering contracts. Every great product starts with a clear technical north star.',
    kpis: ['PRD Freeze', 'Milestone Map', 'Risk Register'],
  },
  {
    id: 'build',
    label: 'Build',
    angle: -30,
    color: '#0066CC',
    accent: '#EFF6FF',
    desc: 'Componentized development, clean API contracts, and disciplined version control. Code is written as if the next engineer is the author.',
    kpis: ['Sprint Velocity', 'PR Coverage', 'Build Health'],
  },
  {
    id: 'test',
    label: 'Test',
    angle: 30,
    color: '#0D9488',
    accent: '#F0FAF9',
    desc: 'Unit, integration, and end-to-end testing runs. Security audits, performance profiling, and accessibility checks on every release.',
    kpis: ['Test Coverage', 'Bug Escape Rate', 'Load Benchmarks'],
  },
  {
    id: 'deploy',
    label: 'Deploy',
    angle: 90,
    color: '#059669',
    accent: '#ECFDF5',
    desc: 'Zero-downtime deployments to global edge networks. Rollback strategies and blue-green environments by default.',
    kpis: ['Deployment Freq.', 'MTTR', 'Error Rate'],
  },
  {
    id: 'monitor',
    label: 'Monitor',
    angle: 150,
    color: '#7C3AED',
    accent: '#F5F3FF',
    desc: 'Real-time observability across all system surfaces. Alerting pipelines, log aggregation, and anomaly detection.',
    kpis: ['Uptime SLA', 'P95 Latency', 'Alert Volume'],
  },
  {
    id: 'iterate',
    label: 'Iterate',
    angle: 210, // same as -150
    color: '#92400E',
    accent: '#FEF7EC',
    desc: 'Continuous refinement driven by telemetry and user feedback. Features evolve; technical debt is managed proactively.',
    kpis: ['Feature Velocity', 'Churn Signal', 'Retention Rate'],
  },
];

const DEG2RAD = Math.PI / 180;
const CX = 130, CY = 130, INNER_R = 42, OUTER_R = 90, ARC_GAP = 6;

function arcPath(angleStart, angleEnd, r1, r2) {
  const a1 = (angleStart + ARC_GAP / 2) * DEG2RAD;
  const a2 = (angleEnd - ARC_GAP / 2) * DEG2RAD;
  const x1o = CX + r2 * Math.cos(a1), y1o = CY + r2 * Math.sin(a1);
  const x2o = CX + r2 * Math.cos(a2), y2o = CY + r2 * Math.sin(a2);
  const x1i = CX + r1 * Math.cos(a2), y1i = CY + r1 * Math.sin(a2);
  const x2i = CX + r1 * Math.cos(a1), y2i = CY + r1 * Math.sin(a1);
  const large = Math.abs(angleEnd - angleStart) > 180 ? 1 : 0;
  return `M ${x1o},${y1o} A ${r2},${r2} 0 ${large} 1 ${x2o},${y2o} L ${x1i},${y1i} A ${r1},${r1} 0 ${large} 0 ${x2i},${y2i} Z`;
}

function labelPos(angleDeg, r) {
  const a = angleDeg * DEG2RAD;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

const SLICE_DEG = 360 / PHASES.length;

// Animated particle that flows along the outer arc
function ArcParticle({ phase, index }) {
  const startAngle = phase.angle - SLICE_DEG / 2;
  const endAngle = phase.angle + SLICE_DEG / 2;
  return (
    <motion.circle r={2.5} fill={phase.color} opacity={0.5}
      cx={CX + OUTER_R * Math.cos((startAngle + ARC_GAP) * DEG2RAD)}
      cy={CY + OUTER_R * Math.sin((startAngle + ARC_GAP) * DEG2RAD)}
      animate={{
        cx: [
          CX + OUTER_R * Math.cos((startAngle + ARC_GAP) * DEG2RAD),
          CX + OUTER_R * Math.cos((endAngle - ARC_GAP) * DEG2RAD),
        ],
        cy: [
          CY + OUTER_R * Math.sin((startAngle + ARC_GAP) * DEG2RAD),
          CY + OUTER_R * Math.sin((endAngle - ARC_GAP) * DEG2RAD),
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: index * 0.5 }}
    />
  );
}

export default function LifecycleEngine() {
  const [active, setActive] = useState(PHASES[0].id);
  const [paused, setPaused] = useState(false);
  const cycleRef = useRef(null);

  // Auto-cycle through phases
  useEffect(() => {
    if (paused) return;
    cycleRef.current = setInterval(() => {
      setActive(a => {
        const i = PHASES.findIndex(p => p.id === a);
        return PHASES[(i + 1) % PHASES.length].id;
      });
    }, 3000);
    return () => clearInterval(cycleRef.current);
  }, [paused]);

  const handlePhaseClick = (id) => {
    setPaused(true);
    setActive(id);
  };

  const activePhase = PHASES.find(p => p.id === active);
  const activeIndex = PHASES.findIndex(p => p.id === active);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-black/[0.06] relative overflow-hidden">
      <PageBackground />

      <Container>
        <SectionHeading
          eyebrow="Continuous DevOps"
          heading="A circular 6-phase loop for post-release iteration."
          description="Optimized for post-launch maintenance, active scaling, and telemetry-driven feedback updates to keep software healthy."
        />

        <div className="mt-10 sm:mt-12">
          <Card variant="surface" className="bg-white/80 backdrop-blur-sm border-black/5 shadow-sm rounded-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center gap-0">

              {/* ─── Circular Dial ─── */}
              <div className="flex-shrink-0 p-6 sm:p-8 flex flex-col items-center">
                {/* Card header */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-black/30 mb-6">
                  <span>DEVOPS ITERATION LOOP · 6 PHASES</span>
                  <span className={`font-semibold ${paused ? 'text-[#92400E]' : 'text-[#1B3A6B]'}`}>{paused ? 'PAUSED' : 'AUTO-CYCLING'}</span>
                </div>

                <div className="relative">
                  <svg viewBox="0 0 260 260" className="w-[220px] sm:w-[260px] select-none">
                    <defs>
                      <filter id="arc-glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>

                    {/* Outer ring guide */}
                    <circle cx={CX} cy={CY} r={OUTER_R + 8} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={16} />

                    {/* Phase arcs */}
                    {PHASES.map((p, i) => {
                      const startAngle = p.angle - SLICE_DEG / 2;
                      const endAngle = p.angle + SLICE_DEG / 2;
                      const on = active === p.id;
                      return (
                        <motion.path
                          key={p.id}
                          d={arcPath(startAngle, endAngle, INNER_R, on ? OUTER_R + 10 : OUTER_R)}
                          fill={on ? p.color : p.accent}
                          stroke={on ? 'none' : `${p.color}30`}
                          strokeWidth={0.5}
                          className="cursor-pointer"
                          onClick={() => handlePhaseClick(p.id)}
                          style={{
                            filter: on ? `drop-shadow(0 0 10px ${p.color}60)` : 'none',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            originX: `${CX}px`,
                            originY: `${CY}px`,
                          }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        />
                      );
                    })}

                    {/* Arc labels */}
                    {PHASES.map((p, i) => {
                      const on = active === p.id;
                      const pos = labelPos(p.angle, OUTER_R + 22);
                      return (
                        <text
                          key={`lbl-${p.id}`}
                          x={pos.x} y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={on ? 9.5 : 8.5}
                          fontWeight={on ? '700' : '500'}
                          fontFamily="sans-serif"
                          fill={on ? p.color : 'rgba(0,0,0,0.4)'}
                          className="pointer-events-none select-none"
                          style={{ transition: 'all 0.25s' }}
                        >
                          {p.label}
                        </text>
                      );
                    })}

                    {/* Animated particles along arcs */}
                    {PHASES.map((p, i) => (
                      <ArcParticle key={`part-${p.id}`} phase={p} index={i} />
                    ))}

                    {/* Center hub */}
                    <circle cx={CX} cy={CY} r={INNER_R - 4} fill="white" stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
                    <AnimatePresence mode="wait">
                      <motion.g key={active}
                        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.2 }}>
                        <circle cx={CX} cy={CY} r={14} fill={activePhase?.color || '#1B3A6B'} />
                        <text x={CX} y={CY + 4} textAnchor="middle" fontSize={7.5} fontWeight="700" fontFamily="monospace"
                          fill="white" className="pointer-events-none">
                          {String(activeIndex + 1).padStart(2, '0')}
                        </text>
                      </motion.g>
                    </AnimatePresence>
                  </svg>

                  {/* Resume button when paused */}
                  {paused && (
                    <button onClick={() => setPaused(false)}
                      className="mt-3 mx-auto flex items-center gap-1.5 font-mono text-[9px] text-[#1B3A6B] hover:underline">
                      ↺ Resume auto-cycle
                    </button>
                  )}
                </div>
              </div>

              {/* ─── Detail Panel ─── */}
              <div className="flex-1 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-black/[0.04]">
                <AnimatePresence mode="wait">
                  {activePhase && (
                    <motion.div key={activePhase.id}
                      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col gap-4 h-full"
                    >
                      {/* Phase label */}
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold font-mono"
                          style={{ backgroundColor: activePhase.color }}>
                          {String(activeIndex + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className="font-mono text-[9px] text-black/35 uppercase tracking-widest font-semibold">Loop Phase {activeIndex + 1} of {PHASES.length}</div>
                          <h4 className="font-serif text-xl font-semibold text-[#0F0F0F]">{activePhase.label}</h4>
                        </div>
                      </div>

                      <p className="text-sm text-[#525252] leading-relaxed">{activePhase.desc}</p>

                      {/* KPIs */}
                      <div>
                        <div className="font-mono text-[8.5px] text-black/35 uppercase tracking-widest mb-2">Key Metrics Tracked</div>
                        <div className="flex flex-wrap gap-2">
                          {activePhase.kpis.map(k => (
                            <span key={k}
                              className="font-mono text-[9px] px-2.5 py-1 rounded-full border font-semibold"
                              style={{ backgroundColor: activePhase.accent, borderColor: `${activePhase.color}25`, color: activePhase.color }}>
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Phase progress indicator */}
                      <div className="mt-auto pt-4 border-t border-black/[0.04]">
                        <div className="flex gap-1.5">
                          {PHASES.map((p, i) => (
                            <button key={p.id} onClick={() => handlePhaseClick(p.id)}
                              className="h-1 rounded-full flex-1 transition-all duration-300"
                              style={{ backgroundColor: active === p.id ? p.color : 'rgba(0,0,0,0.08)' }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1.5 font-mono text-[7.5px] text-black/25">
                          <span>PLAN</span><span>ITERATE</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

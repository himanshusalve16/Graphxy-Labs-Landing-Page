import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../layout/Container';
import PageBackground from '../layout/PageBackground';
import { SectionHeading } from '../ui/SectionHeading';
import {
  Search, Lightbulb, Layers, PenTool, Code2, ShieldCheck, Rocket, Activity, ChevronRight
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const STAGES = [
  {
    num: '01', id: 'discovery', label: 'Discovery', icon: Search,
    color: '#1B3A6B', accent: '#EEF3FB',
    desc: 'Aligning product scope, business intent, and technical feasibility parameters before a single line is written.',
    tags: ['Stakeholder Interviews', 'Requirements Mapping', 'Feasibility Study'],
    output: 'Signed Requirements Document',
  },
  {
    num: '02', id: 'research', label: 'Research', icon: Lightbulb,
    color: '#1B3A6B', accent: '#EEF3FB',
    desc: 'Investigating user workflows, database requirements, technical stack options, and competitor product surfaces.',
    tags: ['User Research', 'Stack Analysis', 'Competitive Audit'],
    output: 'Technical Research Brief',
  },
  {
    num: '03', id: 'architecture', label: 'Architecture', icon: Layers,
    color: '#0066CC', accent: '#EFF6FF',
    desc: 'Designing database models, API structures, microservice boundaries, and data pipeline routing strategies.',
    tags: ['DB Schema', 'API Contracts', 'Scale Planning'],
    output: 'System Architecture Diagram',
  },
  {
    num: '04', id: 'design', label: 'UX Design', icon: PenTool,
    color: '#0066CC', accent: '#EFF6FF',
    desc: 'Creating spatial wireframes, layout rules, component grids, and visual system tokens from first principles.',
    tags: ['Wireframes', 'Design System', 'Component Library'],
    output: 'High-fidelity Prototype',
  },
  {
    num: '05', id: 'development', label: 'Development', icon: Code2,
    color: '#059669', accent: '#ECFDF5',
    desc: 'Writing clean, componentized React code, decoupled backend services, and type-safe API integration layers.',
    tags: ['Frontend Build', 'Backend Services', 'API Integration'],
    output: 'Production-ready Codebase',
  },
  {
    num: '06', id: 'testing', label: 'QA & Testing', icon: ShieldCheck,
    color: '#059669', accent: '#ECFDF5',
    desc: 'Executing unit tests, integration suites, breakpoint audits, and security vulnerability scans end-to-end.',
    tags: ['Unit & E2E Tests', 'Security Audit', 'Performance Profiling'],
    output: 'Zero-regression Test Report',
  },
  {
    num: '07', id: 'deployment', label: 'Deployment', icon: Rocket,
    color: '#7C3AED', accent: '#F5F3FF',
    desc: 'Packaging optimized builds for immediate edge hosting, global CDN delivery, and zero-downtime rollout.',
    tags: ['Edge Hosting', 'CI/CD Pipeline', 'CDN Config'],
    output: 'Live Production Environment',
  },
  {
    num: '08', id: 'monitoring', label: 'Monitoring', icon: Activity,
    color: '#7C3AED', accent: '#F5F3FF',
    desc: 'Tracking server performance logs, error telemetry, user metrics, and proactive alert thresholds continuously.',
    tags: ['Error Telemetry', 'Performance Logs', 'Uptime Monitoring'],
    output: 'Observability Dashboard',
  },
];

// ─── Auto-cycle ───────────────────────────────────────────────────────────────
function useAutoCycle(delay = 2600) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (paused) return;
    ref.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % STAGES.length);
    }, delay);
    return () => clearInterval(ref.current);
  }, [paused, delay]);

  const pick = (idx) => { setPaused(true); setActiveIdx(idx); };
  const resume = () => setPaused(false);

  return { activeIdx, pick, paused, resume };
}

// ─── Stage Pill (clickable node in the top track) ─────────────────────────────
function StagePill({ stage, index, isActive, onClick }) {
  const Icon = stage.icon;
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 group focus:outline-none"
      style={{ minWidth: 0 }}
    >
      {/* Connector line to the right (hidden on last) */}
      {index < STAGES.length - 1 && (
        <div className="absolute left-[calc(50%+20px)] right-[-50%] top-[20px] h-[1px] pointer-events-none z-0"
          style={{ background: isActive ? stage.color + '40' : 'rgba(0,0,0,0.07)' }} />
      )}

      {/* Icon circle */}
      <motion.div
        animate={{
          backgroundColor: isActive ? stage.color : '#ffffff',
          borderColor: isActive ? stage.color : 'rgba(0,0,0,0.09)',
          boxShadow: isActive
            ? `0 0 0 6px ${stage.accent}, 0 8px 24px ${stage.color}30`
            : '0 1px 4px rgba(0,0,0,0.06)',
        }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-10 h-10 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0"
      >
        <Icon
          size={15}
          strokeWidth={2}
          color={isActive ? '#ffffff' : 'rgba(0,0,0,0.35)'}
          style={{ transition: 'color 0.2s' }}
        />
      </motion.div>

      {/* Number + Label */}
      <div className="text-center leading-tight">
        <div className="font-mono text-[7.5px] text-black/25">{stage.num}</div>
        <div
          className="font-sans text-[10px] font-semibold transition-colors duration-200 whitespace-nowrap"
          style={{ color: isActive ? stage.color : 'rgba(0,0,0,0.45)' }}
        >
          {stage.label}
        </div>
      </div>
    </button>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ stage, paused, onResume }) {
  const Icon = stage.icon;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        {/* Header row */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: stage.color,
              boxShadow: `0 8px 24px ${stage.color}35`,
            }}
          >
            <Icon size={20} strokeWidth={1.8} color="#ffffff" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: stage.color }}>
                Stage {stage.num}
              </span>
              {paused && (
                <button
                  onClick={onResume}
                  className="font-mono text-[8px] text-black/30 hover:text-[#1B3A6B] underline underline-offset-2 transition-colors"
                >
                  Resume auto
                </button>
              )}
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#0F0F0F]">{stage.label}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#525252] leading-relaxed mb-5">{stage.desc}</p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-5">
          {stage.tags.map(t => (
            <span
              key={t}
              className="font-mono text-[9px] font-semibold px-3 py-1.5 rounded-full border"
              style={{ backgroundColor: stage.accent, borderColor: stage.color + '25', color: stage.color }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Output deliverable */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border"
          style={{ backgroundColor: stage.accent, borderColor: stage.color + '20' }}
        >
          <ChevronRight size={13} style={{ color: stage.color }} />
          <div>
            <div className="font-mono text-[7.5px] uppercase tracking-widest text-black/35 mb-0.5">Stage Deliverable</div>
            <div className="font-semibold text-[12px] text-[#0F0F0F]">{stage.output}</div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ activeIdx }) {
  const pct = ((activeIdx + 1) / STAGES.length) * 100;
  return (
    <div className="w-full h-1 bg-black/[0.05] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(to right, #1B3A6B, #0066CC, #7C3AED)' }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      />
    </div>
  );
}

// ─── Mobile vertical stepper ──────────────────────────────────────────────────
function MobileStepper({ activeIdx, pick }) {
  return (
    <div className="flex flex-col">
      {STAGES.map((s, i) => {
        const on = i === activeIdx;
        const Icon = s.icon;
        const done = i < activeIdx;
        return (
          <div key={s.id} className="flex gap-4">
            {/* Left: icon + vertical line */}
            <div className="flex flex-col items-center flex-shrink-0" style={{ width: 36 }}>
              <motion.button
                onClick={() => pick(i)}
                animate={{
                  backgroundColor: on ? s.color : done ? '#0066CC12' : '#fff',
                  borderColor: on ? s.color : done ? '#0066CC30' : 'rgba(0,0,0,0.09)',
                  boxShadow: on ? `0 0 0 5px ${s.accent}, 0 4px 16px ${s.color}30` : 'none',
                }}
                transition={{ duration: 0.22 }}
                className="w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center z-10 relative focus:outline-none"
              >
                <Icon size={13} strokeWidth={2} color={on ? '#fff' : done ? '#0066CC' : 'rgba(0,0,0,0.3)'} />
              </motion.button>
              {i < STAGES.length - 1 && (
                <div className="flex-1 w-[1.5px] my-1 rounded-full" style={{ backgroundColor: i < activeIdx ? '#0066CC30' : 'rgba(0,0,0,0.06)', minHeight: 20 }} />
              )}
            </div>

            {/* Right: content */}
            <div className={`flex-1 pb-4 ${i === STAGES.length - 1 ? '' : ''}`}>
              <button onClick={() => pick(i)} className="w-full text-left focus:outline-none">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[8px] text-black/30">{s.num}</span>
                  <span
                    className="font-sans text-[12px] font-semibold"
                    style={{ color: on ? s.color : 'rgba(0,0,0,0.6)' }}
                  >{s.label}</span>
                </div>
              </button>

              <AnimatePresence>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-[11px] text-[#525252] leading-relaxed mt-1 mb-2">{s.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {s.tags.map(t => (
                        <span key={t} className="font-mono text-[8px] px-2 py-0.5 rounded-full border font-semibold"
                          style={{ backgroundColor: s.accent, borderColor: s.color + '25', color: s.color }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium" style={{ color: s.color }}>
                      <ChevronRight size={10} />
                      <span>{s.output}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function WorkflowEngine() {
  const { activeIdx, pick, paused, resume } = useAutoCycle(2600);
  const stage = STAGES[activeIdx];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAFAF8] border-b border-black/[0.06] relative overflow-hidden">
      <PageBackground />

      <Container>
        <SectionHeading
          eyebrow="Execution Pipeline"
          heading="A linear 8-stage builder cycle for software delivery."
          description="A developer-centric execution roadmap optimized for turning specs into production code with continuous verification."
        />

        <div className="mt-10 sm:mt-12 bg-white border border-black/[0.06] rounded-3xl overflow-hidden shadow-sm">

          {/* ── Top track: stage pills (desktop) ── */}
          <div className="hidden lg:block px-8 pt-8 pb-6 border-b border-black/[0.04]">
            {/* Progress bar */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] text-black/30 uppercase tracking-wider">DEVELOPER EXECUTION PIPELINE · {STAGES.length} Stages</span>
                <span className="font-mono text-[9px] font-semibold" style={{ color: stage.color }}>
                  Stage {stage.num} of {STAGES.length}{paused ? ' · interactive' : ' · auto'}
                </span>
              </div>
              <ProgressBar activeIdx={activeIdx} />
            </div>

            {/* Pills row */}
            <div className="relative grid gap-0" style={{ gridTemplateColumns: `repeat(${STAGES.length}, 1fr)` }}>
              {/* Background connector track */}
              <div className="absolute left-[5%] right-[5%] top-[20px] h-[1px] bg-black/[0.05] pointer-events-none" />

              {STAGES.map((s, i) => (
                <StagePill
                  key={s.id}
                  stage={s}
                  index={i}
                  isActive={i === activeIdx}
                  onClick={() => pick(i)}
                />
              ))}
            </div>
          </div>

          {/* ── Bottom: detail panel (desktop) ── */}
          <div className="hidden lg:block px-8 py-7">
            <DetailPanel stage={stage} paused={paused} onResume={resume} />
          </div>

          {/* ── Mobile stepper ── */}
          <div className="lg:hidden px-5 py-6">
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[9px] text-black/30 uppercase tracking-wider">DEVELOPER EXECUTION PIPELINE</span>
              {paused && (
                <button onClick={resume} className="font-mono text-[9px] text-[#1B3A6B] hover:underline">↺ Auto</button>
              )}
            </div>
            <div className="mb-5">
              <ProgressBar activeIdx={activeIdx} />
            </div>
            <MobileStepper activeIdx={activeIdx} pick={pick} />
          </div>

        </div>
      </Container>
    </section>
  );
}

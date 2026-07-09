import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import Container from '../layout/Container';
import PageBackground from '../layout/PageBackground';
import { SectionHeading } from '../ui/SectionHeading';
import {
  CheckCircle,
  Compass,
  TrendingUp,
  Clock,
  Briefcase,
  Play,
  Activity,
  Plus,
  Shield,
  AlertTriangle,
  Lock,
  Zap,
  Server,
  BarChart2,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

// ─── SHARED STATUS LABEL ──────────────────────────────────────────────────────
const STATUS = 'UNDER CONSIDERATION';

// ==========================================
// 1. ANIMATED GRAPHZY PREVIEW COMPONENT
//    Physics trajectory canvas — multi-axis interactive math engine demo
// ==========================================
export function GraphzyPreview() {
  const [promptText, setPromptText] = useState('');
  const [launchAngle, setLaunchAngle] = useState(45);
  const [velocity, setVelocity] = useState(22);
  const [step, setStep] = useState(0);
  const [showDerivative, setShowDerivative] = useState(false);
  const [showPeakAnnotation, setShowPeakAnnotation] = useState(false);

  useEffect(() => {
    let active = true;
    let timerId;
    let intervalId;

    if (step === 0) {
      const text = 'Simulate a projectile at θ=45° with v₀=22 m/s';
      let idx = 0;
      setPromptText('');
      setLaunchAngle(45);
      setVelocity(22);
      setShowDerivative(false);
      setShowPeakAnnotation(false);
      intervalId = setInterval(() => {
        if (!active) return;
        setPromptText(text.slice(0, idx + 1));
        idx++;
        if (idx >= text.length) {
          clearInterval(intervalId);
          timerId = setTimeout(() => { if (active) setStep(1); }, 600);
        }
      }, 55);
    } else if (step === 1) {
      timerId = setTimeout(() => { if (active) setStep(2); }, 1400);
    } else if (step === 2) {
      timerId = setTimeout(() => {
        if (active) { setShowDerivative(true); setStep(3); }
      }, 1000);
    } else if (step === 3) {
      let angle = 45;
      intervalId = setInterval(() => {
        if (!active) return;
        angle = Math.min(angle + 0.8, 62);
        setLaunchAngle(parseFloat(angle.toFixed(1)));
        if (angle >= 62) {
          clearInterval(intervalId);
          timerId = setTimeout(() => { if (active) setStep(4); }, 500);
        }
      }, 40);
    } else if (step === 4) {
      setShowPeakAnnotation(true);
      timerId = setTimeout(() => { if (active) setStep(5); }, 3500);
    } else if (step === 5) {
      setShowDerivative(false);
      setShowPeakAnnotation(false);
      timerId = setTimeout(() => { if (active) setStep(0); }, 800);
    }

    return () => { active = false; clearTimeout(timerId); clearInterval(intervalId); };
  }, [step]);

  const getPhysicsPath = () => {
    const cx = 18, cy = 162;
    const g = 9.8;
    const rad = (launchAngle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const tFlight = (2 * vy) / g;
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const t = (tFlight * i) / 40;
      const xVal = cx + (t * vx) * (168 / (vx * tFlight));
      const yVal = cy - (vy * t - 0.5 * g * t * t) * (120 / ((vy * vy) / (2 * g)));
      if (!isNaN(xVal) && !isNaN(yVal)) points.push(`${xVal.toFixed(1)},${yVal.toFixed(1)}`);
    }
    return `M ${cx},${cy} L ${points.join(' L ')}`;
  };

  const getPeakCoords = () => {
    const cx = 18, cy = 162;
    const g = 9.8;
    const rad = (launchAngle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const tFlight = (2 * vy) / g;
    const tPeak = vy / g;
    const xPeak = cx + (tPeak * vx) * (168 / (vx * tFlight));
    const yPeak = cy - (vy * tPeak - 0.5 * g * tPeak * tPeak) * (120 / ((vy * vy) / (2 * g)));
    return { x: xPeak, y: yPeak };
  };

  const peak = getPeakCoords();
  const range = (velocity * velocity * Math.sin(2 * launchAngle * Math.PI / 180) / 9.8).toFixed(1);
  const peakH = (velocity * velocity * Math.sin(launchAngle * Math.PI / 180) ** 2 / (2 * 9.8)).toFixed(1);

  return (
    <Card variant="surface" className="p-0 bg-[#FAFAF8] border-black/5 shadow-md overflow-hidden flex flex-col gap-0 w-full">
      {/* Browser chrome */}
      <div className="flex justify-between items-center px-4 py-2.5 border-b border-black/[0.05] bg-white">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        </div>
        <div className="flex items-center gap-2 bg-[#F4F4F4] rounded-md px-3 py-1">
          <span className="font-mono text-[9px] text-[#A3A3A3]">graphzy.io/canvas/physics</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Main canvas area */}
      <div className="relative bg-white overflow-hidden" style={{ height: 230 }}>
        {/* Grid background */}
        {step !== 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" viewBox="0 0 240 230">
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={`gv-${i}`} x1={i * 10} y1={0} x2={i * 10} y2={230} stroke="#1B3A6B" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 23 }).map((_, i) => (
              <line key={`gh-${i}`} x1={0} y1={i * 10} x2={240} y2={i * 10} stroke="#1B3A6B" strokeWidth={0.5} />
            ))}
          </svg>
        )}

        {/* Axis lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 240 230">
          <line x1={18} y1={10} x2={18} y2={165} stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
          <line x1={18} y1={162} x2={226} y2={162} stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
          <text x={10} y={12} fontSize={6} fill="rgba(0,0,0,0.35)" fontFamily="monospace">y</text>
          <text x={222} y={167} fontSize={6} fill="rgba(0,0,0,0.35)" fontFamily="monospace">x</text>
          {/* Tick marks */}
          {[40, 80, 120, 160, 200].map(x => (
            <g key={x}>
              <line x1={x} y1={160} x2={x} y2={165} stroke="rgba(0,0,0,0.15)" strokeWidth={0.8} />
              <text x={x} y={174} textAnchor="middle" fontSize={5.5} fill="rgba(0,0,0,0.3)" fontFamily="monospace">{((x - 18) / 1.68).toFixed(0)}</text>
            </g>
          ))}
          {[40, 80, 120].map(y => (
            <g key={y}>
              <line x1={16} y1={y} x2={18} y2={y} stroke="rgba(0,0,0,0.15)" strokeWidth={0.8} />
              <text x={12} y={y + 2} textAnchor="end" fontSize={5.5} fill="rgba(0,0,0,0.3)" fontFamily="monospace">{((162 - y) / 1.2).toFixed(0)}</text>
            </g>
          ))}
        </svg>

        {/* AI prompt bar */}
        <div className="absolute top-3 left-3 right-3 bg-[#EEF3FB]/95 backdrop-blur-sm border border-[#1B3A6B]/12 rounded-lg px-3 py-2 z-20 flex items-center gap-2 shadow-xs">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B] animate-pulse" />
            <span className="font-mono text-[8.5px] text-[#1B3A6B] font-bold">AI MODEL</span>
          </div>
          <span className="text-[9px] text-black/75 font-medium truncate">{promptText}</span>
          {step === 0 && <span className="w-0.5 h-3 bg-black/50 animate-pulse flex-shrink-0" />}
        </div>

        {/* Processing overlay */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/96 flex flex-col items-center justify-center gap-3 z-30"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 border-2 border-[#1B3A6B] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-[9px] text-[#1B3A6B] font-bold uppercase tracking-wider">Solving differential equations...</span>
              </div>
              <div className="flex gap-1.5">
                {['v₀x = 15.56 m/s', 'v₀y = 15.56 m/s', 'tₘₐₓ = 1.59s'].map((lbl, i) => (
                  <motion.span key={lbl} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.25 }}
                    className="font-mono text-[8px] text-[#1B3A6B]/60 bg-[#EEF3FB] px-2 py-0.5 rounded">{lbl}</motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trajectory SVG */}
        {step > 1 && (
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 240 230">
            {/* Gradient fill under curve */}
            <defs>
              <linearGradient id="trajGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B3A6B" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#1B3A6B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={getPhysicsPath() + ` L ${18 + 168},162 L 18,162 Z`}
              fill="url(#trajGrad)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            />
            <motion.path
              d={getPhysicsPath()}
              stroke="#1B3A6B"
              strokeWidth="2"
              strokeDasharray="none"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              key={`traj-${Math.round(launchAngle)}`}
            />
            {/* Derivative tangent at peak */}
            {showDerivative && (
              <motion.line
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                x1={peak.x - 20} y1={peak.y} x2={peak.x + 20} y2={peak.y}
                stroke="#0066CC" strokeWidth={1.2} strokeDasharray="3 2"
              />
            )}
            {/* Peak annotation */}
            {showPeakAnnotation && (
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ originX: peak.x, originY: peak.y }}>
                <circle cx={peak.x} cy={peak.y} r={3.5} fill="#1B3A6B" />
                <line x1={peak.x} y1={peak.y} x2={peak.x} y2={162} stroke="#1B3A6B" strokeWidth={0.8} strokeDasharray="2 2" opacity={0.4} />
                <rect x={peak.x + 5} y={peak.y - 20} width={70} height={22} rx={4} fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth={0.8} />
                <text x={peak.x + 10} y={peak.y - 10} fontSize={6.5} fill="#1B3A6B" fontFamily="monospace" fontWeight="700">H = {peakH}m</text>
                <text x={peak.x + 10} y={peak.y - 2} fontSize={6} fill="rgba(0,0,0,0.45)" fontFamily="monospace">R = {range}m · θ={launchAngle.toFixed(1)}°</text>
              </motion.g>
            )}
            {/* Launch arrow */}
            <line x1={18} y1={162}
              x2={18 + 18 * Math.cos((launchAngle * Math.PI) / 180)}
              y2={162 - 18 * Math.sin((launchAngle * Math.PI) / 180)}
              stroke="#1B3A6B" strokeWidth={2} />
            <circle cx={18} cy={162} r={4} fill="#1B3A6B" />
          </svg>
        )}
      </div>

      {/* Control panel */}
      <div className="bg-[#FAFAF8] border-t border-black/[0.04] px-4 py-3 flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-3">
          {/* Angle slider */}
          <div>
            <div className="flex justify-between items-baseline text-[8.5px] font-mono mb-1.5">
              <span className="text-black/45 uppercase tracking-wider">Launch Angle</span>
              <span className="text-[#1B3A6B] font-bold">{launchAngle.toFixed(1)}°</span>
            </div>
            <div className="relative h-1.5 bg-black/[0.06] rounded-full">
              <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#1B3A6B] to-[#0066CC] rounded-full transition-all duration-100"
                style={{ width: `${((launchAngle - 15) / 60) * 100}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-[1.5px] border-[#1B3A6B] shadow-xs transition-all duration-100"
                style={{ left: `${((launchAngle - 15) / 60) * 100}%` }} />
            </div>
          </div>
          {/* Velocity slider */}
          <div>
            <div className="flex justify-between items-baseline text-[8.5px] font-mono mb-1.5">
              <span className="text-black/45 uppercase tracking-wider">Initial Velocity</span>
              <span className="text-[#0066CC] font-bold">{velocity} m/s</span>
            </div>
            <div className="relative h-1.5 bg-black/[0.06] rounded-full">
              <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#0066CC] to-[#00AAFF] rounded-full"
                style={{ width: `${((velocity - 10) / 20) * 100}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-[1.5px] border-[#0066CC] shadow-xs"
                style={{ left: `${((velocity - 10) / 20) * 100}%` }} />
            </div>
          </div>
        </div>
        {/* Computed metrics row */}
        <div className="flex gap-3 pt-1 border-t border-black/[0.04]">
          {[
            { lbl: 'Range', val: `${range} m` },
            { lbl: 'Max Height', val: `${peakH} m` },
            { lbl: 'Flight Time', val: `${(2 * velocity * Math.sin(launchAngle * Math.PI / 180) / 9.8).toFixed(2)} s` },
          ].map(m => (
            <div key={m.lbl} className="flex-1 text-center">
              <div className="font-mono text-[7.5px] text-black/35 uppercase tracking-wider">{m.lbl}</div>
              <div className="font-mono text-[10px] font-bold text-[#0F0F0F]">{m.val}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// 2. ANIMATED CLAMPBOX PREVIEW COMPONENT
//    AI Prompt Security Gateway with live threat feed
// ==========================================
export function ClampboxPreview() {
  const [step, setStep] = useState(0);
  const [secureState, setSecureState] = useState('Initializing');
  const [terminalLines, setTerminalLines] = useState([]);
  const [threatPulse, setThreatPulse] = useState(false);
  const [redactedPrompt, setRedactedPrompt] = useState(null);
  const [bytesScan, setBytesScan] = useState(0);
  const [attestScore, setAttestScore] = useState(null);
  const termRef = useRef(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [terminalLines]);

  useEffect(() => {
    let active = true;
    let timerId;
    let countId;

    const addLine = (line) => setTerminalLines(prev => [...prev.slice(-9), line]);

    if (step === 0) {
      setSecureState('Initializing');
      setTerminalLines([]);
      setThreatPulse(false);
      setRedactedPrompt(null);
      setBytesScan(0);
      setAttestScore(null);
      addLine('[enclave] Booting secure runtime environment...');
      timerId = setTimeout(() => {
        if (!active) return;
        addLine('[sys] Allocating 512 GB encrypted memory pool...');
        setTimeout(() => { if (active) setStep(1); }, 900);
      }, 1000);
    } else if (step === 1) {
      addLine('[tpm] Verifying hardware TPM endorsement key...');
      setSecureState('Attesting');
      let score = 0;
      countId = setInterval(() => {
        if (!active) return;
        score = Math.min(score + 4, 98);
        setAttestScore(score);
        if (score >= 98) { clearInterval(countId); timerId = setTimeout(() => { if (active) setStep(2); }, 400); }
      }, 30);
    } else if (step === 2) {
      setAttestScore(98);
      addLine('[attest] SHA-256 signature: VERIFIED ✓');
      addLine('[attest] Intel SGX enclave: ACTIVE');
      timerId = setTimeout(() => { if (active) setStep(3); }, 1400);
    } else if (step === 3) {
      addLine('[proxy] Intercepting API prompt...');
      addLine('[scan] Running secret-detection pipeline...');
      setThreatPulse(true);
      timerId = setTimeout(() => { if (active) setStep(4); }, 1600);
    } else if (step === 4) {
      addLine('[ALERT] API key pattern detected: sk-proj-...');
      addLine('[redact] Applying masking rule: REPLACE → [REDACTED]');
      setRedactedPrompt({
        raw: 'Use sk-proj-T8xN2... to fetch data from prod-db-01',
        clean: 'Use [REDACTED] to fetch data from [REDACTED]'
      });
      setSecureState('SECURE');
      setThreatPulse(false);
      timerId = setTimeout(() => { if (active) setStep(5); }, 1200);
    } else if (step === 5) {
      addLine('[sys] Execution complete. Enclave memory zeroed.');
      addLine('[audit] Decision logged to immutable ledger.');
      let b = 0;
      countId = setInterval(() => {
        if (!active) return;
        b = Math.min(b + 18, 512);
        setBytesScan(b);
        if (b >= 512) { clearInterval(countId); timerId = setTimeout(() => { if (active) setStep(6); }, 3000); }
      }, 30);
    } else if (step === 6) {
      timerId = setTimeout(() => { if (active) setStep(0); }, 800);
    }

    return () => { active = false; clearTimeout(timerId); clearInterval(countId); };
  }, [step]);

  return (
    <Card variant="surface" className="p-0 bg-[#F0FAF9] border-[#0D9488]/12 shadow-md overflow-hidden flex flex-col w-full">
      {/* Browser chrome */}
      <div className="flex justify-between items-center px-4 py-2.5 border-b border-[#0D9488]/10 bg-[#F0FAF9]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        </div>
        <div className="flex items-center gap-2 bg-[#0D9488]/8 rounded-md px-3 py-1">
          <Lock size={7} className="text-[#0D9488]" />
          <span className="font-mono text-[9px] text-[#0D9488]">clampbox.io / console / gateway</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Enclave terminal */}
      <div className="bg-[#071E20] flex flex-col" style={{ height: 200 }}>
        {/* Terminal header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] font-bold text-[#0D9488] uppercase tracking-wider">Enclave Runtime</span>
            <span className={`text-[7.5px] px-1.5 py-0.5 rounded-full font-bold font-mono ${
              secureState === 'SECURE' ? 'bg-[#0D9488] text-white' :
              secureState === 'Attesting' ? 'bg-amber-400 text-black' :
              'bg-white/10 text-white/60'
            } transition-all duration-300`}>{secureState}</span>
          </div>
          <div className="flex items-center gap-3 text-[7.5px] font-mono text-white/30">
            {attestScore !== null && <span>ATTEST <span className="text-[#0D9488]">{attestScore}%</span></span>}
            {bytesScan > 0 && <span>SCANNED <span className="text-[#0D9488]">{bytesScan} MB</span></span>}
          </div>
        </div>

        {/* Terminal body */}
        <div ref={termRef} className="flex-1 px-4 py-2 overflow-y-auto flex flex-col gap-0.5">
          {terminalLines.map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
              className={`font-mono text-[8px] leading-relaxed ${
                line.startsWith('[ALERT]') ? 'text-[#EF4444]' :
                line.startsWith('[attest]') ? 'text-[#0D9488] font-bold' :
                line.startsWith('[redact]') ? 'text-[#F59E0B]' :
                'text-white/55'
              }`}>
              {line}
            </motion.div>
          ))}
          {/* Blinking cursor */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[8px] text-[#0D9488]">›</span>
            <span className="w-1 h-2.5 bg-[#0D9488] animate-pulse" />
          </div>
        </div>

        {/* Threat pulse indicator */}
        <AnimatePresence>
          {threatPulse && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mx-4 mb-2 bg-[#EF4444]/15 border border-[#EF4444]/25 rounded-md px-3 py-1.5 flex items-center gap-2">
              <AlertTriangle size={9} className="text-[#EF4444] animate-pulse" />
              <span className="font-mono text-[8px] text-[#EF4444] font-bold">THREAT DETECTION IN PROGRESS</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Redaction panel */}
      <div className="px-4 py-3 flex flex-col gap-2 bg-white border-t border-[#0D9488]/10">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[8px] text-black/40 uppercase tracking-wider">Prompt Redaction Engine</span>
          <span className="font-mono text-[8px] text-[#0D9488] font-semibold">AES-256-GCM · Verified</span>
        </div>
        <AnimatePresence mode="wait">
          {redactedPrompt ? (
            <motion.div key="redacted" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1.5">
              <div className="bg-[#FEF2F2] border border-[#EF4444]/15 rounded px-2 py-1.5">
                <span className="font-mono text-[7.5px] text-black/35 block mb-0.5">ORIGINAL</span>
                <span className="font-mono text-[8px] text-[#EF4444]/80 break-all">{redactedPrompt.raw}</span>
              </div>
              <div className="bg-[#F0FAF9] border border-[#0D9488]/15 rounded px-2 py-1.5">
                <span className="font-mono text-[7.5px] text-black/35 block mb-0.5">SANITIZED</span>
                <span className="font-mono text-[8px] text-[#0D9488] font-bold break-all">{redactedPrompt.clean}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="idle" className="text-[8px] text-black/25 font-mono border border-dashed border-black/8 rounded px-2 py-2 text-center">
              Awaiting prompt interception...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

// ==========================================
// 3. ANIMATED FORKLINE PREVIEW COMPONENT
//    Restaurant operations — live floor map, KOT stream, analytics
// ==========================================
export function ForklinePreview() {
  const [step, setStep] = useState(0);
  const [tables, setTables] = useState([
    { id: 'T1', status: 'main-course', label: 'Main Course', time: '14m', alert: false },
    { id: 'T2', status: 'empty', label: 'Empty', time: null, alert: false },
    { id: 'T3', status: 'starters', label: 'Starters', time: '6m', alert: false },
    { id: 'T4', status: 'empty', label: 'Empty', time: null, alert: false },
    { id: 'T5', status: 'dessert', label: 'Dessert', time: '3m', alert: false },
    { id: 'T6', status: 'empty', label: 'Empty', time: null, alert: false },
  ]);
  const [kotQueue, setKotQueue] = useState([
    { id: 'k1', item: 'T1 · Butter Chicken & Naan', time: '14m', status: 'cooking' },
    { id: 'k2', item: 'T3 · Paneer Tikka', time: '6m', status: 'cooking' },
    { id: 'k3', item: 'T5 · Gulab Jamun × 2', time: '3m', status: 'ready' },
  ]);
  const [notification, setNotification] = useState(null);
  const [metrics, setMetrics] = useState({ covers: 8, avg: 28, revenue: '₹4,230' });

  useEffect(() => {
    let active = true;
    let timerId;

    if (step === 0) {
      setTables([
        { id: 'T1', status: 'main-course', label: 'Main Course', time: '14m', alert: false },
        { id: 'T2', status: 'empty', label: 'Empty', time: null, alert: false },
        { id: 'T3', status: 'starters', label: 'Starters', time: '6m', alert: false },
        { id: 'T4', status: 'empty', label: 'Empty', time: null, alert: false },
        { id: 'T5', status: 'dessert', label: 'Dessert', time: '3m', alert: false },
        { id: 'T6', status: 'empty', label: 'Empty', time: null, alert: false },
      ]);
      setKotQueue([
        { id: 'k1', item: 'T1 · Butter Chicken & Naan', time: '14m', status: 'cooking' },
        { id: 'k2', item: 'T3 · Paneer Tikka', time: '6m', status: 'cooking' },
        { id: 'k3', item: 'T5 · Gulab Jamun × 2', time: '3m', status: 'ready' },
      ]);
      setNotification(null);
      setMetrics({ covers: 8, avg: 28, revenue: '₹4,230' });
      timerId = setTimeout(() => { if (active) setStep(1); }, 2000);
    } else if (step === 1) {
      // T2 gets seated
      setTables(prev => prev.map(t => t.id === 'T2' ? { ...t, status: 'starters', label: 'Starters', time: '0m' } : t));
      setNotification({ type: 'info', msg: 'T2 seated · order sent to kitchen' });
      setKotQueue(prev => [...prev, { id: 'k4', item: 'T2 · Hyderabadi Biryani', time: '0m', status: 'pending' }]);
      setMetrics(m => ({ ...m, covers: 10 }));
      timerId = setTimeout(() => { if (active) setStep(2); }, 2500);
    } else if (step === 2) {
      // T3 order served, T5 cleared
      setKotQueue(prev => prev.filter(k => k.id !== 'k2').map(k => k.id === 'k3' ? { ...k, status: 'served' } : k));
      setTables(prev => prev.map(t => t.id === 'T3' ? { ...t, status: 'dessert', label: 'Dessert', time: '2m' } :
        t.id === 'T5' ? { ...t, status: 'empty', label: 'Empty', time: null } : t));
      setNotification(null);
      setMetrics(m => ({ ...m, revenue: '₹5,890' }));
      timerId = setTimeout(() => { if (active) setStep(3); }, 2500);
    } else if (step === 3) {
      // T1 overtime alert
      setTables(prev => prev.map(t => t.id === 'T1' ? { ...t, alert: true, time: '42m' } : t));
      setNotification({ type: 'alert', msg: 'T1 exceeded 40-min table limit · 42m seated' });
      timerId = setTimeout(() => { if (active) setStep(4); }, 4000);
    } else if (step === 4) {
      timerId = setTimeout(() => { if (active) setStep(0); }, 800);
    }

    return () => { active = true; clearTimeout(timerId); };
  }, [step]);

  const tableColor = (t) => {
    if (t.alert) return 'bg-[#FEF2F2] border-[#EF4444]/25 text-[#EF4444]';
    if (t.status === 'empty') return 'bg-[#FAFAF8] border-black/5 text-black/30 opacity-50';
    if (t.status === 'dessert') return 'bg-[#FFF7ED] border-[#F59E0B]/25';
    if (t.status === 'starters') return 'bg-[#F0FDF4] border-[#10B981]/20';
    return 'bg-[#EFF6FF] border-[#1D4ED8]/15';
  };

  const tableTextColor = (t) => {
    if (t.alert) return 'text-[#EF4444] font-bold';
    if (t.status === 'empty') return 'text-black/30';
    if (t.status === 'dessert') return 'text-[#B45309]';
    if (t.status === 'starters') return 'text-[#1E8A4A]';
    return 'text-[#1D4ED8]';
  };

  const kotStatusColor = (s) => s === 'ready' ? 'bg-[#10B981] text-white' : s === 'served' ? 'bg-black/10 text-black/40' : s === 'pending' ? 'bg-[#F59E0B] text-white' : 'bg-[#EFF6FF] text-[#1D4ED8]';

  return (
    <Card variant="surface" className="p-0 bg-[#FEF7EC] border-[#B45309]/12 shadow-md overflow-hidden flex flex-col w-full">
      {/* Browser chrome */}
      <div className="flex justify-between items-center px-4 py-2.5 border-b border-[#B45309]/10 bg-[#FEF7EC]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        </div>
        <div className="flex items-center gap-2 bg-[#B45309]/8 rounded-md px-3 py-1">
          <span className="font-mono text-[9px] text-[#92400E]">forkline.io / floor / live</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Metrics header strip */}
      <div className="flex gap-0 border-b border-[#B45309]/10">
        {[
          { lbl: 'Covers', val: metrics.covers },
          { lbl: 'Avg Stay', val: `${metrics.avg}m` },
          { lbl: 'Revenue', val: metrics.revenue },
        ].map((m, i) => (
          <div key={m.lbl} className={`flex-1 px-3 py-2 text-center ${i < 2 ? 'border-r border-[#B45309]/8' : ''}`}>
            <div className="font-mono text-[7px] text-[#92400E]/50 uppercase tracking-wider">{m.lbl}</div>
            <div className="font-mono text-[11px] font-bold text-[#92400E]">{m.val}</div>
          </div>
        ))}
      </div>

      {/* Floor grid */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[8px] text-[#92400E] font-bold uppercase tracking-wider">Dining Floor · Live</span>
          <span className="flex items-center gap-1 text-[8px] text-black/35 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Mesh sync active
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {tables.map(t => (
            <motion.div key={t.id} layout
              className={`border rounded-lg px-2.5 py-2 flex flex-col items-center text-center transition-all duration-300 ${tableColor(t)}`}
            >
              <div className="font-mono text-[9px] font-bold text-[#0F0F0F]">{t.id}</div>
              <span className={`text-[8px] font-medium mt-0.5 ${tableTextColor(t)}`}>{t.alert ? 'ALERT' : t.label}</span>
              {t.time && <span className="font-mono text-[7.5px] text-black/30 mt-0.5">{t.time}</span>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* KOT queue */}
      <div className="px-4 pb-3 flex flex-col gap-1.5">
        <span className="font-mono text-[8px] text-[#92400E] font-bold uppercase tracking-wider">Kitchen Display ({kotQueue.length})</span>
        <div className="flex flex-col gap-1">
          {kotQueue.slice(-3).map(k => (
            <motion.div key={k.id} layout initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              className="flex justify-between items-center bg-white border border-[#B45309]/8 rounded-md px-2.5 py-1.5">
              <span className="text-[9px] font-medium text-black/65">{k.item}</span>
              <span className={`font-mono text-[7.5px] px-2 py-0.5 rounded-full font-bold ${kotStatusColor(k.status)}`}>{k.status}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Notification bar */}
      <div className="h-10 mx-4 mb-3">
        <AnimatePresence mode="wait">
          {notification ? (
            <motion.div key="notif" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              className={`h-full rounded-lg border px-3 flex items-center gap-2 text-[8.5px] font-medium ${
                notification.type === 'alert' ? 'bg-[#FEF2F2] border-[#EF4444]/15 text-[#EF4444]' : 'bg-white border-[#B45309]/10 text-[#92400E]'
              }`}>
              {notification.type === 'alert' ? <AlertTriangle size={10} /> : <Zap size={10} />}
              {notification.msg}
            </motion.div>
          ) : (
            <div key="idle" className="h-full rounded-lg border border-dashed border-black/8 flex items-center justify-center text-[8px] text-black/25 font-mono">
              Telemetry nominal
            </div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

// ==========================================
// 4. ANIMATED LATTICE PREVIEW COMPONENT
//    Startup ops — runway, fundraising CRM, animated sparkline
// ==========================================
export function LatticePreview() {
  const [step, setStep] = useState(0);
  const [committed, setCommitted] = useState(450);
  const [kanbanStage, setKanbanStage] = useState('Meetings');
  const [runway, setRunway] = useState(14);
  const [milestone, setMilestone] = useState('In Progress');
  const [sparkData, setSparkData] = useState([380, 395, 410, 430, 450]);
  const [burnRate, setBurnRate] = useState(72);

  useEffect(() => {
    let active = true;
    let timerId;
    let intervalId;

    if (step === 0) {
      setCommitted(450); setKanbanStage('Meetings'); setRunway(14);
      setMilestone('In Progress'); setSparkData([380, 395, 410, 430, 450]); setBurnRate(72);
      timerId = setTimeout(() => { if (active) setStep(1); }, 2000);
    } else if (step === 1) {
      setKanbanStage('Term Sheet');
      setSparkData(prev => [...prev.slice(-4), 480]);
      timerId = setTimeout(() => { if (active) setStep(2); }, 1800);
    } else if (step === 2) {
      let val = 450;
      intervalId = setInterval(() => {
        if (!active) return;
        val = Math.min(val + 20, 750);
        setCommitted(val);
        setSparkData(prev => [...prev.slice(-4), val]);
        if (val >= 750) {
          clearInterval(intervalId);
          timerId = setTimeout(() => { if (active) setStep(3); }, 800);
        }
      }, 40);
    } else if (step === 3) {
      setRunway(28); setMilestone('Completed'); setBurnRate(58);
      setSparkData(prev => [...prev.slice(-4), 750]);
      timerId = setTimeout(() => { if (active) setStep(4); }, 4000);
    } else if (step === 4) {
      timerId = setTimeout(() => { if (active) setStep(0); }, 800);
    }

    return () => { active = false; clearTimeout(timerId); clearInterval(intervalId); };
  }, [step]);

  const sparkMax = Math.max(...sparkData, 800);
  const sparkPoints = sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * 140},${40 - (v / sparkMax) * 36}`).join(' ');

  return (
    <Card variant="surface" className="p-0 bg-[#EEF3FB]/50 border-[#1B3A6B]/12 shadow-md overflow-hidden flex flex-col w-full">
      {/* Browser chrome */}
      <div className="flex justify-between items-center px-4 py-2.5 border-b border-[#1B3A6B]/10 bg-[#EEF3FB]/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        </div>
        <div className="flex items-center gap-2 bg-[#1B3A6B]/8 rounded-md px-3 py-1">
          <span className="font-mono text-[9px] text-[#1B3A6B]">lattice.io / workspace / seed-round</span>
        </div>
        <div className="w-16" />
      </div>

      {/* KPIs strip */}
      <div className="flex border-b border-[#1B3A6B]/10">
        {[
          { lbl: 'Runway', val: `${runway}mo`, good: runway >= 20 },
          { lbl: 'Committed', val: `$${committed}K`, good: committed >= 600 },
          { lbl: 'Burn Rate', val: `$${burnRate}K/mo`, good: burnRate < 70 },
        ].map((m, i) => (
          <div key={m.lbl} className={`flex-1 px-3 py-2 text-center ${i < 2 ? 'border-r border-[#1B3A6B]/8' : ''}`}>
            <div className="font-mono text-[7px] text-[#1B3A6B]/40 uppercase tracking-wider">{m.lbl}</div>
            <div className={`font-mono text-[11px] font-bold transition-colors ${m.good ? 'text-[#1E8A4A]' : 'text-[#1B3A6B]'}`}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Sparkline + CRM */}
      <div className="grid grid-cols-2 gap-0 border-b border-[#1B3A6B]/8">
        {/* Sparkline */}
        <div className="px-3 py-3 border-r border-[#1B3A6B]/8">
          <div className="font-mono text-[7.5px] text-black/35 uppercase mb-1.5">Seed Raise Trend</div>
          <svg viewBox="0 0 140 44" className="w-full">
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B3A6B" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1B3A6B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points={sparkPoints} fill="none" stroke="#1B3A6B" strokeWidth="1.5" strokeLinejoin="round" />
            <polygon points={sparkPoints + ` 140,44 0,44`} fill="url(#sparkGrad)" />
            <circle cx={parseInt(sparkPoints.split(' ').pop().split(',')[0])}
              cy={parseInt(sparkPoints.split(' ').pop().split(',')[1])}
              r={3} fill="#1B3A6B" />
          </svg>
          <div className="font-mono text-[8px] text-[#1B3A6B] font-bold mt-1">${committed}K / $1.5M</div>
        </div>
        {/* CRM Kanban */}
        <div className="px-3 py-3">
          <div className="font-mono text-[7.5px] text-black/35 uppercase mb-1.5">Fundraise CRM</div>
          <div className="flex gap-1.5">
            {['Meetings', 'Term Sheet', 'Closed'].map(stage => (
              <div key={stage} className={`flex-1 rounded px-1 py-1 border ${kanbanStage === stage ? 'border-[#1B3A6B]/25 bg-[#EEF3FB]' : 'border-black/5 bg-white/50'}`}>
                <div className="font-mono text-[6.5px] text-black/35 text-center mb-0.5">{stage.toUpperCase()}</div>
                <AnimatePresence>
                  {kanbanStage === stage && (
                    <motion.div layoutId="kanban-pill" className="bg-[#1B3A6B] rounded text-center py-0.5">
                      <span className="font-mono text-[6px] text-white">Summit Cap.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Raise progress bar */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex justify-between text-[8.5px] font-mono">
          <span className="text-black/40">SEED ROUND PROGRESS</span>
          <span className="font-bold text-[#1B3A6B]">{((committed / 1500) * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-black/[0.05] rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-[#1B3A6B] to-[#0066CC] rounded-full"
            style={{ width: `${(committed / 1500) * 100}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-mono text-[7px] text-black/35 uppercase tracking-wider">Active Milestone</div>
            <div className="text-[9.5px] font-semibold text-[#0F0F0F]">Secure Seed Term Sheets</div>
          </div>
          <span className={`font-mono text-[8px] border px-2 py-0.5 rounded-full font-bold transition-all duration-500 ${
            milestone === 'Completed' ? 'bg-[#E8F5EE] border-[#1E8A4A]/20 text-[#1E8A4A]' : 'bg-[#FFFBEB] border-[#B45309]/20 text-[#B45309]'
          }`}>{milestone}</span>
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// PRODUCT SHOWCASE SECTION
// ==========================================
export default function ProductShowcase() {
  return (
    <section id="products" className="py-12 sm:py-16 bg-white border-b border-black/[0.06] relative overflow-hidden">
      <PageBackground />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Product Labs"
          heading="Software concepts under long-term strategic consideration."
          description="These products originate from deep research into underserved markets. Each is currently being evaluated, refined, and strategically assessed as part of our engineering pipeline."
        />

        <div className="flex flex-col gap-10 sm:gap-16 mt-8 sm:mt-12">

          {/* PRODUCT ROW 1: CLAMPBOX */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <ClampboxPreview />
            </div>
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="clampbox">{STATUS}</Tag>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">Clampbox</h3>
              <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">AI Prompt Security Gateway & Governance</span>
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                Enterprise-grade security layer for prompt evaluation and data leak prevention. Intercepts browser chats or API integrations to scrub credentials, enforce compliance rules, and log audit decisions — all within a hardware-attested confidential enclave. Under long-term feasibility evaluation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 border-t border-b border-black/[0.04] py-4">
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-[#0D9488]" /> Key Capabilities
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Prompt Inspection</li><li>Secret Detection</li><li>Data Redaction</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Shield size={10} className="text-[#0D9488]" /> Integration Layers
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Browser Extension</li><li>Developer API Proxy</li><li>Admin Policy Engine</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp size={10} className="text-[#0D9488]" /> Research Roadmap
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Semantic Threat Scan</li><li>LLM Classifiers</li><li>Confidential Enclaves</li>
                  </ul>
                </div>
              </div>
              <div>
                <Link to="/clampbox">
                  <Button variant="clampbox" size="md">Explore Clampbox</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* PRODUCT ROW 3: FORKLINE */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center border-t border-black/[0.04] pt-10 sm:pt-16">
            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="forkline">{STATUS}</Tag>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">Forkline</h3>
              <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Restaurant Operations Platform</span>
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                A hospitality operations engine designed to eliminate expensive hardware lock-ins. Forkline runs natively on generic touch displays, synchronizing seating layouts, kitchen queues, and order flows across dining floors in real time. Being assessed for the mid-market hospitality sector.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 border-t border-b border-black/[0.04] py-4">
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-[#92400E]" /> Key Capabilities
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Interactive Floor Maps</li><li>Mesh Kitchen Queue</li><li>Inventory Webhooks</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Compass size={10} className="text-[#92400E]" /> Use Cases
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Quick Service Dining</li><li>Floor Seating Tune-up</li><li>Shift Log Overviews</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp size={10} className="text-[#92400E]" /> Research Roadmap
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>POS Terminal Syncs</li><li>Multi-location Console</li><li>Labor Planning Metrics</li>
                  </ul>
                </div>
              </div>
              <div>
                <Link to="/forkline">
                  <Button variant="forkline" size="md">Explore Forkline</Button>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <ForklinePreview />
            </div>
          </div>

          {/* PRODUCT ROW 4: LATTICE */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center border-t border-black/[0.04] pt-10 sm:pt-16">
            <div className="lg:col-span-5">
              <LatticePreview />
            </div>
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="brand">{STATUS}</Tag>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">Lattice</h3>
              <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Startup Operations Platform</span>
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                Structured workspace for startup execution and operational clarity, consolidating fundraising trackers, runway logs, and team coordination workflows into a single, high-visibility dashboard for founders. Actively being scoped for early-stage startup teams.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 border-t border-b border-black/[0.04] py-4">
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-[#1B3A6B]" /> Key Capabilities
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Founder Milestone Logs</li><li>Interactive Runway Metrics</li><li>Deck Share Analytics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Compass size={10} className="text-[#1B3A6B]" /> Use Cases
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Milestone Task Syncs</li><li>Fundraising CRM Stage</li><li>Equity SAFE Modeling</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp size={10} className="text-[#1B3A6B]" /> Research Roadmap
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Data Dilution Charts</li><li>Advisor Options Pools</li><li>Legal Document Vault</li>
                  </ul>
                </div>
              </div>
              <div>
                <Link to="/lattice">
                  <Button variant="brand" size="md">Explore Lattice</Button>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Pipeline research note */}
        <div className="mt-16 pt-8 border-t border-black/[0.04] text-center">
          <p className="text-xs text-[#A3A3A3] leading-relaxed max-w-xl mx-auto font-mono">
            Several additional product concepts are currently in the internal research pipeline and will be announced when they reach a level of strategic clarity appropriate for public discussion.
          </p>
        </div>

      </Container>
    </section>
  );
}

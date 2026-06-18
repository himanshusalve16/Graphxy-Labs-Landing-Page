import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import Container from '../layout/Container';
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
  Shield
} from 'lucide-react';

// ==========================================
// 1. ANIMATED GRAPHZY PREVIEW COMPONENT
// ==========================================
export function GraphzyPreview() {
  const [promptText, setPromptText] = useState('');
  const [launchAngle, setLaunchAngle] = useState(45);
  const [step, setStep] = useState(0); // 0: typing prompt, 1: AI generation, 2: drawing initial trajectory, 3: sliding launch angle, 4: tooltip

  useEffect(() => {
    let active = true;
    let timerId;
    let intervalId;

    if (step === 0) {
      const text = "Simulate a physics projectile trajectory";
      let idx = 0;
      setPromptText('');
      setLaunchAngle(45);
      intervalId = setInterval(() => {
        if (!active) return;
        setPromptText(text.slice(0, idx + 1));
        idx++;
        if (idx >= text.length) {
          clearInterval(intervalId);
          timerId = setTimeout(() => {
            if (active) setStep(1);
          }, 800);
        }
      }, 70);
    } else if (step === 1) {
      timerId = setTimeout(() => {
        if (active) setStep(2);
      }, 1500);
    } else if (step === 2) {
      timerId = setTimeout(() => {
        if (active) setStep(3);
      }, 1500);
    } else if (step === 3) {
      let angle = 45;
      intervalId = setInterval(() => {
        if (!active) return;
        angle += 1;
        setLaunchAngle(angle);
        if (angle >= 65) {
          clearInterval(intervalId);
          timerId = setTimeout(() => {
            if (active) setStep(4);
          }, 800);
        }
      }, 50);
    } else if (step === 4) {
      timerId = setTimeout(() => {
        if (active) setStep(0);
      }, 3500);
    }

    return () => {
      active = false;
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [step]);

  // Projectile trajectory math for 200x200 viewBox
  const getPhysicsPath = () => {
    const cx = 15;
    const cy = 175;
    const g = 9.8;
    const velocity = 20;
    const rad = (launchAngle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const tFlight = (2 * vy) / g;
    const points = [];
    const numPoints = 30;
    for (let i = 0; i <= numPoints; i++) {
      const t = (tFlight * i) / numPoints;
      const xVal = cx + (t * vx) * (160 / (vx * tFlight));
      const yVal = cy - (vy * t - 0.5 * g * t * t) * (110 / ((vy * vy) / (2 * g)));
      if (!isNaN(xVal) && !isNaN(yVal)) {
        points.push(`${xVal.toFixed(1)},${yVal.toFixed(1)}`);
      }
    }
    return `M 15,175 L ${points.join(' L ')}`;
  };

  return (
    <Card variant="surface" className="p-5 bg-[#FAFAF8] border-black/5 shadow-sm overflow-hidden flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center pb-2 border-b border-black/[0.04]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
        </div>
        <span className="font-mono text-[9px] text-[#A3A3A3]">graphzy.io/demo/animated</span>
      </div>

      {/* Screen Area */}
      <div className="relative h-[180px] sm:h-[200px] bg-white border border-black/5 rounded-lg overflow-hidden flex items-center justify-center">
        {step !== 1 && (
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 pointer-events-none opacity-[0.12]">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="border-r border-b border-black/30 w-full h-full" />
            ))}
          </div>
        )}

        {/* X/Y Ground Axis */}
        <div className="absolute left-0 right-0 h-[1px] bg-black/10 top-[175px]" />

        {/* AI Prompt Input Bar */}
        <div className="absolute top-3 left-3 right-3 bg-[#FAFAF8]/92 backdrop-blur-sm border border-black/5 rounded px-2.5 py-1.5 text-[9px] font-mono shadow-xs flex items-center gap-1.5 z-10">
          <span className="text-[#0066CC] font-bold flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#0066CC] animate-ping" />
            Prompt:
          </span>
          <span className="text-black/80 truncate font-semibold">{promptText}</span>
          {step === 0 && <span className="w-1 h-3 bg-black/50 animate-pulse" />}
        </div>

        {/* Processing overlay */}
        {step === 1 ? (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
            <span className="w-4 h-4 border-2 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-[8px] text-[#0066CC] uppercase tracking-wider font-semibold">AI Modeling physics parameters...</span>
          </div>
        ) : (
          <>
            {step > 1 && (
              <svg className="absolute inset-0 w-full h-full text-[#0066CC] overflow-hidden" viewBox="0 0 200 200">
                <motion.path 
                  d={getPhysicsPath()} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                  fill="none" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }}
                  key={step === 2 ? 'initial' : 'sliding'}
                />
                <circle cx="15" cy="175" r="4.5" fill="#0066CC" />
                <line x1="15" y1="175" x2={15 + 12 * Math.cos((launchAngle * Math.PI) / 180)} y2={175 - 12 * Math.sin((launchAngle * Math.PI) / 180)} stroke="#0066CC" strokeWidth="2.5" />
              </svg>
            )}

            {/* Dynamic Coordinate Tooltip */}
            <AnimatePresence>
              {step === 4 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-10 right-4 bg-black text-white px-2 py-1 rounded text-[8px] font-mono shadow-md text-left z-10"
                >
                  <div>Launch angle: {launchAngle}°</div>
                  <div>Status: Model Synthesized</div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <span className="absolute bottom-2 right-2 text-[7px] font-mono text-black/30">COMING SOON</span>
      </div>

      {/* Control Panel Simulator */}
      <div className="bg-white rounded-lg p-3 border border-black/5 flex flex-col gap-2">
        <div className="flex justify-between items-baseline text-[9px] font-semibold">
          <span className="text-black/50 font-mono">LAUNCH ANGLE PARAMETER</span>
          <span className="font-mono text-[#0066CC]">{launchAngle}°</span>
        </div>
        <div className="relative w-full h-2 flex items-center">
          <div className="absolute inset-y-0 flex items-center w-full">
            <div className="w-full h-0.5 bg-black/[0.06] rounded-full relative">
              <div
                className="absolute left-0 top-0 h-full bg-[#0066CC] rounded-full"
                style={{ width: `${((launchAngle - 15) / 60) * 100}%` }}
              />
            </div>
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0066CC] shadow-xs"
            style={{ left: `${((launchAngle - 15) / 60) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// 1.5. ANIMATED CLAMPBOX PREVIEW COMPONENT
// ==========================================
export function ClampboxPreview() {
  const [step, setStep] = useState(0); // 0: enclave init, 1: code processing, 2: attestation verified, 3: secure state, 4: loop reset
  const [secureState, setSecureState] = useState('Off');
  const [terminalLines, setTerminalLines] = useState([]);

  useEffect(() => {
    let active = true;
    let timerId;

    if (step === 0) {
      setSecureState('Initializing');
      setTerminalLines(['[sys] Initializing secure runtime...', '[sys] Allocating hardware enclave memory...']);
      timerId = setTimeout(() => { if (active) setStep(1); }, 1500);
    } else if (step === 1) {
      setTerminalLines(prev => [...prev, '[sys] Encryption key generated.', '[sys] Running workload in isolated CPU cache...']);
      timerId = setTimeout(() => { if (active) setStep(2); }, 1800);
    } else if (step === 2) {
      setTerminalLines(prev => [...prev, '[attest] Verifying hardware signature...', '[attest] SHA-256 verification: PASS']);
      timerId = setTimeout(() => { if (active) setStep(3); }, 1500);
    } else if (step === 3) {
      setSecureState('SECURE');
      setTerminalLines(prev => [...prev, '[sys] Execution complete. Memory zeroed.', '[sys] Output returned cryptographically.']);
      timerId = setTimeout(() => { if (active) setStep(4); }, 3000);
    } else if (step === 4) {
      timerId = setTimeout(() => { if (active) setStep(0); }, 1000);
    }

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, [step]);

  return (
    <Card variant="surface" className="p-5 bg-[#F0F7F7] border-[#0D9488]/14 shadow-sm overflow-hidden flex flex-col gap-4 w-full text-left">
      <div className="flex justify-between items-center pb-2 border-b border-[#0D9488]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
        </div>
        <span className="font-mono text-[9px] text-[#0D9488]">clampbox.graphxy.com/console/enclave</span>
      </div>

      {/* Screen Area */}
      <div className="bg-[#0F2027] border border-[#0D9488]/10 rounded-lg p-3 h-[190px] sm:h-[210px] flex flex-col justify-between relative overflow-hidden font-mono text-[9px] text-white/90">
        <div className="flex justify-between items-center border-b border-white/[0.06] pb-1.5 mb-1.5">
          <span className="font-bold text-[#0D9488] uppercase tracking-wider text-[8px]">Enclave Compute Unit</span>
          <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold ${
            secureState === 'SECURE' ? 'text-white bg-[#0D9488]' : 'text-black bg-amber-400'
          }`}>
            {secureState}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-1 text-[9px] text-[#A3D9D9] leading-tight select-none">
          {terminalLines.map((line, i) => (
            <div key={i} className={line.startsWith('[attest]') ? 'text-[#0D9488] font-bold' : ''}>
              {line}
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-1.5 mt-1.5 flex justify-between items-center text-[8px] text-white/50">
          <span>MEM: 512GB encrypted</span>
          <span>ATTESTATION: ACTIVE</span>
        </div>
      </div>

      {/* Metrics strip */}
      <div className="bg-white rounded-lg p-3 border border-[#0D9488]/10 flex justify-between items-center text-left text-[9px]">
        <div>
          <span className="text-black/45 block font-mono">CRYPTOGRAPHIC STATE</span>
          <span className="text-[10px] font-bold text-black">AES-256-GCM Memory Shield</span>
        </div>
        <span className="font-mono text-[8px] border border-[#0D9488]/20 bg-[#F0F7F7] text-[#0D9488] px-2 py-0.5 rounded-full font-semibold">
          Hardware Verified
        </span>
      </div>
    </Card>
  );
}

// ==========================================
// 2. ANIMATED FORKLINE PREVIEW COMPONENT
// ==========================================
export function ForklinePreview() {
  const [step, setStep] = useState(0); // 0: Seated state, 1: order arrives, 2: kitchen update, 3: warning limit, 4: clean/reset
  const [activeNotification, setActiveNotification] = useState(false);
  const [t2Status, setT2Status] = useState('Empty');
  const [t2Duration, setT2Duration] = useState('0m');
  const [activeKitchenOrders, setActiveKitchenOrders] = useState([
    { id: 'o1', item: 'T-1: Butter Chicken & Naan', time: '14m' },
    { id: 'o2', item: 'T-3: Paneer Tikka', time: '6m' }
  ]);

  useEffect(() => {
    let active = true;
    let timerId;
    let intervalId;

    if (step === 0) {
      // Reset state
      setT2Status('Empty');
      setT2Duration('0m');
      setActiveNotification(false);
      setActiveKitchenOrders([
        { id: 'o1', item: 'T-1: Butter Chicken & Naan', time: '14m' },
        { id: 'o2', item: 'T-3: Paneer Tikka', time: '6m' }
      ]);
      timerId = setTimeout(() => { if (active) setStep(1); }, 2000);
    } else if (step === 1) {
      // Table 2 gets seated, order sent to kitchen
      setT2Status('Seated');
      setT2Duration('1m');
      setActiveKitchenOrders(prev => [...prev, { id: 'o3', item: 'T-2: Hyderabadi Biryani', time: '1m' }]);
      timerId = setTimeout(() => { if (active) setStep(2); }, 2500);
    } else if (step === 2) {
      // Kitchen completes Table 3 salad order, time passes
      setActiveKitchenOrders(prev => prev.filter(o => o.id !== 'o2').map(o => ({ ...o, time: o.id === 'o1' ? '19m' : '6m' })));
      setT2Duration('6m');
      timerId = setTimeout(() => { if (active) setStep(3); }, 2500);
    } else if (step === 3) {
      // Table 1 warning limit triggered
      setActiveNotification(true);
      timerId = setTimeout(() => { if (active) setStep(4); }, 4000);
    } else if (step === 4) {
      // Reset loop
      timerId = setTimeout(() => { if (active) setStep(0); }, 1000);
    }

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, [step]);

  return (
    <Card variant="surface" className="p-5 bg-[#FEF7EC] border-[#B45309]/14 shadow-sm overflow-hidden flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center pb-2 border-b border-[#B45309]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
        </div>
        <span className="font-mono text-[9px] text-[#92400E]">forkline.graphxy.com/dashboard/floor</span>
      </div>

      {/* Screen Area */}
      <div className="bg-white border border-[#B45309]/10 rounded-lg p-4 h-[190px] sm:h-[210px] flex flex-col justify-between relative overflow-hidden">
        {/* Floor plan tables */}
        <div className="flex justify-between items-center border-b border-black/[0.04] pb-2 mb-2">
          <span className="font-mono text-[9px] font-bold text-[#92400E] uppercase">Dining Floor Grid</span>
          <span className="text-[9px] text-black/40">Active mesh local terminals</span>
        </div>

        <div className="grid grid-cols-3 gap-3 my-1">
          {/* Table 1 */}
          <div className="border border-black/5 bg-[#FAFAF8] p-2.5 rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
            <div className="text-[10px] font-bold text-[#0F0F0F]">T-1</div>
            <span className="text-[8px] text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.2 rounded-full mt-1.5 font-medium">Main Course</span>
          </div>

          {/* Table 2 (Dynamic state) */}
          <div className={`p-2.5 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 ${
            t2Status === 'Empty' ? 'border border-black/5 bg-[#FAFAF8] opacity-40' :
            step === 3 ? 'border border-[#EF4444]/30 bg-[#FEF2F2] animate-pulse' :
            'border border-[#B45309]/20 bg-[#FEF7EC]'
          }`}>
            <div className="text-[10px] font-bold text-[#0F0F0F]">T-2</div>
            <span className={`text-[8px] px-1.5 py-0.2 rounded-full mt-1.5 font-medium ${
              t2Status === 'Empty' ? 'text-black/40 bg-black/[0.03]' :
              step === 3 ? 'text-[#EF4444] bg-[#FEF2F2]' :
              'text-[#B45309] bg-[#FFFBEB]'
            }`}>
              {t2Status === 'Empty' ? 'Empty' : step === 3 ? 'ALERT' : 'Starters'}
            </span>
          </div>

          {/* Table 3 */}
          <div className="border border-black/5 bg-[#FAFAF8] p-2.5 rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
            <div className="text-[10px] font-bold text-[#0F0F0F]">T-3</div>
            <span className="text-[8px] text-[#1E8A4A] bg-[#E8F5EE] px-1.5 py-0.2 rounded-full mt-1.5 font-medium">Starters</span>
          </div>
        </div>

        {/* Warnings / Alerts bar */}
        <div className="h-9 relative mt-2">
          <AnimatePresence>
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-0 bg-[#FEF2F2] border border-[#EF4444]/10 rounded-md p-2 flex items-center justify-between text-left shadow-xs"
              >
                <span className="text-[9px] font-semibold text-[#EF4444] flex items-center gap-1.5">
                  <Clock size={11} /> Table 02 over Starter limit ({t2Duration})
                </span>
                <span className="text-[8px] font-bold text-[#EF4444] font-mono">42m</span>
              </motion.div>
            )}
            {step !== 3 && (
              <div className="text-[9px] text-black/30 flex items-center justify-center h-full border border-dashed border-black/5 rounded">
                Telemetry normal
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Incoming Order Notification Bubble */}
        <AnimatePresence>
          {activeNotification && (
            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="absolute top-12 right-4 bg-black text-white px-3 py-2 rounded-xl text-[10px] font-mono shadow-lg text-left z-20 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
              <div>
                <span className="block font-bold">NEW ORDER INCOMING</span>
                <span className="text-white/70">Table 02: Pav Bhaji</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Kitchen Queue Stream Simulator */}
      <div className="bg-white rounded-lg p-3 border border-[#B45309]/10 flex flex-col gap-1.5 text-left">
        <span className="text-[9px] font-mono text-[#92400E] font-bold uppercase tracking-wider block">Kitchen Display Queue (KOTs) ({activeKitchenOrders.length})</span>
        <div className="flex flex-col gap-1">
          {activeKitchenOrders.map(order => (
            <div key={order.id} className="flex justify-between items-center text-[10px] border-b border-black/[0.02] pb-1">
              <span className="font-sans font-medium text-black/70">{order.item}</span>
              <span className="font-mono text-[#92400E] font-semibold">{order.time}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// 3. ANIMATED LATTICE PREVIEW COMPONENT
// ==========================================
export function LatticePreview() {
  const [step, setStep] = useState(0); // 0: overview, 1: CRM transition, 2: progress increase, 3: runway/milestone completed
  const [committed, setCommitted] = useState(450);
  const [apexStage, setApexStage] = useState('Meetings'); // 'Meetings' | 'Term Sheet'
  const [runway, setRunway] = useState(14);
  const [milestone, setMilestone] = useState('In Progress');

  useEffect(() => {
    let active = true;
    let timerId;
    let intervalId;

    if (step === 0) {
      setCommitted(450);
      setApexStage('Meetings');
      setRunway(14);
      setMilestone('In Progress');
      timerId = setTimeout(() => {
        if (active) setStep(1);
      }, 2000);
    } else if (step === 1) {
      setApexStage('Term Sheet');
      timerId = setTimeout(() => {
        if (active) setStep(2);
      }, 1500);
    } else if (step === 2) {
      let currentVal = 450;
      intervalId = setInterval(() => {
        if (!active) return;
        currentVal += 25;
        setCommitted(currentVal);
        if (currentVal >= 750) {
          clearInterval(intervalId);
          timerId = setTimeout(() => {
            if (active) setStep(3);
          }, 1000);
        }
      }, 50);
    } else if (step === 3) {
      setRunway(28);
      setMilestone('Completed');
      timerId = setTimeout(() => {
        if (active) setStep(0);
      }, 4000);
    }

    return () => {
      active = false;
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [step]);

  return (
    <Card variant="surface" className="p-5 bg-[#EEF3FB]/50 border-[#1B3A6B]/15 shadow-sm overflow-hidden flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center pb-2 border-b border-[#1B3A6B]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
        </div>
        <span className="font-mono text-[9px] text-[#1B3A6B]">lattice.graphxy.com/workspace/dashboard</span>
      </div>

      {/* Screen Area */}
      <div className="bg-white border border-[#1B3A6B]/10 rounded-lg p-4 h-[190px] sm:h-[210px] flex flex-col justify-between overflow-hidden">
        {/* Startup Runway Stats */}
        <div className="flex justify-between items-center border-b border-black/[0.04] pb-2">
          <div>
            <span className="text-[8px] font-mono text-black/40 block">FOUNDER RUNWAY</span>
            <span className="text-[12px] font-serif font-bold text-[#1B3A6B] transition-all duration-300">{runway} Months</span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-mono text-black/45 block">SEED COMMITTED</span>
            <span className="text-[12px] font-mono font-bold text-black/80">${committed}K / $1.5M</span>
          </div>
        </div>

        {/* CRM Kanban simulator */}
        <div className="grid grid-cols-2 gap-2 my-1 sm:my-2">
          {/* Column Meetings */}
          <div className="border border-black/5 bg-[#FAFAF8] p-2 rounded flex flex-col gap-1 min-h-[70px]">
            <div className="font-mono text-[7.5px] font-semibold text-black/40 border-b border-black/[0.04] pb-1 flex justify-between">
              <span>MEETINGS</span>
              <span>{apexStage === 'Meetings' ? 1 : 0}</span>
            </div>
            {apexStage === 'Meetings' && (
              <motion.div 
                layoutId="kanban-card"
                className="bg-white border border-[#1B3A6B]/10 p-1 rounded text-left shadow-xs cursor-pointer"
              >
                <span className="text-[9px] font-bold text-black block">Summit Capital</span>
                <span className="text-[7.5px] text-[#1B3A6B] block">Intro completed</span>
              </motion.div>
            )}
          </div>

          {/* Column Term Sheet */}
          <div className="border border-[#1B3A6B]/10 bg-[#EEF3FB]/30 p-2 rounded flex flex-col gap-1 min-h-[70px]">
            <div className="font-mono text-[7.5px] font-semibold text-[#1B3A6B] border-b border-[#1B3A6B]/15 pb-1 flex justify-between">
              <span>TERM SHEET</span>
              <span>{apexStage === 'Term Sheet' ? 1 : 0}</span>
            </div>
            {apexStage === 'Term Sheet' && (
              <motion.div 
                layoutId="kanban-card"
                className="bg-white border border-[#1B3A6B]/25 p-1 rounded text-left shadow-xs cursor-pointer"
              >
                <span className="text-[9px] font-bold text-black block">Summit Capital</span>
                <span className="text-[7.5px] text-[#1E8A4A] font-medium block">Allocated $300K</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Round Progress Tracker */}
        <div className="bg-[#FAFAF8] border border-black/5 rounded p-2 flex flex-col gap-1">
          <div className="flex justify-between text-[8px] font-mono">
            <span className="text-black/45">PROGRESS</span>
            <span className="font-bold text-[#1B3A6B]">{((committed / 1500) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full h-1 bg-black/[0.05] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#1B3A6B] to-[#0066CC] rounded-full" 
              style={{ width: `${(committed / 1500) * 100}%` }}
              transition={{ type: 'spring', stiffness: 80 }}
            />
          </div>
        </div>
      </div>

      {/* Execution Milestone List */}
      <div className="bg-white rounded-lg p-3 border border-[#1B3A6B]/10 flex justify-between items-center text-left">
        <div>
          <span className="text-[8px] font-mono text-black/40 block">FOUNDER EXECUTION MILESTONE</span>
          <span className="text-[10px] font-bold text-[#0F0F0F]">Milestone: Secure Seed Term Sheets</span>
        </div>
        <span className={`font-mono text-[8px] border px-2 py-0.5 rounded-full font-semibold transition-all duration-300 ${
          milestone === 'Completed' 
            ? 'bg-[#E8F5EE] border-[#1E8A4A]/20 text-[#1E8A4A]' 
            : 'bg-[#FFFBEB] border-[#B45309]/20 text-[#B45309]'
        }`}>
          {milestone}
        </span>
      </div>
    </Card>
  );
}

export default function ProductShowcase() {
  return (
    <section id="products" className="py-12 sm:py-16 bg-white border-b border-black/[0.06] relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#1B3A6B]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-2/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#B45309]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808026_1px,transparent_1px),linear-gradient(to_bottom,#80808026_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading 
          eyebrow="Product Suites"
          heading="Intelligent software flagships under active engineering."
          description="We channel our product philosophy into specialized platforms addressing mathematical visualization, restaurant automation, and founder execution lifecycles."
        />
        
        <div className="flex flex-col gap-10 sm:gap-16 mt-8 sm:mt-12">
          
          {/* PRODUCT ROW 1: GRAPHZY */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Details Column */}
            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="math">COMING SOON</Tag>
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                Graphzy
              </h3>
              
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                An interactive learning web application that transforms plain-language questions into visual, parameter-rich math models. Built on a custom interactive math engine, it converts equations into coordinate grids that users can analyze and manipulate dynamically.
              </p>
              
              {/* Product Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 border-t border-b border-black/[0.04] py-4">
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-[#0066CC]" /> Key Capabilities
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Interactive Graph Canvas</li>
                    <li>Parameter Auto-Mapping</li>
                    <li>Dynamic Sliders</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Compass size={10} className="text-[#0066CC]" /> Use Cases
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>High School Algebra</li>
                    <li>Calculus Visuals</li>
                    <li>STEM Resource Guides</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp size={10} className="text-[#0066CC]" /> Roadmap Preview
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>3D Molecule Canvas</li>
                    <li>Vector Fields Visuals</li>
                    <li>Biology SVG Maps</li>
                  </ul>
                </div>
              </div>

              <div>
                <Link to="/graphzy">
                  <Button variant="graphzy" size="md">Explore Graphzy</Button>
                </Link>
              </div>
            </div>

            {/* Dynamic Preview Component */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <GraphzyPreview />
            </div>
          </div>

          {/* PRODUCT ROW 2: CLAMPBOX */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center border-t border-black/[0.04] pt-10 sm:pt-16">
            {/* Dynamic Preview Component */}
            <div className="lg:col-span-5">
              <ClampboxPreview />
            </div>

            {/* Details Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="clampbox">COMING SOON</Tag>
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                Clampbox
              </h3>
              
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                Confidential execution infrastructure for AI workloads, autonomous agents, and sensitive data. Run untrusted code or process highly regulated data inside secure enclaves with hardware-verified protection.
              </p>
              
              {/* Product Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 border-t border-b border-black/[0.04] py-4">
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-[#0D9488]" /> Key Capabilities
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Hardware Enclaves</li>
                    <li>Zero-Knowledge Agents</li>
                    <li>Memory Encryption</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Shield size={10} className="text-[#0D9488]" /> Trust & Security
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Cryptographic Attestation</li>
                    <li>Zero Trust Operator</li>
                    <li>Isolated CPU Caches</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp size={10} className="text-[#0D9488]" /> Roadmap Preview
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Multi-cloud Enclave SDK</li>
                    <li>Decentralized Verification</li>
                    <li>Agent Secret Storage</li>
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
            {/* Details Column */}
            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="forkline">COMING SOON</Tag>
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                Forkline
              </h3>
              
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                An upcoming restaurant management and hospitality operations engine. Designed to eliminate expensive hardware lock-ins, Forkline runs natively on generic touch displays and monitors, synchronizing seating layouts, orders, and food prep speeds.
              </p>
              
              {/* Product Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 border-t border-b border-black/[0.04] py-4">
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-[#92400E]" /> Key Capabilities
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Interactive Floor Maps</li>
                    <li>Mesh Kitchen Queue</li>
                    <li>Inventory Webhooks</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Compass size={10} className="text-[#92400E]" /> Use Cases
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Quick Service Dining</li>
                    <li>Floor Seating Tune-up</li>
                    <li>Shift Log Overviews</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp size={10} className="text-[#92400E]" /> Roadmap Preview
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>POS Terminal Syncs</li>
                    <li>Multi-location Console</li>
                    <li>Labor Planning Metrics</li>
                  </ul>
                </div>
              </div>

              <div>
                <Link to="/forkline">
                  <Button variant="forkline" size="md">Explore Forkline</Button>
                </Link>
              </div>
            </div>

            {/* Dynamic Preview Component */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <ForklinePreview />
            </div>
          </div>

          {/* PRODUCT ROW 4: LATTICE */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center border-t border-black/[0.04] pt-10 sm:pt-16">
            {/* Dynamic Preview Component */}
            <div className="lg:col-span-5">
              <LatticePreview />
            </div>

            {/* Details Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="brand">COMING SOON</Tag>
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                Lattice
              </h3>
              
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                Structured workspace for startup execution and operational clarity, consolidating fundraising trackers, runway logs, and team coordination workflows into a single, high-visibility dashboard for founders.
              </p>
              
              {/* Product Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 border-t border-b border-black/[0.04] py-4">
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-[#1B3A6B]" /> Key Capabilities
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Founder Milestone Logs</li>
                    <li>Interactive Runway metrics</li>
                    <li>Deck Share Analytics</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Compass size={10} className="text-[#1B3A6B]" /> Use Cases
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Milestone Task Syncs</li>
                    <li>Fundraising CRM Stage</li>
                    <li>Equity SAFE modeling</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp size={10} className="text-[#1B3A6B]" /> Roadmap Preview
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Data dilutive charts</li>
                    <li>Advisor Options Pools</li>
                    <li>Legal Document Vault</li>
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
      </Container>
    </section>
  );
}

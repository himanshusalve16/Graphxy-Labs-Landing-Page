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
  Plus
} from 'lucide-react';

// ==========================================
// 1. ANIMATED GRAPHZY PREVIEW COMPONENT
// ==========================================
function GraphzyPreview() {
  const [equation, setEquation] = useState('');
  const [sliderVal, setSliderVal] = useState(1.0);
  const [step, setStep] = useState(0); // 0: typing, 1: graphed, 2: sliding, 3: tooltip

  useEffect(() => {
    let active = true;
    let timerId;
    let intervalId;

    if (step === 0) {
      const text = "y = 1.6 * x²";
      let idx = 0;
      setEquation('');
      setSliderVal(1.0);
      intervalId = setInterval(() => {
        if (!active) return;
        setEquation(text.slice(0, idx + 1));
        idx++;
        if (idx >= text.length) {
          clearInterval(intervalId);
          timerId = setTimeout(() => {
            if (active) setStep(1);
          }, 1000);
        }
      }, 120);
    } else if (step === 1) {
      timerId = setTimeout(() => {
        if (active) setStep(2);
      }, 1500);
    } else if (step === 2) {
      let val = 1.0;
      intervalId = setInterval(() => {
        if (!active) return;
        val += 0.1;
        setSliderVal(parseFloat(val.toFixed(1)));
        if (val >= 2.4) {
          clearInterval(intervalId);
          timerId = setTimeout(() => {
            if (active) setStep(3);
          }, 1000);
        }
      }, 80);
    } else if (step === 3) {
      timerId = setTimeout(() => {
        if (active) setStep(0);
      }, 3000);
    }

    return () => {
      active = false;
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [step]);

  // Compute coordinate SVG path for y = a * x^2
  const getPath = () => {
    const cx = 100;
    const cy = 150;
    const scale = 12;
    let points = [];
    for (let x = -8; x <= 8; x += 0.2) {
      const svgX = cx + x * scale;
      const svgY = cy - (sliderVal * (x ** 2)) * 1.5;
      points.push(`${svgX},${svgY}`);
    }
    return `M ${points.join(' L ')}`;
  };

  return (
    <Card variant="surface" className="p-5 bg-[#FAFAF8] border-black/5 shadow-sm overflow-hidden flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center pb-2 border-b border-black/[0.04]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
        </div>
        <span className="font-mono text-[9px] text-[#A3A3A3]">graphzy.io/visualizer/demo</span>
      </div>

      {/* Screen Area */}
      <div className="relative h-[200px] bg-white border border-black/5 rounded-lg overflow-hidden flex items-center justify-center">
        {/* Graph Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 pointer-events-none opacity-[0.15]">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="border-r border-b border-black/30 w-full h-full" />
          ))}
        </div>

        {/* X/Y Axes */}
        <div className="absolute left-0 right-0 h-[1.5px] bg-black/10" />
        <div className="absolute top-0 bottom-0 w-[1.5px] bg-black/10" />

        {/* Animated Equation Input Bar */}
        <div className="absolute top-3 left-3 bg-[#FAFAF8]/90 backdrop-blur-sm border border-black/5 rounded px-2.5 py-1 text-[10px] font-mono shadow-sm flex items-center gap-1.5 min-w-[110px]">
          <span className="text-[#0066CC] font-bold">f(x) =</span>
          <span>{equation}</span>
          {step === 0 && <span className="w-1.5 h-3 bg-black/50 animate-pulse" />}
        </div>

        {/* Graph Path Draw */}
        <svg className="absolute inset-0 w-full h-full text-[#0066CC] overflow-hidden" viewBox="0 0 200 200">
          <clipPath id="graph-clip">
            <rect x="0" y="0" width="200" height="200" />
          </clipPath>
          {step > 0 && (
            <motion.path 
              d={getPath()} 
              stroke="currentColor" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
              clipPath="url(#graph-clip)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              key={`${step}-${sliderVal}`}
            />
          )}
        </svg>

        {/* Dynamic Coordinate Tooltip */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-12 right-12 bg-black text-white px-2 py-1 rounded text-[9px] font-mono shadow-md text-left"
            >
              <div>Vertex: (0,0)</div>
              <div>Stretch: {sliderVal}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <span className="absolute bottom-2 right-2 text-[8px] font-mono text-black/30">LOCKED (DEMO)</span>
      </div>

      {/* Control Panel Simulator */}
      <div className="bg-white rounded-lg p-3 border border-black/5 flex flex-col gap-2">
        <div className="flex justify-between items-baseline text-[10px] font-semibold">
          <span className="text-black/50 font-mono">PARAMETER a (STRETCH)</span>
          <span className="font-mono text-[#0066CC]">{sliderVal}</span>
        </div>
        <div className="relative w-full h-1 bg-black/[0.06] rounded-full">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-[#0066CC] rounded-full"
            style={{ width: `${(sliderVal / 2.5) * 100}%` }}
          />
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#0066CC] shadow"
            style={{ left: `${(sliderVal / 2.5) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// 2. ANIMATED MESA PREVIEW COMPONENT
// ==========================================
function MesaPreview() {
  const [step, setStep] = useState(0); // 0: Seated state, 1: order arrives, 2: kitchen update, 3: warning limit, 4: clean/reset
  const [activeNotification, setActiveNotification] = useState(false);
  const [t2Status, setT2Status] = useState('Empty');
  const [t2Duration, setT2Duration] = useState('0m');
  const [activeKitchenOrders, setActiveKitchenOrders] = useState([
    { id: 'o1', item: 'T-1: Steak Frites', time: '14m' },
    { id: 'o2', item: 'T-3: Caesar Salad', time: '6m' }
  ]);

  useEffect(() => {
    let active = true;
    let timerId;

    const runStep = (nextStep, delay) => {
      timerId = setTimeout(() => {
        if (active) setStep(nextStep);
      }, delay);
    };

    if (step === 0) {
      setT2Status('Empty');
      setT2Duration('0m');
      setActiveNotification(false);
      setActiveKitchenOrders([
        { id: 'o1', item: 'T-1: Steak Frites', time: '14m' },
        { id: 'o2', item: 'T-3: Caesar Salad', time: '6m' }
      ]);
      runStep(1, 2000);
    } else if (step === 1) {
      setActiveNotification(true);
      runStep(2, 2000);
    } else if (step === 2) {
      setActiveNotification(false);
      setT2Status('Seated');
      setT2Duration('18m');
      setActiveKitchenOrders(prev => [
        ...prev,
        { id: 'o3', item: 'T-2: Calamari Appetizer', time: '1m' }
      ]);
      runStep(3, 3000);
    } else if (step === 3) {
      setT2Duration('42m');
      runStep(4, 3000);
    } else if (step === 4) {
      runStep(0, 2500);
    }

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, [step]);

  return (
    <Card variant="surface" className="p-5 bg-[#FEF7EC] border-[#B45309]/14 shadow-sm overflow-hidden flex flex-col gap-4 w-full relative">
      <div className="flex justify-between items-center pb-2 border-b border-[#B45309]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
        </div>
        <span className="font-mono text-[9px] text-[#92400E]">mesa.graphxy.com/dashboard/floor</span>
      </div>

      {/* Screen Area */}
      <div className="bg-white border border-[#B45309]/10 rounded-lg p-4 h-[210px] flex flex-col justify-between relative overflow-hidden">
        {/* Floor plan tables */}
        <div className="flex justify-between items-center border-b border-black/[0.04] pb-2 mb-2">
          <span className="font-mono text-[9px] font-bold text-[#92400E] uppercase">Dining Floor Grid</span>
          <span className="text-[9px] text-black/40">Active mesh local terminals</span>
        </div>

        <div className="grid grid-cols-3 gap-3 my-1">
          {/* Table 1 */}
          <div className="border border-black/5 bg-[#FAFAF8] p-2.5 rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
            <div className="text-[10px] font-bold text-[#0F0F0F]">T-1</div>
            <span className="text-[8px] text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.2 rounded-full mt-1.5 font-medium">Entrees</span>
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
              {t2Status === 'Empty' ? 'Empty' : step === 3 ? 'ALERT' : 'Apps'}
            </span>
          </div>

          {/* Table 3 */}
          <div className="border border-black/5 bg-[#FAFAF8] p-2.5 rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
            <div className="text-[10px] font-bold text-[#0F0F0F]">T-3</div>
            <span className="text-[8px] text-[#1E8A4A] bg-[#E8F5EE] px-1.5 py-0.2 rounded-full mt-1.5 font-medium">Appetizer</span>
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
                  <Clock size={11} /> Table 02 over Appetizer limit ({t2Duration})
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
                <span className="text-white/70">Table 02: Calamari Appetizer</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Kitchen Queue Stream Simulator */}
      <div className="bg-white rounded-lg p-3 border border-[#B45309]/10 flex flex-col gap-1.5 text-left">
        <span className="text-[9px] font-mono text-[#92400E] font-bold uppercase tracking-wider block">Kitchen Display Queue ({activeKitchenOrders.length})</span>
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
// 3. ANIMATED VENTUREFLOW PREVIEW COMPONENT
// ==========================================
function VentureFlowPreview() {
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
        <span className="font-mono text-[9px] text-[#1B3A6B]">ventureflow.graphxy.com/console/founders</span>
      </div>

      {/* Screen Area */}
      <div className="bg-white border border-[#1B3A6B]/10 rounded-lg p-4 h-[210px] flex flex-col justify-between overflow-hidden">
        {/* Startup Runway Stats */}
        <div className="flex justify-between items-center border-b border-black/[0.04] pb-2">
          <div>
            <span className="text-[8px] font-mono text-black/40 block">FOUNDER RUNWAY</span>
            <span className="text-[12px] font-serif font-bold text-[#1B3A6B] transition-all duration-300">{runway} Months</span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-mono text-black/40 block">SEED COMMITTED</span>
            <span className="text-[12px] font-mono font-bold text-black/80">${committed}K / $1.5M</span>
          </div>
        </div>

        {/* CRM Kanban simulator */}
        <div className="grid grid-cols-2 gap-2 my-2">
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
      {/* Background radial gradients for refined depth */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#1B3A6B]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-2/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#B45309]/3 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading 
          eyebrow="Product Suites"
          heading="Intelligent software flagships under active engineering."
          description="We channel our product philosophy into specialized platforms addressing mathematical visualization, restaurant automation, and founder execution lifecycles."
        />
        
        <div className="flex flex-col gap-16 mt-12">
          
          {/* PRODUCT ROW 1: GRAPHZY */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Details Column */}
            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="math">Prototype Preview</Tag>
                <span className="font-mono text-[9px] text-[#A3A3A3] font-bold uppercase tracking-wider">Not Functional Yet</span>
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                Graphzy
              </h3>
              
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                An interactive learning web application that transforms plain-language questions into visual, parameter-rich math models. Built on a CDN-delivered Desmos engine, it converts equations into coordinate grids that users can analyze and manipulate dynamically.
              </p>
              
              {/* Product Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 border-t border-b border-black/[0.04] py-4">
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-[#0066CC]" /> Key Capabilities
                  </h4>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                    <li>Desmos Graph Canvas</li>
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
                  <Button variant="graphzy" size="md">Explore Graphzy App</Button>
                </Link>
              </div>
            </div>

            {/* Dynamic Preview Component */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <GraphzyPreview />
            </div>
          </div>

          {/* PRODUCT ROW 2: MESA */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-black/[0.04] pt-16">
            {/* Dynamic Preview Component */}
            <div className="lg:col-span-5">
              <MesaPreview />
            </div>

            {/* Details Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="serva">Concept Preview</Tag>
                <span className="font-mono text-[9px] text-[#A3A3A3] font-bold uppercase tracking-wider">Product In Development</span>
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                Mesa
              </h3>
              
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                An upcoming restaurant management and hospitality operations engine. Designed to eliminate expensive hardware lock-ins, Mesa runs natively on generic touch displays and monitors, synchronizing seating layouts, orders, and food prep speeds.
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
                <Link to="/mesa">
                  <Button variant="serva" size="md">Join Developer Preview Waitlist</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* PRODUCT ROW 3: VENTUREFLOW */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-black/[0.04] pt-16">
            {/* Details Column */}
            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Tag variant="brand">Early Concept</Tag>
                <span className="font-mono text-[9px] text-[#A3A3A3] font-bold uppercase tracking-wider">Coming Soon</span>
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                VentureFlow
              </h3>
              
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-5">
                The operating system for startup execution. Built to eliminate the complexity of fragmented spreadsheets and scattered tools, VentureFlow consolidates runway logs, investor communications, cap tables, and slide-deck views into a single, high-visibility dashboard for founders.
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
                <Link to="/ventureflow">
                  <Button variant="brand" size="md">Explore VentureFlow Concept</Button>
                </Link>
              </div>
            </div>

            {/* Dynamic Preview Component */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <VentureFlowPreview />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

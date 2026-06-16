import React, { useState, useEffect } from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Clock, 
  Activity, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Terminal, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

// ==========================================
// 1. INTERACTIVE GRAPHZY COMPONENT
// ==========================================
function InteractiveGraphzy() {
  const [activePreset, setActivePreset] = useState('stem'); // 'stem' | 'data'
  const [sliderVal, setSliderVal] = useState(1.5);
  const [equation, setEquation] = useState('y = 1.5 * x²');

  useEffect(() => {
    if (activePreset === 'stem') {
      setEquation(`f(x) = ${sliderVal} * x²`);
    } else {
      setEquation(`growth(t) = ${sliderVal} ^ t`);
    }
  }, [activePreset, sliderVal]);

  const getPath = () => {
    const cx = 100;
    const cy = 130;
    const scaleX = 12;
    let points = [];
    
    if (activePreset === 'stem') {
      for (let x = -8; x <= 8; x += 0.25) {
        const svgX = cx + x * scaleX;
        const svgY = cy - (sliderVal * (x ** 2)) * 1.2;
        points.push(`${svgX},${svgY}`);
      }
    } else {
      for (let t = -6; t <= 10; t += 0.25) {
        const svgX = cx + t * scaleX;
        const svgY = cy - Math.pow(sliderVal, t) * 6;
        points.push(`${svgX},${svgY}`);
      }
    }
    return `M ${points.join(' L ')}`;
  };

  return (
    <Card variant="surface" className="p-6 bg-[#FAFAF8] border-black/5 shadow-sm overflow-hidden flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center pb-2 border-b border-black/[0.04]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        </div>
        <span className="font-mono text-[9px] text-[#A3A3A3]">graphzy.io/demo/interactive</span>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => { setActivePreset('stem'); setSliderVal(1.5); }}
          className={`px-3 py-1 text-[10px] font-mono rounded-full border transition-all ${
            activePreset === 'stem' 
              ? 'bg-[#0066CC] border-[#0066CC] text-white' 
              : 'bg-white border-black/5 text-[#525252] hover:bg-black/[0.02]'
          }`}
        >
          STEM: Quadratic
        </button>
        <button 
          onClick={() => { setActivePreset('data'); setSliderVal(1.2); }}
          className={`px-3 py-1 text-[10px] font-mono rounded-full border transition-all ${
            activePreset === 'data' 
              ? 'bg-[#0066CC] border-[#0066CC] text-white' 
              : 'bg-white border-black/5 text-[#525252] hover:bg-black/[0.02]'
          }`}
        >
          DATA: Exponential
        </button>
      </div>

      {/* Screen Area */}
      <div className="relative h-[220px] bg-white border border-black/5 rounded-lg overflow-hidden flex items-center justify-center">
        {/* Graph Grid */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 pointer-events-none opacity-[0.12]">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border-r border-b border-black/30 w-full h-full" />
          ))}
        </div>

        {/* X/Y Axes */}
        <div className="absolute left-0 right-0 h-[1px] bg-black/10 top-[130px]" />
        <div className="absolute top-0 bottom-0 w-[1px] bg-black/10 left-[100px]" />

        {/* Input Bar */}
        <div className="absolute top-3 left-3 bg-[#FAFAF8]/92 backdrop-blur-sm border border-black/5 rounded px-2 py-1 text-[10px] font-mono shadow-xs flex items-center gap-1.5">
          <span className="text-[#0066CC] font-bold">Inquiry:</span>
          <span>{equation}</span>
        </div>

        {/* Graph SVG */}
        <svg className="absolute inset-0 w-full h-full text-[#0066CC] overflow-hidden" viewBox="0 0 200 200">
          <clipPath id="graphzy-clip">
            <rect x="0" y="0" width="200" height="200" />
          </clipPath>
          <path 
            d={getPath()} 
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round"
            clipPath="url(#graphzy-clip)"
            className="transition-all duration-150"
          />
        </svg>

        <span className="absolute bottom-2 right-2 text-[8px] font-mono text-black/30">INTERACTIVE PREVIEW</span>
      </div>

      {/* Slider controls */}
      <div className="bg-white rounded-lg p-3 border border-black/5 flex flex-col gap-2">
        <div className="flex justify-between items-baseline text-[9px] font-semibold">
          <span className="text-black/50 font-mono">ADJUST COEFFICIENT (STRETCH)</span>
          <span className="font-mono text-[#0066CC]">{sliderVal}</span>
        </div>
        <input 
          type="range" 
          min={activePreset === 'stem' ? '0.5' : '1.05'} 
          max={activePreset === 'stem' ? '2.5' : '1.4'} 
          step="0.05"
          value={sliderVal} 
          onChange={(e) => setSliderVal(parseFloat(e.target.value))}
          className="w-full h-1 bg-black/[0.06] rounded-full appearance-none cursor-pointer accent-[#0066CC]"
        />
      </div>
    </Card>
  );
}

// ==========================================
// 2. INTERACTIVE MESA COMPONENT
// ==========================================
function InteractiveMesa() {
  const [tables, setTables] = useState([
    { id: 'T-1', status: 'Seated', stage: 'Appetizers', capacity: '4' },
    { id: 'T-2', status: 'Empty', stage: 'Ready', capacity: '2' },
    { id: 'T-3', status: 'Seated', stage: 'Entrees', capacity: '6' },
    { id: 'T-4', status: 'Seated', stage: 'Ready', capacity: '4' },
  ]);
  const [kitchenQueue, setKitchenQueue] = useState([
    { id: 'o1', desc: 'T-1: Calamari App', time: '11m' },
    { id: 'o2', desc: 'T-3: Fillet Steak', time: '4m' },
  ]);

  const toggleTable = (id) => {
    setTables(prev => prev.map(t => {
      if (t.id === id) {
        if (t.status === 'Empty') {
          // Add to kitchen queue
          const newOrder = { id: `o-${Date.now()}`, desc: `${t.id}: Salmon Grill`, time: '1m' };
          setKitchenQueue(q => [...q, newOrder]);
          return { ...t, status: 'Seated', stage: 'Appetizers' };
        } else if (t.stage === 'Appetizers') {
          return { ...t, stage: 'Entrees' };
        } else {
          return { ...t, status: 'Empty', stage: 'Ready' };
        }
      }
      return t;
    }));
  };

  const popKitchen = (id) => {
    setKitchenQueue(prev => prev.filter(o => o.id !== id));
  };

  return (
    <Card variant="surface" className="p-6 bg-[#FEF7EC] border-[#B45309]/14 shadow-sm overflow-hidden flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center pb-2 border-b border-[#B45309]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        </div>
        <span className="font-mono text-[9px] text-[#92400E]">mesa.io/floor/interactive</span>
      </div>

      <div className="bg-white border border-[#B45309]/10 rounded-lg p-4 flex flex-col gap-3 min-h-[220px] relative">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[9px] font-bold text-[#92400E] uppercase">DINING ROOM STATUS</span>
          <span className="text-[8px] text-black/30">Click tables to cycle states</span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-1">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => toggleTable(table.id)}
              className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all border outline-none active:scale-98 ${
                table.status === 'Empty' 
                  ? 'border-black/5 bg-[#FAFAF8] opacity-50 hover:opacity-75' 
                  : table.stage === 'Appetizers'
                    ? 'border-[#B45309]/20 bg-[#FEF7EC] text-[#B45309] shadow-xs'
                    : 'border-[#1E8A4A]/20 bg-[#E8F5EE] text-[#1E8A4A] shadow-xs'
              }`}
            >
              <span className="text-xs font-bold block">{table.id}</span>
              <span className="text-[9px] opacity-75">{table.status === 'Empty' ? 'Empty' : table.stage}</span>
            </button>
          ))}
        </div>

        {/* Warning Indicator */}
        <div className="bg-[#FEF2F2] border border-[#EF4444]/10 rounded-lg p-2.5 flex items-center justify-between text-left mt-1 text-[9px] text-[#EF4444]">
          <span className="font-semibold flex items-center gap-1">
            <Clock size={11} /> Terminal warning: Table 01 duration (appetizer) exceeded
          </span>
          <span className="font-mono font-bold">11m</span>
        </div>
      </div>

      {/* Kitchen Stream Interface */}
      <div className="bg-white rounded-lg p-3.5 border border-[#B45309]/10 flex flex-col gap-2 text-left">
        <span className="text-[9px] font-mono text-[#92400E] font-bold uppercase tracking-wider block">Kitchen Display Queue ({kitchenQueue.length})</span>
        <div className="flex flex-col gap-1.5">
          {kitchenQueue.length === 0 ? (
            <div className="text-[10px] text-black/35 py-1 text-center font-mono">KITCHEN QUEUE CLEAR</div>
          ) : (
            kitchenQueue.map(order => (
              <div key={order.id} className="flex justify-between items-center text-[10px] border-b border-black/[0.03] pb-1.5 last:border-0 last:pb-0">
                <span className="font-sans font-medium text-black/70">{order.desc}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#92400E] font-semibold">{order.time}</span>
                  <button 
                    onClick={() => popKitchen(order.id)}
                    className="text-[9px] font-mono text-[#1E8A4A] hover:underline"
                  >
                    Done
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// 3. INTERACTIVE VENTUREFLOW COMPONENT
// ==========================================
function InteractiveVentureFlow() {
  const [fundingGoal, setFundingGoal] = useState(1000); // in $K
  const [burnRate, setBurnRate] = useState(25); // in $K/month
  const [dilutionGoal, setDilutionGoal] = useState(15); // in %

  // Calculated metrics
  const runway = fundingGoal / burnRate;
  const impliedValuation = fundingGoal / (dilutionGoal / 100);

  return (
    <Card variant="surface" className="p-6 bg-white border-[#1B3A6B]/15 shadow-sm overflow-hidden flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center pb-2 border-b border-[#1B3A6B]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        </div>
        <span className="font-mono text-[9px] text-[#1B3A6B]">ventureflow.io/founder/dashboard</span>
      </div>

      <div className="bg-[#FAFAF8] border border-black/5 rounded-lg p-4 flex flex-col gap-4 min-h-[220px]">
        {/* Analytics Runway / Dilution summary */}
        <div className="grid grid-cols-2 gap-4 border-b border-black/[0.04] pb-3">
          <div>
            <span className="text-[8px] font-mono text-black/45 block">PROJECTED RUNWAY</span>
            <span className="text-sm font-serif font-bold text-[#1B3A6B]">{runway.toFixed(1)} Months</span>
          </div>
          <div>
            <span className="text-[8px] font-mono text-black/45 block">IMPLIED SEED VALUATION</span>
            <span className="text-sm font-mono font-bold text-black/75">${impliedValuation.toFixed(0)}K</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] font-semibold">
              <span className="text-black/50 font-mono">ROUND SIZE TARGET ($K)</span>
              <span className="font-mono text-[#1B3A6B]">${fundingGoal}K</span>
            </div>
            <input 
              type="range" 
              min="200" 
              max="2500" 
              step="50"
              value={fundingGoal} 
              onChange={(e) => setFundingGoal(parseInt(e.target.value))}
              className="w-full h-1 bg-black/[0.06] rounded-full appearance-none cursor-pointer accent-[#1B3A6B]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] font-semibold">
              <span className="text-black/50 font-mono">EST. MONTHLY BURN RATE ($K)</span>
              <span className="font-mono text-[#1B3A6B]">${burnRate}K/mo</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="5"
              value={burnRate} 
              onChange={(e) => setBurnRate(parseInt(e.target.value))}
              className="w-full h-1 bg-black/[0.06] rounded-full appearance-none cursor-pointer accent-[#1B3A6B]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] font-semibold">
              <span className="text-black/50 font-mono">ROUND DILUTION (%)</span>
              <span className="font-mono text-[#1B3A6B]">{dilutionGoal}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="30" 
              step="1"
              value={dilutionGoal} 
              onChange={(e) => setDilutionGoal(parseInt(e.target.value))}
              className="w-full h-1 bg-black/[0.06] rounded-full appearance-none cursor-pointer accent-[#1B3A6B]"
            />
          </div>
        </div>
      </div>

      {/* Kanban Pipeline Mini-Tracker */}
      <div className="bg-[#EEF3FB]/40 rounded-lg p-3 border border-[#1B3A6B]/10 flex flex-col gap-2 text-left">
        <span className="text-[9px] font-mono text-[#1B3A6B] font-bold uppercase tracking-wider block">Investor Pipeline Progress</span>
        <div className="grid grid-cols-3 gap-2">
          <div className="border border-black/5 bg-white p-1.5 rounded text-center">
            <div className="text-[8px] font-bold text-black/40">INTRO</div>
            <div className="text-[10px] font-mono font-bold mt-0.5">8 Leads</div>
          </div>
          <div className="border border-black/5 bg-white p-1.5 rounded text-center">
            <div className="text-[8px] font-bold text-[#1B3A6B]/50">MEETINGS</div>
            <div className="text-[10px] font-mono font-bold text-[#1B3A6B] mt-0.5">3 Active</div>
          </div>
          <div className="border border-black/5 bg-[#E8F5EE] border-[#1E8A4A]/10 p-1.5 rounded text-center">
            <div className="text-[8px] font-bold text-[#1E8A4A]">TERM SHEET</div>
            <div className="text-[10px] font-mono font-bold text-[#1E8A4A] mt-0.5">1 Secure</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// 4. MAIN PAGE EXPORT
// ==========================================
export default function Products() {
  return (
    <PageShell>
      {/* Page Header with radial grids */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#1B3A6B]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#B45309]/3 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <Container className="relative z-10 text-center">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Product Labs</span>
            <h1 className="font-serif text-3xl md:text-5xl font-light text-[#0F0F0F] mt-2 mb-4 tracking-tight">
              Software divisions built on engineering precision.
            </h1>
            <p className="text-sm md:text-base text-[#525252] leading-relaxed max-w-lg mx-auto">
              We design and maintain focused digital products. Explore active prototypes, dev previews, and software concepts emerging from our studio.
            </p>
          </div>

          <div className="flex flex-col gap-24 mt-12 max-w-5xl mx-auto">
            
            {/* PRODUCT 1: GRAPHZY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center text-left" id="graphzy">
              <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] font-bold text-[#0066CC] uppercase tracking-widest bg-[#EBF3FF] border border-[#0066CC]/10 px-2.5 py-0.5 rounded-full">
                    Prototype Preview
                  </span>
                  <span className="font-mono text-[9px] text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full font-bold uppercase">
                    Not Functional Yet
                  </span>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                  Graphzy
                </h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Visualization Platform</span>

                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  An interactive learning web application that transforms plain-language questions into visual, parameter-rich math models. Built on a CDN-delivered Desmos engine, it converts equations into coordinate grids that users can analyze and manipulate dynamically.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Desmos Graph Canvas</li>
                      <li>Parameter Auto-Mapping</li>
                      <li>Dynamic Sliders</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Use Cases</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>High School Algebra</li>
                      <li>Calculus Visuals</li>
                      <li>STEM Resource Guides</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>3D Molecule Canvas</li>
                      <li>Vector Fields Visuals</li>
                      <li>Biology SVG Maps</li>
                    </ul>
                  </div>
                </div>

                <Link to="/graphzy">
                  <Button variant="graphzy" size="md">Launch Visualizer Demo</Button>
                </Link>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2">
                <InteractiveGraphzy />
              </div>
            </div>

            {/* PRODUCT 2: MESA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center text-left border-t border-black/[0.04] pt-20" id="mesa">
              <div className="lg:col-span-5">
                <InteractiveMesa />
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] font-bold text-[#92400E] uppercase tracking-widest bg-[#FEF7EC] border border-[#B45309]/14 px-2.5 py-0.5 rounded-full">
                    Concept Preview
                  </span>
                  <span className="font-mono text-[9px] text-[#92400E] bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-bold uppercase">
                    Product In Development
                  </span>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                  Mesa
                </h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Restaurant Operations Platform</span>

                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  An upcoming restaurant management and hospitality operations engine. Designed to eliminate expensive hardware lock-ins, Mesa runs natively on generic touch displays and monitors, synchronizing seating layouts, orders, and food prep speeds.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Interactive Floor Maps</li>
                      <li>Mesh Kitchen Queue</li>
                      <li>Inventory Webhooks</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Use Cases</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Quick Service Dining</li>
                      <li>Floor Seating Tune-up</li>
                      <li>Shift Log Overviews</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>POS Terminal Syncs</li>
                      <li>Multi-location Console</li>
                      <li>Labor Planning Metrics</li>
                    </ul>
                  </div>
                </div>

                <Link to="/mesa">
                  <Button variant="serva" size="md">Register for Waitlist</Button>
                </Link>
              </div>
            </div>

            {/* PRODUCT 3: VENTUREFLOW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center text-left border-t border-black/[0.04] pt-20" id="ventureflow">
              <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] font-bold text-[#1B3A6B] uppercase tracking-widest bg-[#EEF3FB] border border-[#1B3A6B]/15 px-2.5 py-0.5 rounded-full">
                    Early Concept
                  </span>
                  <span className="font-mono text-[9px] text-[#1B3A6B] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-bold uppercase">
                    Coming Soon
                  </span>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mb-3 font-semibold">
                  VentureFlow
                </h2>
                <span className="font-mono text-[11px] text-[#A3A3A3] mb-4 block font-semibold uppercase tracking-wider">Startup Operations Platform</span>

                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-6">
                  The operations workspace for startup execution. Built to eliminate the complexity of fragmented spreadsheets, VentureFlow consolidates runway metrics, investor CRM tracking, cap table safe modeling, and pitch deck sharing logs.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-t border-b border-black/[0.04] py-4">
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Capabilities</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Founder Milestone Logs</li>
                      <li>Interactive Runway metrics</li>
                      <li>Deck Share Analytics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Use Cases</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Milestone Task Syncs</li>
                      <li>Fundraising CRM Stage</li>
                      <li>Equity SAFE modeling</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-widest mb-1.5">Roadmap</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                      <li>Data dilutive charts</li>
                      <li>Advisor Options Pools</li>
                      <li>Legal Document Vault</li>
                    </ul>
                  </div>
                </div>

                <Link to="/ventureflow">
                  <Button variant="brand" size="md">Explore VentureFlow Concept</Button>
                </Link>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2">
                <InteractiveVentureFlow />
              </div>
            </div>

          </div>
        </Container>
      </div>
    </PageShell>
  );
}

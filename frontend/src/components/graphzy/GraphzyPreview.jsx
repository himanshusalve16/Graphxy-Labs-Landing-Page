import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/Card';
import { Play, Pause, RotateCcw, Activity, HelpCircle, Code, Eye, FileText, Database } from 'lucide-react';

export default function GraphzyPreview({ topic, equation, sliders, onSliderChange }) {
  const containerRef = useRef(null);
  const calcRef = useRef(null);
  
  // Segmented Tabs: 'visual' | 'inspector' | 'logs'
  const [activeTab, setActiveTab] = useState('visual');
  const [sliderVals, setSliderVals] = useState({});

  // Physics animation state variables
  const [isPhysicsPlaying, setIsPhysicsPlaying] = useState(false);
  const [physicsTime, setPhysicsTime] = useState(0);
  const animationRef = useRef(null);
  const physicsStartTimeRef = useRef(null);
  
  const subject = topic?.subject || 'math';
  const topicKey = topic?.topicKey || 'custom_quadratic';

  // Initialize and synchronise Desmos parameter updates
  useEffect(() => {
    // Keep local state sliders in sync with prop updates
    const initialVals = {};
    sliders.forEach(sl => {
      initialVals[sl.id] = sl.val;
    });
    setSliderVals(initialVals);

    if (subject !== 'math') {
      return;
    }

    if (!containerRef.current) return;

    if (typeof window.Desmos === 'undefined') {
      console.warn("Desmos API CDN is not loaded. Canvas preview degraded.");
      return;
    }

    if (!calcRef.current) {
      calcRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
        keypad: false,
        expressions: false,
        settingsMenu: false,
        lockViewport: false
      });
    }

    calcRef.current.setBlank();
    calcRef.current.setExpression({ id: 'graph1', latex: equation, color: window.Desmos.Colors.BLUE });

    sliders.forEach(sl => {
      calcRef.current.setExpression({ id: `var_${sl.id}`, latex: `${sl.id} = ${sl.val}` });
    });
  }, [equation, sliders, subject]);

  const handleSliderUpdate = (id, val) => {
    const numericVal = parseFloat(val);
    
    setSliderVals(prev => ({
      ...prev,
      [id]: numericVal
    }));

    // Update Desmos if in math mode
    if (subject === 'math' && calcRef.current) {
      calcRef.current.setExpression({ id: `var_${id}`, latex: `${id} = ${numericVal}` });
    }

    // Reset physics animation if sliders update during motion
    if (subject === 'physics') {
      setIsPhysicsPlaying(false);
      setPhysicsTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    if (onSliderChange) {
      onSliderChange(id, numericVal);
    }
  };

  // Physics Trajectory Parameters (Calculated live from sliders)
  const getPhysicsParams = () => {
    const angle = sliderVals['angle'] !== undefined ? sliderVals['angle'] : 45;
    const velocity = sliderVals['velocity'] !== undefined ? sliderVals['velocity'] : 20;
    const g = 9.8;
    const rad = (angle * Math.PI) / 180;
    
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    
    const tFlight = (2 * vy) / g;
    const maxHeight = (vy * vy) / (2 * g);
    const range = vx * tFlight;

    return { angle, velocity, g, rad, vx, vy, tFlight, maxHeight, range };
  };

  const pParams = getPhysicsParams();

  // Physics animation loop
  const animatePhysics = (timestamp) => {
    if (!physicsStartTimeRef.current) {
      physicsStartTimeRef.current = timestamp - (physicsTime * 1000);
    }
    
    const elapsed = (timestamp - physicsStartTimeRef.current) / 1000; // in seconds
    
    if (elapsed >= pParams.tFlight) {
      setPhysicsTime(pParams.tFlight);
      setIsPhysicsPlaying(false);
    } else {
      setPhysicsTime(elapsed);
      animationRef.current = requestAnimationFrame(animatePhysics);
    }
  };

  useEffect(() => {
    if (isPhysicsPlaying) {
      physicsStartTimeRef.current = null;
      animationRef.current = requestAnimationFrame(animatePhysics);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPhysicsPlaying]);

  const handlePhysicsPlayPause = () => {
    if (physicsTime >= pParams.tFlight) {
      setPhysicsTime(0);
    }
    setIsPhysicsPlaying(prev => !prev);
  };

  const handlePhysicsReset = () => {
    setIsPhysicsPlaying(false);
    setPhysicsTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Chemistry coordinates (Water molecule H2O calculated live)
  const getChemistryParams = () => {
    const angle = sliderVals['bondAngle'] !== undefined ? sliderVals['bondAngle'] : 104.5;
    const length = sliderVals['bondLength'] !== undefined ? sliderVals['bondLength'] : 96.0;
    
    const ox = 190;
    const oy = 110;
    const rad = (angle * Math.PI) / 360; // half angle
    
    // Scale length for rendering
    const visualScale = 0.9;
    const renderLength = length * visualScale;
    
    const h1x = ox - renderLength * Math.sin(rad);
    const h1y = oy + renderLength * Math.cos(rad);
    const h2x = ox + renderLength * Math.sin(rad);
    const h2y = oy + renderLength * Math.cos(rad);
    
    // Calculate dipole moment (proportional to cos(angle/2) and bond length)
    // Dipole moment H2O max is ~1.85 D at experimental parameters.
    const referenceDipole = 1.85; 
    const experimentalAngle = 104.5;
    const experimentalLength = 96.0;
    const expFactor = referenceDipole / (2 * Math.cos((experimentalAngle * Math.PI) / 360) * experimentalLength);
    const calculatedDipole = 2 * Math.cos(rad) * length * expFactor;

    return { angle, length, ox, oy, h1x, h1y, h2x, h2y, calculatedDipole };
  };

  const cParams = getChemistryParams();

  return (
    <Card variant="surface" className="p-0 border-black/5 shadow-md flex flex-col w-full bg-white overflow-hidden">
      
      {/* 1. Prototype Device Header Frame */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-[#F8F8F6] border-b border-black/[0.06] gap-3">
        <div className="flex items-center gap-4">
          {/* Simulated Window Dots */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9.5px] font-bold text-[#525252] tracking-wider uppercase">GRAPHZY MODEL PROTOTYPE</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-[8px] font-mono font-bold text-amber-800 tracking-wide uppercase border border-amber-200">
                ACTIVE DEV
              </span>
            </div>
            <span className="font-mono text-[8px] text-[#A3A3A3] mt-0.5">ENGINE: v4.1-neural-grapher • STATUS: SIMULATOR_READY</span>
          </div>
        </div>

        {/* 2. Mode Tabs Segmented Control */}
        <div className="flex bg-black/[0.04] p-0.5 rounded-lg border border-black/[0.02] self-start sm:self-auto">
          <button 
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md border-0 cursor-pointer duration-150 ${
              activeTab === 'visual' 
                ? 'bg-white text-[#0066CC] shadow-xs' 
                : 'bg-transparent text-[#525252] hover:text-black'
            }`}
          >
            <Eye size={11} /> Visual Model
          </button>
          <button 
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md border-0 cursor-pointer duration-150 ${
              activeTab === 'inspector' 
                ? 'bg-white text-[#0066CC] shadow-xs' 
                : 'bg-transparent text-[#525252] hover:text-black'
            }`}
          >
            <Activity size={11} /> Properties
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md border-0 cursor-pointer duration-150 ${
              activeTab === 'logs' 
                ? 'bg-white text-[#0066CC] shadow-xs' 
                : 'bg-transparent text-[#525252] hover:text-black'
            }`}
          >
            <Code size={11} /> AI Engine Logs
          </button>
        </div>
      </div>

      {/* 3. Tab Contents */}
      <div className="p-4 sm:p-6 bg-white min-h-[390px] flex flex-col justify-between">
        
        {/* Tab content: VISUAL MODEL */}
        {activeTab === 'visual' && (
          <div className="flex-1 flex flex-col">
            
            {/* Math Visualizer Canvas Container (Persistent inside DOM to prevent Desmos context loss) */}
            <div 
              ref={containerRef}
              id="desmos-calculator"
              className={`w-full h-[320px] bg-[#F8F8F6] border border-black/5 rounded-xl overflow-hidden relative ${
                subject === 'math' ? 'block' : 'hidden'
              }`}
            >
              {typeof window.Desmos === 'undefined' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#FAFAF8]">
                  <span className="font-mono text-xs text-[#92400E] mb-2 uppercase tracking-widest font-semibold">degraded mode</span>
                  <p className="text-xs text-[#525252] max-w-xs leading-relaxed">
                    Interactive Desmos graph is offline. Verify CDN connection.
                  </p>
                </div>
              )}
            </div>

            {/* Physics Trajectory SVG Canvas */}
            {subject === 'physics' && (
              <div className="w-full bg-[#FAFAF8] border border-black/5 rounded-xl overflow-hidden flex flex-col items-center p-4 relative">
                
                {/* SVG Graphics */}
                <svg className="w-full max-w-lg h-[240px] select-none" viewBox="0 0 400 250">
                  {/* Grid Lines */}
                  <g opacity="0.1">
                    <line x1="40" y1="40" x2="380" y2="40" stroke="#000" strokeWidth="0.5" />
                    <line x1="40" y1="90" x2="380" y2="90" stroke="#000" strokeWidth="0.5" />
                    <line x1="40" y1="140" x2="380" y2="140" stroke="#000" strokeWidth="0.5" />
                    <line x1="40" y1="190" x2="380" y2="190" stroke="#000" strokeWidth="0.5" />
                    
                    <line x1="90" y1="40" x2="90" y2="240" stroke="#000" strokeWidth="0.5" />
                    <line x1="145" y1="40" x2="145" y2="240" stroke="#000" strokeWidth="0.5" />
                    <line x1="200" y1="40" x2="200" y2="240" stroke="#000" strokeWidth="0.5" />
                    <line x1="255" y1="40" x2="255" y2="240" stroke="#000" strokeWidth="0.5" />
                    <line x1="310" y1="40" x2="310" y2="240" stroke="#000" strokeWidth="0.5" />
                    <line x1="365" y1="40" x2="365" y2="240" stroke="#000" strokeWidth="0.5" />
                  </g>

                  {/* Axes */}
                  <line x1="40" y1="240" x2="380" y2="240" stroke="#0F0F0F" strokeWidth="1.5" />
                  <line x1="40" y1="20" x2="40" y2="240" stroke="#0F0F0F" strokeWidth="1.5" />
                  
                  {/* Axes Labels */}
                  <text x="370" y="232" fontSize="8" fontWeight="600" className="font-mono text-black/40">X (m)</text>
                  <text x="48" y="30" fontSize="8" fontWeight="600" className="font-mono text-black/40">Y (m)</text>

                  {/* Launch Vector (Angle display helper) */}
                  <line 
                    x1="40" 
                    y1="240" 
                    x2={40 + 45 * Math.cos(pParams.rad)} 
                    y2={240 - 45 * Math.sin(pParams.rad)} 
                    stroke="#FF9500" 
                    strokeWidth="1.5" 
                    strokeDasharray="2,2" 
                  />
                  <circle 
                    cx={40 + 45 * Math.cos(pParams.rad)} 
                    cy={240 - 45 * Math.sin(pParams.rad)} 
                    r="2.5" 
                    fill="#FF9500" 
                  />

                  {/* Complete Trajectory Path (Dotted background path) */}
                  {(() => {
                    const pathPoints = [];
                    const scaleX = 330 / ((40 * 40) / 9.8); // fixed relative scale
                    const scaleY = 180 / 82;
                    for (let t = 0; t <= pParams.tFlight; t += pParams.tFlight / 40) {
                      const px = pParams.vx * t;
                      const py = pParams.vy * t - 0.5 * pParams.g * t * t;
                      pathPoints.push(`${40 + px * scaleX},${240 - py * scaleY}`);
                    }
                    return (
                      <path 
                        d={`M 40,240 L ${pathPoints.join(' ')}`} 
                        fill="none" 
                        stroke="rgba(0,0,0,0.1)" 
                        strokeWidth="1.5" 
                        strokeDasharray="4,4" 
                      />
                    );
                  })()}

                  {/* Active Trajectory Path (Solid line representing progress) */}
                  {(() => {
                    const activePoints = [];
                    const scaleX = 330 / ((40 * 40) / 9.8);
                    const scaleY = 180 / 82;
                    for (let t = 0; t <= physicsTime; t += pParams.tFlight / 40) {
                      const px = pParams.vx * t;
                      const py = pParams.vy * t - 0.5 * pParams.g * t * t;
                      activePoints.push(`${40 + px * scaleX},${240 - py * scaleY}`);
                    }
                    // Add current particle position exactly
                    const curX = pParams.vx * physicsTime;
                    const curY = pParams.vy * physicsTime - 0.5 * pParams.g * physicsTime * physicsTime;
                    activePoints.push(`${40 + curX * scaleX},${240 - curY * scaleY}`);
                    
                    return (
                      <path 
                        d={`M 40,240 L ${activePoints.join(' ')}`} 
                        fill="none" 
                        stroke="#0066CC" 
                        strokeWidth="2" 
                      />
                    );
                  })()}

                  {/* Projectile Particle */}
                  {(() => {
                    const scaleX = 330 / ((40 * 40) / 9.8);
                    const scaleY = 180 / 82;
                    const curX = 40 + (pParams.vx * physicsTime) * scaleX;
                    const curY = 240 - (pParams.vy * physicsTime - 0.5 * pParams.g * physicsTime * physicsTime) * scaleY;
                    return (
                      <g>
                        <circle cx={curX} cy={curY} r="5" fill="#0066CC" stroke="#FFFFFF" strokeWidth="1.5" className="shadow-sm" />
                        <circle cx={curX} cy={curY} r="9" fill="none" stroke="#0066CC" strokeWidth="1" opacity="0.3" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                      </g>
                    );
                  })()}

                  {/* Peak Height indicator label (Only shows when parameter is active or near peak) */}
                  {(() => {
                    const scaleX = 330 / ((40 * 40) / 9.8);
                    const scaleY = 180 / 82;
                    const peakX = 40 + (pParams.vx * (pParams.tFlight / 2)) * scaleX;
                    const peakY = 240 - pParams.maxHeight * scaleY;
                    return (
                      <g opacity="0.75">
                        <line x1={peakX} y1={peakY} x2={peakX} y2="240" stroke="#10B981" strokeWidth="1" strokeDasharray="2,2" />
                        <circle cx={peakX} cy={peakY} r="2" fill="#10B981" />
                        <text x={peakX + 4} y={peakY + 12} fontSize="7" fontWeight="600" className="font-mono fill-[#10B981]">H_max: {pParams.maxHeight.toFixed(1)}m</text>
                      </g>
                    );
                  })()}

                  {/* Max Range indicator label */}
                  {(() => {
                    const scaleX = 330 / ((40 * 40) / 9.8);
                    const rangeX = 40 + pParams.range * scaleX;
                    return (
                      <g opacity="0.75">
                        <line x1={rangeX} y1="235" x2={rangeX} y2="245" stroke="#FF3B30" strokeWidth="1.5" />
                        <text x={rangeX - 22} y="232" fontSize="7" fontWeight="600" className="font-mono fill-[#FF3B30]">R: {pParams.range.toFixed(1)}m</text>
                      </g>
                    );
                  })()}
                </svg>

                {/* Simulation Controls Dashboard overlay */}
                <div className="flex items-center gap-3 mt-2 px-3 py-1.5 rounded-xl bg-white border border-black/5 shadow-xs">
                  <button 
                    onClick={handlePhysicsPlayPause}
                    className="w-8 h-8 rounded-full bg-[#0066CC] hover:bg-[#0057AA] text-white flex items-center justify-center border-none cursor-pointer active:scale-95 duration-100"
                    aria-label={isPhysicsPlaying ? "Pause" : "Play"}
                  >
                    {isPhysicsPlaying ? <Pause size={13} fill="white" /> : <Play size={13} fill="white" className="ml-0.5" />}
                  </button>
                  <button 
                    onClick={handlePhysicsReset}
                    className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#525252] flex items-center justify-center border-none cursor-pointer active:scale-95 duration-100"
                    aria-label="Reset simulation"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <div className="h-4 w-[1px] bg-black/10" />
                  <div className="font-mono text-[10px] text-[#525252] font-semibold">
                    t: <span className="text-[#0066CC]">{physicsTime.toFixed(2)}s</span> / {pParams.tFlight.toFixed(2)}s
                  </div>
                </div>
              </div>
            )}

            {/* Chemistry SVG Canvas */}
            {subject === 'chemistry' && (
              <div className="w-full bg-[#FAFAF8] border border-black/5 rounded-xl overflow-hidden flex flex-col items-center p-4">
                
                {/* H2O Molecule Graph */}
                <svg className="w-full max-w-lg h-[240px] select-none" viewBox="0 0 380 250">
                  {/* Gradient definition for Oxygen and Hydrogen */}
                  <defs>
                    <radialGradient id="oxygenGrad" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#FF6B6B" />
                      <stop offset="85%" stopColor="#D63031" />
                      <stop offset="100%" stopColor="#A61C1C" />
                    </radialGradient>
                    <radialGradient id="hydrogenGrad" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="85%" stopColor="#E2E8F0" />
                      <stop offset="100%" stopColor="#CBD5E0" />
                    </radialGradient>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.08" />
                    </filter>
                  </defs>

                  {/* Net Dipole Vector Arrow (Visualized straight up relative to water structure) */}
                  {(() => {
                    const midH_x = (cParams.h1x + cParams.h2x) / 2;
                    const midH_y = (cParams.h1y + cParams.h2y) / 2;
                    const lengthFactor = cParams.calculatedDipole * 25; // Scale vector visually
                    const arrowY = cParams.oy - lengthFactor;
                    return (
                      <g filter="url(#shadow)">
                        {/* Dipole line starting from mid H-H towards O and beyond */}
                        <line 
                          x1={midH_x} 
                          y1={midH_y} 
                          x2={midH_x} 
                          y2={arrowY} 
                          stroke="#10B981" 
                          strokeWidth="2.5" 
                          markerEnd="url(#arrow)" 
                        />
                        <polygon 
                          points={`${midH_x},${arrowY - 6} ${midH_x - 4.5},${arrowY} ${midH_x + 4.5},${arrowY}`} 
                          fill="#10B981" 
                        />
                        <text x={midH_x + 8} y={arrowY + 8} fontSize="8" fontWeight="700" className="font-mono fill-[#10B981]">
                          Dipole (μ): {cParams.calculatedDipole.toFixed(2)} D
                        </text>
                      </g>
                    );
                  })()}

                  {/* Angle Arc Indicator */}
                  {(() => {
                    // Draw arc from bond 1 to bond 2
                    // Arc path calculation: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    const r = 25;
                    const startAngle = (Math.PI / 2) + ((cParams.angle * Math.PI) / 360);
                    const endAngle = (Math.PI / 2) - ((cParams.angle * Math.PI) / 360);
                    
                    const x1 = cParams.ox + r * Math.cos(startAngle);
                    const y1 = cParams.oy - r * Math.sin(startAngle);
                    const x2 = cParams.ox + r * Math.cos(endAngle);
                    const y2 = cParams.oy - r * Math.sin(endAngle);
                    
                    return (
                      <g>
                        <path 
                          d={`M ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2}`} 
                          fill="none" 
                          stroke="#FF9500" 
                          strokeWidth="1.5" 
                        />
                        <text x={cParams.ox} y={cParams.oy + 40} textAnchor="middle" fontSize="9" fontWeight="700" className="font-mono fill-[#FF9500]">
                          {cParams.angle.toFixed(1)}°
                        </text>
                      </g>
                    );
                  })()}

                  {/* Covalent Bonds (Lines Oxygen <-> Hydrogen) */}
                  <line x1={cParams.ox} y1={cParams.oy} x2={cParams.h1x} y2={cParams.h1y} stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
                  <line x1={cParams.ox} y1={cParams.oy} x2={cParams.h2x} y2={cParams.h2y} stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
                  <line x1={cParams.ox} y1={cParams.oy} x2={cParams.h1x} y2={cParams.h1y} stroke="#0F0F0F" strokeWidth="1.5" />
                  <line x1={cParams.ox} y1={cParams.oy} x2={cParams.h2x} y2={cParams.h2y} stroke="#0F0F0F" strokeWidth="1.5" />

                  {/* Oxygen Atom (Central large sphere) */}
                  <g filter="url(#shadow)" className="cursor-pointer">
                    <circle cx={cParams.ox} cy={cParams.oy} r="22" fill="url(#oxygenGrad)" />
                    <text x={cParams.ox} y={cParams.oy + 4} textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700" className="font-sans">O</text>
                    
                    {/* Simulated Lone Pairs (2 small blue dot pairs on top of Oxygen) */}
                    <circle cx={cParams.ox - 10} cy={cParams.oy - 25} r="2.5" fill="#3B82F6" opacity="0.8" />
                    <circle cx={cParams.ox - 4} cy={cParams.oy - 27} r="2.5" fill="#3B82F6" opacity="0.8" />
                    
                    <circle cx={cParams.ox + 10} cy={cParams.oy - 25} r="2.5" fill="#3B82F6" opacity="0.8" />
                    <circle cx={cParams.ox + 4} cy={cParams.oy - 27} r="2.5" fill="#3B82F6" opacity="0.8" />
                  </g>

                  {/* Hydrogen 1 (Left terminal sphere) */}
                  <g filter="url(#shadow)">
                    <circle cx={cParams.h1x} cy={cParams.h1y} r="14" fill="url(#hydrogenGrad)" stroke="#A0AEC0" strokeWidth="0.5" />
                    <text x={cParams.h1x} y={cParams.h1y + 3.5} textAnchor="middle" fill="#1A202C" fontSize="9" fontWeight="700" className="font-sans">H</text>
                  </g>

                  {/* Hydrogen 2 (Right terminal sphere) */}
                  <g filter="url(#shadow)">
                    <circle cx={cParams.h2x} cy={cParams.h2y} r="14" fill="url(#hydrogenGrad)" stroke="#A0AEC0" strokeWidth="0.5" />
                    <text x={cParams.h2x} y={cParams.h2y + 3.5} textAnchor="middle" fill="#1A202C" fontSize="9" fontWeight="700" className="font-sans">H</text>
                  </g>

                  {/* Bond length dimension line */}
                  {(() => {
                    // Draw perpendicular offset line for bond length
                    const dx = cParams.h2x - cParams.ox;
                    const dy = cParams.h2y - cParams.oy;
                    const len = Math.sqrt(dx*dx + dy*dy);
                    // perpendicular unit vector
                    const px = -dy / len;
                    const py = dx / len;
                    const offset = 18;
                    
                    const ox_off = cParams.ox + px * offset;
                    const oy_off = cParams.oy + py * offset;
                    const h2_off = cParams.h2x + px * offset;
                    const h2_off_y = cParams.h2y + py * offset;

                    return (
                      <g opacity="0.65">
                        <line x1={ox_off} y1={oy_off} x2={h2_off} y2={h2_off_y} stroke="#718096" strokeWidth="0.8" strokeDasharray="2,2" />
                        <line x1={cParams.ox} y1={cParams.oy} x2={ox_off} y2={oy_off} stroke="#718096" strokeWidth="0.5" />
                        <line x1={cParams.h2x} y1={cParams.h2y} x2={h2_off} y2={h2_off_y} stroke="#718096" strokeWidth="0.5" />
                        <text 
                          x={(ox_off + h2_off)/2 + px*6} 
                          y={(oy_off + h2_off_y)/2 + py*6} 
                          textAnchor="middle" 
                          fontSize="7" 
                          fontWeight="600" 
                          className="font-mono fill-[#718096]"
                          transform={`rotate(${(Math.atan2(dy, dx)*180)/Math.PI}, ${(ox_off + h2_off)/2}, ${(oy_off + h2_off_y)/2})`}
                        >
                          d: {cParams.length.toFixed(0)}pm
                        </text>
                      </g>
                    );
                  })()}
                </svg>

                <div className="font-mono text-[9px] text-black/40 mt-1 uppercase tracking-widest text-center">
                  Live 2D Molecular Configuration Map
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab content: PROPERTIES INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="flex-1 flex flex-col justify-between" data-reveal>
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-black/[0.04] pb-2">
                <Database size={14} className="text-[#0066CC]" />
                <h3 className="font-serif text-sm font-semibold text-[#0F0F0F] uppercase tracking-wider">Properties Inspector</h3>
              </div>

              {/* Inspector Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Subject-specific rendering table */}
                {subject === 'physics' && (
                  <>
                    <div className="flex flex-col gap-3.5 bg-[#FAFAF8] rounded-xl p-4 border border-black/5">
                      <h4 className="font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest">Active Inputs</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Launch Angle (θ)</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">{pParams.angle.toFixed(1)}°</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Initial Velocity (v)</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">{pParams.velocity.toFixed(1)} m/s</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Local Gravity (g)</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">{pParams.g} m/s²</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3.5 bg-[#FAFAF8] rounded-xl p-4 border border-black/5">
                      <h4 className="font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest">Calculated Kinematics</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Peak Altitude (H_max)</span>
                        <span className="font-mono font-semibold text-[#10B981]">{pParams.maxHeight.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Horizontal Range (R)</span>
                        <span className="font-mono font-semibold text-[#FF3B30]">{pParams.range.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Time of Flight (t_flight)</span>
                        <span className="font-mono font-semibold text-[#0066CC]">{pParams.tFlight.toFixed(2)} s</span>
                      </div>
                    </div>
                  </>
                )}

                {subject === 'chemistry' && (
                  <>
                    <div className="flex flex-col gap-3.5 bg-[#FAFAF8] rounded-xl p-4 border border-black/5">
                      <h4 className="font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest">Bond Metrics</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">H-O-H Bond Angle</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">{cParams.angle.toFixed(1)}°</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">O-H Bond Length</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">{cParams.length.toFixed(1)} pm</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Symmetry Group</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">C_2v</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3.5 bg-[#FAFAF8] rounded-xl p-4 border border-black/5">
                      <h4 className="font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest">Polarity Analysis</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Oxygen Hybridization</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">sp³</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Net Dipole Moment</span>
                        <span className="font-mono font-semibold text-[#10B981]">{cParams.calculatedDipole.toFixed(2)} Debyes</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Molecular Geometry</span>
                        <span className="font-mono font-semibold text-[#0066CC] uppercase">Bent (V-shaped)</span>
                      </div>
                    </div>
                  </>
                )}

                {subject === 'math' && (
                  <>
                    <div className="flex flex-col gap-3.5 bg-[#FAFAF8] rounded-xl p-4 border border-black/5">
                      <h4 className="font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest">Equation Parameters</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Active Formula</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">{equation}</span>
                      </div>
                      {sliders.map(sl => (
                        <div key={sl.id} className="flex justify-between items-center text-xs">
                          <span className="text-[#525252]">Parameter ({sl.id})</span>
                          <span className="font-mono font-semibold text-[#0066CC]">
                            {(sliderVals[sl.id] !== undefined ? sliderVals[sl.id] : sl.val).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3.5 bg-[#FAFAF8] rounded-xl p-4 border border-black/5">
                      <h4 className="font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest">Key Limits</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Domain Limits</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">x ∈ (-∞, +∞)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Function Type</span>
                        <span className="font-mono font-semibold text-[#0f0f0f]">Continuous Real</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#525252]">Calculus Operations</span>
                        <span className="font-mono font-semibold text-[#10B981]">Differentiable</span>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
            
            <div className="mt-6 p-3 rounded-lg bg-black/[0.02] border border-black/5 text-[10px] text-[#525252] leading-normal">
              <strong>Interactive Calculation Note:</strong> Parameter values are synchronized instantly with the mathematical models on slide changes. Custom calculations are resolved in local client runtime threads.
            </div>
          </div>
        )}

        {/* Tab content: AI ENGINE LOGS */}
        {activeTab === 'logs' && (
          <div className="flex-1 flex flex-col justify-between" data-reveal>
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-black/[0.04] pb-2">
                <FileText size={14} className="text-[#0066CC]" />
                <h3 className="font-serif text-sm font-semibold text-[#0F0F0F] uppercase tracking-wider">AI Inference Logs</h3>
              </div>

              {/* Mock System JSON Prompt response */}
              <div className="bg-[#1E1E1E] text-[#D4D4D4] rounded-xl p-4 font-mono text-[11px] overflow-x-auto shadow-inner leading-relaxed max-h-[260px] scrollbar-thin">
                <div><span className="text-[#6A9955]">// AI STEM System prompt parse logs</span></div>
                <div><span className="text-[#569CD6]">const</span> responseSchema = &#123;</div>
                <div className="pl-4">query: <span className="text-[#CE9178]">"{topicKey}"</span>,</div>
                <div className="pl-4">subject: <span className="text-[#CE9178]">"{subject}"</span>,</div>
                <div className="pl-4">engine: <span className="text-[#CE9178]">"STEM-v4.1-Inference"</span>,</div>
                <div className="pl-4">latency_ms: <span className="text-[#B5CEA8]">142</span>,</div>
                <div className="pl-4">token_utilization: &#123; prompt: <span className="text-[#B5CEA8]">1024</span>, completion: <span className="text-[#B5CEA8]">512</span> &#125;,</div>
                <div className="pl-4">visual_models: &#123;</div>
                <div className="pl-8">equation: <span className="text-[#CE9178]">"{equation}"</span>,</div>
                <div className="pl-8">concepts: [</div>
                {topic?.concepts?.map((c, i) => (
                  <div key={i} className="pl-12"><span className="text-[#CE9178]">"{c}"</span>{i < topic.concepts.length - 1 ? ',' : ''}</div>
                ))}
                <div className="pl-8">],</div>
                <div className="pl-8">parameters: [</div>
                {sliders.map((sl, i) => (
                  <div key={sl.id} className="pl-12">&#123; id: <span className="text-[#CE9178]">"{sl.id}"</span>, initial: <span className="text-[#B5CEA8]">{(sliderVals[sl.id] !== undefined ? sliderVals[sl.id] : sl.val).toFixed(2)}</span> &#125;{i < sliders.length - 1 ? ',' : ''}</div>
                ))}
                <div className="pl-8">]</div>
                <div className="pl-4">&#125;</div>
                <div>&#125;;</div>
              </div>
            </div>
            
            <div className="mt-4 text-[9px] font-mono text-black/40 uppercase tracking-widest text-right">
              Generated response schema mapped dynamically
            </div>
          </div>
        )}

      </div>

      {/* 4. Custom Sliders Control Area */}
      <div className="px-4 py-5 sm:px-6 bg-[#FAFAF8] border-t border-black/[0.06] flex flex-col gap-5">
        {sliders.map(sl => {
          const currentVal = sliderVals[sl.id] !== undefined ? sliderVals[sl.id] : sl.val;
          const percentage = ((currentVal - sl.min) / (sl.max - sl.min)) * 100;
          
          return (
            <div key={sl.id} className="flex flex-col">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold text-[#0F0F0F] font-mono uppercase tracking-wide">{sl.label}</span>
                <span className="font-mono text-xs font-bold text-[#0066CC] bg-[#EBF3FF] px-2 py-0.5 rounded border border-[#0066CC]/10">
                  {currentVal.toFixed(1)}
                </span>
              </div>
              
              <div className="relative w-full h-5 flex items-center group cursor-pointer">
                {/* Visual track background */}
                <div className="absolute left-0 right-0 h-1.5 bg-black/[0.06] rounded-full" />
                {/* Visual active fill */}
                <div 
                  className="absolute left-0 h-1.5 bg-[#0066CC] rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
                {/* Slider Input */}
                <input 
                  type="range"
                  min={sl.min}
                  max={sl.max}
                  step={sl.step}
                  value={currentVal}
                  onChange={(e) => handleSliderUpdate(sl.id, e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {/* Custom Thumb */}
                <div 
                  className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#0066CC] shadow-sm transform -translate-x-1/2 left-0 group-hover:scale-110 active:scale-95 duration-100"
                  style={{ left: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/Card';
import { Play, Pause, RotateCcw, Activity, Code, Eye, FileText, Database, Layers } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

export default function GraphzyPreview({ topic, equation, sliders, onSliderChange }) {
  const svgRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  // Segmented Tabs: 'visual' | 'inspector' | 'logs'
  const [activeTab, setActiveTab] = useState('visual');
  const [sliderVals, setSliderVals] = useState({});

  // Simulation animation state variables
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const animationRef = useRef(null);
  const simStartTimeRef = useRef(null);
  
  const subjectId = topic?.subjectId || topic?.subject || 'math';
  const getSubjectLabel = (subId) => {
    switch (subId) {
      case 'math': return 'Mathematics';
      case 'physics': return 'Physics';
      case 'chemistry': return 'Chemistry';
      case 'biology': return 'Biology';
      default: return 'Mathematics';
    }
  };
  const subject = getSubjectLabel(subjectId);
  const topicKey = topic?.topicKey || 'algebra';

  // Synchronise parameter updates
  useEffect(() => {
    const initialVals = {};
    sliders.forEach(sl => {
      initialVals[sl.id] = sl.val;
    });
    setSliderVals(initialVals);
  }, [equation, sliders, subject]);

  const handleSliderUpdate = (id, val) => {
    const numericVal = parseFloat(val);
    
    setSliderVals(prev => ({
      ...prev,
      [id]: numericVal
    }));

    // Reset simulation animation if parameters update
    setIsSimPlaying(false);
    setSimTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (onSliderChange) {
      onSliderChange(id, numericVal);
    }
  };

  // Math graph evaluation and coordinate mapping helpers
  const svgWidth = 500;
  const svgHeight = 320;

  const mapX = (xVal) => ((xVal - (-6)) / 12) * svgWidth;
  const mapY = (yVal) => svgHeight - ((yVal - (-6)) / 12) * svgHeight;

  const evaluateMath = (x, key, vals) => {
    switch (key) {
      case 'trigonometry': {
        const a = vals['a'] !== undefined ? vals['a'] : 1.5;
        const b = vals['b'] !== undefined ? vals['b'] : 2.0;
        const c = vals['c'] !== undefined ? vals['c'] : 0.0;
        return a * Math.sin(b * x) + c;
      }
      case 'functions and graphs': {
        const a = vals['a'] !== undefined ? vals['a'] : 3.0;
        return x * x * x - a * x;
      }
      case 'transformations': {
        const h = vals['h'] !== undefined ? vals['h'] : 1.0;
        const k = vals['k'] !== undefined ? vals['k'] : -2.0;
        return (x - h) ** 2 + k;
      }
      case 'statistics': {
        const mean = vals['mean'] !== undefined ? vals['mean'] : 0.0;
        const std = vals['std'] !== undefined ? vals['std'] : 1.0;
        // scaled by 4 for visibility
        return (4 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mean) ** 2) / (2 * std * std)) - 3;
      }
      case 'thermodynamics': {
        const temp = vals['temp'] !== undefined ? vals['temp'] : 300;
        // PV isotherm: P = nRT/V. let x represent V, scale down nR
        if (x <= 0.1) return 6;
        return (0.05 * 8.314 * temp) / (x + 6) - 3; // shifted for viewport fit
      }
      case 'power': {
        const force = vals['force'] !== undefined ? vals['force'] : 50;
        // P = F * v. Let x represent velocity
        return (force * x) / 30 - 3;
      }
      case 'calculus_tangent': {
        return 0.5 * x * x - 2;
      }
      case 'calculus_limits': {
        return x + 1;
      }
      case 'calculus_secant': {
        return 0.3 * x * x - 2;
      }
      case 'calculus_integral': {
        return 0.2 * x * x - 1.5;
      }
      case 'chem_bonding': {
        // Lennard-Jones Potential approximation
        if (x <= 0.8) return 6;
        return 4 * (Math.pow(1 / x, 12) - Math.pow(1 / x, 6)) - 1.5;

      }
      case 'chem_equilibrium': {
        const kc = vals['kc'] !== undefined ? vals['kc'] : 2.0;
        const addA = vals['addA'] !== undefined ? vals['addA'] : 1.0;
        // concentration curve approaching equilibrium
        return 3 - (kc * 0.2) + Math.exp(-x - addA);
      }
      case 'chem_thermo': {
        const deltaH = vals['deltaH'] !== undefined ? vals['deltaH'] : -40;
        const ea = vals['ea'] !== undefined ? vals['ea'] : 60;
        const barrier = ea / 20;
        const netH = deltaH / 30;
        return 1 + barrier * Math.exp(-x*x/2) + netH * (1 / (1 + Math.exp(-2*x)));
      }
      case 'algebra':
      default: {
        const a = vals['a'] !== undefined ? vals['a'] : 1.0;
        const b = vals['b'] !== undefined ? vals['b'] : 0.0;
        const c = vals['c'] !== undefined ? vals['c'] : -1.0;
        return a * x * x + b * x + c;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const xMath = (mouseX / rect.width) * 12 - 6;
    const yMath = evaluateMath(xMath, topicKey, sliderVals);
    
    if (isNaN(yMath) || !isFinite(yMath)) {
      setHoveredPoint(null);
      return;
    }

    const xSvg = mapX(xMath);
    const ySvg = mapY(yMath);

    if (yMath >= -6 && yMath <= 6) {
      setHoveredPoint({ x: xMath, y: yMath, svgX: xSvg, svgY: ySvg });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Continuous animation loop
  const animateSim = (timestamp) => {
    if (!simStartTimeRef.current) {
      simStartTimeRef.current = timestamp - (simTime * 1000);
    }
    const elapsed = (timestamp - simStartTimeRef.current) / 1000;
    
    setSimTime(elapsed);
    animationRef.current = requestAnimationFrame(animateSim);
  };

  useEffect(() => {
    if (isSimPlaying) {
      simStartTimeRef.current = null;
      animationRef.current = requestAnimationFrame(animateSim);
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
  }, [isSimPlaying]);

  const handleSimPlayPause = () => {
    setIsSimPlaying(prev => !prev);
  };

  const handleSimReset = () => {
    setIsSimPlaying(false);
    setSimTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // ----------------------------------------------------
  // SVG ELEMENT GENERATORS (Visual Styles)
  // ----------------------------------------------------

  const gridLines = [];
  const xTicks = [];
  const yTicks = [];

  for (let gx = -5; gx <= 5; gx++) {
    if (gx !== 0) {
      gridLines.push(
        <line key={`v-${gx}`} x1={mapX(gx)} y1={0} x2={mapX(gx)} y2={svgHeight} stroke="rgba(0,0,0,0.05)" strokeWidth="0.8" />
      );
    }
  }
  for (let gy = -5; gy <= 5; gy++) {
    if (gy !== 0) {
      gridLines.push(
        <line key={`h-${gy}`} x1={0} y1={mapY(gy)} x2={svgWidth} y2={mapY(gy)} stroke="rgba(0,0,0,0.05)" strokeWidth="0.8" />
      );
    }
  }

  const xAxis = <line x1={0} y1={mapY(0)} x2={svgWidth} y2={mapY(0)} stroke="#0F0F0F" strokeWidth="1.2" />;
  const yAxis = <line x1={mapX(0)} y1={0} x2={mapX(0)} y2={svgHeight} stroke="#0F0F0F" strokeWidth="1.2" />;

  for (let gx = -5; gx <= 5; gx++) {
    if (gx !== 0) {
      xTicks.push(
        <g key={`xtick-${gx}`}>
          <line x1={mapX(gx)} y1={mapY(0) - 3} x2={mapX(gx)} y2={mapY(0) + 3} stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
          <text x={mapX(gx)} y={mapY(0) + 12} fontSize="8" textAnchor="middle" className="font-mono fill-black/45 select-none">{gx}</text>
        </g>
      );
    }
  }
  for (let gy = -5; gy <= 5; gy++) {
    if (gy !== 0) {
      yTicks.push(
        <g key={`ytick-${gy}`}>
          <line x1={mapX(0) - 3} y1={mapY(gy)} x2={mapX(0) + 3} y2={mapY(gy)} stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
          <text x={mapX(0) - 8} y={mapY(gy) + 3} fontSize="8" textAnchor="end" className="font-mono fill-black/45 select-none">{gy}</text>
        </g>
      );
    }
  }

  const pathPoints = [];
  const numPoints = 240;
  for (let i = 0; i <= numPoints; i++) {
    const xVal = -6 + (12 * i) / numPoints;
    const yVal = evaluateMath(xVal, topicKey, sliderVals);
    if (isNaN(yVal) || !isFinite(yVal)) continue;
    pathPoints.push(`${mapX(xVal).toFixed(1)},${mapY(yVal).toFixed(1)}`);
  }
  const mathPathData = pathPoints.length > 0 ? `M ${pathPoints.join(' L ')}` : '';

  const riemannRects = [];
  if (topic.visualStyle === 'calculus_integral') {
    const rects = sliderVals['rects'] !== undefined ? sliderVals['rects'] : 10;
    const startX = -3;
    const endX = 3;
    const rectWidth = (endX - startX) / rects;
    for (let ri = 0; ri < rects; ri++) {
      const rx = startX + ri * rectWidth;
      const ry = evaluateMath(rx, topicKey, sliderVals);
      const svgRx = mapX(rx);
      const svgRy = mapY(ry);
      const svgRWidth = mapX(rx + rectWidth) - svgRx;
      const svgRHeight = mapY(0) - svgRy;
      riemannRects.push(
        <rect 
          key={`riemann-${ri}`} 
          x={svgRx} 
          y={svgRy} 
          width={svgRWidth} 
          height={svgRHeight} 
          fill="rgba(0,102,204,0.12)" 
          stroke="rgba(0,102,204,0.3)" 
          strokeWidth="0.8" 
        />
      );
    }
  }

  const renderFunctionPlot = () => {
    return (
      <div className="w-full flex flex-col items-center">
        <svg 
          ref={svgRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-[280px] bg-white border border-black/5 rounded-xl cursor-crosshair" 
          viewBox="0 0 500 320"
        >
          {gridLines}
          {xAxis}
          {yAxis}
          {xTicks}
          {yTicks}
          
          {/* Shaded Riemann rectangles if calculus integral */}
          {topic.visualStyle === 'calculus_integral' && riemannRects}
          
          {/* Main function curve */}
          {mathPathData && (
            <path 
              d={mathPathData} 
              fill="none" 
              stroke="#0066CC" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
          )}
          
          {/* Removable discontinuity hole if calculus limits */}
          {topic.visualStyle === 'calculus_limits' && (
            <>
              {/* Limit approximation arrows */}
              <line x1={mapX(1 - 0.8)} y1={mapY(2 - 0.8)} x2={mapX(1 - 0.15)} y2={mapY(2 - 0.15)} stroke="#FF9500" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <line x1={mapX(1 + 0.8)} y1={mapY(2 + 0.8)} x2={mapX(1 + 0.15)} y2={mapY(2 + 0.15)} stroke="#FF9500" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Undefined hole */}
              <circle cx={mapX(1)} cy={mapY(2)} r="4" fill="white" stroke="#0066CC" strokeWidth="2" />
            </>
          )}

          {/* Tangent line if calculus tangent */}
          {topic.visualStyle === 'calculus_tangent' && (() => {
            const x0 = sliderVals['x0'] !== undefined ? sliderVals['x0'] : 1.0;
            // f(x) = 0.5x^2, f'(x) = x, tangent at x0: y - y0 = m(x - x0) => y = x0 * x - 0.5 * x0^2
            const tangentPoints = [];
            for (let tx = -6; tx <= 6; tx += 0.5) {
              const ty = x0 * tx - 0.5 * x0 * x0;
              if (ty >= -6 && ty <= 6) {
                tangentPoints.push(`${mapX(tx)},${mapY(ty)}`);
              }
            }
            return (
              <>
                {tangentPoints.length > 1 && (
                  <path d={`M ${tangentPoints.join(' L ')}`} fill="none" stroke="#FF9500" strokeWidth="1.5" strokeDasharray="4,3" />
                )}
                <circle cx={mapX(x0)} cy={mapY(0.5 * x0 * x0)} r="4" fill="#FF9500" stroke="white" strokeWidth="1" />
              </>
            );
          })()}

          {/* Secant approaching tangent if calculus secant */}
          {topic.visualStyle === 'calculus_secant' && (() => {
            const dx = sliderVals['dx'] !== undefined ? sliderVals['dx'] : 1.5;
            const x0 = 1.0;
            const x1 = x0 + dx;
            const y0 = 0.3 * x0 * x0;
            const y1 = 0.3 * x1 * x1;
            // secant line through (x0, y0) and (x1, y1)
            const slope = (y1 - y0) / dx;
            const secantPoints = [];
            for (let tx = -6; tx <= 6; tx += 0.5) {
              const ty = slope * (tx - x0) + y0;
              if (ty >= -6 && ty <= 6) {
                secantPoints.push(`${mapX(tx)},${mapY(ty)}`);
              }
            }
            return (
              <>
                {secantPoints.length > 1 && (
                  <path d={`M ${secantPoints.join(' L ')}`} fill="none" stroke="#E0443E" strokeWidth="1.5" />
                )}
                <circle cx={mapX(x0)} cy={mapY(y0)} r="4" fill="#0066CC" stroke="white" strokeWidth="1" />
                <circle cx={mapX(x1)} cy={mapY(y1)} r="4" fill="#E0443E" stroke="white" strokeWidth="1" />
              </>
            );
          })()}
          
          {/* Hover coordinate tooltip */}
          {hoveredPoint && (
            <g>
              <circle cx={hoveredPoint.svgX} cy={hoveredPoint.svgY} r="4" fill="#0066CC" stroke="white" strokeWidth="1.5" />
              <rect 
                x={hoveredPoint.svgX + 10} 
                y={hoveredPoint.svgY - 25} 
                width="65" 
                height="18" 
                rx="4" 
                fill="rgba(0,0,0,0.75)" 
              />
              <text 
                x={hoveredPoint.svgX + 15} 
                y={hoveredPoint.svgY - 13} 
                fontSize="7" 
                className="font-mono fill-white"
              >
                x:{hoveredPoint.x.toFixed(1)} y:{hoveredPoint.y.toFixed(1)}
              </text>
            </g>
          )}
        </svg>
      </div>
    );
  };

  // ----------------------------------------------------
  // RENDER SECTIONS SWITCH
  // ----------------------------------------------------
  const renderVisualCanvas = () => {
    switch (topic.visualStyle) {
      case 'geometry_polygon': {
        const sides = sliderVals['sides'] !== undefined ? sliderVals['sides'] : 5;
        const polyPoints = [];
        const cx = 250, cy = 150, r = 85;
        for (let pi = 0; pi < sides; pi++) {
          const angle = (pi * 2 * Math.PI) / sides - Math.PI / 2;
          polyPoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        const polyPath = `M ${polyPoints.join(' L ')} Z`;
        const interiorAngle = ((sides - 2) * 180) / sides;
        const sumAngles = (sides - 2) * 180;
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeDasharray="3,3" />
              <path d={polyPath} fill="rgba(0,102,204,0.05)" stroke="#0066CC" strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx={cx} cy={cy} r="3" fill="black/30" />
              {polyPoints.map((pt, idx) => {
                const [px, py] = pt.split(',');
                return <circle key={idx} cx={px} cy={py} r="4.5" fill="#0066CC" stroke="white" strokeWidth="1.5" />;
              })}
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Regular Polygon Properties</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Sides (n): {sides}</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-black/60">Interior Angle: {interiorAngle.toFixed(1)}°</text>
              <text x={20} y={90} fontSize="9" className="font-mono fill-black/60">Interior Angle Sum: {sumAngles}°</text>
            </svg>
          </div>
        );
      }

      case 'coordinate_distance': {
        const x2 = sliderVals['x2'] !== undefined ? sliderVals['x2'] : 3.0;
        const y2 = sliderVals['y2'] !== undefined ? sliderVals['y2'] : 4.0;
        const distance = Math.sqrt(x2 * x2 + y2 * y2);
        const o_x = mapX(0);
        const o_y = mapY(0);
        const p_x = mapX(x2);
        const p_y = mapY(y2);
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {gridLines}
              {xAxis}
              {yAxis}
              {xTicks}
              {yTicks}
              {/* Distance Triangle */}
              <line x1={o_x} y1={o_y} x2={p_x} y2={p_y} stroke="#0066CC" strokeWidth="2.5" />
              <line x1={o_x} y1={o_y} x2={p_x} y2={o_y} stroke="#FF9500" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1={p_x} y1={o_y} x2={p_x} y2={p_y} stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,3" />
              
              <circle cx={o_x} cy={o_y} r="4.5" fill="#525252" stroke="white" strokeWidth="1.5" />
              <circle cx={p_x} cy={p_y} r="5" fill="#0066CC" stroke="white" strokeWidth="1.5" />
              
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Pythagorean Coordinate Distance</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-[#0066CC] font-bold">Distance (d): {distance.toFixed(2)} units</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-[#FF9500]">dx = {Math.abs(x2).toFixed(1)}</text>
              <text x={20} y={90} fontSize="9" className="font-mono fill-[#10B981]">dy = {Math.abs(y2).toFixed(1)}</text>
            </svg>
          </div>
        );
      }

      case 'series_convergence': {
        const r = sliderVals['r'] !== undefined ? sliderVals['r'] : 0.6;
        const n = sliderVals['n'] !== undefined ? sliderVals['n'] : 5;
        const base = 2.0;
        const terms = [];
        let runningSum = 0;
        for (let i = 0; i < n; i++) {
          const tVal = base * Math.pow(r, i);
          runningSum += tVal;
          terms.push({ index: i, val: tVal, cum: runningSum });
        }
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <line x1="40" y1="230" x2="460" y2="230" stroke="#000" strokeWidth="1" />
              {terms.map((term, idx) => {
                const barWidth = 35;
                const spacing = 15;
                const bx = 60 + idx * (barWidth + spacing);
                const bHeight = term.val * 45;
                const cHeight = term.cum * 45;
                return (
                  <g key={idx}>
                    {/* Cumulative total bar (faded background) */}
                    <rect x={bx} y={230 - cHeight} width={barWidth} height={cHeight} fill="rgba(0,102,204,0.06)" stroke="rgba(0,102,204,0.15)" strokeWidth="0.8" />
                    {/* Active term bar */}
                    <rect x={bx} y={230 - bHeight} width={barWidth} height={bHeight} fill="#0066CC" rx="2" />
                    <text x={bx + barWidth/2} y={242} fontSize="8" textAnchor="middle" className="font-mono fill-black/60">i={idx}</text>
                    <text x={bx + barWidth/2} y={225 - bHeight} fontSize="7" textAnchor="middle" className="font-mono fill-black/40">{term.val.toFixed(2)}</text>
                  </g>
                );
              })}
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Geometric Series Growth Sums</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-[#0066CC] font-bold">Sum (Sn): {runningSum.toFixed(3)}</text>
              {r < 1.0 ? (
                <text x={20} y={75} fontSize="9" className="font-mono fill-[#10B981] font-semibold">Converging (Limit: {(base / (1 - r)).toFixed(2)})</text>
              ) : (
                <text x={20} y={75} fontSize="9" className="font-mono fill-[#FF3B30] font-semibold">Diverging (r ≥ 1)</text>
              )}
            </svg>
          </div>
        );
      }

      case 'probability_binomial': {
        const p = sliderVals['p'] !== undefined ? sliderVals['p'] : 0.5;
        const n = 8;
        const comb = (n, k) => {
          let val = 1;
          for (let i = 1; i <= k; i++) val = (val * (n - i + 1)) / i;
          return val;
        };
        const probs = [];
        for (let k = 0; k <= n; k++) {
          const prob = comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
          probs.push({ k, prob });
        }
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <line x1="40" y1="230" x2="460" y2="230" stroke="#000" strokeWidth="1" />
              {probs.map((item, idx) => {
                const bWidth = 32;
                const bSpacing = 12;
                const bx = 60 + idx * (bWidth + bSpacing);
                const bHeight = item.prob * 420; // scale
                return (
                  <g key={idx}>
                    <rect x={bx} y={230 - bHeight} width={bWidth} height={bHeight} fill="#0066CC" rx="2" />
                    <text x={bx + bWidth/2} y={242} fontSize="8" textAnchor="middle" className="font-mono fill-black/60">{item.k}</text>
                    <text x={bx + bWidth/2} y={225 - bHeight} fontSize="7" textAnchor="middle" className="font-mono fill-black/50">{item.prob.toFixed(2)}</text>
                  </g>
                );
              })}
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Binomial Distributions (n=8)</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Expected value (E): {(n * p).toFixed(2)}</text>
            </svg>
          </div>
        );
      }

      case 'matrix_grid': {
        const a = sliderVals['a'] !== undefined ? sliderVals['a'] : 1.0;
        const b = sliderVals['b'] !== undefined ? sliderVals['b'] : 0.5;
        // Draw grid lines transformed by [[a, b], [0, 1.0]]
        const matPoints = [];
        // Original unit box vertices
        const box = [{x:0, y:0}, {x:2, y:0}, {x:2, y:2}, {x:0, y:2}];
        const mappedBox = box.map(p => {
          const tx = a * p.x + b * p.y;
          const ty = p.y;
          return `${mapX(tx)},${mapY(ty)}`;
        });
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {gridLines}
              {xAxis}
              {yAxis}
              {xTicks}
              {yTicks}
              {/* Original Box */}
              <polygon points={`${mapX(0)},${mapY(0)} ${mapX(2)},${mapY(0)} ${mapX(2)},${mapY(2)} ${mapX(0)},${mapY(2)}`} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeDasharray="3,3" />
              {/* Transformed Box */}
              <polygon points={mappedBox.join(' ')} fill="rgba(0,102,204,0.1)" stroke="#0066CC" strokeWidth="2.5" />
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Linear Transform Matrix Grid</text>
              <text x={20} y={60} fontSize="8" className="font-mono fill-black/60">Matrix: [[{a.toFixed(1)}, {b.toFixed(1)}], [0.0, 1.0]]</text>
              <text x={20} y={75} fontSize="8" className="font-mono fill-black/60">Determinant: {a.toFixed(2)}</text>
            </svg>
          </div>
        );
      }

      case 'physics_motion': {
        const vel = sliderVals['velocity'] !== undefined ? sliderVals['velocity'] : 8.0;
        const timeLimit = sliderVals['time'] !== undefined ? sliderVals['time'] : 5.0;
        const animatedT = isSimPlaying ? (simTime % timeLimit) : timeLimit;
        const progressX = animatedT * vel;
        // Map distance [0, 80] to track [50, 430]
        const runX = 50 + (progressX / 80) * 380;
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <line x1="50" y1="160" x2="450" y2="160" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
              <line x1="50" y1="160" x2="450" y2="160" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeDasharray="4,4" />
              {/* Runner Dot */}
              <circle cx={runX} cy={160} r="9" fill="#0066CC" stroke="white" strokeWidth="2" className="shadow-xs" />
              {/* Finish Flag */}
              <line x1="450" y1="130" x2="450" y2="166" stroke="#525252" strokeWidth="2" />
              <polygon points="450,130 432,138 450,146" fill="#FF3B30" />
              
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Linear Motion Kinematics</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Velocity: {vel.toFixed(1)} m/s</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-black/60">Time: {animatedT.toFixed(2)} s</text>
              <text x={20} y={90} fontSize="9" className="font-mono fill-[#0066CC] font-bold">Displacement (s): {progressX.toFixed(2)} m</text>
            </svg>
          </div>
        );
      }

      case 'physics_projectile': {
        const angle = sliderVals['angle'] !== undefined ? sliderVals['angle'] : 45;
        const velocity = sliderVals['velocity'] !== undefined ? sliderVals['velocity'] : 20;
        const g = 9.8;
        const rad = (angle * Math.PI) / 180;
        const vx = velocity * Math.cos(rad);
        const vy = velocity * Math.sin(rad);
        const tFlight = (2 * vy) / g;
        const maxHeight = (vy * vy) / (2 * g);
        const range = vx * tFlight;

        const animT = isSimPlaying ? (simTime % tFlight) : tFlight;
        
        // Render scaling
        const scaleX = 330 / ((40 * 40) / 9.8);
        const scaleY = 180 / 82;

        const pathPts = [];
        for (let t = 0; t <= tFlight; t += tFlight / 30) {
          const px = vx * t;
          const py = vy * t - 0.5 * g * t * t;
          pathPts.push(`${40 + px * scaleX},${230 - py * scaleY}`);
        }
        const curX = 40 + (vx * animT) * scaleX;
        const curY = 230 - (vy * animT - 0.5 * g * animT * animT) * scaleY;
        const curVy = vy - g * animT;
        const vecScale = 2.0;

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <defs>
                <marker id="force-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#FF3B30" />
                </marker>
                <marker id="force-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0066CC" />
                </marker>
              </defs>
              
              <line x1="40" y1="230" x2="450" y2="230" stroke="#0F0F0F" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="230" stroke="#0F0F0F" strokeWidth="1.5" />
              
              {/* Full Dotted Trajectory */}
              <path d={`M 40,230 L ${pathPts.join(' ')}`} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" strokeDasharray="3,3" />
              
              {/* Animated Trajectory */}
              {animT > 0 && (
                <path 
                  d={`M 40,230 L ${pathPts.slice(0, Math.ceil((animT/tFlight)*30)).join(' ')} L ${curX},${curY}`} 
                  fill="none" 
                  stroke="#0066CC" 
                  strokeWidth="2" 
                />
              )}

              {/* Cannon Shape */}
              <line 
                x1="40" 
                y1="230" 
                x2={40 + 25 * Math.cos(rad)} 
                y2={230 - 25 * Math.sin(rad)} 
                stroke="#525252" 
                strokeWidth="8" 
                strokeLinecap="round" 
              />
              <circle cx="40" cy="230" r="8" fill="#1A1A1A" />

              {/* Dynamic Velocity Vectors */}
              {animT < tFlight && (
                <>
                  {/* Vx Vector */}
                  <line x1={curX} y1={curY} x2={curX + vx * vecScale} y2={curY} stroke="#0066CC" strokeWidth="1.5" markerEnd="url(#force-blue)" />
                  <text x={curX + vx * vecScale + 3} y={curY + 3} fontSize="7" className="font-mono fill-[#0066CC] font-semibold">vx</text>
                  
                  {/* Vy Vector */}
                  <line x1={curX} y1={curY} x2={curX} y2={curY - curVy * vecScale} stroke="#FF3B30" strokeWidth="1.5" markerEnd="url(#force-red)" />
                  <text x={curX + 3} y={curY - curVy * vecScale - 3} fontSize="7" className="font-mono fill-[#FF3B30] font-semibold">vy</text>
                </>
              )}

              {/* Particle */}
              <circle cx={curX} cy={curY} r="5.5" fill="#0066CC" stroke="white" strokeWidth="1.5" />

              <text x={60} y={40} fontSize="10" fontWeight="bold" className="font-serif">Parabolic Projectile Launch</text>
              <text x={60} y={60} fontSize="9" className="font-mono fill-black/60">Range (R): {range.toFixed(1)} m</text>
              <text x={60} y={75} fontSize="9" className="font-mono fill-black/60">Apex altitude (H): {maxHeight.toFixed(1)} m</text>
              <text x={60} y={90} fontSize="9" className="font-mono fill-black/60">Flight duration: {tFlight.toFixed(2)} s</text>
            </svg>
          </div>
        );
      }

      case 'physics_forces': {
        const mass = sliderVals['mass'] !== undefined ? sliderVals['mass'] : 10;
        const incline = sliderVals['incline'] !== undefined ? sliderVals['incline'] : 30;
        const g = 9.8;
        const angleRad = (incline * Math.PI) / 180;
        
        // Kinematic forces
        const fg = mass * g; // Gravity force (N)
        const fn = fg * Math.cos(angleRad); // Normal force (N)
        const f_parallel = fg * Math.sin(angleRad); // Parallel component (N)
        const mu = 0.2; // coefficient of friction
        const ff = Math.min(f_parallel, mu * fn); // Friction force (N)
        const fnet = Math.max(0, f_parallel - ff); // Net force (N)
        const accel = fnet / mass; // Acceleration (m/s^2)

        // Coordinates for ramp
        const rx1 = 80;
        const ry1 = 230;
        const rampLength = 260;
        const rx2 = rx1 + rampLength * Math.cos(angleRad);
        const ry2 = ry1 - rampLength * Math.sin(angleRad);

        // Center of the block along the ramp
        const blockDist = rampLength * 0.5;
        const bx = rx1 + blockDist * Math.cos(angleRad);
        const by = ry1 - blockDist * Math.sin(angleRad);

        // Force vector lengths (scaled for visibility)
        const scale = 1.2; // pixels per Newton
        
        // Vector directions:
        // Gravity: straight down (0, 1)
        const fgX = bx;
        const fgY = by + fg * scale;

        // Normal: perpendicular to incline (-sin(θ), -cos(θ))
        const fnX = bx - fn * scale * Math.sin(angleRad);
        const fnY = by - fn * scale * Math.cos(angleRad);

        // Parallel gravity: along incline
        const fparX = bx - f_parallel * scale * Math.cos(angleRad);
        const fparY = by + f_parallel * scale * Math.sin(angleRad);

        // Friction: up the incline
        const ffX = bx + ff * scale * Math.cos(angleRad);
        const ffY = by - ff * scale * Math.sin(angleRad);

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <defs>
                <marker id="force-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#FF3B30" />
                </marker>
                <marker id="force-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10B981" />
                </marker>
                <marker id="force-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#FF9500" />
                </marker>
                <marker id="force-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0066CC" />
                </marker>
              </defs>

              {/* Ground horizontal line */}
              <line x1="40" y1="230" x2="460" y2="230" stroke="#E2E8F0" strokeWidth="2" />

              {/* Wedge/Incline */}
              <polygon 
                points={`${rx1},${ry1} ${rx2},${ry1} ${rx2},${ry2}`} 
                fill="rgba(0,102,204,0.03)" 
                stroke="#A3A3A3" 
                strokeWidth="1.5" 
              />
              
              {/* Angle Label arc & text */}
              <path 
                d={`M ${rx1 + 30},230 A 30,30 0 0,0 ${rx1 + 30 * Math.cos(angleRad)},${230 - 30 * Math.sin(angleRad)}`} 
                fill="none" 
                stroke="#525252" 
                strokeWidth="1.2" 
              />
              <text x={rx1 + 38} y={224} fontSize="8" className="font-mono fill-black/60">{incline}°</text>

              {/* Slanted Block */}
              <g transform={`rotate(${-incline}, ${bx}, ${by})`}>
                <rect 
                  x={bx - 20} 
                  y={by - 10} 
                  width="40" 
                  height="20" 
                  fill="#0066CC" 
                  fillOpacity="0.8"
                  stroke="white" 
                  strokeWidth="1.5" 
                  rx="1" 
                />
              </g>

              {/* Vector Lines */}
              {/* Gravity Fg */}
              <line x1={bx} y1={by} x2={fgX} y2={fgY} stroke="#FF3B30" strokeWidth="2" markerEnd="url(#force-red)" />
              <text x={fgX + 5} y={fgY + 2} fontSize="8" className="font-mono fill-[#FF3B30] font-semibold">Fg: {fg.toFixed(0)}N</text>

              {/* Normal Fn */}
              <line x1={bx} y1={by} x2={fnX} y2={fnY} stroke="#10B981" strokeWidth="2" markerEnd="url(#force-green)" />
              <text x={fnX - 8} y={fnY - 5} fontSize="8" className="font-mono fill-[#10B981] font-semibold">Fn: {fn.toFixed(0)}N</text>

              {/* Parallel gravity component */}
              <line x1={bx} y1={by} x2={fparX} y2={fparY} stroke="#0066CC" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#force-blue)" />
              <text x={fparX - 8} y={fparY + 8} fontSize="7" className="font-mono fill-[#0066CC]">F∥: {f_parallel.toFixed(0)}N</text>

              {/* Friction Ff */}
              <line x1={bx} y1={by} x2={ffX} y2={ffY} stroke="#FF9500" strokeWidth="2" markerEnd="url(#force-orange)" />
              <text x={ffX + 5} y={ffY - 5} fontSize="8" className="font-mono fill-[#FF9500] font-semibold">Ff: {ff.toFixed(0)}N</text>

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Inclined Plane Forces & Acceleration</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Mass: {mass} kg</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-black/60">Acceleration (a): {accel.toFixed(2)} m/s²</text>
              <text x={20} y={90} fontSize="9" className="font-mono fill-black/60">Net Downslope Force: {fnet.toFixed(1)} N</text>
            </svg>
          </div>
        );
      }

      case 'physics_circular': {
        const radius = sliderVals['radius'] !== undefined ? sliderVals['radius'] : 5.0;
        const speed = sliderVals['speed'] !== undefined ? sliderVals['speed'] : 6.0;
        const cx = 250, cy = 140;
        const drawR = radius * 14;
        const angularVelocity = speed / radius;
        const angle = isSimPlaying ? (simTime * angularVelocity) : 0;
        const px = cx + drawR * Math.cos(angle);
        const py = cy + drawR * Math.sin(angle);
        // Force vector pointing inwards
        const fx = px - 35 * Math.cos(angle);
        const fy = py - 35 * Math.sin(angle);
        // Velocity vector pointing tangent
        const vx = px - 35 * Math.sin(angle);
        const vy = py + 35 * Math.cos(angle);
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <circle cx={cx} cy={cy} r={drawR} fill="none" stroke="rgba(0,0,0,0.08)" strokeDasharray="3,3" />
              <circle cx={cx} cy={cy} r="3" fill="#A3A3A3" />
              {/* Radius line */}
              <line x1={cx} y1={cy} x2={px} y2={py} stroke="#A3A3A3" strokeWidth="1" />
              {/* Orbit Particle */}
              <circle cx={px} cy={py} r="6" fill="#0066CC" stroke="white" strokeWidth="1.5" />
              {/* Vector force */}
              <line x1={px} y1={py} x2={fx} y2={fy} stroke="#FF3B30" strokeWidth="2" />
              {/* Vector velocity */}
              <line x1={px} y1={py} x2={vx} y2={vy} stroke="#FF9500" strokeWidth="2" />

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Centripetal Vector Dynamics</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-[#FF3B30] font-bold">Centripetal Force (Fc): {((1.0 * speed*speed) / radius).toFixed(1)} N</text>
            </svg>
          </div>
        );
      }

      case 'physics_waves': {
        const amp = sliderVals['amp'] !== undefined ? sliderVals['amp'] : 1.5;
        const phase = sliderVals['phase'] !== undefined ? sliderVals['phase'] : 0.0;
        const pts1 = [], pts2 = [], ptsCombined = [];
        const tFactor = isSimPlaying ? (simTime * 4.0) : 0;
        for (let i = 0; i <= 100; i++) {
          const wx = 40 + i * 4.2; // scale to fit
          const xVal = (i / 100) * 4 * Math.PI;
          const y1 = amp * Math.sin(xVal - tFactor);
          const y2 = amp * Math.sin(xVal + tFactor - phase);
          const yComb = y1 + y2;
          pts1.push(`${wx},${140 - y1 * 20}`);
          pts2.push(`${wx},${140 - y2 * 20}`);
          ptsCombined.push(`${wx},${140 - yComb * 20}`);
        }
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <line x1="40" y1="140" x2="460" y2="140" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              {/* Wave 1 (faded red) */}
              <path d={`M ${pts1.join(' L ')}`} fill="none" stroke="rgba(255,59,48,0.3)" strokeWidth="1.2" />
              {/* Wave 2 (faded green) */}
              <path d={`M ${pts2.join(' L ')}`} fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1.2" />
              {/* Combined Wave (thick blue) */}
              <path d={`M ${ptsCombined.join(' L ')}`} fill="none" stroke="#0066CC" strokeWidth="2.5" />
              
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Wave Interference Superposition</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Phase offset: {((phase * 180)/Math.PI).toFixed(0)}°</text>
            </svg>
          </div>
        );
      }

      case 'physics_oscillations': {
        const mass = sliderVals['mass'] !== undefined ? sliderVals['mass'] : 4.0;
        const k = sliderVals['k'] !== undefined ? sliderVals['k'] : 20.0;
        const omega = Math.sqrt(k / mass);
        const animT = isSimPlaying ? simTime : 0;
        // displacement: y = center + A * cos(omega * t)
        const ampY = 30;
        const springLen = 100 + ampY * Math.cos(omega * animT);
        const bx = 200;
        const by = springLen + 30; // block Y center
        // Draw winding spring
        const springPts = [];
        const windings = 14;
        for (let si = 0; si <= windings; si++) {
          const sy = 30 + (springLen / windings) * si;
          const sx = bx + (si % 2 === 0 ? 10 : -10);
          springPts.push(`${sx},${sy}`);
        }

        // Live energy metrics
        const disp = ampY * Math.cos(omega * animT);
        const velocity = -ampY * omega * Math.sin(omega * animT);
        const maxE = 0.5 * k * (ampY/30) * (ampY/30) * 1000; // scaled for bar
        const peOsc = 0.5 * k * (disp/30) * (disp/30) * 1000;
        const keOsc = Math.max(0, maxE - peOsc);

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Ceiling hook */}
              <line x1={bx - 20} y1="30" x2={bx + 20} y2="30" stroke="#000" strokeWidth="3" />
              {/* Spring path */}
              <path d={`M ${bx},30 L ${springPts.join(' L ')} L ${bx},${springLen}`} fill="none" stroke="#525252" strokeWidth="2" strokeLinejoin="round" />
              {/* Weight block */}
              <rect x={bx - 18} y={by - 18} width="36" height="36" fill="#0066CC" stroke="white" strokeWidth="1.5" rx="3" />
              <text x={bx} y={by + 4} textAnchor="middle" fontSize="9" fontWeight="bold" className="fill-white font-mono">m</text>

              {/* Energy Bar Charts */}
              {/* PE (Green) */}
              <rect x="340" y={200 - (peOsc / maxE) * 100} width="24" height={(peOsc / maxE) * 100} fill="#10B981" rx="1.5" />
              <text x="352" y="212" fontSize="7" textAnchor="middle" className="font-mono fill-black/60">PE</text>
              {/* KE (Blue) */}
              <rect x="380" y={200 - (keOsc / maxE) * 100} width="24" height={(keOsc / maxE) * 100} fill="#0066CC" rx="1.5" />
              <text x="392" y="212" fontSize="7" textAnchor="middle" className="font-mono fill-black/60">KE</text>
              {/* Total (Black) */}
              <rect x="420" y={200 - 100} width="24" height="100" fill="#0F0F0F" rx="1.5" />
              <text x="432" y="212" fontSize="7" textAnchor="middle" className="font-mono fill-black/60">Total</text>
              
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Simple Harmonic Spring Motion</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Period (T): {(2 * Math.PI / omega).toFixed(2)} s</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-black/60">Stiffness (k): {k.toFixed(0)} N/m</text>
            </svg>
          </div>
        );
      }

      case 'physics_circuit': {
        const volts = sliderVals['voltage'] !== undefined ? sliderVals['voltage'] : 12.0;
        const ohms = sliderVals['resistance'] !== undefined ? sliderVals['resistance'] : 20.0;
        const current = volts / ohms;
        // Electron flow animation along loop: x: 80->420->420->80->80
        const circuitLength = 2 * (340 + 100);
        const speed = current * 200; // pixels per second
        const dist = isSimPlaying ? (simTime * speed) % circuitLength : 0;
        const getElectronCoord = (offset) => {
          const d = (dist + offset) % circuitLength;
          if (d < 340) {
            return { x: 80 + d, y: 60 };
          } else if (d < 340 + 100) {
            return { x: 420, y: 60 + (d - 340) };
          } else if (d < 340 + 100 + 340) {
            return { x: 420 - (d - 440), y: 160 };
          } else {
            return { x: 80, y: 160 - (d - 780) };
          }
        };
        const electrons = [0, 80, 160, 240, 320, 400, 480, 560, 640, 720].map(off => getElectronCoord(off));
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Wiring loops */}
              <rect x="80" y="60" width="340" height="100" fill="none" stroke="#525252" strokeWidth="3" />
              {/* Battery cell */}
              <rect x="230" y="52" width="40" height="16" fill="white" stroke="#525252" strokeWidth="2" />
              <line x1="242" y1="48" x2="242" y2="72" stroke="#000" strokeWidth="2.5" />
              <line x1="258" y1="53" x2="258" y2="67" stroke="#000" strokeWidth="1.5" />
              {/* Resistor symbol */}
              <rect x="220" y="152" width="60" height="16" fill="#FF9500" stroke="#FF9500" rx="3" />
              <text x="250" y="163" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" className="font-mono">R: {ohms}Ω</text>
              {/* Flowing electrons */}
              {electrons.map((e, idx) => (
                <circle key={idx} cx={e.x} cy={e.y} r="3.5" fill="#0066CC" stroke="white" strokeWidth="0.8" />
              ))}
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Ohm's Law: Electron Flow</text>
              <text x={20} y={210} fontSize="11" fontWeight="bold" className="font-mono fill-[#0066CC]">Current (I): {current.toFixed(3)} A</text>
            </svg>
          </div>
        );
      }

      case 'physics_magnetic': {
        const strength = sliderVals['strength'] !== undefined ? sliderVals['strength'] : 5.0;
        const cx = 250, cy = 140;
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Dipole loops */}
              {[40, 70, 100, 130].map((rx, idx) => (
                <g key={idx} opacity={strength / 10}>
                  <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.55} fill="none" stroke="#FF9500" strokeWidth="1" strokeDasharray="3,3" />
                </g>
              ))}
              {/* Magnet block */}
              <rect x={cx - 50} y={cy - 12} width="50" height="24" fill="#FF3B30" stroke="white" strokeWidth="1" />
              <rect x={cx} y={cy - 12} width="50" height="24" fill="#525252" stroke="white" strokeWidth="1" />
              <text x={cx - 25} y={cy + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" className="font-mono">N</text>
              <text x={cx + 25} y={cy + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" className="font-mono">S</text>
              
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Dipolar Magnetic flux patterns</text>
            </svg>
          </div>
        );
      }

      case 'physics_optics': {
        const theta1 = sliderVals['theta1'] !== undefined ? sliderVals['theta1'] : 30;
        const n2 = sliderVals['n2'] !== undefined ? sliderVals['n2'] : 1.5;
        const rad1 = (theta1 * Math.PI) / 180;
        const rad2 = Math.asin(Math.sin(rad1) / n2);
        const theta2 = (rad2 * 180) / Math.PI;

        const cx = 250, cy = 140;
        // incident ray coordinates
        const ix = cx - 110 * Math.sin(rad1);
        const iy = cy - 110 * Math.cos(rad1);
        // refracted ray coordinates
        const rx = cx + 110 * Math.sin(rad2);
        const ry = cy + 110 * Math.cos(rad2);

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Glass block (bottom half) */}
              <rect x="50" y={cy} width="400" height="110" fill="rgba(0,102,204,0.04)" stroke="rgba(0,0,0,0.06)" />
              {/* Interface */}
              <line x1="50" y1={cy} x2="450" y2={cy} stroke="#A3A3A3" strokeWidth="1.5" />
              {/* Normal */}
              <line x1={cx} y1="30" x2={cx} y2="250" stroke="#000" strokeWidth="0.8" strokeDasharray="3,3" />
              
              {/* Ray paths */}
              <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="#FF9500" strokeWidth="2.5" />
              <line x1={cx} y1={cy} x2={rx} y2={ry} stroke="#FF3B30" strokeWidth="2" />
              
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Light Refraction Optics</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Incident θ1: {theta1}°</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-[#FF3B30] font-bold">Refracted θ2: {theta2.toFixed(1)}°</text>
            </svg>
          </div>
        );
      }

      case 'physics_modern': {
        const wl = sliderVals['wavelength'] !== undefined ? sliderVals['wavelength'] : 350;
        const work = sliderVals['work'] !== undefined ? sliderVals['work'] : 2.5;
        const photonE = 1240 / wl;
        const activeE = Math.max(0, photonE - work);
        const eType = photonE > work ? 'spontaneous' : 'blocked';
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Ejection plate */}
              <rect x="60" y="80" width="16" height="120" fill="#E2E8F0" stroke="#A3A3A3" rx="2" />
              {/* Photons beam wave */}
              <path d="M 10,140 Q 25,120 40,140 T 70,140" fill="none" stroke="#FF9500" strokeWidth="2" />
              {/* Ejected Electron Dot */}
              {eType === 'spontaneous' && (
                <g>
                  <circle cx="150" cy="140" r="5" fill="#0066CC" stroke="white" strokeWidth="1.5" />
                  <line x1="80" y1="140" x2="140" y2="140" stroke="#0066CC" strokeWidth="1" strokeDasharray="2,2" />
                </g>
              )}
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Photoelectric Photon Quanta</text>
              <text x={20} y={225} fontSize="9" className="font-mono fill-black/60">Photon Energy: {photonE.toFixed(2)} eV (vs Work: {work} eV)</text>
              <text x={20} y={240} fontSize="9" className={`font-mono font-bold ${eType === 'spontaneous' ? 'fill-[#10B981]' : 'fill-[#FF3B30]'}`}>
                {eType === 'spontaneous' ? `Active Ejection (KE = ${activeE.toFixed(2)} eV)` : 'Below Threshold (No Ejection)'}
              </text>
            </svg>
          </div>
        );
      }

      case 'chem_bohr': {
        const shell = sliderVals['shell'] !== undefined ? sliderVals['shell'] : 2;
        const cx = 250, cy = 140;
        const eAngle = isSimPlaying ? simTime * 2.0 : 0;
        
        // Draw photon emission wave if animation is running
        const showPhoton = isSimPlaying && (simTime % 4.0 > 2.0);
        const photonProgress = showPhoton ? ((simTime % 4.0) - 2.0) * 150 : 0;
        
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Concentric shell rings */}
              {[1, 2, 3, 4].map(n => (
                <circle key={n} cx={cx} cy={cy} r={n * 28} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={n === shell ? 1.5 : 0.8} strokeDasharray="3,3" />
              ))}
              {/* Shell labels */}
              {[1, 2, 3, 4].map(n => (
                <text key={n} x={cx + n * 28 + 4} y={cy + 3} fontSize="6" className="font-mono fill-black/30">n={n}</text>
              ))}
              {/* Nucleus */}
              <circle cx={cx} cy={cy} r="12" fill="#FF3B30" />
              <text x={cx} y={cy + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">+</text>
              
              {/* Orbiting electron */}
              {(() => {
                const orbR = shell * 28;
                return (
                  <circle cx={cx + orbR * Math.cos(eAngle)} cy={cy + orbR * Math.sin(eAngle)} r="5" fill="#0066CC" stroke="white" strokeWidth="1.5" />
                );
              })()}

              {/* Photon wave emission path */}
              {showPhoton && (
                <path 
                  d={`M ${cx + 10},${cy} Q ${cx + 30},${cy - 10} ${cx + 50},${cy} T ${cx + 90},${cy} T ${cx + 130},${cy} T ${cx + 170},${cy}`}
                  fill="none" 
                  stroke="#FF9500" 
                  strokeWidth="1.5"
                  transform={`rotate(45, ${cx}, ${cy}) translate(${photonProgress}, 0)`}
                />
              )}
              {showPhoton && (
                <text x={cx + 100} y={cy - 20} fontSize="7" className="font-mono fill-[#FF9500] font-semibold animate-pulse">Photon (hν) Emitted</text>
              )}

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Bohr Hydrogen Orbit & Transitions</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Orbit: n={shell}</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-black/60">Energy: {(-13.6 / (shell*shell)).toFixed(2)} eV</text>
              <text x={20} y={90} fontSize="9" className="font-mono fill-[#FF9500]">Emission: Lyman/Balmer transition</text>
            </svg>
          </div>
        );
      }

      case 'chem_bonding': {
        const dist = sliderVals['dist'] !== undefined ? sliderVals['dist'] : 74;
        const cx = 250, cy = 100;
        
        // Scale distance to pixels
        const distPx = dist * 0.9;
        const x1 = cx - distPx / 2;
        const x2 = cx + distPx / 2;
        
        // Shaded overlapping electron cloud radius
        const rCloud = 50;
        
        // Lennard-Jones potential data marker
        // V(r) = 4 * ((1/r)^12 - (1/r)^6)
        // map dist 40-200 to curve
        const curvePts = [];
        for (let d = 40; d <= 200; d += 4) {
          const r = d / 74;
          const v = 4 * (Math.pow(1/r, 12) - Math.pow(1/r, 6));
          // map to plot: x from 200 to 450, y from 160 to 260
          const px = 200 + ((d - 40) / 160) * 250;
          const py = 230 + Math.min(30, Math.max(-50, v * 25));
          curvePts.push(`${px},${py}`);
        }
        
        const currentR = dist / 74;
        const currentV = 4 * (Math.pow(1/currentR, 12) - Math.pow(1/currentR, 6));
        const markerX = 200 + ((dist - 40) / 160) * 250;
        const markerY = 230 + Math.min(30, Math.max(-50, currentV * 25));

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Shaded Electron Clouds */}
              <circle cx={x1} cy={cy} r={rCloud} fill="rgba(0,102,204,0.04)" stroke="none" />
              <circle cx={x2} cy={cy} r={rCloud} fill="rgba(0,102,204,0.04)" stroke="none" />
              
              {/* Overlap highlights */}
              {distPx < 2 * rCloud && (
                <path 
                  d={`M ${cx},${cy - Math.sqrt(rCloud*rCloud - (distPx/2)*(distPx/2))} A ${rCloud},${rCloud} 0 0,1 ${cx},${cy + Math.sqrt(rCloud*rCloud - (distPx/2)*(distPx/2))} A ${rCloud},${rCloud} 0 0,1 ${cx},${cy - Math.sqrt(rCloud*rCloud - (distPx/2)*(distPx/2))}`}
                  fill="rgba(0,102,204,0.15)"
                  stroke="none"
                />
              )}

              {/* Nuclei */}
              <circle cx={x1} cy={cy} r="6" fill="#FF3B30" stroke="white" strokeWidth="1" />
              <text x={x1} y={cy - 10} textAnchor="middle" fontSize="7" className="font-mono fill-black/60">H+</text>
              <circle cx={x2} cy={cy} r="6" fill="#FF3B30" stroke="white" strokeWidth="1" />
              <text x={x2} y={cy - 10} textAnchor="middle" fontSize="7" className="font-mono fill-black/60">H+</text>

              {/* Distance vector */}
              <line x1={x1} y1={cy} x2={x2} y2={cy} stroke="#525252" strokeWidth="1" strokeDasharray="3,3" />
              <text x={cx} y={cy - 5} textAnchor="middle" fontSize="8" className="font-mono fill-black font-semibold">{dist} pm</text>

              {/* Lennard-Jones Potential Plot */}
              <line x1="200" y1="230" x2="450" y2="230" stroke="#A3A3A3" strokeWidth="1" />
              <line x1="200" y1="170" x2="200" y2="260" stroke="#A3A3A3" strokeWidth="1" />
              <text x="440" y="242" fontSize="7" className="font-mono fill-black/60">r (dist)</text>
              <text x="175" y="180" fontSize="7" className="font-mono fill-black/60">Energy V(r)</text>
              
              <path d={`M ${curvePts.join(' L ')}`} fill="none" stroke="#0066CC" strokeWidth="2" />
              <circle cx={markerX} cy={markerY} r="4.5" fill="#FF9500" stroke="white" strokeWidth="1" />

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Covalent Bond Overlaps (H₂)</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Ideal Bond: 74 pm</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-[#0066CC] font-bold">Bond Energy: {-currentV.toFixed(1)}ε units</text>
            </svg>
          </div>
        );
      }

      case 'chem_states': {
        const temp = sliderVals['temp'] !== undefined ? sliderVals['temp'] : 100;
        const state = temp < 150 ? 'Solid' : temp < 350 ? 'Liquid' : 'Gas';
        const numParticles = 16;
        const particles = [];
        const bx = 250, by = 140;
        
        for (let i = 0; i < numParticles; i++) {
          const row = Math.floor(i / 4);
          const col = i % 4;
          
          let px = bx - 45 + col * 30;
          let py = by - 45 + row * 30;
          
          if (state === 'Solid') {
            const wobble = isSimPlaying ? Math.sin(simTime * 12 + i) * 1.5 : 0;
            px += wobble;
            py += Math.cos(simTime * 12 + i) * 1.5;
          } else if (state === 'Liquid') {
            const tOffset = simTime * 2.0;
            px = bx - 50 + ((col * 28 + Math.sin(tOffset + i) * 10 + 100) % 100);
            py = by + 20 + Math.sin(tOffset * 0.5 + i) * 8 + (row * 8);
            if (py > by + 50) py = by + 45;
          } else {
            const speedFact = temp / 22;
            const angle = i * 2.4;
            const travel = isSimPlaying ? (simTime * speedFact * 12) : 0;
            px = bx - 50 + ((col * 35 + Math.cos(angle) * travel + 200) % 100);
            py = by - 50 + ((row * 35 + Math.sin(angle) * travel + 200) % 100);
          }
          particles.push({ x: px, y: py, angle: i * 2.4 });
        }

        const mercuryHeight = ((temp - 50) / 450) * 95 + 10;
        const mercuryY = 190 - mercuryHeight;

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <defs>
                <linearGradient id="thermometerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E5E7EB" stopOpacity="0.6" />
                  <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#F3F4F6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#D1D5DB" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="mercuryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="40%" stopColor="#F87171" />
                  <stop offset="100%" stopColor="#991B1B" />
                </linearGradient>
              </defs>

              {/* Particle chamber */}
              <rect x={bx - 60} y={by - 60} width="120" height="120" fill="none" stroke="#525252" strokeWidth="2.5" />
              
              {/* Glass Thermometer Outline (Background) */}
              <path d="M 81,75 A 5,5 0 0,1 91,75 L 91,177 A 14,14 0 1,1 81,177 Z" fill="url(#thermometerGrad)" stroke="#9CA3AF" strokeWidth="1.5" />
              
              {/* Red Mercury Column and Bulb (Foreground) */}
              <path d={`M 83.5,${mercuryY} A 2.5,2.5 0 0,1 88.5,${mercuryY} L 88.5,180 A 10,10 0 1,1 83.5,180 Z`} fill="url(#mercuryGrad)" />

              {/* Subtle glass reflection highlight */}
              <path d="M 83,78 L 83,178" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

              {/* Graduation Ticks */}
              <line x1="73" y1="85" x2="79" y2="85" stroke="#9CA3AF" strokeWidth="1" />
              <text x="69" y="87" fontSize="7" textAnchor="end" className="font-mono fill-black/60">500 K</text>

              <line x1="73" y1="117" x2="79" y2="117" stroke="#9CA3AF" strokeWidth="1" />
              <text x="69" y="119" fontSize="7" textAnchor="end" className="font-mono fill-black/60">350 K</text>

              <line x1="73" y1="148" x2="79" y2="148" stroke="#9CA3AF" strokeWidth="1" />
              <text x="69" y="150" fontSize="7" textAnchor="end" className="font-mono fill-black/60">200 K</text>

              <line x1="73" y1="180" x2="79" y2="180" stroke="#9CA3AF" strokeWidth="1" />
              <text x="69" y="182" fontSize="7" textAnchor="end" className="font-mono fill-black/60">50 K</text>

              {/* Bouncing circles */}
              {particles.map((p, idx) => (
                <g key={idx}>
                  {state === 'Gas' && (
                    <line 
                      x1={p.x} 
                      y1={p.y} 
                      x2={p.x - 8 * Math.cos(p.angle)} 
                      y2={p.y - 8 * Math.sin(p.angle)} 
                      stroke="rgba(0,102,204,0.25)" 
                      strokeWidth="1" 
                    />
                  )}
                  <circle cx={p.x} cy={p.y} r="5.5" fill={state === 'Solid' ? '#0066CC' : state === 'Liquid' ? '#10B981' : '#FF9500'} stroke="white" strokeWidth="1" />
                </g>
              ))}

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Kinetic Molecular Theory States</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Temperature: {temp} K</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-[#0066CC] font-bold">Phase State: {state}</text>
            </svg>
          </div>
        );
      }

      case 'chem_thermo': {
        const deltaH = sliderVals['deltaH'] !== undefined ? sliderVals['deltaH'] : -40;
        const ea = sliderVals['ea'] !== undefined ? sliderVals['ea'] : 60;
        
        // Map enthalpy and ea to coordinates
        const ryReactants = 160;
        const ryPeak = ryReactants - ea * 0.9;
        const ryProducts = ryReactants - deltaH * 0.9;
        
        // Draw reaction profile Bezier curve
        const p1x = 120, p1y = ryReactants;
        const c1x = 200, c1y = ryReactants;
        const peakX = 250, peakY = ryPeak;
        const c2x = 300, c2y = ryProducts;
        const p2x = 380, p2y = ryProducts;
        
        const curvePath = `M ${p1x},${p1y} C ${c1x},${c1y} ${peakX - 30},${peakY} ${peakX},${peakY} C ${peakX + 30},${peakY} ${c2x},${c2y} ${p2x},${p2y}`;
        
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <defs>
                <marker id="arrow-double" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 5 0 L 10 10 L 0 10 z" fill="#525252" />
                </marker>
              </defs>
              
              {/* Axes */}
              <line x1="80" y1="230" x2="420" y2="230" stroke="#000" strokeWidth="1" />
              <line x1="80" y1="60" x2="80" y2="230" stroke="#000" strokeWidth="1" />
              <text x="410" y="242" fontSize="8" className="font-mono fill-black/60">Reaction Coordinate</text>
              <text x="65" y="70" fontSize="8" className="font-mono fill-black/60">Potential Energy</text>
              
              {/* Reaction path curve */}
              <path d={curvePath} fill="none" stroke="#0066CC" strokeWidth="2.5" />
              
              {/* Dotted reference lines */}
              <line x1={p1x} y1={ryReactants} x2={peakX} y2={ryReactants} stroke="#A3A3A3" strokeWidth="1" strokeDasharray="3,3" />
              <line x1={p2x} y1={ryProducts} x2={p2x - 50} y2={ryProducts} stroke="#A3A3A3" strokeWidth="1" strokeDasharray="3,3" />
              
              {/* Activation Energy vector Ea */}
              <line x1={peakX} y1={ryReactants} x2={peakX} y2={ryPeak} stroke="#FF9500" strokeWidth="1.5" markerEnd="url(#force-orange)" />
              <text x={peakX + 5} y={(ryReactants + ryPeak)/2} fontSize="8" className="font-mono fill-[#FF9500] font-semibold">Ea ({ea} kJ)</text>
              
              {/* Enthalpy change vector deltaH */}
              <line x1="330" y1={ryReactants} x2="330" y2={ryProducts} stroke="#E0443E" strokeWidth="1.5" markerEnd={deltaH < 0 ? "url(#force-red)" : "url(#force-blue)"} />
              <text x="335" y={(ryReactants + ryProducts)/2} fontSize="8" className="font-mono fill-[#E0443E] font-semibold">ΔH ({deltaH} kJ)</text>

              {/* Labels for reactants/products */}
              <text x={p1x - 25} y={p1y + 4} fontSize="8" fontWeight="bold" className="font-sans">Reactants</text>
              <text x={p2x + 10} y={p2y + 4} fontSize="8" fontWeight="bold" className="font-sans">Products</text>
              
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Activation Enthalpy Reaction Profile</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Type: {deltaH < 0 ? 'Exothermic' : 'Endothermic'}</text>
            </svg>
          </div>
        );
      }

      case 'chem_equilibrium': {
        const kc = sliderVals['kc'] !== undefined ? sliderVals['kc'] : 2.0;
        const addA = sliderVals['addA'] !== undefined ? sliderVals['addA'] : 1.0;
        
        // Seesaw tilt angle depending on addA (reactants weight)
        const tilt = (addA - 1.0) * 8.0; // degrees
        const tiltRad = (tilt * Math.PI) / 180;
        
        // Seesaw center
        const cx = 250, cy = 180;
        
        // Concentrations
        const concReactants = 4.0 + addA;
        const concProducts = 4.0 * kc;
        
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Seesaw Stand */}
              <polygon points={`${cx},${cy} ${cx - 15},${cy + 40} ${cx + 15},${cy + 40}`} fill="#A3A3A3" />
              
              {/* Tilted seesaw plank */}
              <g transform={`rotate(${tilt}, ${cx}, ${cy})`}>
                <line x1={cx - 120} y1={cy} x2={cx + 120} y2={cy} stroke="#525252" strokeWidth="4" />
                {/* Reactants bowl */}
                <rect x={cx - 130} y={cy - 20} width="30" height="20" fill="#0066CC" rx="2" />
                <text x={cx - 115} y={cy - 8} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" className="font-mono">Reactants</text>
                
                {/* Products bowl */}
                <rect x={cx + 100} y={cy - 20} width="30" height="20" fill="#10B981" rx="2" />
                <text x={cx + 115} y={cy - 8} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" className="font-mono">Products</text>
              </g>

              {/* Bar concentrations */}
              <line x1="80" y1="110" x2="200" y2="110" stroke="#E2E8F0" />
              <rect x="100" y={110 - concReactants * 10} width="16" height={concReactants * 10} fill="#0066CC" rx="1" />
              <text x="108" y="122" fontSize="7" textAnchor="middle" className="font-mono fill-black/60">[Reactants]</text>
              
              <rect x="140" y={110 - concProducts * 5} width="16" height={concProducts * 5} fill="#10B981" rx="1" />
              <text x="148" y="122" fontSize="7" textAnchor="middle" className="font-mono fill-black/60">[Products]</text>

              {/* Q vs K quotient arrow */}
              {addA > 1.0 && (
                <g className="animate-pulse">
                  <path d="M 230,80 L 270,80" fill="none" stroke="#FF9500" strokeWidth="2.5" markerEnd="url(#force-orange)" />
                  <text x="250" y="72" textAnchor="middle" fontSize="7" className="font-mono fill-[#FF9500] font-bold">Shift Right →</text>
                </g>
              )}

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Le Chatelier Equilibrium Seesaw</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Equilibrium Constant (Kc): {kc.toFixed(1)}</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-[#FF9500] font-bold">State: {addA > 1.0 ? 'Reactants Injected (Q < Kc)' : 'Equilibrium (Q = Kc)'}</text>
            </svg>
          </div>
        );
      }

      case 'chem_water': {
        const angle = sliderVals['bondAngle'] !== undefined ? sliderVals['bondAngle'] : 104.5;
        const length = sliderVals['bondLength'] !== undefined ? sliderVals['bondLength'] : 96.0;
        const ox = 250;
        const oy = 110;
        const rad = (angle * Math.PI) / 360; 
        const visualScale = 0.9;
        const renderLength = length * visualScale;
        
        const h1x = ox - renderLength * Math.sin(rad);
        const h1y = oy + renderLength * Math.cos(rad);
        const h2x = ox + renderLength * Math.sin(rad);
        const h2y = oy + renderLength * Math.cos(rad);
        
        const calculatedDipole = 2 * Math.cos(rad) * length * 0.0096;

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <defs>
                <marker id="dipole-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#FF9500" />
                </marker>
              </defs>

              {/* Covalent bonds */}
              <line x1={ox} y1={oy} x2={h1x} y2={h1y} stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
              <line x1={ox} y1={oy} x2={h2x} y2={h2y} stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
              
              <line x1={ox} y1={oy} x2={h1x} y2={h1y} stroke="#0F0F0F" strokeWidth="1.2" />
              <line x1={ox} y1={oy} x2={h2x} y2={h2y} stroke="#0F0F0F" strokeWidth="1.2" />

              {/* Atoms */}
              <circle cx={ox} cy={oy} r="18" fill="#FF6B6B" stroke="#A61C1C" strokeWidth="1" />
              <text x={ox} y={oy + 3} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
              <text x={ox + 20} y={oy - 5} fontSize="7" className="font-mono fill-[#FF6B6B] font-bold">δ⁻</text>
              
              <circle cx={h1x} cy={h1y} r="12" fill="#FAFAF8" stroke="#CBD5E0" strokeWidth="1" />
              <text x={h1x} y={h1y + 3} textAnchor="middle" fill="#2D3748" fontSize="8" fontWeight="bold">H</text>
              <text x={h1x - 15} y={h1y - 3} fontSize="7" className="font-mono fill-[#525252] font-bold">δ⁺</text>
              
              <circle cx={h2x} cy={h2y} r="12" fill="#FAFAF8" stroke="#CBD5E0" strokeWidth="1" />
              <text x={h2x} y={h2y + 3} textAnchor="middle" fill="#2D3748" fontSize="8" fontWeight="bold">H</text>
              <text x={h2x + 10} y={h2y - 3} fontSize="7" className="font-mono fill-[#525252] font-bold">δ⁺</text>

              {/* Individual bond dipole vectors */}
              <line x1={(ox+h1x)/2} y1={(oy+h1y)/2} x2={(ox*3+h1x)/4} y2={(oy*3+h1y)/4} stroke="#FF9500" strokeWidth="1.5" markerEnd="url(#dipole-arrow)" />
              <line x1={(ox+h2x)/2} y1={(oy+h2y)/2} x2={(ox*3+h2x)/4} y2={(oy*3+h2y)/4} stroke="#FF9500" strokeWidth="1.5" markerEnd="url(#dipole-arrow)" />

              {/* Net dipole vector pointing straight down from Oxygen */}
              <line x1={ox} y1={oy} x2={ox} y2={oy + calculatedDipole * 50} stroke="#FF3B30" strokeWidth="2.5" markerEnd="url(#force-red)" />
              <text x={ox + 8} y={oy + calculatedDipole * 25 + 3} fontSize="8" className="font-mono fill-[#FF3B30] font-bold">Net Dipole (μ)</text>

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Water Molecule polar Geometry</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Bond Angle: {angle.toFixed(1)}°</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-[#10B981] font-bold">Dipole Moment (μ): {calculatedDipole.toFixed(2)} D</text>
            </svg>
          </div>
        );
      }

      case 'chem_ph': {
        const ph = sliderVals['ph'] !== undefined ? sliderVals['ph'] : 4.0;
        
        // Smooth pH color scale
        const phColors = [
          "#FF3B30", // pH 1 (Red)
          "#FF453A", // pH 2
          "#FF9500", // pH 4 (Orange)
          "#FFCC00", // pH 6 (Yellow)
          "#34C759", // pH 7 (Green)
          "#30B0C7", // pH 9 (Cyan)
          "#007AFF", // pH 11 (Blue)
          "#5856D6", // pH 13 (Indigo)
          "#AF52DE"  // pH 14 (Purple)
        ];
        
        // Heuristic index lookup
        const colorIdx = Math.min(phColors.length - 1, Math.max(0, Math.floor((ph - 1) / 1.6)));
        const pHColor = phColors[colorIdx];

        // Concentrations
        const hConc = Math.pow(10, -ph);
        const ohConc = Math.pow(10, -(14 - ph));

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Beaker Outline */}
              <path d="M 210,70 L 210,190 A 10,10 0 0,0 220,200 L 280,200 A 10,10 0 0,0 290,190 L 290,70" fill="none" stroke="#525252" strokeWidth="2.5" />
              {/* Liquid inside */}
              <path d="M 212,120 L 212,190 A 8,8 0 0,0 220,198 L 280,198 A 8,8 0 0,0 288,190 L 288,120 Z" fill={pHColor} fillOpacity="0.55" />
              
              <text x="250" y="160" textAnchor="middle" fontSize="14" fontWeight="bold" className="font-mono fill-black/85">pH {ph.toFixed(1)}</text>
              <text x="250" y="175" textAnchor="middle" fontSize="7" className="font-mono fill-black/60">
                {ph < 7.0 ? 'Acidic' : ph === 7.0 ? 'Neutral' : 'Basic'}
              </text>

              {/* Ion Concentration Log indicators on the side */}
              <line x1="70" y1="180" x2="150" y2="180" stroke="#E2E8F0" />
              <rect x="85" y={Math.max(70, 180 - ph * 8)} width="16" height={ph * 8} fill="#FF3B30" rx="1.5" />
              <text x="93" y="192" fontSize="7" textAnchor="middle" className="font-mono fill-black/60">[H+]</text>
              
              <rect x="120" y={Math.max(70, 180 - (14 - ph) * 8)} width="16" height={(14 - ph) * 8} fill="#007AFF" rx="1.5" />
              <text x="128" y="192" fontSize="7" textAnchor="middle" className="font-mono fill-black/60">[OH-]</text>

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">pH & Acid Dissociation scale</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">H⁺ Conc: {hConc.toExponential(2)} M</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-black/60">OH⁻ Conc: {ohConc.toExponential(2)} M</text>
            </svg>
          </div>
        );
      }

      case 'chem_galvanic': {
        const cathode = sliderVals['cathodePot'] !== undefined ? sliderVals['cathodePot'] : 0.34;
        const anode = sliderVals['anodePot'] !== undefined ? sliderVals['anodePot'] : -0.76;
        const cellV = cathode - anode;
        
        // Electron flow progress along wire loop
        const eProgress = isSimPlaying ? (simTime * 90) % 280 : 0;
        
        // Needle rotation angle for voltmeter
        const needleAngle = Math.max(-60, Math.min(60, (cellV / 2.5) * 60));

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <defs>
                <marker id="arrow-pot" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#525252" />
                </marker>
              </defs>

              {/* Beaker 1 (Left - Zinc Anode oxidation) */}
              <rect x="80" y="100" width="90" height="90" fill="none" stroke="#525252" strokeWidth="1.5" rx="3" />
              <rect x="83" y="125" width="84" height="62" fill="rgba(0,102,204,0.06)" rx="1.5" />
              {/* Electrode Zn */}
              <rect x="115" y="70" width="20" height="90" fill="#A3A3A3" stroke="#525252" strokeWidth="1" />
              <text x="125" y="90" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">Zn</text>

              {/* Beaker 2 (Right - Copper Cathode reduction) */}
              <rect x="330" y="100" width="90" height="90" fill="none" stroke="#525252" strokeWidth="1.5" rx="3" />
              <rect x="333" y="125" width="84" height="62" fill="rgba(0,102,204,0.06)" rx="1.5" />
              {/* Electrode Cu */}
              <rect x="365" y="70" width="20" height="90" fill="#FF9500" stroke="#B85C00" strokeWidth="1" />
              <text x="375" y="90" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">Cu</text>

              {/* Connecting Wire */}
              <path d="M 125,70 L 125,50 L 375,50 L 375,70" fill="none" stroke="#525252" strokeWidth="2.5" />
              
              {/* Salt Bridge */}
              <path d="M 150,140 L 150,110 L 350,110 L 350,140" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="square" />
              <path d="M 150,140 L 150,110 L 350,110 L 350,140" fill="none" stroke="#CBD5E0" strokeWidth="1" strokeLinecap="square" />
              <text x="250" y="120" textAnchor="middle" fontSize="7" className="font-mono fill-black/50">Salt Bridge (KNO₃)</text>

              {/* Voltmeter dial */}
              <circle cx="250" cy="50" r="20" fill="white" stroke="#525252" strokeWidth="2" />
              <path d="M 250,50 L 250,55" stroke="#000" strokeWidth="1.5" />
              {/* needle */}
              <line x1="250" y1="50" x2={250 + 16 * Math.sin((needleAngle*Math.PI)/180)} y2={50 - 16 * Math.cos((needleAngle*Math.PI)/180)} stroke="#FF3B30" strokeWidth="1.5" />
              <text x="250" y="65" textAnchor="middle" fontSize="8" fontWeight="bold" className="font-mono fill-[#0066CC]">{cellV.toFixed(2)} V</text>

              {/* Electron flow animation dot */}
              {isSimPlaying && eProgress < 250 && (
                <circle 
                  cx={
                    eProgress < 75 ? 125 : 
                    eProgress < 175 ? 125 + (eProgress - 75) * 2.5 : 
                    375
                  } 
                  cy={
                    eProgress < 75 ? 70 - eProgress : 
                    eProgress < 175 ? 50 : 
                    50 + (eProgress - 175) * 0.8
                  } 
                  r="3" 
                  fill="#0066CC" 
                  stroke="white" 
                  strokeWidth="0.5" 
                />
              )}

              <text x={20} y={235} fontSize="10" fontWeight="bold" className="font-serif">Galvanic Zinc-Copper Electrochemistry</text>
              <text x={20} y={250} fontSize="9" className="font-mono fill-black/60">
                Cell EMF E° = Cathode ({cathode.toFixed(2)}V) - Anode ({anode.toFixed(2)}V) = {cellV.toFixed(2)}V
              </text>
            </svg>
          </div>
        );
      }

      case 'chem_stoichiometry': {
        const molesH2 = sliderVals['molesH2'] !== undefined ? sliderVals['molesH2'] : 4.0;
        const molesO2 = sliderVals['molesO2'] !== undefined ? sliderVals['molesO2'] : 3.0;
        const H2_required = molesO2 * 2;
        const isH2Limiting = molesH2 <= H2_required;
        const yieldH2O = isH2Limiting ? molesH2 : H2_required;
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <line x1="60" y1="210" x2="440" y2="210" stroke="#000" strokeWidth="1.5" />
              {/* Moles H2 */}
              <rect x="100" y={210 - molesH2 * 15} width="40" height={molesH2 * 15} fill="#0066CC" rx="2" />
              <text x="120" y="222" fontSize="8" textAnchor="middle" className="font-mono">H2 ({molesH2.toFixed(1)})</text>
              {/* Moles O2 */}
              <rect x="230" y={210 - molesO2 * 15} width="40" height={molesO2 * 15} fill="#FF9500" rx="2" />
              <text x="250" y="222" fontSize="8" textAnchor="middle" className="font-mono">O2 ({molesO2.toFixed(1)})</text>
              {/* Yield H2O */}
              <rect x="360" y={210 - yieldH2O * 15} width="40" height={yieldH2O * 15} fill="#10B981" rx="2" />
              <text x="380" y="222" fontSize="8" textAnchor="middle" className="font-mono">H2O ({yieldH2O.toFixed(1)})</text>

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Reaction Yield (2 H₂ + O₂ → 2 H₂O)</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Limiting reactant: {isH2Limiting ? 'H2' : 'O2'}</text>
            </svg>
          </div>
        );
      }



      case 'bio_cells': {
        const organelle = sliderVals['organelle'] !== undefined ? sliderVals['organelle'] : 1;
        const orgs = ["Nucleus", "Mitochondria", "Chloroplast", "Vacuole"];
        const activeName = orgs[organelle - 1];
        
        // ribosome dots
        const ribosomes = [
          {x: 100, y: 80}, {x: 120, y: 160}, {x: 150, y: 200}, {x: 160, y: 110},
          {x: 280, y: 70}, {x: 290, y: 210}, {x: 380, y: 150}, {x: 400, y: 90},
          {x: 220, y: 210}, {x: 90, y: 130}
        ];
        
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Outer cell wall (double boundary) */}
              <polygon points="120,35 380,35 455,140 380,245 120,245 45,140" fill="none" stroke="#A7F3D0" strokeWidth="6" strokeLinejoin="round" />
              <polygon points="120,38 380,38 452,140 380,242 120,242 48,140" fill="none" stroke="#10B981" strokeWidth="2.0" strokeLinejoin="round" />
              
              {/* Inner cell membrane */}
              <polygon points="123,43 377,43 447,140 377,237 123,237 53,140" fill="#F0FDF4" stroke="#6EE7B7" strokeWidth="1" strokeLinejoin="round" />
              
              {/* Cytoplasm ribosomes dots */}
              {ribosomes.map((r, i) => (
                <circle key={i} cx={r.x} cy={r.y} r="1.5" fill="#374151" opacity="0.6" />
              ))}
              
              {/* Large Central Vacuole */}
              <path 
                d="M 210,80 Q 250,70 270,90 Q 290,120 270,140 Q 240,150 200,130 Q 180,100 210,80 Z" 
                fill={organelle === 4 ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.06)"} 
                stroke="#3B82F6" 
                strokeWidth={organelle === 4 ? "2.5" : "1.2"} 
                className={organelle === 4 ? "animate-pulse" : ""}
              />
              <text x="235" y="110" fontSize="8" className="fill-blue-600/60 font-semibold text-center select-none font-sans">Vacuole</text>
              
              {/* Nucleus */}
              <g className={organelle === 1 ? "filter drop-shadow-[0_0_6px_rgba(99,102,241,0.4)]" : ""}>
                <circle 
                  cx="150" 
                  cy="150" 
                  r="34" 
                  fill={organelle === 1 ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.05)"} 
                  stroke="#6366F1" 
                  strokeWidth={organelle === 1 ? "3" : "1.5"} 
                  strokeDasharray="6,2" 
                />
                <circle cx="145" cy="145" r="11" fill="#4F46E5" opacity="0.85" />
                <path d="M 125,140 Q 135,135 140,145 T 160,135" fill="none" stroke="#818CF8" strokeWidth="1" />
                <path d="M 130,165 Q 145,160 155,168" fill="none" stroke="#818CF8" strokeWidth="1" />
                <text x="150" y="196" fontSize="7" className="fill-indigo-600/70 font-mono font-bold select-none text-center" textAnchor="middle">Nucleus</text>
              </g>

              {/* Mitochondria */}
              <g className={organelle === 2 ? "filter drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" : ""}>
                <ellipse 
                  cx="350" 
                  cy="90" 
                  rx="24" 
                  ry="12" 
                  transform="rotate(-15 350 90)" 
                  fill={organelle === 2 ? "rgba(245,158,11,0.25)" : "rgba(245,158,11,0.06)"} 
                  stroke="#F59E0B" 
                  strokeWidth={organelle === 2 ? "2.5" : "1.2"} 
                />
                <path 
                  d="M 332,90 Q 336,82 340,90 T 348,90 T 356,90 T 364,90 T 368,90" 
                  fill="none" 
                  stroke="#D97706" 
                  strokeWidth="1.5" 
                  transform="rotate(-15 350 90)" 
                />
                <text x="350" y="112" fontSize="7" className="fill-amber-600/80 font-mono font-bold select-none text-center" textAnchor="middle">Mitochondria</text>
              </g>

              {/* Chloroplast */}
              <g className={organelle === 3 ? "filter drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]" : ""}>
                <ellipse 
                  cx="340" 
                  cy="180" 
                  rx="26" 
                  ry="14" 
                  transform="rotate(10 340 180)" 
                  fill={organelle === 3 ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.06)"} 
                  stroke="#10B981" 
                  strokeWidth={organelle === 3 ? "2.5" : "1.2"} 
                />
                <g transform="rotate(10 340 180)">
                  <rect x="325" y="174" width="8" height="3" rx="0.5" fill="#047857" />
                  <rect x="325" y="179" width="8" height="3" rx="0.5" fill="#047857" />
                  <rect x="325" y="184" width="8" height="3" rx="0.5" fill="#047857" />
                  
                  <rect x="345" y="172" width="8" height="3" rx="0.5" fill="#047857" />
                  <rect x="345" y="177" width="8" height="3" rx="0.5" fill="#047857" />
                  <rect x="345" y="182" width="8" height="3" rx="0.5" fill="#047857" />
                  
                  <line x1="333" y1="179" x2="345" y2="179" stroke="#34D399" strokeWidth="1" />
                </g>
                <text x="340" y="205" fontSize="7" className="fill-emerald-600/80 font-mono font-bold select-none text-center" textAnchor="middle">Chloroplast</text>
              </g>

              {/* Dynamic Callout panel */}
              <rect x="20" y="225" width="220" height="38" rx="8" fill="rgba(0,0,0,0.02)" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
              <circle cx="35" cy="244" r="4" fill={
                organelle === 1 ? "#6366F1" : organelle === 2 ? "#F59E0B" : organelle === 3 ? "#10B981" : "#3B82F6"
              } />
              <text x="48" y="241" fontSize="8" fontWeight="bold" className="fill-black/85">Focus: {activeName}</text>
              <text x="48" y="252" fontSize="7" className="fill-black/50 font-sans">
                {organelle === 1 && "Contains cell DNA; controls replication and gene expression."}
                {organelle === 2 && "Synthesizes ATP energy via cellular aerobic respiration."}
                {organelle === 3 && "Converts solar light energy to chemical sugars (Photosynthesis)."}
                {organelle === 4 && "Large fluid-filled storage membrane maintaining turgor pressure."}
              </text>

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Plant Cell Highlight Maps</text>
            </svg>
          </div>
        );
      }

      case 'bio_dna': {
        const twists = sliderVals['twists'] !== undefined ? sliderVals['twists'] : 2;
        const helixPts1 = [], helixPts2 = [], basePairs = [];
        const steps = 38;
        
        for (let i = 0; i <= steps; i++) {
          const hx = 60 + i * 10.2;
          const angle = (i / steps) * twists * 2 * Math.PI;
          const y1 = 140 - Math.sin(angle) * 40;
          const y2 = 140 + Math.sin(angle) * 40;
          helixPts1.push(`${hx},${y1}`);
          helixPts2.push(`${hx},${y2}`);
          
          if (i % 2.5 === 0 || i === 0 || i === steps) {
            let pair = { x: hx, y1, y2, idx: i };
            const baseIndex = Math.floor(i) % 4;
            if (baseIndex === 0) {
              pair.left = 'A'; pair.right = 'T';
              pair.lColor = '#818CF8'; pair.rColor = '#FBBF24';
            } else if (baseIndex === 1) {
              pair.left = 'G'; pair.right = 'C';
              pair.lColor = '#34D399'; pair.rColor = '#60A5FA';
            } else if (baseIndex === 2) {
              pair.left = 'T'; pair.right = 'A';
              pair.lColor = '#FBBF24'; pair.rColor = '#818CF8';
            } else {
              pair.left = 'C'; pair.right = 'G';
              pair.lColor = '#60A5FA'; pair.rColor = '#34D399';
            }
            basePairs.push(pair);
          }
        }
        
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <defs>
                <linearGradient id="backbone-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4B5563" />
                  <stop offset="100%" stopColor="#9CA3AF" />
                </linearGradient>
              </defs>

              {basePairs.map((bp, idx) => {
                const midY = (bp.y1 + bp.y2) / 2;
                const isLeftHigher = bp.y1 < bp.y2;
                return (
                  <g key={idx}>
                    <line x1={bp.x} y1={bp.y1} x2={bp.x} y2={midY} stroke={bp.lColor} strokeWidth="4" strokeLinecap="round" />
                    <line x1={bp.x} y1={midY} x2={bp.x} y2={bp.y2} stroke={bp.rColor} strokeWidth="4" strokeLinecap="round" />
                    <line x1={bp.x} y1={midY - 4} x2={bp.x} y2={midY + 4} stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="1.5,1.2" />
                    <text x={bp.x} y={isLeftHigher ? bp.y1 + 12 : bp.y1 - 6} fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="#1F2937" className="font-mono">{bp.left}</text>
                    <text x={bp.x} y={isLeftHigher ? bp.y2 - 6 : bp.y2 + 12} fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="#1F2937" className="font-mono">{bp.right}</text>
                  </g>
                );
              })}

              <path d={`M ${helixPts1.join(' L ')}`} fill="none" stroke="url(#backbone-grad)" strokeWidth="4" strokeLinecap="round" />
              <path d={`M ${helixPts2.join(' L ')}`} fill="none" stroke="url(#backbone-grad)" strokeWidth="4" strokeLinecap="round" />
              
              {basePairs.map((bp, idx) => (
                <g key={`sph-${idx}`}>
                  <circle cx={bp.x} cy={bp.y1} r="3.5" fill="#374151" stroke="#F9FAFB" strokeWidth="1" />
                  <circle cx={bp.x} cy={bp.y2} r="3.5" fill="#374151" stroke="#F9FAFB" strokeWidth="1" />
                </g>
              ))}

              <g transform="translate(20, 205)">
                <rect x="0" y="0" width="310" height="55" rx="8" fill="rgba(0,0,0,0.02)" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
                <circle cx="15" cy="15" r="3.5" fill="#818CF8" />
                <text x="25" y="18" fontSize="7.5" className="font-sans fill-black/75">Adenine (A)</text>
                <circle cx="15" cy="35" r="3.5" fill="#34D399" />
                <text x="25" y="38" fontSize="7.5" className="font-sans fill-black/75">Guanine (G)</text>
                <circle cx="125" cy="15" r="3.5" fill="#FBBF24" />
                <text x="135" y="18" fontSize="7.5" className="font-sans fill-black/75">Thymine (T) <tspan className="fill-black/35 font-mono">[2 H-Bonds]</tspan></text>
                <circle cx="125" cy="35" r="3.5" fill="#60A5FA" />
                <text x="135" y="38" fontSize="7.5" className="font-sans fill-black/75">Cytosine (C) <tspan className="fill-black/35 font-mono">[3 H-Bonds]</tspan></text>
                <text x="235" y="28" fontSize="7" className="font-mono fill-black/40 leading-normal">
                  Sugar-Phosphate{"\n"}Backbone Strands
                </text>
              </g>

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">DNA Double Helix base pairings</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Twists: {twists}</text>
            </svg>
          </div>
        );
      }



      case 'bio_trophic': {
        const efficiency = sliderVals['efficiency'] !== undefined ? sliderVals['efficiency'] : 10.0;
        const eRatio = efficiency / 100;
        
        const levels = [
          { name: "Producers (e.g. Grass)", width: 320, color: "#10B981", energy: 10000 },
          { name: "Primary Consumers (e.g. Insects)", width: 220, color: "#FBBF24", energy: 10000 * eRatio },
          { name: "Secondary Consumers (e.g. Frogs)", width: 140, color: "#F97316", energy: 10000 * eRatio * eRatio },
          { name: "Apex Predators (e.g. Eagles)", width: 85, color: "#EF4444", energy: 10000 * eRatio * eRatio * eRatio }
        ];

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {levels.map((lvl, idx) => {
                const blockHeight = 35;
                const by = 210 - idx * (blockHeight + 6);
                const bx = 250 - lvl.width / 2;
                return (
                  <g key={idx}>
                    <rect 
                      x={bx} 
                      y={by} 
                      width={lvl.width} 
                      height={blockHeight} 
                      fill={`${lvl.color}15`} 
                      stroke={lvl.color} 
                      strokeWidth="1.8" 
                      rx="4" 
                    />
                    <text x="250" y={by + 16} textAnchor="middle" fontSize="8.5" fontWeight="bold" className="fill-gray-800">{lvl.name}</text>
                    <text x="250" y={by + 27} textAnchor="middle" fontSize="7.5" fontWeight="medium" className="fill-gray-500 font-mono">
                      Energy: {lvl.energy.toFixed(1)} J ({idx === 0 ? "100%" : `${Math.pow(efficiency, idx).toFixed(idx === 1 ? 1 : 2)}%`})
                    </text>
                  </g>
                );
              })}
              
              <line x1="385" y1="210" x2="385" y2="80" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 385,80 L 382,88 M 385,80 L 388,88" stroke="#9CA3AF" strokeWidth="1" />
              <text x="395" y="145" fontSize="7.5" className="fill-gray-500 font-mono font-bold leading-normal">
                ~{(100 - efficiency).toFixed(0)}% Energy Lost{"\n"}as metabolic heat
              </text>

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">10% Trophic Transfer Pyramid</text>
            </svg>
          </div>
        );
      }

      case 'bio_cardiac': {
        const bpm = sliderVals['bpm'] !== undefined ? sliderVals['bpm'] : 75;
        // Animation ticker: 1 cycle per beat
        const tCycle = 60 / bpm;
        const phaseT = isSimPlaying ? (simTime % tCycle) / tCycle : 0;
        
        // Diastole (filling ventricles): first 60% of cycle
        // Systole (pumping ventricles): last 40% of cycle
        const isSystole = phaseT > 0.6;
        
        // Ventricle contraction scale
        const vScale = isSystole ? 0.85 : 1.0;
        
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <defs>
                <marker id="arrow-blood-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0066CC" />
                </marker>
                <marker id="arrow-blood-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#FF3B30" />
                </marker>
              </defs>

              {/* Heart outer shadow outline */}
              <path d="M 250,70 C 180,60 130,120 130,170 C 130,220 200,250 250,260 C 300,250 370,220 370,170 C 370,120 320,60 250,70 Z" fill="rgba(239,68,68,0.03)" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />

              {/* Septum (middle wall) */}
              <line x1="250" y1="70" x2="250" y2="258" stroke="#A3A3A3" strokeWidth="6" />

              {/* RIGHT ATRIUM & VENTRICLE (Left side of diagram - deoxygenated blue) */}
              {/* Atrium (top left) */}
              <rect x="155" y="80" width="70" height="50" fill="rgba(0,102,204,0.06)" stroke="#0066CC" strokeWidth="1.5" rx="8" />
              <text x="190" y="110" fontSize="8" fontWeight="bold" className="fill-[#0066CC] font-sans">Right Atrium</text>
              
              {/* Ventricle (bottom left - contracts in systole) */}
              <g transform={`scale(${vScale}, 1.0) translate(${(1 - vScale) * 155}, 0)`}>
                <rect x="155" y="150" width="70" height="60" fill="rgba(0,102,204,0.12)" stroke="#0066CC" strokeWidth="2" rx="10" />
                <text x="190" y="185" fontSize="8" fontWeight="bold" className="fill-[#0066CC] font-sans">Right Ventricle</text>
              </g>

              {/* LEFT ATRIUM & VENTRICLE (Right side of diagram - oxygenated red) */}
              {/* Atrium (top right) */}
              <rect x="275" y="80" width="70" height="50" fill="rgba(255,59,48,0.06)" stroke="#FF3B30" strokeWidth="1.5" rx="8" />
              <text x="310" y="110" fontSize="8" fontWeight="bold" className="fill-[#FF3B30] font-sans">Left Atrium</text>

              {/* Ventricle (bottom right - contracts in systole) */}
              <g transform={`scale(${vScale}, 1.0) translate(${(1 - vScale) * 275}, 0)`}>
                <rect x="275" y="150" width="70" height="60" fill="rgba(255,59,48,0.12)" stroke="#FF3B30" strokeWidth="2" rx="10" />
                <text x="310" y="185" fontSize="8" fontWeight="bold" className="fill-[#FF3B30] font-sans">Left Ventricle</text>
              </g>

              {/* VALVES SYSTEM */}
              {/* Tricuspid Valve (left side AV) & Bicuspid Valve (right side AV) */}
              {/* Open in Diastole (downwards), Closed in Systole (horizontal blocking) */}
              {isSystole ? (
                <>
                  {/* Closed AV Valves */}
                  <line x1="155" y1="140" x2="225" y2="140" stroke="#FF9500" strokeWidth="2.5" />
                  <line x1="275" y1="140" x2="345" y2="140" stroke="#FF9500" strokeWidth="2.5" />
                  <text x="250" y="143" textAnchor="middle" fontSize="6.5" className="fill-amber-600 font-mono font-bold uppercase">AV Valves Closed</text>
                  
                  {/* Semilunar Valves Open (pointing up out of ventricles) */}
                  <line x1="170" y1="148" x2="162" y2="135" stroke="#10B981" strokeWidth="2" />
                  <line x1="210" y1="148" x2="218" y2="135" stroke="#10B981" strokeWidth="2" />
                  <line x1="290" y1="148" x2="282" y2="135" stroke="#10B981" strokeWidth="2" />
                  <line x1="330" y1="148" x2="338" y2="145" stroke="#10B981" strokeWidth="2" />
                  
                  {/* Blood ejection flow lines */}
                  <line x1="190" y1="160" x2="190" y2="70" stroke="#0066CC" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#arrow-blood-blue)" />
                  <line x1="310" y1="160" x2="310" y2="70" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#arrow-blood-red)" />
                </>
              ) : (
                <>
                  {/* Open AV Valves (pointing down) */}
                  <line x1="155" y1="140" x2="170" y2="149" stroke="#10B981" strokeWidth="2.5" />
                  <line x1="225" y1="140" x2="210" y2="149" stroke="#10B981" strokeWidth="2.5" />
                  <line x1="275" y1="140" x2="290" y2="149" stroke="#10B981" strokeWidth="2.5" />
                  <line x1="345" y1="140" x2="330" y2="149" stroke="#10B981" strokeWidth="2.5" />
                  
                  {/* Closed Semilunar Valves */}
                  <line x1="170" y1="148" x2="210" y2="148" stroke="#FF9500" strokeWidth="2" />
                  <line x1="290" y1="148" x2="330" y2="148" stroke="#FF9500" strokeWidth="2" />
                  <text x="250" y="152" textAnchor="middle" fontSize="6.5" className="fill-amber-600 font-mono font-bold uppercase">SL Valves Closed</text>
                  
                  {/* Blood filling flow lines */}
                  <line x1="190" y1="90" x2="190" y2="170" stroke="#0066CC" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#arrow-blood-blue)" />
                  <line x1="310" y1="90" x2="310" y2="170" stroke="#FF3B30" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#arrow-blood-red)" />
                </>
              )}

              <text x="250" y="228" textAnchor="middle" fontSize="10" fontWeight="bold" className="font-mono">
                {isSystole ? 'Systole: Ventricles Squeeze, SL Valves Open' : 'Diastole: Ventricles Relax & Fill, AV Valves Open'}
              </text>
              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Cardiac 4-Chamber Valve Cycle</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Heart Rate: {bpm} BPM</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-black/60">Cardiac Output: {(0.07 * bpm).toFixed(1)} L/min</text>
            </svg>
          </div>
        );
      }

      case 'bio_photosynthesis': {
        const light = sliderVals['light'] !== undefined ? sliderVals['light'] : 50;
        const rate = light * 0.45;
        const animOffset = isSimPlaying ? (simTime * 25) % 120 : 0;
        
        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              <defs>
                <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                </marker>
                <marker id="arrow-yellow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
                </marker>
                <marker id="arrow-gray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7280" />
                </marker>
              </defs>

              <ellipse cx="250" cy="140" rx="220" ry="115" fill="#F0FDF4" stroke="#059669" strokeWidth="2.5" />
              <ellipse cx="250" cy="140" rx="215" ry="110" fill="none" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="4,2" />
              <text x="250" y="48" fontSize="8" fontWeight="bold" textAnchor="middle" className="fill-emerald-800/60 font-mono tracking-widest">CHLOROPLAST STROMA</text>
              
              <g transform="translate(100, 140)">
                <ellipse cx="-20" cy="-25" rx="22" ry="7" fill="#047857" stroke="#065F46" strokeWidth="1" />
                <ellipse cx="-20" cy="-17" rx="22" ry="7" fill="#047857" stroke="#065F46" strokeWidth="1" />
                <ellipse cx="-20" cy="-9" rx="22" ry="7" fill="#059669" stroke="#065F46" strokeWidth="1" />
                
                <ellipse cx="10" cy="10" rx="22" ry="7" fill="#047857" stroke="#065F46" strokeWidth="1" />
                <ellipse cx="10" cy="18" rx="22" ry="7" fill="#047857" stroke="#065F46" strokeWidth="1" />
                <ellipse cx="10" cy="26" rx="22" ry="7" fill="#059669" stroke="#065F46" strokeWidth="1" />
                
                <line x1="-20" y1="-9" x2="10" y2="10" stroke="#34D399" strokeWidth="2.5" />
                
                <text x="-5" y="-38" fontSize="8.5" fontWeight="bold" textAnchor="middle" className="fill-emerald-900 font-serif">Light Reactions</text>
                <text x="-5" y="44" fontSize="7" className="fill-emerald-700/80 font-mono" textAnchor="middle">[Thylakoid Membrane]</text>
              </g>

              <g transform="translate(360, 140)">
                <circle cx="0" cy="0" r="45" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="4,2" />
                <path d="M 40,-20 A 45,45 0 0,1 40,20" fill="none" stroke="#059669" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
                <path d="M -40,20 A 45,45 0 0,1 -40,-20" fill="none" stroke="#059669" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
                
                <text x="0" y="-8" fontSize="9" fontWeight="bold" textAnchor="middle" className="fill-emerald-950 font-serif">Calvin</text>
                <text x="0" y="5" fontSize="9" fontWeight="bold" textAnchor="middle" className="fill-emerald-950 font-serif">Cycle</text>
                <text x="0" y="17" fontSize="7" className="fill-emerald-700/80 font-mono" textAnchor="middle">[Stroma Room]</text>
              </g>

              <g transform="translate(30, 45)">
                <path d="M 5,5 Q 25,18 45,35" fill="none" stroke="#FBBF24" strokeWidth="2" markerEnd="url(#arrow-yellow)" />
                <path d="M -5,15 Q 15,30 35,47" fill="none" stroke="#FBBF24" strokeWidth="1.5" markerEnd="url(#arrow-yellow)" />
                <text x="0" y="0" fontSize="8" fontWeight="bold" className="fill-amber-600 font-mono">LIGHT ({light} W/m²)</text>
              </g>

              <g transform="translate(20, 110)">
                <line x1="10" y1="5" x2="60" y2="25" stroke="#3B82F6" strokeWidth="1.8" markerEnd="url(#arrow-gray)" />
                <text x="5" y="0" fontSize="8.5" fontWeight="bold" className="fill-blue-600 font-mono">H₂O</text>
              </g>
              
              <g transform="translate(20, 185)">
                <line x1="60" y1="-25" x2="10" y2="-5" stroke="#EF4444" strokeWidth="1.8" markerEnd="url(#arrow-gray)" />
                <text x="0" y="8" fontSize="8.5" fontWeight="bold" className="fill-red-600 font-mono">O₂ (Product)</text>
              </g>

              <g transform="translate(435, 110)">
                <line x1="35" y1="5" x2="-15" y2="25" stroke="#6B7280" strokeWidth="1.8" markerEnd="url(#arrow-gray)" />
                <text x="38" y="0" fontSize="8.5" fontWeight="bold" className="fill-gray-600 font-mono">CO₂</text>
              </g>

              <g transform="translate(435, 185)">
                <line x1="-15" y1="-25" x2="35" y2="-5" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow-green)" />
                <text x="25" y="10" fontSize="8.5" fontWeight="bold" className="fill-emerald-700 font-mono">Glucose</text>
              </g>

              <path 
                d="M 140,110 Q 235,80 320,110" 
                fill="none" 
                stroke="#F59E0B" 
                strokeWidth="2.5" 
                strokeDasharray="4,4"
                markerEnd="url(#arrow-yellow)" 
              />
              <text x="235" y="90" fontSize="7.5" fontWeight="bold" textAnchor="middle" className="fill-amber-600 font-mono">ATP + NADPH (Energy)</text>
              {isSimPlaying && (
                <circle cx={140 + animOffset * 1.5} cy={110 - Math.sin((animOffset/120) * Math.PI) * 15} r="3" fill="#F59E0B" />
              )}

              <path 
                d="M 320,170 Q 235,200 140,170" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="1.8" 
                strokeDasharray="4,4"
                markerEnd="url(#arrow-gray)" 
              />
              <text x="235" y="196" fontSize="7.5" fontWeight="bold" textAnchor="middle" className="fill-blue-500 font-mono">ADP + NADP⁺ (Spent)</text>
              {isSimPlaying && (
                <circle cx={320 - animOffset * 1.5} cy={170 + Math.sin((animOffset/120) * Math.PI) * 15} r="2.5" fill="#3B82F6" />
              )}

              <g transform="translate(180, 240)">
                <rect x="0" y="0" width="140" height="30" rx="6" fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
                <text x="70" y="12" fontSize="7.5" fontWeight="bold" textAnchor="middle" className="fill-black/50">PHOTOSYNTHETIC RATE</text>
                <text x="70" y="24" fontSize="9.5" fontWeight="bold" textAnchor="middle" className="fill-emerald-600 font-mono">{rate.toFixed(2)} μmol O₂/m²/s</text>
              </g>

              <text x={20} y={30} fontSize="10" fontWeight="bold" className="font-serif">Photosynthesis pathway flow</text>
            </svg>
          </div>
        );
      }



      case 'bio_synapse': {
        const freq = sliderVals['freq'] !== undefined ? sliderVals['freq'] : 40;
        
        // Speed of diffusion based on impulse frequency
        const animSpeed = freq * 0.15;
        const animT = isSimPlaying ? (simTime * animSpeed) % 4.0 : 0;
        
        // Coordinates for diffusion dots
        const showDiffusing = animT > 1.0;
        const diffProgress = showDiffusing ? (animT - 1.0) / 2.0 : 0.0; // 0 to 1
        
        const receptors = [
          { x: 150, y: 195 },
          { x: 250, y: 185 },
          { x: 350, y: 195 }
        ];

        return (
          <div className="w-full flex flex-col items-center">
            <svg className="w-full h-[280px] bg-white border border-black/5 rounded-xl" viewBox="0 0 500 280">
              {/* Presynaptic Terminal bulb (top) */}
              <path d="M 100,20 L 100,70 C 100,120 400,120 400,70 L 400,20" fill="rgba(0,102,204,0.02)" stroke="#525252" strokeWidth="2.5" />
              <text x="250" y="45" textAnchor="middle" fontSize="7.5" className="fill-black/35 font-mono tracking-wider font-bold">PRESYNAPTIC TERMINAL</text>

              {/* Postsynaptic Membrane (bottom) */}
              <path d="M 80,220 C 80,170 420,170 420,220" fill="rgba(16,185,129,0.02)" stroke="#525252" strokeWidth="2.5" />
              <text x="250" y="240" textAnchor="middle" fontSize="7.5" className="fill-black/35 font-mono tracking-wider font-bold">POSTSYNAPTIC MEMBRANE</text>

              {/* Vesicles in presynaptic bulb */}
              {(!isSimPlaying || animT < 1.0) && (
                <>
                  <circle cx="160" cy="50" r="10" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,1" />
                  <circle cx="160" cy="50" r="2" fill="#F59E0B" />
                  <circle cx="157" cy="52" r="1.5" fill="#F59E0B" />
                  <circle cx="163" cy="48" r="1.5" fill="#F59E0B" />

                  <circle cx="340" cy="50" r="10" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,1" />
                  <circle cx="340" cy="50" r="2" fill="#F59E0B" />
                  <circle cx="337" cy="48" r="1.5" fill="#F59E0B" />
                  <circle cx="343" cy="52" r="1.5" fill="#F59E0B" />
                </>
              )}

              {/* Docking vesicle at the membrane */}
              {isSimPlaying && animT <= 1.0 && (
                <g transform={`translate(0, ${animT * 45})`}>
                  <circle cx="250" cy="50" r="10" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,1" />
                  <circle cx="247" cy="48" r="1.5" fill="#F59E0B" />
                  <circle cx="253" cy="52" r="1.5" fill="#F59E0B" />
                  <circle cx="250" cy="50" r="2" fill="#F59E0B" />
                </g>
              )}

              {/* Released neurotransmitters diffusing in cleft */}
              {showDiffusing && diffProgress < 1.0 && (
                <>
                  {/* Left-drifting molecules */}
                  <circle cx={250 - diffProgress * 90} cy={105 + diffProgress * 80} r="3" fill="#F59E0B" stroke="white" strokeWidth="0.5" />
                  {/* Center-drifting molecules */}
                  <circle cx="250" cy={105 + diffProgress * 80} r="3" fill="#F59E0B" stroke="white" strokeWidth="0.5" />
                  {/* Right-drifting molecules */}
                  <circle cx={250 + diffProgress * 90} cy={105 + diffProgress * 80} r="3" fill="#F59E0B" stroke="white" strokeWidth="0.5" />
                </>
              )}

              {/* Receptors Y-shape */}
              {receptors.map((rec, idx) => {
                const isBound = isSimPlaying && animT > 2.8;
                return (
                  <g key={idx}>
                    {/* Receptor stem and arms */}
                    <line x1={rec.x} y1={rec.y} x2={rec.x} y2={rec.y + 12} stroke={isBound ? "#10B981" : "#525252"} strokeWidth="2.2" />
                    <line x1={rec.x} y1={rec.y} x2={rec.x - 6} y2={rec.y - 8} stroke={isBound ? "#10B981" : "#525252"} strokeWidth="2.2" />
                    <line x1={rec.x} y1={rec.y} x2={rec.x + 6} y2={rec.y - 8} stroke={isBound ? "#10B981" : "#525252"} strokeWidth="2.2" />
                    
                    {/* Bound neurotransmitter dot */}
                    {isBound && (
                      <circle cx={rec.x} cy={rec.y - 4} r="2.5" fill="#F59E0B" stroke="white" strokeWidth="0.5" />
                    )}

                    {/* Action Potential wavy signal travelling down on bound */}
                    {isBound && (
                      <path 
                        d={`M ${rec.x},${rec.y + 16} Q ${rec.x - 5},${rec.y + 24} ${rec.x},${rec.y + 32} T ${rec.x},${rec.y + 48}`} 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="1.8" 
                        className="animate-pulse" 
                      />
                    )}
                  </g>
                );
              })}

              {/* Callout status text */}
              <text x="250" y="145" textAnchor="middle" fontSize="8.5" fontWeight="bold" className="fill-amber-700 font-mono">
                {(!isSimPlaying || animT < 1.0) && "Vesicles Docking..."}
                {isSimPlaying && animT >= 1.0 && animT <= 2.8 && "Neurotransmitters Diffusing..."}
                {isSimPlaying && animT > 2.8 && "Receptors Bound: Signal Fired!"}
              </text>

              <text x={20} y={40} fontSize="10" fontWeight="bold" className="font-serif">Synaptic Vesicle Cleft Channels</text>
              <text x={20} y={60} fontSize="9" className="font-mono fill-black/60">Impulse Frequency: {freq} Hz</text>
              <text x={20} y={75} fontSize="9" className="font-mono fill-black/60">Release Rate: {(freq * 0.15).toFixed(1)} vesicles/s</text>
            </svg>
          </div>
        );
      }



      // ----------------------------------------------------
      // FALLBACK TO COORDINATE PLOT
      // ----------------------------------------------------
      case 'function_plot':
      default:
        return renderFunctionPlot();
    }
  };

  const isAnimatedStyle = [
    'physics_projectile', 'physics_motion', 
    'physics_oscillations', 'physics_circuit', 
    'chem_states', 'bio_synapse', 'bio_cardiac'
  ].includes(topic.visualStyle);

  return (
    <Card variant="surface" className="p-0 border-black/5 shadow-md flex flex-col w-full h-full bg-white overflow-hidden">
      
      {/* 1. Device Header Frame */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-[#F8F8F6] border-b border-black/[0.06] gap-3">
        <div className="flex items-center gap-4">
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

        {/* 2. Mode Switch Tabs */}
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

      {/* 3. Main Content Container */}
      <div className="p-4 sm:p-6 bg-white flex-1 min-h-[390px] flex flex-col justify-between">
        
        {activeTab === 'visual' && (
          <div className="flex-1 flex flex-col">
            {renderVisualCanvas()}
            
            {/* Simulation Controls Overlay (Displays for animated visual styles) */}
            {isAnimatedStyle && (
              <div className="flex items-center justify-center gap-3 mt-4 px-3 py-1.5 rounded-xl bg-white border border-black/5 shadow-xs self-center">
                <button 
                  onClick={handleSimPlayPause}
                  className="w-8 h-8 rounded-full bg-[#0066CC] hover:bg-[#0057AA] text-white flex items-center justify-center border-none cursor-pointer active:scale-95 duration-100"
                  aria-label={isSimPlaying ? "Pause" : "Play"}
                >
                  {isSimPlaying ? <Pause size={13} fill="white" /> : <Play size={13} fill="white" className="ml-0.5" />}
                </button>
                <button 
                  onClick={handleSimReset}
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#525252] flex items-center justify-center border-none cursor-pointer active:scale-95 duration-100"
                  aria-label="Reset simulation"
                >
                  <RotateCcw size={13} />
                </button>
                <div className="h-4 w-[1px] bg-black/10" />
                <div className="font-mono text-[10px] text-[#525252] font-semibold">
                  t: <span className="text-[#0066CC]">{simTime.toFixed(2)}s</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab content: PROPERTIES INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-black/[0.04] pb-2">
                <Database size={14} className="text-[#0066CC]" />
                <h3 className="font-serif text-sm font-semibold text-[#0F0F0F] uppercase tracking-wider">Properties Inspector</h3>
              </div>

              {/* Inspector Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3.5 bg-[#FAFAF8] rounded-xl p-4 border border-black/5">
                  <h4 className="font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest">Active Metadata</h4>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#525252]">Subject Domain</span>
                    <span className="font-mono font-semibold text-[#0f0f0f] uppercase">{subject}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#525252]">Active Formula / Label</span>
                    <span className="font-mono font-semibold text-[#0f0f0f]">
                      {equation ? <MathRenderer text={equation} inline={true} /> : 'Static Diagram'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#525252]">Visual Style Map</span>
                    <span className="font-mono font-semibold text-[#0066CC] uppercase">{topic.visualStyle.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 bg-[#FAFAF8] rounded-xl p-4 border border-black/5">
                  <h4 className="font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest">Topic Properties</h4>
                  {topic.metadata && Object.keys(topic.metadata).map(metaKey => (
                    <div key={metaKey} className="flex justify-between items-center text-xs">
                      <span className="text-[#525252] capitalize">{metaKey.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono font-semibold text-[#0f0f0f]">{topic.metadata[metaKey]}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#525252]">Calculation Thread</span>
                    <span className="font-mono font-semibold text-[#10B981]">Local Client JVM</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-3 rounded-lg bg-black/[0.02] border border-black/5 text-[10px] text-[#525252] leading-normal">
              <strong>Interactive Calculation Note:</strong> Parameter values are synchronized instantly with the mathematical models on slide changes. Custom calculations are resolved in local client runtime threads.
            </div>
          </div>
        )}

        {/* Tab content: AI ENGINE LOGS */}
        {activeTab === 'logs' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-black/[0.04] pb-2">
                <FileText size={14} className="text-[#0066CC]" />
                <h3 className="font-serif text-sm font-semibold text-[#0F0F0F] uppercase tracking-wider">AI Inference Logs</h3>
              </div>

              {/* System JSON Prompt response */}
              <div className="bg-[#1E1E1E] text-[#D4D4D4] rounded-xl p-4 font-mono text-[11px] overflow-x-auto shadow-inner leading-relaxed max-h-[260px] scrollbar-thin">
                <div><span className="text-[#6A9955]">// AI STEM System prompt parse logs</span></div>
                <div><span className="text-[#569CD6]">const</span> responseSchema = &#123;</div>
                <div className="pl-4">query: <span className="text-[#CE9178]">"{topicKey}"</span>,</div>
                <div className="pl-4">subject: <span className="text-[#CE9178]">"{subject}"</span>,</div>
                <div className="pl-4">engine: <span className="text-[#CE9178]">"{topic.aiLogs?.model || 'STEM-v4.1-Inference'}"</span>,</div>
                <div className="pl-4">latency_ms: <span className="text-[#B5CEA8]">{topic.aiLogs?.latency_ms || 142}</span>,</div>
                <div className="pl-4">token_utilization: &#123; prompt: <span className="text-[#B5CEA8]">{topic.aiLogs?.tokens?.prompt || 1024}</span>, completion: <span className="text-[#B5CEA8]">{topic.aiLogs?.tokens?.completion || 512}</span> &#125;,</div>
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

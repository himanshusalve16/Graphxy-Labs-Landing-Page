import React, { useRef, useState } from 'react';
import Container from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import { ArrowRight, Layers, Cpu, Code, Monitor, Grid, GitMerge, LineChart, TrendingUp, Smartphone, ChevronDown, X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsTouch, useBreakpoint } from '../../utils/useDeviceType';

import { 
  ECOSYSTEM_TREE_DESKTOP_NODES, 
  ECOSYSTEM_TREE_MOBILE_NODES,
  validateNode,
  validateConnection
} from '../../data/ecosystemNodes';

const verticalsData = ECOSYSTEM_TREE_DESKTOP_NODES.filter(n => n.type === 'vertical').map(v => ({
  ...v,
  products: v.connections.filter(c => c.startsWith('p_'))
}));

const productsData = ECOSYSTEM_TREE_DESKTOP_NODES.filter(n => n.type === 'product');

const mobileVerticals = ECOSYSTEM_TREE_MOBILE_NODES.filter(n => n.type === 'vertical').map(v => ({
  ...v,
  products: v.connections.filter(c => c.startsWith('p_'))
}));

const mobileProducts = ECOSYSTEM_TREE_MOBILE_NODES.filter(n => n.type === 'product');

function MobileTreeGraph() {
  const [active, setActive] = useState(null); // { type, id }

  const tap = (type, id) => {
    setActive(prev => prev?.type === type && prev?.id === id ? null : { type, id });
  };
  const dismiss = (e) => {
    if (e.target === e.currentTarget) setActive(null);
  };

  const isPathActive = (fromId, toId) => {
    if (!active) return false;
    if (active.type === 'center') return true;

    // Check if it's a center-to-vertical line
    if (fromId === 'center') {
      const vId = toId;
      if (active.type === 'vertical') {
        return active.id === vId;
      }
      if (active.type === 'product') {
        const v = mobileVerticals.find(vv => vv.id === vId);
        return v ? v.products.includes(active.id) : false;
      }
    }

    // Check if it's a vertical-to-product line
    const vId = fromId;
    const pId = toId;
    if (active.type === 'vertical') {
      return active.id === vId && mobileVerticals.find(vv => vv.id === vId)?.products.includes(pId);
    }
    if (active.type === 'product') {
      return active.id === pId && mobileVerticals.find(vv => vv.id === vId)?.products.includes(active.id);
    }

    return false;
  };

  const isVertActive = (vId) => {
    if (!active) return false;
    if (active.type === 'center') return true;
    if (active.type === 'vertical' && active.id === vId) return true;
    if (active.type === 'product') {
      const v = mobileVerticals.find(vv => vv.id === vId);
      return v ? v.products.includes(active.id) : false;
    }
    return false;
  };

  const isProdActive = (pId) => {
    if (!active) return false;
    if (active.type === 'center') return true;
    if (active.type === 'product' && active.id === pId) return true;
    if (active.type === 'vertical') {
      const v = mobileVerticals.find(vv => vv.id === active.id);
      return v ? v.products.includes(pId) : false;
    }
    return false;
  };

  const panelContent = () => {
    if (!active) return null;
    if (active.type === 'center') {
      return (
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-[9px] text-[#1B3A6B] uppercase tracking-widest mb-1">Architectural Parent</span>
          <span className="font-serif text-base font-semibold text-[#0F0F0F]">Graphxy Labs</span>
          <span className="text-[11px] text-[#525252] mt-1">Unified hierarchical structure of products</span>
        </div>
      );
    }
    if (active.type === 'vertical') {
      const v = mobileVerticals.find(vv => vv.id === active.id);
      const connected = mobileProducts.filter(p => v?.products.includes(p.id));
      return (
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-mono text-[9px] text-black/40 uppercase tracking-widest">Vertical</span>
            <p className="font-serif text-sm font-semibold text-[#0F0F0F]">{v?.name}</p>
          </div>
          {connected.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {connected.map(p => (
                <Link key={p.id} to={p.link} style={{ touchAction: 'manipulation', backgroundColor: p.color + '14', borderColor: p.color + '30' }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold no-underline active:scale-95 transition-transform">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span style={{ color: p.color }}>{p.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
    if (active.type === 'product') {
      const p = mobileProducts.find(pp => pp.id === active.id);
      if (!p) return null;
      return (
        <div className="flex items-center justify-between gap-4 w-full">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: p.color }}>{p.tag}</span>
            <p className="font-serif text-sm font-semibold text-[#0F0F0F]">{p.name}</p>
            <p className="text-[11px] text-[#525252] mt-0.5">{p.description}</p>
          </div>
          <Link to={p.link} style={{ touchAction: 'manipulation', backgroundColor: p.color, color: '#fff' }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold no-underline flex-shrink-0 active:scale-95 transition-transform">
            View <ArrowRight size={12} />
          </Link>
        </div>
      );
    }
  };

  const centerR = 20;
  const nodeR = 16;
  const pW = 74;
  const pH = 28;

  return (
    <div className="relative w-full aspect-[360/340] select-none" onClick={dismiss}>
      <svg viewBox="0 0 360 340" className="w-full h-full" onClick={dismiss}>
        {/* L1 → L2 lines */}
        {mobileVerticals.map(v => {
          if (v.x === undefined || v.y === undefined || isNaN(v.x) || isNaN(v.y)) {
            return null;
          }
          const activePath = isPathActive('center', v.id);
          return (
            <line key={`cl-${v.id}`}
              x1="180" y1="30" x2={v.x} y2={v.y}
              stroke={activePath ? '#1B3A6B' : 'rgba(0,0,0,0.07)'}
              strokeWidth={activePath ? 1.8 : 1}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
            />
          );
        })}

        {/* L2 → L3 lines */}
        {mobileVerticals.map(v => v.products.map(pId => {
          const p = mobileProducts.find(pp => pp.id === pId);
          if (!p) return null;
          if (v.x === undefined || v.y === undefined || p.x === undefined || p.y === undefined || isNaN(v.x) || isNaN(v.y) || isNaN(p.x) || isNaN(p.y)) {
            return null;
          }
          const activePath = isPathActive(v.id, pId);
          return (
            <line key={`vpl-${v.id}-${pId}`}
              x1={v.x} y1={v.y} x2={p.x} y2={p.y}
              stroke={activePath ? p.color : 'rgba(0,0,0,0.07)'}
              strokeWidth={activePath ? 1.8 : 1}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
            />
          );
        }))}

        {/* L1 -> L2 Animation particles */}
        {mobileVerticals.map((v, i) => {
          if (v.x === undefined || v.y === undefined || isNaN(v.x) || isNaN(v.y)) {
            return null;
          }
          const activePath = isPathActive('center', v.id);
          return (
            <motion.circle key={`dp1-${v.id}`}
              r={1.5} fill="#1B3A6B" opacity={activePath ? 0.6 : 0.2}
              animate={{ cx: [180, v.x], cy: [30, v.y] }}
              transition={{ duration: 3.5 + i * 0.2, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
            />
          );
        })}

        {/* L2 -> L3 Animation particles */}
        {mobileVerticals.map(v => v.products.map((pId, idx) => {
          const p = mobileProducts.find(pp => pp.id === pId);
          if (!p) return null;
          if (v.x === undefined || v.y === undefined || p.x === undefined || p.y === undefined || isNaN(v.x) || isNaN(v.y) || isNaN(p.x) || isNaN(p.y)) {
            return null;
          }
          const activePath = isPathActive(v.id, pId);
          return (
            <motion.circle key={`dp2-${v.id}-${pId}`}
              r={1.5} fill={p.color} opacity={activePath ? 0.6 : 0.2}
              animate={{ cx: [v.x, p.x], cy: [v.y, p.y] }}
              transition={{ duration: 4.5 + idx * 0.3, repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
            />
          );
        }))}

        {/* LEVEL 1 Center badge */}
        <motion.g whileTap={{ scale: 0.94 }} onClick={e => { e.stopPropagation(); tap('center', 'center'); }} className="cursor-pointer">
          <rect x="130" y="14" width="100" height="32" rx="9" fill="#1B3A6B" />
          <rect x="126" y="10" width="108" height="40" rx="13" fill="none" stroke="#1B3A6B" strokeWidth="1" opacity={0.15} className="animate-pulse" style={{ animationDuration: '3s' }} />
          <rect x="120" y="4" width="120" height="52" rx="16" fill="transparent" />
          <text x="180" y="33" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="serif" letterSpacing="0.5">GXY LABS</text>
        </motion.g>

        {/* LEVEL 2 Vertical nodes */}
        {mobileVerticals.map(v => {
          if (v.x === undefined || v.y === undefined || isNaN(v.x) || isNaN(v.y)) return null;
          const IconComp = v.icon;
          const on = isVertActive(v.id);
          const selected = active?.id === v.id && active?.type === 'vertical';
          return (
            <motion.g key={v.id} whileTap={{ scale: 0.93 }} onClick={e => { e.stopPropagation(); tap('vertical', v.id); }} className="cursor-pointer">
              <circle cx={v.x} cy={v.y} r={on ? nodeR + 3 : nodeR}
                fill={on ? '#EEF3FB' : '#FFFFFF'}
                stroke={on ? '#1B3A6B' : 'rgba(0,0,0,0.1)'}
                strokeWidth={selected ? 2 : 1}
                style={{ transition: 'all 0.18s' }}
              />
              <circle cx={v.x} cy={v.y} r="28" fill="transparent" />
              <foreignObject x={v.x - 7.5} y={v.y - 7.5} width="15" height="15" className="pointer-events-none">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: on ? '#1B3A6B' : 'rgba(0,0,0,0.35)' }}>
                  {IconComp && <IconComp size={10} strokeWidth={2.5} />}
                </div>
              </foreignObject>
              <text x={v.x} y={v.y + 25} textAnchor="middle"
                fontSize="8" fontWeight={on ? '700' : '500'}
                fill={on ? '#0F0F0F' : 'rgba(0,0,0,0.35)'}
                style={{ transition: 'fill 0.18s' }}
              >
                {v.name}
              </text>
            </motion.g>
          );
        })}

        {/* LEVEL 3 Product nodes */}
        {mobileProducts.map(p => {
          if (p.x === undefined || p.y === undefined || isNaN(p.x) || isNaN(p.y)) return null;
          const on = isProdActive(p.id);
          const selected = active?.id === p.id && active?.type === 'product';
          return (
            <motion.g key={p.id} whileTap={{ scale: 0.95 }} onClick={e => { e.stopPropagation(); tap('product', p.id); }} className="cursor-pointer">
              <rect
                x={p.x - pW / 2} y={p.y - pH / 2}
                width={pW} height={pH} rx={9}
                fill={on ? p.color : '#FFFFFF'}
                stroke={on ? p.color : 'rgba(0,0,0,0.08)'}
                strokeWidth={selected ? 2 : 1}
                style={{ transition: 'all 0.18s', filter: on ? 'drop-shadow(0 2px 6px ' + p.color + '33)' : 'none' }}
              />
              <rect x={p.x - pW / 2 - 8} y={p.y - pH / 2 - 8} width={pW + 16} height={pH + 16} rx={12} fill="transparent" />
              <circle cx={p.x - pW / 2 + 10} cy={p.y} r={3} fill={on ? 'rgba(255,255,255,0.8)' : p.color} style={{ transition: 'fill 0.18s' }} />
              <text
                x={p.x + 4} y={p.y + 3.5}
                textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="serif"
                fill={on ? '#FFFFFF' : '#0F0F0F'}
                style={{ transition: 'fill 0.18s' }}
              >
                {p.name}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Slide-up detail panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-black/[0.05] rounded-b-2xl px-4 py-3 shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">{panelContent()}</div>
              <button
                onClick={() => setActive(null)}
                style={{ touchAction: 'manipulation' }}
                className="w-7 h-7 rounded-full bg-black/[0.05] flex items-center justify-center flex-shrink-0 active:bg-black/10 transition-colors mt-0.5"
                aria-label="Dismiss"
              >
                <X size={13} className="text-black/50" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SVG TREE — Desktop hover / Tablet click
// ──────────────────────────────────────────────────────────────
function SvgTree({ isTouch }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  const handleEnter = (id) => { if (!isTouch) setHoveredNode(id); };
  const handleLeave = () => { if (!isTouch) setHoveredNode(null); };
  const handleClick = (id) => {
    if (isTouch) setHoveredNode(prev => prev === id ? null : id);
  };

  const isLinkActive = (nId1, nId2) => {
    if (!hoveredNode) return false;
    if (hoveredNode === 'center') return true;
    if (hoveredNode === nId1 || hoveredNode === nId2) return true;
    return false;
  };

  // Larger nodes on tablet for better touch targets
  const nodeR = isTouch ? 17 : 13;

  return (
    <div className="w-full aspect-[600/290] relative">
      <svg viewBox="0 0 600 290" className="w-full h-full select-none">
        {/* L1 → L2 lines */}
        {verticalsData.map(v => {
          if (v.x === undefined || v.y === undefined || isNaN(v.x) || isNaN(v.y)) {
            return null;
          }
          const active = isLinkActive('center', v.id);
          return (
            <line key={`l1-l2-${v.id}`}
              x1="300" y1="35" x2={v.x} y2={v.y}
              stroke={active ? '#1B3A6B' : 'rgba(0,0,0,0.06)'}
              strokeWidth={active ? 1.5 : 1}
              className="transition-colors duration-150"
            />
          );
        })}

        {/* L2 → L3 lines */}
        {verticalsData.map(v =>
          v.products.map(pId => {
            const p = productsData.find(prod => prod.id === pId);
            if (!p) return null;
            if (v.x === undefined || v.y === undefined || p.x === undefined || p.y === undefined || isNaN(v.x) || isNaN(v.y) || isNaN(p.x) || isNaN(p.y)) {
              return null;
            }
            const active = isLinkActive(v.id, p.id);
            return (
              <line key={`l2-l3-${v.id}-${p.id}`}
                x1={v.x} y1={v.y} x2={p.x} y2={p.y}
                stroke={active ? p.color : 'rgba(0,0,0,0.06)'}
                strokeWidth={active ? 1.5 : 1}
                className="transition-colors duration-150"
              />
            );
          })
        )}

        {/* LEVEL 1: GXY LABS */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => handleEnter('center')}
          onMouseLeave={handleLeave}
          onClick={() => handleClick('center')}
        >
          <rect x="250" y="10" width="100" height="36" rx="10" fill="#1B3A6B" />
          <rect x="246" y="6" width="108" height="44" rx="14" fill="none" stroke="#1B3A6B" strokeWidth="1" className="opacity-15 animate-pulse" />
          {isTouch && <rect x="240" y="2" width="120" height="52" rx="16" fill="transparent" />}
          <text x="300" y="31" textAnchor="middle" fill="#FFFFFF" className="font-serif text-[10px] font-bold tracking-wide">GXY LABS</text>
        </g>

        {/* LEVEL 2: Verticals */}
        {verticalsData.map(v => {
          if (v.x === undefined || v.y === undefined || isNaN(v.x) || isNaN(v.y)) return null;
          const IconComp = v.icon;
          const isSelected = hoveredNode === v.id || hoveredNode === 'center';
          return (
            <g key={v.id} className="cursor-pointer"
              onMouseEnter={() => handleEnter(v.id)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(v.id)}
            >
              <circle cx={v.x} cy={v.y} r={nodeR} fill={isSelected ? '#EEF3FB' : '#FFFFFF'} stroke={isSelected ? '#1B3A6B' : 'rgba(0,0,0,0.08)'} strokeWidth="1.2" className="transition-all duration-150" />
              {/* Larger invisible hit area on touch */}
              {isTouch && <circle cx={v.x} cy={v.y} r="28" fill="transparent" />}
              <foreignObject x={v.x - 7} y={v.y - 7} width="14" height="14" className="pointer-events-none">
                <div className={`flex items-center justify-center w-full h-full ${isSelected ? 'text-[#1B3A6B]' : 'text-black/40'}`}>
                  {IconComp && <IconComp size={9} strokeWidth={2.5} />}
                </div>
              </foreignObject>
              <text x={v.x} y={v.y + 28} textAnchor="middle"
                className={`font-sans text-[7.5px] font-semibold tracking-tight transition-all duration-150 ${isSelected ? 'fill-black font-bold' : 'fill-black/40'}`}
              >
                {v.name}
              </text>
            </g>
          );
        })}

        {/* LEVEL 3: Products */}
        {productsData.map(p => {
          if (p.x === undefined || p.y === undefined || isNaN(p.x) || isNaN(p.y)) return null;
          const isSelected = hoveredNode === p.id || (hoveredNode && verticalsData.find(v => v.id === hoveredNode && v.products.includes(p.id)));
          return (
            <g key={p.id} className="cursor-pointer"
              onMouseEnter={() => handleEnter(p.id)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(p.id)}
            >
              <rect x={p.x - 45} y={p.y - 15} width="90" height="30" rx="9" fill="#FFFFFF" stroke={isSelected ? p.color : 'rgba(0,0,0,0.07)'} strokeWidth={isSelected ? 2 : 1} className="shadow-sm transition-all duration-150" />
              {isTouch && <rect x={p.x - 55} y={p.y - 25} width="110" height="50" rx="12" fill="transparent" />}
              <circle cx={p.x - 30} cy={p.y} r="3" fill={p.color} />
              <text x={p.x + 8} y={p.y + 3.5} textAnchor="middle" fill="#0F0F0F" className="font-serif text-[9.5px] font-bold">{p.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// MAIN SECTION
// ──────────────────────────────────────────────────────────────
export default function EcosystemTree() {
  const isTouch = useIsTouch();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAFAF8] border-b border-black/[0.06] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#1B3A6B]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808026_1px,transparent_1px),linear-gradient(to_bottom,#80808026_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Architectural Structure"
          heading="A unified ecosystem engineered for distinct industries."
          description="Graphxy Labs operates as the core architectural parent. We design and launch focused product divisions that address math visualization, confidential execution infrastructure, restaurant automation, and startup logistics."
        />

        {/* Hierarchy Visualization */}
        <div data-reveal className="mt-10 max-w-4xl mx-auto flex flex-col items-center bg-white border border-black/5 rounded-2xl p-5 sm:p-6 shadow-xs overflow-hidden">
          <div className="w-full flex justify-between items-center text-[9px] font-mono text-black/45 border-b border-black/[0.04] pb-3 mb-4 gap-2">
            <span className="flex-shrink-0">LABS HIERARCHICAL SCHEMA</span>
            <span className="text-[#1B3A6B] font-bold text-right truncate">
              {isMobile ? 'TAP VERTICALS TO EXPLORE' : isTouch ? 'TAP NODES TO HIGHLIGHT' : 'HOVER NODES TO HIGHLIGHT RELATIONSHIPS'}
            </span>
          </div>

          {isMobile ? (
            <MobileTreeGraph />
          ) : (
            <SvgTree isTouch={isTouch} />
          )}
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl mt-10 sm:mt-12 mx-auto">
          {/* Graphzy */}
          <Card variant="surface" className="p-5 bg-white border-[#0066CC]/10 flex flex-col justify-between active:scale-[0.98] hover:border-[#0066CC]/30 hover:shadow-md transition-all duration-200 text-left touch-press">
            <div>
              <div className="flex justify-between items-start mb-4">
                <Tag variant="math">COMING SOON</Tag>
                <span className="font-mono text-[8px] text-[#A3A3A3]">EST. 2026</span>
              </div>
              <h4 className="font-serif text-lg text-[#0F0F0F] mb-1.5 font-semibold">Graphzy</h4>
              <p className="text-[11.5px] text-[#525252] leading-relaxed mb-4">
                AI-Powered STEM Visualizer translating natural language queries into interactive mathematical models, physics trajectory simulations, and 2D chemical structures.
              </p>
              <div className="border-t border-black/[0.04] pt-3 mb-5">
                <span className="font-mono text-[8px] text-black/45 uppercase tracking-wider block mb-2">Capabilities</span>
                <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#0066CC]" />AI Simulation Generator</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#0066CC]" />2D Chemistry structures</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#0066CC]" />Interactive physics models</li>
                </ul>
              </div>
            </div>
            <Link to="/graphzy" className="mt-auto block" style={{ touchAction: 'manipulation' }}>
              <Button variant="graphzy" className="w-full flex items-center justify-center gap-1 text-xs py-2.5">
                Explore Graphzy <ArrowRight size={12} />
              </Button>
            </Link>
          </Card>

          {/* Clampbox */}
          <Card variant="surface" className="p-5 bg-[#F0F7F7] border-[#0D9488]/14 flex flex-col justify-between active:scale-[0.98] hover:border-[#0D9488]/30 hover:shadow-md transition-all duration-200 text-left touch-press">
            <div>
              <div className="flex justify-between items-start mb-4">
                <Tag variant="clampbox">COMING SOON</Tag>
                <span className="font-mono text-[8px] text-[#A3A3A3]">EST. 2026</span>
              </div>
              <h4 className="font-serif text-lg text-[#0F0F0F] mb-1.5 font-semibold">Clampbox</h4>
              <p className="text-[11.5px] text-[#525252] leading-relaxed mb-4">
                Confidential execution infrastructure for AI, agents, and sensitive workloads, running workloads in hardware-enforced isolated CPU enclaves.
              </p>
              <div className="border-t border-black/[0.04] pt-3 mb-5">
                <span className="font-mono text-[8px] text-black/45 uppercase tracking-wider block mb-2">Capabilities</span>
                <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#0D9488]" />Isolated runtime enclaves</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#0D9488]" />Zero-knowledge agent execution</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#0D9488]" />Encrypted-in-use memory</li>
                </ul>
              </div>
            </div>
            <Link to="/clampbox" className="mt-auto block" style={{ touchAction: 'manipulation' }}>
              <Button variant="clampbox" className="w-full flex items-center justify-center gap-1 text-xs py-2.5">
                Explore Clampbox <ArrowRight size={12} />
              </Button>
            </Link>
          </Card>

          {/* Forkline */}
          <Card variant="surface" className="p-5 bg-[#FEF7EC] border-[#B45309]/14 flex flex-col justify-between active:scale-[0.98] hover:border-[#B45309]/30 hover:shadow-md transition-all duration-200 text-left touch-press">
            <div>
              <div className="flex justify-between items-start mb-4">
                <Tag variant="forkline">COMING SOON</Tag>
                <span className="font-mono text-[8px] text-[#A3A3A3]">EST. 2026</span>
              </div>
              <h4 className="font-serif text-lg text-[#0F0F0F] mb-1.5 font-semibold">Forkline</h4>
              <p className="text-[11.5px] text-[#525252] leading-relaxed mb-4">
                Restaurant management and operational intelligence platform designed to sync floor seating layouts, order ticketing, and kitchen task workflows.
              </p>
              <div className="border-t border-black/[0.04] pt-3 mb-5">
                <span className="font-mono text-[8px] text-black/45 uppercase tracking-wider block mb-2">Capabilities</span>
                <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#92400E]" />POS & seating layout status</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#92400E]" />Kitchen workflow displays</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#92400E]" />Multi-location operational data</li>
                </ul>
              </div>
            </div>
            <Link to="/forkline" className="mt-auto block" style={{ touchAction: 'manipulation' }}>
              <Button variant="forkline" className="w-full flex items-center justify-center gap-1 text-xs py-2.5">
                Explore Forkline <ArrowRight size={12} />
              </Button>
            </Link>
          </Card>

          {/* Lattice */}
          <Card variant="surface" className="p-5 bg-white border-[#1B3A6B]/10 flex flex-col justify-between active:scale-[0.98] hover:border-[#1B3A6B]/30 hover:shadow-md transition-all duration-200 text-left touch-press">
            <div>
              <div className="flex justify-between items-start mb-4">
                <Tag variant="brand">COMING SOON</Tag>
                <span className="font-mono text-[8px] text-[#A3A3A3]">EST. 2026</span>
              </div>
              <h4 className="font-serif text-lg text-[#0F0F0F] mb-1.5 font-semibold">Lattice</h4>
              <p className="text-[11.5px] text-[#525252] leading-relaxed mb-4">
                Structured workspace for startup execution and operational clarity, consolidating fundraising trackers, runway logs, and team coordination workflows.
              </p>
              <div className="border-t border-black/[0.04] pt-3 mb-5">
                <span className="font-mono text-[8px] text-black/45 uppercase tracking-wider block mb-2">Capabilities</span>
                <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[11px] text-[#525252]">
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#1B3A6B]" />Funding & Investor Tracker CRM</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#1B3A6B]" />KPI Tracking & Runway Logs</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#1B3A6B]" />Pitch Deck & Dilution Modeling</li>
                </ul>
              </div>
            </div>
            <Link to="/lattice" className="mt-auto block" style={{ touchAction: 'manipulation' }}>
              <Button variant="brand" className="w-full flex items-center justify-center gap-1 text-xs py-2.5">
                Explore Lattice <ArrowRight size={12} />
              </Button>
            </Link>
          </Card>
        </div>
      </Container>
    </section>
  );
}

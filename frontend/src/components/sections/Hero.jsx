import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../layout/Container';
import PageBackground from '../layout/PageBackground';
import { Card } from '../ui/Card';
import { Layers, Monitor, Cpu, LineChart, Code, GitMerge, Smartphone, Grid, ArrowRight, X } from 'lucide-react';
import { useIsTouch, useBreakpoint } from '../../utils/useDeviceType';
import { 
  VERTICALS, 
  PRODUCTS, 
  buildRadialPositions,
  HERO_SCATTER_NODES,
  validateNode,
  validateConnection
} from '../../data/ecosystemNodes';

// ─── Radial Ecosystem Graph ───────────────────────────────────────────────────
// Used on mobile AND tablet. Switches to touch interaction model (tap → panel).

const MOBILE_CFG = { viewBox: '0 0 400 330', cx: 200, cy: 170, innerR: 82, outerR: 130, nodeR: 17, centerR: 26, hitR: 32, centerHitR: 46, pW: 68, pH: 28, pHW: 84, pHH: 46 };
const TABLET_CFG = { viewBox: '0 0 560 370', cx: 280, cy: 190, innerR: 104, outerR: 148, nodeR: 17, centerR: 28, hitR: 30, centerHitR: 46, pW: 72, pH: 30, pHW: 92, pHH: 48 };

function RadialGraph({ cfg }) {
  const [active, setActive] = useState(null); // { type: 'center'|'vertical'|'product', id }

  const { verts, prods } = buildRadialPositions(cfg);
  const { cx, cy, nodeR, centerR, hitR, centerHitR, pW, pH, pHW, pHH } = cfg;

  const tap = (type, id) => setActive(prev => prev?.type === type && prev?.id === id ? null : { type, id });
  const dismiss = (e) => { if (e.target === e.currentTarget) setActive(null); };

  // Decide if a path is "active" (highlighted)
  const pathActive = (id1, id2) => {
    if (!active) return false;
    if (active.type === 'center') return true;
    if (active.type === 'vertical') {
      if (id1 === active.id || id2 === active.id) return true;
      const connectedProd = PRODUCTS.find(p => p.connects.includes(active.id));
      if (connectedProd && (id1 === connectedProd.id || id2 === connectedProd.id)) return true;
    }
    if (active.type === 'product') {
      const prod = PRODUCTS.find(p => p.id === active.id);
      if (prod) {
        if (id1 === prod.id || id2 === prod.id) return true;
        if (prod.connects.includes(id1) || prod.connects.includes(id2)) return true;
      }
    }
    return false;
  };

  const isVertActive = (vId) => {
    if (!active) return false;
    if (active.type === 'center') return true;
    if (active.type === 'vertical' && active.id === vId) return true;
    if (active.type === 'product') return PRODUCTS.find(p => p.id === active.id)?.connects.includes(vId);
    return false;
  };

  const isProdActive = (pId) => {
    if (!active) return false;
    if (active.type === 'center') return true;
    if (active.type === 'product' && active.id === pId) return true;
    if (active.type === 'vertical') return PRODUCTS.find(p => p.id === pId)?.connects.includes(active.id);
    return false;
  };

  // Detail panel content
  const panelContent = () => {
    if (!active) return null;
    if (active.type === 'center') {
      return (
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-[9px] text-[#1B3A6B] uppercase tracking-widest mb-1">Engineering Studio</span>
          <span className="font-serif text-base font-semibold text-[#0F0F0F]">Graphxy Labs</span>
          <span className="text-[11px] text-[#525252] mt-1">8 Core Engineering Services</span>
        </div>
      );
    }
    if (active.type === 'vertical') {
      const v = VERTICALS.find(v => v.id === active.id);
      const connected = PRODUCTS.filter(p => p.connects.includes(active.id));
      return (
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-mono text-[9px] text-black/40 uppercase tracking-widest">Specialization</span>
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
      const p = PRODUCTS.find(p => p.id === active.id);
      if (!p) return null;
      return (
        <div className="flex items-center justify-between gap-4 w-full">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: p.color }}>{p.status}</span>
            <p className="font-serif text-sm font-semibold text-[#0F0F0F]">{p.name}</p>
            <p className="text-[11px] text-[#525252] mt-0.5">{p.description}</p>
          </div>
          <Link to={p.link} style={{ touchAction: 'manipulation', backgroundColor: p.color, color: '#fff' }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold no-underline flex-shrink-0 active:scale-95 transition-transform">
            Explore <ArrowRight size={12} />
          </Link>
        </div>
      );
    }
  };

  return (
    <div className="relative w-full" onClick={dismiss}>
      <svg
        viewBox={cfg.viewBox}
        className="w-full h-auto select-none"
        onClick={dismiss}
      >
        {/* Center → Vertical lines */}
        {verts.map(v => {
          if (cx === undefined || cy === undefined || v.rx === undefined || v.ry === undefined || isNaN(cx) || isNaN(cy) || isNaN(v.rx) || isNaN(v.ry)) {
            if (import.meta.env.DEV) console.warn(`Missing coordinates for center-vertical connection to ${v.id}`);
            return null;
          }
          const on = pathActive('center', v.id);
          return (
            <line key={`cl-${v.id}`}
              x1={cx} y1={cy} x2={v.rx} y2={v.ry}
              stroke={on ? '#1B3A6B' : 'rgba(0,0,0,0.07)'}
              strokeWidth={on ? 1.8 : 1}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
            />
          );
        })}

        {/* Vertical → Product lines */}
        {PRODUCTS.map(p => p.connects.map(vId => {
          const v = verts.find(vv => vv.id === vId);
          if (!v) return null;
          const prod = prods.find(pp => pp.id === p.id);
          if (!prod) return null;
          if (v.rx === undefined || v.ry === undefined || prod.rx === undefined || prod.ry === undefined || isNaN(v.rx) || isNaN(v.ry) || isNaN(prod.rx) || isNaN(prod.ry)) {
            if (import.meta.env.DEV) console.warn(`Missing coordinates for vertical-product connection: ${vId} -> ${p.id}`);
            return null;
          }
          const on = pathActive(vId, p.id);
          return (
            <line key={`vpl-${vId}-${p.id}`}
              x1={v.rx} y1={v.ry} x2={prod.rx} y2={prod.ry}
              stroke={on ? p.color : 'rgba(0,0,0,0.07)'}
              strokeWidth={on ? 1.8 : 1}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
            />
          );
        }))}

        {/* Animated data particles on all lines */}
        {verts.map((v, i) => {
          if (cx === undefined || cy === undefined || v.rx === undefined || v.ry === undefined || isNaN(cx) || isNaN(cy) || isNaN(v.rx) || isNaN(v.ry)) {
            return null;
          }
          return (
            <motion.circle key={`dp-${v.id}`}
              r={1.5} fill="#1B3A6B" opacity={0.25}
              animate={{ cx: [cx, v.rx], cy: [cy, v.ry] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
            />
          );
        })}

        {/* CENTER NODE */}
        {cx !== undefined && cy !== undefined && !isNaN(cx) && !isNaN(cy) && (
          <motion.g whileTap={{ scale: 0.94 }} onClick={e => { e.stopPropagation(); tap('center', 'center'); }} className="cursor-pointer">
            <circle cx={cx} cy={cy} r={centerR} fill="#1B3A6B" />
            <circle cx={cx} cy={cy} r={centerR + 7} fill="none" stroke="#1B3A6B" strokeWidth={1} opacity={0.15} className="animate-pulse" style={{ animationDuration: '3s' }} />
            {/* Hit area */}
            <circle cx={cx} cy={cy} r={centerHitR} fill="transparent" />
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="700" fontFamily="serif" letterSpacing="0.5">GXY LABS</text>
          </motion.g>
        )}

        {/* VERTICAL NODES */}
        {verts.map((v) => {
          if (v.rx === undefined || v.ry === undefined || isNaN(v.rx) || isNaN(v.ry)) return null;
          const IconComp = v.icon;
          const on = isVertActive(v.id);
          const selected = active?.id === v.id && active?.type === 'vertical';
          return (
            <motion.g key={v.id} whileTap={{ scale: 0.93 }} onClick={e => { e.stopPropagation(); tap('vertical', v.id); }} className="cursor-pointer">
              <circle cx={v.rx} cy={v.ry} r={on ? nodeR + 3 : nodeR}
                fill={on ? '#EEF3FB' : '#FFFFFF'}
                stroke={on ? '#1B3A6B' : 'rgba(0,0,0,0.1)'}
                strokeWidth={selected ? 2 : 1}
                style={{ transition: 'all 0.18s' }}
              />
              {/* Hit area */}
              <circle cx={v.rx} cy={v.ry} r={hitR} fill="transparent" />
              <foreignObject x={v.rx - 8} y={v.ry - 8} width={16} height={16} className="pointer-events-none">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: on ? '#1B3A6B' : 'rgba(0,0,0,0.35)' }}>
                  {IconComp && <IconComp size={11} strokeWidth={2.5} />}
                </div>
              </foreignObject>
              {/* Label — full name, radiating outward, positioned to avoid overlap or crossing connection lines */}
              {cx !== undefined && cy !== undefined && (() => {
                const dx = v.rx - cx;
                const dy = v.ry - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ux = dist > 0 ? dx / dist : 0;
                const uy = dist > 0 ? dy / dist : 0;
                
                const textOffset = on ? nodeR + 11 : nodeR + 8;
                const tx = v.rx + ux * textOffset;
                const ty = v.ry + uy * textOffset + 2.5;

                let anchor = "middle";
                if (ux > 0.3) {
                  anchor = "start";
                } else if (ux < -0.3) {
                  anchor = "end";
                }

                return (
                  <text
                    x={tx}
                    y={ty}
                    textAnchor={anchor}
                    fontSize="8.5"
                    fontWeight={on ? '700' : '500'}
                    fill={on ? '#0F0F0F' : 'rgba(0,0,0,0.45)'}
                    style={{ transition: 'fill 0.18s' }}
                  >
                    {v.name}
                  </text>
                );
              })()}
            </motion.g>
          );
        })}

        {/* PRODUCT NODES */}
        {prods.map((p) => {
          if (p.rx === undefined || p.ry === undefined || isNaN(p.rx) || isNaN(p.ry)) return null;
          const on = isProdActive(p.id);
          const selected = active?.id === p.id && active?.type === 'product';
          return (
            <motion.g key={p.id} whileTap={{ scale: 0.95 }} onClick={e => { e.stopPropagation(); tap('product', p.id); }} className="cursor-pointer">
              <rect
                x={p.rx - pW / 2} y={p.ry - pH / 2}
                width={pW} height={pH} rx={10}
                fill={on ? p.color : '#FFFFFF'}
                stroke={on ? p.color : 'rgba(0,0,0,0.08)'}
                strokeWidth={selected ? 2.5 : 1}
                style={{ transition: 'all 0.18s', filter: on ? 'drop-shadow(0 2px 8px ' + p.color + '40)' : 'none' }}
              />
              {/* Expanded hit area */}
              <rect x={p.rx - pHW / 2} y={p.ry - pHH / 2} width={pHW} height={pHH} rx={14} fill="transparent" />
              <circle cx={p.rx - pW / 2 + 12} cy={p.ry} r={3.5} fill={on ? 'rgba(255,255,255,0.8)' : p.color} style={{ transition: 'fill 0.18s' }} />
              <text
                x={p.rx + 4} y={p.ry + 4}
                textAnchor="middle" fontSize={9.5} fontWeight="700" fontFamily="serif"
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

// ─── Scatter Graph (Desktop only — hover interactions) ────────────────────────

const SCATTER_VERTS = HERO_SCATTER_NODES.filter(n => n.type === 'vertical');

function ScatterGraph() {
  const [activeNode, setActiveNode] = useState(null);
  const CENTER = { x: 300, y: 190 };

  const setOn  = (type, id) => setActiveNode({ type, id });
  const setOff = () => setActiveNode(null);

  const pathOn = (id1, id2) => {
    if (!activeNode) return false;
    if (activeNode.type === 'center' && (id1 === 'center' || id2 === 'center')) return true;
    if (activeNode.type === 'vertical') {
      if ((id1 === 'center' && id2 === activeNode.id) || (id2 === 'center' && id1 === activeNode.id)) return true;
    }
    return false;
  };

  return (
    <div className="w-full aspect-[600/380] relative">
      <svg viewBox="0 0 600 380" className="w-full h-full select-none">
        {/* Center → Vertical paths */}
        {SCATTER_VERTS.map(v => {
          if (CENTER.x === undefined || CENTER.y === undefined || v.x === undefined || v.y === undefined || isNaN(CENTER.x) || isNaN(CENTER.y) || isNaN(v.x) || isNaN(v.y)) {
            return null;
          }
          const on = pathOn('center', v.id);
          return (
            <g key={`cl-${v.id}`}>
              <line x1={CENTER.x} y1={CENTER.y} x2={v.x} y2={v.y}
                stroke={on ? '#1B3A6B' : 'rgba(0,0,0,0.06)'}
                strokeWidth={on ? 1.5 : 1} className="transition-colors duration-200"
              />
              <motion.circle r={on ? 2 : 1.5} fill={on ? '#1B3A6B' : '#A3A3A3'}
                animate={{ cx: [CENTER.x, v.x], cy: [CENTER.y, v.y] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
              />
            </g>
          );
        })}

        {/* CENTER NODE */}
        {CENTER.x !== undefined && CENTER.y !== undefined && !isNaN(CENTER.x) && !isNaN(CENTER.y) && (
          <motion.g className="cursor-pointer" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            onMouseEnter={() => setOn('center', 'center')} onMouseLeave={setOff}>
            <circle cx={CENTER.x} cy={CENTER.y} r={28} fill="#1B3A6B" />
            <circle cx={CENTER.x} cy={CENTER.y} r={34} fill="none" stroke="#1B3A6B" strokeWidth={1} opacity={0.2} className="animate-ping" style={{ animationDuration: '3s' }} />
            <text x={CENTER.x} y={CENTER.y + 4} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="serif">GXY LABS</text>
          </motion.g>
        )}

        {/* VERTICAL NODES */}
        {SCATTER_VERTS.map(v => {
          if (v.x === undefined || v.y === undefined || isNaN(v.x) || isNaN(v.y)) return null;
          const IconComp = v.icon;
          const on = activeNode && (activeNode.id === v.id || (activeNode.type === 'product' && SCATTER_PRODS.find(p => p.id === activeNode.id)?.connects.includes(v.id)) || activeNode.type === 'center');
          return (
            <motion.g key={v.id} className="cursor-pointer" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              onMouseEnter={() => setOn('vertical', v.id)} onMouseLeave={setOff}>
              <circle cx={v.x} cy={v.y} r={on ? 15 : 12} fill={on ? '#EEF3FB' : '#FFFFFF'} stroke={on ? '#1B3A6B' : 'rgba(0,0,0,0.08)'} strokeWidth={on ? 1.5 : 1} className="transition-all duration-200" />
              <foreignObject x={v.x - 7} y={v.y - 7} width={14} height={14} className="pointer-events-none">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: on ? '#1B3A6B' : 'rgba(0,0,0,0.4)' }}>
                  {IconComp && <IconComp size={10} strokeWidth={2.5} />}
                </div>
              </foreignObject>
              {CENTER.y !== undefined && (
                <text x={v.x} y={v.y + (v.y > CENTER.y ? 28 : -20)} textAnchor="middle" fontSize="8" fontWeight={on ? '700' : '500'} fill={on ? '#0F0F0F' : 'rgba(0,0,0,0.4)'} style={{ transition: 'all 0.2s' }}>{v.name}</text>
              )}
            </motion.g>
          );
        })}

      </svg>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

export default function Hero() {
  const isTouch = useIsTouch();
  const bp      = useBreakpoint();

  const cfg = bp === 'mobile' ? MOBILE_CFG : TABLET_CFG;
  const useRadial = bp !== 'desktop';

  const interactionHint = bp === 'desktop'
    ? 'HOVER NODES TO HIGHLIGHT FLOWS'
    : 'TAP NODES TO EXPLORE';

  return (
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-20 border-b border-black/[0.06] bg-[#FAFAF8]">
      <PageBackground />

      <Container className="relative z-10 flex flex-col items-center text-center">
        {/* Header */}
        <div className="max-w-3xl mb-8 sm:mb-12 px-2">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.09em] uppercase text-[#1B3A6B] mb-3">
            <span className="w-4 h-[1px] bg-[#1B3A6B]/50" /> Engineering Studio
          </div>
          <h1 className="font-serif text-[28px] sm:text-[44px] md:text-[54px] lg:text-[60px] font-light leading-[1.14] tracking-[-0.025em] text-[#0F0F0F] mb-4">
            Software that <em className="not-italic text-black/40">thinks</em>, scales, and performs.
          </h1>
          <p className="text-sm sm:text-base md:text-[17px] text-[#525252] leading-[1.65] max-w-xl mx-auto font-normal">
            Graphxy Labs transforms rigorous engineering expertise into precise digital products, visual systems, and automation platforms.
          </p>
        </div>

        {/* Visualization */}
        <div className="w-full max-w-3xl mx-auto relative px-2 sm:px-4">
          <Card variant="surface" className={`bg-white/70 backdrop-blur-sm border-black/5 shadow-sm overflow-hidden rounded-2xl ${useRadial ? 'p-4' : 'p-4 sm:p-6'}`}>
            <div className="flex justify-between items-center text-left text-[10px] font-mono text-black/40 border-b border-black/[0.04] pb-3 mb-4 gap-2">
              <span className="flex-shrink-0">CORE SERVICES MAP</span>
              <span className="text-[#1B3A6B] font-semibold text-right truncate max-w-[180px]">{interactionHint}</span>
            </div>

            {useRadial ? <RadialGraph cfg={cfg} /> : <ScatterGraph />}
          </Card>
        </div>
      </Container>
    </section>
  );
}

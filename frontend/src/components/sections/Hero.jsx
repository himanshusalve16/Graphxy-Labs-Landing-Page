import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../layout/Container';
import { Card } from '../ui/Card';
import { Layers, Monitor, Cpu, LineChart, Code, GitMerge, Smartphone, Grid } from 'lucide-react';

const verticals = [
  { id: 'v0', name: 'Management Systems', x: 390, y: 190, icon: Grid },
  { id: 'v1', name: 'Web Development', x: 364, y: 250, icon: Monitor },
  { id: 'v2', name: 'Mobile App Dev', x: 300, y: 275, icon: Smartphone },
  { id: 'v3', name: 'AI & Machine Learning', x: 236, y: 250, icon: Cpu },
  { id: 'v4', name: 'Data Science & Analytics', x: 210, y: 190, icon: LineChart },
  { id: 'v5', name: 'Custom Software', x: 236, y: 130, icon: Code },
  { id: 'v6', name: 'Automation & Workflow', x: 300, y: 105, icon: GitMerge },
  { id: 'v7', name: 'Scalable Tech Products', x: 364, y: 130, icon: Layers },
];

const products = [
  { id: 'p_graphzy', name: 'Graphzy', x: 110, y: 110, color: '#0066CC', description: 'Prototype Preview • Equation Visualizer', link: '/graphzy', connects: ['v1', 'v3', 'v5'] },
  { id: 'p_mesa', name: 'Mesa', x: 490, y: 190, color: '#92400E', description: 'Concept Preview • Restaurant OS', link: '/mesa', connects: ['v0', 'v1', 'v6'] },
  { id: 'p_ventureflow', name: 'VentureFlow', x: 220, y: 325, color: '#1B3A6B', description: 'Early Concept • Startup OS', link: '/ventureflow', connects: ['v1', 'v4', 'v7'] },
];

export default function Hero() {
  const [hoveredNode, setHoveredNode] = useState(null); // { type: 'center' | 'vertical' | 'product', id: string }

  const centerNode = { x: 300, y: 190, name: 'Graphxy Labs' };

  // Helper to check if a path (line) should be highlighted
  const isPathActive = (nodeId1, nodeId2) => {
    if (!hoveredNode) return false;
    
    // If center is hovered, highlight all center-to-vertical lines
    if (hoveredNode.type === 'center' && (nodeId1 === 'center' || nodeId2 === 'center')) {
      return true;
    }
    
    // If a product is hovered, highlight its links to verticals
    if (hoveredNode.type === 'product') {
      const prod = products.find(p => p.id === hoveredNode.id);
      if (prod) {
        if ((nodeId1 === prod.id && prod.connects.includes(nodeId2)) || 
            (nodeId2 === prod.id && prod.connects.includes(nodeId1))) {
          return true;
        }
        // Also highlight center to connected verticals
        if ((nodeId1 === 'center' && prod.connects.includes(nodeId2)) ||
            (nodeId2 === 'center' && prod.connects.includes(nodeId1))) {
          return true;
        }
      }
    }
    
    // If a vertical is hovered, highlight its link to center and to products
    if (hoveredNode.type === 'vertical') {
      if ((nodeId1 === 'center' && nodeId2 === hoveredNode.id) || 
          (nodeId2 === 'center' && nodeId1 === hoveredNode.id)) {
        return true;
      }
      const prod = products.find(p => p.connects.includes(hoveredNode.id));
      if (prod) {
        if ((nodeId1 === prod.id && nodeId2 === hoveredNode.id) || 
            (nodeId2 === prod.id && nodeId1 === hoveredNode.id)) {
          return true;
        }
      }
    }
    
    return false;
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-20 border-b border-black/[0.06] bg-[#FAFAF8]">
      {/* Visual Depth Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#1B3A6B]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-gradient-to-tr from-[#92400E]/3 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      {/* Fine-grain noise texture simulation */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent bg-repeat" />

      <Container className="relative z-10 flex flex-col items-center text-center">
        {/* Editorial Text Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.09em] uppercase text-[#1B3A6B] mb-3">
            <span className="w-4 h-[1px] bg-[#1B3A6B]/50" /> Engineering Studio
          </div>
          
          <h1 className="font-serif text-[32px] sm:text-[44px] md:text-[54px] lg:text-[60px] font-light leading-[1.14] tracking-[-0.025em] text-[#0F0F0F] mb-4">
            Software that <em className="not-italic text-black/40">thinks</em>, scales, and performs.
          </h1>
          
          <p className="text-sm sm:text-base md:text-[17px] text-[#525252] leading-[1.65] max-w-xl mx-auto font-normal">
            Graphxy Labs transforms rigorous engineering expertise into precise digital products, visual systems, and automation platforms.
          </p>
        </div>

        {/* Living System Map Visualization Canvas */}
        <div className="w-full max-w-3xl mx-auto relative px-4">
          <Card 
            variant="surface" 
            className="bg-white/70 backdrop-blur-sm border-black/5 shadow-sm p-4 sm:p-6 overflow-hidden rounded-2xl"
          >
            {/* System Info Banner */}
            <div className="flex justify-between items-center text-left text-[10px] font-mono text-black/40 border-b border-black/[0.04] pb-3 mb-4">
              <span>ACTIVE LIVING SYSTEM MAP</span>
              <span className="text-[#1B3A6B] font-semibold">
                {hoveredNode 
                  ? `${hoveredNode.type.toUpperCase()}: ${
                      hoveredNode.type === 'center' ? centerNode.name :
                      hoveredNode.type === 'vertical' ? verticals.find(v => v.id === hoveredNode.id)?.name :
                      products.find(p => p.id === hoveredNode.id)?.name
                    }`
                  : 'HOVER NODES TO HIGHLIGHT FLOWS'}
              </span>
            </div>

            {/* SVG Visual Graph Container */}
            <div className="w-full aspect-[6/4] sm:aspect-[600/380] relative">
              <svg 
                viewBox="0 0 600 380" 
                className="w-full h-full select-none"
              >
                {/* 1. DRAW CONNECTIONS (BACK LAYER) */}
                {/* Center to Verticals */}
                {verticals.map(v => {
                  const isActive = isPathActive('center', v.id);
                  return (
                    <g key={`link-c-${v.id}`}>
                      <line
                        x1={centerNode.x}
                        y1={centerNode.y}
                        x2={v.x}
                        y2={v.y}
                        stroke={isActive ? '#1B3A6B' : 'rgba(0, 0, 0, 0.06)'}
                        strokeWidth={isActive ? 1.5 : 1}
                        className="transition-colors duration-200"
                      />
                      {/* Pulsing particles traveling from Center to Verticals */}
                      <motion.circle
                        r={isActive ? 2 : 1.5}
                        fill={isActive ? '#1B3A6B' : '#A3A3A3'}
                        animate={{
                          cx: [centerNode.x, v.x],
                          cy: [centerNode.y, v.y]
                        }}
                        transition={{
                          duration: isActive ? 2.2 : 3.5,
                          repeat: Infinity,
                          ease: "linear",
                          delay: Math.random() * 2
                        }}
                      />
                    </g>
                  );
                })}

                {/* Verticals to Products */}
                {products.map(p => {
                  return p.connects.map(vId => {
                    const v = verticals.find(vert => vert.id === vId);
                    if (!v) return null;
                    const isActive = isPathActive(p.id, v.id);
                    return (
                      <g key={`link-${p.id}-${v.id}`}>
                        <line
                          x1={v.x}
                          y1={v.y}
                          x2={p.x}
                          y2={p.y}
                          stroke={isActive ? p.color : 'rgba(0, 0, 0, 0.06)'}
                          strokeWidth={isActive ? 1.5 : 1}
                          className="transition-colors duration-200"
                        />
                        {/* Particles traveling from Verticals to Products */}
                        <motion.circle
                          r={isActive ? 2 : 1.5}
                          fill={isActive ? p.color : '#A3A3A3'}
                          animate={{
                            cx: [v.x, p.x],
                            cy: [v.y, p.y]
                          }}
                          transition={{
                            duration: isActive ? 2.5 : 4,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 2
                          }}
                        />
                      </g>
                    );
                  });
                })}

                {/* 2. DRAW CENTER NODE */}
                <motion.g
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode({ type: 'center', id: 'center' })}
                  onMouseLeave={() => setHoveredNode(null)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <circle
                    cx={centerNode.x}
                    cy={centerNode.y}
                    r={28}
                    fill="#1B3A6B"
                    className="shadow-sm"
                  />
                  <circle
                    cx={centerNode.x}
                    cy={centerNode.y}
                    r={34}
                    fill="none"
                    stroke="#1B3A6B"
                    strokeWidth={1}
                    className="opacity-20 animate-ping"
                    style={{ animationDuration: '3s' }}
                  />
                  <text
                    x={centerNode.x}
                    y={centerNode.y + 4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    className="font-serif text-[10px] font-semibold tracking-wide"
                  >
                    GXY LABS
                  </text>
                </motion.g>

                {/* 3. DRAW VERTICAL NODES */}
                {verticals.map(v => {
                  const IconComp = v.icon;
                  const isHighlighted = hoveredNode && 
                    (hoveredNode.id === v.id || 
                     (hoveredNode.type === 'product' && products.find(p => p.id === hoveredNode.id)?.connects.includes(v.id)) ||
                     hoveredNode.type === 'center');
                  
                  return (
                    <motion.g
                      key={v.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode({ type: 'vertical', id: v.id })}
                      onMouseLeave={() => setHoveredNode(null)}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      <circle
                        cx={v.x}
                        cy={v.y}
                        r={isHighlighted ? 15 : 12}
                        fill={isHighlighted ? '#EEF3FB' : '#FFFFFF'}
                        stroke={isHighlighted ? '#1B3A6B' : 'rgba(0,0,0,0.08)'}
                        strokeWidth={isHighlighted ? 1.5 : 1}
                        className="transition-all duration-200 shadow-sm"
                      />
                      <foreignObject 
                        x={v.x - 7} 
                        y={v.y - 7} 
                        width={14} 
                        height={14}
                        className="pointer-events-none"
                      >
                        <div className={`flex items-center justify-center w-full h-full ${isHighlighted ? 'text-[#1B3A6B]' : 'text-black/40'}`}>
                          <IconComp size={10} strokeWidth={2.5} />
                        </div>
                      </foreignObject>
                      
                      {/* Floating Labels for Verticals */}
                      <text
                        x={v.x}
                        y={v.y + (v.y > centerNode.y ? 24 : -18)}
                        textAnchor="middle"
                        className={`font-sans text-[8px] font-semibold tracking-tight transition-colors duration-200 ${
                          isHighlighted ? 'fill-[#0F0F0F] font-bold' : 'fill-black/40'
                        }`}
                      >
                        {v.name}
                      </text>
                    </motion.g>
                  );
                })}

                {/* 4. DRAW PRODUCT NODES */}
                {products.map(p => {
                  const isHighlighted = hoveredNode && (hoveredNode.id === p.id || (hoveredNode.type === 'vertical' && p.connects.includes(hoveredNode.id)));
                  return (
                    <motion.g
                      key={p.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode({ type: 'product', id: p.id })}
                      onMouseLeave={() => setHoveredNode(null)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      {/* Product Card Container inside SVG */}
                      <rect
                        x={p.x - 45}
                        y={p.y - 18}
                        width={90}
                        height={36}
                        rx={10}
                        fill="#FFFFFF"
                        stroke={isHighlighted ? p.color : 'rgba(0,0,0,0.06)'}
                        strokeWidth={isHighlighted ? 2 : 1}
                        className="transition-all duration-200 shadow-md"
                      />
                      
                      {/* Color Tag Indicator */}
                      <circle
                        cx={p.x - 32}
                        cy={p.y}
                        r={4}
                        fill={p.color}
                      />
                      
                      <text
                        x={p.x + 8}
                        y={p.y + 4}
                        textAnchor="middle"
                        fill="#0F0F0F"
                        className="font-serif text-[10px] font-bold"
                      >
                        {p.name}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>

              {/* Dynamic Description Overlay */}
              <AnimatePresence>
                {hoveredNode && hoveredNode.type === 'product' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#FAFAF8] border border-black/5 rounded-xl px-4 py-2 shadow-md flex flex-col items-center pointer-events-none"
                  >
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: products.find(p => p.id === hoveredNode.id)?.color }}>
                      {products.find(p => p.id === hoveredNode.id)?.name}
                    </span>
                    <span className="text-[10px] text-[#525252] mt-0.5 font-sans">
                      {products.find(p => p.id === hoveredNode.id)?.description}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

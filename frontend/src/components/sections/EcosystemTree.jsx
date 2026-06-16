import React, { useRef, useState } from 'react';
import Container from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import { ArrowRight, Layers, Cpu, Code, Monitor, Grid, GitMerge, LineChart, TrendingUp, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EcosystemTree() {
  const [hoveredNode, setHoveredNode] = useState(null); // node ID or null

  const verticals = [
    { id: 'v3', name: 'AI & ML', x: 80, y: 130, icon: Cpu, products: ['p_graphzy'] },
    { id: 'v5', name: 'Custom Software', x: 150, y: 130, icon: Code, products: ['p_graphzy'] },
    { id: 'v1', name: 'Web Development', x: 220, y: 130, icon: Monitor, products: ['p_graphzy', 'p_mesa', 'p_ventureflow'] },
    { id: 'v0', name: 'Management Systems', x: 290, y: 130, icon: Grid, products: ['p_mesa'] },
    { id: 'v6', name: 'Automation', x: 360, y: 130, icon: GitMerge, products: ['p_mesa'] },
    { id: 'v4', name: 'Data Science', x: 430, y: 130, icon: LineChart, products: ['p_ventureflow'] },
    { id: 'v7', name: 'Scalable Tech', x: 500, y: 130, icon: TrendingUp, products: ['p_ventureflow'] },
  ];

  const products = [
    { id: 'p_graphzy', name: 'Graphzy', x: 120, y: 240, color: '#0066CC', link: '/graphzy', tag: 'Prototype Preview' },
    { id: 'p_mesa', name: 'Mesa', x: 300, y: 240, color: '#92400E', link: '/mesa', tag: 'Concept Preview' },
    { id: 'p_ventureflow', name: 'VentureFlow', x: 480, y: 240, color: '#1B3A6B', link: '/ventureflow', tag: 'Early Concept' },
  ];

  const isLinkActive = (nId1, nId2) => {
    if (!hoveredNode) return false;
    if (hoveredNode === 'center') return true;
    if (hoveredNode === nId1 || hoveredNode === nId2) return true;
    return false;
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAFAF8] border-b border-black/[0.06] relative overflow-hidden">
      {/* Mesh gradients */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#1B3A6B]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading 
          eyebrow="Architectural Structure"
          heading="A unified ecosystem engineered for distinct industries."
          description="Graphxy Labs operates as the core architectural parent. We design and launch focused product divisions that address math visualization, restaurant automation, and startup logistics."
        />

        {/* 1. VISUAL THREE-LEVEL HIERARCHY TREE */}
        <div data-reveal className="mt-10 max-w-4xl mx-auto flex flex-col items-center bg-white border border-black/5 rounded-2xl p-6 shadow-xs overflow-hidden">
          <div className="w-full flex justify-between items-center text-[9px] font-mono text-black/45 border-b border-black/[0.04] pb-3 mb-4">
            <span>LABS HIERARCHICAL SCHEMA</span>
            <span className="text-[#1B3A6B] font-bold">
              {hoveredNode ? hoveredNode.toUpperCase() : 'HOVER NODES TO HIGHLIGHT RELATIONSHIPS'}
            </span>
          </div>

          <div className="w-full aspect-[600/290] relative">
            <svg viewBox="0 0 600 290" className="w-full h-full select-none">
              {/* Level 1 to Level 2 connection lines */}
              {verticals.map(v => {
                const active = isLinkActive('center', v.id);
                return (
                  <g key={`l1-l2-${v.id}`}>
                    <line 
                      x1="300" y1="35" 
                      x2={v.x} y2={v.y} 
                      stroke={active ? '#1B3A6B' : 'rgba(0,0,0,0.06)'} 
                      strokeWidth={active ? 1.5 : 1}
                      className="transition-colors duration-150"
                    />
                  </g>
                );
              })}

              {/* Level 2 to Level 3 connection lines */}
              {verticals.map(v => {
                return v.products.map(pId => {
                  const p = products.find(prod => prod.id === pId);
                  if (!p) return null;
                  const active = isLinkActive(v.id, p.id);
                  return (
                    <line 
                      key={`l2-l3-${v.id}-${p.id}`}
                      x1={v.x} y1={v.y} 
                      x2={p.x} y2={p.y} 
                      stroke={active ? p.color : 'rgba(0,0,0,0.06)'} 
                      strokeWidth={active ? 1.5 : 1}
                      className="transition-colors duration-150"
                    />
                  );
                });
              })}

              {/* LEVEL 1 NODE: PARENT LABS */}
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode('center')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect x="250" y="10" width="100" height="36" rx="10" fill="#1B3A6B" />
                <rect x="246" y="6" width="108" height="44" rx="14" fill="none" stroke="#1B3A6B" strokeWidth="1" className="opacity-15 animate-pulse" />
                <text x="300" y="31" textAnchor="middle" fill="#FFFFFF" className="font-serif text-[10px] font-bold tracking-wide">GXY LABS</text>
              </g>

              {/* LEVEL 2 NODES: VERTICALS */}
              {verticals.map(v => {
                const IconComp = v.icon;
                const isSelected = hoveredNode === v.id || (hoveredNode === 'center');
                return (
                  <g 
                    key={v.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(v.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle cx={v.x} cy={v.y} r="13" fill={isSelected ? '#EEF3FB' : '#FFFFFF'} stroke={isSelected ? '#1B3A6B' : 'rgba(0,0,0,0.08)'} strokeWidth="1.2" className="transition-all duration-150" />
                    <foreignObject x={v.x - 7} y={v.y - 7} width="14" height="14" className="pointer-events-none">
                      <div className={`flex items-center justify-center w-full h-full ${isSelected ? 'text-[#1B3A6B]' : 'text-black/40'}`}>
                        <IconComp size={9} strokeWidth={2.5} />
                      </div>
                    </foreignObject>
                    
                    {/* Vertical label */}
                    <text 
                      x={v.x} y={v.y + 24} 
                      textAnchor="middle" 
                      className={`font-sans text-[7.5px] font-semibold tracking-tight transition-all duration-150 ${
                        isSelected ? 'fill-black font-bold' : 'fill-black/40'
                      }`}
                    >
                      {v.name}
                    </text>
                  </g>
                );
              })}

              {/* LEVEL 3 NODES: PRODUCTS */}
              {products.map(p => {
                const isSelected = hoveredNode === p.id || (hoveredNode && verticals.find(v => v.id === hoveredNode && v.products.includes(p.id)));
                return (
                  <g 
                    key={p.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(p.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <rect 
                      x={p.x - 45} y={p.y - 15} 
                      width="90" height="30" 
                      rx="9" fill="#FFFFFF" 
                      stroke={isSelected ? p.color : 'rgba(0,0,0,0.07)'} 
                      strokeWidth={isSelected ? 2 : 1}
                      className="shadow-sm transition-all duration-150" 
                    />
                    <circle cx={p.x - 30} cy={p.y} r="3" fill={p.color} />
                    <text x={p.x + 8} y={p.y + 3.5} textAnchor="middle" fill="#0F0F0F" className="font-serif text-[9.5px] font-bold">{p.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 2. PRODUCTS GRID CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-12 mx-auto">
          {/* Card 1: Graphzy */}
          <Card variant="surface" className="p-5 bg-white border-[#0066CC]/10 flex flex-col justify-between hover:border-[#0066CC]/30 hover:shadow-md transition-all duration-200 text-left">
            <div>
              <div className="flex justify-between items-start mb-4">
                <Tag variant="math">Prototype Preview</Tag>
                <span className="font-mono text-[8px] text-[#A3A3A3]">EST. 2026</span>
              </div>
              <h4 className="font-serif text-lg text-[#0F0F0F] mb-1.5 font-semibold">Graphzy</h4>
              <p className="text-[11.5px] text-[#525252] leading-relaxed mb-4">
                Visualization platform converting plain text math inquiries into live, parameter-rich graphing templates.
              </p>
              <div className="border-t border-black/[0.04] pt-3 mb-5">
                <span className="font-mono text-[8px] text-black/45 uppercase tracking-wider block mb-2">Capabilities</span>
                <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[10px] text-[#525252]">
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#0066CC]" />Desmos graph canvas</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#0066CC]" />Parameter Auto-Mapping</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#0066CC]" />Dynamic parameter sliders</li>
                </ul>
              </div>
            </div>
            <Link to="/products#graphzy" className="mt-auto block">
              <Button variant="graphzy" className="w-full flex items-center justify-center gap-1 text-xs py-1.5">
                Launch Visualizer <ArrowRight size={12} />
              </Button>
            </Link>
          </Card>

          {/* Card 2: Mesa */}
          <Card variant="surface" className="p-5 bg-[#FEF7EC] border-[#B45309]/14 flex flex-col justify-between hover:border-[#B45309]/30 hover:shadow-md transition-all duration-200 text-left">
            <div>
              <div className="flex justify-between items-start mb-4">
                <Tag variant="serva">Concept Preview</Tag>
                <span className="font-mono text-[8px] text-[#A3A3A3]">EST. 2027</span>
              </div>
              <h4 className="font-serif text-lg text-[#0F0F0F] mb-1.5 font-semibold">Mesa</h4>
              <p className="text-[11.5px] text-[#525252] leading-relaxed mb-4">
                Hospitality operations engine designed to automate floor layout orders and monitor kitchen task velocities.
              </p>
              <div className="border-t border-black/[0.04] pt-3 mb-5">
                <span className="font-mono text-[8px] text-black/45 uppercase tracking-wider block mb-2">Capabilities</span>
                <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[10px] text-[#525252]">
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#92400E]" />Floor & table layout status</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#92400E]" />Tablet kitchen displays</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#92400E]" />Low inventory SMS alerts</li>
                </ul>
              </div>
            </div>
            <Link to="/products#mesa" className="mt-auto block">
              <Button variant="serva" className="w-full flex items-center justify-center gap-1 text-xs py-1.5">
                Register for Waitlist <ArrowRight size={12} />
              </Button>
            </Link>
          </Card>

          {/* Card 3: VentureFlow */}
          <Card variant="surface" className="p-5 bg-white border-[#1B3A6B]/10 flex flex-col justify-between hover:border-[#1B3A6B]/30 hover:shadow-md transition-all duration-200 text-left">
            <div>
              <div className="flex justify-between items-start mb-4">
                <Tag variant="brand">Early Concept</Tag>
                <span className="font-mono text-[8px] text-[#A3A3A3]">EST. 2027</span>
              </div>
              <h4 className="font-serif text-lg text-[#0F0F0F] mb-1.5 font-semibold">VentureFlow</h4>
              <p className="text-[11.5px] text-[#525252] leading-relaxed mb-4">
                Startup fundraising operating platform to coordinate investor pipelines, track CRM deal stages, and model cap tables.
              </p>
              <div className="border-t border-black/[0.04] pt-3 mb-5">
                <span className="font-mono text-[8px] text-black/45 uppercase tracking-wider block mb-2">Capabilities</span>
                <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[10px] text-[#525252]">
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#1B3A6B]" />Investor Deal Pipeline CRM</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#1B3A6B]" />Pitch Deck Telemetry</li>
                  <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#1B3A6B]" />Dilution Cap Table Models</li>
                </ul>
              </div>
            </div>
            <Link to="/products#ventureflow" className="mt-auto block">
              <Button variant="brand" className="w-full flex items-center justify-center gap-1 text-xs py-1.5">
                Explore Concept <ArrowRight size={12} />
              </Button>
            </Link>
          </Card>
        </div>

      </Container>
    </section>
  );
}

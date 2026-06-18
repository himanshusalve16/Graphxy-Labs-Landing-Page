import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, Calendar, Orbit, Database, Cpu, Compass } from 'lucide-react';

export default function GraphzyFeatures() {
  return (
    <div className="w-full flex flex-col items-center mt-16 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-12">
        <Card variant="surface" className="p-8">
          <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Interactive Math</h3>
          <p className="text-[12px] text-[#525252] leading-relaxed">
            Translates natural language formulas into live 2D coordinate graphs. Auto-binds parameters to interactive sliders via our local custom math engine.
          </p>
        </Card>
        
        <Card variant="surface" className="p-8">
          <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Physics Trajectories</h3>
          <p className="text-[12px] text-[#525252] leading-relaxed">
            Generates simulated vector trajectories. Model angle launches, velocity constants, and kinematic equations in real-time.
          </p>
        </Card>
        
        <Card variant="surface" className="p-8">
          <h3 className="font-serif text-base text-[#0F0F0F] mb-2 font-medium">Chemistry Structures</h3>
          <p className="text-[12px] text-[#525252] leading-relaxed">
            Renders molecular bonds and chemical geometries. Simulates H₂O bond angles and lengths interactively.
          </p>
        </Card>
      </div>

      {/* Future Roadmap Section */}
      <Card variant="surface" className="w-full p-8 bg-white border border-black/5 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Orbit size={160} className="text-[#0066CC]" />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap gap-2 items-center mb-2">
              <Badge variant="brand">Roadmap</Badge>
              <span className="font-mono text-[9px] font-bold text-[#A3A3A3] uppercase tracking-wider">Prototype Mockup • Under Active Development</span>
            </div>
            <h3 className="font-serif text-lg md:text-xl text-[#0F0F0F] font-semibold">Future Development Roadmap</h3>
            <p className="text-xs text-[#525252] mt-1 max-w-xl">
              Graphzy is expanding from an algebraic visualizer into a multi-disciplinary AI-powered STEM workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-black/[0.04] pt-6">
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FF] text-[#0066CC] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cpu size={14} />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold text-[#0F0F0F]">AI-Generated Simulations</h4>
                <p className="text-[11px] text-[#A3A3A3] mt-0.5">Translates abstract physical mechanics into custom interactive sandboxes.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FF] text-[#0066CC] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Database size={14} />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold text-[#0F0F0F]">AI Chemistry Structures</h4>
                <p className="text-[11px] text-[#A3A3A3] mt-0.5">Automatically models complex 3D molecular structures and orbital shells.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FF] text-[#0066CC] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Compass size={14} />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold text-[#0F0F0F]">AI Biology Diagrams</h4>
                <p className="text-[11px] text-[#A3A3A3] mt-0.5">Generates annotated cellular pathways, anatomical slices, and genetic maps.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FF] text-[#0066CC] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={14} />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold text-[#0F0F0F]">Interactive Workflows</h4>
                <p className="text-[11px] text-[#A3A3A3] mt-0.5">Adaptive visual step-by-step breakdowns for solving advanced science queries.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FF] text-[#0066CC] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar size={14} />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold text-[#0F0F0F]">STEM Content Generation</h4>
                <p className="text-[11px] text-[#A3A3A3] mt-0.5">Enables educators to prompt and output high-fidelity classroom illustrations.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

import React from 'react';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import PageBackground from '../components/layout/PageBackground';
import { Tag } from '../components/ui/Tag';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import WaitlistForm from '../components/ui/WaitlistForm';
import GraphzyFeatures from '../components/graphzy/GraphzyFeatures';
import { GraphzyPreview } from '../components/sections/ProductShowcase';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GraphzyDetails() {
  const benefits = [
    {
      title: "Natural Language to Code",
      desc: "Translate plain English equations, questions, or conceptual prompts into visual, interactive sandbox simulations instantly."
    },
    {
      title: "Parametric Manipulation",
      desc: "Every dynamic constant is auto-bound to interactive sliders, letting you change parameters and observe simulation shifts in real-time."
    },
    {
      title: "Cross-Disciplinary Sandbox",
      desc: "Explore high-fidelity illustrations spanning algebraic parabola stretches, physics kinematics launches, molecular bonding angles, and DNA helixes."
    }
  ];

  return (
    <PageShell>
      {/* Background Mesh Overlays */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-16 md:py-24 border-b border-black/[0.04]">
        <PageBackground />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">

            {/* Hero Header */}
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
              <Tag variant="math" className="mb-6">COMING SOON</Tag>
              <h1 className="font-serif text-[34px] md:text-[48px] font-light leading-[1.15] tracking-[-0.022em] text-[#0F0F0F] mb-4">
                Graphzy - AI-Powered STEM Visualizer
              </h1>
              <p className="text-sm md:text-base text-[#525252] leading-[1.68] max-w-md">
                An interactive visualization platform that transforms plain-language math, physics, and chemistry equations into coordinate models. Join the waitlist below or try the live sandbox prototype.
              </p>
            </div>

            {/* Rich Interactive SVG Graph Preview */}
            <div className="w-full max-w-md mt-16 animate-fade-in">
              <GraphzyPreview />
            </div>

            {/* Product Features */}
            <GraphzyFeatures />

            {/* Benefits cards grid */}
            <div className="w-full mt-24">
              <div className="text-center mb-10 max-w-lg mx-auto">
                <span className="font-mono text-[9px] font-bold text-[#0066CC] uppercase tracking-wider">Ecosystem Values</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F0F0F] mt-2 mb-3 font-light">Engineered for conceptual clarity.</h2>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Graphzy helps educators and students bridge the gap between abstract mathematical formulas and concrete visual models.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-12 max-w-4xl mx-auto">
                {benefits.map((item, idx) => (
                  <Card key={idx} variant="surface" className="p-8 bg-white border-[#0066CC]/14 shadow-sm hover:shadow-md duration-200">
                    <h3 className="font-serif text-[17px] text-[#0f0f0f] mb-3 font-normal">{item.title}</h3>
                    <p className="text-xs text-[#525252] leading-relaxed">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Waitlist Form Section at the bottom */}
            <div className="w-full max-w-md mt-16 flex flex-col items-center">
              <div className="w-full flex items-center gap-3 my-4 text-[#A3A3A3] font-mono text-[9px] uppercase tracking-wider select-none">
                <div className="h-[1px] bg-black/5 flex-1" />
                <span>Join the waitlist</span>
                <div className="h-[1px] bg-black/5 flex-1" />
              </div>
              <WaitlistForm product="Graphzy" />
            </div>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}

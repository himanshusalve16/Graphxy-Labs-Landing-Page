import React from 'react';
import PageShell from '../components/layout/PageShell';
import Hero from '../components/sections/Hero';
import CompanyOverview from '../components/sections/CompanyOverview';
import VerticalSections from '../components/sections/VerticalSections';
import ProductShowcase from '../components/sections/ProductShowcase';
import DecisionEngine from '../components/sections/DecisionEngine';
import WhyGraphxy from '../components/sections/WhyGraphxy';
import CTA from '../components/sections/CTA';

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <CompanyOverview />
      <VerticalSections />
      <ProductShowcase />
      <DecisionEngine />
      <WhyGraphxy />
      <CTA />
    </PageShell>
  );
}

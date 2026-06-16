import React from 'react';
import PageShell from '../components/layout/PageShell';
import Hero from '../components/sections/Hero';
import CompanyOverview from '../components/sections/CompanyOverview';
import EcosystemTree from '../components/sections/EcosystemTree';
import ProductShowcase from '../components/sections/ProductShowcase';
import VerticalSections from '../components/sections/VerticalSections';
import WhyGraphxy from '../components/sections/WhyGraphxy';
import Process from '../components/sections/Process';
import CTA from '../components/sections/CTA';

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <CompanyOverview />
      <EcosystemTree />
      <ProductShowcase />
      <VerticalSections />
      <WhyGraphxy />
      <Process />
      <CTA />
    </PageShell>
  );
}

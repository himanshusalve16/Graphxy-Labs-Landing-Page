import React from 'react';
import { Card } from '../ui/Card';

export default function ClampboxBenefits() {
  const benefits = [
    {
      title: "Browser Extension Guard",
      desc: "Deploy a lightweight Manifest V3 extension to intercept prompts inline on ChatGPT, Claude, Gemini, Grok, and more."
    },
    {
      title: "Developer API Gateway",
      desc: "Route programmatic requests through our secure Express gateway using cryptographically hashed gateway access keys."
    },
    {
      title: "PII & IP Redaction",
      desc: "Configure advanced regex or structured classifiers to dynamically replace sensitive data spans with custom placeholders."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-12 max-w-4xl mx-auto">
      {benefits.map((item, idx) => (
        <Card key={idx} variant="surface" className="p-8 bg-white border-[#0D9488]/14 shadow-sm hover:shadow-md duration-200">
          <h3 className="font-serif text-[17px] text-[#0f0f0f] mb-3 font-normal">{item.title}</h3>
          <p className="text-xs text-[#525252] leading-relaxed">{item.desc}</p>
        </Card>
      ))}
    </div>
  );
}

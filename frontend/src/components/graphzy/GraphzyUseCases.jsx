import React from 'react';
import { Card } from '../ui/Card';

export default function GraphzyUseCases({ onSelectQuery }) {
  const templates = [
    {
      tag: "math",
      query: "How does factor 'a' stretch a parabola y = ax²?",
    },
    {
      tag: "physics",
      query: "Simulate a projectile launch with customizable launch angle and velocity",
    },
    {
      tag: "chemistry",
      query: "Show a 2D water molecule H2O structure with bond angle and length parameters",
    },
    {
      tag: "math",
      query: "Compare sin(x) and 2*sin(x) amplitude changes",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full max-w-4xl mx-auto">
      {templates.map((item, idx) => (
        <Card 
          key={idx}
          variant="surface"
          onClick={() => onSelectQuery(item.query)}
          className="p-5 text-left cursor-pointer hover:border-[#0066CC] hover:-translate-y-0.5 hover:shadow-md duration-200"
        >
          <div className="font-mono text-[9px] font-bold tracking-wider uppercase text-[#0066CC] mb-2">{item.tag}</div>
          <div className="text-xs text-[#0F0F0F] font-semibold leading-normal">{item.query}</div>
        </Card>
      ))}
    </div>
  );
}

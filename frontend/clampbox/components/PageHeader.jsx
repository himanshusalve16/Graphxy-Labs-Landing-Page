import React from 'react';

export default function PageHeader({ prefix, title, subtitle }) {
  return (
    <div>
      <span className="font-mono text-[10px] font-bold text-[#0D9488] uppercase tracking-wider">{prefix}</span>
      <h1 className="font-serif text-2xl md:text-3xl text-zinc-900 font-light mt-1">{title}</h1>
      {subtitle && <p className="text-zinc-500 text-xs mt-1 font-sans">{subtitle}</p>}
    </div>
  );
}

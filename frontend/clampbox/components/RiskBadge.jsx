import React from 'react';

export default function RiskBadge({ score }) {
  const getRiskDetails = (s) => {
    const v = Number(s) || 0;
    if (v < 20) {
      return { 
        label: 'Low', 
        bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20', 
        dot: 'bg-emerald-500' 
      };
    } else if (v < 50) {
      return { 
        label: 'Medium', 
        bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20', 
        dot: 'bg-amber-500' 
      };
    } else if (v < 80) {
      return { 
        label: 'High', 
        bg: 'bg-orange-500/10 text-orange-700 border-orange-500/20', 
        dot: 'bg-orange-500' 
      };
    } else {
      return { 
        label: 'Critical', 
        bg: 'bg-red-500/10 text-red-700 border-red-500/20', 
        dot: 'bg-red-500' 
      };
    }
  };

  const details = getRiskDetails(score);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${details.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${details.dot}`} />
      <span>{details.label} ({score})</span>
    </span>
  );
}

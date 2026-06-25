import React from 'react';

export default function GatewayStatusPill({ status }) {
  const getStatusDetails = (s) => {
    const val = (s || '').toLowerCase();
    switch (val) {
      case 'active':
      case 'enabled':
        return { 
          label: 'Active', 
          bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20', 
          dot: 'bg-emerald-500' 
        };
      case 'inactive':
      case 'disabled':
        return { 
          label: 'Inactive', 
          bg: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20', 
          dot: 'bg-zinc-400' 
        };
      case 'revoked':
      case 'deleted':
        return { 
          label: 'Revoked', 
          bg: 'bg-red-500/10 text-red-700 border-red-500/20', 
          dot: 'bg-red-500' 
        };
      default:
        return { 
          label: s || 'Unknown', 
          bg: 'bg-zinc-100 text-zinc-600 border-zinc-200', 
          dot: 'bg-zinc-400' 
        };
    }
  };

  const details = getStatusDetails(status);

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] font-mono font-bold uppercase tracking-wider ${details.bg}`}>
      <span className={`w-1 h-1 rounded-full ${details.dot}`} />
      <span>{details.label}</span>
    </span>
  );
}

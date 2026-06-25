import React from 'react';

export default function PolicyActionBadge({ action }) {
  const getActionDetails = (act) => {
    const a = (act || '').toLowerCase();
    switch (a) {
      case 'allow':
        return { 
          label: 'Allow', 
          bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20', 
          dot: 'bg-emerald-500' 
        };
      case 'warn':
        return { 
          label: 'Warn', 
          bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20', 
          dot: 'bg-amber-500' 
        };
      case 'redact':
        return { 
          label: 'Redact', 
          bg: 'bg-orange-500/10 text-orange-700 border-orange-500/20', 
          dot: 'bg-orange-500' 
        };
      case 'block':
        return { 
          label: 'Block', 
          bg: 'bg-red-500/10 text-red-700 border-red-500/20', 
          dot: 'bg-red-500' 
        };
      case 'log_only':
      case 'log-only':
      case 'logonly':
        return { 
          label: 'Log Only', 
          bg: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20', 
          dot: 'bg-zinc-500' 
        };
      default:
        return { 
          label: act || 'Unknown', 
          bg: 'bg-zinc-100 text-zinc-600 border-zinc-200', 
          dot: 'bg-zinc-400' 
        };
    }
  };

  const details = getActionDetails(action);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${details.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${details.dot}`} />
      <span>{details.label}</span>
    </span>
  );
}

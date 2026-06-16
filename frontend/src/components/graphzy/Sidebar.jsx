import React from 'react';
import { Layers, Clock, LayoutGrid, User } from 'lucide-react';

export default function Sidebar({ activeView, onViewChange }) {
  const navItems = [
    { id: 'ask', label: 'Ask', icon: Layers },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'dashboard', label: 'Dash', icon: LayoutGrid },
    { id: 'account', label: 'Account', icon: User }
  ];

  return (
    <aside className="w-full md:w-[68px] bg-[#FAFAF8]/92 backdrop-blur-md border-b md:border-b-0 md:border-r border-black/[0.06] flex md:flex-col items-center justify-around md:justify-start py-3 md:py-6 gap-2 md:gap-6 sticky top-[54px] h-auto md:h-[calc(100vh-54px)] z-10">
      {navItems.map(item => {
        const Icon = item.icon;
        const active = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none w-12 py-2 rounded-lg text-[#A3A3A3] hover:text-[#525252] hover:bg-black/[0.02] duration-150 ${
              active ? 'bg-[#EBF3FF] text-[#0066CC] hover:bg-[#EBF3FF] hover:text-[#0066CC]' : ''
            }`}
          >
            <Icon size={20} className={active ? 'stroke-[#0066CC]' : 'stroke-current'} />
            <span className={`text-[8px] font-mono font-semibold uppercase tracking-wider ${
              active ? 'text-[#0066CC]' : 'text-[#A3A3A3]'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}

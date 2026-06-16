import React, { useEffect, useState } from 'react';
import GraphzyHero from './GraphzyHero';
import GraphzyUseCases from './GraphzyUseCases';
import { Search, ArrowUp } from 'lucide-react';

export default function AskView({ onSubmitQuery }) {
  const [query, setQuery] = useState('');
  const placeholders = [
    "Explain how amplitude changes sin(x)...",
    "How does factor 'a' stretch a parabola y = ax²?",
    "Plot a cubic equation y = x³ - 3x and show roots",
    "Show how vertical shift 'c' moves a parabola y = x² + c"
  ];
  const [placeHolderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmitQuery(query.trim());
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col items-center py-6 md:py-10">
      <GraphzyHero />
      
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white border-2 border-black/5 rounded-2xl p-4 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)] focus-within:border-[#0066CC] focus-within:ring-4 focus-within:ring-[#EBF3FF] transition-all">
        <div className="w-8 h-8 rounded-full bg-[#EBF3FF] text-[#0066CC] flex items-center justify-center flex-shrink-0">
          <Search size={18} strokeWidth={2.5} />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholders[placeHolderIdx]}
          className="flex-1 border-none bg-transparent outline-none font-sans text-base text-[#0f0f0f] placeholder-black/30 italic"
          autoComplete="off"
        />
        <button type="submit" className="w-8 h-8 rounded-full bg-[#0066CC] text-white flex items-center justify-center border-none cursor-pointer flex-shrink-0 hover:bg-[#0057AA] active:scale-95 duration-150">
          <ArrowUp size={16} strokeWidth={3} />
        </button>
      </form>

      <GraphzyUseCases onSelectQuery={onSubmitQuery} />
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, Compass, BookOpen, Atom, HelpCircle, Activity } from 'lucide-react';
import { stemTopics } from '../../data/stemTopics';
import { MathRenderer } from './MathRenderer';

export default function ExplorerView({ onSelectTopic }) {
  const [activeSubject, setActiveSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const hashSub = hash.startsWith('#explore/') ? hash.substring(9) : 'all';
      if (['all', 'math', 'physics', 'chemistry', 'biology'].includes(hashSub)) {
        setActiveSubject(hashSub);
      } else {
        setActiveSubject('all');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const subjects = [
    { id: 'all', label: 'All Subjects', icon: Compass },
    { id: 'math', label: 'Mathematics', icon: BookOpen, tag: 'math' },
    { id: 'physics', label: 'Physics', icon: Activity, tag: 'phys' },
    { id: 'chemistry', label: 'Chemistry', icon: Atom, tag: 'chem' },
    { id: 'biology', label: 'Biology', icon: HelpCircle, tag: 'bio' }
  ];

  // Flatten all topics to a single array for rendering
  const allTopicsList = [];
  Object.keys(stemTopics).forEach(sub => {
    stemTopics[sub].forEach(topic => {
      allTopicsList.push({ ...topic, subjectId: sub });
    });
  });

  // Filter topics based on active subject and search query
  const filteredTopics = allTopicsList.filter(topic => {
    const matchesSubject = activeSubject === 'all' || topic.subjectId === activeSubject;
    const matchesSearch = 
      topic.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.keyIdea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.concepts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-6 py-4">
      {/* 1. Header Area with Active Development Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-serif text-2xl font-light text-[#0f0f0f]">STEM Topic Explorer</h1>
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[8px] font-mono font-bold text-blue-800 tracking-wide uppercase border border-blue-200">
              Interactive Prototype
            </span>
          </div>
          <p className="text-xs text-[#525252] leading-relaxed">
            Select a specialized topic model below to explore concepts dynamically, view properties, and trace calculations.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics or concepts..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-black/5 focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] focus:outline-none transition-all placeholder:text-black/30"
          />
        </div>
      </div>

      {/* 2. Subject Segmented Selector */}
      <div className="flex flex-wrap gap-2 bg-black/[0.02] p-1 rounded-xl border border-black/[0.03] self-start">
        {subjects.map(sub => {
          const Icon = sub.icon;
          const active = activeSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => { window.location.hash = sub.id === 'all' ? '#explore' : '#explore/' + sub.id; }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold rounded-lg border-0 cursor-pointer duration-150 ${
                active 
                  ? 'bg-white text-[#0066CC] shadow-xs' 
                  : 'bg-transparent text-[#525252] hover:text-black hover:bg-black/[0.02]'
              }`}
            >
              <Icon size={12} className={active ? 'text-[#0066CC]' : 'text-black/40'} />
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* 3. Topics Grid */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-16 bg-white border border-black/5 rounded-2xl flex flex-col items-center justify-center">
          <BookOpen size={28} className="text-black/20 mb-2" />
          <p className="text-sm font-semibold text-[#525252]">No topics found matching your query.</p>
          <p className="text-xs text-black/40 mt-1">Try searching for other concepts like "sine", "projectile", or "covalent".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map(topic => (
            <Card 
              key={topic.topicKey}
              variant="surface"
              className="p-5 flex flex-col justify-between gap-4 bg-white border-black/5 hover:border-[#0066CC]/20 hover:shadow-sm duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Tag variant={topic.subjectId === 'physics' ? 'phys' : topic.subjectId === 'chemistry' ? 'chem' : topic.subjectId === 'biology' ? 'bio' : 'math'}>
                    {topic.subjectId === 'math' ? 'Mathematics' : topic.subjectId === 'physics' ? 'Physics' : topic.subjectId === 'chemistry' ? 'Chemistry' : topic.subjectId === 'biology' ? 'Biology' : topic.subjectId}
                  </Tag>
                  <span className="font-mono text-[8px] text-black/30 uppercase tracking-widest">
                    {topic.visualStyle.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-serif text-base font-semibold text-[#0F0F0F] mb-1">
                  {topic.displayName}
                </h3>
                
                <p className="font-sans text-[11px] text-[#A3A3A3] font-semibold mb-3">
                  {topic.keyIdea}
                </p>

                {topic.equation && (
                  <div className="bg-[#F8F8F6] border border-black/[0.03] rounded-lg p-2.5 font-mono text-[10px] text-black/75 mb-3 select-none flex items-center justify-between">
                    <span className="truncate max-w-[80%] overflow-x-auto py-0.5">
                      <MathRenderer text={topic.equation} inline={true} />
                    </span>
                    <span className="text-[8px] font-mono text-black/35 uppercase font-bold tracking-wider flex-shrink-0">equation</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {topic.concepts.map((concept, idx) => (
                    <span 
                      key={idx} 
                      className="font-mono text-[8px] bg-black/[0.03] text-[#525252] px-1.5 py-0.5 rounded border border-black/[0.02]"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-black/[0.04] pt-3 mt-1">
                <span className="font-mono text-[9px] text-black/40">
                  {topic.sliders.length} interactive parameter{topic.sliders.length > 1 ? 's' : ''}
                </span>
                <Button 
                  variant="graphzy" 
                  onClick={() => { window.location.hash = '#topic/' + topic.topicKey; }}
                  className="text-[11px] py-1.5 px-3.5 flex items-center gap-1"
                >
                  Launch Simulator
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

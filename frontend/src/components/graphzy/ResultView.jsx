import React, { useRef, useEffect, useState } from 'react';
import { Tag } from '../ui/Tag';
import { Card } from '../ui/Card';
import GraphzyPreview from './GraphzyPreview';
import { ArrowLeft, Send } from 'lucide-react';

export default function ResultView({ activeSession, followUpCount, onBack, onSendFollowUp, onSliderChange }) {
  const [followUpQuery, setFollowUpQuery] = useState('');
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [activeSession?.messages]);

  if (!activeSession) return null;

  const { query, topic, messages } = activeSession;
  const isLimitReached = followUpCount >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (followUpQuery.trim() && !isLimitReached) {
      onSendFollowUp(followUpQuery.trim());
      setFollowUpQuery('');
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 border-b border-black/[0.06] mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 font-sans text-xs font-semibold text-[#A3A3A3] hover:text-[#525252] bg-transparent border-none cursor-pointer self-start"
        >
          <ArrowLeft size={14} /> New Question
        </button>
        <div className="flex items-center gap-3">
          <Tag variant={topic.subject === 'physics' ? 'phys' : topic.subject === 'chemistry' ? 'chem' : 'math'}>
            {topic.subject || 'math'}
          </Tag>
          <span className="text-xs font-medium text-[#525252] truncate max-w-sm sm:max-w-md">"{query}"</span>
        </div>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Visual Canvas */}
        <div className="lg:col-span-7 w-full">
          <GraphzyPreview 
            topic={topic}
            equation={topic.equation}
            sliders={topic.sliders}
            onSliderChange={onSliderChange}
          />
        </div>

        {/* Right Explanation Card */}
        <Card variant="glass" className="lg:col-span-5 p-7 flex flex-col bg-white/90 border-white shadow-md">
          <h2 className="font-serif text-lg md:text-xl text-[#0F0F0F] mb-3 leading-normal font-normal">
            {topic.keyIdea}
          </h2>
          <p className="text-sm text-[#525252] leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: topic.summary }} />

          {/* Follow-up suggestions */}
          <div className="font-mono text-[9px] font-semibold tracking-wider uppercase text-black/40 mb-3">
            Continue Exploring
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {topic.followUps.map((txt, idx) => (
              <button
                key={idx}
                disabled={isLimitReached}
                onClick={() => onSendFollowUp(txt)}
                className="font-sans text-[12px] font-medium text-[#525252] border border-black/5 rounded-full px-3 py-1.5 bg-white hover:border-black/15 hover:shadow-sm cursor-pointer disabled:pointer-events-none disabled:opacity-50 transition-all"
              >
                {txt}
              </button>
            ))}
          </div>

          {/* Conversation Thread history */}
          {messages && messages.length > 0 && (
            <div 
              ref={threadRef}
              className="flex flex-col gap-3 max-h-[200px] overflow-y-auto mb-6 border-t border-black/[0.06] pt-4 pr-1 scrollbar-thin"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#EEF3FB] text-[#1B3A6B] self-end rounded-br-sm'
                      : 'bg-black/[0.03] text-[#0f0f0f] self-start rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          )}

          {/* Form input */}
          <div className="flex flex-col gap-1.5 mt-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2.5 bg-white border border-black/10 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-[#0066CC]">
              <input 
                type="text"
                value={followUpQuery}
                onChange={(e) => setFollowUpQuery(e.target.value)}
                placeholder={isLimitReached ? "Follow-up limit reached. Start new question." : "Ask a follow-up query..."}
                disabled={isLimitReached}
                className="flex-1 border-none bg-transparent outline-none font-sans text-xs text-[#0f0f0f] placeholder-black/30 disabled:cursor-not-allowed"
                autoComplete="off"
              />
              <button 
                type="submit"
                disabled={isLimitReached || !followUpQuery.trim()}
                className="bg-transparent border-none text-black/30 hover:text-[#0066CC] disabled:text-black/10 cursor-pointer flex items-center justify-center transition-colors"
                aria-label="Send follow up"
              >
                <Send size={15} />
              </button>
            </form>
            <div className={`font-mono text-[9px] text-right ${
              isLimitReached ? 'text-[#92400E] font-semibold' : 'text-black/40'
            }`}>
              {followUpCount} of 6 follow-ups used
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

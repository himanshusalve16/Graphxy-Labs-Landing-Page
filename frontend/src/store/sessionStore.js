import { create } from 'zustand';

export const useSessionStore = create((set) => ({
  activeSession: null, // { query, topic, messages }
  followUpCount: 0,
  isThinking: false,
  thinkingText: "Analyzing question...",

  setActiveSession: (session) => set({ activeSession: session }),
  setFollowUpCount: (count) => set({ followUpCount: count }),
  setIsThinking: (thinking) => set({ isThinking: thinking }),
  setThinkingText: (text) => set({ thinkingText: text }),
  
  resetSession: () => set({ activeSession: null, followUpCount: 0, isThinking: false })
}));

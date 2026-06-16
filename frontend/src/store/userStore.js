import { create } from 'zustand';

export const useUserStore = create((set) => ({
  history: [],
  dashboardConcepts: [],
  dashboardWeakAreas: [],
  authEmail: null,

  setHistory: (history) => set({ history }),
  setDashboardConcepts: (concepts) => set({ dashboardConcepts: concepts }),
  setDashboardWeakAreas: (weakAreas) => set({ dashboardWeakAreas: weakAreas }),
  setAuthEmail: (email) => set({ authEmail: email }),

  loadHistoryFromStorage: () => {
    const raw = localStorage.getItem("gz_history");
    if (!raw) {
      const seeded = [
        {
          id: "seed_1",
          query: "How does factor 'a' stretch a parabola y = ax²?",
          topicKey: "parabola",
          date: "Jun 14, 2026",
          time: "10:30 AM",
          subject: "Math",
          concepts: ["quadratic functions", "vertical stretch", "parabola vertex"]
        },
        {
          id: "seed_2",
          query: "Compare sin(x) and 2*sin(x) amplitude changes",
          topicKey: "sine",
          date: "Jun 12, 2026",
          time: "4:15 PM",
          subject: "Math",
          concepts: ["trigonometric functions", "amplitude", "wave frequency"]
        }
      ];
      localStorage.setItem("gz_history", JSON.stringify(seeded));
      set({ history: seeded });
      return seeded;
    }
    const historyList = JSON.parse(raw);
    set({ history: historyList });
    return historyList;
  },

  saveSessionToHistory: (topic, query, topicKey) => {
    const raw = localStorage.getItem("gz_history") || "[]";
    const history = JSON.parse(raw);

    const exists = history.some(item => item.query.toLowerCase() === query.toLowerCase());
    if (exists) return;

    const newItem = {
      id: Date.now().toString(),
      query,
      topicKey,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      subject: "Math",
      concepts: topic.concepts
    };

    const updated = [newItem, ...history];
    localStorage.setItem("gz_history", JSON.stringify(updated));
    set({ history: updated });
  },

  deleteHistoryItem: (id) => {
    const raw = localStorage.getItem("gz_history") || "[]";
    let history = JSON.parse(raw);
    history = history.filter(item => item.id !== id);
    localStorage.setItem("gz_history", JSON.stringify(history));
    set({ history });
  }
}));

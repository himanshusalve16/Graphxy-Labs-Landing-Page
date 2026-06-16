import React, { useState, useEffect } from 'react';
import PageShell from '../components/layout/PageShell';
import Sidebar from '../components/graphzy/Sidebar';
import AskView from '../components/graphzy/AskView';
import ResultView from '../components/graphzy/ResultView';
import GraphzyFeatures from '../components/graphzy/GraphzyFeatures';
import { useSessionStore } from '../store/sessionStore';
import { useUserStore } from '../store/userStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tag } from '../components/ui/Tag';
import { Divider } from '../components/ui/Divider';
import { Sparkles, Clock, LayoutGrid, CheckCircle, AlertCircle, RefreshCw, LogOut, ArrowRight, BookOpen } from 'lucide-react';

export default function Graphzy() {
  const [activeView, setActiveView] = useState('ask');
  
  // Zustand Stores
  const { 
    activeSession, 
    followUpCount, 
    isThinking, 
    thinkingText, 
    setActiveSession, 
    setFollowUpCount, 
    setIsThinking, 
    setThinkingText, 
    resetSession 
  } = useSessionStore();

  const { 
    history, 
    authEmail, 
    loadHistoryFromStorage, 
    saveSessionToHistory, 
    deleteHistoryItem, 
    setAuthEmail 
  } = useUserStore();

  // Local Auth Form State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authMsg, setAuthMsg] = useState(null);

  useEffect(() => {
    loadHistoryFromStorage();
  }, []);

  // Heuristic mock topic responses
  const getMockTopic = (query) => {
    const q = query.toLowerCase();
    if (q.includes('sin') || q.includes('amplitude') || q.includes('wave') || q.includes('trig')) {
      return {
        topicKey: "sine",
        equation: "y = a * \\sin(x)",
        keyIdea: "The amplitude stretch factor scaling the heights of trigonometric wave troughs and peaks.",
        summary: "Multiplying the sine function by a constant factor <code>a</code> scales the amplitude. A larger value stretches the wave vertically, while values between 0 and 1 compress it. A negative factor flips the wave across the x-axis.",
        concepts: ["trigonometric functions", "amplitude", "wave frequency"],
        sliders: [{ id: 'a', label: 'Amplitude (a)', min: -5, max: 5, step: 0.1, val: 1.0 }],
        followUps: ["What if amplitude is 0?", "What happens if a is negative?", "Show me cos(x) instead"]
      };
    } else if (q.includes('parabola') || q.includes('quadratic') || q.includes('stretch') || q.includes('ax²') || q.includes('ax^2')) {
      return {
        topicKey: "parabola",
        equation: "y = a * x^2",
        keyIdea: "The leading coefficient 'a' dictates the vertical scale and opening direction of a quadratic parabola.",
        summary: "Changing the stretch factor <code>a</code> alters how narrow or wide the parabola opens. If <code>|a| &gt; 1</code>, it grows narrower (steeper). If <code>0 &lt; |a| &lt; 1</code>, it widens. If <code>a</code> is negative, the parabola points downwards.",
        concepts: ["quadratic functions", "vertical stretch", "parabola vertex"],
        sliders: [{ id: 'a', label: 'Stretch (a)', min: -5, max: 5, step: 0.1, val: 1.0 }],
        followUps: ["What if a is negative?", "What is the vertex?", "Add a horizontal shift"]
      };
    } else if (q.includes('cubic') || q.includes('x³') || q.includes('x^3') || q.includes('roots')) {
      return {
        topicKey: "cubic",
        equation: "y = x^3 - a * x",
        keyIdea: "Cubic polynomials have up to three real roots where the curve crosses the horizontal x-axis.",
        summary: "This cubic equation is of the form <code>y = x³ - ax</code>. The parameter <code>a</code> controls the separation of the local maximum and minimum. When <code>a &gt; 0</code>, the curve bends to form two turning points and three roots.",
        concepts: ["polynomials", "cubic curves", "real roots"],
        sliders: [{ id: 'a', label: 'Separation (a)', min: -2, max: 5, step: 0.1, val: 3.0 }],
        followUps: ["Where are the turning points?", "What if a is negative?", "Find root coordinates"]
      };
    } else if (q.includes('shift') || q.includes('c') || q.includes('y = x² + c') || q.includes('y = x^2 + c')) {
      return {
        topicKey: "transformation",
        equation: "y = x^2 + c",
        keyIdea: "Adding a constant 'c' shifts the entire curve vertically along the y-axis without altering its shape.",
        summary: "In <code>y = x² + c</code>, <code>c</code> represents the vertical shift. When <code>c &gt; 0</code>, the parabola slides upwards. When <code>c &lt; 0</code>, it slides downwards. The vertex is always at <code>(0, c)</code>.",
        concepts: ["transformations", "vertical shift", "parabola vertex"],
        sliders: [{ id: 'c', label: 'Vertical Shift (c)', min: -5, max: 5, step: 0.1, val: 0.0 }],
        followUps: ["What if c is 0?", "Combine shift and stretch", "What is the domain?"]
      };
    } else {
      // Default fallback math
      return {
        topicKey: "custom_quadratic",
        equation: "y = a * x^2 + c",
        keyIdea: "Interactive exploration of parameterized quadratic functions.",
        summary: `You asked: "<strong>${query}</strong>". Here is an interactive graphing model graphing <code>y = ax² + c</code>. Adjust the parameters to see transformations in real-time.`,
        concepts: ["quadratic modeling", "parameter analysis", "graphing basics"],
        sliders: [
          { id: 'a', label: 'Stretch (a)', min: -5, max: 5, step: 0.1, val: 1.0 },
          { id: 'c', label: 'Shift (c)', min: -5, max: 5, step: 0.1, val: 0.0 }
        ],
        followUps: ["What if a is 0?", "Combine shift and stretch", "Reset parameters"]
      };
    }
  };

  const handleSubmitQuery = (queryText) => {
    setIsThinking(true);
    setThinkingText("Classifying concept domain...");
    
    // Simulate AI pipeline delay
    setTimeout(() => {
      setThinkingText("Synthesizing interactive formulas...");
      setTimeout(() => {
        const topic = getMockTopic(queryText);
        const session = {
          query: queryText,
          topic,
          messages: [
            { sender: 'ai', text: `Here is the visualizer for: "${queryText}". You can drag the sliders to observe transformations.` }
          ]
        };
        setActiveSession(session);
        setFollowUpCount(0);
        setIsThinking(false);
        saveSessionToHistory(topic, queryText, topic.topicKey);
        setActiveView('ask'); // stay or ensure in ask view
      }, 1000);
    }, 1000);
  };

  const handleSendFollowUp = (followUpText) => {
    if (!activeSession) return;
    
    // Add user message
    const updatedMessages = [...activeSession.messages, { sender: 'user', text: followUpText }];
    const nextCount = followUpCount + 1;
    setFollowUpCount(nextCount);

    setActiveSession({
      ...activeSession,
      messages: updatedMessages
    });

    setIsThinking(true);
    setThinkingText("Refining visual coordinates...");

    // Heuristics to update sliders on matching follow-ups
    setTimeout(() => {
      let aiText = "That's an interesting question. In this model, that parameter shifts the geometric limits. Adjust the sliders to see it shift.";
      let updatedTopic = { ...activeSession.topic };

      const fLower = followUpText.toLowerCase();
      if (fLower.includes('negative')) {
        // Find slide 'a' and make it negative
        updatedTopic.sliders = updatedTopic.sliders.map(sl => 
          sl.id === 'a' ? { ...sl, val: -2.0 } : sl
        );
        aiText = "Adjusting stretch parameter <code>a</code> to -2.0 has reflected the curve downwards and stretched it vertically. Note how it opens downwards.";
      } else if (fLower.includes('amplitude is 0') || fLower.includes('amplitude to 0') || fLower.includes('0')) {
        updatedTopic.sliders = updatedTopic.sliders.map(sl => 
          sl.id === 'a' ? { ...sl, val: 0.0 } : sl
        );
        aiText = "Setting the multiplier/amplitude <code>a = 0</code> collapses the entire wave or parabola into a flat line along the horizontal x-axis.";
      } else if (fLower.includes('c is 0')) {
        updatedTopic.sliders = updatedTopic.sliders.map(sl => 
          sl.id === 'c' ? { ...sl, val: 0.0 } : sl
        );
        aiText = "Setting the vertical translation parameter <code>c = 0</code> places the vertex exactly on the horizontal x-axis.";
      }

      setActiveSession({
        query: activeSession.query,
        topic: updatedTopic,
        messages: [...updatedMessages, { sender: 'ai', text: aiText }]
      });
      setIsThinking(false);
    }, 1200);
  };

  const handleSliderChange = (sliderId, value) => {
    if (!activeSession) return;
    
    // Keep internal active session sliders matching the visual state
    const updatedSliders = activeSession.topic.sliders.map(sl => 
      sl.id === sliderId ? { ...sl, val: value } : sl
    );

    setActiveSession({
      ...activeSession,
      topic: {
        ...activeSession.topic,
        sliders: updatedSliders
      }
    });
  };

  // Re-open past session from history
  const handleSelectHistory = (item) => {
    setIsThinking(true);
    setThinkingText("Restoring graphing states...");
    
    setTimeout(() => {
      const topic = getMockTopic(item.query);
      setActiveSession({
        query: item.query,
        topic,
        messages: [
          { sender: 'ai', text: `Restored session: "${item.query}". Use sliders to continue exploring.` }
        ]
      });
      setFollowUpCount(0);
      setIsThinking(false);
      setActiveView('ask');
    }, 800);
  };

  // Auth Submit Action
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setAuthMsg({ type: 'error', text: 'Email is required' });
      return;
    }
    setAuthMsg({ type: 'loading', text: 'Connecting with security core...' });
    
    setTimeout(() => {
      setAuthEmail(emailInput.trim());
      setAuthMsg({ type: 'success', text: isSignUpMode ? 'Account registered successfully!' : 'Signed in successfully!' });
      setEmailInput('');
      setPasswordInput('');
    }, 1200);
  };

  const handleLogout = () => {
    setAuthEmail(null);
    setAuthMsg(null);
    resetSession();
  };

  // Heuristic Concept Aggregation from history
  const getExploredConcepts = () => {
    const conceptsSet = new Set();
    history.forEach(item => {
      if (item.concepts) {
        item.concepts.forEach(c => conceptsSet.add(c));
      }
    });
    return Array.from(conceptsSet);
  };

  // Weak area heuristic: if followUpCount is > 1 for a history concept, mark as weak
  // (In simulation, we can flag 1 or 2 concepts from history as weak areas for UI richness)
  const getWeakAreas = () => {
    if (history.length === 0) return [];
    return [
      { concept: "vertical stretch", query: "Explain why negative values flip parabolas" },
      { concept: "amplitude", query: "Why does amplitude scale trigonometric heights?" }
    ].filter(() => history.length > 0);
  };

  return (
    <PageShell>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-54px)] bg-[#FAFAF8] text-[#0F0F0F]">
        
        {/* Left navigation sidebar */}
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        {/* Main Work View */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          
          {/* Thinking overlay */}
          {isThinking && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="animate-spin text-[#0066CC]" size={36} />
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-black/50">{thinkingText}</p>
            </div>
          )}

          {/* VIEW: ASK */}
          {activeView === 'ask' && (
            <>
              {activeSession ? (
                <ResultView 
                  activeSession={activeSession}
                  followUpCount={followUpCount}
                  onBack={resetSession}
                  onSendFollowUp={handleSendFollowUp}
                  onSliderChange={handleSliderChange}
                />
              ) : (
                <>
                  <AskView onSubmitQuery={handleSubmitQuery} />
                  <GraphzyFeatures />
                </>
              )}
            </>
          )}

          {/* VIEW: HISTORY */}
          {activeView === 'history' && (
            <div className="max-w-2xl mx-auto w-full py-4">
              <div className="flex items-center gap-2.5 mb-8">
                <Clock className="text-[#A3A3A3]" size={20} />
                <h1 className="font-serif text-2xl font-light text-[#0f0f0f]">Saved History</h1>
              </div>

              {history.length === 0 ? (
                <Card variant="surface" className="p-8 text-center bg-white border-black/5 flex flex-col items-center justify-center">
                  <AlertCircle size={28} className="text-[#A3A3A3] mb-3" />
                  <p className="text-sm font-medium text-[#525252]">No saved sessions yet.</p>
                  <p className="text-xs text-[#A3A3A3] mt-1">Submit a math query to populate your history.</p>
                  <Button variant="graphzy" onClick={() => setActiveView('ask')} className="mt-4 text-xs py-2">
                    Ask a Question
                  </Button>
                </Card>
              ) : (
                <div className="flex flex-col gap-4">
                  {history.map(item => (
                    <Card 
                      key={item.id}
                      variant="surface"
                      className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white hover:border-black/15 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Tag variant="math">{item.subject}</Tag>
                          <span className="font-mono text-[9px] text-[#A3A3A3]">{item.date} • {item.time}</span>
                        </div>
                        <h3 className="font-sans text-sm font-semibold text-[#0F0F0F] truncate">
                          "{item.query}"
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.concepts.map((c, i) => (
                            <span key={i} className="font-mono text-[8px] bg-black/[0.03] text-[#525252] px-1.5 py-0.5 rounded">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button 
                          variant="graphzy" 
                          onClick={() => handleSelectHistory(item)}
                          className="text-xs py-1.5 px-3.5"
                        >
                          Reload
                        </Button>
                        <button 
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-xs font-semibold text-[#A3A3A3] hover:text-[#EF4444] bg-transparent border-none cursor-pointer px-2 py-1.5 duration-150"
                        >
                          Remove
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {activeView === 'dashboard' && (
            <div className="max-w-3xl mx-auto w-full py-4">
              <div className="flex items-center gap-2.5 mb-8">
                <LayoutGrid className="text-[#A3A3A3]" size={20} />
                <h1 className="font-serif text-2xl font-light text-[#0f0f0f]">Conceptual Analytics</h1>
              </div>

              {/* Subject Breakdown cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card variant="surface" className="p-5 border-l-4 border-l-[#0066CC] bg-white">
                  <div className="font-mono text-[9px] font-bold text-[#0066CC] uppercase tracking-wider mb-1">Math</div>
                  <div className="font-serif text-2xl text-[#0F0F0F] font-light">{history.length}</div>
                  <div className="text-[10px] text-[#A3A3A3] mt-1">topics explored</div>
                </Card>
                
                <Card variant="surface" className="p-5 bg-white/50 border-black/5 opacity-60">
                  <div className="font-mono text-[9px] font-bold text-[#A3A3A3] uppercase tracking-wider mb-1">Chemistry</div>
                  <div className="font-serif text-2xl text-black/25 font-light">—</div>
                  <div className="text-[10px] text-[#A3A3A3] mt-1">coming soon</div>
                </Card>

                <Card variant="surface" className="p-5 bg-white/50 border-black/5 opacity-60">
                  <div className="font-mono text-[9px] font-bold text-[#A3A3A3] uppercase tracking-wider mb-1">Biology</div>
                  <div className="font-serif text-2xl text-black/25 font-light">—</div>
                  <div className="text-[10px] text-[#A3A3A3] mt-1">coming soon</div>
                </Card>

                <Card variant="surface" className="p-5 bg-white/50 border-black/5 opacity-60">
                  <div className="font-mono text-[9px] font-bold text-[#A3A3A3] uppercase tracking-wider mb-1">Physics</div>
                  <div className="font-serif text-2xl text-black/25 font-light">—</div>
                  <div className="text-[10px] text-[#A3A3A3] mt-1">coming soon</div>
                </Card>
              </div>

              {/* Concepts explored list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <Card variant="surface" className="p-6 bg-white flex flex-col min-h-[220px]">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={16} className="text-[#0066CC]" />
                    <h3 className="font-serif text-base text-[#0F0F0F] font-medium">Concepts Mastered</h3>
                  </div>
                  {getExploredConcepts().length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                      <p className="text-xs text-[#A3A3A3]">Concepts will appear here as you visualize equations.</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 content-start">
                      {getExploredConcepts().map((concept, idx) => (
                        <span 
                          key={idx} 
                          className="text-[11px] font-sans font-medium text-[#525252] border border-black/5 bg-[#F8F8F6] px-2.5 py-1 rounded-full flex items-center gap-1.5"
                        >
                          <CheckCircle size={10} className="text-[#10B981]" />
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Heuristic Flagged Weak Areas */}
                <Card variant="surface" className="p-6 bg-white border-[#EF4444]/10 flex flex-col min-h-[220px]">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={16} className="text-[#EF4444]" />
                    <h3 className="font-serif text-base text-[#0F0F0F] font-medium">Recommended Review</h3>
                  </div>
                  {getWeakAreas().length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                      <p className="text-xs text-[#A3A3A3]">No weak areas flagged. You are exploring concepts smoothly.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {getWeakAreas().map((wa, idx) => (
                        <div 
                          key={idx}
                          className="flex justify-between items-center p-3 rounded-lg border border-black/5 bg-[#FAFAF8] gap-3"
                        >
                          <div className="min-w-0">
                            <div className="font-mono text-[9px] font-bold text-[#EF4444] uppercase mb-0.5">weak area</div>
                            <span className="font-sans text-xs font-semibold text-[#0F0F0F] block truncate">
                              {wa.concept}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              handleSubmitQuery(wa.query);
                            }}
                            className="flex-shrink-0 flex items-center gap-1 font-sans text-xs font-semibold text-[#0066CC] hover:text-[#0057AA] bg-transparent border-none cursor-pointer duration-150"
                          >
                            Explore <ArrowRight size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

              </div>
            </div>
          )}

          {/* VIEW: ACCOUNT */}
          {activeView === 'account' && (
            <div className="max-w-md mx-auto w-full py-4">
              {authEmail ? (
                // Logged In State
                <Card variant="surface" className="p-8 text-center bg-white">
                  <div className="w-16 h-16 rounded-full bg-[#EBF3FF] text-[#0066CC] font-serif text-2xl font-semibold flex items-center justify-center mx-auto mb-4 border border-black/[0.04]">
                    {authEmail.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="font-serif text-xl text-[#0F0F0F] font-normal mb-1">
                    Student Account
                  </h2>
                  <p className="text-xs text-[#A3A3A3] mb-6 font-mono">{authEmail}</p>

                  <div className="text-left bg-[#FAFAF8] rounded-xl p-4 border border-black/5 mb-8 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#A3A3A3]">Account Type</span>
                      <span className="font-semibold text-[#0F0F0F] font-mono">PILOT MEMBER</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#A3A3A3]">Ecosystem Access</span>
                      <span className="font-semibold text-[#0066CC] font-mono">ACTIVE (GRAPHZY)</span>
                    </div>
                  </div>

                  <Button variant="danger" onClick={handleLogout} className="w-full flex items-center justify-center gap-2">
                    <LogOut size={16} /> Sign Out
                  </Button>
                </Card>
              ) : (
                // Sign In / Sign Up Form
                <Card variant="surface" className="p-8 bg-white">
                  <div className="text-center mb-6">
                    <h2 className="font-serif text-2xl text-[#0F0F0F] font-light mb-1">
                      {isSignUpMode ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-xs text-[#525252] leading-normal">
                      {isSignUpMode 
                        ? 'Sign up to persist history and view custom learning analytics.' 
                        : 'Sign in to access your saved graphing history.'}
                    </p>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[11px] font-semibold text-[#525252]">Email Address</label>
                      <Input 
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="you@school.edu"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[11px] font-semibold text-[#525252]">Password</label>
                      <Input 
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <Button variant="graphzy" type="submit" className="w-full mt-2">
                      {isSignUpMode ? 'Register Account' : 'Sign In'}
                    </Button>

                    {authMsg && (
                      <div className={`text-center text-xs font-sans mt-2 ${
                        authMsg.type === 'error' ? 'text-[#EF4444]' : authMsg.type === 'success' ? 'text-[#10B981]' : 'text-[#A3A3A3]'
                      }`}>
                        {authMsg.text}
                      </div>
                    )}
                  </form>

                  <Divider className="my-6" />

                  <div className="text-center">
                    <button
                      onClick={() => {
                        setIsSignUpMode(!isSignUpMode);
                        setAuthMsg(null);
                      }}
                      className="font-sans text-xs font-semibold text-[#0066CC] hover:text-[#0057AA] bg-transparent border-none cursor-pointer duration-150"
                    >
                      {isSignUpMode ? 'Already have an account? Sign In' : 'New to Graphzy? Create an account'}
                    </button>
                  </div>
                </Card>
              )}
            </div>
          )}

        </main>
      </div>
    </PageShell>
  );
}

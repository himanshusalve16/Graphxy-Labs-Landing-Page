import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  Terminal, 
  Cpu, 
  RefreshCw, 
  Info,
  Sliders,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Divider } from '../../src/components/ui/Divider';
import { api } from '../services/api';
import LogoSvg from '../../src/assets/Logo.svg?react';

export default function SetupWizardModal({
  isOpen,
  onClose,
  onComplete
}) {
  const [step, setStep] = useState(1);
  const [gatewayName, setGatewayName] = useState('Chrome Companion Gateway');
  const [policyPreset, setPolicyPreset] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  
  // Test Bench State
  const [testPrompt, setTestPrompt] = useState('My email is admin@graphxylabs.dev and db key is AKIA1234567890ABCDEF');
  const [inspectResult, setInspectResult] = useState(null);
  const [inspecting, setInspecting] = useState(false);
  
  const [wizardError, setWizardError] = useState('');

  const totalSteps = 8;

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      setWizardError('');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setWizardError('');
    }
  };

  // Triggers API setup
  const handleGenerateOnboarding = async () => {
    setLoading(true);
    setWizardError('');
    try {
      const res = await api.setupOnboarding({ gatewayName, policyPreset });
      if (res.success) {
        setApiKey(res.key);
        setStep(4);
      }
    } catch (err) {
      setWizardError(`Setup failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Verifies extension session registration
  const handleVerifyConnection = async () => {
    setVerifying(true);
    setWizardError('');
    try {
      const res = await api.getDashboard();
      if (res.success && res.data.metrics.connectedBrowsers > 0) {
        setVerified(true);
        setStep(7); // auto advance to test inspection on verification success
      } else {
        setWizardError('No connected browser extensions detected. Please ensure the extension is installed, the Gateway Key is pasted, and Connect is clicked in the popup.');
      }
    } catch (err) {
      setWizardError(`Verification failed: ${err.message}`);
    } finally {
      setVerifying(false);
    }
  };

  // Run test inspection
  const handleTestInspect = async () => {
    if (!testPrompt.trim()) return;
    setInspecting(true);
    setInspectResult(null);
    setWizardError('');
    try {
      const apiHost = import.meta.env.VITE_GRAPHXY_API_BASE_URL || (window.location.origin.includes('localhost') ? 'http://localhost:5000/api/clampbox' : '/api/clampbox');
      const res = await fetch(`${apiHost}/risk/inspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Clampbox-Key': apiKey
        },
        body: JSON.stringify({
          text: testPrompt,
          provider: 'chatgpt',
          source: 'gateway'
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setInspectResult(json.data);
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setWizardError(`Test failed: ${errJson.error || 'Server error'}`);
      }
    } catch (err) {
      setWizardError(`Connection failed: ${err.message}`);
    } finally {
      setInspecting(false);
    }
  };

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => {
              if (step === totalSteps || step === 1) onClose();
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-xl bg-white border border-black/[0.06] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden z-10 font-sans p-6 md:p-8 min-h-[460px] flex flex-col justify-between"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/30"
              aria-label="Close modal"
            >
              <X size={15} />
            </button>

            {/* Error Message inside Wizard */}
            {wizardError && (
              <div className="absolute top-16 left-6 right-6 bg-red-50 border border-red-200/60 text-red-800 text-xs rounded-xl p-3 flex items-center gap-2 font-sans animate-fade-in z-20">
                <ShieldAlert size={14} className="text-red-650 flex-shrink-0" />
                <span>{wizardError}</span>
              </div>
            )}

            {/* Stepper Progress bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LogoSvg className="w-5 h-5" />
                <span className="font-serif text-sm font-semibold tracking-wide text-zinc-900">Clampbox Tutorial</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                Step {step} of {totalSteps}
              </span>
            </div>

            {/* Step Body */}
            <div className="flex-1 flex flex-col justify-center py-4">
              {step === 1 && (
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#0D9488] mb-1">
                    <Bot size={28} />
                  </div>
                  <h3 className="font-serif text-xl font-light text-zinc-950">Getting Started with Clampbox</h3>
                  <p className="text-zinc-500 text-xs max-w-sm leading-relaxed">
                    Clampbox is a real-time AI Security Gateway that intercepts browser LLM prompts, redacts PII/credentials, and logs compliance audits before data leaves your environment.
                  </p>
                  <Divider className="w-full my-2" />
                  <Button onClick={handleNextStep} className="w-full flex items-center justify-center gap-1.5 mt-2">
                    Let's Begin Setup
                    <ArrowRight size={13} />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 2: Create Gateway</span>
                    <h3 className="font-serif text-lg text-zinc-950 font-light mt-0.5">Label Your Security Proxy</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Gateway endpoints act as cryptographic tunnels. Provide a label description name.</p>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Gateway Label</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all h-11"
                      placeholder="e.g. Chrome Extension Gateway"
                      value={gatewayName}
                      onChange={(e) => setGatewayName(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <Button variant="ghost" size="sm" onClick={handlePrevStep}>Back</Button>
                    <Button onClick={handleNextStep} disabled={!gatewayName.trim()} size="sm" className="flex items-center gap-1">
                      Continue
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 3: Select Policy</span>
                    <h3 className="font-serif text-lg text-zinc-950 font-light mt-0.5">Choose Policy Preset</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Select a template matching your security requirements. You can customize rules later.</p>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    {/* Preset STRICT */}
                    <div 
                      onClick={() => setPolicyPreset('strict')}
                      className={`p-3 border rounded-xl cursor-pointer transition-all flex items-start gap-3 hover:border-zinc-300 ${policyPreset === 'strict' ? 'border-[#0D9488] bg-[#0D9488]/[0.01]' : 'border-zinc-200 bg-white'}`}
                    >
                      <div className={`p-1.5 rounded-lg ${policyPreset === 'strict' ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-zinc-100 text-zinc-400'}`}>
                        <ShieldAlert size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-950">STRICT Preset</span>
                          <span className="font-mono text-[8px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">Max Security</span>
                        </div>
                        <p className="text-zinc-500 text-[10px] mt-0.5">Instantly blocks all cloud keys, certificates, database credentials, and PII.</p>
                      </div>
                    </div>

                    {/* Preset STANDARD */}
                    <div 
                      onClick={() => setPolicyPreset('standard')}
                      className={`p-3 border rounded-xl cursor-pointer transition-all flex items-start gap-3 hover:border-zinc-300 ${policyPreset === 'standard' ? 'border-[#0D9488] bg-[#0D9488]/[0.01]' : 'border-zinc-200 bg-white'}`}
                    >
                      <div className={`p-1.5 rounded-lg ${policyPreset === 'standard' ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-zinc-100 text-zinc-400'}`}>
                        <SlidersHorizontal size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-950">STANDARD Preset</span>
                          <span className="font-mono text-[8px] bg-teal-50 text-[#0D9488] px-1.5 py-0.5 rounded font-bold uppercase">Recommended</span>
                        </div>
                        <p className="text-zinc-500 text-[10px] mt-0.5">Redacts emails/phones. Blocks cloud tokens. Perfect workflow balance.</p>
                      </div>
                    </div>

                    {/* Preset RELAXED */}
                    <div 
                      onClick={() => setPolicyPreset('relaxed')}
                      className={`p-3 border rounded-xl cursor-pointer transition-all flex items-start gap-3 hover:border-zinc-300 ${policyPreset === 'relaxed' ? 'border-[#0D9488] bg-[#0D9488]/[0.01]' : 'border-zinc-200 bg-white'}`}
                    >
                      <div className={`p-1.5 rounded-lg ${policyPreset === 'relaxed' ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-zinc-100 text-zinc-400'}`}>
                        <Info size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-950">RELAXED Preset</span>
                          <span className="font-mono text-[8px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-bold uppercase">Minimal</span>
                        </div>
                        <p className="text-zinc-500 text-[10px] mt-0.5">Warns on credentials and redacts emails. Intended for personal sandboxes.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Button variant="ghost" size="sm" onClick={handlePrevStep}>Back</Button>
                    <Button onClick={handleGenerateOnboarding} disabled={loading} size="sm" className="flex items-center gap-1.5">
                      {loading ? 'Generating Key...' : 'Generate Gateway'}
                      {!loading && <ArrowRight size={12} />}
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 4: Copy Gateway Key</span>
                    <h3 className="font-serif text-lg text-zinc-950 font-light mt-0.5">Copy API Key Token</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Copy this API token now. You will paste this key to connect the browser companion extension.</p>
                  </div>

                  <div className="bg-zinc-950 text-teal-400 p-4 rounded-xl font-mono text-xs md:text-sm break-all border border-zinc-800 flex items-center justify-between gap-4 mt-2">
                    <span className="select-all tracking-tight leading-relaxed">{apiKey}</span>
                    <Button 
                      onClick={copyToClipboard}
                      size="sm"
                      className={`flex-shrink-0 font-sans font-bold flex items-center gap-1.5 min-w-[80px] justify-center ${copiedKey ? 'bg-emerald-600 text-white' : 'bg-zinc-850 border-zinc-700 text-white hover:bg-zinc-800'}`}
                    >
                      {copiedKey ? (
                        <>
                          <Check size={12} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-start gap-2 bg-zinc-50 border border-zinc-200/50 p-3 rounded-lg text-[10.5px] text-zinc-500 leading-relaxed font-sans">
                    <Info size={14} className="text-[#0D9488] flex-shrink-0 mt-0.5" />
                    <span>Store this key securely. It authorizes prompt inspections from browser extensions. You will not see it again.</span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Button variant="ghost" size="sm" disabled>Back</Button>
                    <Button onClick={handleNextStep} size="sm" className="flex items-center gap-1">
                      Key Copied
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 5: Install Extension</span>
                    <h3 className="font-serif text-lg text-zinc-950 font-light mt-0.5">Load Chrome Companion</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Install the security proxy inside Chrome to monitor AI workflows.</p>
                  </div>

                  <div className="flex flex-col gap-3 text-xs leading-relaxed font-sans text-zinc-650 mt-2">
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-[#0D9488] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                      <p>Navigate to Chrome Extension Settings (<code className="bg-zinc-100 text-zinc-700 px-1 py-0.5 rounded font-mono">chrome://extensions</code>) and toggle <strong>Developer Mode</strong> at the top right.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-[#0D9488] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                      <p>Click <strong>Load Unpacked</strong> and select the directory: <code className="bg-zinc-100 text-zinc-700 px-1 py-0.5 rounded font-mono">frontend/clampbox/extension</code>.</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <Button variant="ghost" size="sm" onClick={() => setStep(4)}>Back</Button>
                    <Button onClick={handleNextStep} size="sm" className="flex items-center gap-1">
                      Extension Loaded
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 6: Connect Extension</span>
                    <h3 className="font-serif text-lg text-zinc-950 font-light mt-0.5">Link Gateway Key</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Paste the key inside the extension popup and click Connect Gateway to sync policies.</p>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between border border-zinc-200 p-4 rounded-xl bg-zinc-50/20">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${verified ? 'bg-emerald-500 animate-none' : 'bg-red-400 animate-pulse'}`} />
                        <span className="text-xs font-semibold text-zinc-700">
                          {verified ? 'Extension Linked Successfully!' : 'Waiting for Extension Connection...'}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleVerifyConnection}
                        disabled={verifying || verified}
                        className="flex items-center gap-1.5"
                      >
                        <RefreshCw size={12} className={verifying ? 'animate-spin' : ''} />
                        Verify
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <Button variant="ghost" size="sm" onClick={() => setStep(5)}>Back</Button>
                    <Button onClick={handleNextStep} disabled={!verified} size="sm" className="flex items-center gap-1">
                      Test Inspection
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 7: Test Inspection</span>
                    <h3 className="font-serif text-lg text-zinc-950 font-light mt-0.5">Try a Sandbox Check</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Enter sample PII or credentials below to inspect the redirection rule live.</p>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    <textarea
                      className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all h-16 resize-none font-sans"
                      value={testPrompt}
                      onChange={(e) => setTestPrompt(e.target.value)}
                    />
                    <Button 
                      size="sm" 
                      onClick={handleTestInspect}
                      disabled={inspecting || !testPrompt.trim()}
                      className="w-full flex items-center justify-center gap-2 h-10"
                    >
                      {inspecting ? 'Inspecting...' : 'Test Inspect Prompt'}
                      {!inspecting && <Terminal size={12} />}
                    </Button>
                  </div>

                  {inspectResult && (
                    <Card variant="surface" className={`p-3 border text-xs flex flex-col gap-2 animate-fade-in ${
                      inspectResult.action === 'block' ? 'border-red-500/20 bg-red-500/[0.01]' :
                      inspectResult.action === 'warn' ? 'border-yellow-500/20 bg-yellow-500/[0.01]' :
                      inspectResult.action === 'redact' ? 'border-teal-500/20 bg-teal-500/[0.01]' :
                      'border-zinc-200 bg-zinc-50/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 capitalize">
                          <span className={`w-2 h-2 rounded-full ${
                            inspectResult.action === 'block' ? 'bg-red-500' :
                            inspectResult.action === 'warn' ? 'bg-yellow-500' :
                            inspectResult.action === 'redact' ? 'bg-[#0D9488]' :
                            'bg-zinc-400'
                          }`} />
                          Action: <span className="font-mono text-zinc-950 font-bold uppercase">{inspectResult.action}</span>
                        </span>
                        <span className="font-mono text-[9px] font-bold text-zinc-400">Risk: {inspectResult.riskScore}/100</span>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 rounded font-mono text-[10.5px] break-all leading-relaxed max-h-16 overflow-y-auto">
                        {inspectResult.redactedText}
                      </div>
                    </Card>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <Button variant="ghost" size="sm" onClick={() => setStep(6)}>Back</Button>
                    <Button onClick={handleNextStep} disabled={!inspectResult} size="sm" className="flex items-center gap-1">
                      Continue
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              )}

              {step === 8 && (
                <div className="flex flex-col items-center text-center gap-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-1">
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="font-serif text-xl font-light text-zinc-950">Setup Complete!</h3>
                  <p className="text-zinc-500 text-xs max-w-sm leading-relaxed">
                    Your AI Security Gateway has been successfully configured. Any prompts sent in ChatGPT, Claude, or Gemini containing sensitive patterns will be intercepted.
                  </p>
                  <Divider className="w-full my-2" />
                  <Button onClick={handleFinish} className="w-full flex items-center justify-center gap-1.5 mt-2">
                    Go to Dashboard
                    <ShieldCheck size={13} />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

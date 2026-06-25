import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Divider } from '../../src/components/ui/Divider';
import { api } from '../services/api';
import LogoSvg from '../../src/assets/Logo.svg?react';
import {
  ShieldAlert,
  ShieldCheck,
  Key,
  Copy,
  Check,
  ArrowRight,
  Terminal,
  Cpu,
  ArrowLeft,
  RefreshCw,
  Search,
  Sliders,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [gatewayName, setGatewayName] = useState('Primary Browser Extension');
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

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'confirmation',
    confirmText: '',
    onConfirm: null,
    isLoading: false
  });

  const totalSteps = 6;

  const handleNextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Triggers API setup
  const handleGenerateOnboarding = async () => {
    setLoading(true);
    try {
      const res = await api.setupOnboarding({ gatewayName, policyPreset });
      if (res.success) {
        setApiKey(res.key);
        setStep(4);
      }
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Setup Failed',
        description: `Failed to configure onboarding context: ${err.message}`,
        confirmText: 'Dismiss',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
      });
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
    try {
      // Query dashboard metrics to see if any extension is connected
      const res = await api.getDashboard();
      if (res.success && res.data.metrics.connectedBrowsers > 0) {
        setVerified(true);
      } else {
        setModal({
          isOpen: true,
          type: 'warning',
          title: 'No Connection Detected',
          description: 'We could not detect your browser companion. Please ensure the extension is loaded, the Gateway API Key is pasted, and "Connect Gateway" has been clicked in the popup.',
          confirmText: 'Verify Again',
          onConfirm: () => {
            setModal(m => ({ ...m, isOpen: false }));
            handleVerifyConnection();
          }
        });
      }
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Verification Failed',
        description: `Failed to verify extension status: ${err.message}`,
        confirmText: 'Dismiss',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
      });
    } finally {
      setVerifying(false);
    }
  };

  // Run test inspection
  const handleTestInspect = async () => {
    if (!testPrompt.trim()) return;
    setInspecting(true);
    setInspectResult(null);
    try {
      // Test inspect prompt using the generated key via header authentication simulation
      const res = await fetch('http://localhost:5000/api/clampbox/risk/inspect', {
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
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Inspection Failed',
          description: `Test inspection failed: ${errJson.error || 'Server error'}`,
          confirmText: 'Dismiss',
          onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
        });
      }
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Connection Failed',
        description: `Could not connect to backend server: ${err.message}`,
        confirmText: 'Dismiss',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
      });
    } finally {
      setInspecting(false);
    }
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center text-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] mb-2 shadow-[0_4px_20px_rgba(13,148,136,0.1)]">
        <LogoSvg className="w-9 h-9" />
      </div>
      <h2 className="font-serif text-2xl md:text-3xl text-zinc-950 font-light tracking-tight">Welcome to Clampbox</h2>
      <p className="text-zinc-500 text-xs md:text-sm max-w-md font-sans leading-relaxed">
        Clampbox is a real-time AI Security Gateway by Graphxy Labs. It sits between your web browser and LLM providers (ChatGPT, Claude, Gemini) to inspect prompts, redact credentials, and enforce custom security policies before data leaks occur.
      </p>
      <Divider className="w-full my-2" />
      <Button onClick={handleNextStep} className="w-full flex items-center justify-center gap-2 mt-2">
        Let's Get Started
        <ArrowRight size={14} />
      </Button>
    </div>
  );

  const renderCreateGateway = () => (
    <div className="flex flex-col gap-5">
      <div>
        <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 2 of {totalSteps}</span>
        <h3 className="font-serif text-xl text-zinc-950 font-light mt-1">Configure Your First Gateway</h3>
        <p className="text-zinc-500 text-xs mt-1">Gateways act as secure proxy connectors. Give yours a descriptive name.</p>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Gateway Name</label>
        <input
          type="text"
          className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
          placeholder="e.g. Chrome Extension Gateway"
          value={gatewayName}
          onChange={(e) => setGatewayName(e.target.value)}
        />
      </div>

      <div className="flex gap-3 justify-between mt-4">
        <Button variant="ghost" size="sm" onClick={handlePrevStep}>Back</Button>
        <Button onClick={handleNextStep} disabled={!gatewayName.trim()} size="sm" className="flex items-center gap-1">
          Next Step
          <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );

  const renderChoosePolicy = () => (
    <div className="flex flex-col gap-5">
      <div>
        <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 3 of {totalSteps}</span>
        <h3 className="font-serif text-xl text-zinc-950 font-light mt-1">Select Default Policy Preset</h3>
        <p className="text-zinc-500 text-xs mt-1">Choose a policy template. You can customize, delete, or create more later.</p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {/* Preset STRICT */}
        <div 
          onClick={() => setPolicyPreset('strict')}
          className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 hover:border-zinc-300 ${policyPreset === 'strict' ? 'border-[#0D9488] bg-[#0D9488]/[0.02] shadow-[0_2px_12px_rgba(13,148,136,0.04)]' : 'border-zinc-200/80 bg-white'}`}
        >
          <div className={`p-2 rounded-lg ${policyPreset === 'strict' ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-zinc-100 text-zinc-400'}`}>
            <ShieldAlert size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950">STRICT Preset</span>
              <span className="font-mono text-[8px] bg-red-150 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">Max Security</span>
            </div>
            <p className="text-zinc-500 text-[10.5px] mt-1 leading-relaxed">Blocks all secrets, credentials, payment data, and PII instantly. Recommended for regulated or production environments.</p>
          </div>
        </div>

        {/* Preset STANDARD */}
        <div 
          onClick={() => setPolicyPreset('standard')}
          className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 hover:border-zinc-300 ${policyPreset === 'standard' ? 'border-[#0D9488] bg-[#0D9488]/[0.02] shadow-[0_2px_12px_rgba(13,148,136,0.04)]' : 'border-zinc-200/80 bg-white'}`}
        >
          <div className={`p-2 rounded-lg ${policyPreset === 'standard' ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-zinc-100 text-zinc-400'}`}>
            <SlidersHorizontal size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950">STANDARD Preset</span>
              <span className="font-mono text-[8px] bg-teal-150 text-[#0D9488] px-1.5 py-0.5 rounded font-bold uppercase">Recommended</span>
            </div>
            <p className="text-zinc-500 text-[10.5px] mt-1 leading-relaxed">Redacts sensitive emails/phones and blocks critical cloud keys. Perfect balance of workflow usability and governance.</p>
          </div>
        </div>

        {/* Preset RELAXED */}
        <div 
          onClick={() => setPolicyPreset('relaxed')}
          className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 hover:border-zinc-300 ${policyPreset === 'relaxed' ? 'border-[#0D9488] bg-[#0D9488]/[0.02] shadow-[0_2px_12px_rgba(13,148,136,0.04)]' : 'border-zinc-200/80 bg-white'}`}
        >
          <div className={`p-2 rounded-lg ${policyPreset === 'relaxed' ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-zinc-100 text-zinc-400'}`}>
            <Info size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950">RELAXED Preset</span>
              <span className="font-mono text-[8px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-bold uppercase">Minimal</span>
            </div>
            <p className="text-zinc-500 text-[10.5px] mt-1 leading-relaxed">Warns on credentials and redacts emails. Allows most prompt submissions. Intended for personal testing.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-between mt-4">
        <Button variant="ghost" size="sm" onClick={handlePrevStep}>Back</Button>
        <Button onClick={handleGenerateOnboarding} disabled={loading} size="sm" className="flex items-center gap-1.5">
          {loading ? 'Securing Gateway…' : 'Generate Gateway'}
          {!loading && <ArrowRight size={12} />}
        </Button>
      </div>
    </div>
  );

  const renderShowKey = () => (
    <div className="flex flex-col gap-5">
      <div>
        <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 4 of {totalSteps}</span>
        <h3 className="font-serif text-xl text-zinc-950 font-light mt-1">Copy Your Gateway Key</h3>
        <p className="text-zinc-500 text-xs mt-1">Copy this API token now. We will use this key to connect the browser companion extension.</p>
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

      <div className="flex items-start gap-2 bg-zinc-50 border border-zinc-200/50 p-3.5 rounded-lg text-[10.5px] text-zinc-500 leading-relaxed font-sans">
        <Info size={14} className="text-[#0D9488] flex-shrink-0 mt-0.5" />
        <span>Keep this key secure. It provides client authentication for your browser extensions and LLM APIs. You will not see it again.</span>
      </div>

      <div className="flex gap-3 justify-between mt-4">
        <Button variant="ghost" size="sm" disabled>Back</Button>
        <Button onClick={handleNextStep} size="sm" className="flex items-center gap-1">
          Install Extension
          <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );

  const renderInstallExtension = () => (
    <div className="flex flex-col gap-5">
      <div>
        <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 5 of {totalSteps}</span>
        <h3 className="font-serif text-xl text-zinc-950 font-light mt-1">Connect Extension Companion</h3>
        <p className="text-zinc-500 text-xs mt-1">Follow these fast integration steps to bind prompt interception.</p>
      </div>

      <div className="flex flex-col gap-3 text-xs leading-relaxed font-sans text-zinc-600 mt-2">
        <div className="flex gap-3 items-start">
          <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-[#0D9488] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
          <p>Load the unpacked extension directory (<code className="font-mono text-[10px] bg-zinc-100 px-1 py-0.5 rounded text-zinc-700">frontend/clampbox/extension</code>) inside Chrome Extensions Developer Mode.</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-[#0D9488] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
          <p>Click on the **Clampbox Guard** extension icon in your browser toolbar.</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-[#0D9488] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
          <p>Paste the copied key into the box and click **Connect Gateway**.</p>
        </div>
      </div>

      <Divider className="my-1" />

      <div className="flex items-center justify-between gap-4 mt-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${verified ? 'bg-emerald-500 animate-none' : 'bg-red-400 animate-pulse'}`} />
          <span className="text-xs font-semibold text-zinc-700">
            {verified ? 'Extension Linked Successfully!' : 'Waiting for Extension connection...'}
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
          Verify Connection
        </Button>
      </div>

      <div className="flex gap-3 justify-between mt-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(3)}>Back</Button>
        <Button onClick={handleNextStep} disabled={!verified} size="sm" className="flex items-center gap-1">
          Test Protection
          <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );

  const renderTestBench = () => (
    <div className="flex flex-col gap-4">
      <div>
        <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">Step 6 of {totalSteps}</span>
        <h3 className="font-serif text-xl text-zinc-950 font-light mt-1">Run Test Inspection</h3>
        <p className="text-zinc-500 text-xs mt-1">Type or submit text containing secrets or PII below to verify that policies block or redact them correctly.</p>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <textarea
          className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all h-20 resize-none font-sans"
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
        />
        <Button 
          size="sm" 
          onClick={handleTestInspect}
          disabled={inspecting || !testPrompt.trim()}
          className="w-full flex items-center justify-center gap-2"
        >
          {inspecting ? 'Inspecting...' : 'Test Inspect Prompt'}
          {!inspecting && <Terminal size={12} />}
        </Button>
      </div>

      {inspectResult && (
        <Card variant="surface" className={`p-4 border text-xs flex flex-col gap-2.5 animate-fade-in ${
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
              Action Applied: <span className="font-mono text-zinc-950 font-bold uppercase">{inspectResult.action}</span>
            </span>
            <span className="font-mono text-[9px] font-bold text-zinc-400">Risk Score: {inspectResult.riskScore}/100</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Inspected Output Preview:</span>
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 p-2.5 rounded font-mono text-[11px] break-all leading-relaxed max-h-24 overflow-y-auto">
              {inspectResult.redactedText}
            </div>
          </div>

          {inspectResult.labels && inspectResult.labels.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-zinc-400">Detections:</span>
              {inspectResult.labels.map(lbl => (
                <span key={lbl} className="bg-zinc-100 text-zinc-600 font-mono text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-zinc-200/50">
                  {lbl}
                </span>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="flex gap-3 justify-between mt-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(5)}>Back</Button>
        <Button 
          onClick={() => navigate('/clampbox/dashboard')} 
          size="sm" 
          disabled={!inspectResult} 
          className="flex items-center gap-1"
        >
          Finish Onboarding
          <ShieldCheck size={13} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#0D9488]/5 blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-zinc-200/40 blur-3xl -z-10" />

      <div className="w-full max-w-lg">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <LogoSvg className="w-5 h-5 text-[#0D9488]" style={{ color: '#0D9488' }} />
            <span className="font-serif text-sm font-semibold tracking-wide text-zinc-900">Clampbox</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Step Cards container */}
        <Card variant="surface" className="p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-black/[0.03] overflow-hidden min-h-[380px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              {step === 1 && renderWelcome()}
              {step === 2 && renderCreateGateway()}
              {step === 3 && renderChoosePolicy()}
              {step === 4 && renderShowKey()}
              {step === 5 && renderInstallExtension()}
              {step === 6 && renderTestBench()}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => !modal.isLoading && setModal(m => ({ ...m, isOpen: false }))}
        onConfirm={modal.onConfirm}
        title={modal.title}
        description={modal.description}
        type={modal.type}
        confirmText={modal.confirmText}
        isLoading={modal.isLoading}
      />
    </div>
  );
}

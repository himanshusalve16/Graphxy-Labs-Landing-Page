import React from 'react';
import CbLayout from '../components/CbLayout';
import { Card } from '../../src/components/ui/Card';
import { Divider } from '../../src/components/ui/Divider';
import { 
  BookOpen, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  Key, 
  Code,
  Info,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

export default function Docs() {
  return (
    <CbLayout>
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#0D9488] uppercase tracking-wider">Resources</span>
          <h1 className="font-serif text-2xl md:text-3xl text-zinc-900 font-light mt-1">Help & Documentation</h1>
          <p className="text-zinc-500 text-xs mt-1 font-sans">Learn how to load, configure, and integrate the Clampbox AI Security Gateway.</p>
        </div>

        {/* Section 1: Introduction */}
        <Card variant="surface" className="p-6 flex flex-col gap-4 border border-black/[0.03] shadow-[0_1px_3px_rgba(0,0,0,0.01)] bg-white rounded-xl">
          <div className="flex items-center gap-2 text-[#0D9488]">
            <BookOpen size={18} />
            <h3 className="font-serif text-base font-semibold text-zinc-950">Clampbox Overview</h3>
          </div>
          <p className="text-zinc-650 text-xs leading-relaxed font-sans">
            Clampbox sits transparently between your browser and various LLM providers (like ChatGPT, Claude, and Gemini) to monitor traffic, detect secrets/PII, and enforce security policies. Prompt inspections are evaluated on the local backend and decisions are stored for audit compliance.
          </p>
        </Card>

        {/* Section 2: Browser Companion Installation */}
        <Card variant="surface" className="p-6 flex flex-col gap-4 border border-black/[0.03] shadow-[0_1px_3px_rgba(0,0,0,0.01)] bg-white rounded-xl">
          <div className="flex items-center gap-2 text-[#0D9488]">
            <Cpu size={18} />
            <h3 className="font-serif text-base font-semibold text-zinc-950">Companion Extension Setup</h3>
          </div>
          <div className="flex flex-col gap-3 font-sans text-xs text-zinc-650">
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-[#0D9488] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
              <p>Navigate to Chrome Extension Settings (<code className="bg-zinc-100 text-zinc-700 px-1 py-0.5 rounded font-mono">chrome://extensions</code>) and toggle <strong>Developer Mode</strong> at the top right.</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-[#0D9488] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
              <p>Click <strong>Load Unpacked</strong> and select the directory: <code className="bg-zinc-100 text-zinc-700 px-1 py-0.5 rounded font-mono">frontend/clampbox/extension</code>.</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-[#0D9488] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
              <p>Open the extension popup in your browser toolbar, paste your active <strong>Gateway API Key</strong>, and click <strong>Connect Gateway</strong>.</p>
            </div>
          </div>
        </Card>

        {/* Section 3: API Reference */}
        <Card variant="surface" className="p-6 flex flex-col gap-4 border border-black/[0.03] shadow-[0_1px_3px_rgba(0,0,0,0.01)] bg-white rounded-xl">
          <div className="flex items-center gap-2 text-[#0D9488]">
            <Code size={18} />
            <h3 className="font-serif text-base font-semibold text-zinc-950">Inspect API Integration</h3>
          </div>
          <p className="text-zinc-650 text-xs leading-relaxed font-sans">
            To integrate prompt sanitization directly into your custom developer workflows, execute HTTP requests to the risk-inspect endpoint using your Gateway Key:
          </p>
          
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Inspect Endpoint</span>
            <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg font-mono text-xs border border-zinc-800 flex items-center justify-between">
              <span>POST https://api.graphxylabs.dev/clampbox/v1/risk/inspect</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Example curl request</span>
            <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono-[11px] border border-zinc-800 leading-relaxed overflow-x-auto whitespace-pre font-mono">
{`curl -X POST https://api.graphxylabs.dev/clampbox/v1/risk/inspect \\
  -H "Content-Type: application/json" \\
  -H "X-Clampbox-Key: cb_live_your_gateway_key" \\
  -d '{
    "text": "Send prompt containing email test@domain.com to chatgpt",
    "provider": "chatgpt",
    "source": "custom-agent"
  }'`}
            </div>
          </div>
        </Card>

        {/* Section 4: Policy Presets Description */}
        <Card variant="surface" className="p-6 flex flex-col gap-4 border border-black/[0.03] shadow-[0_1px_3px_rgba(0,0,0,0.01)] bg-white rounded-xl">
          <div className="flex items-center gap-2 text-[#0D9488]">
            <ShieldCheck size={18} />
            <h3 className="font-serif text-base font-semibold text-zinc-950">Default Policy Templates</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans mt-1">
            <div className="border border-zinc-200/60 p-4 rounded-xl bg-zinc-50/20 flex flex-col gap-1.5">
              <span className="font-bold text-zinc-900">Strict Preset</span>
              <p className="text-zinc-550 text-[11px] leading-relaxed">Hard-blocks all matching cloud keys, cryptographic files, database links, and personal data profiles. Strict threshold of 30+ risk score.</p>
            </div>
            <div className="border border-zinc-200/60 p-4 rounded-xl bg-zinc-50/20 flex flex-col gap-1.5">
              <span className="font-bold text-zinc-900">Standard Preset</span>
              <p className="text-zinc-550 text-[11px] leading-relaxed">Redacts personal email and phone markers. Hard-blocks primary cloud API tokens. Warns on moderate values (50+ risk).</p>
            </div>
            <div className="border border-zinc-200/60 p-4 rounded-xl bg-zinc-50/20 flex flex-col gap-1.5">
              <span className="font-bold text-zinc-900">Relaxed Preset</span>
              <p className="text-zinc-550 text-[11px] leading-relaxed">Warns on credentials and cryptographic files, allows standard prompts. Relaxed threshold of 70+ risk score.</p>
            </div>
          </div>
        </Card>
      </div>
    </CbLayout>
  );
}

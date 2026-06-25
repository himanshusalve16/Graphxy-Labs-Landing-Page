import React, { useEffect, useState, useCallback } from 'react';
import CbLayout from '../components/CbLayout';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Divider } from '../../src/components/ui/Divider';
import { 
  Lock, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Zap, 
  Bot, 
  Globe, 
  BrainCircuit,
  Fingerprint,
  Calendar,
  AlertTriangle,
  Globe2
} from 'lucide-react';

function ProviderIcon({ provider }) {
  const p = (provider || '').toLowerCase();
  switch (p) {
    case 'openai':
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
          <Bot size={16} />
        </div>
      );
    case 'anthropic':
      return (
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-700">
          <BrainCircuit size={16} />
        </div>
      );
    case 'gemini':
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
          <Sparkles size={16} />
        </div>
      );
    case 'groq':
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
          <Zap size={16} />
        </div>
      );
    case 'perplexity':
      return (
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
          <Globe size={16} />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-lg bg-zinc-500/10 border border-zinc-500/20 flex items-center justify-center text-zinc-650">
          <Bot size={16} />
        </div>
      );
  }
}

export default function Vault() {
  const [vault, setVault] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showRawKey, setShowRawKey] = useState(false);
  const [form, setForm] = useState({ provider: 'openai', label: '', rawKey: '', environment: 'production' });

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'confirmation',
    confirmText: '',
    onConfirm: null,
    isLoading: false
  });

  const fetchVault = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getVault();
      if (res.success) setVault(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVault(); }, [fetchVault]);

  const handleCreate = async () => {
    if (!form.provider || !form.label || !form.rawKey) return;
    setCreating(true);
    try {
      await api.createVaultEntry('default', form);
      setShowCreate(false);
      setForm({ provider: 'openai', label: '', rawKey: '', environment: 'production' });
      fetchVault();
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Credential Stored',
        description: 'Your API credential has been securely encrypted and stored in the vault.',
        confirmText: 'Okay',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
      });
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Storage Failed',
        description: `Failed to store credential: ${err.message}`,
        confirmText: 'Dismiss',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
      });
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = (id) => {
    setModal({
      isOpen: true,
      type: 'delete',
      title: 'Revoke Stored Credential',
      description: 'Are you sure you want to revoke this stored credential? This action is permanent and any active routing configuration relying on it will fail.',
      confirmText: 'Revoke Credential',
      onConfirm: async () => {
        setModal(m => ({ ...m, isLoading: true }));
        try {
          await api.revokeVaultEntry(id);
          fetchVault();
          setModal(m => ({ ...m, isOpen: false }));
        } catch (err) {
          setModal({
            isOpen: true,
            type: 'error',
            title: 'Revocation Failed',
            description: `Failed to revoke credential: ${err.message}`,
            confirmText: 'Dismiss',
            onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
            isLoading: false
          });
        }
      }
    });
  };

  return (
    <CbLayout>
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <PageHeader prefix="Secret Enclaves" title="Provider Credentials Vault" />
          {!showCreate && (
            <Button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5"
            >
              <Plus size={14} />
              New Credential
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/60 text-red-800 text-xs rounded-xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(239,68,68,0.06)] font-sans">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
              <span>Unable to load vault credentials: {error}</span>
            </div>
            <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50" onClick={fetchVault}>Retry</Button>
          </div>
        )}

        {/* Create Credential Form */}
        {showCreate && (
          <Card variant="surface" className="p-6 border border-[#0D9488]/10 shadow-[0_4px_24px_rgba(13,148,136,0.03)] animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-[#0D9488]" />
              <h3 className="font-serif text-base font-semibold text-zinc-950">Store AI Provider Secret Key</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Target Provider *</label>
                <select
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
                  value={form.provider}
                  onChange={e => setForm(f => ({ ...f, provider: e.target.value }))}
                >
                  <option value="openai">OpenAI API</option>
                  <option value="anthropic">Anthropic Claude API</option>
                  <option value="gemini">Google Gemini API</option>
                  <option value="groq">Groq API</option>
                  <option value="perplexity">Perplexity API</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Credential Label *</label>
                <input
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
                  placeholder="e.g. production-openai-key"
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2 relative">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Raw API Secret Key *</label>
                <div className="relative">
                  <input
                    type={showRawKey ? 'text' : 'password'}
                    className="w-full bg-white border border-zinc-200 rounded-lg pl-3 pr-10 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-mono"
                    placeholder="sk-..."
                    value={form.rawKey}
                    onChange={e => setForm(f => ({ ...f, rawKey: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRawKey(!showRawKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showRawKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Target Environment *</label>
                <select
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
                  value={form.environment}
                  onChange={e => setForm(f => ({ ...f, environment: e.target.value }))}
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>
            </div>

            <Divider className="my-5" />

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={creating || !form.label || !form.rawKey}
              >
                {creating ? 'Encrypting & Storing…' : 'Store Credential'}
              </Button>
            </div>
          </Card>
        )}

        {/* Credentials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0,1].map(i => (
              <Card key={i} variant="surface" className="p-6 animate-pulse h-40" />
            ))}
          </div>
        ) : vault.length === 0 ? (
          <Card variant="surface" className="p-16 text-center max-w-xl mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="text-3xl mb-3">🔒</div>
            <p className="text-sm font-semibold text-zinc-700">Vault is empty.</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Store your AI provider API keys securely to enable automatic gateway routing and active request inspecting.
            </p>
            <Button
              onClick={() => setShowCreate(true)}
              className="mt-4"
              size="sm"
            >
              Store First Credential
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vault.map((entry) => (
              <Card key={entry.id} variant="surface" className="p-6 hover:shadow-[0_4px_20_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between h-44 border border-zinc-200/40 relative group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <ProviderIcon provider={entry.provider} />
                    <div>
                      <h3 className="font-serif text-sm font-semibold text-zinc-950 capitalize">{entry.provider} Credential</h3>
                      <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{entry.label}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase font-bold text-zinc-400 px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200/50 flex items-center gap-1 w-fit">
                      <Globe2 size={9} />
                      {entry.environment}
                    </span>
                    {entry.status === 'active' && (
                      <button
                        onClick={() => handleRevoke(entry.id)}
                        className="text-zinc-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded"
                        title="Revoke Credential"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-150 p-2.5 rounded-lg flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px]">
                    <Fingerprint size={12} className="text-zinc-400" />
                    <span className="text-zinc-400 uppercase tracking-widest">sk-••••</span>
                    <span className="text-zinc-600 font-bold">{entry.keyFingerprint}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="border-t border-black/[0.04] pt-3 flex items-center justify-between text-[9px] text-zinc-400 font-mono mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} />
                    <span>Rotation Due:</span>
                  </div>
                  <span className="text-zinc-600 font-bold">
                    {entry.rotationDueAt ? new Date(entry.rotationDueAt).toLocaleDateString() : '—'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
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
    </CbLayout>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import CbLayout from '../components/CbLayout';
import Modal from '../components/Modal';
import GatewayStatusPill from '../components/GatewayStatusPill';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Divider } from '../../src/components/ui/Divider';
import { 
  Key, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  Globe, 
  Calendar, 
  Fingerprint,
  Activity
} from 'lucide-react';

export default function Keys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newKeyDetails, setNewKeyDetails] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedNewKey, setCopiedNewKey] = useState(false);
  const [form, setForm] = useState({ name: '', environment: 'production' });

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'confirmation',
    confirmText: '',
    onConfirm: null,
    isLoading: false
  });

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getKeys();
      if (res.success) setKeys(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const handleGenerateKey = async () => {
    if (!form.name) return;
    setGenerating(true);
    setNewKeyDetails(null);
    try {
      const res = await api.createKey('default', form);
      if (res.success) {
        setNewKeyDetails(res.key);
        setShowCreate(false);
        setForm({ name: '', environment: 'production' });
        fetchKeys();
        setModal({
          isOpen: true,
          type: 'success',
          title: 'Access Key Generated',
          description: 'A new Gateway API access key has been successfully created. Copy it securely below.',
          confirmText: 'Okay',
          onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
        });
      }
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Generation Failed',
        description: `Key generation failed: ${err.message}`,
        confirmText: 'Dismiss',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRevokeKey = (id) => {
    setModal({
      isOpen: true,
      type: 'delete',
      title: 'Revoke Gateway Key',
      description: 'Are you sure you want to revoke this API key? This action is permanent and any active services using it will fail immediately.',
      confirmText: 'Revoke Key',
      onConfirm: async () => {
        setModal(m => ({ ...m, isLoading: true }));
        try {
          await api.revokeKey(id);
          fetchKeys();
          setModal(m => ({ ...m, isOpen: false }));
        } catch (err) {
          setModal({
            isOpen: true,
            type: 'error',
            title: 'Revocation Failed',
            description: `Failed to revoke key: ${err.message}`,
            confirmText: 'Dismiss',
            onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
            isLoading: false
          });
        }
      }
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedNewKey(true);
    setTimeout(() => setCopiedNewKey(false), 2000);
  };

  return (
    <CbLayout>
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <PageHeader prefix="Access Tokens" title="Gateway API Keys" />
          {!showCreate && (
            <Button 
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5"
            >
              <Plus size={14} />
              Generate Key
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/60 text-red-800 text-xs rounded-xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(239,68,68,0.06)] font-sans">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
              <span>Unable to load gateway keys: {error}</span>
            </div>
            <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50" onClick={fetchKeys}>Retry</Button>
          </div>
        )}

        {/* Generated Key Alert */}
        {newKeyDetails && (
          <Card variant="surface" className="border-emerald-500/20 bg-emerald-500/[0.02] p-6 text-xs flex flex-col gap-3 shadow-[0_4px_16px_rgba(16,185,129,0.03)] animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-800">
              <Check className="w-4.5 h-4.5 p-0.5 bg-emerald-100 rounded-full flex-shrink-0" />
              <h4 className="font-bold font-serif text-sm">Key Generated Successfully</h4>
            </div>
            <p className="text-zinc-600">Please copy this token now. For security purposes, it will not be displayed again.</p>
            
            <div className="bg-zinc-900 text-emerald-400 p-4 rounded-xl font-mono text-sm break-all border border-zinc-800 flex items-center justify-between gap-4 mt-1">
              <span className="select-all tracking-tight leading-relaxed">{newKeyDetails}</span>
              <Button 
                onClick={() => copyToClipboard(newKeyDetails)}
                size="sm"
                className={`flex-shrink-0 font-sans font-bold flex items-center gap-1.5 min-w-[80px] justify-center ${copiedNewKey ? 'bg-emerald-600 text-white' : 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-755'}`}
              >
                {copiedNewKey ? (
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
          </Card>
        )}

        {/* Create Key Form */}
        {showCreate && (
          <Card variant="surface" className="p-6 border border-[#0D9488]/10 shadow-[0_4px_24px_rgba(13,148,136,0.03)] animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-4 h-4 text-[#0D9488]" />
              <h3 className="font-serif text-base font-semibold text-zinc-950">Generate Gateway Access Key</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Key Label Name *</label>
                <input
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
                  placeholder="e.g. production-core-api"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
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
                onClick={handleGenerateKey}
                disabled={generating || !form.name}
              >
                {generating ? 'Generating…' : 'Generate Key'}
              </Button>
            </div>
          </Card>
        )}

        <Card variant="surface" className="overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[0,1,2].map(i => (
                  <div key={i} className="animate-pulse flex gap-6 items-center">
                    <div className="h-3 bg-zinc-150 rounded w-36" />
                    <div className="h-3 bg-zinc-100 rounded w-28" />
                    <div className="h-3 bg-zinc-100 rounded w-16" />
                    <div className="h-3 bg-zinc-150 rounded w-12" />
                    <div className="h-3 bg-zinc-100 rounded w-24" />
                  </div>
                ))}
              </div>
            ) : keys.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="text-3xl mb-3">🔑</div>
                <p className="text-sm font-semibold text-zinc-700">No gateway keys created yet.</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Create a gateway key to authenticate your LLM proxies and inspect prompt traffic.
                </p>
                <Button
                  onClick={() => setShowCreate(true)}
                  className="mt-4"
                  size="sm"
                >
                  Generate First Key
                </Button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50 border-b border-black/5 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                    <th className="px-6 py-3.5 font-bold">Label</th>
                    <th className="px-6 py-3.5 font-bold">Fingerprint</th>
                    <th className="px-6 py-3.5 font-bold">Environment</th>
                    <th className="px-6 py-3.5 font-bold">Status</th>
                    <th className="px-6 py-3.5 font-bold">Last Used</th>
                    <th className="px-6 py-3.5 font-bold">Created At</th>
                    <th className="px-6 py-3.5 text-right w-24 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-zinc-50/20 transition-colors">
                      <td className="px-6 py-4 font-semibold text-zinc-950 flex items-center gap-1.5">
                        <Key size={11} className="text-zinc-300" />
                        {k.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-zinc-500 text-[10.5px] flex items-center gap-1">
                        <Fingerprint size={10} className="text-zinc-300" />
                        {k.keyFingerprint}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[9px] uppercase font-bold text-zinc-400 px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200/50 flex items-center gap-1 w-fit">
                          <Globe size={9} />
                          {k.environment}
                        </span>
                      </td>
                      <td className="px-6 py-4"><GatewayStatusPill status={k.status} /></td>
                      <td className="px-6 py-4 text-zinc-500 font-mono text-[10px] flex items-center gap-1.5 py-5">
                        <Activity size={10} className="text-zinc-300" />
                        {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 font-mono text-[10px]">{new Date(k.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        {k.status === 'active' && (
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="text-zinc-450 hover:text-red-600 transition-colors inline-flex items-center p-1.5 hover:bg-red-50 rounded"
                            title="Revoke Gateway Key"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
    </CbLayout>
  );
}

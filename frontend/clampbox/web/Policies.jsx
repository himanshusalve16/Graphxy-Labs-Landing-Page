import React, { useEffect, useState, useCallback } from 'react';
import CbLayout from '../components/CbLayout';
import Modal from '../components/Modal';
import PolicyActionBadge from '../components/PolicyActionBadge';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Divider } from '../../src/components/ui/Divider';
import { 
  Plus, 
  Trash2, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Sliders, 
  Info,
  Layers,
  AlertTriangle,
  SlidersHorizontal,
  Settings,
  HelpCircle
} from 'lucide-react';

const CLASSIFICATIONS_LIST = [
  { id: 'cryptographic_secret', label: 'Cryptographic Secrets' },
  { id: 'cloud_credential', label: 'Cloud Credentials' },
  { id: 'personal_data', label: 'Personal Data (PII)' },
  { id: 'payment_data', label: 'Payment Data (Cards)' },
  { id: 'infrastructure_secret', label: 'Infrastructure Secrets (DB URLs)' }
];

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom policy creation form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    action: 'block',
    priority: 100
  });

  const [preset, setPreset] = useState('custom');
  const [selectedClassifications, setSelectedClassifications] = useState([
    'cryptographic_secret',
    'cloud_credential'
  ]);
  const [minRiskScore, setMinRiskScore] = useState(50);

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'confirmation',
    confirmText: '',
    onConfirm: null,
    isLoading: false
  });

  // Sync preset selections to form elements
  const handlePresetChange = (selectedPreset) => {
    setPreset(selectedPreset);
    if (selectedPreset === 'strict') {
      setForm(f => ({
        ...f,
        name: 'Strict Corporate Interception',
        description: 'Hard-blocks all credentials, secrets, payment indices, and infrastructure strings.',
        action: 'block',
        priority: 10
      }));
      setSelectedClassifications(CLASSIFICATIONS_LIST.map(c => c.id));
      setMinRiskScore(30);
    } else if (selectedPreset === 'standard') {
      setForm(f => ({
        ...f,
        name: 'Standard Gateway Redaction',
        description: 'Redacts personal logs and infrastructure keys, blocks core AWS/cryptographic credentials.',
        action: 'redact',
        priority: 20
      }));
      setSelectedClassifications(CLASSIFICATIONS_LIST.map(c => c.id));
      setMinRiskScore(50);
    } else if (selectedPreset === 'relaxed') {
      setForm(f => ({
        ...f,
        name: 'Relaxed Warning Profiler',
        description: 'Prompts alerts on key leaks, redacts standard personal records.',
        action: 'warn',
        priority: 30
      }));
      setSelectedClassifications(['cryptographic_secret', 'cloud_credential', 'personal_data']);
      setMinRiskScore(70);
    }
  };

  const handleCheckboxToggle = (classId) => {
    setPreset('custom');
    if (selectedClassifications.includes(classId)) {
      setSelectedClassifications(selectedClassifications.filter(id => id !== classId));
    } else {
      setSelectedClassifications([...selectedClassifications, classId]);
    }
  };

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPolicies();
      if (res.success) setPolicies(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

  const handleCreate = async () => {
    if (!form.name || !form.action) return;
    setCreating(true);
    
    const conditions = {
      classifications: selectedClassifications,
      minimumRiskScore: minRiskScore
    };

    try {
      await api.createPolicy('default', {
        ...form,
        conditions
      });
      setShowCreate(false);
      setForm({ name: '', description: '', action: 'block', priority: 100 });
      setPreset('custom');
      setSelectedClassifications(['cryptographic_secret', 'cloud_credential']);
      setMinRiskScore(50);
      fetchPolicies();
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Policy Created',
        description: 'Your governance policy has been successfully created and deployed.',
        confirmText: 'Okay',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
      });
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Creation Failed',
        description: `Failed to create policy: ${err.message}`,
        confirmText: 'Dismiss',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id) => {
    setModal({
      isOpen: true,
      type: 'delete',
      title: 'Delete Governance Policy',
      description: 'Are you sure you want to delete this policy? This action cannot be undone and LLM prompt routes will no longer check these rules.',
      confirmText: 'Delete Policy',
      onConfirm: async () => {
        setModal(m => ({ ...m, isLoading: true }));
        try {
          await api.deletePolicy(id);
          fetchPolicies();
          setModal(m => ({ ...m, isOpen: false }));
        } catch (err) {
          setModal({
            isOpen: true,
            type: 'error',
            title: 'Deletion Failed',
            description: `Failed to delete policy: ${err.message}`,
            confirmText: 'Dismiss',
            onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
            isLoading: false
          });
        }
      }
    });
  };

  const filteredPolicies = policies.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CbLayout>
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <PageHeader prefix="Security Rules" title="Policy Management" />
          {!showCreate && (
            <Button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5"
            >
              <Plus size={14} />
              Create Policy
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/60 text-red-800 text-xs rounded-xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(239,68,68,0.06)] font-sans">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
              <span>Unable to load policies: {error}</span>
            </div>
            <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50" onClick={fetchPolicies}>Retry</Button>
          </div>
        )}

        {/* Create Policy Form */}
        {showCreate && (
          <Card variant="surface" className="p-6 border border-[#0D9488]/10 shadow-[0_4px_24px_rgba(13,148,136,0.03)] animate-fade-in flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0D9488]" />
              <h3 className="font-serif text-base font-semibold text-zinc-950">Configure New Governance Policy</h3>
            </div>
            
            {/* Presets Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Start from Preset Template</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['strict', 'standard', 'relaxed', 'custom'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handlePresetChange(type)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center capitalize transition-all ${
                      preset === type 
                        ? 'bg-[#0D9488]/5 border-[#0D9488] text-[#0D9488]' 
                        : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-650'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Basic Details */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Policy Name *</label>
                  <input
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
                    placeholder="e.g. Block API Key Leaks"
                    value={form.name}
                    onChange={e => { setPreset('custom'); setForm(f => ({ ...f, name: e.target.value })); }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Enforcement Action *</label>
                  <select
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
                    value={form.action}
                    onChange={e => { setPreset('custom'); setForm(f => ({ ...f, action: e.target.value })); }}
                  >
                    <option value="block">Block (Stop submission & warn)</option>
                    <option value="redact">Redact (Mask matching sensitive inputs)</option>
                    <option value="warn">Warn (Prompt confirmation modal)</option>
                    <option value="allow">Allow (Silent logging only)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                  <textarea
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all resize-none h-16 font-sans"
                    placeholder="Optional brief description of rule target"
                    value={form.description}
                    onChange={e => { setPreset('custom'); setForm(f => ({ ...f, description: e.target.value })); }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Priority (1 - 1000)</label>
                  <input
                    type="number" min="1" max="1000"
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all font-mono"
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: parseInt(e.target.value) || 100 }))}
                  />
                </div>
              </div>

              {/* Right Column: Conditions & Sliders */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Target Classifications</label>
                  <div className="flex flex-col gap-2 border border-zinc-200/60 rounded-xl p-4 bg-zinc-50/20">
                    {CLASSIFICATIONS_LIST.map(item => (
                      <label key={item.id} className="flex items-center gap-2.5 text-xs text-zinc-700 font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedClassifications.includes(item.id)}
                          onChange={() => handleCheckboxToggle(item.id)}
                          className="w-3.5 h-3.5 text-[#0D9488] border-zinc-300 rounded focus:ring-[#0D9488]/20"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider">
                    <span className="text-zinc-400">Min Risk Score Trigger</span>
                    <span className="text-[#0D9488]">{minRiskScore} / 100</span>
                  </div>
                  <div className="flex items-center gap-4 border border-zinc-200/60 rounded-xl p-4 bg-zinc-50/20">
                    <input
                      type="range" min="0" max="100"
                      value={minRiskScore}
                      onChange={e => { setPreset('custom'); setMinRiskScore(parseInt(e.target.value)); }}
                      className="flex-grow accent-[#0D9488] h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={creating || !form.name || selectedClassifications.length === 0}
              >
                {creating ? 'Creating…' : 'Create Policy'}
              </Button>
            </div>
          </Card>
        )}

        {/* Policies Table Card */}
        <Card variant="surface" className="overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-black/[0.03]">
          {/* Filter Bar */}
          <div className="p-5 border-b border-black/[0.04] bg-zinc-50/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rules, targets, actions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-[#0D9488]/15 focus:border-[#0D9488] outline-none transition-all font-sans"
              />
            </div>
            
            <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
              <Info size={12} className="text-zinc-300" />
              <span>Rules are evaluated sequentially. Lowest priority number takes precedence.</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[0,1,2].map(i => (
                  <div key={i} className="animate-pulse flex gap-6 items-center">
                    <div className="h-3 bg-zinc-150 rounded w-8" />
                    <div className="h-3 bg-zinc-100 rounded w-48" />
                    <div className="h-3 bg-zinc-100 rounded w-32" />
                    <div className="h-3 bg-zinc-150 rounded w-20" />
                    <div className="h-3 bg-zinc-100 rounded w-16" />
                  </div>
                ))}
              </div>
            ) : filteredPolicies.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="text-3xl mb-3">🛡️</div>
                <p className="text-sm font-semibold text-zinc-700">No matching policies found.</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  {searchQuery ? 'Adjust your search term or filter parameters.' : 'Configure security rules to intercept prompt data.'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setShowCreate(true)}
                    className="mt-4"
                    size="sm"
                  >
                    Create First Policy
                  </Button>
                )}
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50 border-b border-black/5 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                    <th className="px-6 py-3.5 w-20 font-bold">Priority</th>
                    <th className="px-6 py-3.5 font-bold">Policy Name</th>
                    <th className="px-6 py-3.5 font-bold">Targets & Criteria</th>
                    <th className="px-6 py-3.5 font-bold">Enforcement</th>
                    <th className="px-6 py-3.5 w-28 font-bold">Status</th>
                    <th className="px-6 py-3.5 w-24 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {filteredPolicies.map((policy) => {
                    const conditions = policy.conditions || {};
                    const classes = conditions.classifications || [];
                    const minRisk = conditions.minimumRiskScore ?? 0;
                    return (
                      <tr key={policy.id} className="hover:bg-zinc-50/20 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-zinc-500 flex items-center gap-1.5">
                          <Layers size={11} className="text-zinc-300" />
                          {policy.priority}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-zinc-950">{policy.name}</div>
                          <div className="text-[10px] text-zinc-400 font-normal mt-0.5 max-w-xs truncate">{policy.description || 'No description'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            {classes.length > 0 ? (
                              <div className="flex gap-1.5 flex-wrap">
                                {classes.map(c => (
                                  <span key={c} className="bg-zinc-100 text-zinc-500 font-mono text-[8px] font-bold uppercase px-1 py-0.5 rounded border border-zinc-200/50">
                                    {c.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-400 font-normal">All targets</span>
                            )}
                            <span className="text-[9px] font-mono text-zinc-400">Risk Threshold: &ge;{minRisk}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><PolicyActionBadge action={policy.action} /></td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider ${
                            policy.enabled 
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' 
                              : 'bg-zinc-100 text-zinc-400 border-zinc-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${policy.enabled ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                            {policy.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(policy.id)}
                            className="text-zinc-400 hover:text-red-600 transition-colors inline-flex items-center p-1.5 hover:bg-red-50 rounded"
                            title="Delete policy"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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

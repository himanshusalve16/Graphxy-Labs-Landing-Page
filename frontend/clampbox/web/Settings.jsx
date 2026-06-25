import React, { useEffect, useState, useCallback } from 'react';
import CbLayout from '../components/CbLayout';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Divider } from '../../src/components/ui/Divider';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Clock, 
  Database, 
  AlertOctagon, 
  Check,
  Building,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    defaultAction: 'allow',
    extensionSyncInterval: 300,
    auditRetentionDays: 90,
    alertThreshold: 'high'
  });
  const [orgInfo, setOrgInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'confirmation',
    confirmText: '',
    onConfirm: null,
    isLoading: false
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSettings();
      if (res.success) {
        setSettings(res.data);
        if (res.org) setOrgInfo(res.org);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await api.saveSettings('default', settings);
      if (res.success) {
        setSuccessMsg('Configuration saved successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Save Failed',
        description: `Failed to save configuration: ${err.message}`,
        confirmText: 'Dismiss',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false }))
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CbLayout>
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <PageHeader prefix="Global Configuration" title="Clampbox Settings" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/60 text-red-800 text-xs rounded-xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(239,68,68,0.06)] font-sans">
            <div className="flex items-center gap-2">
              <AlertOctagon size={16} className="text-red-600 flex-shrink-0" />
              <span>Unable to load settings: {error}</span>
            </div>
            <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50" onClick={fetchSettings}>Retry</Button>
          </div>
        )}

        {loading ? (
          <Card variant="surface" className="p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] max-w-2xl animate-pulse space-y-6">
            <div className="h-10 bg-zinc-100 rounded w-2/3" />
            <div className="h-[1px] bg-black/[0.04]" />
            <div className="h-10 bg-zinc-100 rounded w-1/2" />
            <div className="h-[1px] bg-black/[0.04]" />
            <div className="h-10 bg-zinc-100 rounded w-1/3" />
          </Card>
        ) : (
          <Card variant="surface" className="p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] max-w-2xl flex flex-col gap-6">
            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs rounded-xl p-3 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Section 1: Default Action */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
                <Shield className="w-4 h-4 text-[#0D9488]" />
                <h3 className="font-serif">Default Provider Policy</h3>
              </div>
              <p className="text-xs text-zinc-500 pl-6">Action taken when a prompt request has no specific matching policy rule.</p>
              
              <div className="pl-6 mt-2">
                <select
                  className="w-full max-w-xs bg-white border border-zinc-200 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all"
                  value={settings.defaultAction}
                  onChange={e => setSettings(s => ({ ...s, defaultAction: e.target.value }))}
                >
                  <option value="allow">Allow Interaction</option>
                  <option value="warn">Warn on Sensitive Matches</option>
                  <option value="redact">Redact Matches & Proceed</option>
                  <option value="block">Block Matches</option>
                </select>
              </div>
            </div>

            <Divider />

            {/* Section 2: Sync settings */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
                <Clock className="w-4 h-4 text-[#0D9488]" />
                <h3 className="font-serif">Extension Sync Interval</h3>
              </div>
              <p className="text-xs text-zinc-500 pl-6">How frequently connected browser extension sessions sync updated policy bundles.</p>
              
              <div className="pl-6 mt-3 flex flex-col gap-2 max-w-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-550 font-bold">
                  <span>Frequency:</span>
                  <span className="text-[#0D9488]">{settings.extensionSyncInterval} seconds ({Math.round(settings.extensionSyncInterval / 60)}m)</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="3600"
                  step="60"
                  className="w-full h-1 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[#0D9488] border-none"
                  value={settings.extensionSyncInterval}
                  onChange={e => setSettings(s => ({ ...s, extensionSyncInterval: parseInt(e.target.value) || 300 }))}
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                  <span>60s (Live)</span>
                  <span>15m</span>
                  <span>1h (Relaxed)</span>
                </div>
              </div>
            </div>

            <Divider />

            {/* Section 3: Audit settings */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
                <Database className="w-4 h-4 text-[#0D9488]" />
                <h3 className="font-serif">Audit Logs Retention</h3>
              </div>
              <p className="text-xs text-zinc-500 pl-6">Number of days to preserve immutable security events evidence logs before pruning.</p>
              
              <div className="pl-6 mt-3 flex flex-col gap-2 max-w-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-550 font-bold">
                  <span>Retention:</span>
                  <span className="text-[#0D9488]">{settings.auditRetentionDays} Days</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="365"
                  step="5"
                  className="w-full h-1 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[#0D9488] border-none"
                  value={settings.auditRetentionDays}
                  onChange={e => setSettings(s => ({ ...s, auditRetentionDays: parseInt(e.target.value) || 90 }))}
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                  <span>30 Days</span>
                  <span>90 Days (Default)</span>
                  <span>365 Days</span>
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex justify-end gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5"
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </Card>
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

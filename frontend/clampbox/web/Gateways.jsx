import React, { useEffect, useState, useCallback } from 'react';
import CbLayout from '../components/CbLayout';
import GatewayStatusPill from '../components/GatewayStatusPill';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { 
  Network, 
  Globe, 
  Fingerprint, 
  Clock, 
  Cpu, 
  RefreshCw, 
  AlertTriangle 
} from 'lucide-react';

export default function Gateways() {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGateways = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getKeys();
      if (res.success) {
        setGateways(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGateways(); }, [fetchGateways]);

  return (
    <CbLayout>
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <PageHeader prefix="Infrastructure Connectors" title="Gateway Management" />
          <Button
            variant="outline"
            size="sm"
            onClick={fetchGateways}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/60 text-red-800 text-xs rounded-xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(239,68,68,0.06)] font-sans">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
              <span>Unable to load gateways: {error}</span>
            </div>
            <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50" onClick={fetchGateways}>Retry</Button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map(i => (
              <Card key={i} variant="surface" className="p-6 animate-pulse h-36 flex flex-col justify-between" />
            ))}
          </div>
        ) : gateways.length === 0 ? (
          <Card variant="surface" className="p-16 text-center max-w-xl mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="text-3xl mb-3">🔌</div>
            <p className="text-sm font-semibold text-zinc-700">No active gateways registered.</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Register a secure gateway proxy daemon by generating a Gateway API Key inside the API Keys workspace.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gateways.map((gw) => (
              <Card key={gw.id} variant="surface" className="p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between gap-6 h-40">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center text-[#0D9488]">
                      <Network size={16} />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-semibold text-zinc-950">{gw.name}</h3>
                      <span className="font-mono text-[9px] uppercase font-bold text-zinc-400 px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200/50 flex items-center gap-1 w-fit mt-1">
                        <Globe size={9} />
                        {gw.environment}
                      </span>
                    </div>
                  </div>
                  <GatewayStatusPill status={gw.status} />
                </div>

                <div className="border-t border-black/[0.04] pt-4 grid grid-cols-2 gap-4 text-[10px] text-zinc-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Fingerprint size={12} className="text-zinc-300" />
                    <span>Fingerprint: <span className="text-zinc-800 font-bold">{gw.keyFingerprint}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Clock size={12} className="text-zinc-300" />
                    <span>Last Sync: <span className="text-zinc-800 font-bold">{gw.lastUsedAt ? new Date(gw.lastUsedAt).toLocaleDateString() : 'Never'}</span></span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CbLayout>
  );
}

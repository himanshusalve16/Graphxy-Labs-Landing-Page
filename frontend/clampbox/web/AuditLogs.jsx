import React, { useEffect, useState, useCallback } from 'react';
import CbLayout from '../components/CbLayout';
import RiskBadge from '../components/RiskBadge';
import PolicyActionBadge from '../components/PolicyActionBadge';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Divider } from '../../src/components/ui/Divider';
import { 
  Clock, 
  Terminal, 
  Cpu, 
  AlertTriangle, 
  Copy, 
  Check, 
  Search, 
  SlidersHorizontal,
  ChevronLeft, 
  ChevronRight,
  ListFilter
} from 'lucide-react';

function SeverityBadge({ severity }) {
  const sev = (severity || 'info').toLowerCase();
  let colors = 'bg-zinc-50 text-zinc-500 border-zinc-200';
  if (sev === 'info') colors = 'bg-blue-50/50 text-blue-700 border-blue-150/40';
  else if (sev === 'low') colors = 'bg-emerald-50/50 text-emerald-700 border-emerald-150/40';
  else if (sev === 'medium') colors = 'bg-amber-50/50 text-amber-700 border-amber-200/40';
  else if (sev === 'high') colors = 'bg-orange-50/50 text-orange-700 border-orange-200/40';
  else if (sev === 'critical') colors = 'bg-red-50 text-red-700 border-red-200/40 animate-pulse font-extrabold';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase tracking-wider ${colors}`}>
      {severity || 'INFO'}
    </span>
  );
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  
  const LIMIT = 50;

  const fetchLogs = useCallback(async (off = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAuditLogs('default', { limit: LIMIT, offset: off });
      if (res.success) {
        setLogs(res.data);
        setTotal(res.total || res.data.length);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(0); }, [fetchLogs]);

  const handleCopyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Local filtering on the currently fetched dataset page
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.requestHash || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.provider || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.eventType || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;
    const matchesSeverity = severityFilter === 'all' || (log.severity || 'info').toLowerCase() === severityFilter.toLowerCase();
    
    return matchesSearch && matchesSource && matchesSeverity;
  });

  return (
    <CbLayout>
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <PageHeader prefix="Compliance Evidence" title="Audit Logs" />
          {!loading && total > 0 && (
            <span className="text-[10px] font-mono text-zinc-400 border border-zinc-200 px-3 py-1.5 rounded-lg bg-white">
              {total.toLocaleString()} total events
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/60 text-red-800 text-xs rounded-xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(239,68,68,0.06)] font-sans">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
              <span>Unable to load audit logs: {error}</span>
            </div>
            <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50" onClick={() => fetchLogs(offset)}>Retry</Button>
          </div>
        )}

        <Card variant="surface" className="overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Filters Bar */}
          <div className="p-5 border-b border-black/[0.04] bg-zinc-50/30 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hash, provider, event..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-[#0D9488]/15 focus:border-[#0D9488] outline-none transition-all font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal size={12} className="text-zinc-400" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-wider">Filters:</span>
              </div>
              
              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                className="bg-white border border-black/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/15 outline-none transition-all"
              >
                <option value="all">All Sources</option>
                <option value="gateway">Gateway</option>
                <option value="extension">Extension</option>
              </select>

              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="bg-white border border-black/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-[#0D9488]/15 outline-none transition-all"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="animate-pulse flex gap-6 items-center">
                    <div className="h-3 bg-zinc-150 rounded w-28" />
                    <div className="h-3 bg-zinc-100 rounded w-36" />
                    <div className="h-3 bg-zinc-100 rounded w-16" />
                    <div className="h-3 bg-zinc-150 rounded w-16" />
                    <div className="h-3 bg-zinc-100 rounded w-12" />
                    <div className="h-3 bg-zinc-100 rounded w-24" />
                  </div>
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="text-3xl mb-3">🛡️</div>
                <p className="text-sm font-semibold text-zinc-700">No audit events found.</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  {searchQuery || sourceFilter !== 'all' || severityFilter !== 'all' 
                    ? 'Try relaxing your filter settings.' 
                    : 'Prompt interactions inspected by the gateway or browser companion will be logged here.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-black/5 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                    <th className="px-6 py-3.5 font-bold">Time</th>
                    <th className="px-6 py-3.5 font-bold">Event Type</th>
                    <th className="px-6 py-3.5 font-bold">Source</th>
                    <th className="px-6 py-3.5 font-bold">Provider</th>
                    <th className="px-6 py-3.5 font-bold">Action</th>
                    <th className="px-6 py-3.5 font-bold">Risk Score</th>
                    <th className="px-6 py-3.5 font-bold">Severity</th>
                    <th className="px-6 py-3.5 font-bold">Request Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-zinc-50/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-[10px] text-zinc-500 whitespace-nowrap flex items-center gap-1.5 py-5">
                        <Clock size={10} className="text-zinc-300" />
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-zinc-600">{log.eventType || '—'}</td>
                      <td className="px-6 py-4 font-mono text-[10px] text-zinc-650 flex items-center gap-1">
                        {log.source === 'extension' ? (
                          <Cpu size={10} className="text-teal-600" />
                        ) : (
                          <Terminal size={10} className="text-zinc-400" />
                        )}
                        <span className="uppercase font-bold text-zinc-500">{log.source}</span>
                      </td>
                      <td className="px-6 py-4 uppercase font-mono text-[10px] text-zinc-600">{log.provider || '—'}</td>
                      <td className="px-6 py-4"><PolicyActionBadge action={log.action} /></td>
                      <td className="px-6 py-4"><RiskBadge score={log.riskScore} /></td>
                      <td className="px-6 py-4"><SeverityBadge severity={log.severity} /></td>
                      <td className="px-6 py-4">
                        {log.requestHash ? (
                          <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200/50 px-2 py-1 rounded w-fit text-zinc-500 font-mono text-[10px]">
                            <span className="select-all">{log.requestHash.slice(0, 8)}…{log.requestHash.slice(-4)}</span>
                            <button 
                              onClick={() => handleCopyHash(log.requestHash, log.id)}
                              className="text-zinc-400 hover:text-[#0D9488] transition-colors"
                              title="Copy full SHA-256 hash"
                            >
                              {copiedId === log.id ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-300 font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && total > LIMIT && (
            <div className="border-t border-black/[0.04] px-6 py-4 flex items-center justify-between text-xs font-mono text-zinc-450 bg-zinc-50/30">
              <span>Showing {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={offset === 0}
                  onClick={() => { const off = Math.max(0, offset - LIMIT); setOffset(off); fetchLogs(off); }}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={12} />
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={offset + LIMIT >= total}
                  onClick={() => { const off = offset + LIMIT; setOffset(off); fetchLogs(off); }}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight size={12} />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </CbLayout>
  );
}

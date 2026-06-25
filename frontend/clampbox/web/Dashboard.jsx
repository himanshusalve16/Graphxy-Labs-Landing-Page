import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CbLayout from '../components/CbLayout';
import RiskBadge from '../components/RiskBadge';
import PolicyActionBadge from '../components/PolicyActionBadge';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Divider } from '../../src/components/ui/Divider';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShieldAlert, 
  Scissors, 
  AlertOctagon, 
  Key, 
  Shield, 
  RefreshCw,
  Clock,
  Terminal,
  Cpu,
  Database,
  Globe,
  Radio,
  ExternalLink,
  ArrowRight,
  Check,
  Info
} from 'lucide-react';
import SetupWizardModal from '../components/SetupWizardModal';

function ProgressRing({ percentage, size = 42, strokeWidth = 3.5, color = '#0D9488' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(Math.max(percentage, 0), 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-zinc-150"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-[9px] font-mono font-bold text-zinc-700">{percentage}%</span>
    </div>
  );
}

function MetricCard({ label, value, sub, subColor = 'text-zinc-400', icon: Icon, progress }) {
  return (
    <Card variant="surface" className="p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all flex flex-col justify-between h-36 border border-black/[0.03]">
      <div className="flex items-start justify-between w-full">
        <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest">{label}</span>
        {progress !== undefined ? (
          <ProgressRing percentage={progress} color="#0D9488" />
        ) : (
          Icon && <Icon className="w-4 h-4 text-[#0D9488]" />
        )}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-serif font-light text-zinc-950 tracking-tight">
          {value}
        </div>
        {sub && <span className={`text-[10px] mt-1 block font-sans ${subColor}`}>{sub}</span>}
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card variant="surface" className="p-6 animate-pulse h-36 flex flex-col justify-between border border-black/[0.03]">
      <div className="flex justify-between items-start">
        <div className="h-2.5 bg-zinc-150 rounded w-24" />
        <div className="w-8 h-8 rounded-full bg-zinc-100" />
      </div>
      <div>
        <div className="h-7 bg-zinc-200 rounded w-16 mb-2" />
        <div className="h-2 bg-zinc-150 rounded w-32" />
      </div>
    </Card>
  );
}

function GettingStartedCard({ progress, steps, onLaunchWizard }) {
  return (
    <Card variant="surface" className="p-6 border border-teal-800/10 bg-teal-500/[0.02] shadow-[0_2px_12px_rgba(13,148,136,0.03)] rounded-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      <div className="flex-1 flex flex-col gap-3 w-full">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] animate-pulse" />
            <h3 className="font-serif text-base font-semibold text-zinc-950">Getting Started Checklist</h3>
          </div>
          <p className="text-zinc-500 text-xs mt-1 font-sans">
            Complete the steps below to fully secure your LLM workflows.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full max-w-md mt-1">
          <div className="flex-1 bg-zinc-100 border border-zinc-200/50 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-[#0D9488] h-full rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-650 min-w-[32px] text-right">{progress}% Done</span>
        </div>

        {/* Steps Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-650">
              {step.completed ? (
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-zinc-200 text-zinc-300 flex items-center justify-center flex-shrink-0 font-mono text-[9px] font-bold">
                  {idx + 1}
                </div>
              )}
              <span className={`font-sans ${step.completed ? 'text-zinc-500 line-through decoration-zinc-300' : 'font-medium text-zinc-800'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onLaunchWizard} className="flex items-center gap-1.5 flex-shrink-0 w-full md:w-auto h-10 px-5">
        <span>Launch Setup Wizard</span>
        <ArrowRight size={13} />
      </Button>
    </Card>
  );
}

function SuccessWidget({ activePolicy, activeGateway, onLaunchWizard }) {
  return (
    <Card variant="surface" className="p-4 border border-emerald-600/10 bg-emerald-500/[0.01] shadow-[0_2px_12px_rgba(16,185,129,0.02)] rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 flex-shrink-0">
          <Check size={16} strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="font-serif text-sm font-semibold text-zinc-950">Clampbox Successfully Configured</h4>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-sans">
            Gateway <span className="font-mono font-bold text-zinc-700">{activeGateway || 'Main Key'}</span> is online with policy <span className="font-mono font-bold text-[#0D9488]">{activePolicy || 'Standard Policy'}</span>.
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onLaunchWizard} className="flex-shrink-0 font-semibold text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-50">
        Re-run Tutorial
      </Button>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const res = await api.getDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchDashboard(); 
  }, [fetchDashboard]);

  const metrics = data?.metrics;
  const recentActivity = data?.recentActivity || [];
  const topSecretTypes = data?.topSecretTypes || [];
  const providerUsage = data?.providerUsage || [];

  const step1 = metrics?.activeKeys > 0;
  const step2 = metrics?.connectedBrowsers > 0;
  const step3 = metrics?.requestsToday > 0;

  const completedStepsCount = [step1, step2, step3].filter(Boolean).length;
  const setupProgress = Math.round((completedStepsCount / 3) * 100);
  const isSetupComplete = completedStepsCount === 3;

  const setupSteps = [
    { label: 'Create Gateway & Policy Preset', completed: step1 },
    { label: 'Connect Browser Companion', completed: step2 },
    { label: 'Verify Audit Inspection logs', completed: step3 }
  ];

  return (
    <CbLayout>
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          <PageHeader prefix="Security Console" title="Console Dashboard" />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWizardOpen(true)}
              className="flex items-center gap-1.5 font-semibold text-zinc-700 hover:text-zinc-950"
            >
              <Info size={12} className="text-[#0D9488]" />
              Tutorial / Getting Started
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setLoading(true); fetchDashboard(); }}
              className="flex items-center gap-1.5"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200/60 text-red-800 text-xs rounded-xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(239,68,68,0.06)] font-sans">
            <div className="flex items-center gap-2">
              <AlertOctagon size={16} className="text-red-600 flex-shrink-0" />
              <span>Unable to connect to backend: {error}</span>
            </div>
            <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50" onClick={() => { setLoading(true); fetchDashboard(); }}>Retry</Button>
          </div>
        )}

        {/* Getting Started Checklist or Success Widget */}
        {!loading && !error && (
          isSetupComplete ? (
            <SuccessWidget 
              activePolicy={metrics?.activePolicyName} 
              activeGateway={metrics?.activeGatewayName} 
              onLaunchWizard={() => setIsWizardOpen(true)} 
            />
          ) : (
            <GettingStartedCard 
              progress={setupProgress} 
              steps={setupSteps} 
              onLaunchWizard={() => setIsWizardOpen(true)} 
            />
          )
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [0,1,2,3].map(i => <SkeletonCard key={i} />)
          ) : (
            <>
              <MetricCard
                label="Total Inspections Today"
                value={metrics?.requestsToday?.toLocaleString() ?? '0'}
                sub={metrics?.requestsToday === 0 ? 'No inspections today' : 'Prompt audits executed'}
                icon={Activity}
              />
              <MetricCard
                label="Threats Blocked"
                value={metrics?.blockedToday ?? 0}
                subColor={metrics?.blockedToday > 0 ? 'text-red-500 font-semibold' : 'text-zinc-400'}
                sub={metrics?.blockedToday > 0 ? 'Policy blocks enforced' : 'No blocks logged'}
                icon={ShieldAlert}
                progress={metrics?.requestsToday > 0 ? metrics.blockRate : 0}
              />
              <MetricCard
                label="Prompt Redactions"
                value={metrics?.redactedToday ?? 0}
                sub={metrics?.redactedToday > 0 ? 'PII / credentials scrubbed' : 'No redactions applied'}
                icon={Scissors}
                progress={metrics?.requestsToday > 0 ? metrics.redactRate : 0}
              />
              <MetricCard
                label="Secrets Detected"
                value={metrics?.secretsDetected ?? 0}
                subColor={metrics?.secretsDetected > 0 ? 'text-amber-600 font-semibold' : 'text-zinc-400'}
                sub={metrics?.secretsDetected > 0 ? 'Matching scanning profiles' : 'No keys or PII found'}
                icon={AlertOctagon}
              />
            </>
          )}
        </div>

        {/* Secondary Metrics Row */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="surface" className="p-5 flex items-center justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-black/[0.03] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-[#0D9488]">
                  <Shield size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block">Active Policy</span>
                  <span className="text-sm font-semibold text-zinc-950 mt-0.5 block truncate max-w-[140px]">{metrics?.activePolicyName || 'Standard Policy'}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 bg-zinc-100 rounded border border-zinc-200">
                Enforcing
              </span>
            </Card>

            <Card variant="surface" className="p-5 flex items-center justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-black/[0.03] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-[#0D9488]">
                  <Key size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block">Active Gateway</span>
                  <span className="text-sm font-semibold text-zinc-950 mt-0.5 block truncate max-w-[140px]">{metrics?.activeGatewayName || 'Main Key'}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 bg-zinc-100 rounded border border-zinc-200">
                Connected
              </span>
            </Card>

            <Card variant="surface" className="p-5 flex items-center justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-black/[0.03] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-[#0D9488]">
                  <Globe size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block">Browsers Connected</span>
                  <span className="text-sm font-semibold text-zinc-950 mt-0.5 block">{metrics?.connectedBrowsers ?? 0} active</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100 font-bold">
                Online
              </span>
            </Card>
          </div>
        )}

        {/* SOC Telemetry Graphs */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Secret Types */}
            <Card variant="surface" className="p-6 flex flex-col gap-4 border border-black/[0.03]">
              <div>
                <h3 className="font-serif text-base font-semibold text-zinc-950">Detections Today</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">Top secret classifications matched</p>
              </div>
              <Divider />
              {topSecretTypes.length === 0 ? (
                <div className="flex-grow flex items-center justify-center py-8 text-zinc-400 text-xs font-mono">
                  No secrets detected today.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {topSecretTypes.map(item => {
                    const maxCount = Math.max(...topSecretTypes.map(i => i.count));
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div key={item.type} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono uppercase font-bold text-zinc-600 text-[10px]">{item.type.replace('_', ' ')}</span>
                          <span className="font-mono text-zinc-950 font-bold">{item.count}</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                          <div 
                            className="bg-[#0D9488] h-full rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Provider usage breakdown */}
            <Card variant="surface" className="p-6 flex flex-col gap-4 border border-black/[0.03]">
              <div>
                <h3 className="font-serif text-base font-semibold text-zinc-950">Provider Usage</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">Distribution of inspections across host providers</p>
              </div>
              <Divider />
              {providerUsage.length === 0 ? (
                <div className="flex-grow flex items-center justify-center py-8 text-zinc-400 text-xs font-mono">
                  No provider logs registered.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {providerUsage.map(item => {
                    const maxCount = Math.max(...providerUsage.map(i => i.count));
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div key={item.provider} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono uppercase font-bold text-zinc-600 text-[10px]">{item.provider}</span>
                          <span className="font-mono text-zinc-950 font-bold">{item.count}</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                          <div 
                            className="bg-zinc-800 h-full rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Health status & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Status & Recommendations */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card variant="surface" className="p-6 border border-black/[0.03]">
              <h3 className="font-serif text-base font-semibold text-zinc-950 mb-3">System Health</h3>
              <div className="flex flex-col gap-3 font-sans text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Gateway Service</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Database Node</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Extension Sync</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              </div>
            </Card>

            <Card variant="surface" className="p-6 border border-black/[0.03]">
              <h3 className="font-serif text-base font-semibold text-zinc-950 mb-2">Setup Recommendation</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Ensure you have installed the chrome extension and verified connection. Verify your policies are correctly targeted on the policies editor page.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] cursor-pointer" onClick={() => navigate('/clampbox/policies')}>
                <span>Configure Policies</span>
                <ExternalLink size={12} />
              </div>
            </Card>
          </div>

          {/* Recent Activity Table */}
          <Card variant="surface" className="lg:col-span-2 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-black/[0.03] flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-black/[0.04] flex items-center justify-between bg-zinc-50/20">
                <div>
                  <h3 className="font-serif text-base font-semibold text-zinc-950">Recent Security Activity</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">Last 5 intercepted events</p>
                </div>
                <span className="font-mono text-[9px] bg-zinc-150 text-zinc-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Live stream</span>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {[0,1,2].map(i => (
                      <div key={i} className="animate-pulse flex gap-6 items-center">
                        <div className="h-3 bg-zinc-150 rounded w-24" />
                        <div className="h-3 bg-zinc-100 rounded w-32" />
                        <div className="h-3 bg-zinc-100 rounded w-16" />
                        <div className="h-3 bg-zinc-150 rounded w-20" />
                        <div className="h-3 bg-zinc-100 rounded w-12" />
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="text-3xl mb-3">📡</div>
                    <p className="text-sm font-semibold text-zinc-700">No security events recorded yet.</p>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">Interpreted prompts from the browser extension companion will display here.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-50/50 border-b border-black/[0.04] text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                        <th className="px-6 py-3 font-bold">Time</th>
                        <th className="px-6 py-3 font-bold">Source</th>
                        <th className="px-6 py-3 font-bold">Provider</th>
                        <th className="px-6 py-3 font-bold">Action</th>
                        <th className="px-6 py-3 font-bold">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.03]">
                      {recentActivity.map(log => (
                        <tr key={log.id} className="hover:bg-zinc-50/30 transition-colors">
                          <td className="px-6 py-3.5 font-mono text-[10px] text-zinc-500 flex items-center gap-1.5">
                            <Clock size={10} className="text-zinc-300" />
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-3.5 font-mono text-[10px] text-zinc-600 flex items-center gap-1">
                            {log.source === 'extension' ? (
                              <Cpu size={10} className="text-teal-600" />
                            ) : (
                              <Terminal size={10} className="text-zinc-400" />
                            )}
                            <span className="uppercase font-bold text-zinc-500">{log.source}</span>
                          </td>
                          <td className="px-6 py-3.5 uppercase font-mono text-[10px] text-zinc-700">{log.provider || '—'}</td>
                          <td className="px-6 py-3.5"><PolicyActionBadge action={log.action} /></td>
                          <td className="px-6 py-3.5"><RiskBadge score={log.riskScore} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-zinc-50/50 border-t border-black/[0.03] text-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/clampbox/audit')} className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center justify-center gap-1.5 mx-auto font-semibold">
                View All Audit Logs
                <ExternalLink size={12} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <SetupWizardModal 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        onComplete={fetchDashboard} 
      />
    </CbLayout>
  );
}

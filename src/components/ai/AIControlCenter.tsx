import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Play, Sparkles, Layers, CheckCircle2, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';
import Card from '../ui/Card';
import { motion } from 'framer-motion';

export const AIControlCenter: React.FC = () => {
  const { timelineEvents, role, setRole, invoices } = useFinanceStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [diagnosticLog, setDiagnosticLog] = useState<string[]>([]);
  
  // Simulated Agent Status States
  const [agents, setAgents] = useState([
    { id: 'cfo', name: 'AI CFO', role: 'Treasury & Forecasts', status: 'Working', task: 'Forecasting working capital runway...', progress: 85, color: 'text-violet-500' },
    { id: 'auditor', name: 'AI Auditor', role: 'Ledger Audit Scanner', status: 'Idle', task: 'Completed scanning 500 ledger records.', progress: 100, color: 'text-indigo-500' },
    { id: 'gst', name: 'AI GST Expert', role: 'GST Compliance & Filing', status: 'Working', task: 'Cross-checking GSTR-2B ITC reports...', progress: 40, color: 'text-emerald-500' },
    { id: 'collections', name: 'AI Collections Manager', role: 'AR Reminders & Outreach', status: 'Idle', task: 'Awaiting due date thresholds.', progress: 100, color: 'text-rose-500' },
    { id: 'ocr', name: 'AI OCR Engine', role: 'Document Processing', status: 'Idle', task: 'Ready for document ingestion.', progress: 100, color: 'text-amber-500' }
  ]);

  const triggerDiagnostic = () => {
    setIsScanning(true);
    setScanProgress(0);
    setDiagnosticLog(['[AI Auditor] Starting complete ledger scanning...', '[AI GST Expert] Opening GST Portal connection...']);

    // Update statuses to "Scanning..."
    setAgents(prev => prev.map(a => ({
      ...a,
      status: 'Scanning...',
      progress: 0,
      task: 'Running diagnostic verification...'
    })));
  };

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p < 100) {
          const nextVal = p + 5;
          
          // Append mock logs at milestones
          if (nextVal === 20) {
            setDiagnosticLog(l => [...l, '[AI GST Expert] GSTR-2B logs retrieved. Verifying input tax mismatch...']);
            setAgents(prev => prev.map(a => a.id === 'gst' ? { ...a, progress: 30 } : a));
          }
          if (nextVal === 50) {
            setDiagnosticLog(l => [...l, '[AI Auditor] Checked 500 invoices. Found 1 duplicate record (INV/2026/1108).']);
            setAgents(prev => prev.map(a => a.id === 'auditor' ? { ...a, progress: 60 } : a));
          }
          if (nextVal === 80) {
            setDiagnosticLog(l => [...l, '[AI CFO] Computing cash flow impact of ledger anomalies... Risk is ₹18,000.']);
            setAgents(prev => prev.map(a => a.id === 'cfo' ? { ...a, progress: 85 } : a));
          }

          return nextVal;
        } else {
          clearInterval(interval);
          setIsScanning(false);
          setDiagnosticLog(l => [...l, '[AI Operations Core] General ledger diagnosis finished. All systems active.']);
          
          // Set back to working / idle
          setAgents([
            { id: 'cfo', name: 'AI CFO', role: 'Treasury & Forecasts', status: 'Working', task: 'Forecasting working capital runway...', progress: 100, color: 'text-violet-500' },
            { id: 'auditor', name: 'AI Auditor', role: 'Ledger Audit Scanner', status: 'Idle', task: 'Identified 1 duplicate voucher. Awaiting review.', progress: 100, color: 'text-indigo-500' },
            { id: 'gst', name: 'AI GST Expert', role: 'GST Compliance & Filing', status: 'Working', task: 'Verified GSTR-2B ITC matches.', progress: 100, color: 'text-emerald-500' },
            { id: 'collections', name: 'AI Collections Manager', role: 'AR Reminders & Outreach', status: 'Idle', task: 'Ready to send reminders.', progress: 100, color: 'text-rose-500' },
            { id: 'ocr', name: 'AI OCR Engine', role: 'Document Processing', status: 'Idle', task: 'Ready for document ingestion.', progress: 100, color: 'text-amber-500' }
          ]);

          // Add timeline event
          useFinanceStore.getState().addTimelineEvent({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            agent: 'AI Auditor',
            status: 'warning',
            message: 'Ledger diagnostic completed: 1 duplicate entry identified (INV/2026/1108).'
          });

          return 100;
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="bg-gradient-to-r from-slate-900 to-secondary text-white border-none p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-primary/20 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>System Operations Room</span>
            </div>
            <h2 className="text-xl font-bold font-heading">AI Employee Control Center</h2>
            <p className="text-xs text-slate-300 font-medium">
              Monitor, configure, and orchestrate the background AI agents operating on your business ledger.
            </p>
          </div>
          <button
            onClick={triggerDiagnostic}
            disabled={isScanning}
            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 shrink-0 self-start md:self-auto"
          >
            <Play className={`w-4 h-4 ${isScanning ? 'animate-pulse' : ''}`} />
            <span>{isScanning ? 'Running Scan...' : 'Trigger System Scan'}</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        {isScanning && (
          <div className="mt-6 space-y-2 relative z-10">
            <div className="flex justify-between text-xs font-medium">
              <span>Running Ledger anomaly checking checks...</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                style={{ width: `${scanProgress}%` }}
                className="h-full bg-primary transition-all duration-200"
              ></div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Agents List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">AI Workforce Fleet</h3>
          
          {agents.map((agent) => (
            <Card key={agent.id} className="p-4 flex items-center justify-between">
              <div className="flex items-start space-x-4">
                {/* Agent Icon Sphere */}
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm font-heading relative shadow-sm">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    agent.status === 'Working' ? 'bg-indigo-500' :
                    agent.status === 'Scanning...' ? 'bg-primary animate-pulse' :
                    'bg-slate-300'
                  }`}></span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800">{agent.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium font-heading">| {agent.role}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{agent.task}</p>
                </div>
              </div>

              {/* Progress and status */}
              <div className="text-right space-y-1">
                <div className="text-[10px] font-bold text-slate-600 capitalize">{agent.status}</div>
                {agent.status === 'Scanning...' && (
                  <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${scanProgress}%` }}
                      className="h-full bg-primary"
                    ></div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column: Live Work logs and Agent Collaboration Dialogue */}
        <div className="space-y-6">
          {/* Active Diagnostic Logs */}
          <Card className="p-5">
            <h3 className="text-xs font-bold text-slate-800 font-heading mb-3 border-b border-slate-100 pb-2">Active Log Feed</h3>
            
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-[9px] text-emerald-400 h-44 overflow-y-auto space-y-2 leading-relaxed">
              {diagnosticLog.length === 0 ? (
                <div className="text-slate-500 text-center py-12">No active scan logs. Click 'Trigger System Scan' above to view live agent feeds.</div>
              ) : (
                diagnosticLog.map((log, i) => (
                  <div key={i} className="animate-fade-in">{log}</div>
                ))
              )}
            </div>
          </Card>

          {/* Collaboration diagram Card */}
          <Card className="p-5">
            <h3 className="text-xs font-bold text-slate-800 font-heading mb-3 border-b border-slate-100 pb-2">Agent Collaboration Flow</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-[10px]">AA</div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex-1">
                  <div className="font-bold text-slate-700">AI Auditor</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Flagged INV/2026/1108 duplicate. Checking tax code...</p>
                </div>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-[10px]">AG</div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex-1">
                  <div className="font-bold text-slate-700">AI GST Expert</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Checked GSTR-2B mismatch. Recommends ITC reversal.</p>
                </div>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center font-bold text-violet-600 text-[10px]">AC</div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex-1">
                  <div className="font-bold text-slate-700">AI CFO</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Calculated financial liability risk is ₹18,450.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIControlCenter;

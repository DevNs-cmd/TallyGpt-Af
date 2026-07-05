import React, { useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { ShieldCheck, AlertCircle, FileText, ChevronRight, Check, ArrowRight, Play, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

export const AuditPanel: React.FC = () => {
  const { auditIssues, fixAuditIssue, industryData } = useFinanceStore();
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const health = industryData.healthScores;

  const toggleExplain = (id: string) => {
    setExpandedIssueId(expandedIssueId === id ? null : id);
  };

  const handleManualAuditScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Timeline log
      useFinanceStore.getState().addTimelineEvent({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: 'AI Auditor',
        status: 'info',
        message: 'Completed manual voucher verification checks. Accounts fully aligned.'
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards & Audit Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Audit Score Gauges */}
        <Card className="p-6 flex flex-col items-center justify-center text-center col-span-1">
          <h3 className="text-xs font-bold text-slate-800 font-heading mb-4 uppercase tracking-widest">Audit Compliance Score</h3>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circle gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-primary"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="377"
                initial={{ strokeDashoffset: 377 }}
                animate={{ strokeDashoffset: 377 - (377 * health.audit) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800 font-heading">{health.audit}%</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Secure Score</span>
            </div>
          </div>
        </Card>

        {/* Dynamic Summary Cards */}
        <Card className="p-6 flex flex-col justify-between col-span-1 md:col-span-2">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-widest">AI Auditor Core Diagnostic</h3>
              <button 
                onClick={handleManualAuditScan}
                disabled={isScanning}
                className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all flex items-center space-x-1"
              >
                <Play className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Running Scan...' : 'Trigger Audit Scan'}</span>
              </button>
            </div>
            
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-3">
              Our background ledger agents completed scanning voucher records in real-time. 
              We identified <span className="font-semibold text-slate-800">{auditIssues.filter(i => i.status === 'Pending').length} voucher discrepancies</span> (e.g. duplicate entries, missing invoices, RCM tax mismatch).
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-50 pt-4">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Vouchers Scanned</div>
              <div className="text-sm font-bold text-slate-800 mt-1">512 ledger items</div>
              <div className="text-[9px] text-slate-400 font-medium mt-0.5">Checked against Tally Prime</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Regulatory Integrity</div>
              <div className="text-sm font-bold text-emerald-600 mt-1">Compliant</div>
              <div className="text-[9px] text-slate-400 font-medium mt-0.5">Meets Companies Act requirements</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance Issues list */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Ledger Inconsistencies & Anomalies</h3>

        <div className="space-y-3">
          {auditIssues.map((issue) => (
            <Card key={issue.id} className="p-0 border border-slate-100 overflow-hidden">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    issue.status === 'Fixed' ? 'bg-emerald-50 text-emerald-600' :
                    issue.riskLevel === 'High' ? 'bg-rose-50 text-rose-500' :
                    issue.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-500' :
                    'bg-slate-50 text-slate-500'
                  }`}>
                    {issue.status === 'Fixed' ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800">{issue.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        issue.riskLevel === 'High' ? 'bg-rose-50 text-rose-600' :
                        issue.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {issue.riskLevel} Risk
                      </span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-semibold font-heading">
                        Confidence: {issue.confidence}%
                      </span>
                      {issue.status === 'Fixed' && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Fixed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mt-1 leading-relaxed">{issue.desc}</p>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      Amount Implicated: ₹{issue.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => toggleExplain(issue.id)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center"
                  >
                    <span>Explain Anomaly</span>
                    <ChevronRight className={`w-3 h-3 ml-0.5 transition-transform ${expandedIssueId === issue.id ? 'rotate-95' : ''}`} />
                  </button>

                  {issue.status === 'Pending' && (
                    <button
                      onClick={() => fixAuditIssue(issue.id)}
                      className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Slide Drawer for Explainer */}
              <AnimatePresence>
                {expandedIssueId === issue.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-slate-100 bg-slate-50 overflow-hidden"
                  >
                    <div className="p-5 text-xs text-slate-600 leading-relaxed font-medium space-y-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">AI Audit Explanation</div>
                        <p>{issue.explainText}</p>
                      </div>

                      {/* Collaboration Flow log */}
                      {issue.collaborationLog && (
                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-700 uppercase mb-2 flex items-center">
                            <Sparkles className="w-3.5 h-3.5 text-primary mr-1" />
                            AI Agent Discussion & Audit Trail
                          </div>
                          
                          <div className="space-y-2 border-l-2 border-primary/20 pl-3">
                            {issue.collaborationLog.map((log, i) => {
                              const [agentName, ...logTxt] = log.split(':');
                              return (
                                <div key={i} className="text-[10.5px]">
                                  <span className="font-bold text-slate-700">{agentName}:</span>
                                  <span className="text-slate-500 font-medium"> {logTxt.join(':')}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditPanel;

import React, { useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { ShieldCheck, AlertCircle, HelpCircle, ChevronRight, Check } from 'lucide-react';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

export const GSTIntelligence: React.FC = () => {
  const { gstIssues, fixGstIssue, industryData } = useFinanceStore();
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);

  const health = industryData.healthScores;

  const toggleExplain = (id: string) => {
    setExpandedIssueId(expandedIssueId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards & Health Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Score Gauge */}
        <Card className="p-6 flex flex-col items-center justify-center text-center col-span-1">
          <h3 className="text-xs font-bold text-slate-800 font-heading mb-4 uppercase tracking-widest">GST Health Index</h3>
          
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
                animate={{ strokeDashoffset: 377 - (377 * health.gst) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800 font-heading">{health.gst}%</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Compliant</span>
            </div>
          </div>
        </Card>

        {/* Dynamic Summary Cards */}
        <Card className="p-6 flex flex-col justify-between col-span-1 md:col-span-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-widest mb-2">AI Compliance Diagnostics</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We connected to the GSTN Portal database to reconcile input tax credits (GSTR-2B) with your purchases ledger. 
              The system identified <span className="font-semibold text-slate-800">{gstIssues.filter(i => i.status === 'Pending').length} pending issue(s)</span> requiring your review.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-50 pt-4">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">ITC Claim Status</div>
              <div className="text-sm font-bold text-slate-800 mt-1">₹{(industryData.kpis.revenue * 0.08).toLocaleString('en-IN')}</div>
              <div className="text-[9px] text-slate-400 font-medium mt-0.5">Reconciliation match: 98.4%</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Filing Deadline</div>
              <div className="text-sm font-bold text-slate-800 mt-1">GSTR-1 (11th July)</div>
              <div className="text-[9px] text-emerald-600 font-bold mt-0.5 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-0.5" /> Prepared
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance Issues list */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Identified Compliance Anomalies</h3>

        <div className="space-y-3">
          {gstIssues.map((issue) => (
            <Card key={issue.id} className="p-0 border border-slate-100 overflow-hidden">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    issue.status === 'Fixed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                  }`}>
                    {issue.status === 'Fixed' ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800">{issue.type}</span>
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
                      Party: {issue.partyName} ({issue.gstin})
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => toggleExplain(issue.id)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center"
                  >
                    <span>Explain</span>
                    <ChevronRight className={`w-3 h-3 ml-0.5 transition-transform ${expandedIssueId === issue.id ? 'rotate-95' : ''}`} />
                  </button>

                  {issue.status === 'Pending' && (
                    <button
                      onClick={() => fixGstIssue(issue.id)}
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
                    <div className="p-5 text-xs text-slate-600 leading-relaxed font-medium space-y-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">AI CFO Deep Analysis</div>
                      <p>{issue.explainText}</p>
                      
                      <div className="bg-white p-3 rounded-xl border border-slate-100 mt-2 space-y-1">
                        <div className="font-bold text-slate-700">Recommended Next Steps:</div>
                        <div className="text-[11px] text-slate-500">
                          {issue.type === 'ITC Mismatch' && '1. Draft auto-reconciliation letter to supplier. 2. Record temporary reversal entry in purchases ledger.'}
                          {issue.type === 'Wrong GSTIN' && '1. Trigger database correction workflow. 2. Sync client registry with GSTIN API endpoint.'}
                          {issue.type === 'Duplicate Invoice' && '1. Purge duplicate voucher entry from Tally records. 2. Verify payment proofs to ensure single payout.'}
                          {issue.type === 'HSN Mismatch' && '1. Re-classify item categories in the inventory code master. 2. Verify GST schedule codes.'}
                        </div>
                      </div>
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

export default GSTIntelligence;

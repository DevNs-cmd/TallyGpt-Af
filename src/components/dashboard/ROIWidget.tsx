import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Clock, ShieldCheck, Coins, RefreshCw, BarChart2 } from 'lucide-react';
import Card from '../ui/Card';

export const ROIWidget: React.FC = () => {
  const roi = useFinanceStore((state) => state.industryData.roiStats);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-heading">AI Return on Investment (ROI)</h3>
          <p className="text-[10px] text-slate-400 font-medium">Business outcomes powered by AlgoForce automation</p>
        </div>
        <BarChart2 className="w-5 h-5 text-primary" />
      </div>

      {/* Comparative Bar: Time Saved */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-500">Monthly Accounting Effort</span>
          <span className="font-bold text-primary">Saved {roi.savedHours} hrs/mo</span>
        </div>
        
        <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex text-[10px] font-bold text-white">
          <div 
            style={{ width: `${(roi.savedHours / roi.manualHours) * 100}%` }}
            className="bg-primary flex items-center justify-center px-2 shadow-inner"
          >
            AlgoForce: {roi.manualHours - roi.savedHours} hrs
          </div>
          <div 
            style={{ width: `${(1 - (roi.savedHours / roi.manualHours)) * 100}%` }}
            className="bg-slate-300 flex items-center justify-center px-2"
          >
            Manual: {roi.manualHours} hrs
          </div>
        </div>
      </div>

      {/* Grid of Outcomes */}
      <div className="grid grid-cols-2 gap-4">
        {/* Money Recovered */}
        <div className="bg-slate-50 border border-slate-100/50 p-3 rounded-2xl flex items-start space-x-3">
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl mt-0.5">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">Cash Recovered</div>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">
              ₹{(roi.recoveredAmount / 100000).toFixed(1)}L
            </div>
            <div className="text-[9px] text-slate-500 font-medium mt-0.5">Via smart follow-ups</div>
          </div>
        </div>

        {/* GST Errors Prevented */}
        <div className="bg-slate-50 border border-slate-100/50 p-3 rounded-2xl flex items-start space-x-3">
          <div className="bg-indigo-50 text-primary p-2 rounded-xl mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">GST Errors Caught</div>
            <div className="text-sm font-bold text-primary mt-0.5">
              {roi.gstErrorsPrevented}
            </div>
            <div className="text-[9px] text-slate-500 font-medium mt-0.5">Saved late filing fees</div>
          </div>
        </div>

        {/* Audit Issues Fixed */}
        <div className="bg-slate-50 border border-slate-100/50 p-3 rounded-2xl flex items-start space-x-3">
          <div className="bg-amber-50 text-amber-600 p-2 rounded-xl mt-0.5">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">Audit Issues Solved</div>
            <div className="text-sm font-bold text-amber-600 mt-0.5">
              {roi.auditIssuesFixed}
            </div>
            <div className="text-[9px] text-slate-500 font-medium mt-0.5">In ledger scanning</div>
          </div>
        </div>

        {/* Debt Reduced */}
        <div className="bg-slate-50 border border-slate-100/50 p-3 rounded-2xl flex items-start space-x-3">
          <div className="bg-rose-50 text-rose-600 p-2 rounded-xl mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">Outstanding Reduced</div>
            <div className="text-sm font-bold text-rose-600 mt-0.5">
              ₹{(roi.outstandingReduced / 100000).toFixed(1)}L
            </div>
            <div className="text-[9px] text-slate-500 font-medium mt-0.5">Reduced aging period</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ROIWidget;

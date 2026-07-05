import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { TrendingUp, Sparkles, MessageSquare } from 'lucide-react';
import Card from '../ui/Card';

interface MorningBriefProps {
  setActiveTab: (tab: string) => void;
}

export const MorningBrief: React.FC<MorningBriefProps> = ({ setActiveTab }) => {
  const { industryData, triggerWhatsAppFlow } = useFinanceStore();

  const handleRecoverClick = () => {
    // 1. Set role to Accountant to make Invoices & WhatsApp active
    useFinanceStore.getState().setRole('Accountant');
    // 2. Set active tab to invoices
    setActiveTab('invoices');
    // 3. Trigger WhatsApp collections simulator flow
    setTimeout(() => {
      triggerWhatsAppFlow();
    }, 300);
  };

  const kpis = industryData.kpis;

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white via-white to-primary/5 p-6 mb-6">
      {/* Decorative Blur Background Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4.5 h-4.5" />
            <span>AlgoForce Finance AI Briefing</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-heading">
            Good Morning, Rahul!
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Here is yesterday's financial snapshot for the <span className="font-semibold text-primary">{industryData.industryName}</span> operations.
          </p>
        </div>

        {/* Industry status */}
        <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm text-right">
          <div className="text-[9px] font-bold text-slate-400 uppercase">Tally Sync Status</div>
          <div className="text-xs font-bold text-emerald-600 flex items-center justify-end space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Ledger Healthy</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4 lg:mt-6 relative z-10">
        <div className="bg-white/60 backdrop-blur-sm p-3 lg:p-3.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yesterday&apos;s Rev</div>
          <div className="text-sm font-bold text-slate-800 mt-1">₹1,28,000</div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center mt-0.5">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-3 lg:p-3.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expenses</div>
          <div className="text-sm font-bold text-slate-800 mt-1">₹73,000</div>
          <span className="text-[10px] text-slate-400 font-semibold">Standard utilities</span>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-3 lg:p-3.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Profit</div>
          <div className="text-sm font-bold text-emerald-600 mt-1">₹55,000</div>
          <span className="text-[10px] text-emerald-600 font-semibold">43% margin</span>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-3 lg:p-3.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST Due (Est)</div>
          <div className="text-sm font-bold text-amber-600 mt-1">₹84,000</div>
          <span className="text-[10px] text-slate-400 font-semibold">Filing in 8 days</span>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-3 lg:p-3.5 rounded-2xl border border-slate-100 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Outstanding</div>
          <div className="text-sm font-bold text-rose-500 mt-1">₹{(kpis.receivables/100000).toFixed(1)}L</div>
          <span className="text-[10px] text-rose-400 font-medium">Risk profile: Medium</span>
        </div>
      </div>

      {/* AI Recommendation Alert */}
      <div className="mt-6 bg-primary/5 border border-primary/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start space-x-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI CFO Actionable Recommendation</div>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              We identified ₹1.28L outstanding from <span className="font-semibold text-slate-800">Apex Automotives</span>. Delaying upcoming copper raw materials purchase orders to next Monday will maintain optimal working capital safety buffers.
            </p>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
          <button
            onClick={handleRecoverClick}
            className="bg-primary hover:bg-primary-hover text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all flex items-center space-x-1"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            Recover via WhatsApp
          </button>
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all">
            Schedule Review
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MorningBrief;

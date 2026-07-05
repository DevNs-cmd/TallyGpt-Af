'use client';
import React from 'react';
import { useFinanceStore, TimelineEvent } from '../../store/useFinanceStore';
import { Brain, ShieldCheck, FileText, Coins, ScanLine, Clock } from 'lucide-react';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const agentIcon = (agent: TimelineEvent['agent']) => {
  switch (agent) {
    case 'AI CFO': return <Brain className="w-3.5 h-3.5" />;
    case 'AI Auditor': return <ShieldCheck className="w-3.5 h-3.5" />;
    case 'AI GST Expert': return <FileText className="w-3.5 h-3.5" />;
    case 'AI Collections Manager': return <Coins className="w-3.5 h-3.5" />;
    case 'AI OCR Engine': return <ScanLine className="w-3.5 h-3.5" />;
  }
};

const agentColor = (agent: TimelineEvent['agent']) => {
  switch (agent) {
    case 'AI CFO': return 'bg-violet-50 text-violet-600 border-violet-100';
    case 'AI Auditor': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    case 'AI GST Expert': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'AI Collections Manager': return 'bg-rose-50 text-rose-600 border-rose-100';
    case 'AI OCR Engine': return 'bg-amber-50 text-amber-600 border-amber-100';
  }
};

const statusDot = (status: TimelineEvent['status']) => {
  switch (status) {
    case 'success': return 'bg-emerald-500';
    case 'warning': return 'bg-amber-500';
    case 'alert': return 'bg-rose-500';
    default: return 'bg-sky-500';
  }
};

export const AITimeline: React.FC = () => {
  const events = useFinanceStore((s) => s.timelineEvents);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-heading">AI Activity Timeline</h3>
          <p className="text-[10px] text-slate-400 font-medium">Live agent operations feed</p>
        </div>
        <Clock className="w-4 h-4 text-primary" />
      </div>

      <div className="space-y-0 max-h-[380px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {events.map((evt, i) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-3 py-3 border-b border-slate-50 last:border-0"
            >
              {/* Dot & Line */}
              <div className="flex flex-col items-center pt-1">
                <span className={`w-2 h-2 rounded-full ${statusDot(evt.status)}`} />
                {i < events.length - 1 && <div className="w-px h-full bg-slate-100 mt-1" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <span className={`inline-flex items-center space-x-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${agentColor(evt.agent)}`}>
                    {agentIcon(evt.agent)}
                    <span>{evt.agent}</span>
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">{evt.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{evt.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default AITimeline;

'use client';
import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import Card from '../ui/Card';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export const HealthScore: React.FC = () => {
  const health = useFinanceStore((s) => s.industryData.healthScores);

  const segments = [
    { label: 'Cash Flow', score: health.cashFlow, color: '#10B981' },
    { label: 'GST', score: health.gst, color: '#7C3AED' },
    { label: 'Receivables', score: health.receivables, color: '#F59E0B' },
    { label: 'Inventory', score: health.inventory, color: '#3B82F6' },
    { label: 'Audit', score: health.audit, color: '#0B2343' },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-heading">Financial Health Score</h3>
          <p className="text-[10px] text-slate-400 font-medium">AI-computed composite index</p>
        </div>
        <Shield className="w-5 h-5 text-primary" />
      </div>

      {/* Central gauge */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="54" className="stroke-slate-100" strokeWidth="10" fill="transparent" />
            <motion.circle
              cx="64" cy="64" r="54"
              className="stroke-primary"
              strokeWidth="10"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray="339.3"
              initial={{ strokeDashoffset: 339.3 }}
              animate={{ strokeDashoffset: 339.3 - (339.3 * health.overall) / 100 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-800 font-heading">{health.overall}</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Overall</span>
          </div>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="space-y-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center space-x-3">
            <span className="text-[10px] font-bold text-slate-500 w-20 text-right">{seg.label}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: seg.color }}
                initial={{ width: 0 }}
                animate={{ width: `${seg.score}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700 w-8">{seg.score}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HealthScore;

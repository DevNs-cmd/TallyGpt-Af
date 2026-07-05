'use client';
import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { type IndustryType } from '../../data/dummyData';
import Card from '../ui/Card';
import { Factory, Hotel, HeartPulse, ShoppingBag, Truck, Briefcase } from 'lucide-react';

const industries: { id: IndustryType; label: string; icon: React.ElementType }[] = [
  { id: 'Manufacturing', label: 'Manufacturing', icon: Factory },
  { id: 'Hotel', label: 'Hotel', icon: Hotel },
  { id: 'Hospital', label: 'Hospital', icon: HeartPulse },
  { id: 'Retail', label: 'Retail', icon: ShoppingBag },
  { id: 'Distributor', label: 'Distributor', icon: Truck },
  { id: 'CA_Firm', label: 'CA Firm', icon: Briefcase },
];

export const IndustrySwitcher: React.FC = () => {
  const { currentIndustry, setIndustry } = useFinanceStore();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-800 font-heading">Demo Story Mode</h3>
        <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Switch Industry</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {industries.map((ind) => {
          const Icon = ind.icon;
          const isActive = currentIndustry === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setIndustry(ind.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-[10px] font-bold transition-all ${
                isActive
                  ? 'bg-primary-light border-primary/30 text-primary shadow-sm'
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span>{ind.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default IndustrySwitcher;

'use client';
import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, IndianRupee, Wallet, Receipt, Landmark, CreditCard, PiggyBank, AlertTriangle, Building } from 'lucide-react';
import Card from '../ui/Card';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const KPICards: React.FC = () => {
  const { industryData } = useFinanceStore();
  const kpis = industryData.kpis;

  const cards = [
    { label: 'Revenue', value: kpis.revenue, growth: kpis.revenueGrowth, icon: IndianRupee, color: 'text-emerald-600', bgColor: 'bg-emerald-50', explanation: 'Repeat orders from key clients' },
    { label: 'Expenses', value: kpis.expenses, growth: -8, icon: CreditCard, color: 'text-rose-500', bgColor: 'bg-rose-50', explanation: 'Utility & raw material costs' },
    { label: 'Net Profit', value: kpis.netProfit, growth: 18, icon: PiggyBank, color: 'text-violet-600', bgColor: 'bg-violet-50', explanation: `${((kpis.netProfit / kpis.revenue) * 100).toFixed(0)}% margin this period` },
    { label: 'Receivables', value: kpis.receivables, growth: -5, icon: Wallet, color: 'text-amber-600', bgColor: 'bg-amber-50', explanation: 'Outstanding from 23 clients' },
    { label: 'Payables', value: kpis.payables, growth: 3, icon: Receipt, color: 'text-sky-600', bgColor: 'bg-sky-50', explanation: 'Vendor settlements pending' },
    { label: 'Cash Available', value: kpis.cashAvailable, growth: 6, icon: Landmark, color: 'text-teal-600', bgColor: 'bg-teal-50', explanation: 'Working capital buffer' },
    { label: 'GST Due', value: kpis.gstDue, growth: 0, icon: Building, color: 'text-orange-600', bgColor: 'bg-orange-50', explanation: 'Filing deadline in 8 days' },
    { label: 'Bank Balance', value: kpis.bankBalance, growth: 9, icon: Landmark, color: 'text-indigo-600', bgColor: 'bg-indigo-50', explanation: 'HDFC + ICICI combined' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isPositive = card.growth > 0;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
          >
            <Card className="p-4 hover:shadow-premium transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${card.bgColor}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                {card.growth !== 0 && (
                  <div className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{Math.abs(card.growth)}%</span>
                  </div>
                )}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</div>
              <div className="text-base font-extrabold text-slate-800 mt-0.5 font-heading">
                ₹{(card.value / 100000).toFixed(1)}L
              </div>
              <div className="text-[9px] text-slate-400 font-medium mt-1">{card.explanation}</div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export const DashboardCharts: React.FC = () => {
  const { industryData } = useFinanceStore();
  const kpis = industryData.kpis;

  const revenueData = [
    { month: 'Jan', revenue: Math.floor(kpis.revenue * 0.72), expenses: Math.floor(kpis.expenses * 0.78) },
    { month: 'Feb', revenue: Math.floor(kpis.revenue * 0.78), expenses: Math.floor(kpis.expenses * 0.82) },
    { month: 'Mar', revenue: Math.floor(kpis.revenue * 0.85), expenses: Math.floor(kpis.expenses * 0.88) },
    { month: 'Apr', revenue: Math.floor(kpis.revenue * 0.88), expenses: Math.floor(kpis.expenses * 0.9) },
    { month: 'May', revenue: Math.floor(kpis.revenue * 0.94), expenses: Math.floor(kpis.expenses * 0.95) },
    { month: 'Jun', revenue: kpis.revenue, expenses: kpis.expenses },
  ];

  const cashFlowData = [
    { week: 'W1', inflow: Math.floor(kpis.revenue * 0.28), outflow: Math.floor(kpis.expenses * 0.22) },
    { week: 'W2', inflow: Math.floor(kpis.revenue * 0.32), outflow: Math.floor(kpis.expenses * 0.35) },
    { week: 'W3', inflow: Math.floor(kpis.revenue * 0.18), outflow: Math.floor(kpis.expenses * 0.28) },
    { week: 'W4', inflow: Math.floor(kpis.revenue * 0.22), outflow: Math.floor(kpis.expenses * 0.15) },
  ];

  const expenseBreakdown = [
    { name: 'Raw Materials', value: 38, color: '#7C3AED' },
    { name: 'Salaries', value: 25, color: '#0B2343' },
    { name: 'Utilities', value: 15, color: '#10B981' },
    { name: 'Logistics', value: 12, color: '#F59E0B' },
    { name: 'Others', value: 10, color: '#94A3B8' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
      {/* Revenue & Expense Trend */}
      <Card className="p-5 xl:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 font-heading">Revenue vs Expenses Trend</h3>
            <p className="text-[10px] text-slate-400 font-medium">6-month comparative analysis</p>
          </div>
          <div className="flex items-center space-x-3 text-[9px] font-bold">
            <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span><span className="text-slate-500">Revenue</span></div>
            <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span><span className="text-slate-500">Expenses</span></div>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FB7185" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#FB7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip
                contentStyle={{ fontSize: 10, borderRadius: 12, border: '1px solid #E2E8F0' }}
                formatter={(value: any) => [value ? `₹${Number(value).toLocaleString('en-IN')}` : '', '']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ r: 3, fill: '#7C3AED' }} />
              <Area type="monotone" dataKey="expenses" stroke="#FB7185" strokeWidth={2} fill="url(#colorExpenses)" dot={{ r: 3, fill: '#FB7185' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Expense Breakdown Pie */}
      <Card className="p-5">
        <div className="mb-4">
          <h3 className="text-xs font-bold text-slate-800 font-heading">Expense Breakdown</h3>
          <p className="text-[10px] text-slate-400 font-medium">Category allocation this period</p>
        </div>
        <div className="h-40 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12 }} formatter={(value: any) => [value ? `${value}%` : '', '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5 mt-3">
          {expenseBreakdown.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-slate-700">{item.value}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Cash Flow Weekly */}
      <Card className="p-5 xl:col-span-2">
        <div className="mb-4">
          <h3 className="text-xs font-bold text-slate-800 font-heading">Weekly Cash Flow</h3>
          <p className="text-[10px] text-slate-400 font-medium">Inflow vs Outflow tracking</p>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12 }} formatter={(value: any) => [value ? `₹${Number(value).toLocaleString('en-IN')}` : '', '']} />
              <Bar dataKey="inflow" fill="#7C3AED" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="outflow" fill="#FB7185" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* AI Insights Card */}
      <Card className="p-5 bg-gradient-to-br from-white to-primary/5">
        <h3 className="text-xs font-bold text-slate-800 font-heading mb-3">AI Financial Insights</h3>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-bold text-slate-700">Revenue grew 18%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Primary driver: Repeat orders from manufacturing supply chain clients in Q2.</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <span className="text-[11px] font-bold text-slate-700">Expenses up 12%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Root cause: Electricity tariff revision and raw materials price surge (+8%).</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-bold text-slate-700">Cash may dip below ₹5L</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Forecast: Within 18 days unless ₹12.3L outstanding is recovered from key accounts.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KPICards;

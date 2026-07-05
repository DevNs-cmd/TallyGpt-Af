'use client';
import React, { useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Search, Bell, RotateCcw, MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Topbar: React.FC = () => {
  const {
    role, setRole, selectedCompany, setSelectedCompany, companies,
    isPresentationMode, togglePresentationMode, resetDemo,
    setCommandPaletteOpen, timelineEvents
  } = useFinanceStore();

  const [notifOpen, setNotifOpen] = useState(false);
  const recentEvents = timelineEvents.slice(0, 4);

  return (
    <header className="h-16 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl fixed top-0 right-0 left-0 lg:left-64 z-20 flex items-center justify-between px-4 lg:px-6 print:hidden shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      {/* Left: Company Switcher + Search (offset for mobile hamburger) */}
      <div className="flex items-center space-x-2 lg:space-x-4 pl-12 lg:pl-0">
        {/* Company Switcher */}
        <div className="relative">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 pr-7 text-xs font-bold text-slate-700 outline-none hover:bg-slate-100 transition-colors cursor-pointer max-w-[130px] lg:max-w-none"
          >
            {companies.map((comp) => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[8px]">▼</div>
        </div>

        {/* Search — hidden on small mobile, shows from sm */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-100 transition-colors w-36 lg:w-48 text-left"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 truncate">Search...</span>
          <span className="hidden lg:inline bg-white border border-slate-200 rounded px-1 text-[9px] font-bold text-slate-400">⌘K</span>
        </button>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center space-x-2 lg:space-x-3">
        {/* Role Selector — hidden in presentation mode & hidden on small screens */}
        {!isPresentationMode && (
          <div className="hidden md:flex bg-slate-100/80 p-0.5 rounded-xl items-center">
            {(['Business_Owner', 'Accountant', 'CA', 'Admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-2 lg:px-2.5 py-1 rounded-lg text-[9px] lg:text-[10px] font-bold transition-all ${
                  role === r ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}

        {/* Reset Demo */}
        <button
          onClick={resetDemo}
          title="Reset demo"
          className="p-2 hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:text-red-500 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Presentation Mode */}
        <button
          onClick={togglePresentationMode}
          title={isPresentationMode ? 'Exit presentation mode' : 'Enter presentation mode'}
          className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            isPresentationMode
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
          }`}
        >
          <MonitorPlay className="w-4 h-4" />
          <span className="hidden lg:inline">{isPresentationMode ? 'Presentation' : 'Demo Mode'}</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 lg:w-80 bg-white border border-slate-100 rounded-18px shadow-premium p-4 z-20"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-800 font-heading">AI Finance Activity</span>
                    <span className="text-[10px] text-primary font-semibold">Live Logs</span>
                  </div>
                  <div className="space-y-3">
                    {recentEvents.map((evt) => (
                      <div key={evt.id} className="text-xs space-y-0.5 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            evt.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                            evt.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                            'bg-indigo-50 text-primary'
                          }`}>
                            {evt.agent}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">{evt.time}</span>
                        </div>
                        <p className="text-slate-600 font-medium text-[11px] leading-relaxed">{evt.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

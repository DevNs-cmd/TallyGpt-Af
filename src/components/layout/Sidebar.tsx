'use client';
import React, { useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import {
  LayoutDashboard, Brain, FileSpreadsheet, Users, Building,
  RefreshCw, Sliders, Sparkles, Layers, ArrowRightLeft,
  Coins, ShieldCheck, X, Menu
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const role = useFinanceStore((state) => state.role);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('2 min ago');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTallySync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText('Just now');
      useFinanceStore.getState().addTimelineEvent({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: 'AI Auditor',
        status: 'success',
        message: 'Manual sync completed. Retrieved 12 new ledger entries from Tally Prime.'
      });
    }, 1500);
  };

  const getMenuItems = () => {
    const common = [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
      { id: 'control-center', name: 'AI Operations Room', icon: Layers, highlight: true }
    ];
    switch (role) {
      case 'Business_Owner':
        return [...common,
          { id: 'ai-cfo', name: 'AI CFO', icon: Brain },
          { id: 'cash-flow', name: 'Cash Flow & ROI', icon: Coins },
          { id: 'reports', name: 'Executive Report', icon: FileSpreadsheet }
        ];
      case 'Accountant':
        return [...common,
          { id: 'invoices', name: 'Invoices & OCR', icon: Sparkles },
          { id: 'bank-recon', name: 'Bank Reconciliation', icon: ArrowRightLeft },
          { id: 'audit', name: 'AI Ledger Audit', icon: ShieldCheck },
          { id: 'gst-intel', name: 'GST Filing Assist', icon: Building }
        ];
      case 'CA':
        return [...common,
          { id: 'client-dashboard', name: 'Client Accounts', icon: Users },
          { id: 'gst-intel', name: 'GST Health & Filings', icon: Building },
          { id: 'audit', name: 'Audit & Compliance', icon: ShieldCheck },
          { id: 'ai-cfo', name: 'AI Tax Assistant', icon: Brain }
        ];
      case 'Admin':
        return [...common,
          { id: 'users-permissions', name: 'Users & Roles', icon: Users },
          { id: 'settings', name: 'Branding & API Keys', icon: Sliders }
        ];
      default:
        return common;
    }
  };

  const menuItems = getMenuItems();

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <aside className="w-64 bg-white/85 backdrop-blur-xl border-r border-slate-150 flex flex-col h-full shadow-sm z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col items-center relative">
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 lg:hidden"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="relative w-full h-12 flex justify-center mb-1">
          <Image src="/logo.jpg" alt="AlgoForce Logo" width={160} height={50} className="object-contain" priority />
        </div>
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Finance AI Core</div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive ? 'bg-primary-light text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-md"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">{item.name}</span>
              {item.highlight && (
                <span className="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tally Prime Connector Widget */}
      <div className="p-4 mx-3 mb-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-600">Tally Connector</span>
          </div>
          <button
            onClick={handleTallySync}
            disabled={isSyncing}
            className="p-1 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
        <div className="text-[9px] text-slate-400 font-medium space-y-0.5">
          <div>Engine: <span className="font-semibold text-slate-600">Tally Prime v5.2</span></div>
          <div>Last Sync: <span className="font-semibold text-slate-600">{lastSyncText}</span></div>
        </div>
      </div>

      {/* Profile Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center space-x-3 bg-slate-50/50">
        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm font-heading">
          RM
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">Rohan Mehta</p>
          <p className="text-[10px] text-slate-400 truncate capitalize font-medium">{role.replace('_', ' ')}</p>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Hamburger button — only on mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 p-2.5 bg-white rounded-xl border border-slate-100 shadow-soft text-slate-600 hover:text-primary transition-colors lg:hidden print:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-30 print:hidden">
        <SidebarContent />
      </div>

      {/* Mobile sidebar — slide in from left */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="sidebar-overlay lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed left-0 top-0 h-screen z-30 lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

import React, { useEffect, useState, useRef } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Search, FileText, User, HelpCircle, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette: React.FC = () => {
  const isOpen = useFinanceStore((state) => state.commandPaletteOpen);
  const setOpen = useFinanceStore((state) => state.setCommandPaletteOpen);
  const invoices = useFinanceStore((state) => state.invoices);
  const customers = useFinanceStore((state) => state.customers);
  const triggerAIResponse = useFinanceStore((state) => state.triggerAIResponse);
  const setChatPersona = useFinanceStore((state) => state.setChatPersona);
  const setRole = useFinanceStore((state) => state.setRole);

  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen to keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearchQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Search logic
  const filteredInvoices = invoices
    .filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.partyName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 3);

  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 3);

  const actions = [
    { label: 'Run Ledger Audit Scan', action: () => { setRole('Accountant'); setOpen(false); } },
    { label: 'Check GST Health Score', action: () => { setRole('CA'); setOpen(false); } },
    { label: 'Generate PDF Executive Report', action: () => { setRole('Business_Owner'); setOpen(false); } }
  ].filter((a) => a.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAction = (act: () => void) => {
    act();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white rounded-18px shadow-premium border border-slate-100 w-full max-w-xl overflow-hidden flex flex-col"
        >
          {/* Header Input */}
          <div className="flex items-center px-4 border-b border-slate-100 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search invoices, clients, actions... (or ESC to close)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm py-1"
            />
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[360px] overflow-y-auto p-2 space-y-4">
            {/* Actions / Commands */}
            {actions.length > 0 && (
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-1 tracking-wider">Quick Commands</div>
                {actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleAction(act.action)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center text-xs text-slate-700 font-medium transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary mr-3" />
                    {act.label}
                  </button>
                ))}
              </div>
            )}

            {/* Invoices */}
            {filteredInvoices.length > 0 && (
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-1 tracking-wider">Invoices</div>
                {filteredInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs text-slate-700 cursor-pointer transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-slate-400 mr-3" />
                      <div>
                        <span className="font-semibold text-slate-800">{inv.invoiceNumber}</span>
                        <span className="mx-2 text-slate-300">|</span>
                        <span>{inv.partyName}</span>
                      </div>
                    </div>
                    <span className="font-medium text-slate-600">₹{inv.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Customers */}
            {filteredCustomers.length > 0 && (
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-1 tracking-wider">Customers</div>
                {filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    className="px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs text-slate-700 cursor-pointer transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-slate-400 mr-3" />
                      <div>
                        <span className="font-semibold text-slate-800">{c.name}</span>
                        <span className="mx-2 text-slate-300">|</span>
                        <span className="text-slate-400">{c.city}</span>
                      </div>
                    </div>
                    <span className="font-medium text-emerald-600">₹{(c.totalRevenue/100000).toFixed(1)}L Revenue</span>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {actions.length === 0 && filteredInvoices.length === 0 && filteredCustomers.length === 0 && (
              <div className="py-8 text-center text-slate-400 flex flex-col items-center justify-center">
                <HelpCircle className="w-8 h-8 text-slate-300 mb-2" />
                <div className="text-xs">No records or actions matching "{searchQuery}"</div>
                <div className="text-[10px] text-slate-300 mt-1">Try searching "audit", "invoice", "mfg" or "steel"</div>
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Use ↑↓ arrows to navigate, Enter to select</span>
            <span>ESC to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;

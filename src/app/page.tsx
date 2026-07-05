'use client';
import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

// Layout
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import LoginPage from '../components/layout/LoginPage';

// UI
import CommandPalette from '../components/ui/CommandPalette';

// Dashboard
import MorningBrief from '../components/dashboard/MorningBrief';
import { KPICards, DashboardCharts } from '../components/dashboard/KPICards';
import ROIWidget from '../components/dashboard/ROIWidget';
import HealthScore from '../components/dashboard/HealthScore';
import IndustrySwitcher from '../components/dashboard/IndustrySwitcher';

// AI
import AIControlCenter from '../components/ai/AIControlCenter';
import PersonaChat from '../components/ai/PersonaChat';
import AITimeline from '../components/ai/AITimeline';

// Modules
import OCRScanner from '../components/modules/OCRScanner';
import GSTIntelligence from '../components/modules/GSTIntelligence';
import AuditPanel from '../components/modules/AuditPanel';
import WhatsAppSimulator from '../components/modules/WhatsAppSimulator';
import ExecutiveReport from '../components/modules/ExecutiveReport';
import AutoplayDemoController from '../components/modules/AutoplayDemoController';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { role, isPresentationMode } = useFinanceStore();

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // Render the active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <MorningBrief setActiveTab={setActiveTab} />
            <KPICards />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              <div className="xl:col-span-2">
                <DashboardCharts />
              </div>
              <div className="space-y-4 lg:space-y-6">
                <HealthScore />
                <IndustrySwitcher />
              </div>
            </div>
            <ROIWidget />
          </div>
        );

      case 'control-center':
        return <AIControlCenter />;

      case 'ai-cfo':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PersonaChat />
            </div>
            <div className="space-y-6">
              <AITimeline />
            </div>
          </div>
        );

      case 'invoices':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <OCRScanner />
            </div>
            <div className="lg:col-span-2">
              <WhatsAppSimulator />
            </div>
          </div>
        );

      case 'bank-recon':
        return (
          <div className="space-y-6">
            <BankReconView />
          </div>
        );

      case 'gst-intel':
        return <GSTIntelligence />;

      case 'audit':
        return <AuditPanel />;

      case 'reports':
        return <ExecutiveReport />;

      case 'cash-flow':
        return (
          <div className="space-y-6">
            <ROIWidget />
            <DashboardCharts />
          </div>
        );

      case 'client-dashboard':
        return <ClientDashboardView />;

      case 'users-permissions':
      case 'settings':
        return <SettingsView />;

      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🚧</span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 font-heading">Module Coming Soon</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">This section is under active development.</p>
          </div>
        );
    }
  };

  // Page title based on tab
  const getPageTitle = () => {
    const titles: Record<string, { title: string; subtitle: string }> = {
      'dashboard': { title: 'Dashboard', subtitle: 'AI-powered financial overview' },
      'control-center': { title: 'AI Operations Room', subtitle: 'Monitor your AI employee workforce' },
      'ai-cfo': { title: 'AI Finance Team', subtitle: 'Chat with specialized AI agents' },
      'invoices': { title: 'Invoices & OCR', subtitle: 'Document scanning & WhatsApp collections' },
      'bank-recon': { title: 'Bank Reconciliation', subtitle: 'Automated ledger matching engine' },
      'gst-intel': { title: 'GST Intelligence', subtitle: 'Compliance health & filing assistance' },
      'audit': { title: 'AI Ledger Audit', subtitle: 'Anomaly detection & voucher verification' },
      'reports': { title: 'Executive Report', subtitle: 'Board-ready financial summary' },
      'cash-flow': { title: 'Cash Flow & ROI', subtitle: 'Working capital analysis' },
      'client-dashboard': { title: 'Client Accounts', subtitle: 'Multi-company portfolio overview' },
      'users-permissions': { title: 'Users & Permissions', subtitle: 'Team access management' },
      'settings': { title: 'Settings', subtitle: 'Branding, API keys & configuration' },
    };
    return titles[activeTab] || { title: 'AlgoForce Finance AI', subtitle: '' };
  };

  const pageInfo = getPageTitle();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Top bar */}
      <Topbar />

      {/* Command Palette */}
      <CommandPalette />

      {/* Main Content Area — responsive left margin */}
      <main className="lg:ml-64 pt-16 p-4 lg:p-6 min-h-screen">
        {/* Page Header */}
        <div className="mb-4 lg:mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-slate-800 font-heading">{pageInfo.title}</h1>
            <p className="text-[11px] lg:text-xs text-slate-400 font-medium mt-0.5">{pageInfo.subtitle}</p>
          </div>
        </div>

        {/* Page Content */}
        {renderContent()}
      </main>

      {/* Floating Demo Controller */}
      <AutoplayDemoController activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

/* ================================================================ */
/* Inline sub-page view components                                  */
/* ================================================================ */

function BankReconView() {
  const { transactions, reconcileTransaction } = useFinanceStore();
  const matched = transactions.filter((t) => t.status === 'Matched').length;
  const unmatched = transactions.filter((t) => t.status === 'Unmatched').length;
  const duplicate = transactions.filter((t) => t.status === 'Duplicate').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-18px border border-slate-100 shadow-soft p-5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matched</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-heading mt-1">{matched}</div>
          <div className="text-[9px] text-slate-400 font-medium">Auto-reconciled by AI</div>
        </div>
        <div className="bg-white rounded-18px border border-slate-100 shadow-soft p-5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unmatched</div>
          <div className="text-2xl font-extrabold text-amber-600 font-heading mt-1">{unmatched}</div>
          <div className="text-[9px] text-slate-400 font-medium">Needs manual review</div>
        </div>
        <div className="bg-white rounded-18px border border-slate-100 shadow-soft p-5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duplicates</div>
          <div className="text-2xl font-extrabold text-rose-500 font-heading mt-1">{duplicate}</div>
          <div className="text-[9px] text-slate-400 font-medium">Flagged for review</div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-18px border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 font-heading">Recent Bank Transactions (500 records)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Bank</th>
                <th className="text-right p-3">Amount</th>
                <th className="text-center p-3">Status</th>
                <th className="text-center p-3">Confidence</th>
                <th className="text-center p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 15).map((txn) => (
                <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-slate-600 font-medium">{txn.date}</td>
                  <td className="p-3 text-slate-700 font-semibold max-w-[200px] truncate">{txn.description}</td>
                  <td className="p-3 text-slate-500">{txn.bankName}</td>
                  <td className={`p-3 text-right font-bold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      txn.status === 'Matched' ? 'bg-emerald-50 text-emerald-600' :
                      txn.status === 'Duplicate' ? 'bg-rose-50 text-rose-500' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="p-3 text-center text-[10px] font-bold text-slate-500">{txn.confidence}%</td>
                  <td className="p-3 text-center">
                    {txn.status !== 'Matched' && (
                      <button
                        onClick={() => reconcileTransaction(txn.id)}
                        className="bg-primary hover:bg-primary-hover text-white text-[9px] font-bold px-2.5 py-1 rounded-lg transition-all"
                      >
                        Reconcile
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ClientDashboardView() {
  const { companies, selectedCompany, setSelectedCompany, industryData } = useFinanceStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {companies.map((company) => (
          <div
            key={company}
            onClick={() => setSelectedCompany(company)}
            className={`bg-white rounded-18px border p-5 cursor-pointer transition-all ${
              selectedCompany === company
                ? 'border-primary shadow-premium'
                : 'border-slate-100 shadow-soft hover:shadow-premium'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm font-heading">
                {company.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate">{company}</h4>
                <p className="text-[9px] text-slate-400 font-medium">GSTIN: 27AAACX1234F1ZA</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <div className="font-bold text-slate-400 uppercase">Revenue</div>
                <div className="font-extrabold text-slate-700 mt-0.5">₹{(industryData.kpis.revenue / 100000).toFixed(1)}L</div>
              </div>
              <div>
                <div className="font-bold text-slate-400 uppercase">GST Health</div>
                <div className="font-extrabold text-emerald-600 mt-0.5">{industryData.healthScores.gst}%</div>
              </div>
            </div>
            {selectedCompany === company && (
              <div className="mt-3 bg-primary/5 text-primary text-[9px] font-bold text-center py-1 rounded-lg uppercase tracking-wider">
                Active
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Company Info */}
      <div className="bg-white rounded-18px border border-slate-100 shadow-soft p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-widest border-b border-slate-100 pb-2">Company Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Company Name</label>
            <input type="text" defaultValue="AlgoForce Tech Pvt Ltd" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">GSTIN</label>
            <input type="text" defaultValue="27ALGO1234F1Z5" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Industry</label>
            <input type="text" defaultValue="Manufacturing & Technology" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Financial Year</label>
            <input type="text" defaultValue="2026-2027" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none" />
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-18px border border-slate-100 shadow-soft p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-widest border-b border-slate-100 pb-2">API Keys & Integrations</h3>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Live API Key</div>
            <div className="text-xs font-mono text-slate-700 font-medium mt-0.5">af_live_sk_2026_•••••••••••••8f3a</div>
          </div>
          <button className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all">
            Copy
          </button>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Tally Connector Key</div>
            <div className="text-xs font-mono text-slate-700 font-medium mt-0.5">tally_prime_v5_•••••••••4c1b</div>
          </div>
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all">
            Regenerate
          </button>
        </div>
      </div>

      {/* Branding */}
      <div className="bg-white rounded-18px border border-slate-100 shadow-soft p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-widest border-b border-slate-100 pb-2">Branding & Theme</h3>
        <div className="flex items-center space-x-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Primary Color</label>
            <div className="flex items-center space-x-2">
              <input type="color" defaultValue="#7C3AED" className="w-8 h-8 border-none cursor-pointer rounded" />
              <span className="text-xs font-mono text-slate-600">#7C3AED</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Secondary Color</label>
            <div className="flex items-center space-x-2">
              <input type="color" defaultValue="#0B2343" className="w-8 h-8 border-none cursor-pointer rounded" />
              <span className="text-xs font-mono text-slate-600">#0B2343</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

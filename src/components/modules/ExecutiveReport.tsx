'use client';
import React, { useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Download, CheckCircle2, RefreshCw, AlertTriangle, TrendingUp, TrendingDown, ShieldCheck, FileText } from 'lucide-react';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

export const ExecutiveReport: React.FC = () => {
  const { industryData, gstIssues, auditIssues } = useFinanceStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const kpis = industryData.kpis;
  const health = industryData.healthScores;
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      // Grab the report element HTML
      const reportEl = document.getElementById('report-document');
      if (!reportEl) { setIsExporting(false); return; }

      const rawHTML = reportEl.innerHTML;
      // Fix relative src paths → absolute so they load in the popup origin
      const origin = window.location.origin;
      const reportHTML = rawHTML.replace(/src="(\/[^"]+)"/g, `src="${origin}$1"`);

      // Open a clean popup window with just the report
      const printWindow = window.open('', '_blank', 'width=960,height=750');
      if (!printWindow) { setIsExporting(false); return; }

      printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <base href="${origin}/" />
  <title>AlgoForce Board Report — ${today}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 11px;
      color: #0f172a;
      background: #fff;
      padding: 24px 32px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', sans-serif; }
    h1 { font-size: 20px; font-weight: 800; color: #0B2343; }
    h2 { font-size: 12px; font-weight: 700; color: #0B2343; margin-top: 24px; margin-bottom: 10px; }
    p  { line-height: 1.6; }

    /* Grid layouts */
    .grid { display: grid !important; }
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
    .grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
    .grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
    .sm\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
    .sm\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
    .gap-3 { gap: 10px !important; }
    .gap-4 { gap: 12px !important; }

    /* Flex */
    .flex { display: flex !important; }
    .flex-col { flex-direction: column !important; }
    .flex-row { flex-direction: row !important; }
    .items-center { align-items: center !important; }
    .items-start { align-items: flex-start !important; }
    .items-end { align-items: flex-end !important; }
    .justify-between { justify-content: space-between !important; }
    .flex-1 { flex: 1 1 0% !important; }
    .flex-shrink-0 { flex-shrink: 0 !important; }
    .gap-2 { gap: 6px !important; }
    .gap-3 { gap: 10px !important; }
    .gap-4 { gap: 14px !important; }
    .gap-6 { gap: 20px !important; }
    .space-y-2 > * + * { margin-top: 6px !important; }
    .space-y-4 > * + * { margin-top: 14px !important; }
    .space-y-6 > * + * { margin-top: 20px !important; }

    /* Sizing */
    .w-full { width: 100% !important; }
    .w-5 { width: 18px !important; height: 18px !important; }
    .w-14 { width: 52px !important; height: 52px !important; }
    .w-32 { width: 120px !important; }
    .min-w-0 { min-width: 0 !important; }

    /* Spacing */
    .p-3  { padding: 10px !important; }
    .p-4  { padding: 14px !important; }
    .p-6  { padding: 22px !important; }
    .p-10 { padding: 38px !important; }
    .px-3 { padding-left: 10px !important; padding-right: 10px !important; }
    .py-0\\.5 { padding-top: 2px !important; padding-bottom: 2px !important; }
    .pb-2  { padding-bottom: 6px !important; }
    .pb-6  { padding-bottom: 22px !important; }
    .mb-1  { margin-bottom: 3px !important; }
    .mb-2  { margin-bottom: 6px !important; }
    .mb-4  { margin-bottom: 14px !important; }
    .mb-6  { margin-bottom: 22px !important; }
    .mb-8  { margin-bottom: 30px !important; }
    .mt-0\\.5 { margin-top: 2px !important; }
    .mt-1  { margin-top: 4px !important; }
    .mt-1\\.5 { margin-top: 6px !important; }
    .mt-6  { margin-top: 22px !important; }
    .mt-10 { margin-top: 38px !important; }
    .pt-4  { padding-top: 14px !important; }
    .pt-6  { padding-top: 22px !important; }

    /* Colors */
    .text-slate-800 { color: #1e293b !important; }
    .text-slate-700 { color: #334155 !important; }
    .text-slate-600 { color: #475569 !important; }
    .text-slate-500 { color: #64748b !important; }
    .text-slate-400 { color: #94a3b8 !important; }
    .text-slate-300 { color: #cbd5e1 !important; }
    .text-slate-900 { color: #0f172a !important; }
    .text-emerald-600 { color: #059669 !important; }
    .text-emerald-700 { color: #047857 !important; }
    .text-rose-500   { color: #f43f5e !important; }
    .text-rose-600   { color: #e11d48 !important; }
    .text-amber-600  { color: #d97706 !important; }
    .text-sky-600    { color: #0284c7 !important; }
    .text-violet-600 { color: #7c3aed !important; }
    .text-primary    { color: #7C3AED !important; }
    .text-white      { color: #ffffff !important; }

    /* Background colors */
    .bg-slate-50  { background: #f8fafc !important; }
    .bg-slate-900 { background: #0f172a !important; }
    .bg-emerald-50 { background: #ecfdf5 !important; }
    .bg-rose-50    { background: #fff1f2 !important; }
    .bg-amber-50   { background: #fffbeb !important; }
    .bg-sky-50     { background: #f0f9ff !important; }
    .bg-primary    { background: #7C3AED !important; }
    .bg-rose-100   { background: #ffe4e6 !important; }
    .bg-amber-100  { background: #fef3c7 !important; }

    /* Borders */
    .border       { border: 1px solid #e2e8f0 !important; }
    .border-b     { border-bottom: 1px solid #e2e8f0 !important; }
    .border-b-2   { border-bottom: 2px solid !important; }
    .border-t     { border-top: 1px solid #e2e8f0 !important; }
    .border-t-2   { border-top: 2px solid #e2e8f0 !important; }
    .border-slate-100 { border-color: #f1f5f9 !important; }
    .border-slate-800 { border-color: #1e293b !important; }
    .border-rose-100  { border-color: #ffe4e6 !important; }
    .border-amber-100 { border-color: #fef3c7 !important; }
    .border-sky-100   { border-color: #e0f2fe !important; }
    .border-primary\/20 { border-color: rgba(124,58,237,0.2) !important; }

    /* Border radius */
    .rounded    { border-radius: 4px !important; }
    .rounded-lg { border-radius: 8px !important; }
    .rounded-xl { border-radius: 12px !important; }
    .rounded-2xl { border-radius: 16px !important; }
    .rounded-full { border-radius: 9999px !important; }
    .overflow-hidden { overflow: hidden !important; }

    /* Typography */
    .font-heading { font-family: 'Outfit', sans-serif !important; }
    .font-extrabold { font-weight: 800 !important; }
    .font-bold    { font-weight: 700 !important; }
    .font-semibold { font-weight: 600 !important; }
    .font-medium  { font-weight: 500 !important; }
    .text-xl  { font-size: 18px !important; }
    .text-lg  { font-size: 16px !important; }
    .text-sm  { font-size: 13px !important; }
    .text-xs  { font-size: 11px !important; }
    .text-base { font-size: 14px !important; }
    .text-\\[10px\\] { font-size: 10px !important; }
    .text-\\[11px\\] { font-size: 11px !important; }
    .text-\\[9px\\]  { font-size: 9px !important; }
    .uppercase { text-transform: uppercase !important; }
    .tracking-wider { letter-spacing: 0.05em !important; }
    .tracking-widest { letter-spacing: 0.1em !important; }
    .leading-relaxed { line-height: 1.625 !important; }
    .italic { font-style: italic !important; }
    .text-left   { text-align: left !important; }
    .text-right  { text-align: right !important; }
    .text-center { text-align: center !important; }

    /* Table */
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 8px; background: #f8fafc; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 2px solid #e2e8f0; }
    td { padding: 7px 8px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 10px; }
    tr:last-child td { border-bottom: none; }

    /* Gradient text */
    .text-gradient {
      background: linear-gradient(135deg, #7C3AED 0%, #0B2343 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Misc */
    .shrink-0 { flex-shrink: 0 !important; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .hidden { display: none !important; }
    .flex-wrap { flex-wrap: wrap !important; }

    /* SVG / Lucide icons */
    svg { display: inline-block; vertical-align: middle; flex-shrink: 0; }
    .w-3 { width: 12px !important; height: 12px !important; }
    .h-3 { height: 12px !important; }
    .w-3\\.5 { width: 14px !important; height: 14px !important; }
    .h-3\\.5 { height: 14px !important; }
    .w-4 { width: 16px !important; height: 16px !important; }
    .h-4 { height: 16px !important; }
    .gap-0\\.5 { gap: 2px !important; }

    /* Images */
    span[style*="box-sizing"] { display: inline !important; }
    img { max-width: 100%; height: auto; }

    /* Report sections: avoid page breaks */
    .report-section { page-break-inside: avoid; margin-bottom: 24px; }
    section { page-break-inside: avoid; }

    /* Overflow for tables */
    .overflow-x-auto { overflow-x: visible !important; }

    @page {
      size: A4 portrait;
      margin: 12mm 14mm;
    }

    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div id="print-root">${reportHTML}</div>
  <script>
    // Auto print after fonts load
    document.fonts.ready.then(function() {
      setTimeout(function() { window.print(); }, 300);
    });
  </script>
</body>
</html>`);

      printWindow.document.close();

      setIsExporting(false);
      setExportDone(true);
    }, 1000);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Export Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-100 rounded-2xl shadow-soft print:hidden">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-heading">Board Executive Summary</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Download investor and CA-ready PDF compliance briefing</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Verified</span>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? (
              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Generating...</span></>
            ) : (
              <><Download className="w-3.5 h-3.5" /><span>Export PDF</span></>
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {exportDone && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 max-w-sm w-full text-center space-y-4"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 font-heading">Report Exported!</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
                  Your browser&apos;s print/save-as-PDF dialog has opened. Save as PDF to download the report.
                </p>
              </div>
              <button onClick={() => setExportDone(false)} className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl w-full">
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────── */}
      {/* REPORT DOCUMENT — this is the element that gets printed */}
      {/* ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-premium mx-auto w-full max-w-4xl print-report" id="report-document">
        <div className="p-6 sm:p-10">

          {/* ── REPORT HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b-2 border-slate-800 pb-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${typeof window !== 'undefined' ? window.location.origin : ''}/logo.jpg`} alt="AlgoForce" width={56} height={56} style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 font-heading leading-tight">Board Executive Report</h1>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                  {industryData.industryName} · AlgoForce Finance AI CFO
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <span className="text-[9px] font-extrabold bg-slate-900 text-white px-3 py-1 rounded-lg uppercase tracking-wider">CONFIDENTIAL</span>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Report Date: {today}</p>
              <p className="text-[9px] text-slate-400 font-medium">Period: Q2 FY 2025-26</p>
              <p className="text-[9px] text-slate-400 font-medium">GSTIN: 27ALGO1234F1Z5</p>
            </div>
          </div>

          {/* ── SECTION 1: EXECUTIVE SUMMARY METRICS ── */}
          <section className="report-section mb-8">
            <h2 className="text-sm font-extrabold text-slate-800 font-heading uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary text-white text-[9px] flex items-center justify-center font-bold">1</span>
              Financial Summary — Q2 FY 2025-26
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Operating Revenue', value: `₹${(kpis.revenue / 100000).toFixed(2)}L`, change: '+12%', positive: true },
                { label: 'Net Operating Profit', value: `₹${((kpis.revenue - kpis.expenses) / 100000).toFixed(2)}L`, change: '36.4% margin', positive: true },
                { label: 'GST Liability', value: `₹${(kpis.gstDue / 100000).toFixed(2)}L`, change: 'Due in 8 days', positive: false },
                { label: 'Receivables Outstanding', value: `₹${(kpis.receivables / 100000).toFixed(2)}L`, change: '23 clients', positive: null },
              ].map((m) => (
                <div key={m.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{m.label}</div>
                  <div className="text-base font-extrabold text-slate-800 font-heading mt-1">{m.value}</div>
                  <div className={`text-[9px] font-bold mt-0.5 flex items-center gap-0.5 ${m.positive === true ? 'text-emerald-600' : m.positive === false ? 'text-amber-600' : 'text-slate-500'}`}>
                    {m.positive === true && <TrendingUp className="w-3 h-3" />}
                    {m.positive === false && <TrendingDown className="w-3 h-3" />}
                    {m.change}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 2: HEALTH SCORES ── */}
          <section className="report-section mb-8">
            <h2 className="text-sm font-extrabold text-slate-800 font-heading uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary text-white text-[9px] flex items-center justify-center font-bold">2</span>
              AI Composite Health Index
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold text-[9px]">
                    <th className="text-left p-3 rounded-tl-xl">Health Category</th>
                    <th className="text-center p-3">Score</th>
                    <th className="text-center p-3">Status</th>
                    <th className="text-left p-3 rounded-tr-xl">AI Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Overall Financial Health', score: health.overall, rec: 'Strong fundamentals. Monitor cash burn vs receivables cycle.' },
                    { cat: 'Cash Flow Management', score: health.cashFlow, rec: 'Accelerate collections from top 5 overdue accounts.' },
                    { cat: 'GST Compliance', score: health.gst, rec: 'File GSTR-3B before due date. Reconcile ITC mismatches.' },
                    { cat: 'Receivables Aging', score: health.receivables, rec: '₹12.3L overdue 60+ days. Trigger AI Collections Manager.' },
                    { cat: 'Audit Integrity', score: health.audit, rec: 'Resolve 3 flagged duplicate entries in purchase ledger.' },
                  ].map((row) => (
                    <tr key={row.cat} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-700">{row.cat}</td>
                      <td className="p-3 text-center">
                        <span className={`font-extrabold text-sm font-heading ${row.score >= 80 ? 'text-emerald-600' : row.score >= 60 ? 'text-amber-600' : 'text-rose-500'}`}>
                          {row.score}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${row.score >= 80 ? 'bg-emerald-50 text-emerald-600' : row.score >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-500'}`}>
                          {row.score >= 80 ? 'Healthy' : row.score >= 60 ? 'Monitor' : 'Critical'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 leading-relaxed">{row.rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── SECTION 3: AUDIT EXCEPTIONS ── */}
          <section className="report-section mb-8">
            <h2 className="text-sm font-extrabold text-slate-800 font-heading uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary text-white text-[9px] flex items-center justify-center font-bold">3</span>
              Audit & Compliance Exceptions
            </h2>
            <p className="text-[11px] text-slate-500 mb-3 font-medium">
              AI Auditor scanned 500+ vouchers. Below are the key risk items flagged for CA review:
            </p>
            <div className="space-y-2">
              {auditIssues.slice(0, 3).map((issue, i) => (
                <div key={issue.id} className={`p-4 rounded-xl border flex items-start gap-3 ${i === 0 ? 'bg-rose-50 border-rose-100' : i === 1 ? 'bg-amber-50 border-amber-100' : 'bg-sky-50 border-sky-100'}`}>
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${i === 0 ? 'text-rose-500' : i === 1 ? 'text-amber-500' : 'text-sky-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 text-[11px]">{issue.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${issue.risk === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                        {issue.risk} Risk
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">Confidence: {issue.confidence}%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{issue.desc}</p>
                    <p className="text-[10px] font-bold text-slate-700 mt-1">Amount at risk: ₹{issue.amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 4: STRATEGIC ACTION PLAN ── */}
          <section className="report-section mb-8">
            <h2 className="text-sm font-extrabold text-slate-800 font-heading uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary text-white text-[9px] flex items-center justify-center font-bold">4</span>
              AI-Generated Strategic Action Plan
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold text-[9px]">
                    <th className="text-left p-3 rounded-tl-xl">#</th>
                    <th className="text-left p-3">Action Item</th>
                    <th className="text-center p-3">Priority</th>
                    <th className="text-center p-3">Assigned Agent</th>
                    <th className="text-right p-3 rounded-tr-xl">Est. Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: 1, action: 'Reconcile Jindal Alloys duplicate purchase ledger entries', pri: 'Critical', agent: 'AI Auditor', impact: `₹${auditIssues[0]?.amount.toLocaleString('en-IN') || '45,000'}` },
                    { n: 2, action: 'Submit GSTR-2B Input Tax Credit correction before due date', pri: 'High', agent: 'AI GST Expert', impact: `₹${gstIssues[0]?.amount.toLocaleString('en-IN') || '18,200'}` },
                    { n: 3, action: 'Trigger WhatsApp collection follow-up — Apex Automotives', pri: 'High', agent: 'AI Collections', impact: '₹1,24,160' },
                    { n: 4, action: 'Review bank reconciliation — ICICI overdraft flag', pri: 'Medium', agent: 'AI CFO', impact: '₹38,500' },
                    { n: 5, action: 'Upload March invoice batch to OCR engine for Tally sync', pri: 'Low', agent: 'AI OCR Engine', impact: '12 invoices' },
                  ].map((row) => (
                    <tr key={row.n} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-3 text-slate-400 font-bold">{row.n}</td>
                      <td className="p-3 text-slate-700 font-medium leading-relaxed">{row.action}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          row.pri === 'Critical' ? 'bg-rose-50 text-rose-600' :
                          row.pri === 'High' ? 'bg-amber-50 text-amber-600' :
                          row.pri === 'Medium' ? 'bg-sky-50 text-sky-600' :
                          'bg-slate-50 text-slate-500'
                        }`}>{row.pri}</span>
                      </td>
                      <td className="p-3 text-center font-semibold text-primary text-[10px]">{row.agent}</td>
                      <td className="p-3 text-right font-bold text-slate-700">{row.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── SECTION 5: GST SUMMARY ── */}
          <section className="report-section mb-8">
            <h2 className="text-sm font-extrabold text-slate-800 font-heading uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary text-white text-[9px] flex items-center justify-center font-bold">5</span>
              GST Compliance Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {gstIssues.slice(0, 3).map((issue) => (
                <div key={issue.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{issue.type}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      issue.severity === 'High' ? 'bg-rose-50 text-rose-600' : 
                      issue.severity === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                      'bg-emerald-50 text-emerald-600'
                    }`}>{issue.severity}</span>
                  </div>
                  <p className="text-[10px] text-slate-700 font-semibold leading-relaxed">{issue.desc}</p>
                  <p className="text-[10px] font-extrabold text-slate-800 mt-1.5">₹{issue.amount.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── SIGNATURE FOOTER ── */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mt-10 pt-6 border-t-2 border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Certified by AI Core Engine</span>
              </div>
              <div className="text-lg font-heading font-extrabold text-gradient">AlgoForce Finance AI</div>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Connected to Tally Prime · SOC 2 Compliant · End-to-end encrypted</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[10px] text-slate-400 font-medium italic mb-2">Authorised Signatory</div>
              <div className="w-32 h-8 border-b-2 border-slate-300 mb-1"></div>
              <div className="text-[9px] text-slate-400 font-medium">CA / CFO Signature</div>
            </div>
          </div>

          {/* Footer metadata line */}
          <div className="mt-6 pt-4 border-t border-slate-50 flex flex-col sm:flex-row sm:justify-between text-[9px] text-slate-300 font-medium gap-1">
            <span>AlgoForce Finance AI · Confidential & Proprietary · Not for external distribution</span>
            <span>Generated: {today} · Report ID: AF-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveReport;

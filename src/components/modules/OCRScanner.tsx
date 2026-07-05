import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { FileUp, FileText, CheckCircle2, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';
import Card from '../ui/Card';
import { motion } from 'framer-motion';

export const OCRScanner: React.FC = () => {
  const { ocrFile, ocrProgress, triggerOcrScan, setOcrFile, invoices } = useFinanceStore();

  const handleSelectSample = (type: 'invoice' | 'notice') => {
    if (type === 'invoice') {
      triggerOcrScan('Jindal_Steel_Procurement_INV_9821.pdf', 'invoice');
    } else {
      triggerOcrScan('Govt_GSTIN_TaxNotice_089A.pdf', 'notice');
    }
  };

  const handlePostToTally = () => {
    if (!ocrFile || !ocrFile.parsedData) return;

    // Check if notice or invoice
    const isNotice = ocrFile.parsedData.invoiceNumber.includes('NOTICE');
    
    if (!isNotice) {
      // Create new invoice entry and insert into list
      const newInv = {
        id: `inv-${Date.now()}`,
        invoiceNumber: ocrFile.parsedData.invoiceNumber,
        partyName: ocrFile.parsedData.partyName,
        partyGstin: ocrFile.parsedData.gstin,
        amount: ocrFile.parsedData.amount,
        gstAmount: ocrFile.parsedData.gstAmount,
        type: 'purchase' as const,
        status: 'Unpaid' as const,
        date: new Date().toISOString().split('T')[0],
        dueDate: ocrFile.parsedData.dueDate,
        hsnCode: ocrFile.parsedData.hsnCode,
        items: [{
          description: 'Iron & Steel Alloy bars (Procurement)',
          quantity: 1,
          rate: ocrFile.parsedData.amount,
          amount: ocrFile.parsedData.amount,
          hsn: ocrFile.parsedData.hsnCode
        }],
        confidence: ocrFile.parsedData.confidence
      };

      // Add to store list
      useFinanceStore.setState((state) => ({
        invoices: [newInv, ...state.invoices]
      }));

      // Add log
      useFinanceStore.getState().addTimelineEvent({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: 'AI OCR Engine',
        status: 'success',
        message: `Verified and posted Purchase Invoice ${ocrFile.parsedData.invoiceNumber} to Tally Prime database.`
      });
    } else {
      // Add to GST compliance list
      const newGstIssue = {
        id: `gst-${Date.now()}`,
        type: 'ITC Mismatch' as const,
        partyName: ocrFile.parsedData.partyName,
        gstin: ocrFile.parsedData.gstin,
        invoiceNo: ocrFile.parsedData.invoiceNumber,
        amount: 28400,
        desc: 'GST assessment notice flagged input tax discrepancy regarding vendor reconciliation.',
        status: 'Pending' as const,
        confidence: ocrFile.parsedData.confidence,
        explainText: 'Extracted GST notice regarding compliance matching of corporate vendor filings. Requires reconciliation.'
      };

      useFinanceStore.setState((state) => ({
        gstIssues: [newGstIssue, ...state.gstIssues]
      }));

      // Add log
      useFinanceStore.getState().addTimelineEvent({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: 'AI GST Expert',
        status: 'warning',
        message: 'Imported tax notice GST-NOTICE-089A. Added compliance alert to GST panel.'
      });
    }

    // Reset OCR state to show success
    setOcrFile({
      name: ocrFile.name,
      size: ocrFile.size,
      status: 'idle',
      parsedData: {
        ...ocrFile.parsedData,
        posted: true
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upload Zone & Samples */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/50 relative overflow-hidden">
          {ocrFile && ocrFile.status === 'scanning' && (
            // Scanning overlay animation
            <div className="absolute inset-0 bg-primary/5 flex flex-col items-center justify-center z-10">
              <motion.div 
                className="absolute left-0 right-0 h-1 bg-primary/40 shadow-premium"
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
              <div className="text-sm font-bold text-slate-800">Reading document lines...</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">Extracting Indian GST rates and party PAN profiles ({ocrProgress}%)</div>
            </div>
          )}

          <FileUp className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-sm font-bold text-slate-700">Drag & drop your finance document here</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Supports PDF, JPG, PNG invoices or government notices</p>

          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={() => handleSelectSample('invoice')}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span>Use Sample Invoice.pdf</span>
            </button>
            <button
              onClick={() => handleSelectSample('notice')}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Use Sample TaxNotice.pdf</span>
            </button>
          </div>
        </Card>

        {/* OCR Technology description */}
        <Card className="p-5 bg-gradient-to-br from-white to-primary/5">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-2">AlgoForce OCR Capabilities</h4>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside font-medium leading-relaxed">
            <li>Autodetects standard Indian CGST, SGST, IGST ledger distributions.</li>
            <li>Cross-references extracted GSTIN with the central GSTN portal to flag cancelled or non-filing accounts.</li>
            <li>Confidence rating engine prevents mismatch postings into Tally books.</li>
          </ul>
        </Card>
      </div>

      {/* Extracted Metadata Panel */}
      <div>
        <Card className="p-5 min-h-[380px] flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 font-heading mb-4 border-b border-slate-100 pb-2">OCR Extraction Panel</h3>

          {!ocrFile ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-16">
              <FileText className="w-10 h-10 text-slate-300 mb-2" />
              <div className="text-xs">No file scanned yet.</div>
              <div className="text-[10px] text-slate-300 mt-1">Select a sample file on the left to simulate parsing.</div>
            </div>
          ) : ocrFile.status === 'scanning' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-16">
              <div className="text-xs">Processing document data...</div>
            </div>
          ) : ocrFile.parsedData?.posted ? (
            // Success Verification Screen
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-3">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-50 text-emerald-600 p-4 rounded-full border border-emerald-100 shadow-sm"
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>
              <h4 className="text-sm font-bold text-slate-800">Verification Complete!</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                The parsed transaction has been posted to your ledger books. Synchronized indicators are active.
              </p>
              <button
                onClick={() => setOcrFile(null)}
                className="text-xs font-semibold text-primary hover:underline mt-4"
              >
                Scan another document
              </button>
            </div>
          ) : (
            // Extracted Fields View
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Extraction Confidence</div>
                  <div className="text-xs font-bold text-emerald-600 flex items-center">
                    <span>{ocrFile.parsedData.confidence}%</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Ref Number</span>
                    <span className="font-bold text-slate-800">{ocrFile.parsedData.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Company Name</span>
                    <span className="font-bold text-slate-800 text-right truncate max-w-[160px]">{ocrFile.parsedData.partyName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">GSTIN ID</span>
                    <span className="font-bold text-slate-800">{ocrFile.parsedData.gstin}</span>
                  </div>
                  {ocrFile.parsedData.amount > 0 && (
                    <>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Subtotal</span>
                        <span className="font-bold text-slate-800">₹{ocrFile.parsedData.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">GST Tax (18%)</span>
                        <span className="font-bold text-slate-800">₹{ocrFile.parsedData.gstAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Grand Total</span>
                        <span className="font-bold text-primary">₹{(ocrFile.parsedData.amount + ocrFile.parsedData.gstAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handlePostToTally}
                  className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Verify & Post to Tally Prime
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default OCRScanner;

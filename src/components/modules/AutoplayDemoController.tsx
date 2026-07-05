import React, { useEffect, useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Play, RotateCcw, ChevronRight, CheckCircle2, AlertCircle, Sparkles, MonitorPlay } from 'lucide-react';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoControllerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AutoplayDemoController: React.FC<DemoControllerProps> = ({ activeTab, setActiveTab }) => {
  const {
    demoStep,
    setDemoStep,
    isAutoplayRunning,
    setIsAutoplayRunning,
    resetDemo,
    triggerOcrScan,
    triggerWhatsAppFlow,
    simulateWhatsAppPayment,
    currentIndustry,
    setIndustry,
    setRole,
    timelineEvents
  } = useFinanceStore();

  const [expanded, setExpanded] = useState(true);
  const [currentStepText, setCurrentStepText] = useState('Idle');

  // List of steps in our demo script
  const steps = [
    { num: 1, name: 'Morning Brief', desc: 'Welcome brief & ROI outcome metrics' },
    { num: 2, name: 'Operations Room', desc: 'AI Workforce active control deck' },
    { num: 3, name: 'OCR Ingestion', desc: 'Simulate document drop & radar scan' },
    { num: 4, name: 'Agent Collaboration', desc: 'Auditor + GST + CFO verification loop' },
    { num: 5, name: 'WhatsApp collections', desc: 'Auto-reminder, replies & UPI payment' },
    { num: 6, name: 'Board Report', desc: 'Generate executive summary PDF' }
  ];

  // Demo autoplay loop runner
  useEffect(() => {
    if (!isAutoplayRunning) return;

    let timer: NodeJS.Timeout;

    const runStep = (step: number) => {
      setDemoStep(step);
      
      switch (step) {
        case 1:
          // Go to Dashboard
          setActiveTab('dashboard');
          setRole('Business_Owner');
          setCurrentStepText('Presenting CEO dashboard, morning brief, and ROI outcome numbers.');
          timer = setTimeout(() => runStep(2), 5000);
          break;

        case 2:
          // Go to Operations Room
          setActiveTab('control-center');
          setCurrentStepText('Entering AI Operations Room. Showing background bots executing tasks.');
          timer = setTimeout(() => runStep(3), 5000);
          break;

        case 3:
          // Go to OCR Scanner
          setActiveTab('invoices');
          setRole('Accountant');
          setCurrentStepText('Dropping Jindal Steel Invoice. Running AI OCR radar scan...');
          
          setTimeout(() => {
            triggerOcrScan('Jindal_Steel_Procurement_INV_9821.pdf', 'invoice');
          }, 500);

          timer = setTimeout(() => runStep(4), 6000);
          break;

        case 4:
          // Go to Audit
          setActiveTab('audit');
          setCurrentStepText('AI Auditor detects duplicate invoice. Collaborates with GST & CFO bots.');
          
          // Open details drawer
          setTimeout(() => {
            // Add timeline audit log
            useFinanceStore.getState().addTimelineEvent({
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              agent: 'AI Auditor',
              status: 'warning',
              message: 'Ledger Audit mismatch flagged on INV/2026/1108. Confirmed with GST portal.'
            });
          }, 1000);

          timer = setTimeout(() => runStep(5), 6000);
          break;

        case 5:
          // Go to Invoices (WhatsApp)
          setActiveTab('invoices');
          setRole('Accountant');
          setCurrentStepText('Sending WhatsApp reminder. Customer queries, AI replies, UPI settled.');
          
          // Trigger WhatsApp sequence
          setTimeout(() => {
            triggerWhatsAppFlow();
          }, 500);

          // Simulated delay click for payment
          setTimeout(() => {
            simulateWhatsAppPayment();
          }, 4500);

          timer = setTimeout(() => runStep(6), 6500);
          break;

        case 6:
          // Go to Reports
          setActiveTab('reports');
          setRole('Business_Owner');
          setCurrentStepText('Compiling final Board Brief report. Generating verified records.');
          
          setIsAutoplayRunning(false);
          break;

        default:
          setIsAutoplayRunning(false);
          setDemoStep(0);
          setCurrentStepText('Demo finished successfully!');
      }
    };

    runStep(1);

    return () => clearTimeout(timer);
  }, [isAutoplayRunning]);

  const handleStartDemo = () => {
    resetDemo();
    setIsAutoplayRunning(true);
  };

  const handleReset = () => {
    resetDemo();
    setCurrentStepText('Demo reset complete.');
    setActiveTab('dashboard');
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:max-w-sm font-heading print:hidden select-none cursor-grab"
    >
      <Card className="p-3 sm:p-4 shadow-premium border-2 border-primary/40 bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl relative">
        {/* iOS Drag Handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-2 pointer-events-none" />

        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <h4 className="text-xs font-bold text-slate-800">Sales Script Assistant</h4>
          </div>
          
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] text-primary font-semibold hover:underline"
            >
              {expanded ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>

        {/* Diagnostic Status Box */}
        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10.5px] leading-relaxed mb-3">
          <span className="font-bold text-slate-700">Live Status:</span>{' '}
          <span className="text-slate-500 font-medium">{currentStepText}</span>
        </div>

        {/* Detailed steps list */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 mb-4 overflow-hidden"
            >
              {steps.map((st) => {
                const isActive = demoStep === st.num;
                const isCompleted = demoStep > st.num;

                return (
                  <div
                    key={st.num}
                    className={`flex items-start space-x-3 p-1.5 rounded-lg text-xs font-semibold ${
                      isActive ? 'bg-primary-light text-primary' : 'text-slate-500'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                          isActive ? 'border-primary bg-primary text-white font-bold' : 'border-slate-300 text-slate-400'
                        }`}>
                          {st.num}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-[11px] leading-none">{st.name}</div>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stepper Actions Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleStartDemo}
            disabled={isAutoplayRunning}
            className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isAutoplayRunning ? 'Running Autoplay...' : 'Start Autoplay Script'}</span>
          </button>
          
          <button
            onClick={handleReset}
            className="p-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-red-500 transition-colors"
            title="Reset demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default AutoplayDemoController;

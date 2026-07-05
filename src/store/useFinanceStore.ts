import { create } from 'zustand';
import { generateIndustryData, IndustryType, IndustryData, Invoice, GstIssue, AuditIssue, Transaction } from '../data/dummyData';

const getFutureDate = (baseDateStr: string, daysAhead: number): string => {
  const date = new Date(baseDateStr);
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  chartData?: any[];
  chartType?: 'line' | 'bar' | 'radial';
  tableData?: any[];
  tableType?: 'invoice' | 'issue';
  confidence?: number;
  actions?: { label: string; actionKey: string }[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  agent: 'AI CFO' | 'AI Auditor' | 'AI GST Expert' | 'AI Collections Manager' | 'AI OCR Engine';
  status: 'info' | 'success' | 'warning' | 'alert';
  message: string;
}

interface FinanceStore {
  // Authentication & Roles
  role: 'Business_Owner' | 'Accountant' | 'CA' | 'Admin';
  selectedCompany: string;
  companies: string[];
  
  // Industry & Seeds
  currentIndustry: IndustryType;
  industryData: IndustryData;
  
  // Interactive Lists (states modified during demo)
  invoices: Invoice[];
  gstIssues: GstIssue[];
  auditIssues: AuditIssue[];
  transactions: Transaction[];
  timelineEvents: TimelineEvent[];
  
  // OCR Ingestion Flow
  ocrFile: { name: string; size: string; status: 'idle' | 'scanning' | 'done'; parsedData?: any } | null;
  ocrProgress: number;

  // WhatsApp Collections Simulator
  whatsappChat: { sender: 'customer' | 'ai'; text: string; time: string; showPaymentLink?: boolean }[];
  whatsappStatus: 'idle' | 'reminder_sent' | 'reply_received' | 'reply_sent' | 'paid';
  
  // Demo Presentation States
  isPresentationMode: boolean;
  demoStep: number;
  isAutoplayRunning: boolean;
  demoLogs: string[];
  
  // Command Palette & Search
  commandPaletteOpen: boolean;
  searchTerm: string;

  // Voice Interaction
  isVoiceActive: boolean;
  voiceTranscript: string;

  // Chat personas state
  activeChatPersona: 'CFO' | 'Auditor' | 'GST' | 'Collections';
  chatHistory: Record<'CFO' | 'Auditor' | 'GST' | 'Collections', ChatMessage[]>;
  isStreaming: boolean;
  streamingText: string;

  // Actions
  setRole: (role: 'Business_Owner' | 'Accountant' | 'CA' | 'Admin') => void;
  setSelectedCompany: (company: string) => void;
  setIndustry: (industry: IndustryType) => void;
  togglePresentationMode: () => void;
  setDemoStep: (step: number) => void;
  setIsAutoplayRunning: (running: boolean) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  resetDemo: () => void;
  fixGstIssue: (id: string) => void;
  fixAuditIssue: (id: string) => void;
  reconcileTransaction: (id: string, matchStatus?: 'Matched' | 'Unmatched') => void;
  setOcrFile: (file: any) => void;
  setOcrProgress: (progress: number) => void;
  triggerOcrScan: (fileName: string, fileType: string) => void;
  sendChatMessage: (text: string) => void;
  triggerAIResponse: (userMessage: string, customAnswer?: ChatMessage) => void;
  setChatPersona: (persona: 'CFO' | 'Auditor' | 'GST' | 'Collections') => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  setVoiceActive: (active: boolean) => void;
  setVoiceTranscript: (text: string) => void;
  triggerWhatsAppFlow: () => void;
  simulateWhatsAppReply: () => void;
  simulateWhatsAppPayment: () => void;
}

const initialTimelineEvents = (industry: IndustryType): TimelineEvent[] => [
  { id: '1', time: '10:10 AM', agent: 'AI Auditor', status: 'info', message: 'Connected to Tally Prime v5.2. Synced ledger records successfully.' },
  { id: '2', time: '10:12 AM', agent: 'AI GST Expert', status: 'warning', message: 'GSTR-2B sync finished. Found 1 input tax credit mismatch.' },
  { id: '3', time: '10:14 AM', agent: 'AI CFO', status: 'info', message: 'Monthly Cash Flow projection updated. Forecast remains stable.' }
];

const initialChatHistory = (): Record<'CFO' | 'Auditor' | 'GST' | 'Collections', ChatMessage[]> => ({
  CFO: [
    {
      sender: 'ai',
      text: 'Hello, I am your AI CFO. I monitor capital schedules, overhead trends, and balance projections. What would you like to analyze today?',
      timestamp: '10:15 AM'
    }
  ],
  Auditor: [
    {
      sender: 'ai',
      text: 'Hello, I am your AI Auditor. I scan ledger items, flag voucher duplicates, and highlight code compliance risks. Let me know if you would like me to review the accounts.',
      timestamp: '10:15 AM'
    }
  ],
  GST: [
    {
      sender: 'ai',
      text: 'Hello, I am your AI GST Expert. I cross-reference GSTR-2B returns with purchases, identify wrong GSTIN configurations, and compute tax filings. Let me know if you have filing queries.',
      timestamp: '10:15 AM'
    }
  ],
  Collections: [
    {
      sender: 'ai',
      text: 'Hello, I am your AI Collections Manager. I monitor unpaid invoices, organize customer outreach scripts, and trigger reminders. Ready to look at outstanding receivables?',
      timestamp: '10:15 AM'
    }
  ]
});

export const useFinanceStore = create<FinanceStore>((set, get) => {
  // Load baseline seed
  const initialIndustry: IndustryType = 'Manufacturing';
  const initialData = generateIndustryData(initialIndustry);

  return {
    role: 'Business_Owner',
    selectedCompany: 'AlgoForce Tech Pvt Ltd',
    companies: ['AlgoForce Tech Pvt Ltd', 'AlgoForce Manufacturing', 'Kiran Traders', 'Sunrise Hotel'],
    
    currentIndustry: initialIndustry,
    industryData: initialData,
    
    invoices: initialData.invoices,
    gstIssues: initialData.gstIssues,
    auditIssues: initialData.auditIssues,
    transactions: initialData.transactions,
    timelineEvents: initialTimelineEvents(initialIndustry),
    
    ocrFile: null,
    ocrProgress: 0,

    whatsappChat: [],
    whatsappStatus: 'idle',
    
    isPresentationMode: false,
    demoStep: 0,
    isAutoplayRunning: false,
    demoLogs: [],
    
    commandPaletteOpen: false,
    searchTerm: '',

    isVoiceActive: false,
    voiceTranscript: '',

    activeChatPersona: 'CFO',
    chatHistory: initialChatHistory(),
    isStreaming: false,
    streamingText: '',

    setRole: (role) => set({ role }),
    setSelectedCompany: (company) => set({ selectedCompany: company }),
    
    setIndustry: (industry) => {
      const data = generateIndustryData(industry);
      set({
        currentIndustry: industry,
        industryData: data,
        invoices: data.invoices,
        gstIssues: data.gstIssues,
        auditIssues: data.auditIssues,
        transactions: data.transactions,
        timelineEvents: initialTimelineEvents(industry)
      });
    },

    togglePresentationMode: () => set((state) => ({ isPresentationMode: !state.isPresentationMode })),
    setDemoStep: (demoStep) => set({ demoStep }),
    setIsAutoplayRunning: (isAutoplayRunning) => set({ isAutoplayRunning }),
    
    addTimelineEvent: (event) => set((state) => {
      const newEvent: TimelineEvent = {
        ...event,
        id: Math.random().toString(36).substring(7)
      };
      return { timelineEvents: [newEvent, ...state.timelineEvents].slice(0, 30) }; // cap logs
    }),

    resetDemo: () => {
      const defaultData = generateIndustryData(get().currentIndustry);
      set({
        role: 'Business_Owner',
        selectedCompany: 'AlgoForce Tech Pvt Ltd',
        invoices: defaultData.invoices,
        gstIssues: defaultData.gstIssues,
        auditIssues: defaultData.auditIssues,
        transactions: defaultData.transactions,
        timelineEvents: initialTimelineEvents(get().currentIndustry),
        ocrFile: null,
        ocrProgress: 0,
        whatsappChat: [],
        whatsappStatus: 'idle',
        demoStep: 0,
        isAutoplayRunning: false,
        chatHistory: initialChatHistory(),
        commandPaletteOpen: false,
        searchTerm: '',
        isVoiceActive: false,
        voiceTranscript: ''
      });
    },

    fixGstIssue: (id) => set((state) => {
      const updated = state.gstIssues.map((issue) => 
        issue.id === id ? { ...issue, status: 'Fixed' as const } : issue
      );
      // Adjust ROI / KPI state accordingly
      const data = { ...state.industryData };
      data.roiStats.gstErrorsPrevented += 1;
      
      // Add timeline log
      const issue = state.gstIssues.find(i => i.id === id);
      setTimeout(() => {
        get().addTimelineEvent({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agent: 'AI GST Expert',
          status: 'success',
          message: `Fixed tax issue for ${issue?.partyName || 'Vendor'}: Checked and re-submitted correct filing records.`
        });
      }, 500);

      return { 
        gstIssues: updated,
        industryData: data
      };
    }),

    fixAuditIssue: (id) => set((state) => {
      const updated = state.auditIssues.map((issue) => 
        issue.id === id ? { ...issue, status: 'Fixed' as const } : issue
      );
      const data = { ...state.industryData };
      data.roiStats.auditIssuesFixed += 1;

      const issue = state.auditIssues.find(i => i.id === id);
      setTimeout(() => {
        get().addTimelineEvent({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agent: 'AI Auditor',
          status: 'success',
          message: `Resolved Audit warning: Voucher mismatch for ${issue?.title || 'ledger entry'} solved.`
        });
      }, 500);

      return { 
        auditIssues: updated,
        industryData: data
      };
    }),

    reconcileTransaction: (id, status = 'Matched') => set((state) => {
      const updated = state.transactions.map((txn) =>
        txn.id === id ? { ...txn, status: status, confidence: 100 } : txn
      );
      
      const txn = state.transactions.find(t => t.id === id);
      setTimeout(() => {
        get().addTimelineEvent({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agent: 'AI CFO',
          status: 'success',
          message: `Reconciled transaction ref: ${txn?.refNo || 'TXN'} with bank ledger.`
        });
      }, 500);

      return { transactions: updated };
    }),

    setOcrFile: (ocrFile) => set({ ocrFile }),
    setOcrProgress: (ocrProgress) => set({ ocrProgress }),
    
    triggerOcrScan: (fileName, fileType) => {
      set({
        ocrFile: {
          name: fileName,
          size: '1.2 MB',
          status: 'scanning'
        },
        ocrProgress: 10
      });

      const timer = setInterval(() => {
        const currentProgress = get().ocrProgress;
        if (currentProgress < 100) {
          set({ ocrProgress: currentProgress + 30 });
        } else {
          clearInterval(timer);
          
          // Successful OCR scan parsing
          let parsedData = {
            invoiceNumber: 'INV/2026/9821',
            partyName: 'Jindal Steel & Alloys',
            gstin: '27JIND1234F1Z5',
            amount: 145000,
            gstAmount: 26100,
            dueDate: getFutureDate(new Date().toISOString(), 30),
            hsnCode: 'HSN-7210',
            confidence: 98
          };

          if (fileType.includes('notice')) {
            parsedData = {
              invoiceNumber: 'GST-NOTICE-089A',
              partyName: 'GST Department Ward 4',
              gstin: 'GST-GOVT-IN-27',
              amount: 0,
              gstAmount: 0,
              dueDate: getFutureDate(new Date().toISOString(), 15),
              hsnCode: 'N/A',
              confidence: 96
            };
          }

          set({
            ocrFile: {
              name: fileName,
              size: '1.2 MB',
              status: 'done',
              parsedData
            }
          });

          // Add timeline log
          get().addTimelineEvent({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            agent: 'AI OCR Engine',
            status: 'success',
            message: `Extracted details from ${fileName} with 98% confidence. Created temporary transaction.`
          });
        }
      }, 800);
    },

    setChatPersona: (activeChatPersona) => set({ activeChatPersona }),
    setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setVoiceActive: (isVoiceActive) => set({ isVoiceActive }),
    setVoiceTranscript: (voiceTranscript) => set({ voiceTranscript }),

    sendChatMessage: (text) => {
      const persona = get().activeChatPersona;
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newMsg: ChatMessage = {
        sender: 'user',
        text,
        timestamp: time
      };

      set((state) => {
        const history = { ...state.chatHistory };
        history[persona] = [...history[persona], newMsg];
        return { chatHistory: history };
      });

      // Simulates AI streaming response
      get().triggerAIResponse(text);
    },

    triggerAIResponse: (userMessage, customAnswer) => {
      const persona = get().activeChatPersona;
      set({ isStreaming: true, streamingText: '' });

      let aiText = `I have received your request: "${userMessage}". Let me fetch the relevant database tables from your Tally connector.`;
      let chartData: any[] | undefined = undefined;
      let chartType: 'line' | 'bar' | 'radial' | undefined = undefined;
      let tableData: any[] | undefined = undefined;
      let tableType: 'invoice' | 'issue' | undefined = undefined;
      let actions: any[] | undefined = undefined;

      const lower = userMessage.toLowerCase();
      
      if (persona === 'CFO') {
        if (lower.includes('revenue') || lower.includes('growth')) {
          aiText = `Based on current records, our Revenue for this period is ₹${get().industryData.kpis.revenue.toLocaleString('en-IN')}, up by 12% compared to last month. Major repeat orders from manufacturing supply lines contributed to this growth.`;
          chartType = 'bar';
          chartData = [
            { month: 'Apr', revenue: Math.floor(get().industryData.kpis.revenue * 0.8) },
            { month: 'May', revenue: Math.floor(get().industryData.kpis.revenue * 0.9) },
            { month: 'Jun', revenue: get().industryData.kpis.revenue }
          ];
        } else if (lower.includes('cash flow') || lower.includes('predict')) {
          aiText = `Cash projections estimate that available working capital remains safe. However, due to outstanding collections (₹${get().industryData.kpis.receivables.toLocaleString('en-IN')}), there is a 18% risk of cash dipping below ₹5,00,000 in 18 days unless reminders are dispatched.`;
          chartType = 'line';
          chartData = [
            { day: 'Day 5', cash: get().industryData.kpis.cashAvailable },
            { day: 'Day 10', cash: Math.floor(get().industryData.kpis.cashAvailable * 0.9) },
            { day: 'Day 15', cash: Math.floor(get().industryData.kpis.cashAvailable * 0.75) },
            { day: 'Day 20', cash: Math.floor(get().industryData.kpis.cashAvailable * 0.85) }
          ];
          actions = [
            { label: 'Optimize Cash Flow', actionKey: 'cash_optimize' },
            { label: 'View Receivables', actionKey: 'receivables_view' }
          ];
        }
      } else if (persona === 'Auditor') {
        if (lower.includes('duplicate') || lower.includes('anomaly')) {
          aiText = `Ledger analysis has flagged duplicate voucher INV/2026/1028 under vendor "${get().invoices[28]?.partyName || 'Vedanta Metals'}" with a confidence score of 99%. Both entries reference the same invoice code.`;
          tableType = 'issue';
          tableData = [get().auditIssues[0]];
          actions = [
            { label: 'Resolve Anomaly', actionKey: 'resolve_audit' }
          ];
        }
      } else if (persona === 'GST') {
        if (lower.includes('health') || lower.includes('gst')) {
          aiText = `GST health index stands at ${get().industryData.healthScores.gst}%. We found 1 Input Tax Credit (ITC) mismatch in GSTR-2B records and 1 Wrong GSTIN value in the customer ledger database.`;
          tableType = 'issue';
          tableData = get().gstIssues.slice(0, 2);
        }
      } else if (persona === 'Collections') {
        if (lower.includes('unpaid') || lower.includes('overdue')) {
          aiText = `Outstanding Receivables total ₹${get().industryData.kpis.receivables.toLocaleString('en-IN')}. ABC Manufacturing has the highest pending invoice at ₹${(get().industryData.kpis.receivables * 0.4).toLocaleString('en-IN')}.`;
          tableType = 'invoice';
          tableData = get().invoices.filter(i => i.status === 'Overdue' || i.status === 'Unpaid').slice(0, 3);
          actions = [
            { label: 'Trigger WhatsApp Follow-up', actionKey: 'whatsapp_collections' }
          ];
        }
      }

      if (customAnswer) {
        aiText = customAnswer.text;
        chartData = customAnswer.chartData;
        chartType = customAnswer.chartType;
        tableData = customAnswer.tableData;
        tableType = customAnswer.tableType;
        actions = customAnswer.actions;
      }

      // Stream text effect
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < aiText.length) {
          set({ streamingText: aiText.substring(0, idx + 3) });
          idx += 3;
        } else {
          clearInterval(interval);
          
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const responseMsg: ChatMessage = {
            sender: 'ai',
            text: aiText,
            timestamp: time,
            chartData,
            chartType,
            tableData,
            tableType,
            actions
          };

          set((state) => {
            const history = { ...state.chatHistory };
            history[persona] = [...history[persona], responseMsg];
            return {
              chatHistory: history,
              isStreaming: false,
              streamingText: ''
            };
          });
        }
      }, 10);
    },

    triggerWhatsAppFlow: () => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({
        whatsappStatus: 'reminder_sent',
        whatsappChat: [
          {
            sender: 'ai',
            text: `Dear Accounts Team at Apex Automotives,\n\nThis is an automated reminder from AlgoForce Finance AI regarding invoice INV/2026/1024 for ₹1,28,000, which was due on 30/06/2026.\n\nPlease complete payment here: https://pay.algoforce.ai/lnk_981a\n\nRegards,\nAlgoForce Accounts`,
            time
          }
        ]
      });

      // Add timeline log
      get().addTimelineEvent({
        time,
        agent: 'AI Collections Manager',
        status: 'info',
        message: 'WhatsApp collection reminder sent to Apex Automotives.'
      });

      // Trigger automatic simulated reply
      setTimeout(() => {
        get().simulateWhatsAppReply();
      }, 2500);
    },

    simulateWhatsAppReply: () => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set((state) => ({
        whatsappStatus: 'reply_received',
        whatsappChat: [
          ...state.whatsappChat,
          {
            sender: 'customer',
            text: `Hi, we noticed a minor mismatch in the GST rate on line item 2. It was billed at 18%, but the PO said 12%. Can you confirm?`,
            time
          }
        ]
      }));

      // Simulate AI response formulation
      setTimeout(() => {
        const respondTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        set((state) => ({
          whatsappStatus: 'reply_sent',
          whatsappChat: [
            ...state.whatsappChat,
            {
              sender: 'ai',
              text: `Hello Apex Automotives. We verified the item. The 18% rate is correct as per updated GST Schedule III (Chapter 72). However, as a valued partner, we have adjusted the commercial discount by 3% to match your PO net budget.\n\nHere is your updated payment link for ₹1,24,160: https://pay.algoforce.ai/lnk_981a_v2`,
              time: respondTime,
              showPaymentLink: true
            }
          ]
        }));
      }, 2500);
    },

    simulateWhatsAppPayment: () => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Update state
      set((state) => {
        const invoicesUpdated = state.invoices.map((inv) =>
          inv.invoiceNumber.includes('1024') ? { ...inv, status: 'Paid' as const } : inv
        );
        const data = { ...state.industryData };
        data.roiStats.recoveredAmount += 124160;
        data.roiStats.outstandingReduced += 124160;

        return {
          whatsappStatus: 'paid',
          invoices: invoicesUpdated,
          industryData: data,
          whatsappChat: [
            ...state.whatsappChat,
            {
              sender: 'customer',
              text: `Payment completed. Ref: UPI_98263189A. Thanks.`,
              time
            },
            {
              sender: 'ai',
              text: `Thank you. Payment of ₹1,24,160 received. Invoice status updated to Paid. Receipt VOUCH/2026/PAY_982 has been posted in Tally Prime.`,
              time
            }
          ]
        };
      });

      // Add timeline log
      get().addTimelineEvent({
        time,
        agent: 'AI Collections Manager',
        status: 'success',
        message: 'Payment received via WhatsApp UPI link (₹1,24,160). Ledger updated.'
      });
    }
  };
});

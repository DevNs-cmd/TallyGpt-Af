import React, { useState, useEffect, useRef } from 'react';
import { useFinanceStore, ChatMessage } from '../../store/useFinanceStore';
import { Brain, ShieldCheck, FileText, Coins, Send, Mic, Play, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

export const PersonaChat: React.FC = () => {
  const {
    activeChatPersona,
    setChatPersona,
    chatHistory,
    sendChatMessage,
    isStreaming,
    streamingText,
    isVoiceActive,
    setVoiceActive,
    setVoiceTranscript,
    triggerWhatsAppFlow
  } = useFinanceStore();

  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamingText]);

  // Suggestions map by persona
  const suggestions = {
    CFO: [
      'What was our revenue this month?',
      'Predict cash flow',
      'Generate cash summary'
    ],
    Auditor: [
      'Find duplicate entries',
      'Check ledger anomalies',
      'Review missing vouchers'
    ],
    GST: [
      'Check GST Health score',
      'Find ITC mismatches',
      'Verify wrong GSTINs'
    ],
    Collections: [
      'Show unpaid invoices',
      'Trigger WhatsApp follow-up',
      'Predict late payments'
    ]
  };

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage.trim());
    setInputMessage('');
  };

  const handleSuggestionClick = (sug: string) => {
    sendChatMessage(sug);
  };

  // Voice Speech Recognition implementation
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please try Chrome.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Indian English
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setVoiceActive(true);
    setVoiceTranscript('Listening...');

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setVoiceTranscript(speechToText);
      setInputMessage(speechToText);
      setVoiceActive(false);

      // Instantly trigger search after short delay
      setTimeout(() => {
        sendChatMessage(speechToText);
        setInputMessage('');
      }, 800);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setVoiceActive(false);
    };

    recognition.onend = () => {
      setVoiceActive(false);
    };

    recognition.start();
  };

  return (
    <Card className="p-0 border border-slate-100 shadow-soft overflow-hidden h-[580px] flex flex-col">
      {/* Top Bar: Persona tabs */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex space-x-2">
          {([
            { id: 'CFO', label: 'AI CFO', icon: Brain, color: 'text-violet-600 bg-violet-50 border-violet-100' },
            { id: 'Auditor', label: 'AI Auditor', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
            { id: 'GST', label: 'AI GST Expert', icon: FileText, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { id: 'Collections', label: 'AI Collections', icon: Coins, color: 'text-rose-600 bg-rose-50 border-rose-100' }
          ] as const).map((persona) => {
            const Icon = persona.icon;
            const isActive = activeChatPersona === persona.id;

            return (
              <button
                key={persona.id}
                onClick={() => setChatPersona(persona.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? `${persona.color} shadow-sm font-extrabold`
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{persona.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-primary mr-1 animate-pulse" />
          <span>Active Persona</span>
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/20">
        {chatHistory[activeChatPersona]?.map((msg, i) => (
          <div
            key={i}
            className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none text-xs font-medium'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none text-xs leading-relaxed font-medium'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Embedded Charts in Chat block */}
              {msg.chartData && msg.chartType === 'bar' && (
                <div className="h-44 w-full bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={msg.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={9} />
                      <YAxis stroke="#94A3B8" fontSize={9} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {msg.chartData && msg.chartType === 'line' && (
                <div className="h-44 w-full bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={msg.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={9} />
                      <YAxis stroke="#94A3B8" fontSize={9} />
                      <Tooltip />
                      <Line type="monotone" dataKey="cash" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Embedded Tables in Chat block */}
              {msg.tableData && msg.tableType === 'issue' && (
                <div className="mt-2 space-y-2">
                  {msg.tableData.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px]">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-700">{item.title || item.type}</span>
                        <span className="text-rose-500">₹{item.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions suggestions in chat */}
              {msg.actions && (
                <div className="flex space-x-2 mt-2 pt-2 border-t border-slate-100 justify-end">
                  {msg.actions.map((act: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (act.actionKey === 'whatsapp_collections') {
                          triggerWhatsAppFlow();
                        }
                      }}
                      className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Streaming Answer Simulation */}
        {isStreaming && (
          <div className="flex w-full justify-start">
            <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white text-slate-800 border border-slate-100 rounded-tl-none text-xs leading-relaxed font-medium">
              <p className="whitespace-pre-line border-r-2 border-primary pr-1 animate-pulse inline-block">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestions Chips Row */}
      <div className="bg-slate-50/50 px-4 py-2 border-t border-slate-100 flex flex-wrap gap-2 shrink-0">
        {suggestions[activeChatPersona].map((sug) => (
          <button
            key={sug}
            onClick={() => handleSuggestionClick(sug)}
            className="bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 px-2.5 py-1.2 rounded-full transition-all shadow-sm shrink-0"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Chat Footer: Input box */}
      <div className="p-3 border-t border-slate-100 bg-white flex items-center space-x-2 shrink-0">
        <button
          onClick={startVoiceInput}
          className={`p-2 rounded-xl border transition-colors ${
            isVoiceActive
              ? 'bg-rose-50 border-rose-200 text-rose-500 animate-pulse'
              : 'hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
          }`}
          title="Click to speak command (Chrome only)"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder={`Ask AI ${activeChatPersona}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs outline-none text-slate-800 font-medium"
        />

        <button
          onClick={handleSend}
          disabled={!inputMessage.trim() || isStreaming}
          className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};

export default PersonaChat;

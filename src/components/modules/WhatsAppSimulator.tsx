import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { MessageSquare, Send, CheckCheck, Landmark, Check } from 'lucide-react';
import Card from '../ui/Card';
import { motion } from 'framer-motion';

export const WhatsAppSimulator: React.FC = () => {
  const { whatsappChat, whatsappStatus, triggerWhatsAppFlow, simulateWhatsAppPayment } = useFinanceStore();

  return (
    <Card className="p-0 border border-slate-100 shadow-soft overflow-hidden h-[540px] flex flex-col">
      {/* WhatsApp Header */}
      <div className="bg-emerald-600 text-white px-5 py-3.5 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm font-heading">
            AA
          </div>
          <div>
            <h4 className="text-xs font-bold font-heading">Apex Automotives (Accounts Team)</h4>
            <div className="text-[10px] text-emerald-100 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse mr-1"></span>
              <span>Online (AlgoForce Collections)</span>
            </div>
          </div>
        </div>

        {/* Sync indicator */}
        <div className="text-[9px] bg-emerald-700/60 px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
          WA Simulator
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#efeae2] p-4 overflow-y-auto space-y-3 relative">
        {whatsappChat.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <MessageSquare className="w-10 h-10 text-slate-400 mb-2" />
            <div className="text-xs font-bold text-slate-700">Simulate WhatsApp Collections</div>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[240px] leading-relaxed">
              Click the button below to trigger an automated AI reminder loop with invoice payment links.
            </p>
            <button
              onClick={triggerWhatsAppFlow}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send WhatsApp Reminder</span>
            </button>
          </div>
        ) : (
          whatsappChat.map((msg, i) => {
            const isUser = msg.sender === 'ai'; // 'ai' behaves as the vendor/user sending reminder
            return (
              <div
                key={i}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs shadow-sm flex flex-col space-y-1 relative ${
                    isUser
                      ? 'bg-[#d9fdd3] text-slate-800 rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium leading-relaxed">{msg.text}</p>
                  
                  {/* Embedded simulated payment link click action */}
                  {msg.showPaymentLink && whatsappStatus === 'reply_sent' && (
                    <div className="mt-2 pt-2 border-t border-emerald-100 flex justify-center">
                      <button
                        onClick={simulateWhatsAppPayment}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition-all animate-bounce"
                      >
                        <Landmark className="w-3.5 h-3.5" />
                        <span>Mock Customer UPI Payment</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-1 self-end mt-1 text-[9px] text-slate-400">
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3 h-3 text-sky-500" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer input Mock */}
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between shrink-0">
        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          Status: {whatsappStatus.toUpperCase().replace('_', ' ')}
        </div>
        
        {whatsappStatus === 'paid' && (
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>Invoice Settled in Tally</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WhatsAppSimulator;

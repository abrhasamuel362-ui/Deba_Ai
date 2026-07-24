import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare, Bot, User, Clock, CheckCheck, RefreshCw } from 'lucide-react';
import { Business, ChatMessage } from '../../types';

interface CustomerChatProps {
  business: Business;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
}

export const CustomerChat: React.FC<CustomerChatProps> = ({
  business,
  messages,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const presetQuestions = [
    'Do you accept walk-ins today?',
    'What are your pricing options and opening hours?',
    'Can I reschedule or cancel my appointment?',
    'Are there any special promotions for first-time clients?'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isSending) return;

    setInput('');
    setIsSending(true);

    try {
      await onSendMessage(text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const bizMessages = messages.filter((m) => m.businessId === business.id);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[600px] max-w-3xl mx-auto transition-colors">
      
      {/* Chat Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shadow-xs">
            {business.logo}
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{business.name}</h3>
              <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-600 dark:text-indigo-400" />
                Virtual Assistant
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Instant AI Auto-Reply Active</span>
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-500 hidden sm:block">
          <div>Tone: <span className="text-indigo-700 font-semibold">{business.aiTone}</span></div>
          <div>Avg Response: <span className="text-emerald-600 font-bold">&lt; 3 seconds</span></div>
        </div>
      </div>

      {/* Preset Questions Bar */}
      <div className="p-2.5 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap px-1">
          Quick Ask:
        </span>
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isSending}
            className="text-[11px] bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors disabled:opacity-50 shadow-2xs font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30 dark:bg-slate-950/40">
        {bizMessages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs space-y-2">
            <Bot className="w-8 h-8 mx-auto text-indigo-500" />
            <p className="text-slate-700 dark:text-slate-300 font-bold">Ask {business.name} anything!</p>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Our 24/7 virtual assistant will answer instantly with prices, availability, and policies.</p>
          </div>
        ) : (
          bizMessages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            const isAI = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 max-w-[85%] ${
                  isCustomer ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                  isCustomer ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700'
                }`}>
                  {isCustomer ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>

                {/* Bubble */}
                <div>
                  <div className={`p-3 rounded-2xl text-xs space-y-1 shadow-xs ${
                    isCustomer
                      ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}>
                    {isAI && (
                      <div className="flex items-center space-x-1 text-[10px] text-indigo-700 dark:text-indigo-300 font-bold mb-1 pb-1 border-b border-slate-100 dark:border-slate-700">
                        <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Deba Assistant</span>
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  </div>
                  
                  <div className={`text-[9px] text-slate-400 dark:text-slate-500 mt-1 flex items-center space-x-1 ${
                    isCustomer ? 'justify-end' : ''
                  }`}>
                    <span>{msg.timestamp}</span>
                    {isCustomer && <CheckCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex items-center space-x-2 text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 w-max animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span>Assistant is generating response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${business.name}...`}
          className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-600"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all disabled:opacity-40 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

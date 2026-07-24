import React, { useState } from 'react';
import { Sparkles, Bot, Clock, ShieldCheck, Check, Save, MessageSquare, Send, RefreshCw, Smartphone } from 'lucide-react';
import { Business } from '../../types';

interface AIAssistantSettingsProps {
  business: Business;
  onUpdateBusiness: (updated: Business) => Promise<void>;
}

export const AIAssistantSettings: React.FC<BusinessDashboardAIAssistantSettingsProps> = ({
  business,
  onUpdateBusiness,
}) => {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(business.autoReplyEnabled);
  const [aiTone, setAiTone] = useState(business.aiTone);
  const [autoConfirmLimit, setAutoConfirmLimit] = useState(business.autoConfirmLimit || 150);
  const [openingHours, setOpeningHours] = useState(business.openingHours);

  const [testQuestion, setTestQuestion] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateBusiness({
      ...business,
      autoReplyEnabled,
      aiTone,
      autoConfirmLimit,
      openingHours,
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestPrompt = async () => {
    if (!testQuestion.trim() || isTesting) return;
    setIsTesting(true);
    setTestResponse('');

    try {
      const res = await fetch('/api/ai/chat-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          customerMessage: testQuestion,
          customerName: 'Test Owner',
        }),
      });
      const data = await res.json();
      setTestResponse(data.reply);
    } catch (err) {
      console.error(err);
      setTestResponse(`Hello! Thanks for reaching out to ${business.name}.`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            AI Virtual Receptionist & Auto-Reply Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure how your AI assistant answers customer questions 24/7, confirms bookings, and sends SMS reminders.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save AI Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-3 rounded-xl text-xs flex items-center space-x-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>AI virtual receptionist settings saved successfully!</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Configuration Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs text-xs transition-colors">
          
          {/* Toggle AI Auto-Reply */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">AI Auto-Reply Virtual Assistant</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Automatically answer customer questions on website & chat</span>
            </div>
            <input
              type="checkbox"
              checked={autoReplyEnabled}
              onChange={(e) => setAutoReplyEnabled(e.target.checked)}
              className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* AI Persona Tone */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200 block">AI Persona Tone of Voice:</label>
            <input
              type="text"
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              placeholder="e.g. Friendly, welcoming, and elegant"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Preset examples: "Academic & Encouraging", "Empathetic & Medical", "Direct & Fast"
            </p>
          </div>

          {/* Auto Confirm Limit */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200 block">Instant Auto-Confirmation Limit ($):</label>
            <input
              type="number"
              value={autoConfirmLimit}
              onChange={(e) => setAutoConfirmLimit(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Bookings under this dollar amount will be instantly marked as Confirmed without requiring manual review.
            </p>
          </div>

          {/* Working Hours */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Public Working Hours:</label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Automated Reminders Notice */}
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center space-x-2.5">
            <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="text-[11px] text-indigo-900 dark:text-indigo-200">
              <span className="font-semibold block text-indigo-950 dark:text-white">Automated SMS / WhatsApp Reminders</span>
              All confirmed clients automatically receive a SMS notification + 24-hour reminder before their visit.
            </div>
          </div>

        </div>

        {/* Right: Interactive AI Assistant Simulator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between transition-colors">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Test Your AI Virtual Receptionist</h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Type a customer query to test how Gemini answers on behalf of <span className="text-slate-900 dark:text-white font-semibold">{business.name}</span> using your current menu & tone.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={testQuestion}
                onChange={(e) => setTestQuestion(e.target.value)}
                placeholder="e.g. Do you have slots for haircut tomorrow?"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
              />

              <button
                type="button"
                onClick={handleTestPrompt}
                disabled={!testQuestion.trim() || isTesting}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'AI Responding...' : 'Run Test Response'}</span>
              </button>
            </div>

            {testResponse && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> Gemini Server Auto-Reply Output:
                </div>
                <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed">"{testResponse}"</p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-2">
            Powered server-side by @google/genai (Gemini 2.5 Flash) with User-Agent AI Studio telemetry.
          </div>
        </div>

      </div>

    </div>
  );
};

// Fix interface type name alias
type BusinessDashboardAIAssistantSettingsProps = AIAssistantSettingsProps;

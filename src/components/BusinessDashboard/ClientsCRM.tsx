import React, { useState } from 'react';
import { Users, Sparkles, Send, Smartphone, CheckCircle, RefreshCw, DollarSign, Calendar, Tag, ShieldCheck, MessageCircle } from 'lucide-react';
import { Business, ClientRecord } from '../../types';

interface ClientsCRMProps {
  business: Business;
  clients: ClientRecord[];
}

export const ClientsCRM: React.FC<ClientsCRMProps> = ({
  business,
  clients,
}) => {
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [customIncentive, setCustomIncentive] = useState('10% off your next booking');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<{ sms: string; whatsapp: string } | null>(null);
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const handleOpenFollowUp = async (client: ClientRecord) => {
    setSelectedClient(client);
    setGeneratedDraft(null);
    setSentStatus(null);
    await generateMessage(client, '10% off your next booking');
  };

  const generateMessage = async (client: ClientRecord, incentive: string) => {
    setIsGenerating(true);
    setSentStatus(null);
    try {
      const res = await fetch('/api/ai/generate-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          clientName: client.name,
          preferredService: client.preferredService,
          lastVisitDate: client.lastVisitDate,
          totalVisits: client.totalVisits,
          customIncentive: incentive,
        }),
      });
      const data = await res.json();
      setGeneratedDraft({
        sms: data.sms || `Hi ${client.name}, we miss seeing you at ${business.name}! Book your next ${client.preferredService} today & enjoy ${incentive}: autobook.app/${business.id}`,
        whatsapp: data.whatsapp || `Hey ${client.name}! 👋 Time for your next ${client.preferredService} at ${business.name}. Use code COMEBACK for ${incentive}! ✨`,
      });
    } catch (err) {
      console.error(err);
      setGeneratedDraft({
        sms: `Hi ${client.name}, we miss seeing you at ${business.name}! Book your next ${client.preferredService} today & enjoy ${incentive}: autobook.app/${business.id}`,
        whatsapp: `Hey ${client.name}! 👋 Time for your next ${client.preferredService} at ${business.name}. Use code COMEBACK for ${incentive}! ✨`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulateSend = (channel: 'SMS' | 'WhatsApp') => {
    setSentStatus(`Successfully dispatched personalized ${channel} message to ${selectedClient?.phone}!`);
    setTimeout(() => {
      setSentStatus(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* CRM Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Client Directory & Automated Follow-Up CRM
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track repeat customer frequency and generate personalized AI re-engagement texts in 1-click.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-3.5 py-2 rounded-xl text-indigo-700 dark:text-indigo-300 font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Gemini AI Personalization Active</span>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Client Name</th>
                <th className="px-4 py-3">Preferred Service</th>
                <th className="px-4 py-3">Visits / Spent</th>
                <th className="px-4 py-3">Last Visit</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3 text-right">AI Follow-Up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {clients.map((cli) => (
                <tr key={cli.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                    <div>{cli.name}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{cli.phone}</div>
                  </td>
                  <td className="px-4 py-3.5 text-indigo-600 dark:text-indigo-400 font-semibold">{cli.preferredService}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{cli.totalVisits} visits</span>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">${cli.totalSpent} total</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{cli.lastVisitDate}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {cli.tags.map((tg, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-medium"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleOpenFollowUp(cli)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                      <span>Draft AI Text</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Follow-Up Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 text-slate-900 dark:text-slate-100 space-y-5 shadow-2xl relative my-auto transition-colors">
            
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Re-Engagement Assistant
                </span>
                <h3 className="text-lg font-bold text-slate-900">Draft Follow-Up for {selectedClient.name}</h3>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Custom Incentive Controls */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Offer / Special Incentive:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customIncentive}
                  onChange={(e) => setCustomIncentive(e.target.value)}
                  placeholder="e.g. 10% off your next booking"
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => generateMessage(selectedClient, customIncentive)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center space-x-1 transition-colors disabled:opacity-50 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Sent Notification Banner */}
            {sentStatus && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{sentStatus}</span>
              </div>
            )}

            {/* Output Drafts & Phone Mockup */}
            {isGenerating ? (
              <div className="text-center py-10 space-y-2">
                <RefreshCw className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
                <p className="text-xs text-indigo-700 font-semibold">Gemini AI is crafting personalized message drafts...</p>
              </div>
            ) : generatedDraft ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* SMS Channel Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
                      <span className="flex items-center">
                        <Smartphone className="w-3.5 h-3.5 mr-1 text-indigo-600" /> SMS Draft
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {generatedDraft.sms.length} chars
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-lg text-xs text-slate-800 border border-slate-200 leading-relaxed font-sans shadow-xs">
                      {generatedDraft.sms}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulateSend('SMS')}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send SMS Text Now</span>
                  </button>
                </div>

                {/* WhatsApp Channel Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                      <span className="flex items-center">
                        <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> WhatsApp Draft
                      </span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                        Rich Emojis
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-lg text-xs text-slate-800 border border-slate-200 leading-relaxed font-sans shadow-xs">
                      {generatedDraft.whatsapp}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulateSend('WhatsApp')}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Now</span>
                  </button>
                </div>

              </div>
            ) : null}

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

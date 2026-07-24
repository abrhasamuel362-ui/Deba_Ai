import React from 'react';
import { DollarSign, Calendar, Users, Sparkles, TrendingUp, ShieldCheck, ArrowUpRight, Zap, Smartphone, CheckCircle2 } from 'lucide-react';
import { Business, Booking, ClientRecord } from '../../types';

interface BusinessOverviewProps {
  business: Business;
  bookings: Booking[];
  clients: ClientRecord[];
  onNavigateTab: (tab: string) => void;
}

export const BusinessOverview: React.FC<BusinessOverviewProps> = ({
  business,
  bookings,
  clients,
  onNavigateTab,
}) => {
  const bizBookings = bookings.filter((b) => b.businessId === business.id);
  const grossRevenue = bizBookings.reduce((acc, b) => acc + (b.status !== 'cancelled' ? b.servicePrice : 0), 0);
  const platformFees = bizBookings.reduce((acc, b) => acc + (b.status !== 'cancelled' ? b.platformFee : 0), 0);
  const netEarnings = grossRevenue - platformFees;

  const repeatClientsCount = clients.filter((c) => c.totalVisits > 1).length;
  const retentionRate = clients.length > 0 ? Math.round((repeatClientsCount / clients.length) * 100) : 85;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Welcome */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{business.logo}</span>
            <h2 className="text-2xl font-extrabold text-white">{business.name}</h2>
            <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
              {business.subscriptionTier} Plan
            </span>
          </div>
          <p className="text-xs text-slate-300">
            AI Receptionist is active • Automated 24h SMS/WhatsApp reminders enabled • Category: <span className="text-indigo-300 font-semibold">{business.categoryLabel}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('crm')}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Send AI Follow-Up Texts</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Gross Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">${grossRevenue.toFixed(2)}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Total Appointments</span>
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{bizBookings.length}</div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            <span>100% automated confirm</span>
          </div>
        </div>

        {/* Client Retention Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Client Retention</span>
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{retentionRate}%</div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 flex items-center font-medium">
            <Sparkles className="w-3 h-3 mr-1" />
            <span>Boosted by AI re-engagement</span>
          </div>
        </div>

        {/* Net Business Profit */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Net Revenue (After Fee)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">${netEarnings.toFixed(2)}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Platform booking fee (2.5%): ${platformFees.toFixed(2)}
          </div>
        </div>

      </div>

      {/* Monetization & Side-Income Engine Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Platform Revenue Structure</h3>
          </div>
          <button
            onClick={() => onNavigateTab('monetization')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold flex items-center"
          >
            <span>Manage Subscription & Fee Tier</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">Income Stream #1</span>
            <div className="font-bold text-indigo-700 dark:text-indigo-300 text-sm">Monthly Subscription</div>
            <p className="text-slate-600 dark:text-slate-300">
              Businesses pay <span className="text-slate-900 dark:text-white font-semibold">$29 - $79/mo</span> for auto-replies, SMS reminders, and calendar management.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">Income Stream #2</span>
            <div className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">Booking Commission Fee</div>
            <p className="text-slate-600 dark:text-slate-300">
              Deba takes a <span className="text-slate-900 dark:text-white font-semibold">2.5% fee</span> per booking (${platformFees.toFixed(2)} collected from this business).
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">Income Stream #3</span>
            <div className="font-bold text-purple-700 dark:text-purple-300 text-sm">Featured Spotlights</div>
            <p className="text-slate-600 dark:text-slate-300">
              Local shops pay <span className="text-slate-900 dark:text-white font-semibold">$15/week</span> to be featured at the top of category searches.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div
          onClick={() => onNavigateTab('calendar')}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 p-4 rounded-2xl cursor-pointer transition-all space-y-2 group shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Interactive Calendar</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage appointment slots, view client notes, and add walk-in bookings.</p>
        </div>

        <div
          onClick={() => onNavigateTab('crm')}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-purple-300 p-4 rounded-2xl cursor-pointer transition-all space-y-2 group shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Smartphone className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Client Re-Engagement</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate personalized 1-click SMS & WhatsApp messages to bring back repeat clients.</p>
        </div>

        <div
          onClick={() => onNavigateTab('ai-advisor')}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 p-4 rounded-2xl cursor-pointer transition-all space-y-2 group shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Growth Strategy Advisor</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Get insights on off-peak pricing, service bundles, and yield optimization.</p>
        </div>

      </div>

    </div>
  );
};

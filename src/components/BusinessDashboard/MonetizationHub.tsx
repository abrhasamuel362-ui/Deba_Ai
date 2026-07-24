import React, { useState } from 'react';
import { DollarSign, Check, Zap, Sparkles, TrendingUp, ShieldCheck, Star, Calculator, ArrowRight } from 'lucide-react';
import { Business } from '../../types';

interface MonetizationHubProps {
  business: Business;
  onUpdateBusiness: (updated: Business) => Promise<void>;
}

export const MonetizationHub: React.FC<MonetizationHubProps> = ({
  business,
  onUpdateBusiness,
}) => {
  const [tier, setTier] = useState<'starter' | 'pro' | 'scale'>(business.subscriptionTier || 'pro');
  const [isFeatured, setIsFeatured] = useState(business.isFeatured || false);

  // Side-Income SaaS Calculator state
  const [numBusinesses, setNumBusinesses] = useState(35);
  const [avgBookingsPerBiz, setAvgBookingsPerBiz] = useState(60);
  const [avgTicketPrice, setAvgTicketPrice] = useState(75);

  // Calculations for SaaS Platform Owner Side Income
  const subRevenue = numBusinesses * 39; // Avg $39/mo per shop
  const bookingVolume = numBusinesses * avgBookingsPerBiz * avgTicketPrice;
  const platformFeeRevenue = bookingVolume * 0.025; // 2.5% fee
  const totalMonthlySideIncome = subRevenue + platformFeeRevenue;
  const annualSideIncome = totalMonthlySideIncome * 12;

  const handleSelectTier = async (selectedTier: 'starter' | 'pro' | 'scale') => {
    setTier(selectedTier);
    await onUpdateBusiness({
      ...business,
      subscriptionTier: selectedTier,
    });
  };

  const handleToggleFeatured = async () => {
    const nextVal = !isFeatured;
    setIsFeatured(nextVal);
    await onUpdateBusiness({
      ...business,
      isFeatured: nextVal,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Monetization & Side Income Architecture</h2>
          </div>
          <p className="text-xs text-slate-300">
            Current Tier for <span className="font-semibold text-indigo-300">{business.name}</span>: <span className="uppercase text-emerald-400 font-extrabold">{tier}</span>
          </p>
        </div>

        <button
          onClick={handleToggleFeatured}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isFeatured
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />
          <span>{isFeatured ? '★ Featured Spotlight Active' : 'Upgrade to Featured Spotlight ($15/wk)'}</span>
        </button>
      </div>

      {/* Subscription Pricing Tiers Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Starter Tier */}
        <div className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between transition-all ${
          tier === 'starter' ? 'border-indigo-600 ring-2 ring-indigo-600/30 bg-indigo-50/20 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-800'
        }`}>
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Starter Plan</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <div className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">+ 3.5% fee per booking</div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> Basic Online Booking Page</li>
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> Manual Appointments Calendar</li>
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> Standard Customer Email Receipts</li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectTier('starter')}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
              tier === 'starter'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-default border border-slate-200 dark:border-slate-700'
                : 'bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900'
            }`}
          >
            {tier === 'starter' ? 'Current Plan' : 'Select Starter'}
          </button>
        </div>

        {/* Pro Tier (Recommended) */}
        <div className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between relative transition-all ${
          tier === 'pro' ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800'
        }`}>
          <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-xs">
            MOST POPULAR
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Pro Business Plan</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$29</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">+ 2.0% fee per booking</div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> Everything in Starter</li>
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> 24/7 AI Auto-Reply Assistant</li>
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> Automated 24h SMS/WhatsApp Reminders</li>
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> 1-Click AI Client CRM Follow-Ups</li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectTier('pro')}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              tier === 'pro'
                ? 'bg-indigo-600 text-white cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {tier === 'pro' ? 'Current Plan' : 'Upgrade to Pro ($29/mo)'}
          </button>
        </div>

        {/* Scale Tier */}
        <div className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between transition-all ${
          tier === 'scale' ? 'border-purple-600 ring-2 ring-purple-600/30 bg-purple-50/30 dark:bg-purple-950/40' : 'border-slate-200 dark:border-slate-800'
        }`}>
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">Scale Enterprise</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$79</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold">+ 1.0% fee per booking</div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> Everything in Pro</li>
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> Top Featured Category Badge</li>
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> AI Revenue Strategy Growth Advisor</li>
              <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" /> Multi-Staff & Multi-Location Sync</li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectTier('scale')}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
              tier === 'scale'
                ? 'bg-purple-600 text-white cursor-default'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {tier === 'scale' ? 'Current Plan' : 'Upgrade to Scale ($79/mo)'}
          </button>
        </div>

      </div>

      {/* Interactive SaaS Side Income Calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 transition-colors">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">SaaS Founder Side-Income Calculator</h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          Simulate potential passive side income from launching Deba in your local town or region:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="text-slate-600 dark:text-slate-300 block font-medium">Shops Onboarded:</label>
            <input
              type="number"
              value={numBusinesses}
              onChange={(e) => setNumBusinesses(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="text-slate-600 dark:text-slate-300 block font-medium">Avg Monthly Bookings/Shop:</label>
            <input
              type="number"
              value={avgBookingsPerBiz}
              onChange={(e) => setAvgBookingsPerBiz(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="text-slate-600 dark:text-slate-300 block font-medium">Avg Ticket Price ($):</label>
            <input
              type="number"
              value={avgTicketPrice}
              onChange={(e) => setAvgTicketPrice(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-bold"
            />
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold uppercase tracking-wider">Estimated Founder Monthly Revenue</div>
            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
              ${totalMonthlySideIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Subscriptions: ${subRevenue.toLocaleString()} • Booking Fees (2.5%): ${platformFeeRevenue.toLocaleString()}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Annual Run Rate (ARR)</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              ${annualSideIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / yr
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

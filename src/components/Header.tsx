import React, { useState } from 'react';
import { Sparkles, Calendar, User, Building2, Bell, Zap, ChevronDown, CheckCircle, MessageSquare, DollarSign, Smartphone, Settings, Sun, Moon } from 'lucide-react';
import { Business, Booking } from '../types';

interface HeaderProps {
  mode: 'customer' | 'business';
  setMode: (m: 'customer' | 'business') => void;
  selectedBusiness: Business;
  setSelectedBusiness: (b: Business) => void;
  businesses: Business[];
  bookings: Booking[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  selectedBusiness,
  setSelectedBusiness,
  businesses,
  bookings,
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onOpenSettings,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBizDropdown, setShowBizDropdown] = useState(false);

  const pendingBookings = bookings.filter(b => b.businessId === selectedBusiness.id && b.status === 'pending');

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setMode('customer')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-100 dark:shadow-none">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  Deba
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-600 dark:text-indigo-400" />
                  Live Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Local Booking & Service Management
              </p>
            </div>
          </div>

          {/* Mode Switcher Pills */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setMode('customer');
                setActiveTab('explore');
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'customer'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </button>

            <button
              onClick={() => {
                setMode('business');
                setActiveTab('overview');
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'business'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Business Owner Portal</span>
              {pendingBookings.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Business Selector Dropdown (When in Business Owner Portal) */}
            {mode === 'business' && (
              <div className="relative">
                <button
                  onClick={() => setShowBizDropdown(!showBizDropdown)}
                  className="flex items-center space-x-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
                >
                  <span className="text-base">{selectedBusiness.logo}</span>
                  <span className="font-semibold max-w-[100px] sm:max-w-[150px] truncate text-slate-900 dark:text-white">
                    {selectedBusiness.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showBizDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1 divide-y divide-slate-100 dark:divide-slate-700">
                    <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Switch Business Account
                    </div>
                    <div className="py-1">
                      {businesses.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            setSelectedBusiness(b);
                            setShowBizDropdown(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                            b.id === selectedBusiness.id ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <span className="text-base">{b.logo}</span>
                          <div className="truncate">
                            <div className="truncate font-semibold">{b.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{b.categoryLabel}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Theme Toggle Button (Light/Dark) */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              id="header-theme-toggle"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>

            {/* Settings Icon Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Deba App Settings & Options"
              id="header-settings-btn"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Activity Log & Notifications"
              >
                <Bell className="w-5 h-5" />
                {pendingBookings.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-3 text-xs text-slate-800 dark:text-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center">
                      <Bell className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" /> Live Activity Log
                    </span>
                    <span className="text-[10px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 font-bold">
                      Deba Activity
                    </span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Auto-Confirmed Booking</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">Sarah Jenkins booked Signature Haircut for $75. Fee collected.</div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center">
                          <Smartphone className="w-3 h-3 mr-1" /> SMS & WhatsApp reminder queued
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Virtual Receptionist Response</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">Answered customer question regarding Friday afternoon availability.</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex items-start space-x-2">
                      <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Subscription Status</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">Monthly Pro plan ($29.00) active for {selectedBusiness.name}.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};


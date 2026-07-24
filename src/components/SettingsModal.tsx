import React from 'react';
import { Settings, Sun, Moon, Check, X, Shield, Bell, Globe, User, Mail, Smartphone, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-900 dark:text-slate-100 space-y-6 shadow-2xl relative my-auto transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Deba App Settings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage appearance, theme, and system preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            id="settings-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Settings Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Appearance & Theme Mode
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center space-x-2.5 p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
              id="theme-light-btn"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
              {theme === 'light' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-auto" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center space-x-2.5 p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
              id="theme-dark-btn"
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Mode</span>
              {theme === 'dark' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-auto" />}
            </button>
          </div>
        </div>

        {/* General App Management Controls */}
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            System Preferences
          </label>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-slate-100">SMS & WhatsApp Reminders</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Send 24h client visit confirmations</span>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4 rounded" />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-slate-100">Auto-Confirm Bookings</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Instantly confirm valid appointment slots</span>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4 rounded" />
            </div>
          </div>
        </div>

        {/* Developer & App Info Footer Card */}
        <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold text-indigo-950 dark:text-indigo-200">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Developer Information</span>
          </div>

          <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>Developer: <strong className="text-slate-900 dark:text-white font-semibold">Samuel Abrha</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              <span>Contact: <a href="mailto:abrhasamuel362@gmail.com" className="text-indigo-600 dark:text-indigo-400 underline font-medium">abrhasamuel362@gmail.com</a></span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 pt-1">
              <span>© {new Date().getFullYear()} Deba. All rights reserved.</span>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            Save & Done
          </button>
        </div>

      </div>
    </div>
  );
};

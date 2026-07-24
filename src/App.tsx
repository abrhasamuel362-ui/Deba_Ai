import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CustomerPortal/CategoryFilter';
import { BusinessCard } from './components/CustomerPortal/BusinessCard';
import { BusinessDetailModal } from './components/CustomerPortal/BusinessDetailModal';
import { MyBookingsView } from './components/CustomerPortal/MyBookingsView';
import { CustomerChat } from './components/CustomerPortal/CustomerChat';
import { SettingsModal } from './components/SettingsModal';

import { BusinessOverview } from './components/BusinessDashboard/BusinessOverview';
import { CalendarView } from './components/BusinessDashboard/CalendarView';
import { ClientsCRM } from './components/BusinessDashboard/ClientsCRM';
import { ServicesManager } from './components/BusinessDashboard/ServicesManager';
import { AIAssistantSettings } from './components/BusinessDashboard/AIAssistantSettings';
import { MonetizationHub } from './components/BusinessDashboard/MonetizationHub';
import { AIAdvisorPanel } from './components/BusinessDashboard/AIAdvisorPanel';

import { Business, Booking, ClientRecord, Review, ChatMessage, BookingStatus } from './types';
import { INITIAL_BUSINESSES, INITIAL_BOOKINGS, INITIAL_CLIENTS, INITIAL_REVIEWS, INITIAL_MESSAGES } from './data/mockData';
import { Sparkles, Calendar, MessageSquare, Search, Zap, Building2, User, LayoutDashboard, Settings, DollarSign, Users, Grid, Mail } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'customer' | 'business'>('customer');
  const [activeTab, setActiveTab] = useState<string>('explore');

  // Theme & Settings State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('deba_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('deba_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark', 'bg-slate-950', 'text-slate-100');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
      document.body.classList.remove('dark', 'bg-slate-950', 'text-slate-100');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // App Data
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [selectedBusiness, setSelectedBusiness] = useState<Business>(INITIAL_BUSINESSES[0]);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [clients, setClients] = useState<ClientRecord[]>(INITIAL_CLIENTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  // Customer Filters & Modals
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailBiz, setDetailBiz] = useState<Business | null>(null);
  const [chatBiz, setChatBiz] = useState<Business | null>(null);

  // Load initial backend data
  const fetchData = async () => {
    try {
      const [resBiz, resBks, resCli, resRev, resMsg] = await Promise.all([
        fetch('/api/businesses').then((r) => r.json()).catch(() => INITIAL_BUSINESSES),
        fetch('/api/bookings').then((r) => r.json()).catch(() => INITIAL_BOOKINGS),
        fetch('/api/clients').then((r) => r.json()).catch(() => INITIAL_CLIENTS),
        fetch('/api/reviews').then((r) => r.json()).catch(() => INITIAL_REVIEWS),
        fetch('/api/messages').then((r) => r.json()).catch(() => INITIAL_MESSAGES),
      ]);

      if (Array.isArray(resBiz) && resBiz.length > 0) setBusinesses(resBiz);
      if (Array.isArray(resBks)) setBookings(resBks);
      if (Array.isArray(resCli)) setClients(resCli);
      if (Array.isArray(resRev)) setReviews(resRev);
      if (Array.isArray(resMsg)) setMessages(resMsg);
    } catch (err) {
      console.error('Data fetch error, using client state:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleConfirmBooking = async (bookingData: any) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        const newBooking = await res.json();
        setBookings((prev) => [newBooking, ...prev]);
        // Refresh clients list as well
        fetch('/api/clients').then((r) => r.json()).then((cli) => Array.isArray(cli) && setClients(cli));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (text: string) => {
    const targetBiz = chatBiz || selectedBusiness;
    const custMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      businessId: targetBiz.id,
      sender: 'customer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: 'Sarah Jenkins',
    };

    setMessages((prev) => [...prev, custMsg]);

    // Save customer message to server
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(custMsg),
    });

    // Request Gemini AI auto-reply server-side
    try {
      const res = await fetch('/api/ai/chat-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: targetBiz.id,
          customerMessage: text,
          customerName: 'Sarah Jenkins',
        }),
      });

      const data = await res.json();
      const aiReplyText = data.reply || `Thanks for contacting ${targetBiz.name}! We will confirm shortly.`;

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        businessId: targetBiz.id,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customerName: 'Samuel_AI AI Assistant',
      };

      setMessages((prev) => [...prev, aiMsg]);

      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiMsg),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  };

  const handleSendReminder = async (id: string, channel: 'sms' | 'whatsapp') => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return channel === 'sms'
            ? { ...b, reminderSentSms: true }
            : { ...b, reminderSentWhatsapp: true };
        }
        return b;
      })
    );

    fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        channel === 'sms' ? { reminderSentSms: true } : { reminderSentWhatsapp: true }
      ),
    });
  };

  const handleAddWalkInBooking = async (data: any) => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newB = await res.json();
      setBookings((prev) => [newB, ...prev]);
    }
  };

  const handleUpdateBusiness = async (updated: Business) => {
    setSelectedBusiness(updated);
    setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    fetch(`/api/businesses/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    handleUpdateBookingStatus(bookingId, 'cancelled');
  };

  // Filtered Businesses list for Customer View
  const filteredBusinesses = businesses.filter((b) => {
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesQuery =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.services.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white flex flex-col justify-between transition-colors">
      <div>
        
        {/* Navigation Bar */}
        <Header
          mode={mode}
          setMode={setMode}
          selectedBusiness={selectedBusiness}
          setSelectedBusiness={setSelectedBusiness}
          businesses={businesses}
          bookings={bookings}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          setTheme={setTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Secondary Tab Sub-Header */}
        <div className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-16 z-30 shadow-xs transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 overflow-x-auto py-2 scrollbar-none text-xs">
              
              {/* Customer Mode Tabs */}
              {mode === 'customer' ? (
                <>
                  <button
                    onClick={() => setActiveTab('explore')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'explore'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Explore Local Shops</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('my-bookings')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'my-bookings'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>My Bookings & Receipts ({bookings.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      setChatBiz(selectedBusiness);
                    }}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'chat'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Virtual Assistant Chat</span>
                  </button>
                </>
              ) : (
                /* Business Owner Mode Tabs */
                <>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'overview'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Earnings & Overview</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('calendar')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'calendar'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Appointments Schedule</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('crm')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'crm'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Client CRM</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('services')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'services'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Service Catalog</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ai-settings')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'ai-settings'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Virtual Receptionist</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('monetization')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'monetization'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Revenue Hub</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ai-advisor')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'ai-advisor'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Growth Strategy Advisor</span>
                  </button>
                </>
              )}

            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* CUSTOMER MODE */}
          {mode === 'customer' && (
            <>
              {activeTab === 'explore' && (
                <div className="space-y-6">
                  
                  {/* Hero Bar & Search Input */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors">
                    <div className="relative z-10 space-y-3 max-w-2xl">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        <Zap className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
                        Local Booking & Service Platform
                      </span>
                      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                        Book Salons, Tutors, Tech Repairs & Clinics in Seconds.
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        Get automatic SMS reminders, instant virtual receptionist answers, and transparent receipts.
                      </p>

                      {/* Search Input Bar */}
                      <div className="pt-2">
                        <div className="relative max-w-lg">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search haircut, SAT tutor, screen repair, chiropractic..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Filter Chips */}
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />

                  {/* Businesses Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBusinesses.map((b) => (
                      <BusinessCard
                        key={b.id}
                        business={b}
                        onOpenBooking={(biz) => setDetailBiz(biz)}
                        onOpenChat={(biz) => {
                          setChatBiz(biz);
                          setActiveTab('chat');
                        }}
                      />
                    ))}
                  </div>

                </div>
              )}

              {activeTab === 'my-bookings' && (
                <MyBookingsView
                  bookings={bookings}
                  onCancelBooking={handleCancelBooking}
                />
              )}

              {activeTab === 'chat' && (
                <CustomerChat
                  business={chatBiz || selectedBusiness}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                />
              )}
            </>
          )}

          {/* BUSINESS OWNER PORTAL MODE */}
          {mode === 'business' && (
            <>
              {activeTab === 'overview' && (
                <BusinessOverview
                  business={selectedBusiness}
                  bookings={bookings}
                  clients={clients}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarView
                  business={selectedBusiness}
                  bookings={bookings}
                  onUpdateStatus={handleUpdateBookingStatus}
                  onSendReminder={handleSendReminder}
                  onAddBooking={handleAddWalkInBooking}
                />
              )}

              {activeTab === 'crm' && (
                <ClientsCRM
                  business={selectedBusiness}
                  clients={clients}
                />
              )}

              {activeTab === 'services' && (
                <ServicesManager
                  business={selectedBusiness}
                  onUpdateBusiness={handleUpdateBusiness}
                />
              )}

              {activeTab === 'ai-settings' && (
                <AIAssistantSettings
                  business={selectedBusiness}
                  onUpdateBusiness={handleUpdateBusiness}
                />
              )}

              {activeTab === 'monetization' && (
                <MonetizationHub
                  business={selectedBusiness}
                  onUpdateBusiness={handleUpdateBusiness}
                />
              )}

              {activeTab === 'ai-advisor' && (
                <AIAdvisorPanel
                  business={selectedBusiness}
                />
              )}
            </>
          )}

        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Customer Booking Modal */}
      {detailBiz && (
        <BusinessDetailModal
          business={detailBiz}
          reviews={reviews}
          onClose={() => setDetailBiz(null)}
          onConfirmBooking={handleConfirmBooking}
          onOpenChat={(biz) => {
            setDetailBiz(null);
            setChatBiz(biz);
            setActiveTab('chat');
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-600 dark:text-slate-400 transition-colors mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            {/* Column 1: App Info & Description */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">Deba</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Deba is a local booking, scheduling, and client management platform designed for service businesses like salons, repair shops, tutors, and wellness centers.
              </p>
            </div>

            {/* Column 2: Developer Details */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Developer</h4>
              <div className="space-y-1 text-slate-600 dark:text-slate-300">
                <p className="font-medium text-slate-900 dark:text-white">Developed by Samuel Abrha</p>
                <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <a href="mailto:abrhasamuel362@gmail.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    abrhasamuel362@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Platform Features */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Platform Specs</h4>
              <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                <li>• Automated SMS & WhatsApp Reminders</li>
                <li>• Real-Time Appointment Scheduling</li>
                <li>• Integrated Client CRM & Receipts</li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 dark:text-slate-400 text-xs">
            <div>
              © {new Date().getFullYear()} Deba. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <span>Developed by Samuel Abrha</span>
              <span>•</span>
              <a href="mailto:abrhasamuel362@gmail.com" className="hover:underline">abrhasamuel362@gmail.com</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

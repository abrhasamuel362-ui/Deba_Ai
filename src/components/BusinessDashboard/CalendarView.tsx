import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle, XCircle, Plus, Smartphone, Filter, AlertCircle, FileText } from 'lucide-react';
import { Business, Booking, BookingStatus } from '../../types';

interface CalendarViewProps {
  business: Business;
  bookings: Booking[];
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onSendReminder: (id: string, channel: 'sms' | 'whatsapp') => void;
  onAddBooking: (data: any) => Promise<void>;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  business,
  bookings,
  onUpdateStatus,
  onSendReminder,
  onAddBooking,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Walk-in form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState(business.services[0]?.id || '');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [timeStr, setTimeStr] = useState('11:00 AM');

  const bizBookings = bookings.filter((b) => b.businessId === business.id);
  const filteredBookings = filterStatus === 'all'
    ? bizBookings
    : bizBookings.filter((b) => b.status === filterStatus);

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    const srv = business.services.find((s) => s.id === serviceId) || business.services[0];

    await onAddBooking({
      businessId: business.id,
      serviceId: srv.id,
      serviceName: srv.name,
      servicePrice: srv.price,
      staffId: business.staff[0]?.id,
      staffName: business.staff[0]?.name,
      customerName: clientName,
      customerEmail: `${clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      customerPhone: clientPhone,
      date: dateStr,
      time: timeStr,
      notes: 'Walk-In / Direct Phone Booking',
    });

    setShowAddModal(false);
    setClientName('');
    setClientPhone('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Appointments Calendar & Schedule
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">View upcoming slots, update statuses, and send instant SMS/WhatsApp reminders.</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            {['all', 'confirmed', 'pending', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-In</span>
          </button>
        </div>
      </div>

      {/* Bookings List / Schedule View */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <CalendarIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No appointments found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try switching status filters or add a new walk-in booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredBookings.map((bk) => {
            const isConfirmed = bk.status === 'confirmed';
            const isPending = bk.status === 'pending';
            const isCompleted = bk.status === 'completed';

            return (
              <div
                key={bk.id}
                onClick={() => setSelectedBooking(bk)}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 rounded-2xl p-4 transition-all cursor-pointer shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                    {bk.time.split(':')[0]}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{bk.customerName}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        isConfirmed ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                        isPending ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                        isCompleted ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                        'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      }`}>
                        {bk.status}
                      </span>
                    </div>

                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center space-x-2">
                      <span>{bk.serviceName}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-slate-900 dark:text-slate-100">${bk.servicePrice}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-3">
                      <span>📅 {bk.date}</span>
                      <span>⏰ {bk.time}</span>
                      <span>📞 {bk.customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Status Controls */}
                <div className="flex items-center space-x-2 justify-end" onClick={(e) => e.stopPropagation()}>
                  {isPending && (
                    <button
                      onClick={() => onUpdateStatus(bk.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                    >
                      Confirm
                    </button>
                  )}

                  {isConfirmed && (
                    <button
                      onClick={() => onUpdateStatus(bk.id, 'completed')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedBooking(bk)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors"
                  >
                    Details & Reminder
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Detail & Instant Reminder Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-900 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600">Appointment Details</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedBooking.customerName}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-900">{selectedBooking.serviceName} (${selectedBooking.servicePrice})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold text-slate-900">{selectedBooking.date} at {selectedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-900">{selectedBooking.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-900">{selectedBooking.customerEmail}</span>
              </div>
            </div>

            {/* Instant SMS/WhatsApp Dispatch Simulation */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center">
                <Smartphone className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Trigger Automated Follow-Up / Reminder Text
              </h4>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onSendReminder(selectedBooking.id, 'sms');
                    setSelectedBooking({ ...selectedBooking, reminderSentSms: true });
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                    selectedBooking.reminderSentSms
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{selectedBooking.reminderSentSms ? 'SMS Sent ✓' : 'Send SMS Reminder'}</span>
                </button>

                <button
                  onClick={() => {
                    onSendReminder(selectedBooking.id, 'whatsapp');
                    setSelectedBooking({ ...selectedBooking, reminderSentWhatsapp: true });
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                    selectedBooking.reminderSentWhatsapp
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{selectedBooking.reminderSentWhatsapp ? 'WhatsApp Sent ✓' : 'Send WhatsApp'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-semibold text-xs transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Add Walk-in Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateWalkIn}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-900 space-y-4 shadow-2xl relative"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Walk-In / Phone Booking</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Customer Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Michael Scott"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+1 (555) 000-1111"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Service</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {business.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (${s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Time</label>
                  <input
                    type="text"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              Confirm Walk-In Booking
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

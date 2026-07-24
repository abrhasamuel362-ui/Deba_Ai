import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, FileText, Smartphone, XCircle, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import { Booking } from '../../types';

interface MyBookingsViewProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onCancelBooking,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<Booking | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Appointments & Reminders</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Track upcoming visits, automated SMS alerts, and digital receipts.</p>
        </div>
        <span className="text-xs bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold px-3 py-1 rounded-full">
          {bookings.length} Total Bookings
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Bookings Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Browse nearby salons, tutors, repair shops, and clinics to make your first booking!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((bk) => {
            const isConfirmed = bk.status === 'confirmed';
            const isCompleted = bk.status === 'completed';
            const isCancelled = bk.status === 'cancelled';

            return (
              <div
                key={bk.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">{bk.businessName}</span>
                    
                    {/* Status Badge */}
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      isConfirmed ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                      isCompleted ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                      isCancelled ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' :
                      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}>
                      {bk.status}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
                    <span>{bk.serviceName}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-900 dark:text-slate-100">${bk.servicePrice}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-slate-800 font-medium">{bk.date}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-slate-800 font-medium">{bk.time}</span>
                    </div>
                    {bk.staffName && (
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-500">With:</span>
                        <span className="text-slate-800 font-medium">{bk.staffName}</span>
                      </div>
                    )}
                  </div>

                  {/* Automated Reminder Status Pill */}
                  <div className="flex items-center space-x-3 text-[11px] pt-1">
                    <span className={`flex items-center space-x-1 px-2 py-0.5 rounded-md ${
                      bk.reminderSentSms ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <Smartphone className="w-3 h-3" />
                      <span>{bk.reminderSentSms ? 'SMS Sent' : 'SMS Queued (24h before)'}</span>
                    </span>

                    <span className={`flex items-center space-x-1 px-2 py-0.5 rounded-md ${
                      bk.reminderSentWhatsapp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{bk.reminderSentWhatsapp ? 'WhatsApp Sent' : 'WhatsApp Ready'}</span>
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 justify-end">
                  <button
                    onClick={() => setSelectedReceipt(bk)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Receipt</span>
                  </button>

                  {!isCancelled && !isCompleted && (
                    <button
                      onClick={() => onCancelBooking(bk.id)}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-900 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">Official Digital Receipt</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedReceipt.businessName}</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt ID:</span>
                <span className="font-mono text-slate-800">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="text-slate-800 font-medium">{selectedReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Appointment:</span>
                <span className="text-slate-800 font-medium">{selectedReceipt.date} at {selectedReceipt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="text-slate-800 font-medium">{selectedReceipt.serviceName}</span>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal:</span>
                  <span>${selectedReceipt.servicePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Platform Processing Fee:</span>
                  <span>${selectedReceipt.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-emerald-600 border-t border-slate-200 pt-2">
                  <span>Total Paid:</span>
                  <span>${(selectedReceipt.servicePrice + selectedReceipt.platformFee).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600 text-center border border-slate-200">
              Payment processed securely via AutoBook Pay Gateway.
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

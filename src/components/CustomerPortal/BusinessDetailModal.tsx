import React, { useState } from 'react';
import { X, Star, Calendar, Clock, User, Check, ShieldCheck, Sparkles, CreditCard, Smartphone, DollarSign, MessageSquare, AlertCircle } from 'lucide-react';
import { Business, Service, StaffMember, Review } from '../../types';

interface BusinessDetailModalProps {
  business: Business;
  reviews: Review[];
  onClose: () => void;
  onConfirmBooking: (bookingData: any) => Promise<void>;
  onOpenChat: (b: Business) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  reviews,
  onClose,
  onConfirmBooking,
  onOpenChat,
}) => {
  const [selectedService, setSelectedService] = useState<Service>(business.services[0]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(business.staff[0]);
  
  // Date selection: default to tomorrow YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  
  // Form fields
  const [customerName, setCustomerName] = useState('Sarah Jenkins');
  const [customerEmail, setCustomerEmail] = useState('sarah.j@example.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 111-2233');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const availableTimes = ['09:00 AM', '10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

  // Fee calculation
  const platformFee = Math.max(0.5, Number((selectedService.price * 0.025).toFixed(2)));
  const totalAmount = Number((selectedService.price + platformFee).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) return;

    setIsSubmitting(true);
    try {
      await onConfirmBooking({
        businessId: business.id,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        staffId: selectedStaff?.id,
        staffName: selectedStaff?.name,
        customerName,
        customerEmail,
        customerPhone,
        date: selectedDate,
        time: selectedTime,
        notes,
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bizReviews = reviews.filter((r) => r.businessId === business.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-slate-900 dark:text-slate-100 relative my-auto transition-colors">
        
        {/* Header / Banner */}
        <div className="relative h-48 sm:h-56">
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-white transition-colors shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-3xl shadow-xl">
                {business.logo}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                  {business.categoryLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{business.name}</h2>
                <p className="text-xs text-slate-200">{business.address}</p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenChat(business);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-xs font-semibold text-slate-800 border border-slate-200 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Ask AI Receptionist</span>
            </button>
          </div>
        </div>

        {/* Success Modal View */}
        {bookingSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your appointment at <span className="font-semibold text-indigo-600">{business.name}</span> has been successfully placed.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-800">{selectedService.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Staff Member:</span>
                <span className="font-semibold text-slate-800">{selectedStaff?.name || 'Assigned Staff'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold text-slate-800">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-emerald-600 text-sm">${totalAmount}</span>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 max-w-md mx-auto flex items-center space-x-3 text-left">
              <Smartphone className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="text-xs text-indigo-900">
                <span className="font-semibold block">Automated Reminders Enabled</span>
                We sent an instant SMS confirmation to {customerPhone}. You'll receive a WhatsApp reminder 24 hours prior!
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm shadow-indigo-100"
            >
              Done & View My Bookings
            </button>
          </div>
        ) : (
          /* Booking Form & Service Selection */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            
            {/* Step 1: Select Service */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center mr-2">1</span>
                Select Service
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {business.services.map((srv) => {
                  const isSelected = selectedService.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm text-slate-900">{srv.name}</h4>
                        <span className="text-sm font-bold text-indigo-600">${srv.price}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{srv.description}</p>
                      <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-indigo-600" />
                        <span>{srv.durationMinutes} mins</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Staff (If available) */}
            {business.staff.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center mr-2">2</span>
                  Choose Specialist
                </label>

                <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                  {business.staff.map((st) => {
                    const isSelected = selectedStaff?.id === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStaff(st)}
                        className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl border text-xs transition-all shrink-0 ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                        <div className="text-left">
                          <div className="font-semibold text-slate-900">{st.name}</div>
                          <div className="text-[10px] text-slate-500">{st.role}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {availableTimes.slice(0, 6).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                        selectedTime === t
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Contact & Reminders */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Customer Contact (For Reminders)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1 font-medium">Phone (SMS / WhatsApp)</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Transparent Platform Fee Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>{selectedService.name}</span>
                <span className="font-semibold">${selectedService.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span className="flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 text-indigo-600" />
                  AutoBook Secure Platform Fee (2.5%)
                </span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Due Now</span>
                <span className="text-emerald-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Reviews Section */}
            {bizReviews.length > 0 && (
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Customer Reviews ({bizReviews.length})
                  </h4>
                  <div className="flex items-center text-xs text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" />
                    <span className="font-bold">{business.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {bizReviews.map((rev) => (
                    <div key={rev.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between items-center text-slate-800">
                        <span className="font-semibold">{rev.customerName}</span>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <p className="text-slate-600 italic text-[11px]">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-100 transition-all disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isSubmitting ? 'Processing Payment...' : `Pay $${totalAmount.toFixed(2)} & Confirm`}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

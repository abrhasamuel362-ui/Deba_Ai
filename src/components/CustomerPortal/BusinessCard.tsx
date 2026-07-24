import React from 'react';
import { Star, MapPin, Clock, CalendarCheck, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';
import { Business } from '../../types';

interface BusinessCardProps {
  business: Business;
  onOpenBooking: (b: Business) => void;
  onOpenChat: (b: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onOpenBooking,
  onOpenChat,
}) => {
  const lowestPrice = Math.min(...business.services.map((s) => s.price));

  return (
    <div className="group bg-white dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

          {/* Logo Badge */}
          <div className="absolute bottom-3 left-4 flex items-center space-x-2">
            <span className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shadow-md">
              {business.logo}
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                {business.categoryLabel}
              </span>
            </div>
          </div>

          {/* Featured & AI Badges */}
          <div className="absolute top-3 right-3 flex items-center space-x-1.5">
            {business.isFeatured && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                ★ FEATURED
              </span>
            )}
            {business.autoReplyEnabled && (
              <span className="bg-indigo-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center shadow-md">
                <Sparkles className="w-3 h-3 mr-1 text-white" />
                Instant Replies
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {business.name}
            </h3>
            <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold">{business.rating}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">({business.reviewCount})</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">{business.tagline}</p>

          <div className="space-y-1 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">{business.address}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{business.openingHours}</span>
            </div>
          </div>

          {/* Popular Services Chips */}
          <div className="pt-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1.5">
              Top Services ({business.services.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {business.services.slice(0, 3).map((srv) => (
                <span
                  key={srv.id}
                  className="text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md flex items-center space-x-1"
                >
                  <span className="truncate max-w-[120px]">{srv.name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">${srv.price}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">From</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">${lowestPrice}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenChat(business)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
            title="Chat with Business Assistant"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenBooking(business)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

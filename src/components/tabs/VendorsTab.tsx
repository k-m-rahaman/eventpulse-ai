import React from 'react';
import {
  Users,
  MessageSquare,
  Phone,
  Clock,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { EventPlan, Vendor } from '../../types/event';
import { formatCurrency } from '../../services/currency';

interface VendorsTabProps {
  eventPlan: EventPlan;
  onOpenVendorNotice: (vendor: Vendor) => void;
  onUpdatePaymentStatus: (vendorId: string, status: Vendor['paymentMilestone']) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({
  eventPlan,
  onOpenVendorNotice,
  onUpdatePaymentStatus,
}) => {
  return (
    <div className="space-y-6 view-enter">
      {/* Top Info Banner */}
      <div className="p-5 sm:p-6 glass-widget rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 stagger-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-xs">
            <Users className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Vendor SLA Checklist & Auto-Outreach Hub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Contracted vendors with automated context-aware WhatsApp/Email notices and host sign-off controls
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl glass-pill text-slate-700 dark:text-slate-300 self-start sm:self-center">
          {eventPlan.vendors.length} Contracted Partners
        </span>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {eventPlan.vendors.map((vendor, index) => {
          const hasNotice = Boolean(vendor.lastNoticeGenerated || vendor.autoDraftedMessage);
          const isActionRequired = vendor.paymentMilestone === 'Action Required' || Boolean(vendor.actionRequiredReason);
          const isUpdatedByAi = vendor.wasUpdated;

          return (
            <div
              key={vendor.id}
              className={`p-5 sm:p-6 rounded-2xl transition-all duration-200 flex flex-col justify-between space-y-4 glass-widget stagger-${Math.min(index + 2, 4)} ${
                isUpdatedByAi
                  ? 'border-indigo-300/80 dark:border-indigo-800/80 bg-indigo-50/30 dark:bg-indigo-950/20'
                  : isActionRequired
                  ? 'border-amber-300/80 dark:border-amber-900/80 bg-amber-50/30 dark:bg-amber-950/20'
                  : ''
              }`}
            >
              <div className="space-y-3.5">
                {/* Header: Name, Role & Milestone Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {vendor.name}
                      </h4>

                      {/* UPDATED BY AI BADGE */}
                      {isUpdatedByAi && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                          UPDATED BY AI
                        </span>
                      )}

                      {/* CHANGE REASON PILL */}
                      {vendor.changeReason && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          {vendor.changeReason}
                        </span>
                      )}
                    </div>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {vendor.role}
                    </span>
                  </div>

                  {/* Payment Status Dropdown */}
                  <select
                    value={vendor.paymentMilestone}
                    onChange={(e) =>
                      onUpdatePaymentStatus(vendor.id, e.target.value as Vendor['paymentMilestone'])
                    }
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                      vendor.paymentMilestone === 'Paid in Full'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : vendor.paymentMilestone === 'Deposit Paid'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
                        : vendor.paymentMilestone === 'Action Required'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <option value="Deposit Paid">Deposit Paid</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Action Required">Action Required</option>
                    <option value="Paid in Full">Paid in Full</option>
                  </select>
                </div>

                {/* Action Required Banner if present */}
                {vendor.actionRequiredReason && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
                    <div>
                      <strong className="block font-semibold">Action Required:</strong>
                      <span>{vendor.actionRequiredReason}</span>
                    </div>
                  </div>
                )}

                {/* Key SLA & Contact Meta */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium uppercase tracking-wider">
                      Contact Person
                    </span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                      {vendor.contactPerson}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                      <Phone className="w-3 h-3 text-slate-400" strokeWidth={1.75} /> {vendor.phone}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium uppercase tracking-wider">
                      SLA Target & Value
                    </span>
                    <div className="font-semibold text-indigo-700 dark:text-indigo-400 mt-1 truncate">
                      {vendor.slaDeadline}
                    </div>
                    <div className="text-[11px] font-mono font-bold text-slate-900 dark:text-white mt-1">
                      {formatCurrency(vendor.amount, vendor.currency)}
                    </div>
                  </div>
                </div>

                {/* AI Auto-Drafted Message Preview */}
                {(vendor.autoDraftedMessage || vendor.lastNoticeGenerated?.message) && (
                  <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                      Auto-Generated Directive Notice
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 text-xs italic line-clamp-2 leading-relaxed">
                      "{vendor.autoDraftedMessage || vendor.lastNoticeGenerated?.message}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {hasNotice ? 'Change order draft ready' : 'Initial brief confirmed'}
                </div>

                <button
                  onClick={() => onOpenVendorNotice(vendor)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-all duration-150 active:scale-[0.98]"
                >
                  <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Review WhatsApp Notice</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, Send, Phone, Mail, Clock, ExternalLink, ShieldCheck, UserCheck, CheckCircle2 } from 'lucide-react';
import { Vendor } from '../types/event';
import { formatCurrency } from '../services/currency';

interface WhatsAppNoticeModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onMarkSent: (vendorId: string) => void;
}

export const WhatsAppNoticeModal: React.FC<WhatsAppNoticeModalProps> = ({ vendor, onClose, onMarkSent }) => {
  const [copied, setCopied] = useState(false);
  const [requireHostSignoff, setRequireHostSignoff] = useState(true);
  const [isHostApproved, setIsHostApproved] = useState(false);

  if (!vendor) return null;

  const notice = vendor.lastNoticeGenerated || {
    timestamp: 'Just now',
    trigger: 'Vendor Milestone Briefing',
    subject: `SLA & Milestone Sync: ${vendor.role}`,
    message: vendor.autoDraftedMessage || `Dear ${vendor.contactPerson}, confirming deliverables for ${vendor.name} (${vendor.role}). Please review your SLA deadline: ${vendor.slaDeadline}. Let us know if you require any adjustments on site.`,
    sent: false,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${notice.subject}\n\n${notice.message}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = vendor.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `*${notice.subject}*\n\n${notice.message}`
  )}`;

  const canSend = !requireHostSignoff || isHostApproved;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl shadow-2xl p-6 overflow-hidden animate-blur-in">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{vendor.name}</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {vendor.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {vendor.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> {vendor.email}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context badge */}
        <div className="mt-4 p-3 bg-white/40 dark:bg-slate-850/40 border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>
              Trigger: <strong className="text-slate-900 dark:text-white">{notice.trigger}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">{notice.timestamp}</span>
            {notice.sent ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold text-[10px]">
                Dispatched
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-semibold text-[10px]">
                Draft Ready
              </span>
            )}
          </div>
        </div>

        {/* Message preview */}
        <div className="mt-4 space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            AI-Personalized Change Order Notice
          </label>
          <div className="p-4 bg-white/40 dark:bg-slate-850/40 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200/80 dark:border-slate-800 pb-1.5">
              Subject: {notice.subject}
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line select-all bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
              {notice.message}
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Sign-off Control */}
        <div className="mt-4 p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={requireHostSignoff}
                onChange={(e) => setRequireHostSignoff(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span>Require Host Sign-Off Before Sending</span>
            </label>
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              Human-in-the-Loop
            </span>
          </div>

          {requireHostSignoff && (
            <div className="flex items-center justify-between pt-1 border-t border-indigo-100 dark:border-indigo-900/50 text-xs">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                {isHostApproved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Signed off by Lead Event Host (Approved for delivery)</span>
                  </>
                ) : (
                  <span>Host approval is pending before WhatsApp dispatch</span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setIsHostApproved(!isHostApproved)}
                className={`px-3 py-1 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ${
                  isHostApproved
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                {isHostApproved ? 'Approved by Host' : 'Click to Sign-Off'}
              </button>
            </div>
          )}
        </div>

        {/* Milestone info */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-white/40 dark:bg-slate-850/40 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">SLA Target Deadline</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{vendor.slaDeadline}</span>
          </div>
          <div className="p-2.5 bg-white/40 dark:bg-slate-850/40 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Contract Valuation</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
              {formatCurrency(vendor.amount, vendor.currency)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => onMarkSent(vendor.id)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 ${
              notice.sent
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            {notice.sent ? 'Marked Dispatched' : 'Toggle Dispatched'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>

            {canSend ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Open WhatsApp Web <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            ) : (
              <button
                disabled
                className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-1.5 cursor-not-allowed opacity-75"
                title="Please approve as Host above to dispatch via WhatsApp"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Sign-Off Required
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

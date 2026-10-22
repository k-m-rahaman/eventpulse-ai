import React, { useState } from 'react';
import { Sparkles, Check, RotateCcw, X, Clock, Mail, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { EventPlan } from '../types/event';

interface RippleBannerProps {
  eventPlan: EventPlan;
  onUndo: () => void;
  onResetBaseline: () => void;
  onDismiss: () => void;
  canUndo: boolean;
  hasBaseline: boolean;
}

export const RippleBanner: React.FC<RippleBannerProps> = ({
  eventPlan,
  onUndo,
  onResetBaseline,
  onDismiss,
  canUndo,
  hasBaseline,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const summary = eventPlan.meta.lastRippleSummary;
  const aiFixes = eventPlan.meta.aiRippleSummary || [];

  if (!summary) return null;

  return (
    <div className="glass-widget border-indigo-300/80 dark:border-indigo-800/80 rounded-2xl p-4 shadow-sm transition-all animate-fadeIn">
      {/* Main Single Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Indicator + Trigger + Quick stats */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Ripple Active</span>
          </span>

          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {summary.triggerName}
          </span>

          {/* Impact counts */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 text-[11px]">
              {summary.budgetChangesCount} Budget Lines
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 text-[11px]">
              {summary.timelineChangesCount} Timeline Nodes
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 text-[11px]">
              {summary.vendorNoticesCount} Vendor Notices
            </span>
          </div>
        </div>

        {/* Right: Expand Fixes + Reset to Baseline + Dismiss */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {aiFixes.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition active:scale-95"
            >
              <span>{isExpanded ? 'Hide Fixes' : 'View 4 Fixes'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          {hasBaseline && (
            <button
              onClick={onResetBaseline}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50/80 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold transition active:scale-95"
              title="Reset all changes back to original baseline plan"
            >
              <RefreshCw className="w-3 h-3 text-rose-600 dark:text-rose-400" />
              <span>Reset to Baseline</span>
            </button>
          )}

          {canUndo && (
            <button
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl glass-pill text-slate-700 dark:text-slate-300 text-xs font-medium transition active:scale-95"
              title="Undo last step"
            >
              <RotateCcw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Undo</span>
            </button>
          )}

          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 transition"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable 4 Cross-Tab Fixes */}
      {isExpanded && aiFixes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {summary.explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            {aiFixes.map((fix, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-white/60 dark:bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-200/70 dark:border-slate-700/70 text-slate-700 dark:text-slate-300"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{fix}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

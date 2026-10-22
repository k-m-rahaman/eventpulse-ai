import React from 'react';
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Sliders,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { EventPlan } from '../../types/event';
import { formatCurrency } from '../../services/currency';

interface BudgetTabProps {
  eventPlan: EventPlan;
  onUpdateCategoryAllocation: (categoryId: string, newAllocated: number) => void;
  onApplySavingTip: (categoryId: string) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  eventPlan,
  onUpdateCategoryAllocation,
  onApplySavingTip,
}) => {
  const totalAllocated = eventPlan.budgetCategories.reduce((sum, c) => sum + c.allocated, 0);
  const totalEstimated = eventPlan.budgetCategories.reduce((sum, c) => sum + c.estimatedActual, 0);
  const remainingBudget = eventPlan.totalBudget - totalEstimated;
  const isOverBudget = remainingBudget < 0;

  return (
    <div className="space-y-6 view-enter">
      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Allocated Planned */}
        <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between stagger-1">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Budget Cap
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono mt-1">
              {formatCurrency(eventPlan.totalBudget, eventPlan.currency)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Cap across {eventPlan.budgetCategories.length} categories
            </div>
          </div>
          <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-xs">
            <Wallet className="w-5 h-5" strokeWidth={1.75} />
          </div>
        </div>

        {/* Estimated Actual */}
        <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between stagger-2">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Estimated Actual Spend
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono mt-1">
              {formatCurrency(totalEstimated, eventPlan.currency)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Planned target: {formatCurrency(totalAllocated, eventPlan.currency)}
            </div>
          </div>
          <div className="p-3 bg-white/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 shadow-xs">
            <TrendingUp className="w-5 h-5" strokeWidth={1.75} />
          </div>
        </div>

        {/* Variance Buffer */}
        <div className={`glass-widget rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between stagger-3 ${
          isOverBudget
            ? 'border-rose-300/80 dark:border-rose-900/80 bg-rose-50/30 dark:bg-rose-950/20'
            : ''
        }`}>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {isOverBudget ? 'Budget Overrun Deficit' : 'Contingency Balance'}
            </span>
            <div className={`text-2xl sm:text-3xl font-bold font-mono mt-1 ${
              isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
            }`}>
              {isOverBudget ? '-' : '+'}{formatCurrency(Math.abs(remainingBudget), eventPlan.currency)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isOverBudget ? 'Action required: Apply cost-saving tips below' : 'Safe operating margin'}
            </div>
          </div>
          <div className={`p-3 rounded-xl border ${
            isOverBudget
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
          }`}>
            {isOverBudget ? (
              <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />
            )}
          </div>
        </div>
      </div>

      {/* Main Budget Table */}
      <div className="glass-widget rounded-2xl shadow-sm overflow-hidden stagger-4">
        <div className="p-5 sm:p-6 border-b border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/40 dark:bg-slate-850/40 backdrop-blur-sm">
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Dynamic Budget Allocation & Overrun Forecaster
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Drag sliders to adjust category targets in real time. Diff badges show automatic crisis adjustments.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> On Track
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Overrun Risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Optimized
            </span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {eventPlan.budgetCategories.map((cat) => {
            const usagePercent = Math.round((cat.estimatedActual / cat.allocated) * 100);
            const isCategoryOverrun = cat.estimatedActual > cat.allocated;
            const isUpdatedByAi = cat.wasUpdated;

            return (
              <div
                key={cat.id}
                className={`p-5 sm:p-6 transition-colors duration-150 space-y-3.5 ${
                  isUpdatedByAi
                    ? 'bg-indigo-50/25 dark:bg-indigo-950/20'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                }`}
              >
                {/* Header Row: Title, Badges, Figures */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {cat.category}
                      </span>

                      {/* Status badge */}
                      <span
                        className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                          isCategoryOverrun || cat.status === 'Overrun Risk'
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                            : cat.status === 'Optimized'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {isCategoryOverrun ? 'Overrun Risk' : cat.status}
                      </span>

                      {/* UPDATED BY AI BADGE */}
                      {isUpdatedByAi && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          UPDATED BY AI
                        </span>
                      )}

                      {/* DELTA CHANGE PILL */}
                      {cat.deltaChange && (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            cat.deltaChange.startsWith('+')
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {cat.deltaChange.startsWith('+') ? (
                            <ArrowUpRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          )}
                          <span>{cat.deltaChange}</span>
                          {cat.changeReason && (
                            <span className="opacity-75 pl-1 border-l border-current/30 text-[9px]">
                              {cat.changeReason}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{cat.notes}</div>
                  </div>

                  {/* Financial Values */}
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium uppercase tracking-wider">
                        Allocated
                      </span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                        {formatCurrency(cat.allocated, eventPlan.currency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium uppercase tracking-wider">
                        Est. Actual
                      </span>
                      <span
                        className={`font-mono font-bold text-xs sm:text-sm ${
                          isCategoryOverrun
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {formatCurrency(cat.estimatedActual, eventPlan.currency)}
                      </span>
                    </div>
                    <div className="min-w-[48px] text-center">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium uppercase tracking-wider">
                        Util.
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-mono font-bold ${
                          usagePercent > 100
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {usagePercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200/50 dark:bg-slate-800/60 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      usagePercent > 100
                        ? 'bg-rose-500'
                        : usagePercent > 85
                        ? 'bg-amber-500'
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>

                {/* Sliders & AI Cost-Saving Tip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  {/* Slider */}
                  <div className="flex items-center gap-3 sm:max-w-xs w-full">
                    <Sliders className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={1.75} />
                    <input
                      type="range"
                      min={Math.round(cat.allocated * 0.5)}
                      max={Math.round(cat.allocated * 1.6)}
                      step={1000}
                      value={cat.allocated}
                      onChange={(e) => onUpdateCategoryAllocation(cat.id, parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                      Cap
                    </span>
                  </div>

                  {/* AI Tip Pill */}
                  {(cat.aiCostSavingTip || cat.aiSavingTip) && (
                    <div className="flex items-center gap-2 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl px-3 py-1.5 text-xs text-indigo-900 dark:text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" strokeWidth={1.75} />
                      <span className="text-[11px] line-clamp-1">
                        <strong>AI Tip:</strong> {cat.aiCostSavingTip || cat.aiSavingTip}
                      </span>
                      <button
                        onClick={() => onApplySavingTip(cat.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] shrink-0 transition-all duration-150 active:scale-[0.98] shadow-xs"
                      >
                        Apply Tip
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

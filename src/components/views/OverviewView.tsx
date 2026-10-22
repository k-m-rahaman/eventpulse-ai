import React from 'react';
import {
  Wallet,
  Users,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  MapPin,
  CloudSun,
  CloudRain,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Building,
  Zap,
  Tag
} from 'lucide-react';
import { EventPlan, CurrencyType, Vendor, TimelineNode } from '../../types/event';
import { formatCurrency } from '../../services/currency';

interface OverviewViewProps {
  eventPlan: EventPlan;
  onNavigateTab: (tab: 'budget' | 'timeline' | 'guests' | 'vendors' | 'scenario-studio' | 'ideation') => void;
  onOpenVendorNotice: (vendor: Vendor) => void;
  onTriggerQuickScenario: (type: 'rain' | 'guests' | 'budget') => void;
  currency: CurrencyType;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  eventPlan,
  onNavigateTab,
  onOpenVendorNotice,
  onTriggerQuickScenario,
  currency,
}) => {
  // Budget calculations
  const totalAllocated = eventPlan.budgetCategories.reduce((sum, c) => sum + c.allocated, 0);
  const totalEstimated = eventPlan.budgetCategories.reduce((sum, c) => sum + c.estimatedActual, 0);
  const budgetVariance = totalEstimated - eventPlan.totalBudget;
  const isOverBudget = budgetVariance > 0;
  const budgetUtilization = Math.round((totalEstimated / eventPlan.totalBudget) * 100);

  // Guests
  const guests = eventPlan.guests || [];
  const confirmedGuests = guests
    .filter((g) => g.rsvpStatus === 'Confirmed')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);
  const effectiveGuests = confirmedGuests > 0 ? confirmedGuests : eventPlan.guestCount;
  const costPerGuest = Math.round(eventPlan.totalBudget / Math.max(effectiveGuests, 1));

  // Vendor SLA
  const actionRequiredVendors = eventPlan.vendors.filter(
    (v) => v.paymentMilestone === 'Action Required' || v.actionRequiredReason
  );
  const slaHealthScore = Math.round(
    ((eventPlan.vendors.length - actionRequiredVendors.length) / Math.max(eventPlan.vendors.length, 1)) * 100
  );

  // Timeline Next Critical Milestone
  const pendingNodes = eventPlan.timelineNodes.filter((n) => n.status !== 'completed');
  const nextMilestone = pendingNodes[0] || eventPlan.timelineNodes[0];
  const conflictCount = eventPlan.timelineNodes.filter((n) => n.hasConflict).length;

  // Weather status
  const isRain = eventPlan.weatherCondition.toLowerCase().includes('rain');

  // Contextual Header determination
  let statusBannerText = 'All operational indicators nominal. Vendors aligned and schedule on track.';
  let statusBannerVariant: 'nominal' | 'warning' | 'alert' = 'nominal';

  if (isRain && !eventPlan.venue.isRainSheltered) {
    statusBannerText = 'Weather Alert: Rain detected on outdoor grounds. Weatherproof tenting or indoor fallback recommended.';
    statusBannerVariant = 'alert';
  } else if (actionRequiredVendors.length > 0) {
    statusBannerText = `${actionRequiredVendors.length} vendor contract directives require outreach. Check WhatsApp notices.`;
    statusBannerVariant = 'warning';
  } else if (isOverBudget) {
    statusBannerText = `Budget deficit: Spending projected at ${formatCurrency(budgetVariance, currency)} over baseline cap. Apply AI saving tips.`;
    statusBannerVariant = 'warning';
  }

  return (
    <div className="space-y-6 view-enter">
      {/* Contextual Status Banner */}
      <div className={`glass-widget p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 stagger-1 ${
        statusBannerVariant === 'alert'
          ? 'border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200'
          : statusBannerVariant === 'warning'
          ? 'border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200'
          : 'border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            statusBannerVariant === 'alert'
              ? 'bg-rose-600 dark:bg-rose-400 animate-pulse'
              : statusBannerVariant === 'warning'
              ? 'bg-amber-600 dark:bg-amber-400 animate-pulse'
              : 'bg-emerald-600 dark:bg-emerald-400'
          }`} />
          <span className="text-xs sm:text-sm font-semibold leading-relaxed">
            {statusBannerText}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {eventPlan.meta.isDiffActive && (
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-current text-indigo-700 dark:text-indigo-400">
              AI Ripple Active
            </span>
          )}
          <button
            onClick={() => onNavigateTab('scenario-studio')}
            className="glass-pill px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 active:scale-95 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            <span>Open Scenario Studio</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* 4 Unique Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Budget & Forecast */}
        <div
          onClick={() => onNavigateTab('budget')}
          className="glass-widget rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer group flex flex-col justify-between stagger-1 active:scale-[0.99]"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Budget
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-150 shadow-xs">
                <Wallet className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(totalEstimated, currency)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Cap: {formatCurrency(eventPlan.totalBudget, currency)}</span>
              <span className={isOverBudget ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-700 dark:text-emerald-400 font-bold'}>
                {budgetUtilization}%
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 w-full h-1.5 rounded-full bg-slate-200/60 dark:bg-slate-800/60 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                budgetUtilization > 100 ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Guests & Capacity */}
        <div
          onClick={() => onNavigateTab('guests')}
          className="glass-widget rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer group flex flex-col justify-between stagger-2 active:scale-[0.99]"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Confirmed Guests
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-150 shadow-xs">
                <Users className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
              {effectiveGuests}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">
                / {eventPlan.venue.capacity} cap
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              Plate Spend: ~{formatCurrency(costPerGuest, currency)}/pax
            </div>
          </div>
          <div className="mt-4 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Dietary Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </div>
        </div>

        {/* KPI 3: Next Critical Milestone */}
        <div
          onClick={() => onNavigateTab('timeline')}
          className="glass-widget rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer group flex flex-col justify-between stagger-3 active:scale-[0.99]"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Next Milestone
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-150 shadow-xs">
                <Clock className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="mt-2 text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {nextMilestone ? nextMilestone.title : 'All Milestones Complete'}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              {nextMilestone ? nextMilestone.timeSlot : 'Run of Show Ready'}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">{eventPlan.timelineNodes.length} nodes linked</span>
            {conflictCount > 0 ? (
              <span className="text-amber-700 dark:text-amber-400 font-semibold font-mono">{conflictCount} conflict</span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Sequence aligned</span>
            )}
          </div>
        </div>

        {/* KPI 4: Vendor SLAs */}
        <div
          onClick={() => onNavigateTab('vendors')}
          className="glass-widget rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer group flex flex-col justify-between stagger-4 active:scale-[0.99]"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Vendor SLA Health
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-150 shadow-xs">
                <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
              {slaHealthScore}%{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">
                verified
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {eventPlan.vendors.length} vendors contracted
            </div>
          </div>
          <div className="mt-4 text-[11px] font-semibold">
            {actionRequiredVendors.length > 0 ? (
              <span className="text-amber-700 dark:text-amber-400 font-mono">
                {actionRequiredVendors.length} require action notices
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400">All milestones confirmed</span>
            )}
          </div>
        </div>
      </div>

      {/* 60 / 40 Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (60% -> 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Spend Distribution */}
          <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm stagger-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                  Budget Spend Distribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Allocated planned target vs estimated actuals across operational categories
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('budget')}
                className="glass-pill px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-all duration-150 active:scale-95"
              >
                <span>Full Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-3.5">
              {eventPlan.budgetCategories.slice(0, 5).map((cat) => {
                const pct = Math.round((cat.estimatedActual / cat.allocated) * 100);
                const isOver = cat.estimatedActual > cat.allocated;
                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                        {cat.category}
                      </span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-500 dark:text-slate-400">
                          {formatCurrency(cat.allocated, currency)}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(cat.estimatedActual, currency)}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isOver
                            ? 'bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                            : 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isOver ? 'bg-rose-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Path Run-of-Show Preview */}
          <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm stagger-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                  Critical Path Run-of-Show Preview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sequential milestone chain with dependency linking
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="glass-pill px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-all duration-150 active:scale-95"
              >
                <span>Full Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {eventPlan.timelineNodes.slice(0, 4).map((node) => (
                <div
                  key={node.id}
                  className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-white/40 dark:bg-slate-850/40 backdrop-blur-sm flex items-center justify-between gap-3 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-150"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 dark:text-white block">{node.title}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {node.timeSlot} • Owner: {node.owner}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {node.wasUpdated && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        Shifted
                      </span>
                    )}
                    <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                      node.status === 'completed'
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (40% -> 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Vendors Health & Outreach */}
          <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm stagger-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                  Contracted Vendors
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct WhatsApp/Email directive dispatch
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('vendors')}
                className="glass-pill px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-all duration-150 active:scale-95"
              >
                <span>All Vendors</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-2.5">
              {eventPlan.vendors.slice(0, 4).map((vendor) => {
                const needsAction = vendor.paymentMilestone === 'Action Required' || vendor.actionRequiredReason;
                return (
                  <div
                    key={vendor.id}
                    className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-white/40 dark:bg-slate-850/40 backdrop-blur-sm flex items-center justify-between text-xs hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-150"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">{vendor.name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{vendor.role}</span>
                    </div>

                    <button
                      onClick={() => onOpenVendorNotice(vendor)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-95 ${
                        needsAction
                          ? 'bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 hover:bg-amber-200/90'
                          : 'glass-pill text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <MessageSquare className="w-3 h-3" strokeWidth={1.75} />
                      <span>{needsAction ? 'Notice Ready' : 'Contact'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Next-Best Recommendations */}
          <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5 stagger-3 border-indigo-200/50 dark:border-indigo-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
                AI Agent Next Actions
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50/80 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Active
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-start gap-2.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" strokeWidth={1.75} />
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {eventPlan.budgetCategories[0]?.aiCostSavingTip ||
                    'Confirm beverage block order with venue to waive evening corkage fee.'}
                </span>
              </div>
              <div className="p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-start gap-2.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" strokeWidth={1.75} />
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {eventPlan.ideation.sustainabilitySwaps[0]
                    ? `Eco-swap recommendation: ${eventPlan.ideation.sustainabilitySwaps[0].ecoSwap}`
                    : 'Check power generator fuel levels before Baraat commencement.'}
                </span>
              </div>
            </div>
          </div>

          {/* Venue & Weather Contingency */}
          <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5 stagger-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" strokeWidth={1.75} />
                Venue & Weather Contingency
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {eventPlan.venue.type.toUpperCase()}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/80 text-xs space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">{eventPlan.venue.name}</div>
              <div className="text-slate-500 dark:text-slate-400">{eventPlan.venue.location}</div>
              <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
                <span>Weather: {eventPlan.weatherCondition}</span>
                <span className={eventPlan.venue.isRainSheltered ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-amber-700 dark:text-amber-400 font-semibold'}>
                  {eventPlan.venue.isRainSheltered ? 'Sheltered' : 'Outdoor Risk'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => onTriggerQuickScenario('rain')}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 shadow-xs"
              >
                <CloudRain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
                <span>Test Rain Shift</span>
              </button>
              <button
                onClick={() => onTriggerQuickScenario('guests')}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" strokeWidth={1.75} />
                <span>Test +50 Guests</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

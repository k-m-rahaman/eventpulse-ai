import React from 'react';
import {
  Wallet,
  Users,
  CloudSun,
  AlertOctagon,
  CloudRain,
  Plus,
  Minus,
  MapPin,
  RotateCcw
} from 'lucide-react';
import { EventPlan } from '../types/event';
import { formatCurrency } from '../services/currency';

interface CommandCenterProps {
  eventPlan: EventPlan;
  onUpdateGuestCount: (delta: number) => void;
  onToggleWeather: () => void;
  onQuickBudgetAdjust: (percentChange: number) => void;
  onResetBaseline?: () => void;
  hasBaseline?: boolean;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  eventPlan,
  onUpdateGuestCount,
  onToggleWeather,
  onQuickBudgetAdjust,
  onResetBaseline,
  hasBaseline,
}) => {
  const totalAllocated = eventPlan.budgetCategories.reduce((sum, c) => sum + c.allocated, 0);
  const totalEstimated = eventPlan.budgetCategories.reduce((sum, c) => sum + c.estimatedActual, 0);
  const budgetUtilization = Math.round((totalEstimated / eventPlan.totalBudget) * 100);
  const costPerGuest = Math.round(eventPlan.totalBudget / eventPlan.guestCount);

  const pendingSlaCount = eventPlan.vendors.filter(
    (v) => v.paymentMilestone === 'Action Required' || v.actionRequiredReason
  ).length;

  const conflictCount = eventPlan.timelineNodes.filter((t) => t.hasConflict).length;
  const isRain = eventPlan.weatherCondition.toLowerCase().includes('rain');

  return (
    <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Row 1: Event Title, Location badge & Quick Inline Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {eventPlan.name}
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{eventPlan.venue.name}</span>
            </div>
            {eventPlan.meta.isDiffActive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI Ripple Active
              </span>
            )}
          </div>

          {/* Quick Inline Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Quick Guest Count Adjuster */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 gap-1.5">
              <span className="text-slate-500 text-xs font-medium">Guests:</span>
              <button
                onClick={() => onUpdateGuestCount(-10)}
                className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold transition"
                title="Decrease 10 guests"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-semibold text-slate-900 px-1 font-mono">{eventPlan.guestCount}</span>
              <button
                onClick={() => onUpdateGuestCount(10)}
                className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold transition"
                title="Add 10 guests"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Weather Toggle */}
            <button
              onClick={onToggleWeather}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
                isRain
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
              title="Click to toggle weather forecast between Sunny & Rain"
            >
              {isRain ? <CloudRain className="w-3.5 h-3.5 text-cyan-600" /> : <CloudSun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{eventPlan.weatherCondition}</span>
            </button>

            {/* Quick Budget -10% / +10% */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-0.5 gap-1">
              <span className="text-slate-500 text-[11px] font-medium">Budget:</span>
              <button
                onClick={() => onQuickBudgetAdjust(-10)}
                className="px-1.5 py-0.5 rounded bg-white hover:bg-slate-200 text-slate-700 font-medium text-[11px] border border-slate-200 transition"
                title="Trim budget by 10%"
              >
                -10%
              </button>
              <button
                onClick={() => onQuickBudgetAdjust(10)}
                className="px-1.5 py-0.5 rounded bg-white hover:bg-slate-200 text-slate-700 font-medium text-[11px] border border-slate-200 transition"
                title="Boost budget by 10%"
              >
                +10%
              </button>
            </div>

            {/* Reset to baseline button if ripple active */}
            {hasBaseline && onResetBaseline && eventPlan.meta.isDiffActive && (
              <button
                onClick={onResetBaseline}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs transition"
                title="Reset plan to baseline"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Sleek 4-Stat KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Stat 1: Budget */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium text-[11px]">Total Budget Pool</span>
              <Wallet className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {formatCurrency(eventPlan.totalBudget, eventPlan.currency)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
              <span>Est: {formatCurrency(totalEstimated, eventPlan.currency)}</span>
              <span className={`font-semibold ${budgetUtilization > 100 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {budgetUtilization}%
              </span>
            </div>
          </div>

          {/* Stat 2: Guest Economics */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium text-[11px]">Guest Economics</span>
              <Users className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono flex items-baseline gap-1.5">
              <span>{eventPlan.guestCount}</span>
              <span className="text-xs font-normal text-slate-500">Confirmed</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5">
              Cost: <strong className="text-slate-800 font-mono font-medium">{formatCurrency(costPerGuest, eventPlan.currency)}</strong> / guest
            </div>
          </div>

          {/* Stat 3: Venue & Weather */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium text-[11px]">Venue & Shelter</span>
              {isRain ? <CloudRain className="w-3.5 h-3.5 text-cyan-600" /> : <CloudSun className="w-3.5 h-3.5 text-amber-500" />}
            </div>
            <div className="text-sm font-semibold text-slate-900 truncate">
              {eventPlan.venue.type === 'indoor' ? 'Indoor Sheltered' : 'Outdoor Grounds'}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
              <span>{eventPlan.weatherCondition}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                eventPlan.venue.isRainSheltered
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {eventPlan.venue.isRainSheltered ? 'Protected' : 'Open Sky'}
              </span>
            </div>
          </div>

          {/* Stat 4: SLA & Conflict Health */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium text-[11px]">SLA & Timeline Health</span>
              <AlertOctagon className={`w-3.5 h-3.5 ${conflictCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
            </div>
            <div className="text-lg font-bold font-mono">
              <span className={conflictCount > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                {conflictCount === 0 ? 'All Synced' : `${conflictCount} Conflicts`}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
              <span>Vendor Action:</span>
              <span className={`font-semibold ${pendingSlaCount > 0 ? 'text-amber-700' : 'text-slate-600'}`}>
                {pendingSlaCount} Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

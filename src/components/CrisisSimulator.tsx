import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CloudRain,
  Users,
  Percent,
  Clock,
  SendHorizontal,
  RefreshCw
} from 'lucide-react';

interface CrisisSimulatorProps {
  onTriggerRain: () => void;
  onTriggerGuestJump: () => void;
  onTriggerBudgetCancellation: () => void;
  onTriggerCatererDelay: () => void;
  onTriggerCustomPrompt: (prompt: string, mode: 'crisis' | 'architect') => void;
  onOpenIntakeModal: () => void;
  isProcessing: boolean;
}

export const CrisisSimulator: React.FC<CrisisSimulatorProps> = ({
  onTriggerRain,
  onTriggerGuestJump,
  onTriggerBudgetCancellation,
  onTriggerCatererDelay,
  onTriggerCustomPrompt,
  onOpenIntakeModal,
  isProcessing,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isProcessing) return;
    onTriggerCustomPrompt(customPrompt.trim(), 'crisis');
    setCustomPrompt('');
  };

  return (
    <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left Side: Prompt Input */}
        <form onSubmit={handleSubmitPrompt} className="relative w-full lg:w-7/12 flex items-center">
          <div className="absolute left-3 text-indigo-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isProcessing}
            placeholder='Type what-if crisis (e.g., "Main speaker delayed 30m", "Switch banquet to vegan", "Power outage")...'
            className="w-full pl-9 pr-24 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition"
          />
          <button
            type="submit"
            disabled={isProcessing || !customPrompt.trim()}
            className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition"
          >
            {isProcessing ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <span>Ripple</span>
                <SendHorizontal className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Right Side: 1-Click Scenario Chips for Judges */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-start lg:justify-end">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 hidden sm:inline">
            Quick Tests:
          </span>

          {/* Chip 1: Rain Backup */}
          <button
            disabled={isProcessing}
            onClick={onTriggerRain}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-sm transition disabled:opacity-50"
            title="Move outdoor ceremonies indoors and deploy canopy contingency"
          >
            <CloudRain className="w-3.5 h-3.5 text-blue-600" strokeWidth={1.75} />
            <span>Rain Backup</span>
          </button>

          {/* Chip 2: +50 Guests */}
          <button
            disabled={isProcessing}
            onClick={onTriggerGuestJump}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-sm transition disabled:opacity-50"
            title="Add 50 late RSVP guests, scale catering & expand seating"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" strokeWidth={1.75} />
            <span>+50 Guests</span>
          </button>

          {/* Chip 3: -15% Budget */}
          <button
            disabled={isProcessing}
            onClick={onTriggerBudgetCancellation}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-sm transition disabled:opacity-50"
            title="Trim spend by 15% and value-engineer non-critical scopes"
          >
            <Percent className="w-3.5 h-3.5 text-rose-600" strokeWidth={1.75} />
            <span>-15% Budget</span>
          </button>

          {/* Chip 4: 45m Delay */}
          <button
            disabled={isProcessing}
            onClick={onTriggerCatererDelay}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-sm transition disabled:opacity-50"
            title="Delay dinner 45m, stretch cocktail lounge set & notify crews"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.75} />
            <span>45m Delay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

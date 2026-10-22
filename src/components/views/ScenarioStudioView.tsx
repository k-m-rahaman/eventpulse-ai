import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  CloudRain,
  UserPlus,
  Scissors,
  Hourglass,
  Music,
  Salad,
  MoonStar,
  ZapOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Undo2,
  Clock,
  Wallet,
  Building,
  ShieldCheck,
  Send,
  Eye,
  Sliders
} from 'lucide-react';
import {
  EventPlan,
  ScenarioProposal,
  ScenarioCausalStep,
  CurrencyType,
  Vendor,
  TimelineNode
} from '../../types/event';
import { formatCurrency } from '../../services/currency';

interface ScenarioStudioViewProps {
  currentPlan: EventPlan;
  baselinePlan?: EventPlan;
  canUndo: boolean;
  onRunScenarioSimulation: (prompt: string, triggerName: string) => Promise<ScenarioProposal>;
  onCommitProposal: (proposal: ScenarioProposal) => void;
  onUndoLastCommit: () => void;
  onResetBaseline: () => void;
  isProcessing: boolean;
  currency: CurrencyType;
}

interface ScenarioChip {
  id: string;
  title: string;
  prompt: string;
  category: string;
  icon: React.ReactNode;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const ScenarioStudioView: React.FC<ScenarioStudioViewProps> = ({
  currentPlan,
  baselinePlan,
  canUndo,
  onRunScenarioSimulation,
  onCommitProposal,
  onUndoLastCommit,
  onResetBaseline,
  isProcessing,
  currency,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeProposal, setActiveProposal] = useState<ScenarioProposal | null>(null);
  const [isSimulatingLocal, setIsSimulatingLocal] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  const scenarioChips: ScenarioChip[] = [
    {
      id: 'sc-rain',
      title: 'Sudden Unseasonal Rain',
      category: 'Weather & Venue',
      prompt: 'Unseasonal lake rains force outdoor palace courtyard event indoors. Mandap moved to Zenana Hall, waterproof electrical conduits deployed, and photo slots shifted.',
      icon: <CloudRain className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />,
      riskLevel: 'Critical'
    },
    {
      id: 'sc-guests',
      title: '+50 Late Guest RSVPs',
      category: 'Headcount Surge',
      prompt: 'Guest count increased unexpectedly by +50 attendees (40 standard, 10 Jain thalis). Expand catering orders, add 4 dining tables, and adjust seating layout.',
      icon: <UserPlus className="w-4 h-4 text-violet-600 dark:text-violet-400" strokeWidth={1.75} />,
      riskLevel: 'High'
    },
    {
      id: 'sc-budget',
      title: '15% Discretionary Budget Cut',
      category: 'Financial Variance',
      prompt: 'Total spend must be reduced by 15% across discretionary categories. Replace imported exotic floral mandap with local marigolds and consolidate dessert counters.',
      icon: <Scissors className="w-4 h-4 text-rose-600 dark:text-rose-400" strokeWidth={1.75} />,
      riskLevel: 'Medium'
    },
    {
      id: 'sc-caterer',
      title: 'Caterer Delayed by 45 Mins',
      category: 'Logistics Disruption',
      prompt: 'Catering transport vehicle stuck in highway congestion, arriving 45 minutes late. Shift dinner buffet start time, extend welcome cocktail session by 45 mins, and notify emcee.',
      icon: <Hourglass className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />,
      riskLevel: 'High'
    },
    {
      id: 'sc-performer',
      title: 'VIP Celebrity Performer Rider',
      category: 'Program Add-on',
      prompt: 'Host adds surprise celebrity singer performance for Sangeet. Integrate 24-channel audio mixer rider, artist green room hospitality, and 45-minute prime stage slot.',
      icon: <Music className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={1.75} />,
      riskLevel: 'Medium'
    },
    {
      id: 'sc-dietary',
      title: '40% Transition to Vegan / Jain',
      category: 'Dietary Shift',
      prompt: '40% of confirmed guests transition to strict vegan and Jain meal requirements. Eliminate dairy & root vegetables on 2 dedicated buffet counters, notify head chef.',
      icon: <Salad className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />,
      riskLevel: 'Low'
    },
    {
      id: 'sc-curfew',
      title: '2-Hour Evening Extension Permit',
      category: 'Venue & Legal',
      prompt: 'Host requests a 2-hour late night curfew extension. Secure local acoustic police NOC permit, budget venue overtime rate, and extend DJ performance schedule.',
      icon: <MoonStar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />,
      riskLevel: 'Medium'
    },
    {
      id: 'sc-power',
      title: 'Emergency Power Grid Outage',
      category: 'Critical Infrastructure',
      prompt: 'Municipal power grid blackout during peak evening session. Commission dual 125kVA silent genset backup, switch stage lighting to battery LED floods, alert audio team.',
      icon: <ZapOff className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />,
      riskLevel: 'Critical'
    }
  ];

  const handleRunScenario = async (prompt: string, triggerTitle: string) => {
    setIsSimulatingLocal(true);
    setSimulationStep(1);

    // Step progression
    const timer1 = setTimeout(() => setSimulationStep(2), 200);
    const timer2 = setTimeout(() => setSimulationStep(3), 450);
    const timer3 = setTimeout(() => setSimulationStep(4), 700);

    try {
      const proposal = await onRunScenarioSimulation(prompt, triggerTitle);
      setActiveProposal(proposal);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsSimulatingLocal(false);
      setSimulationStep(0);
    }
  };

  const handleApplyProposal = () => {
    if (!activeProposal) return;
    onCommitProposal(activeProposal);
    setActiveProposal(null);
  };

  const handleDiscardProposal = () => {
    setActiveProposal(null);
  };

  return (
    <div className="space-y-6 view-enter">
      {/* Studio Header Banner */}
      <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Zap className="w-5 h-5" strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Autonomous AI Scenario Studio
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Non-destructive what-if simulator. Preview causal ripples across Budget, Timeline, and Vendors before committing changes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            {canUndo && (
              <button
                onClick={onUndoLastCommit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-pill text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95"
              >
                <Undo2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Undo Last Commit</span>
              </button>
            )}

            {baselinePlan && (
              <button
                onClick={onResetBaseline}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-pill text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Reset to Baseline</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8 Scenario Preset Chips Grid */}
      <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
            Quick-Trigger Scenario Presets
          </span>
          <span className="text-xs font-mono text-slate-400">8 Pre-Engineered Scenarios</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {scenarioChips.map((chip, idx) => {
            return (
              <button
                key={chip.id}
                disabled={isProcessing || isSimulatingLocal}
                onClick={() => handleRunScenario(chip.prompt, chip.title)}
                className={`p-4 rounded-xl glass-widget hover:-translate-y-1 text-left transition-all duration-200 group relative flex flex-col justify-between h-28 shadow-xs active:scale-[0.98] disabled:opacity-50 stagger-${(idx % 4) + 1} animate-blur-in`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                    {chip.icon}
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    chip.riskLevel === 'Critical'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      : chip.riskLevel === 'High'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {chip.riskLevel}
                  </span>
                </div>

                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {chip.title}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {chip.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Arbitrary Disruption Input */}
        <div className="pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customPrompt.trim()) {
                handleRunScenario(customPrompt.trim(), 'Custom AI Scenario');
              }
            }}
            className="flex items-center gap-2.5"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Or describe any custom crisis or change (e.g. 'Photographer flight delayed by 3 hours and floral shipment damaged')..."
                className="w-full text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!customPrompt.trim() || isProcessing || isSimulatingLocal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] shadow-xs disabled:opacity-50 shrink-0"
            >
              <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Simulate</span>
            </button>
          </form>
        </div>
      </div>

      {/* Causal Step Progress Indicator (Visible while analyzing) */}
      {(isSimulatingLocal || isProcessing) && (
        <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
              Gemini 2.5 Flash Autonomous Causal Engine
            </span>
            <span className="text-xs font-mono text-indigo-700 dark:text-indigo-400">Simulating Causal Ripples...</span>
          </div>

          {/* 4-Step Progress Chain */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className={`p-3.5 rounded-xl border transition-all duration-150 ${
              simulationStep >= 1
                ? 'bg-white dark:bg-slate-800 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-semibold shadow-xs'
                : 'bg-white/40 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 mb-0.5">Step 1</div>
              <span>1. Ingesting Constraints</span>
            </div>
            <div className={`p-3.5 rounded-xl border transition-all duration-150 ${
              simulationStep >= 2
                ? 'bg-white dark:bg-slate-800 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-semibold shadow-xs'
                : 'bg-white/40 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 mb-0.5">Step 2</div>
              <span>2. Graph Dependency Audit</span>
            </div>
            <div className={`p-3.5 rounded-xl border transition-all duration-150 ${
              simulationStep >= 3
                ? 'bg-white dark:bg-slate-800 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-semibold shadow-xs'
                : 'bg-white/40 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 mb-0.5">Step 3</div>
              <span>3. Plate & Variance Calc</span>
            </div>
            <div className={`p-3.5 rounded-xl border transition-all duration-150 ${
              simulationStep >= 4
                ? 'bg-white dark:bg-slate-800 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-semibold shadow-xs'
                : 'bg-white/40 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 mb-0.5">Step 4</div>
              <span>4. Vendor SLA Drafting</span>
            </div>
          </div>
        </div>
      )}

      {/* Non-Destructive Side-by-Side Diff Preview Card */}
      {activeProposal && (
        <div className="glass-widget border-2 border-indigo-500/80 rounded-2xl shadow-xl overflow-hidden animate-blur-in">
          {/* Header Action Bar */}
          <div className="bg-indigo-600 dark:bg-indigo-600/90 text-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 font-semibold">
                  Proposal Staged
                </span>
                <span className="text-xs font-semibold text-indigo-100">
                  Gemini 2.5 Flash • {activeProposal.confidenceScore}% Confidence
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-white mt-1">
                Scenario Preview: {activeProposal.scenarioName}
              </h3>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDiscardProposal}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all duration-150 active:scale-95"
              >
                Discard Preview
              </button>
              <button
                onClick={handleApplyProposal}
                className="px-4 py-2 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold shadow-md transition-all duration-150 active:scale-95"
              >
                Apply Scenario to Master Plan
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* 4 Comparative Metric Split Cards with Staggered Cascading Blur Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Budget Total Variance */}
              <div className="p-4 rounded-xl glass-widget stagger-1 animate-blur-in">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Forecast Variance
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(activeProposal.proposedBudgetTotal, currency)}
                  </span>
                  <span className={`text-xs font-mono font-bold ${
                    activeProposal.budgetVariance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
                  }`}>
                    {activeProposal.budgetVariance > 0 ? '+' : ''}
                    {formatCurrency(activeProposal.budgetVariance, currency)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Baseline: {formatCurrency(activeProposal.baselineBudgetTotal, currency)}
                </span>
              </div>

              {/* Timeline Shifts */}
              <div className="p-4 rounded-xl glass-widget stagger-2 animate-blur-in">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Timeline Schedule Shifts
                </span>
                <div className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {activeProposal.timelineShiftsCount} Milestones
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Sequential buffer auto-propagated
                </span>
              </div>

              {/* Vendor Action Alerts */}
              <div className="p-4 rounded-xl glass-widget stagger-3 animate-blur-in">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Vendor Directives Drafted
                </span>
                <div className="mt-1 text-xl font-bold font-mono text-amber-700 dark:text-amber-400">
                  {activeProposal.vendorAlertsCount} Notices
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Ready for instant WhatsApp dispatch
                </span>
              </div>

              {/* Weather / Venue Contingency */}
              <div className="p-4 rounded-xl glass-widget stagger-4 animate-blur-in">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Venue State
                </span>
                <div className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {activeProposal.proposedPlan.venue.isRainSheltered ? 'Sheltered' : 'Standard'}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Weather: {activeProposal.proposedPlan.weatherCondition}
                </span>
              </div>
            </div>

            {/* AI Cross-Functional Fixes List */}
            <div className="p-4 rounded-xl glass-widget space-y-2 animate-blur-in delay-150">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                Key Adjustments In This Proposal
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {activeProposal.summaryBulletPoints.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                    <span className="text-slate-700 dark:text-slate-300">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side-by-Side Before vs After Category Preview */}
            <div className="space-y-3 glass-widget p-4 rounded-xl animate-blur-in delay-200">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Side-by-Side Budget Category Comparison
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Baseline Target</th>
                      <th className="py-2.5 px-3">Proposed Actual</th>
                      <th className="py-2.5 px-3">Delta</th>
                      <th className="py-2.5 px-3">AI Cost Saving & Offset Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeProposal.proposedPlan.budgetCategories.map((cat) => {
                      const baseCat = currentPlan.budgetCategories.find((c) => c.id === cat.id);
                      const baseVal = baseCat ? baseCat.estimatedActual : cat.allocated;
                      const delta = cat.estimatedActual - baseVal;

                      return (
                        <tr key={cat.id} className={delta !== 0 ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''}>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                            {cat.category}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                            {formatCurrency(baseVal, currency)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                            {formatCurrency(cat.estimatedActual, currency)}
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            {delta !== 0 ? (
                              <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                                delta > 0
                                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                              }`}>
                                {delta > 0 ? '+' : ''}{formatCurrency(delta, currency)}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px] max-w-sm">
                            {cat.aiCostSavingTip || cat.aiSavingTip || 'Baseline nominal rate maintained.'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions Confirmation */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleDiscardProposal}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all duration-150 active:scale-[0.98]"
              >
                Discard Staged Preview
              </button>
              <button
                onClick={handleApplyProposal}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 dark:shadow-none transition-all duration-150 active:scale-[0.98]"
              >
                Apply Scenario to Master Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Palette,
  UtensilsCrossed,
  Sparkles,
  Leaf,
  Plus,
  Smile,
  CheckCircle2
} from 'lucide-react';
import { EventPlan } from '../../types/event';
import { formatCurrency } from '../../services/currency';

interface IdeationTabProps {
  eventPlan: EventPlan;
  onAddConcept: (type: 'decor' | 'menu' | 'activity' | 'sustainability') => void;
}

export const IdeationTab: React.FC<IdeationTabProps> = ({ eventPlan, onAddConcept }) => {
  const [subTab, setSubTab] = useState<'decor' | 'menu' | 'engagement' | 'sustainability'>('decor');

  const { decorMoodboard, dietaryMenu, guestEngagement, sustainabilitySwaps } = eventPlan.ideation;

  return (
    <div className="space-y-6 view-enter">
      {/* Top Header & Sub-tab Navigation */}
      <div className="p-5 sm:p-6 glass-widget rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 stagger-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-xs">
            <Sparkles className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Personalized Themes, Decor & Menu Ideator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cultural & modern fusion aesthetics, dietary culinary pairings, and circular sustainability swaps
            </p>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex flex-wrap items-center bg-white/50 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 rounded-xl p-1 text-xs font-semibold text-slate-600 dark:text-slate-300 self-start sm:self-center">
          <button
            onClick={() => setSubTab('decor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
              subTab === 'decor'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
            <span>Decor ({decorMoodboard.length})</span>
          </button>
          <button
            onClick={() => setSubTab('menu')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
              subTab === 'menu'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
            <span>Menu ({dietaryMenu.length})</span>
          </button>
          <button
            onClick={() => setSubTab('engagement')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
              subTab === 'engagement'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" strokeWidth={1.75} />
            <span>Activities ({guestEngagement.length})</span>
          </button>
          <button
            onClick={() => setSubTab('sustainability')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
              subTab === 'sustainability'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
            <span>Eco Swaps ({sustainabilitySwaps.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DECOR MOODBOARD */}
      {subTab === 'decor' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Aesthetic Concepts & Palette Harmonies ({decorMoodboard.length})
            </span>
            <button
              onClick={() => onAddConcept('decor')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-all duration-150 active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Ask AI for New Palette</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {decorMoodboard.map((concept, index) => (
              <div
                key={concept.id}
                className={`glass-widget rounded-2xl p-5 sm:p-6 space-y-3.5 transition-all duration-200 shadow-sm stagger-${Math.min(index + 1, 4)} ${
                  concept.wasUpdated
                    ? 'border-indigo-300/80 dark:border-indigo-800/80 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {concept.title}
                      </h4>
                      {concept.wasUpdated && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                          UPDATED BY AI
                        </span>
                      )}
                      {concept.changeReason && (
                        <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          {concept.changeReason}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                      Vibe: {concept.vibe}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono shrink-0">
                    {concept.costImpact}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {concept.description}
                </p>

                {/* Color Swatch Bars */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                    Curated Palette:
                  </span>
                  <div className="flex items-center gap-2">
                    {concept.colorHexes.map((hex, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full h-8 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-xs"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {concept.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DIETARY MENU */}
      {subTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Dietary-Aware Menu Highlights ({dietaryMenu.length} Signature Courses)
            </span>
            <button
              onClick={() => onAddConcept('menu')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-all duration-150 active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Generate AI Course Pairing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {dietaryMenu.map((item, index) => (
              <div
                key={item.id}
                className={`glass-widget rounded-2xl p-5 sm:p-6 space-y-3 transition-all duration-200 shadow-sm stagger-${Math.min(index + 1, 4)} ${
                  item.wasUpdated
                    ? 'border-indigo-300/80 dark:border-indigo-800/80 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {item.course}
                      </span>
                      {item.wasUpdated && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                          UPDATED BY AI
                        </span>
                      )}
                      {item.changeReason && (
                        <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          {item.changeReason}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">{item.dish}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.costPerHead, eventPlan.currency)}
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">/ guest</span>
                  </div>
                </div>

                {/* Dietary Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.dietary.map((d, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                      <span>{d}</span>
                    </span>
                  ))}
                </div>

                {/* AI Pairing Notes */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">Chef & Sommelier Pairing:</strong>{' '}
                    {item.aiPairingNotes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GUEST ENGAGEMENT */}
      {subTab === 'engagement' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Crowd Engagement & Memorable Moments ({guestEngagement.length})
            </span>
            <button
              onClick={() => onAddConcept('activity')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-all duration-150 active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Add Guest Experience</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {guestEngagement.map((act, index) => (
              <div
                key={act.id}
                className={`glass-widget rounded-2xl p-5 sm:p-6 space-y-3 flex flex-col justify-between shadow-sm transition-all duration-200 stagger-${Math.min(index + 1, 4)} ${
                  act.wasUpdated
                    ? 'border-indigo-300/80 dark:border-indigo-800/80 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{act.duration}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      Score: {act.engagementScore}/100
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-2">{act.activity}</h4>
                  {act.wasUpdated && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mt-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                      UPDATED BY AI
                    </span>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{act.notes}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div>Audience: <strong className="text-slate-700 dark:text-slate-200 font-medium">{act.targetAudience}</strong></div>
                  <div>Cost Impact: <strong className="text-slate-800 dark:text-slate-200 font-medium">{act.costImpact}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SUSTAINABILITY SWAPS */}
      {subTab === 'sustainability' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Circular Economy & Sustainability Swaps ({sustainabilitySwaps.length})
            </span>
            <button
              onClick={() => onAddConcept('sustainability')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-all duration-150 active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Propose Eco Swap</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {sustainabilitySwaps.map((swap, index) => (
              <div
                key={swap.id}
                className={`glass-widget rounded-2xl p-5 sm:p-6 space-y-3.5 transition-all duration-200 shadow-sm stagger-${Math.min(index + 1, 4)} ${
                  swap.wasUpdated
                    ? 'border-indigo-300/80 dark:border-indigo-800/80 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {swap.status}
                    </span>
                    {swap.wasUpdated && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                        UPDATED BY AI
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                    {swap.costDelta}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium uppercase tracking-wider">
                      Standard Practice
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 block line-through">{swap.standardItem}</span>
                  </div>

                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl space-y-1">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-semibold uppercase tracking-wider">
                      Eco-Smart Alternative
                    </span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium block">{swap.ecoSwap}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                    <Leaf className="w-3.5 h-3.5" strokeWidth={1.75} /> Offset
                  </span>
                  <strong className="text-slate-800 dark:text-slate-200 font-mono">{swap.co2Saved}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

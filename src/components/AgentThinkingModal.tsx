import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, CheckCircle2, Clock, GitFork, Calculator, CalendarClock, MessageSquareText } from 'lucide-react';

interface AgentThinkingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  triggerName: string;
  isGeminiLive: boolean;
}

const STEPS = [
  { label: '1. Analyzing dependency graph & constraint propagation...', icon: GitFork },
  { label: '2. Recalculating per-plate & tenting budget allocations...', icon: Calculator },
  { label: '3. Shifting Run-of-Show timestamps & resolving conflicts...', icon: CalendarClock },
  { label: '4. Drafting vendor change orders & personalized outreach...', icon: MessageSquareText },
];

export const AgentThinkingModal: React.FC<AgentThinkingModalProps> = ({
  isOpen,
  onComplete,
  triggerName,
  isGeminiLive,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    // Step progression across ~900ms - 1000ms
    const stepInterval = 230; // 230ms * 4 ≈ 920ms
    const timer1 = setTimeout(() => setCurrentStepIndex(1), stepInterval * 1);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), stepInterval * 2);
    const timer3 = setTimeout(() => setCurrentStepIndex(3), stepInterval * 3);
    const timer4 = setTimeout(() => {
      setCurrentStepIndex(4);
      setTimeout(() => {
        onComplete();
      }, 150);
    }, stepInterval * 4);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((currentStepIndex / 4) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl shadow-2xl p-6 overflow-hidden animate-blur-in">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Agent Reasoning Engine
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-mono">
                {isGeminiLive ? 'Gemini 2.5 Flash Live' : 'Deterministic Judge Demo Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Propagating disruption ripples: <strong className="text-slate-800 dark:text-slate-200">{triggerName}</strong>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="py-4 space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
            <span>Dynamic Ripple Synthesis</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 4 Step Animation List */}
        <div className="space-y-2 py-1">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                    : isCurrent
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 shadow-sm'
                    : 'bg-white/40 dark:bg-slate-850/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isDone
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : isCurrent
                      ? 'bg-indigo-600 text-white animate-spin'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 font-medium">
                  {step.label}
                </div>

                {isDone && (
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Synced
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                    Computing...
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

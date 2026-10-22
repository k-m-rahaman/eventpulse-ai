import React from 'react';
import {
  Sparkles,
  Key,
  Printer,
  Crown,
  PartyPopper,
  Users2,
  Plus,
  Terminal,
  Activity
} from 'lucide-react';
import { CurrencyType, EventPlan } from '../types/event';
import { CURRENCY_SYMBOLS } from '../services/currency';
import { GeminiConfig } from '../services/gemini';

interface NavbarProps {
  currentPlan: EventPlan;
  onSelectPreset: (presetKey: 'wedding' | 'birthday' | 'fest') => void;
  currency: CurrencyType;
  onChangeCurrency: (curr: CurrencyType) => void;
  onOpenApiKeyModal: () => void;
  onOpenExportModal: () => void;
  onOpenIntakeModal: () => void;
  onOpenPromptSchemaDrawer: () => void;
  geminiConfig: GeminiConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPlan,
  onSelectPreset,
  currency,
  onChangeCurrency,
  onOpenApiKeyModal,
  onOpenExportModal,
  onOpenIntakeModal,
  onOpenPromptSchemaDrawer,
  geminiConfig,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-slate-200 px-4 lg:px-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-3">
        {/* Left Section: Logo + Presets + New Custom Event */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">
                EventPulse <span className="text-indigo-600">AI</span>
              </span>
              <span className="hidden xl:inline text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                SaaS OS
              </span>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Segmented Preset Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => onSelectPreset('wedding')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                currentPlan.type === 'wedding'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Royal Wedding</span>
            </button>

            <button
              onClick={() => onSelectPreset('birthday')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                currentPlan.type === 'birthday'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5 text-pink-600" />
              <span>30th Birthday</span>
            </button>

            <button
              onClick={() => onSelectPreset('fest')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                currentPlan.type === 'fest'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Community Fest</span>
            </button>
          </div>

          {/* + New Custom Event button */}
          <button
            onClick={onOpenIntakeModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Custom Event</span>
          </button>
        </div>

        {/* Right Section: Currency + Prompt/Schema + Gemini Key + Export */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
            {(['INR', 'USD', 'EUR'] as CurrencyType[]).map((c) => (
              <button
                key={c}
                onClick={() => onChangeCurrency(c)}
                className={`px-2 py-1 rounded-md transition ${
                  currency === c
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {CURRENCY_SYMBOLS[c]} {c}
              </button>
            ))}
          </div>

          {/* Prompt & Schema Inspector Button */}
          <button
            onClick={onOpenPromptSchemaDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-sm transition"
            title="Inspect 3-Layer System Prompt, Dependency Graph & Live JSON Schema"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Prompt & Schema</span>
          </button>

          {/* Gemini API Key Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition ${
              geminiConfig.apiKey
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
            title="Configure Google Gemini 2.5 Flash API Key or Fallback Mode"
          >
            <Key className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Gemini 2.5 Flash</span>
            <span
              className={`w-2 h-2 rounded-full ${
                geminiConfig.apiKey ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Export / Print Button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};

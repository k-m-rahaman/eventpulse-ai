import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Wallet,
  Clock,
  Users,
  Building,
  Zap,
  Palette,
  Search,
  Key,
  Printer,
  ChevronLeft,
  ChevronRight,
  Plus,
  Moon,
  Sun,
  Home,
  Crown,
  PartyPopper,
  Users2,
  Terminal,
  Activity,
  DollarSign
} from 'lucide-react';
import { EventPlan, CurrencyType } from '../types/event';
import { CURRENCY_SYMBOLS } from '../services/currency';
import { GeminiConfig } from '../services/gemini';

export type WorkspaceTab =
  | 'overview'
  | 'budget'
  | 'timeline'
  | 'guests'
  | 'vendors'
  | 'scenario-studio'
  | 'ideation';

interface AppShellProps {
  currentPlan: EventPlan;
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  onSelectPreset: (presetKey: 'wedding' | 'birthday' | 'fest') => void;
  currency: CurrencyType;
  onChangeCurrency: (curr: CurrencyType) => void;
  onOpenApiKeyModal: () => void;
  onOpenExportModal: () => void;
  onOpenIntakeModal: () => void;
  onOpenPromptSchemaDrawer: () => void;
  onOpenCommandPalette: () => void;
  onGoToLanding: () => void;
  geminiConfig: GeminiConfig;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPlan,
  activeTab,
  onSelectTab,
  onSelectPreset,
  currency,
  onChangeCurrency,
  onOpenApiKeyModal,
  onOpenExportModal,
  onOpenIntakeModal,
  onOpenPromptSchemaDrawer,
  onOpenCommandPalette,
  onGoToLanding,
  geminiConfig,
  isDarkMode,
  onToggleTheme,
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Preset Theme Tinting indicator
  const getPresetTintClass = () => {
    if (currentPlan.type === 'wedding') {
      return 'border-l-4 border-l-amber-500 bg-amber-50/20';
    } else if (currentPlan.type === 'birthday') {
      return 'border-l-4 border-l-pink-500 bg-pink-50/20';
    } else {
      return 'border-l-4 border-l-emerald-500 bg-emerald-50/20';
    }
  };

  const navItems = [
    {
      id: 'overview' as WorkspaceTab,
      label: 'Command Center',
      sublabel: 'Health & Bento Grid',
      icon: <LayoutDashboard className="w-4 h-4" strokeWidth={1.75} />,
    },
    {
      id: 'budget' as WorkspaceTab,
      label: 'Budget & Forecaster',
      sublabel: 'Dynamic Overruns',
      icon: <Wallet className="w-4 h-4" strokeWidth={1.75} />,
      badge: currentPlan.budgetCategories.length,
    },
    {
      id: 'timeline' as WorkspaceTab,
      label: 'Timeline & Run-of-Show',
      sublabel: 'Cascading Milestones',
      icon: <Clock className="w-4 h-4" strokeWidth={1.75} />,
      badge: currentPlan.timelineNodes.length,
    },
    {
      id: 'guests' as WorkspaceTab,
      label: 'Guests & Dietary Matrix',
      sublabel: 'RSVPs & Allergies',
      icon: <Users className="w-4 h-4" strokeWidth={1.75} />,
      badge: currentPlan.guests ? currentPlan.guests.length : currentPlan.guestCount,
    },
    {
      id: 'vendors' as WorkspaceTab,
      label: 'Vendors & SLA Hub',
      sublabel: 'Directives & Contracts',
      icon: <Building className="w-4 h-4" strokeWidth={1.75} />,
      badge: currentPlan.vendors.length,
    },
    {
      id: 'scenario-studio' as WorkspaceTab,
      label: 'AI Scenario Studio',
      sublabel: 'Non-Destructive Diff',
      icon: <Zap className="w-4 h-4" strokeWidth={1.75} />,
      special: true,
    },
    {
      id: 'ideation' as WorkspaceTab,
      label: 'Curated Creative Studio',
      sublabel: 'Palettes & Menu',
      icon: <Palette className="w-4 h-4" strokeWidth={1.75} />,
      badge: currentPlan.ideation.decorMoodboard.length + currentPlan.ideation.dietaryMenu.length,
    },
  ];

  const getTabBreadcrumbLabel = (tab: WorkspaceTab) => {
    const item = navItems.find((n) => n.id === tab);
    return item ? item.label : 'Workspace';
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark text-slate-100' : 'text-slate-900'} antialiased font-sans relative bg-transparent`}>
      {/* Collapsible Left Navigation Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col glass-panel transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Brand & App Title */}
        <div className="h-16 px-4 border-b border-white/60 dark:border-slate-800/80 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white block">
                  EventPulse <span className="text-indigo-600 dark:text-indigo-400">AI</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  Project AURA OS
                </span>
              </div>
            </div>
          )}

          {isSidebarCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition hidden sm:block active:scale-95"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Preset Selector Card */}
        {!isSidebarCollapsed ? (
          <div className="p-3 border-b border-white/60 dark:border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5 px-1">
              Active Plan Preset
            </span>
            <div className="space-y-1">
              <button
                onClick={() => onSelectPreset('wedding')}
                className={`w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  currentPlan.type === 'wedding'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 shadow-xs'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" strokeWidth={1.75} />
                <div className="truncate flex-1">
                  <div className="truncate">Royal Wedding</div>
                  <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400 font-mono">250 Pax • ₹15L</div>
                </div>
              </button>

              <button
                onClick={() => onSelectPreset('birthday')}
                className={`w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  currentPlan.type === 'birthday'
                    ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-900 dark:text-pink-200 border border-pink-200 dark:border-pink-800/60 shadow-xs'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <PartyPopper className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 flex-shrink-0" strokeWidth={1.75} />
                <div className="truncate flex-1">
                  <div className="truncate">30th Birthday Gala</div>
                  <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400 font-mono">80 Pax • ₹1.5L</div>
                </div>
              </button>

              <button
                onClick={() => onSelectPreset('fest')}
                className={`w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  currentPlan.type === 'fest'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60 shadow-xs'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Users2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" strokeWidth={1.75} />
                <div className="truncate flex-1">
                  <div className="truncate">Community Fest</div>
                  <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400 font-mono">500 Pax • ₹3L</div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2 border-b border-slate-200/60 dark:border-slate-800/70 flex flex-col items-center gap-2">
            <button
              onClick={() => onSelectPreset('wedding')}
              title="Royal Heritage Wedding (Preset A)"
              className={`p-2 rounded-lg ${currentPlan.type === 'wedding' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </button>
            <button
              onClick={() => onSelectPreset('birthday')}
              title="30th Birthday Gala (Preset B)"
              className={`p-2 rounded-lg ${currentPlan.type === 'birthday' ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-900 dark:text-pink-200' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <PartyPopper className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            </button>
            <button
              onClick={() => onSelectPreset('fest')}
              title="Community Fest (Preset C)"
              className={`p-2 rounded-lg ${currentPlan.type === 'fest' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Users2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>
          </div>
        )}

        {/* Main Navigation Items */}
        <nav className="flex-1 p-2 sm:p-3 space-y-1 overflow-y-auto">
          {!isSidebarCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1 px-2">
              Workspace Modules
            </span>
          )}

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? item.special
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold border border-indigo-100 dark:border-indigo-800/50'
                    : item.special
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive && !item.special ? 'text-indigo-600 dark:text-indigo-400' : ''}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <div className="truncate text-left">
                      <span className="block truncate">{item.label}</span>
                      <span className={`block text-[10px] font-normal truncate ${
                        isActive ? (item.special ? 'text-indigo-200' : 'text-indigo-600/80 dark:text-indigo-400') : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {item.sublabel}
                      </span>
                    </div>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Sidebar Action Center */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/70 space-y-1.5">
          {/* Global Command Palette trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="w-full py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-between transition"
            title="Open Command Palette (⌘K / Ctrl+K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" strokeWidth={1.75} />
              {!isSidebarCollapsed && <span>Command Palette</span>}
            </div>
            {!isSidebarCollapsed && (
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-xs">
                ⌘K
              </kbd>
            )}
          </button>

          {/* New Custom Event Button */}
          <button
            onClick={onOpenIntakeModal}
            className="w-full py-2 px-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
            {!isSidebarCollapsed && <span>New Custom Plan</span>}
          </button>

          {/* Back to Public Landing Page */}
          <button
            onClick={onGoToLanding}
            className="w-full py-1.5 px-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-medium flex items-center justify-center gap-1.5 transition"
            title="Return to Product Launch Page"
          >
            <Home className="w-3.5 h-3.5" strokeWidth={1.75} />
            {!isSidebarCollapsed && <span>Public Landing Page</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'pl-16' : 'pl-64'
      }`}>
        {/* Contextual Sticky Top Bar */}
        <header className="sticky top-0 z-20 h-16 glass-panel px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Breadcrumb Trail & Event Title */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
            <span className="font-semibold text-slate-800 dark:text-slate-200">EventPulse</span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px] sm:max-w-xs font-medium">
              {currentPlan.name}
            </span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {getTabBreadcrumbLabel(activeTab)}
            </span>
          </div>

          {/* Right Action Utilities - Sleek Single-Line h-9 Frosted Glass Pills */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Currency selector */}
            <div className="flex items-center h-9 glass-pill p-0.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
              {(['INR', 'USD', 'EUR'] as CurrencyType[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onChangeCurrency(c)}
                  className={`h-full px-2.5 rounded-lg flex items-center transition active:scale-95 ${
                    currency === c
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {CURRENCY_SYMBOLS[c]} {c}
                </button>
              ))}
            </div>

            {/* Prompt & Schema Inspector */}
            <button
              onClick={onOpenPromptSchemaDrawer}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 h-9 rounded-xl glass-pill text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition active:scale-95 whitespace-nowrap"
              title="Inspect 3-Layer System Prompt & Live JSON Schema"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Prompt & Schema</span>
            </button>

            {/* Gemini API Key status */}
            <button
              onClick={onOpenApiKeyModal}
              className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border backdrop-blur-md text-xs font-semibold shadow-xs transition active:scale-95 whitespace-nowrap ${
                geminiConfig.apiKey
                  ? 'border-emerald-300/80 dark:border-emerald-800/70 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40'
                  : 'glass-pill text-slate-700 dark:text-slate-200'
              }`}
              title="Gemini 2.5 Flash API Key / Fallback Mode"
            >
              <Key className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Gemini 2.5 Flash</span>
              <span className={`w-2 h-2 rounded-full ${geminiConfig.apiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            </button>

            {/* Theme Switcher */}
            <button
              onClick={onToggleTheme}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl glass-pill text-slate-600 dark:text-slate-300 transition shadow-xs flex-shrink-0 active:scale-95"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Export / Print Button */}
            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-xl bg-slate-900/90 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition active:scale-95 whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Export</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* SaaS Footer */}
        <footer className="glass-panel py-4 px-6 text-xs text-slate-500 dark:text-slate-400 mt-auto border-t border-white/60 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">EventPulse AI</span>
              <span>— Project AURA Autonomous Event OS</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Dual-Engine Gemini 2.5 Flash</span>
              <span>•</span>
              <span>Unified Master JSON Reactive Graph</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

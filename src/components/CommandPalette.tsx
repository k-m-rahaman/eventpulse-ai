import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  Wallet,
  Clock,
  Users,
  Building,
  Zap,
  Sparkles,
  FileText,
  Key,
  DollarSign,
  Moon,
  Sun,
  Home,
  CloudRain,
  UserPlus,
  Scissors,
  Hourglass,
  Music,
  Salad,
  MoonStar,
  ZapOff,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { CurrencyType } from '../types/event';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'overview' | 'budget' | 'timeline' | 'guests' | 'vendors' | 'scenario-studio' | 'ideation') => void;
  onSelectPreset: (preset: 'wedding' | 'birthday' | 'fest') => void;
  onTriggerScenario: (scenarioPrompt: string) => void;
  onOpenApiKey: () => void;
  onOpenExport: () => void;
  onToggleCurrency: () => void;
  onToggleTheme: () => void;
  onGoToLanding: () => void;
  currentCurrency: CurrencyType;
  isDarkMode: boolean;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Presets' | 'Scenarios' | 'Actions';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectPreset,
  onTriggerScenario,
  onOpenApiKey,
  onOpenExport,
  onToggleCurrency,
  onToggleTheme,
  onGoToLanding,
  currentCurrency,
  isDarkMode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Navigation
    {
      id: 'nav-overview',
      title: 'Command Center Overview',
      subtitle: 'Contextual health, 4 KPIs, bento grid and next-best actions',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onNavigateTab('overview'); onClose(); }
    },
    {
      id: 'nav-budget',
      title: 'Budget & Overrun Forecaster',
      subtitle: 'Dynamic variance, per-plate breakdown and cost-saving tips',
      category: 'Navigation',
      icon: <Wallet className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onNavigateTab('budget'); onClose(); }
    },
    {
      id: 'nav-timeline',
      title: 'Timeline & Day-of Run of Show',
      subtitle: 'Linked milestone dependencies and cascading delay buffers',
      category: 'Navigation',
      icon: <Clock className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onNavigateTab('timeline'); onClose(); }
    },
    {
      id: 'nav-guests',
      title: 'Guests & RSVP Dietary Matrix',
      subtitle: 'Cohorts, VIP table assignments, and catering impact',
      category: 'Navigation',
      icon: <Users className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onNavigateTab('guests'); onClose(); }
    },
    {
      id: 'nav-vendors',
      title: 'Vendor SLAs & Outreach Hub',
      subtitle: 'Contract milestones and automated WhatsApp/email change notices',
      category: 'Navigation',
      icon: <Building className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onNavigateTab('vendors'); onClose(); }
    },
    {
      id: 'nav-scenarios',
      title: 'AI Scenario Studio',
      subtitle: 'Non-destructive what-if simulation, causal chain and diff preview',
      category: 'Navigation',
      icon: <Zap className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onNavigateTab('scenario-studio'); onClose(); }
    },
    {
      id: 'nav-ideation',
      title: 'Creative Studio & Menu Ideator',
      subtitle: 'Moodboard palettes, culinary pairings, and eco-swaps',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onNavigateTab('ideation'); onClose(); }
    },

    // Presets
    {
      id: 'preset-wedding',
      title: 'Switch to Royal Heritage Wedding',
      subtitle: 'Preset A • 250 Guests, ₹15,00,000, Chunda Palace Udaipur',
      category: 'Presets',
      icon: <Building className="w-4 h-4 text-amber-600" strokeWidth={1.75} />,
      action: () => { onSelectPreset('wedding'); onClose(); }
    },
    {
      id: 'preset-birthday',
      title: 'Switch to Milestone 30th Birthday Gala',
      subtitle: 'Preset B • 80 Guests, ₹1,50,000, Aer Rooftop Mumbai',
      category: 'Presets',
      icon: <Sparkles className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onSelectPreset('birthday'); onClose(); }
    },
    {
      id: 'preset-fest',
      title: 'Switch to Cultural & Tech Community Fest',
      subtitle: 'Preset C • 500 Guests, ₹3,00,000, Koramangala Grounds',
      category: 'Presets',
      icon: <Users className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />,
      action: () => { onSelectPreset('fest'); onClose(); }
    },

    // Scenarios
    {
      id: 'sc-rain',
      title: 'Simulate: Sudden Rain Move Indoors',
      subtitle: 'Shift outdoor mandap/stage indoors, tenting, sound waterproofing',
      category: 'Scenarios',
      icon: <CloudRain className="w-4 h-4 text-blue-600" strokeWidth={1.75} />,
      action: () => { onTriggerScenario('Sudden unseasonal rain forces outdoor event indoors with waterproof tenting.'); onClose(); }
    },
    {
      id: 'sc-guests',
      title: 'Simulate: +50 Late Guests Added',
      subtitle: 'Expand catering headcount, recalculate plate budget, add tables',
      category: 'Scenarios',
      icon: <UserPlus className="w-4 h-4 text-violet-600" strokeWidth={1.75} />,
      action: () => { onTriggerScenario('Guest count unexpectedly increased by 50 attendees 48 hours before the event.'); onClose(); }
    },
    {
      id: 'sc-budget',
      title: 'Simulate: 15% Budget Cut',
      subtitle: 'Trim non-critical decor and optimize catering plates to offset spend',
      category: 'Scenarios',
      icon: <Scissors className="w-4 h-4 text-rose-600" strokeWidth={1.75} />,
      action: () => { onTriggerScenario('Immediate 15% overall budget reduction required across discretionary categories.'); onClose(); }
    },
    {
      id: 'sc-caterer',
      title: 'Simulate: Caterer Delayed by 45 Mins',
      subtitle: 'Shift banquet timing, insert cocktail buffer, notify guests & staff',
      category: 'Scenarios',
      icon: <Hourglass className="w-4 h-4 text-amber-600" strokeWidth={1.75} />,
      action: () => { onTriggerScenario('Catering truck delayed by 45 minutes on the highway on day of event.'); onClose(); }
    },
    {
      id: 'sc-performer',
      title: 'Simulate: Celebrity Performer Added',
      subtitle: 'Add VIP technical rider, monitor mixing console & backstage security',
      category: 'Scenarios',
      icon: <Music className="w-4 h-4 text-purple-600" strokeWidth={1.75} />,
      action: () => { onTriggerScenario('Celebrity guest performer confirmed with custom sound rider and green room hospitality.'); onClose(); }
    },
    {
      id: 'sc-dietary',
      title: 'Simulate: 40% Dietary Transition to Vegan/Jain',
      subtitle: 'Restructure banquet kitchen line, avoid root vegetables & dairy',
      category: 'Scenarios',
      icon: <Salad className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />,
      action: () => { onTriggerScenario('40% of confirmed guests transition to strict vegan and Jain meal requirements.'); onClose(); }
    },
    {
      id: 'sc-curfew',
      title: 'Simulate: 2-Hour Evening Extension Permit',
      subtitle: 'Extend venue rental, pay DJ overtime fee, secure local sound permit',
      category: 'Scenarios',
      icon: <MoonStar className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onTriggerScenario('Host requests a 2-hour late-night venue and acoustic permit extension.'); onClose(); }
    },
    {
      id: 'sc-power',
      title: 'Simulate: Emergency Generator Power Outage',
      subtitle: 'Activate dual genset backup, switch to acoustic fallback lighting',
      category: 'Scenarios',
      icon: <ZapOff className="w-4 h-4 text-amber-600" strokeWidth={1.75} />,
      action: () => { onTriggerScenario('Primary venue power grid failure requiring emergency genset deployment.'); onClose(); }
    },

    // Actions
    {
      id: 'act-export',
      title: 'Export Plan (Print Run-of-Show / JSON)',
      subtitle: 'Generate printable day-of schedules or backup JSON state',
      category: 'Actions',
      icon: <FileText className="w-4 h-4 text-slate-600" strokeWidth={1.75} />,
      action: () => { onOpenExport(); onClose(); }
    },
    {
      id: 'act-api',
      title: 'Configure Gemini API Key & Model',
      subtitle: 'Paste Gemini 2.5 Flash key or toggle smart demo fallback',
      category: 'Actions',
      icon: <Key className="w-4 h-4 text-slate-600" strokeWidth={1.75} />,
      action: () => { onOpenApiKey(); onClose(); }
    },
    {
      id: 'act-currency',
      title: `Toggle Currency (Current: ${currentCurrency})`,
      subtitle: 'Cycle through INR (₹), USD ($), and EUR (€)',
      category: 'Actions',
      icon: <DollarSign className="w-4 h-4 text-slate-600" strokeWidth={1.75} />,
      action: () => { onToggleCurrency(); onClose(); }
    },
    {
      id: 'act-theme',
      title: `Toggle Theme (Current: ${isDarkMode ? 'Dark' : 'Light'})`,
      subtitle: 'Switch between Project AURA daylight clean and dark slate',
      category: 'Actions',
      icon: isDarkMode ? <Sun className="w-4 h-4 text-amber-500" strokeWidth={1.75} /> : <Moon className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />,
      action: () => { onToggleTheme(); onClose(); }
    },
    {
      id: 'act-landing',
      title: 'Back to Product Launch Landing Page',
      subtitle: 'Return to public flagship overview and feature showcase',
      category: 'Actions',
      icon: <Home className="w-4 h-4 text-slate-600" strokeWidth={1.75} />,
      action: () => { onGoToLanding(); onClose(); }
    }
  ];

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden flex flex-col max-h-[80vh] animate-blur-in"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800 gap-3 bg-slate-50/70 dark:bg-slate-800/50">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search modules, switch presets, or trigger scenarios..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              No matching commands or actions found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" strokeWidth={1.75} />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↓</kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↵</kbd> Select
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            EventPulse AI • Project AURA
          </span>
        </div>
      </div>
    </div>
  );
};

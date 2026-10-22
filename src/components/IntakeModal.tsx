import React, { useState } from 'react';
import { X, Sparkles, Wand2, Calendar, Users, DollarSign, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { CurrencyType, IntakeParams } from '../types/event';
import { CURRENCY_SYMBOLS } from '../services/currency';

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: IntakeParams) => void;
  currency: CurrencyType;
  isProcessing: boolean;
}

export const IntakeModal: React.FC<IntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currency,
  isProcessing,
}) => {
  const [eventType, setEventType] = useState('wedding');
  const [eventTitle, setEventTitle] = useState('Royal Heritage Palace Wedding');
  const [guestCount, setGuestCount] = useState(200);
  const [totalBudget, setTotalBudget] = useState(1200000);
  const [venueStyle, setVenueStyle] = useState('Outdoor Palace Courtyard');
  const [specialRequirements, setSpecialRequirements] = useState(
    'Strict Jain catering options, rain contingency protocol, late night DJ afterparty, sustainable floral decor.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      eventType,
      eventTitle,
      guestCount: Number(guestCount),
      totalBudget: Number(totalBudget),
      currency,
      venueStyle,
      specialRequirements,
    });
  };

  const handleTemplateSelect = (type: string, title: string, guests: number, budget: number, venue: string, reqs: string) => {
    setEventType(type);
    setEventTitle(title);
    setGuestCount(guests);
    setTotalBudget(budget);
    setVenueStyle(venue);
    setSpecialRequirements(reqs);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col animate-blur-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Engine A: AI Plan Architect
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-mono">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Input your event requirements to generate a complete single-state operating plan with zero placeholders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Starters */}
        <div className="pt-3 pb-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
            Quick Starter Blueprints:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                handleTemplateSelect(
                  'wedding',
                  'Royal Palace Destination Wedding',
                  250,
                  1500000,
                  'Outdoor Palace Courtyard',
                  'Multi-stage rituals (Haldi, Baraat, Pheras), strict Jain counters, drone permits.'
                )
              }
              className="p-2.5 text-left bg-white/40 dark:bg-slate-850/40 hover:bg-white/70 dark:hover:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs transition"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">Royal Wedding</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">250 Pax • ₹15L • Palace</div>
            </button>
            <button
              type="button"
              onClick={() =>
                handleTemplateSelect(
                  'birthday',
                  'Neon Cyberpunk 30th Birthday Gala',
                  80,
                  180000,
                  'Skyline Rooftop Lounge',
                  'Deep house DJ, artisanal craft cocktail bar, 360-spin video booth, 2D comic cake.'
                )
              }
              className="p-2.5 text-left bg-white/40 dark:bg-slate-850/40 hover:bg-white/70 dark:hover:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs transition"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">30th Birthday Gala</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">80 Pax • ₹1.8L • Rooftop</div>
            </button>
            <button
              type="button"
              onClick={() =>
                handleTemplateSelect(
                  'fest',
                  'Tech Community & Cultural Maker Fest',
                  400,
                  300000,
                  'Open Amphitheatre Park',
                  '20 modular maker booths, student hackathon demos, indie acoustic stage, zero-waste composting.'
                )
              }
              className="p-2.5 text-left bg-white/40 dark:bg-slate-850/40 hover:bg-white/70 dark:hover:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs transition"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">Community Fest</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">400 Pax • ₹3L • Park</div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          {/* Row 1: Event Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Event Title
              </label>
              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
              >
                <option value="wedding">Wedding & Reception</option>
                <option value="birthday">Birthday Gala</option>
                <option value="fest">Community Fest</option>
                <option value="corporate">Corporate Summit</option>
                <option value="custom">Custom Celebration</option>
              </select>
            </div>
          </div>

          {/* Row 2: Headcount, Total Budget, Venue Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Guest Count
              </label>
              <input
                type="number"
                min={10}
                max={5000}
                required
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Total Budget ({CURRENCY_SYMBOLS[currency]})
              </label>
              <input
                type="number"
                min={10000}
                step={5000}
                required
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Venue Preference
              </label>
              <input
                type="text"
                required
                value={venueStyle}
                onChange={(e) => setVenueStyle(e.target.value)}
                placeholder="e.g. Outdoor Palace, Rooftop"
                className="w-full px-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Row 3: Special Requirements */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Special Requirements & Directives
            </label>
            <textarea
              rows={3}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="Allergies, dietary constraints, key milestones, entertainment requests, weather considerations..."
              className="w-full px-3.5 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 resize-none leading-relaxed"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm flex items-center gap-2 transition disabled:opacity-50 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Architect Event Plan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

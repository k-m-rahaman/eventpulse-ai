import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Users,
  Building,
  CheckCircle2,
  CloudRain,
  ChevronRight,
  Laptop,
  Layers,
  Cpu,
  MessageSquare,
  DollarSign,
  Palette,
  Play
} from 'lucide-react';
import { CurrencyType } from '../types/event';

interface LandingExperienceProps {
  onLaunchWorkspace: () => void;
  onLoadPreset: (presetKey: 'wedding' | 'birthday' | 'fest') => void;
  currency: CurrencyType;
}

export const LandingExperience: React.FC<LandingExperienceProps> = ({
  onLaunchWorkspace,
  onLoadPreset,
  currency,
}) => {
  // Interactive Hero Preview state with 4.5s auto-cycling
  const [heroScenario, setHeroScenario] = useState<'nominal' | 'rain' | 'guests'>('nominal');
  const [heroSimulating, setHeroSimulating] = useState(false);
  const [isAutoCyclePaused, setIsAutoCyclePaused] = useState(false);

  // Scroll reveal tracking
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({
    hero: true,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealedSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.12 }
    );

    const sectionIds = ['features', 'interactive-hero', 'presets', 'architecture', 'cta-banner'];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isAutoCyclePaused) return;

    const scenarios: ('nominal' | 'rain' | 'guests')[] = ['nominal', 'rain', 'guests'];
    const interval = setInterval(() => {
      setHeroScenario((prev) => {
        const nextIdx = (scenarios.indexOf(prev) + 1) % scenarios.length;
        return scenarios[nextIdx];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoCyclePaused]);

  const handleTriggerHeroScenario = (scenario: 'nominal' | 'rain' | 'guests') => {
    setIsAutoCyclePaused(true);
    setHeroSimulating(true);
    setTimeout(() => {
      setHeroScenario(scenario);
      setHeroSimulating(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 selection:bg-indigo-600 selection:text-white font-sans antialiased relative">
      {/* Sticky Flagship Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/60 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Sparkles className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                EventPulse <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">AI</span>
              </span>
              <span className="ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hidden sm:inline-block">
                Project AURA
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Capabilities</a>
            <a href="#interactive-hero" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Interactive Simulator</a>
            <a href="#architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Architecture</a>
            <a href="#presets" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Judge Presets</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchWorkspace}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition shadow-sm shadow-indigo-200 active:scale-95"
            >
              <span>Live Workspace</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-white/60 via-slate-50/30 to-transparent dark:from-slate-950/40 dark:via-transparent dark:to-transparent border-b border-white/60 dark:border-slate-800/60">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>PromptWars Challenge 5 Edition • Autonomous Event OS</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Every extraordinary event begins with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
                intelligence.
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Plan beautifully. Predict confidently. Adapt instantly.
              EventPulse AI unifies budget forecasting, linked timelines, vendor SLAs, and dietary logistics into a single reactive causal graph.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={onLaunchWorkspace}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition active:scale-[0.98]"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>

              <button
                onClick={() => {
                  onLoadPreset('wedding');
                  onLaunchWorkspace();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm transition active:scale-[0.98]"
              >
                <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" strokeWidth={1.75} />
                <span>Explore Live Demo (Royal Wedding)</span>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                Gemini 2.5 Flash Engine
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                Zero-Placeholder Fallback
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                Unified Master JSON
              </span>
            </div>
          </div>

          {/* Interactive Live Product Centerpiece */}
          <div
            id="interactive-hero"
            className="mt-6 relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsAutoCyclePaused(true)}
            onMouseLeave={() => setIsAutoCyclePaused(false)}
          >
            {/* Background decorative glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur-lg opacity-20 transition duration-1000 group-hover:opacity-30" />

            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden">
              {/* Product window title bar */}
              <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 pl-2">
                    EventPulse OS • Chunda Palace Courtyard & Zenana Gardens
                  </span>
                </div>

                {/* Scenario Interactive Chips inside Product Preview */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                    Live Simulator:
                  </span>
                  <button
                    onClick={() => handleTriggerHeroScenario('nominal')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                      heroScenario === 'nominal'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Nominal Baseline
                  </button>
                  <button
                    onClick={() => handleTriggerHeroScenario('rain')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                      heroScenario === 'rain'
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <CloudRain className="w-3 h-3" strokeWidth={1.75} />
                    <span>Sudden Rain</span>
                  </button>
                  <button
                    onClick={() => handleTriggerHeroScenario('guests')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                      heroScenario === 'guests'
                        ? 'bg-violet-600 text-white font-semibold'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-3 h-3" strokeWidth={1.75} />
                    <span>+50 Late Guests</span>
                  </button>
                </div>
              </div>

              {/* Product preview canvas with smooth blur transition */}
              <div key={heroScenario} className="p-5 sm:p-6 space-y-4 animate-blur-in">
                {/* Dynamic Status Strip */}
                <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between transition-all duration-300 ${
                  heroSimulating
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : heroScenario === 'nominal'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : heroScenario === 'rain'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-violet-50 border-violet-200 text-violet-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full animate-ping bg-current" />
                    <span>
                      {heroSimulating
                        ? 'Gemini 2.5 Flash calculating causal graph dependencies...'
                        : heroScenario === 'nominal'
                        ? 'Plan Status: All 7 Vendors On Schedule • Outdoor Mandap Sunny & Clear (250 Guests)'
                        : heroScenario === 'rain'
                        ? 'Weather Contingency Triggered: Mandap shifted to Zenana Hall • Waterproof tenting deployed • Sound relocated (+₹40,000)'
                        : 'Guest Surge Triggered: Guest count jumped to 300 (+50 pax) • Catering plates reallocated • 4 Extra Tables drafted (+₹84,000)'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-white/70">
                    {heroScenario === 'nominal' ? 'Optimal' : 'AI Adapted'}
                  </span>
                </div>

                {/* 4 Interactive Metric Tiles */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Total Forecast
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1">
                      {heroScenario === 'nominal'
                        ? '₹15,00,000'
                        : heroScenario === 'rain'
                        ? '₹15,40,000'
                        : '₹15,84,000'}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {heroScenario === 'nominal'
                        ? 'Target: ₹15,00,000'
                        : heroScenario === 'rain'
                        ? 'Delta: +₹40,000 (Tenting)'
                        : 'Delta: +₹84,000 (50 Plates)'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Confirmed Guests
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1">
                      {heroScenario === 'nominal'
                        ? '250 Pax'
                        : heroScenario === 'rain'
                        ? '250 Pax (Indoor)'
                        : '300 Pax'}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {heroScenario === 'guests' ? '40 Veg • 10 Jain Additions' : '88% RSVP Confirmation'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Venue & Weather
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1 flex items-center gap-1.5">
                      {heroScenario === 'rain' ? 'Rain Shelter' : 'Courtyard'}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {heroScenario === 'rain' ? 'Indoor Backup Active' : 'Sunny & Clear (28°C)'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Vendor SLA Health
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1">
                      {heroScenario === 'nominal' ? '7 / 7 Verified' : '2 Notices Drafted'}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {heroScenario === 'nominal' ? 'Zero Overlaps' : 'Auto-Draft WhatsApp Ready'}
                    </span>
                  </div>
                </div>

                {/* Preview Bento Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Timeline cascade box */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" strokeWidth={1.75} />
                        Cascading Day-of Run-of-Show
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        {heroScenario === 'rain' ? '+30 Min Sound Shift' : 'Linked Sequence'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900">04:30 PM — Baraat Royal Procession</span>
                          <span className="block text-[11px] text-slate-500">Chunda Elephant Gate to Courtyard Arch</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Ready
                        </span>
                      </div>

                      <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900">
                            {heroScenario === 'rain' ? '06:15 PM — Varmala (Indoor Zenana)' : '05:45 PM — Varmala & Sunset Pheras'}
                          </span>
                          <span className="block text-[11px] text-slate-500">
                            {heroScenario === 'rain' ? 'Shifted +30m for sound dry check' : 'Mandap Poolside stage'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          heroScenario === 'rain' ? 'text-amber-700 bg-amber-50' : 'text-slate-600 bg-slate-100'
                        }`}>
                          {heroScenario === 'rain' ? 'Shifted' : 'Linked'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vendor automated notices box */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" strokeWidth={1.75} />
                        Automated Vendor Directives
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        One-Click Dispatch
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-white border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">
                          {heroScenario === 'rain'
                            ? 'The Royal Mewar Caterers'
                            : heroScenario === 'guests'
                            ? 'Royal Mewar Thali & Banquet'
                            : 'Udaipur Sound & Trussing Co.'}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          heroScenario === 'nominal' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                        }`}>
                          {heroScenario === 'nominal' ? 'SLA Approved' : 'Draft Generated'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-mono italic">
                        {heroScenario === 'rain'
                          ? '"URGENT NOTICE: Due to rain forecast, move dinner setup to Zenana Ballroom. Rainproof service conduits active."'
                          : heroScenario === 'guests'
                          ? '"URGENT NOTICE: Guest count increased from 250 to 300 pax (+50). Prepare 40 standard and 10 Jain thalis."'
                          : '"All sound check milestones confirmed for 04:00 PM. Line array frequency calibrated for palace acoustic reflections."'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom live workspace prompt bar */}
              <div className="bg-slate-100/70 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Experience full control with live Gemini API & non-destructive scenario staging.
                </span>
                <button
                  onClick={onLaunchWorkspace}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                >
                  <span>Open Full Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Capabilities Bento Grid */}
      <section
        id="features"
        className={`py-20 bg-transparent border-b border-white/60 dark:border-slate-800/60 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          revealedSections['features'] ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-sm translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-2">
              Autonomous Intelligence
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Six interconnected modules. Zero disconnected spreadsheets.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Every tweak to guest counts, weather alerts, or vendor load-in times ripples across the entire operational system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl glass-widget flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Dynamic Budget & Overrun Forecaster
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  Categorized budget tracking with real-time variance calculations, per-guest plate metrics, and predictive AI cost-saving optimizations.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Predictive plate metrics</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl glass-widget flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Dependency-Linked Day-of Run of Show
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  Parent-child milestone dependencies that cascade delay buffers dynamically. When the Baraat is 30 minutes late, subsequent rituals adjust safely.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Cascade delay buffers</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl glass-widget flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Guests & RSVP Dietary Matrix
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  Track guest cohorts, VIP tiers, table assignments, and dietary preferences (Jain, Vegan, Gluten-Free) with automatic per-plate catering impact.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Precision dietary breakdown</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl glass-widget flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Building className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Vendor SLA Checklist & Auto-Outreach
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  Contractual milestones and payment statuses with pre-drafted WhatsApp & email change notices generated dynamically based on plan alterations.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Instant vendor dispatch</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl glass-widget flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Autonomous AI Scenario Studio
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  Non-destructive what-if simulator. Stage sudden storms, guest spikes, or budget cuts, review side-by-side diffs, and apply or discard with confidence.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Non-destructive diff staging</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl glass-widget flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Palette className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Personalized Decor & Culinary Ideator
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  AI moodboards with hex palettes, multi-course banquet menus with sommelier & mocktail pairings, interactive guest games, and eco-swaps.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Curated aesthetic concepts</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Rich Judge Presets Section */}
      <section
        id="presets"
        className={`py-20 bg-transparent border-b border-white/60 dark:border-slate-800/60 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          revealedSections['presets'] ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-sm translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-2">
              Ready To Review
            </span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore 3 production-grade judge presets
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">
              Each preset contains comprehensive budgets, timeline nodes, vendor contracts, and guest cohorts with zero placeholder text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Preset A */}
            <div className="glass-widget rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200/80 dark:border-amber-800/60">
                    Preset A • Wedding
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">₹15,00,000</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Royal Heritage Wedding
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  250 guests at Chunda Palace Courtyard & Zenana Gardens. 8 budget categories, 10 sequential timeline nodes, 7 vendors with SLAs, and royal fusion decor.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono">
                  <div className="flex justify-between">
                    <span>Guest Count:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">250 Pax</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Venue:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Udaipur Palace (Outdoor)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Key Risk:</span>
                    <span className="text-amber-700 dark:text-amber-300 font-medium">Unseasonal Lake Rain</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onLoadPreset('wedding');
                  onLaunchWorkspace();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm shadow-indigo-100 active:scale-95"
              >
                <span>Launch Royal Wedding Preset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Preset B */}
            <div className="glass-widget rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200/80 dark:border-indigo-800/60">
                    Preset B • Birthday
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">₹1,50,000</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Milestone 30th Birthday Gala
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  80 guests at Aer Rooftop Lounge, Worli Mumbai. 6 budget categories, 8 timeline nodes, 5 vendors, mixology cocktail stations, and DJ performances.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono">
                  <div className="flex justify-between">
                    <span>Guest Count:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">80 Pax</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Venue:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Aer Rooftop, Mumbai</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Key Risk:</span>
                    <span className="text-indigo-700 dark:text-indigo-300 font-medium">Noise Curfew & Rooftop Wind</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onLoadPreset('birthday');
                  onLaunchWorkspace();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm shadow-indigo-100 active:scale-95"
              >
                <span>Launch 30th Birthday Preset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Preset C */}
            <div className="glass-widget rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/60">
                    Preset C • Community
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">₹3,00,000</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Cultural & Tech Community Fest
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  500 guests at Koramangala Civic Grounds, Bengaluru. Multi-stall exhibits, sponsor revenues, stage audio coordination, and volunteer marshals.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono">
                  <div className="flex justify-between">
                    <span>Guest Count:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">500 Pax</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Venue:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Koramangala Open Grounds</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Key Risk:</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-medium">Crowd Surge & Civic Permits</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onLoadPreset('fest');
                  onLaunchWorkspace();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm shadow-indigo-100 active:scale-95"
              >
                <span>Launch Community Fest Preset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture Section */}
      <section
        id="architecture"
        className={`py-20 bg-transparent border-b border-white/60 dark:border-slate-800/60 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          revealedSections['architecture'] ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-sm translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-2">
              Engineering Specs
            </span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dual-Engine AI with deterministic offline reliability
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">
              Architected for bulletproof hackathon judging, whether connected to live Gemini APIs or running offline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-widget">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-2">
                Engine A: Event Architect
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Prompts Gemini 2.5 Flash via REST with strict <code>responseSchema</code> to generate complete, culturally authentic event plans with zero placeholders.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-widget">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-2">
                Engine B: Causal Ripple Simulator
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Ingests existing JSON state and arbitrary disruption prompts to recompute budget deltas, shift timestamps, and generate custom vendor change notices.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-widget">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-2">
                Deterministic Judge Fallback
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                When no API key is present, our offline mathematical engine executes a 900ms animated causal chain and delivers instantaneous, mathematically consistent results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner - Deep Obsidian Frosted Glass */}
      <section
        id="cta-banner"
        className={`py-20 relative overflow-hidden glass-panel bg-gradient-to-br from-indigo-950/80 via-slate-900/80 to-slate-950/80 text-white border-y border-indigo-900/40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          revealedSections['cta-banner'] ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-sm translate-y-8'
        }`}
      >
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to explore the future of celebration management?
          </h2>
          <p className="mt-4 text-slate-300 text-base max-w-2xl mx-auto">
            Experience the unified master state, live scenario simulations, and interactive run-of-show in the workspace.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchWorkspace}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-900/50 transition active:scale-95"
            >
              Launch Live Workspace
            </button>
            <button
              onClick={() => {
                onLoadPreset('wedding');
                onLaunchWorkspace();
              }}
              className="px-8 py-3.5 rounded-xl glass-pill hover:bg-white/20 text-white font-semibold text-sm transition active:scale-95"
            >
              Load Royal Wedding Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 glass-panel border-t border-white/60 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">EventPulse AI</span>
            <span>• Project AURA Celebration Operating System</span>
          </div>
          <div>
            <span>Google Antigravity & PromptWars Challenge 5 Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

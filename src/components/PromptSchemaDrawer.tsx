import React, { useState } from 'react';
import { X, Code2, Copy, Check, Sparkles, Network, Terminal, Layers, FileJson, ArrowRight, CloudRain, Users, Clock } from 'lucide-react';
import { EventPlan } from '../types/event';
import { GEMINI_MODEL, GEMINI_API_ENDPOINT } from '../services/geminiService';

interface PromptSchemaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eventPlan: EventPlan;
}

export const PromptSchemaDrawer: React.FC<PromptSchemaDrawerProps> = ({
  isOpen,
  onClose,
  eventPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'graph' | 'state'>('prompt');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(eventPlan, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SYSTEM_PROMPT_LAYER_1 = `LAYER 1: PERSONA & ARCHITECTURAL MANDATE
You are EventPulse AI, an autonomous agentic celebration & event operating system.
Unlike static text generators, your core architectural constraint is the UNIFIED MASTER JSON STATE (eventPlan).
Every change in guest count, budget cap, weather forecast, or vendor timing MUST dynamically ripple across:
- Budget Allocations (Unit economics, per-plate math, contingency reserves)
- Dependency-Linked Timeline (Parent-child task cascading, conflict flagging)
- Vendor SLA Checklists (Action-required milestones, auto-drafted WhatsApp change orders)
- Cultural & Thematic Ideation (Dietary constraints, circular eco-swaps, decor harmonies)`;

  const SYSTEM_PROMPT_LAYER_2 = `LAYER 2: MATHEMATICAL DEPENDENCY GRAPH & CASCADING RULES
1. Weather Invariant: If outdoor venue is compromised by rain, immediately deploy indoor ballroom contingency, allocate canopy reserves (+₹25K–₹40K), flag all isOutdoorDependent timeline nodes, and draft urgent shelter orders for Decor & AV.
2. Headcount Invariant: If guest count surges (+N pax), compute catering delta = N × plateCost, allocate seating furniture (+5 round tables, N chairs), lengthen dining service window (+30m), and update catering contracts.
3. Budget Optimization: If budget is cut by X%, protect essential Venue and Food contracts; value-engineer decorative fabrication and AV trussing by up to 22%, eliminating crew overtime.
4. Schedule Delay Invariant: If caterer or key ritual is delayed by M minutes, cascade downstream milestones, elongate cocktail lounge entertainment buffer, and dispatch synchronized notices to Host, Kitchen, and DJ crews.`;

  const SYSTEM_PROMPT_LAYER_3 = `LAYER 3: OUTPUT CONTRACT & GEMINI 2.5 FLASH SCHEMA
Model: ${GEMINI_MODEL}
Endpoint: ${GEMINI_API_ENDPOINT}
Headers: { "Content-Type": "application/json" }
GenerationConfig: {
  "responseMimeType": "application/json",
  "temperature": 0.2,
  "responseSchema": {
    "type": "OBJECT",
    "properties": {
      "explanation": { "type": "STRING" },
      "aiRippleSummary": { "type": "ARRAY", "items": { "type": "STRING" } },
      "budgetCategories": { "type": "ARRAY", "items": { ... } },
      "timelineNodes": { "type": "ARRAY", "items": { ... } },
      "vendors": { "type": "ARRAY", "items": { ... } }
    },
    "required": ["explanation", "aiRippleSummary", "budgetCategories", "timelineNodes", "vendors"]
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel h-full shadow-2xl border-l border-slate-200/80 dark:border-slate-800 flex flex-col animate-blur-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Prompt & Schema Inspector
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-mono">
                  {GEMINI_MODEL}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hackathon judge inspection: 3-Layer Prompting, Dependency Graph & Live JSON state
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3-Layer System Prompt</span>
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'graph'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Dependency Graph Rules</span>
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'state'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Live JSON Payload</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              {/* Layer 1 */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 bg-white/40 dark:bg-slate-850/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    Layer 1: Persona & Architectural Mandate
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                    System Identity
                  </span>
                </div>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
                  {SYSTEM_PROMPT_LAYER_1}
                </pre>
              </div>

              {/* Layer 2 */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 bg-white/40 dark:bg-slate-850/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    Layer 2: Mathematical Dependency Graph
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                    Ripple Logic
                  </span>
                </div>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
                  {SYSTEM_PROMPT_LAYER_2}
                </pre>
              </div>

              {/* Layer 3 */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 bg-white/40 dark:bg-slate-850/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    Layer 3: Output Contract (responseSchema)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                    Structured Output
                  </span>
                </div>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
                  {SYSTEM_PROMPT_LAYER_3}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'graph' && (
            <div className="space-y-4">
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 bg-white/40 dark:bg-slate-850/40 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  Deterministic & LLM Ripple Propagation Graph
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  When a disruption occurs, the engine traverses downstream nodes rather than editing tables in isolation.
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-lg space-y-1">
                    <strong className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                      <CloudRain className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
                      <span>Weather Shift (Rain Invariant)</span>
                    </strong>
                    <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                      Weather = Rain <ArrowRight className="w-3 h-3 text-slate-400" /> Venue = Indoor <ArrowRight className="w-3 h-3 text-slate-400" /> Contingency Reserve +₹30K <ArrowRight className="w-3 h-3 text-slate-400" /> Outdoor Timeline Nodes Flagged <ArrowRight className="w-3 h-3 text-slate-400" /> Vendor Relocation Notices
                    </div>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-lg space-y-1">
                    <strong className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                      <span>Headcount Surge (+N Guests)</span>
                    </strong>
                    <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                      Pax +N <ArrowRight className="w-3 h-3 text-slate-400" /> Catering = N × Rate <ArrowRight className="w-3 h-3 text-slate-400" /> Seating +Tables/Chairs <ArrowRight className="w-3 h-3 text-slate-400" /> Dinner Slot +30m <ArrowRight className="w-3 h-3 text-slate-400" /> Catering Notice & PO Revision
                    </div>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-lg space-y-1">
                    <strong className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
                      <span>Service Bottleneck (45m Delay)</span>
                    </strong>
                    <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                      Dinner Delayed +45m <ArrowRight className="w-3 h-3 text-slate-400" /> Acoustic Set Extended <ArrowRight className="w-3 h-3 text-slate-400" /> Snack Pass-Arounds Buffer <ArrowRight className="w-3 h-3 text-slate-400" /> Kitchen Hotline Alert
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'state' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Payload size: {JSON.stringify(eventPlan).length} bytes
                </span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied JSON' : 'Copy JSON'}
                </button>
              </div>

              <pre className="p-4 bg-slate-900 dark:bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto max-h-[500px]">
                {JSON.stringify(eventPlan, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Engine: Google Gemini 2.5 Flash + Local Fallback</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-white transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Printer, Download, Copy, Check, FileJson, Calendar, DollarSign, Users, MapPin } from 'lucide-react';
import { EventPlan } from '../types/event';
import { formatCurrency } from '../services/currency';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventPlan: EventPlan;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, eventPlan }) => {
  const [activeTab, setActiveTab] = useState<'run-of-show' | 'json'>('run-of-show');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(eventPlan, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(eventPlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${eventPlan.name.toLowerCase().replace(/\s+/g, '-')}-plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-blur-in">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Export & Print Operations Center</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate production day-of run-of-show prints or export full eventPlan JSON state
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-white/60 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab('run-of-show')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === 'run-of-show'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Run-of-Show Print
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === 'json'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Full State JSON
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'run-of-show' ? (
            <div id="printable-run-of-show" className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 text-slate-900 print:text-black print:bg-white print:border-none print:p-0">
              {/* Document Header */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest uppercase text-indigo-600 font-bold">
                      EVENTPULSE AI // MASTER RUN OF SHOW
                    </span>
                    <h1 className="text-2xl font-extrabold text-slate-900 print:text-black mt-1">
                      {eventPlan.name}
                    </h1>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 print:bg-slate-100 print:text-black">
                      {eventPlan.type.toUpperCase()} EDITION
                    </span>
                    <div className="text-xs text-slate-500 mt-1">
                      Status: Active Operating Plan
                    </div>
                  </div>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-4 gap-4 mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="text-slate-500 text-[10px]">Date</div>
                      <div className="font-semibold text-slate-800">{eventPlan.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="text-slate-500 text-[10px]">Headcount</div>
                      <div className="font-semibold text-slate-800">{eventPlan.guestCount} Guests</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-slate-500 text-[10px]">Total Budget</div>
                      <div className="font-semibold text-emerald-700">
                        {formatCurrency(eventPlan.totalBudget, eventPlan.currency)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="text-slate-500 text-[10px]">Venue & Weather</div>
                      <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                        {eventPlan.venue.name} ({eventPlan.weatherCondition})
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day-of Timeline Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Minute-by-Minute Run of Show</span>
                  <span className="text-xs font-normal text-slate-500">
                    {eventPlan.timelineNodes.length} scheduled nodes
                  </span>
                </h3>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Time Window</th>
                        <th className="py-2.5 px-3">Milestone / Program</th>
                        <th className="py-2.5 px-3">Owner</th>
                        <th className="py-2.5 px-3">Dependencies</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {eventPlan.timelineNodes.map((node) => (
                        <tr key={node.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-medium text-indigo-700">
                            {node.timeSlot}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900">{node.title}</div>
                            {node.hasConflict && (
                              <div className="text-[11px] text-rose-600 font-medium mt-0.5">
                                {node.conflictWarning}
                              </div>
                            )}
                            <div className="text-[11px] text-slate-500 mt-0.5">{node.notes}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{node.owner}</td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {node.dependsOn.length > 0 ? (
                              node.dependsOn.map((dep, i) => (
                                <span key={i} className="inline-block bg-slate-100 px-1.5 py-0.5 rounded text-[10px] mr-1 text-slate-700">
                                  {dep}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                node.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : node.status === 'in-progress'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : node.status === 'critical'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {node.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vendor Emergency Directory */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Vendor SLA & Emergency Contacts
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {eventPlan.vendors.map((v) => (
                    <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{v.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                          {v.role}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1">
                        Contact: <span className="text-slate-800">{v.contactPerson}</span> ({v.phone})
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        SLA Window: <span className="text-indigo-600 font-medium">{v.slaDeadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Unified Single State JSON (`eventPlan`) — {JSON.stringify(eventPlan).length} bytes</span>
                <span className="font-mono text-indigo-600 font-medium">Strict JSON Spec</span>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto max-h-[500px]">
                {JSON.stringify(eventPlan, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 print:hidden">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'run-of-show'
              ? 'Print preview formatted for standard A4 / PDF coordinator binders.'
              : 'Direct integration with downstream webhooks or state machines.'}
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'run-of-show' ? (
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm flex items-center gap-2 transition active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Print Run-of-Show / Save PDF
              </button>
            ) : (
              <>
                <button
                  onClick={handleCopyJson}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-2 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied JSON!' : 'Copy to Clipboard'}
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm flex items-center gap-2 transition active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download .json
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Clock,
  User,
  GitBranch,
  ShieldAlert,
  Sparkles,
  CloudRain,
  AlertTriangle
} from 'lucide-react';
import { EventPlan, TimelineNode } from '../../types/event';

interface TimelineTabProps {
  eventPlan: EventPlan;
  onUpdateNodeStatus: (nodeId: string, status: TimelineNode['status']) => void;
  onShiftTime: (nodeId: string, deltaMinutes: number) => void;
  onResolveConflict: (nodeId: string) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  eventPlan,
  onUpdateNodeStatus,
  onShiftTime,
  onResolveConflict,
}) => {
  const [filterPhase, setFilterPhase] = useState<'all' | 'day-of' | 'pre-event'>('day-of');

  const filteredNodes = eventPlan.timelineNodes.filter((node) => {
    if (filterPhase === 'all') return true;
    return node.phase === filterPhase;
  });

  const conflictCount = eventPlan.timelineNodes.filter((n) => n.hasConflict).length;

  return (
    <div className="space-y-6 view-enter">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 glass-widget rounded-2xl shadow-sm stagger-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-xs">
            <Clock className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Dependency-Linked Timeline & Day-Of Run of Show
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Parent-child milestone links cascade delays across sequential ceremonial events
            </p>
          </div>
        </div>

        {/* Phase Filter Buttons */}
        <div className="flex items-center bg-white/50 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 rounded-xl p-1 text-xs font-semibold text-slate-600 dark:text-slate-300 self-start sm:self-center">
          <button
            onClick={() => setFilterPhase('day-of')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
              filterPhase === 'day-of'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Day-Of ({eventPlan.timelineNodes.filter((n) => n.phase === 'day-of').length})
          </button>
          <button
            onClick={() => setFilterPhase('pre-event')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
              filterPhase === 'pre-event'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pre-Event ({eventPlan.timelineNodes.filter((n) => n.phase === 'pre-event').length})
          </button>
          <button
            onClick={() => setFilterPhase('all')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
              filterPhase === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({eventPlan.timelineNodes.length})
          </button>
        </div>
      </div>

      {/* Active Conflict Banner if any */}
      {conflictCount > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div className="flex-1">
            <strong className="font-bold text-rose-900 dark:text-rose-200 text-xs sm:text-sm block">
              {conflictCount} Active Dependency Conflicts Detected
            </strong>
            <p className="text-rose-700 dark:text-rose-400 mt-0.5">
              Weather shifts or caterer delays are impacting downstream milestones. Review the warnings below.
            </p>
          </div>
        </div>
      )}

      {/* Timeline Node Flow */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-4 ml-2 sm:ml-4">
        {filteredNodes.map((node) => {
          const isCompleted = node.status === 'completed';
          const isCritical = node.status === 'critical' || node.hasConflict;
          const isUpdatedByAi = node.wasUpdated;

          return (
            <div key={node.id} className="relative group">
              {/* Dot on the timeline line */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 transition-all shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isCritical
                    ? 'bg-rose-500 ring-2 ring-rose-300 dark:ring-rose-800'
                    : 'bg-indigo-600'
                }`}
              />

              {/* Task Card */}
              <div
                className={`p-5 rounded-2xl transition-all duration-200 space-y-3 glass-widget ${
                  isUpdatedByAi
                    ? 'border-indigo-300/80 dark:border-indigo-800/80 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : isCritical
                    ? 'border-rose-300/80 dark:border-rose-900/80 bg-rose-50/30 dark:bg-rose-950/20'
                    : ''
                }`}
              >
                {/* Header: Time slot + Title + Status Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Time slot pill */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" strokeWidth={1.75} />
                        {node.timeSlot}
                      </span>

                      {/* Phase Badge */}
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {node.phase}
                      </span>

                      {/* UPDATED BY AI BADGE */}
                      {isUpdatedByAi && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                          UPDATED BY AI
                        </span>
                      )}

                      {/* CHANGE REASON PILL */}
                      {node.changeReason && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          {node.changeReason}
                        </span>
                      )}

                      {/* Outdoor weather vulnerability badge */}
                      {node.isOutdoorDependent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                          <CloudRain className="w-3 h-3 text-cyan-600 dark:text-cyan-400" strokeWidth={1.75} />
                          <span>Outdoor Dependent</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {node.title || node.task}
                    </h4>
                  </div>

                  {/* Status Dropdown & Shift Time */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <select
                      value={node.status}
                      onChange={(e) =>
                        onUpdateNodeStatus(node.id, e.target.value as TimelineNode['status'])
                      }
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                        node.status === 'completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                          : node.status === 'in-progress'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
                          : node.status === 'critical'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="completed">Completed</option>
                      <option value="critical">Critical Issue</option>
                    </select>

                    <button
                      onClick={() => onShiftTime(node.id, 15)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs transition-all duration-150 active:scale-[0.98]"
                      title="Shift task by +15 mins"
                    >
                      +15m
                    </button>
                  </div>
                </div>

                {/* Conflict Alert Box if present */}
                {node.hasConflict && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" strokeWidth={1.75} />
                      <span className="font-medium">{node.conflictWarning}</span>
                    </div>
                    <button
                      onClick={() => onResolveConflict(node.id)}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shrink-0 transition-all duration-150 active:scale-[0.98] shadow-xs"
                    >
                      Resolve
                    </button>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {node.notes}
                </p>

                {/* Footer Meta: Owner & Dependencies */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
                    <span>Owner: <strong className="text-slate-700 dark:text-slate-300 font-medium">{node.owner}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
                    <span>Depends on:</span>
                    {node.dependsOn.length > 0 ? (
                      node.dependsOn.map((dep, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          {dep}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

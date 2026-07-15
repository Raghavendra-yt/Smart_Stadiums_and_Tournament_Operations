import React from 'react';
import { useStadium } from '../../context/StadiumContext';
import { ShieldAlert, Sparkles, CheckCircle2, Zap, Clock } from 'lucide-react';

export const AIIncidentEngine = () => {
  const { incidents, resolveIncident } = useStadium();

  return (
    <div className="glass-panel p-4 flex flex-col h-[560px] border border-rose-500/20 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-heading flex items-center gap-2">
              GenAI Incident Detection & Response Hub
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono">
                Real-Time Ops
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Autonomous anomaly detection & automated ground staff dispatch
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1">
        {incidents.map((inc) => {
          const isResolved = inc.status === 'Resolved - Cleared';
          return (
            <div
              key={inc.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isResolved 
                  ? 'bg-slate-900/40 border-white/5 opacity-60' 
                  : inc.severity === 'HIGH'
                  ? 'bg-rose-950/30 border-rose-500/40 shadow-lg shadow-rose-950/50'
                  : 'bg-amber-950/20 border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                      inc.severity === 'HIGH'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : isResolved
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {inc.severity}
                  </span>
                  <span className="font-mono text-xs text-slate-400 font-bold">{inc.id}</span>
                  <span className="text-xs text-slate-300">• {inc.sector}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> {inc.timeReported}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-100 mb-1">{inc.title}</h4>
              <p className="text-xs text-slate-300 mb-3">{inc.description}</p>

              {!isResolved && (
                <div className="p-3 rounded-lg bg-slate-900/90 border border-emerald-500/30 mb-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
                    <Sparkles className="w-3.5 h-3.5" /> GenAI Instant Resolution Plan:
                  </div>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    {inc.aiRecommendation}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  Assigned: <strong className="text-slate-200">{inc.assignedTeam}</strong>
                </span>

                {!isResolved ? (
                  <button
                    onClick={() => resolveIncident(inc.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" /> Execute Strategy & Clear
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Mitigated & Cleared
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

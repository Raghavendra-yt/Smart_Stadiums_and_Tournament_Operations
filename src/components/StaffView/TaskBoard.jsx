import React from 'react';
import { useStadium } from '../../context/StadiumContext';
import { CheckCircle2, MapPin, UserCheck } from 'lucide-react';

export const TaskBoard = () => {
  const { tasks, updateTaskStatus } = useStadium();

  return (
    <div className="glass-panel p-4 flex flex-col h-[560px] border border-cyan-500/20 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-heading">
              Volunteer Steward Action Items
            </h3>
            <p className="text-[11px] text-slate-400">
              Live AI-assigned ground tasks & gate priority checklists
            </p>
          </div>
        </div>

        <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-bold">
          {tasks.filter(t => t.status !== 'COMPLETED').length} Active Tasks
        </span>
      </div>

      <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1">
        {tasks.map((task) => {
          const isDone = task.status === 'COMPLETED';
          return (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isDone 
                  ? 'bg-slate-900/40 border-white/5 opacity-60' 
                  : 'bg-slate-900/90 border-white/10 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-amber-400">{task.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  task.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {task.category} • {task.priority}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-100 mb-1">{task.title}</h4>
              <p className="text-xs text-slate-300 mb-2">{task.instruction}</p>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {task.location}
                </span>

                {!isDone ? (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                  </button>
                ) : (
                  <span className="text-emerald-400 font-bold text-xs font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
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

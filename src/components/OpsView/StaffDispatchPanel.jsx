import React from 'react';
import { useStadium } from '../../context/StadiumContext';
import { UserCheck } from 'lucide-react';

export const StaffDispatchPanel = () => {
  const { tasks } = useStadium();

  return (
    <div className="glass-panel p-4 border border-amber-500/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-white font-heading">
            AI Automated Staff & Volunteer Dispatch Matrix
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
          240 Volunteers On Duty
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-mono text-amber-400 font-bold">{task.id}</span>
                <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                  task.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {task.priority}
                </span>
              </div>
              <h4 className="font-bold text-xs text-white">{task.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{task.instruction}</p>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
              <span>📍 {task.location}</span>
              <span className={`font-bold ${task.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

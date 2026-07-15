import React from 'react';
import { LiveTranslator } from './LiveTranslator';
import { TaskBoard } from './TaskBoard';
import { 
  UserCheck, 
  Languages, 
  CheckCircle2, 
  ShieldAlert, 
  Clock,
  Radio
} from 'lucide-react';

export const StaffView = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 lg:px-8 animate-fade-in">
      
      {/* Top Volunteer Telemetry Quick Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">My Assigned Zone</span>
            <span className="font-bold text-sm text-white">Gate B & Ramp North</span>
            <span className="text-xs text-amber-300 block">Zone Steward Alex M.</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
            📍
          </div>
        </div>

        <div className="glass-panel p-3.5 border-l-4 border-l-cyan-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Translations Completed</span>
            <span className="font-extrabold text-sm text-white font-mono">42 Fan Inquiries</span>
            <span className="text-xs text-cyan-300 block">Spanish / Portuguese</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Languages className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-3.5 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Active Task Status</span>
            <span className="font-bold text-sm text-white font-mono">2 / 3 Resolved</span>
            <span className="text-xs text-emerald-400 block">Shift Pace Optimal</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-3.5 border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Command Radio Link</span>
            <span className="font-bold text-sm text-white font-mono flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Channel 4 Sync
            </span>
            <span className="text-xs text-purple-300 block">Emergency Direct Pass</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Split: Multilingual Translator & Volunteer Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveTranslator />
        <TaskBoard />
      </div>

    </div>
  );
};

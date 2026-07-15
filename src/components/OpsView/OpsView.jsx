import React from 'react';
import { useStadium } from '../../context/StadiumContext';
import { CrowdHeatmap } from './CrowdHeatmap';
import { AIIncidentEngine } from './AIIncidentEngine';
import { SustainabilityMetrics } from './SustainabilityMetrics';
import { StaffDispatchPanel } from './StaffDispatchPanel';
import { ShieldAlert, Users, Activity, Leaf } from 'lucide-react';

export const OpsView = () => {
  const { incidents } = useStadium();
  const activeCount = incidents.filter(i => i.status !== 'Resolved - Cleared').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 lg:px-8 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 border-l-4 border-l-rose-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Active Ops Incidents</span>
            <span className="font-extrabold text-lg text-white font-mono">{activeCount} Pending</span>
            <span className="text-xs text-rose-400 block">AI Resolution Active</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="glass-panel p-3.5 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Stadium Ingress Rate</span>
            <span className="font-extrabold text-lg text-white font-mono">880 / min</span>
            <span className="text-xs text-emerald-400 block">Gate D Flow Optimal</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-3.5 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Staff Allocation Rate</span>
            <span className="font-extrabold text-lg text-white font-mono">98.2%</span>
            <span className="text-xs text-amber-300 block">Zone 2 Gate B Shifted</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-3.5 border-l-4 border-l-cyan-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Grid Eco Efficiency</span>
            <span className="font-extrabold text-lg text-white font-mono">94.8% Score</span>
            <span className="text-xs text-cyan-300 block">Solar Power Sync</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CrowdHeatmap />
        <AIIncidentEngine />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SustainabilityMetrics />
        <StaffDispatchPanel />
      </div>
    </div>
  );
};

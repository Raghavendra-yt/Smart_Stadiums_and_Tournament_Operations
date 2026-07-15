import React from 'react';
import { Leaf, Trash2, Thermometer, Sun } from 'lucide-react';

export const SustainabilityMetrics = () => {
  return (
    <div className="glass-panel p-4 border border-emerald-500/20 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm text-white font-heading">
            Sustainability & Carbon Neutral Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
          ISO 20121 Eco-Certified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Rooftop Array</span>
            <span className="text-emerald-400 font-mono font-bold">+18% Output</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">1.84 MW Peak</div>
          <p className="text-[10px] text-slate-400 mt-1">
            AI Automated HVAC load throttling reduced peak draw by 14% during 2nd half.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Trash2 className="w-3.5 h-3.5 text-cyan-400" /> Smart Waste Sorting</span>
            <span className="text-cyan-400 font-mono font-bold">94.8% Diversion</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">4.2 Tons Recycled</div>
          <p className="text-[10px] text-slate-400 mt-1">
            8 autonomous eco-carts operating on concourse level 1.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-rose-400" /> Pitch Microclimate</span>
            <span className="text-emerald-400 font-mono font-bold">Optimal 22°C</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">54% Humidity</div>
          <p className="text-[10px] text-slate-400 mt-1">
            Turf cooling sensors operating at baseline efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useStadium } from '../../context/StadiumContext';
import { Radio, Flame } from 'lucide-react';

export const CrowdHeatmap = () => {
  const { gates } = useStadium();

  const getHeatColor = (density) => {
    if (density > 75) return 'rgba(244, 63, 94, 0.75)';
    if (density > 40) return 'rgba(245, 158, 11, 0.75)';
    return 'rgba(16, 185, 129, 0.75)';
  };

  return (
    <div className="glass-panel p-4 flex flex-col h-[560px] border border-cyan-500/20 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2 font-heading">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            Live Crowd Density & Concourse Heatmap
          </h3>
          <p className="text-[11px] text-slate-400">
            Computer-vision turnstile analytics & predictive flow rate modeling
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Camera Telemetry
          </span>
        </div>
      </div>

      <div className="flex-1 relative my-3 bg-slate-950/90 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-2">
        <svg viewBox="0 0 500 300" className="w-full h-full select-none">
          <rect x="150" y="75" width="200" height="150" fill="#062016" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" rx="4" />
          <line x1="250" y1="75" x2="250" y2="225" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
          <circle cx="250" cy="150" r="30" fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />

          {/* Sector 101 - 124 (Gate A) */}
          <path 
            d="M 60 40 L 220 40 L 150 75 L 60 75 Z" 
            fill={getHeatColor(gates[0].crowdDensity)} 
            stroke="rgba(255,255,255,0.2)"
            className="transition-colors duration-700 cursor-pointer hover:opacity-90"
          />

          {/* Sector 125 - 148 (Gate B - CONGESTED) */}
          <path 
            d="M 280 40 L 440 40 L 440 75 L 350 75 Z" 
            fill={getHeatColor(gates[1].crowdDensity)} 
            stroke="rgba(255,255,255,0.2)"
            className="transition-colors duration-700 cursor-pointer hover:opacity-90"
          />

          {/* Sector 201 - 228 (Gate C) */}
          <path 
            d="M 350 225 L 440 225 L 440 260 L 280 260 Z" 
            fill={getHeatColor(gates[2].crowdDensity)} 
            stroke="rgba(255,255,255,0.2)"
            className="transition-colors duration-700 cursor-pointer hover:opacity-90"
          />

          {/* Sector 301 - 340 (Gate D) */}
          <path 
            d="M 150 225 L 250 225 L 220 260 L 60 260 Z" 
            fill={getHeatColor(gates[3].crowdDensity)} 
            stroke="rgba(255,255,255,0.2)"
            className="transition-colors duration-700 cursor-pointer hover:opacity-90"
          />

          <circle cx="430" cy="45" r="24" fill="rgba(244, 63, 94, 0.4)" className="animate-ping" />
          <circle cx="430" cy="45" r="14" fill="#f43f5e" />
          <text x="430" y="49" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">88%</text>

          <circle cx="70" cy="45" r="12" fill="#10b981" />
          <text x="70" y="49" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">28%</text>

          <circle cx="70" cy="255" r="12" fill="#10b981" />
          <text x="70" y="259" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">22%</text>

          <g transform="translate(180, 275)">
            <rect x="0" y="0" width="140" height="18" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.1)" />
            <circle cx="15" cy="9" r="4" fill="#10b981" />
            <text x="23" y="12" fill="#94a3b8" fontSize="8">Optimal (&lt;40%)</text>
            <circle cx="80" cy="9" r="4" fill="#f43f5e" />
            <text x="88" y="12" fill="#94a3b8" fontSize="8">Surge (&gt;75%)</text>
          </g>
        </svg>

        <div className="absolute top-2 left-2 p-2 rounded-lg bg-slate-900/90 border border-white/10 text-[11px] font-mono space-y-1">
          <div className="text-slate-400 font-bold">Total Ingress Rate:</div>
          <div className="text-emerald-400 font-bold text-xs">880 Fans / min</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {gates.map((g) => (
          <div key={g.id} className="p-2 rounded-lg bg-slate-900/80 border border-white/10 text-xs">
            <div className="flex justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span>{g.id.split(' ')[0]} {g.id.split(' ')[1]}</span>
              <span style={{ color: g.color }}>{g.crowdDensity}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
              <div className="h-full rounded-full transition-all" style={{ width: `${g.crowdDensity}%`, backgroundColor: g.color }} />
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex justify-between">
              <span>Flow: {g.flowRate}</span>
              <span>{g.waitMin} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

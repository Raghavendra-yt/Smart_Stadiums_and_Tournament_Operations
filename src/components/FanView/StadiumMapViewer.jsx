import React, { useState } from 'react';
import { useStadium } from '../../context/StadiumContext';
import { 
  MapPin, 
  Layers, 
  Navigation, 
  Accessibility, 
  Info, 
  ShoppingBag, 
  Clock,
  ExternalLink
} from 'lucide-react';

export const StadiumMapViewer = () => {
  const { 
    gates, 
    concessions, 
    selectedMapTarget, 
    setSelectedMapTarget,
    setActiveOrderModal
  } = useStadium();
  
  const [activeLayer, setActiveLayer] = useState('all'); // 'all' | 'gates' | 'concessions' | 'accessibility'

  return (
    <div className="glass-panel p-4 flex flex-col h-[580px] border border-cyan-500/20 relative overflow-hidden">
      
      {/* Map Control Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            Interactive GenAI Pitch & Gate Map
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time turnstile load, queue heat-indices & optimized exit paths
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-white/10 text-[11px]">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeLayer === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveLayer('gates')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeLayer === 'gates' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gates
          </button>
          <button
            onClick={() => setActiveLayer('concessions')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeLayer === 'concessions' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Food
          </button>
          <button
            onClick={() => setActiveLayer('accessibility')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeLayer === 'accessibility' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ♿ Accessible
          </button>
        </div>
      </div>

      {/* SVG Interactive Blueprint Pitch */}
      <div className="flex-1 relative my-2 bg-slate-950/80 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[380px] select-none">
          {/* Background Gradients & Pitch Layout */}
          <defs>
            <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#052e16" />
              <stop offset="100%" stopColor="#022c22" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Stadium Structure Outer Ring */}
          <ellipse cx="250" cy="160" rx="230" ry="140" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
          <ellipse cx="250" cy="160" rx="190" ry="110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />

          {/* Soccer Pitch Center Field */}
          <rect x="140" y="80" width="220" height="160" fill="url(#fieldGrad)" stroke="#10b981" strokeWidth="2" rx="4" />
          {/* Pitch Lines */}
          <line x1="250" y1="80" x2="250" y2="240" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
          <circle cx="250" cy="160" r="35" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
          {/* Penalty boxes */}
          <rect x="140" y="115" width="35" height="90" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
          <rect x="325" y="115" width="35" height="90" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />

          {/* Route Bypass Highlight Overlay line if selected */}
          {selectedMapTarget && (
            <path
              d="M 250 160 Q 210 110, 80 50"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#glow)"
            />
          )}

          {/* GATES MARKERS */}
          {(activeLayer === 'all' || activeLayer === 'gates') && (
            <>
              {/* Gate A (North West) */}
              <g 
                onClick={() => setSelectedMapTarget({ name: 'Gate A (North West)', type: 'Gate', waitMin: 4, sector: 'Sec 101 - 124' })}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle cx="80" cy="50" r="16" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />
                <text x="80" y="54" textAnchor="middle" fill="#ffffff" fontSize="10" fontWait="bold" fontFamily="sans-serif">Gate A</text>
                <circle cx="92" cy="38" r="8" fill="#10b981" />
                <text x="92" y="41" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">4m</text>
              </g>

              {/* Gate B (North East) - CONGESTED */}
              <g 
                onClick={() => setSelectedMapTarget({ name: 'Gate B (North East)', type: 'Gate', waitMin: 18, sector: 'Sec 125 - 148', warning: 'Congested!' })}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle cx="420" cy="50" r="16" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="2" className="animate-pulse" />
                <text x="420" y="54" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Gate B</text>
                <circle cx="432" cy="38" r="9" fill="#f43f5e" />
                <text x="432" y="41" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">18m</text>
              </g>

              {/* Gate C (South East) */}
              <g 
                onClick={() => setSelectedMapTarget({ name: 'Gate C (South East)', type: 'Gate', waitMin: 7, sector: 'Sec 201 - 228' })}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle cx="420" cy="270" r="16" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="2" />
                <text x="420" y="274" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Gate C</text>
                <circle cx="432" cy="258" r="8" fill="#f59e0b" />
                <text x="432" y="261" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">7m</text>
              </g>

              {/* Gate D (South West) */}
              <g 
                onClick={() => setSelectedMapTarget({ name: 'Gate D (South West)', type: 'Gate', waitMin: 3, sector: 'Sec 301 - 340' })}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle cx="80" cy="270" r="16" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />
                <text x="80" y="274" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Gate D</text>
                <circle cx="92" cy="258" r="8" fill="#10b981" />
                <text x="92" y="261" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">3m</text>
              </g>
            </>
          )}

          {/* CONCESSIONS FOOD MARKERS */}
          {(activeLayer === 'all' || activeLayer === 'concessions') && (
            <>
              {/* Taco Stand Sec 112 */}
              <g 
                onClick={() => {
                  setSelectedMapTarget({ name: concessions[0].name, type: 'Concession', waitMin: 3, item: concessions[0] });
                  setActiveOrderModal(concessions[0]);
                }}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                <rect x="110" y="110" width="24" height="24" rx="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="122" y="126" textAnchor="middle" fontSize="12">🌮</text>
              </g>

              {/* Burger Stand Sec 130 */}
              <g 
                onClick={() => {
                  setSelectedMapTarget({ name: concessions[1].name, type: 'Concession', waitMin: 16, item: concessions[1] });
                  setActiveOrderModal(concessions[1]);
                }}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                <rect x="365" y="110" width="24" height="24" rx="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                <text x="377" y="126" textAnchor="middle" fontSize="12">🍔</text>
              </g>

              {/* Hydration Station */}
              <g 
                onClick={() => setSelectedMapTarget({ name: concessions[3].name, type: 'Hydration', waitMin: 0 })}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                <circle cx="250" cy="60" r="12" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                <text x="250" y="64" textAnchor="middle" fontSize="11">💧</text>
              </g>
            </>
          )}

          {/* ACCESSIBILITY ELEVATORS */}
          {(activeLayer === 'all' || activeLayer === 'accessibility') && (
            <>
              <g onClick={() => setSelectedMapTarget({ name: 'Elevator 1 (North Concourse Accessible)', type: 'Accessibility' })} className="cursor-pointer">
                <circle cx="160" cy="40" r="10" fill="#3b82f6" />
                <text x="160" y="44" textAnchor="middle" fill="#fff" fontSize="9">♿</text>
              </g>
              <g onClick={() => setSelectedMapTarget({ name: 'Elevator 3 (South Skybridge Ramp)', type: 'Accessibility' })} className="cursor-pointer">
                <circle cx="340" cy="280" r="10" fill="#3b82f6" />
                <text x="340" y="284" textAnchor="middle" fill="#fff" fontSize="9">♿</text>
              </g>
            </>
          )}
        </svg>

        {/* Floating Target Telemetry Card if clicked */}
        {selectedMapTarget && (
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl glass-panel-glow border border-emerald-500/40 flex items-center justify-between gap-2 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {selectedMapTarget.type === 'Gate' ? '🚪' : selectedMapTarget.type === 'Concession' ? '🍔' : '📍'}
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">{selectedMapTarget.name}</h4>
                <p className="text-[11px] text-slate-300 flex items-center gap-2">
                  <span>Sector: {selectedMapTarget.sector || 'Main Level'}</span>
                  {selectedMapTarget.waitMin !== undefined && (
                    <span className="font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" /> {selectedMapTarget.waitMin} min wait
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedMapTarget.item && (
                <button
                  onClick={() => setActiveOrderModal(selectedMapTarget.item)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Express Pickup
                </button>
              )}
              <button
                onClick={() => setSelectedMapTarget(null)}
                className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Gate Telemetry Grid Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        {gates.slice(0, 4).map((gate) => (
          <div
            key={gate.id}
            onClick={() => setSelectedMapTarget({ name: gate.id, type: 'Gate', waitMin: gate.waitMin, sector: gate.sector })}
            className={`p-2 rounded-lg border cursor-pointer transition-all ${
              gate.status === 'Congested' 
                ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500' 
                : 'bg-slate-900/60 border-white/10 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-0.5">
              <span className="font-semibold text-slate-200 truncate">{gate.id.split(' ')[0]} {gate.id.split(' ')[1]}</span>
              <span 
                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold"
                style={{ backgroundColor: `${gate.color}25`, color: gate.color }}
              >
                {gate.waitMin} min
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ width: `${gate.crowdDensity}%`, backgroundColor: gate.color }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

import React from 'react';
import { useStadium } from '../../context/StadiumContext';
import { 
  Train, 
  Bus, 
  Car, 
  Accessibility, 
  Leaf, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  Sparkles
} from 'lucide-react';

export const TransitAssistant = () => {
  const { transitHubs, matchInfo } = useStadium();

  return (
    <div className="space-y-4">
      {/* Real-time Transit Operations Cards */}
      <div className="glass-panel p-4 border border-blue-500/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-heading">
            <Train className="w-4 h-4 text-cyan-400" />
            GenAI Real-Time Exit & Transit Router
          </h3>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
            Live Schedule Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {transitHubs.map((hub) => (
            <div
              key={hub.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    {hub.mode.includes('Rail') ? <Train className="w-3.5 h-3.5 text-cyan-400" /> : hub.mode.includes('Bus') ? <Bus className="w-3.5 h-3.5 text-amber-400" /> : <Car className="w-3.5 h-3.5 text-emerald-400" />}
                    {hub.name.split(' ')[0]} {hub.name.split(' ')[1]}
                  </span>
                  {hub.accessible && (
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Accessibility className="w-3 h-3" /> Ramp
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-mono">{hub.mode}</p>
                <div className="text-xs text-emerald-300 font-mono mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" /> {hub.nextDeparture}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5 text-[11px] text-slate-300">
                <span className="text-[10px] font-bold text-cyan-400 block mb-0.5">💡 GenAI Travel Tip:</span>
                {hub.aiAdvice}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stadium Eco Sustainability Panel */}
      <div className="glass-panel p-4 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Leaf className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">FIFA Green Legacy & Carbon Offset Counter</h4>
              <p className="text-xs text-slate-300">
                MetLife Stadium Net Zero Match Target: <span className="font-mono text-emerald-400 font-bold">{matchInfo.ecoIndex}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Bottles Diverted</span>
              <span className="text-emerald-400 font-bold text-sm">48,290</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Solar Grid Power</span>
              <span className="text-amber-400 font-bold text-sm">1.8 MW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

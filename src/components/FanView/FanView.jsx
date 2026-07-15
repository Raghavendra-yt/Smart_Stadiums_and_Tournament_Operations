import React from 'react';
import { useStadium } from '../../context/StadiumContext';
import { GenAIChatAssistant } from './GenAIChatAssistant';
import { StadiumMapViewer } from './StadiumMapViewer';
import { TransitAssistant } from './TransitAssistant';
import { SmartOrderModal } from './SmartOrderModal';
import { 
  Clock, 
  Sparkles, 
  Compass, 
  ShoppingBag, 
  Accessibility, 
  Layers,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const FanView = () => {
  const { gates, concessions, recentOrders } = useStadium();

  const shortestGate = [...gates].sort((a,b) => a.waitMin - b.waitMin)[0];
  const shortestConcession = [...concessions].sort((a,b) => a.waitMin - b.waitMin)[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4 lg:px-8">
      
      {/* Top Telemetry Quick Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider">Fastest Gate Entry</span>
            <span className="font-bold text-sm text-white">{shortestGate.id.split(' ')[0]} {shortestGate.id.split(' ')[1]}</span>
            <span className="text-xs font-mono text-emerald-400 block font-semibold">{shortestGate.waitMin} min wait time</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
            🚪
          </div>
        </div>

        <div className="glass-panel p-3.5 border-l-4 border-l-cyan-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider">Shortest Food Line</span>
            <span className="font-bold text-sm text-white truncate max-w-[130px] block">{shortestConcession.name.split(' ')[0]} {shortestConcession.name.split(' ')[1]}</span>
            <span className="text-xs font-mono text-cyan-400 block font-semibold">{shortestConcession.waitMin} min ({shortestConcession.location.split(' ')[0]} 1)</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
            🌮
          </div>
        </div>

        <div className="glass-panel p-3.5 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider">Accessibility Lift</span>
            <span className="font-bold text-sm text-white">Elevator Bay 3</span>
            <span className="text-xs font-mono text-amber-400 block font-semibold">Operational (0 Queue)</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Accessibility className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-3.5 border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider">My Active Mobile Orders</span>
            <span className="font-bold text-sm text-white font-mono">{recentOrders.length} Express Pickup</span>
            <span className="text-xs text-purple-300 block">QR Scan Ready</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
            🛍️
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: GenAI Concierge & Interactive Stadium Pitch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenAIChatAssistant />
        <StadiumMapViewer />
      </div>

      {/* Real-time Transit Router & Eco Sustainability */}
      <TransitAssistant />

      {/* Modal Dialog for Food Orders */}
      <SmartOrderModal />

    </div>
  );
};

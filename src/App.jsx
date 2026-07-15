import React from 'react';
import { StadiumProvider, useStadium } from './context/StadiumContext';
import { Navbar } from './components/Navbar';
import { FanView } from './components/FanView/FanView';
import { OpsView } from './components/OpsView/OpsView';
import { StaffView } from './components/StaffView/StaffView';
import { Sparkles } from 'lucide-react';

const MainContent = () => {
  const { currentRole } = useStadium();

  return (
    <main className="min-h-screen pb-16 flex flex-col justify-between">
      <div>
        <Navbar />

        {currentRole === 'fan' && <FanView />}
        {currentRole === 'ops' && <OpsView />}
        {currentRole === 'volunteer' && <StaffView />}
      </div>

      <footer className="mt-12 border-t border-white/10 pt-6 px-4 max-w-7xl mx-auto w-full text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block pulse-emerald"></span>
          <span>StadiumPulse GenAI Telemetry Engine v2.4 • MetLife Stadium 2026 Host Venue</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 cursor-pointer transition-colors">FIFA Safety & Security Compliant</span>
          <span>•</span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Powered by Gemini Generative AI
          </span>
        </div>
      </footer>
    </main>
  );
};

export default function App() {
  return (
    <StadiumProvider>
      <MainContent />
    </StadiumProvider>
  );
}

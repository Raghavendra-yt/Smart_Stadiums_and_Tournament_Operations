import React from 'react';
import { useStadium } from '../context/StadiumContext';
import { 
  ShieldAlert, 
  UserCheck, 
  Compass, 
  Languages, 
  Volume2, 
  VolumeX, 
  Activity,
  Globe,
  Radio
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    selectedLanguage, 
    setSelectedLanguage, 
    matchInfo,
    incidents,
    isSpeechEnabled,
    setIsSpeechEnabled
  } = useStadium();

  const activeAlertsCount = incidents.filter(i => i.severity === 'HIGH' && i.status !== 'Resolved - Cleared').length;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3 mb-6 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding & Match Banner */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-wide font-heading">
                  StadiumPulse <span className="text-emerald-400">AI</span>
                </span>
                <span className="fifa-badge text-[10px] px-2 py-0.5 rounded-full uppercase">
                  FIFA 2026™
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block pulse-emerald"></span>
                {matchInfo.venue.split(' - ')[0]} • Live Operations Telemetry
              </p>
            </div>
          </div>

          {/* Mobile indicator */}
          <div className="md:hidden flex items-center gap-2">
            {activeAlertsCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-1 pulse-red">
                <ShieldAlert className="w-3.5 h-3.5" /> {activeAlertsCount}
              </span>
            )}
          </div>
        </div>

        {/* Center: Live Match Ticker Pill */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{matchInfo.matchTime}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
            <span>{matchInfo.homeTeam.flag} {matchInfo.homeTeam.name}</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono text-sm">
              {matchInfo.homeTeam.score} - {matchInfo.awayTeam.score}
            </span>
            <span>{matchInfo.awayTeam.name} {matchInfo.awayTeam.flag}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-slate-400 font-mono">
            👥 {matchInfo.attendance.toLocaleString()} Attendance
          </span>
        </div>

        {/* Right: Role Switcher & Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Role Switch Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/10 text-xs">
            <button
              onClick={() => setCurrentRole('fan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentRole === 'fan'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Fan Hub</span>
            </button>
            <button
              onClick={() => setCurrentRole('ops')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentRole === 'ops'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Ops Command</span>
              {activeAlertsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeAlertsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentRole('volunteer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentRole === 'volunteer'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Volunteer</span>
            </button>
          </div>

          {/* Voice Speech Toggle */}
          <button
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
            title={isSpeechEnabled ? "Voice Output Active" : "Voice Output Muted"}
            className={`p-2 rounded-lg border transition-all ${
              isSpeechEnabled 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-800/80 border-white/10 text-slate-500 hover:text-slate-300'
            }`}
          >
            {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs font-mono rounded-lg glass-input cursor-pointer bg-slate-900 border-white/10 text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="en">🇺🇸 EN</option>
              <option value="es">🇲🇽 ES</option>
              <option value="pt">🇧🇷 PT</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="ar">🇸🇦 AR</option>
              <option value="de">🇩🇪 DE</option>
            </select>
          </div>

        </div>

      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';

export function OpsView() {
  // Map & Heatmap state
  const [anomalyMSE, setAnomalyMSE] = useState(0.2);
  const [activeTab, setActiveTab] = useState('face'); // 'face' | 'resource'
  const [viewMode, setViewMode] = useState('crowd'); // 'crowd' | 'security'

  // Predictive Bottleneck AI state
  const [forecastMin, setForecastMin] = useState(15);
  const [forecastSpike, setForecastSpike] = useState(15);

  // Radio Command state
  const [radioInput, setRadioInput] = useState('');
  const [radioLogs, setRadioLogs] = useState([
    { id: 1, text: 'Monitoring radio streams. Speak or type commands to log directly into central timeline.', type: 'system' }
  ]);
  const [isMicRecording, setIsMicRecording] = useState(false);

  // Facial Recognition state
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceAlert, setFaceAlert] = useState(false);
  const [faceTerminalText, setFaceTerminalText] = useState('> Extrapolating 512D vector...');
  const [mapIncidentMarkerVisible, setMapIncidentMarkerVisible] = useState(false);

  // Alarm & Header State
  const [alarmActive, setAlarmActive] = useState(false);
  const [incidentLabel, setIncidentLabel] = useState('No Active Alerts');
  const [actionBarText, setActionBarText] = useState('No context-specific actions available. Monitoring systems.');
  const [actionBarButtons, setActionBarButtons] = useState(['BROADCAST ALERT', 'SIMULATE INCIDENT']);

  // Global Timeline state
  const [timelineItems, setTimelineItems] = useState([
    { id: 1, time: '19:10', text: 'Security Sector West rotation complete', color: 'secondary' },
    { id: 2, time: '19:15', text: 'Fan sentiment dip detected in Zone C', color: 'primary' },
    { id: 3, time: '19:20', text: 'Concession bandwidth stabilized', color: 'secondary' }
  ]);

  // Telemetry Backbone integration
  useEffect(() => {
    if (window.telemetryBackbone) {
      const unsub = window.telemetryBackbone.subscribe((event) => {
        if (event.type === 'ADD_TIMELINE_INCIDENT') {
          setTimelineItems((prev) => [
            {
              id: Date.now(),
              time: event.payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: event.payload.text,
              color: event.payload.severity
            },
            ...prev
          ]);
        }
      });
      return () => unsub();
    }
  }, []);

  // Update Anomaly MSE & Alarm
  const handleAnomalyChange = (val) => {
    setAnomalyMSE(val);
    if (window.telemetryBackbone) {
      window.telemetryBackbone.setAnomalyMSE(val, 'Sector North Gate 4');
    }
    if (val > 0.7) {
      setAlarmActive(true);
      setIncidentLabel(`CRITICAL ANOMALY: MSE ${val.toFixed(3)}`);
      addTimelineItem(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'Critical Anomaly Detected Sector North', 'error');
    } else {
      setAlarmActive(false);
      setIncidentLabel('No Active Alerts');
    }
  };

  const addTimelineItem = (time, text, color) => {
    setTimelineItems((prev) => [{ id: Date.now(), time, text, color }, ...prev]);
  };

  // Forecast slider change
  const handleForecastChange = (val) => {
    setForecastMin(val);
    const spike = Math.min(60, Math.round(val * 0.95 + 10));
    setForecastSpike(spike);
    if (window.telemetryBackbone) {
      window.telemetryBackbone.setPredictivePeak(spike);
    }
  };

  // Auto dispatch
  const handleAutoDispatch = () => {
    if (window.telemetryBackbone) {
      window.telemetryBackbone.dispatchTask('Gate 4', `Pre-empt Gate 4 Crowd Surge (${forecastMin}m Forecast)`, 'HIGH');
    }
    alert('[AIOPS DISPATCHED] Shift volunteers at Gate 4 notified to expand lane throughput for predicted surge.');
  };

  // Radio command dispatch
  const handleSendRadio = (textToSend = radioInput, isVoice = false) => {
    if (!textToSend.trim()) return;
    const msg = textToSend.trim();
    setRadioLogs((prev) => [...prev, { id: Date.now(), text: msg, isVoice, type: 'user' }]);
    if (window.telemetryBackbone) {
      window.telemetryBackbone.addIncident(`Radio Report: ${msg}`, isVoice ? 'secondary' : 'primary');
      if (msg.toLowerCase().includes('dispatch') || msg.toLowerCase().includes('gate')) {
        window.telemetryBackbone.dispatchTask('Gate 4', `Voice Dispatch: ${msg}`, 'HIGH');
      }
    }
    setRadioInput('');
  };

  // Record radio voice simulation
  const handleMicClick = () => {
    setIsMicRecording(true);
    setTimeout(() => {
      setIsMicRecording(false);
      handleSendRadio('Sector North Gate 4 bottleneck clear path for medical shuttle', true);
    }, 1500);
  };

  // Simulate Photo Upload & Search
  const handleDropzoneClick = () => {
    setFaceScanning(true);
    setTimeout(() => {
      setFaceTerminalText('> Comparing with CCTV vectors...');
    }, 1000);
    setTimeout(() => {
      setFaceScanning(false);
      setFaceAlert(true);
      setMapIncidentMarkerVisible(true);
      addTimelineItem(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'Facial Embedding Match Sector South', 'error');
      setActionBarText('SECURITY ALERT: Match detected in Sector South. Dispatch available unit?');
      setActionBarButtons(['DISPATCH UNIT', 'FOLLOW ON CCTV']);
    }, 2500);
  };

  // Dismiss Face Alert
  const handleDismissFace = (e) => {
    e.stopPropagation();
    setFaceAlert(false);
    setMapIncidentMarkerVisible(false);
    setActionBarText('No context-specific actions available. Monitoring systems.');
    setActionBarButtons(['BROADCAST ALERT', 'SIMULATE INCIDENT']);
  };

  // Primary action button trigger
  const handlePrimaryActionButtonClick = (btnName) => {
    if (btnName.includes('SIMULATE INCIDENT')) {
      setActionBarText('MEDICAL ALERT: Sector East concourse. Send paramedics?');
      setActionBarButtons(['DISPATCH MEDICS', 'CLEAR EXIT PATH']);
      addTimelineItem(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'Medical Emergency Sector East', 'primary');
      if (window.telemetryBackbone) {
        window.telemetryBackbone.dispatchTask('Gate 4', 'Emergency Paramedic Escort Sector East', 'HIGH');
      }
    } else {
      alert(`[COMMAND ACTION EXECUTED] ${btnName}`);
    }
  };

  // Heatmap SVG grid cells generation
  const cols = 20;
  const rows = 12;
  const cellW = 800 / cols;
  const cellH = 500 / rows;
  const gridCells = [];

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const distNorth = Math.hypot(i - 3, j - 3);
      let intensity = 0;
      if (distNorth < 4) intensity = (1 - distNorth / 4) * (0.5 + anomalyMSE * 0.5);
      else intensity = (i * j % 5) * 0.05;

      let fill = 'rgba(133, 223, 114, 0.1)';
      if (intensity > 0.8) fill = 'rgba(255, 180, 171, 0.5)';
      else if (intensity > 0.5) fill = 'rgba(233, 196, 0, 0.4)';

      gridCells.push(
        <rect
          key={`${i}-${j}`}
          x={100 + i * cellW}
          y={50 + j * cellH}
          width={cellW}
          height={cellH}
          fill={fill}
        />
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md">
      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-8 space-y-10">
        {/* Header Hero */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-outline-variant/30">
          <div>
            <h1 className="font-display-xl text-headline-lg-mobile md:text-display-xl text-primary-fixed-dim mb-2">
              Organizer Control Room
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Spatial crowd telemetry, predictive bottleneck AI, incident command actions, and live stadium intelligence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-surface-container-high px-3.5 py-1.5 rounded-full border border-outline-variant/30 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block animate-pulse"></span>
              <span className="text-xs font-label-bold text-on-surface">AIOPS: NOMINAL</span>
            </div>
            <div className="bg-error-container text-on-error-container px-3.5 py-1.5 rounded-full border border-error/30 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full bg-error ${alarmActive ? 'pulse-dot' : ''}`}></span>
              <span className="text-xs font-label-bold uppercase">{incidentLabel}</span>
            </div>
          </div>
        </header>

        {/* Control Room Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Telemetry Area (Left 7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Stadium Command View */}
            <div className={`glass-panel rounded-2xl p-6 flex flex-col relative stadium-accent overflow-hidden shadow-xl min-h-[420px] ${alarmActive ? 'global-alarm' : ''}`}>
              <div className="pb-3 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high/40 rounded-t-xl -mx-6 -mt-6 p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-fixed-dim text-[22px]">stadium</span>
                  <h3 className="font-headline-md text-sm font-bold uppercase tracking-wider text-on-surface">Spatial Crowd Telemetry</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-label-bold text-[9px] text-on-surface-variant">ANOMALY MSE</span>
                    <input
                      className="w-20 h-1 accent-primary-fixed-dim"
                      max="1"
                      min="0"
                      step="0.05"
                      type="range"
                      value={anomalyMSE}
                      onChange={(e) => handleAnomalyChange(parseFloat(e.target.value))}
                    />
                    <span className="font-label-bold text-[10px] text-primary-fixed-dim w-10 text-right">
                      {anomalyMSE.toFixed(3)}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-outline-variant/30"></div>
                  <div className="flex gap-1">
                    <button
                      className={`px-3 py-1 rounded text-[9px] font-label-bold ${
                        viewMode === 'crowd' ? 'bg-primary-fixed-dim text-on-primary-fixed' : 'text-on-surface-variant hover:bg-surface-variant'
                      }`}
                      onClick={() => setViewMode('crowd')}
                    >
                      DENSITY
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-[9px] font-label-bold ${
                        viewMode === 'security' ? 'bg-primary-fixed-dim text-on-primary-fixed' : 'text-on-surface-variant hover:bg-surface-variant'
                      }`}
                      onClick={() => setViewMode('security')}
                    >
                      SECURITY
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-grow relative bg-[#0a0a0a] flex items-center justify-center rounded-xl overflow-hidden min-h-[300px]">
                <svg className="w-full h-full object-contain relative z-10" viewBox="0 0 1000 600">
                  <g fill="none" stroke="#333" strokeWidth="1.5">
                    <rect className="hover:stroke-primary-fixed-dim transition-colors" height="500" rx="250" width="800" x="100" y="50"></rect>
                    <rect className="hover:stroke-primary-fixed-dim transition-colors" height="400" rx="150" width="600" x="200" y="100"></rect>
                    <rect className="hover:stroke-primary-fixed-dim transition-colors" height="300" rx="50" width="400" x="300" y="150"></rect>
                    <rect fill="#001a00" height="200" stroke="#006300" strokeWidth="1.5" width="300" x="350" y="200"></rect>
                  </g>
                  <g opacity="0.6" style={{ mixBlendMode: 'plus-lighter' }}>
                    {gridCells}
                  </g>
                  {mapIncidentMarkerVisible && (
                    <circle cx="300" cy="450" fill="#ffb4ab" r="12" className="pulse-dot" />
                  )}
                </svg>

                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-surface-container/80 backdrop-blur border border-outline-variant/30 p-2 rounded text-[10px]">
                    <div className="text-on-surface-variant mb-1 font-label-bold">SECTOR NORTH</div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-surface-variant h-1 rounded-full">
                        <div className="bg-error h-1 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                      <span className="font-label-bold text-error">98%</span>
                    </div>
                  </div>

                  <div className="bg-surface-container/80 backdrop-blur border border-outline-variant/30 p-2 rounded text-[10px]">
                    <div className="text-on-surface-variant mb-1 font-label-bold">SECTOR SOUTH</div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-surface-variant h-1 rounded-full">
                        <div className="bg-secondary h-1 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                      <span className="font-label-bold text-secondary">64%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sector Analysis & Action Bar */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-label-bold text-on-surface-variant uppercase tracking-widest">Comparative Sector Analysis</h3>
                <span className="text-[9px] text-primary-fixed-dim bg-primary-fixed-dim/10 px-2 py-0.5 rounded">AUTO-REFRESH: 5S</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-on-surface-variant border-b border-outline-variant/20">
                    <th className="pb-2 font-medium">SECTOR</th>
                    <th className="pb-2 font-medium">THROUGHPUT (PPM)</th>
                    <th className="pb-2 font-medium">LOAD (%)</th>
                    <th className="pb-2 font-medium">STATUS</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface">
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-2.5 font-bold">NORTH</td>
                    <td className="py-2.5">420 <span className="text-error text-[10px] ml-1">▲ 12%</span></td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">98% <div className="flex-grow bg-surface-variant h-1.5 rounded-full"><div className="bg-error h-1.5 w-[98%]"></div></div></div>
                    </td>
                    <td className="py-2.5 text-error font-label-bold">CRITICAL</td>
                  </tr>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-2.5 font-bold">SOUTH</td>
                    <td className="py-2.5">280 <span className="text-secondary text-[10px] ml-1">▼ 3%</span></td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">64% <div className="flex-grow bg-surface-variant h-1.5 rounded-full"><div className="bg-secondary h-1.5 w-[64%]"></div></div></div>
                    </td>
                    <td className="py-2.5 text-secondary font-label-bold">OPTIMAL</td>
                  </tr>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-2.5 font-bold">EAST</td>
                    <td className="py-2.5">310 <span className="text-on-surface-variant text-[10px] ml-1">≈ 1%</span></td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">72% <div className="flex-grow bg-surface-variant h-1.5 rounded-full"><div className="bg-primary-fixed-dim h-1.5 w-[72%]"></div></div></div>
                    </td>
                    <td className="py-2.5 text-primary-fixed-dim font-label-bold">NOMINAL</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">WEST</td>
                    <td className="py-2.5">190 <span className="text-on-surface-variant text-[10px] ml-1">≈ 0%</span></td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">45% <div className="flex-grow bg-surface-variant h-1.5 rounded-full"><div className="bg-secondary h-1.5 w-[45%]"></div></div></div>
                    </td>
                    <td className="py-2.5 text-secondary font-label-bold">OPTIMAL</td>
                  </tr>
                </tbody>
              </table>

              {/* Action Bar */}
              <div className="bg-primary-fixed-dim/10 border border-primary-fixed-dim/20 rounded-xl p-4 flex items-center justify-between transition-all mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed-dim">
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-label-bold text-on-surface-variant uppercase">Command Actions</div>
                    <div className="text-xs text-on-surface">{actionBarText}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {actionBarButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      className={`px-4 py-2 ${
                        btn.includes('INCIDENT') || btn.includes('DISPATCH')
                          ? 'bg-primary-fixed-dim text-on-primary-fixed'
                          : 'bg-surface-container-highest text-on-surface'
                      } text-xs font-bold rounded-lg border border-outline-variant/30 hover:neon-glow transition-all`}
                      onClick={() => handlePrimaryActionButtonClick(btn)}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Area (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Forecast & Hardware */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary-fixed-dim text-sm">trending_up</span>
                    <h3 className="text-[10px] font-label-bold text-on-surface-variant uppercase">Predictive Bottleneck AI</h3>
                  </div>
                  <span className="text-[9px] font-mono text-error font-bold">+{forecastSpike}% PEAK</span>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="relative h-12 w-full my-2">
                    <svg className="w-full h-full" viewBox="0 0 200 80">
                      <path className="trend-line" d="M0,70 Q25,65 50,55 T100,45 T150,20 T200,10" fill="none" stroke="#e9c400" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 my-1">
                    <span className="text-[8px] text-on-surface-variant">Forecast +{forecastMin}m:</span>
                    <input
                      className="w-full h-1 accent-primary-fixed-dim"
                      max="60"
                      min="5"
                      step="5"
                      type="range"
                      value={forecastMin}
                      onChange={(e) => handleForecastChange(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[9px] text-on-surface-variant leading-tight">Spike at Gate 4 in {forecastMin} mins.</p>
                    <button className="px-2.5 py-1 bg-primary-fixed-dim text-on-primary-fixed text-[9px] font-bold rounded-md hover:neon-glow" onClick={handleAutoDispatch}>
                      AUTO DISPATCH
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 flex flex-col shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary-fixed-dim text-sm">settings_input_antenna</span>
                  <h3 className="text-[11px] font-label-bold text-on-surface-variant uppercase">Hardware Matrix</h3>
                </div>
                <div className="flex flex-col gap-2.5 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">CCTV FEEDS (842)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">EDGE NODES</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">LATENCY (12ms)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim"></span>
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-outline-variant/10 flex justify-between text-xs">
                  <span className="text-on-surface-variant">Uptime 99.98%</span>
                  <span className="text-secondary font-bold">STABLE</span>
                </div>
              </div>
            </div>

            {/* Sidebar Tabs */}
            <div className="glass-panel rounded-2xl flex flex-col shadow-xl overflow-hidden min-h-[220px]">
              <div className="flex border-b border-outline-variant/20 bg-surface-container-high/40">
                <button
                  className={`flex-1 px-4 py-2.5 text-xs font-label-bold uppercase tracking-wider ${
                    activeTab === 'face' ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setActiveTab('face')}
                >
                  Facial Matcher
                </button>
                <button
                  className={`flex-1 px-4 py-2.5 text-xs font-label-bold uppercase tracking-wider ${
                    activeTab === 'resource' ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setActiveTab('resource')}
                >
                  Reallocator
                </button>
              </div>

              <div className="p-4 flex-grow flex flex-col">
                {activeTab === 'face' ? (
                  <div className="h-full flex flex-col gap-3 min-h-[140px]">
                    <div
                      className="border-2 border-dashed border-outline-variant/40 rounded-xl bg-surface-container-low/50 flex-grow flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary-fixed-dim/50 transition-all group relative overflow-hidden"
                      onClick={handleDropzoneClick}
                    >
                      <span className="material-symbols-outlined text-[36px] text-on-surface-variant group-hover:text-primary-fixed-dim transition-colors mb-2">
                        face_retouching_natural
                      </span>
                      <span className="text-xs font-bold text-on-surface text-center">UPLOAD PHOTO FOR EMBEDDING SEARCH</span>

                      {faceScanning && (
                        <div className="absolute inset-0 bg-surface-container-highest/90 flex flex-col items-center justify-center p-4 z-20">
                          <div className="w-10 h-10 rounded-full border-2 border-primary-fixed-dim border-t-transparent animate-spin mb-3"></div>
                          <div className="text-[10px] font-mono text-primary-fixed-dim text-center">{faceTerminalText}</div>
                        </div>
                      )}

                      {faceAlert && (
                        <div className="absolute inset-0 bg-error/90 flex flex-col items-center justify-center p-4 z-30 animate-pulse">
                          <span className="material-symbols-outlined text-[36px] text-on-error mb-2">warning</span>
                          <span className="font-bold text-sm text-on-error uppercase">98.4% MATCH FOUND</span>
                          <span className="text-[10px] text-on-error">SECTOR SOUTH GATES</span>
                          <button className="mt-4 px-3 py-1 bg-on-error text-error text-[10px] font-bold rounded-md" onClick={handleDismissFace}>
                            DISMISS
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col gap-3">
                    <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-3 text-xs">
                      <div className="grid grid-cols-3 font-bold border-b border-outline-variant/20 pb-1 mb-1">
                        <span>UNIT</span><span>SECTOR</span><span>STATUS</span>
                      </div>
                      <div className="grid grid-cols-3 py-1"><span>Alpha-01</span><span>South</span><span className="text-secondary">Ready</span></div>
                      <div className="grid grid-cols-3 py-1"><span>Beta-04</span><span>North</span><span className="text-error">Busy</span></div>
                    </div>
                    <button className="w-full py-2.5 bg-primary-fixed-dim text-on-primary-fixed font-bold text-xs rounded-lg hover:neon-glow transition-all" onClick={() => alert('Running GreedyAssign Optimization...')}>
                      RUN GREEDYASSIGN OPTIMIZATION
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Multi-Modal Radio */}
            <div className="glass-panel rounded-2xl flex flex-col shadow-xl overflow-hidden min-h-[220px]">
              <div className="p-3 px-4 border-b border-outline-variant/20 bg-surface-container-high/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed-dim text-sm">mic</span>
                  <h3 className="text-xs font-label-bold text-on-surface-variant uppercase">Multi-Modal Radio Command</h3>
                </div>
                <span className="text-[9px] bg-secondary/20 text-secondary font-mono px-1.5 py-0.5 rounded">VOICE SYSTEM ONLINE</span>
              </div>
              <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-2 max-h-[140px]" role="status" aria-live="polite">
                {radioLogs.map((log) => (
                  <div
                    key={log.id}
                    className={
                      log.type === 'system'
                        ? 'bg-surface-container-low p-2.5 rounded-xl rounded-tl-none border border-outline-variant/10 self-start max-w-[90%]'
                        : 'bg-primary-fixed-dim/20 p-2.5 rounded-xl rounded-tr-none border border-primary-fixed-dim/30 self-end max-w-[90%]'
                    }
                  >
                    <p className="text-xs text-on-surface">
                      {log.isVoice ? `🎙️ VOICE RADIO REPORT: "${log.text}"` : log.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low/30 flex gap-2 items-center">
                <button
                  className={`p-2 rounded-lg transition-colors shrink-0 ${
                    isMicRecording ? 'bg-error text-on-error animate-pulse' : 'bg-surface-container-highest text-primary-fixed-dim'
                  }`}
                  onClick={handleMicClick}
                  title="Simulate Radio Voice Input"
                >
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                </button>
                <input
                  className="w-full bg-surface-container-highest border-outline-variant text-on-surface rounded-lg py-1.5 pl-3 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary-fixed-dim"
                  placeholder="Radio report or AI command..."
                  type="text"
                  maxLength={250}
                  value={radioInput}
                  onChange={(e) => setRadioInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendRadio()}
                />
                <button
                  className="p-2 bg-primary-fixed-dim text-on-primary-fixed rounded-lg hover:neon-glow transition-colors shrink-0"
                  onClick={() => handleSendRadio()}
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Incident Timeline Bar */}
        <section className="glass-panel rounded-2xl p-4 shadow-xl overflow-hidden flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <span className="text-xs font-label-bold text-on-surface-variant uppercase tracking-wider">Global Incident Timeline</span>
            <span className="text-[10px] text-primary-fixed-dim font-mono">LIVE FEED ACTIVE</span>
          </div>
          <div className="overflow-x-auto timeline-scroll flex items-center gap-4 py-2">
            {timelineItems.map((item) => {
              const borderCol = item.color === 'error' ? 'border-l-error' : item.color === 'primary' ? 'border-l-primary-fixed-dim' : 'border-l-secondary';
              const textCol = item.color === 'error' ? 'text-error' : item.color === 'primary' ? 'text-primary-fixed-dim' : 'text-secondary';
              return (
                <div key={item.id} className={`flex items-center gap-2 shrink-0 bg-surface-container-high/40 px-3 py-1.5 rounded-lg border border-outline-variant/10 border-l-4 ${borderCol}`}>
                  <span className={`text-[10px] font-bold ${textCol}`}>{item.time}</span>
                  <span className="text-xs text-on-surface">{item.text}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <footer className="w-full py-12 px-gutter flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-lowest border-t border-outline-variant/10 mt-16 font-caption text-caption text-secondary-fixed-dim">
        <span className="font-display-xl text-headline-md text-on-surface">World Cup 2026 GenAI</span>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors underline" href="#">Sustainability</a>
          <a className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors underline" href="#">Legal</a>
          <a className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors underline" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors underline" href="#">Terms of Service</a>
          <a className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors underline" href="#">AI Ethics</a>
        </div>
        <span>© 2026 FIFA World Cup GenAI • MetLife Stadium Host Venue</span>
      </footer>
    </div>
  );
}

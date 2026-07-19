import React, { useState, useEffect } from 'react';

export function FanView() {
  // A11y Panel State
  const [a11yOpen, setA11yOpen] = useState(false);
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(100);
  const [paRibbonActive, setPaRibbonActive] = useState(false);
  const [paRibbonText, setPaRibbonText] = useState(
    'MATCH UPDATE: Delay on Blue Line transit corridor. Expect +15 min travel times to North Gates. Alternate routes updated in Transit Planner.'
  );
  const [offlineEmergency, setOfflineEmergency] = useState(false);

  // Transit & Corridor State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [tapToPay, setTapToPay] = useState(true);
  const [busBadgeText, setBusBadgeText] = useState('CLEAR');
  const [busBadgeClass, setBusBadgeClass] = useState('bg-primary-fixed-dim text-on-primary-fixed');

  // Navigation & Haptics State
  const [navMode, setNavMode] = useState('wheelchair'); // 'wheelchair' | 'visual'

  // GenAI AD & VQA Chat State
  const [adSubtitleIndex, setAdSubtitleIndex] = useState(0);
  const subtitles = [
    '"Messi receives on the right flank, feints past the defender..."',
    '"A quick pass to the center, the crowd is on their feet!"',
    '"He shoots! It just grazes the top of the crossbar."'
  ];
  const [vqaMessages, setVqaMessages] = useState([
    { sender: 'user', text: 'Where is the ball right now?' },
    { sender: 'ai', text: 'The ball is currently in the midfield, just crossed the halfway line towards the northern goal.' }
  ]);
  const [vqaInputText, setVqaInputText] = useState('');

  // Carbon Accounting State
  const [flightClass, setFlightClass] = useState('economy');
  const [flightDist, setFlightDist] = useState('');
  const [railDist, setRailDist] = useState('');
  const [hotelNights, setHotelNights] = useState('');
  const [computeOptimized, setComputeOptimized] = useState(true);
  const [selectedOffset, setSelectedOffset] = useState('solar');

  // Telemetry Backbone Subscription
  useEffect(() => {
    if (window.telemetryBackbone) {
      const unsub = window.telemetryBackbone.subscribe((event) => {
        if (event.type === 'TOGGLE_OFFLINE_MODE') {
          setOfflineEmergency(event.payload.enabled);
        } else if (event.type === 'TRIGGER_ANOMALY' && event.payload.mse > 0.7) {
          setPaRibbonActive(true);
          setPaRibbonText(`ALERT: High Crowd Density detected at ${event.payload.sector}. Rerouting suggested.`);
        }
      });
      return () => unsub();
    }
  }, []);

  // AD Subtitle Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAdSubtitleIndex((prev) => (prev + 1) % subtitles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // High Contrast & Font Scale Effect
  useEffect(() => {
    const body = document.getElementById('app-body');
    if (highContrast) {
      body?.classList.add('high-contrast-mode');
    } else {
      body?.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${(fontScale / 100) * 16}px`;
  }, [fontScale]);

  // Violations simulation
  const handleSimulateViolation = () => {
    setBusBadgeText('YELLOW CARD');
    setBusBadgeClass('bg-error text-on-error');
    setTimeout(() => {
      setBusBadgeText('CLEAR');
      setBusBadgeClass('bg-primary-fixed-dim text-on-primary-fixed');
    }, 3000);
  };

  // Send VQA message
  const handleSendVQA = () => {
    if (!vqaInputText.trim()) return;
    const text = vqaInputText.trim();
    setVqaMessages((prev) => [...prev, { sender: 'user', text }]);
    setVqaInputText('');

    setTimeout(() => {
      const responseText = text.toLowerCase().includes('ball')
        ? "Based on the current frame, the ball is in the opponent's penalty area."
        : "Based on the current frame, I can see standard match progression and active crowd movement.";
      setVqaMessages((prev) => [...prev, { sender: 'ai', text: responseText }]);
    }, 800);
  };

  // Carbon calculation
  const flight = parseFloat(flightDist) || 0;
  const rail = parseFloat(railDist) || 0;
  const hotel = parseFloat(hotelNights) || 0;

  const flightEF = flightClass === 'business' ? 0.28 : 0.15;
  const railEF = 0.04;
  const hotelEF = 15;

  const fTotal = flight * flightEF;
  const rTotal = rail * railEF;
  const hTotal = hotel * hotelEF;
  const totalCarbon = Math.round(fTotal + rTotal + hTotal);

  const barFlightPct = totalCarbon > 0 ? (fTotal / (fTotal + rTotal + hTotal)) * 100 : 0;
  const barRailPct = totalCarbon > 0 ? (rTotal / (fTotal + rTotal + hTotal)) * 100 : 0;
  const barHotelPct = totalCarbon > 0 ? (hTotal / (fTotal + rTotal + hTotal)) * 100 : 0;

  const handleGetCertificate = () => {
    if (totalCarbon > 0) {
      alert(`Generating Sustainable Fan Certificate for offsetting ${totalCarbon} kg CO2e... Thank you for contributing to a greener World Cup!`);
    } else {
      alert("Please calculate your footprint first by entering your travel details.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-on-background">
      {/* Offline Emergency Mode Banner */}
      {offlineEmergency && (
        <div className="fixed top-0 left-0 w-full bg-error-container text-on-error-container text-xs py-2 px-gutter z-[70] flex justify-between items-center">
          <div className="flex items-center gap-2 font-label-bold">
            <span className="material-symbols-outlined text-sm animate-pulse">warning</span>
            <span>OFFLINE EMERGENCY MODE ACTIVE — Stadium Wi-Fi Degraded. Displaying Cached Evacuation Routes & Emergency Contacts.</span>
          </div>
          <button
            className="bg-error text-on-error font-bold px-2 py-0.5 rounded text-[10px]"
            onClick={() => {
              setOfflineEmergency(false);
              if (window.telemetryBackbone) window.telemetryBackbone.toggleOfflineEmergency(false);
            }}
          >
            DISMISS
          </button>
        </div>
      )}

      {/* PA Ribbon */}
      {paRibbonActive && (
        <div className={`fixed ${offlineEmergency ? 'top-8' : 'top-0'} left-0 w-full bg-secondary-container text-on-secondary-container text-xs py-1 z-[60] overflow-hidden`}>
          <div className="pa-ribbon font-label-bold">{paRibbonText}</div>
        </div>
      )}

      {/* Accessibility Floating Trigger */}
      <button
        aria-label="Accessibility Settings"
        className="fixed right-6 top-[100px] z-40 bg-surface-container-high text-on-surface p-3 rounded-full shadow-lg border border-outline-variant/30 hover:bg-surface-variant transition-colors group"
        onClick={() => setA11yOpen(!a11yOpen)}
      >
        <span className="material-symbols-outlined group-hover:animate-spin">accessibility_new</span>
      </button>

      {/* Accessibility Panel */}
      {a11yOpen && (
        <div className="fixed right-6 top-[160px] z-40 w-80 glass-panel rounded-xl p-6 flex flex-col gap-4 shadow-2xl border border-outline-variant/40">
          <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2 mb-2">
            <h3 className="font-headline-md text-headline-md text-on-surface">Accessibility</h3>
            <button className="text-on-surface-variant hover:text-on-surface" onClick={() => setA11yOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-body-md text-on-surface-variant">Screen Reader Status</span>
            <div className="relative">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={screenReaderActive}
                onChange={(e) => setScreenReaderActive(e.target.checked)}
              />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-container"></div>
            </div>
          </label>
          {screenReaderActive && <p className="text-xs text-on-surface-variant">VoiceOver / NVDA optimization active.</p>}

          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-body-md text-on-surface-variant">High Contrast</span>
            <div className="relative">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-container"></div>
            </div>
          </label>

          <div className="space-y-2 pt-2 border-t border-outline-variant/30">
            <span className="font-body-md text-on-surface-variant block">Font Scaling ({fontScale}%)</span>
            <input
              className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary-container"
              max="150"
              min="100"
              type="range"
              value={fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
            />
          </div>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-outline-variant/30">
            <span className="font-body-md text-on-surface-variant">PA Ribbon Alerts</span>
            <div className="relative">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={paRibbonActive}
                onChange={(e) => setPaRibbonActive(e.target.checked)}
              />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-container"></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-outline-variant/30">
            <span className="font-body-md text-error flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-sm">wifi_off</span> Offline Emergency Mode
            </span>
            <div className="relative">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={offlineEmergency}
                onChange={(e) => {
                  setOfflineEmergency(e.target.checked);
                  if (window.telemetryBackbone) window.telemetryBackbone.toggleOfflineEmergency(e.target.checked);
                }}
              />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-error"></div>
            </div>
          </label>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-8 space-y-10">
        {/* Header Hero */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-outline-variant/30">
          <div>
            <h1 className="font-display-xl text-headline-lg-mobile md:text-display-xl text-primary-fixed-dim mb-2">Fans Hub</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Multimodal transit planning, real-time corridor monitoring, 3D wayfinding, and GenAI audio match commentary.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="bg-secondary-container text-on-secondary-container font-label-bold text-label-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-secondary-fixed-dim/30">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-pulse"></span> Telemetry Active
            </span>
          </div>
        </header>

        {/* Section 1: Transit & Corridor */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Route Planning Widget */}
            <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
              <h2 className="font-headline-md text-headline-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">route</span> Route Planner
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">my_location</span>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim transition-all outline-none"
                    placeholder="Origin Hub"
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">stadium</span>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim transition-all outline-none"
                    placeholder="Destination Stadium Gate"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-3 bg-surface-container-high rounded-lg cursor-pointer border border-transparent hover:border-outline-variant transition-colors">
                  <div className="relative flex-shrink-0">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={tapToPay}
                      onChange={(e) => setTapToPay(e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary-container"></div>
                  </div>
                  <span className="font-label-bold text-label-bold text-on-surface flex items-center gap-2">
                    Open-Loop Tap-to-Pay <span className="material-symbols-outlined text-sm">contactless</span>
                  </span>
                </label>
                {tapToPay && (
                  <div className="text-xs text-secondary px-3 transition-all duration-300">
                    Digital wallet ready. No physical ticket required.
                  </div>
                )}
              </div>

              <button
                className="mt-auto w-full bg-primary-container text-on-primary-container font-label-bold text-label-bold py-3 rounded-lg hover:bg-primary transition-colors glow-accent"
                onClick={() => alert(`Calculating optimal route from ${origin || 'Origin'} to ${destination || 'Stadium Gate'}`)}
              >
                Calculate Optimal Route
              </button>
            </div>

            {/* Comparison & Map */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rideshare Card */}
                <div className="glass-panel p-5 rounded-xl border-error/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-error-container text-on-error-container font-label-bold text-[10px] px-2 py-1 rounded-bl-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">warning</span> SURGE
                  </div>
                  <h3 className="font-headline-md text-body-lg text-on-surface mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined">local_taxi</span> Rideshare
                  </h3>
                  <div className="space-y-1">
                    <p className="font-label-bold text-error">400-800% Surge Alert</p>
                    <p className="text-on-surface-variant font-caption text-caption">+ 45min walking delay (Traffic bounds)</p>
                  </div>
                </div>

                {/* Optimized Transit Card */}
                <div className="glass-panel p-5 rounded-xl border-secondary/30 relative overflow-hidden bg-secondary-container/10">
                  <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container font-label-bold text-[10px] px-2 py-1 rounded-bl-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> OPTIMAL
                  </div>
                  <h3 className="font-headline-md text-body-lg text-on-surface mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined">train</span> Shuttle & Rail
                  </h3>
                  <div className="space-y-1">
                    <p className="font-label-bold text-secondary">Dedicated Corridors</p>
                    <p className="text-on-surface-variant font-caption text-caption">Estimated Arrival: 14 mins</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="flex-grow rounded-xl overflow-hidden relative border border-outline-variant/30 min-h-[300px]">
                <img
                  alt="Digital transit map"
                  className="w-full h-full object-cover absolute inset-0 opacity-60"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKcvn9uy2eieMahUxOslYUfTqB1zA1ZDUNL9JDr_tVfikPQgiZiRDwk7xdz3SaAPZC5xIQBmCG1EXypvkKaRuqZSglk3JjDOwpTdyeJb9ow_Eorv20GP3pp2e1gCbTRKG6yfuF-yvkZGF1GoD8tLBreVz-43_rmVs1u6zbkb8kz4tvh_2sBBxt7m-hiLW1Fr7fh5fufGHvuKmIX5mNAMh0KtQdzrbLb80pmB-9eIMDWwA0O_CxOLz0-Q"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-lg p-3 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                    </span>
                    <span className="font-label-bold text-caption text-on-surface">Transit Fleet Lane Obstruction Monitor</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="text-xs bg-surface-variant hover:bg-surface-container-highest px-2 py-1 rounded transition-colors text-on-surface-variant"
                      onClick={handleSimulateViolation}
                    >
                      Simulate Violation
                    </button>
                    <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded text-xs border border-primary-fixed-dim/50">
                      <span className="material-symbols-outlined text-[16px] text-primary-fixed-dim">videocam</span>
                      <span className="font-label-bold text-on-surface">Bus-Mounted AI Cam #04</span>
                      <span className={`${busBadgeClass} font-bold px-1.5 py-0.5 rounded ml-2 animate-pulse`}>
                        {busBadgeText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 3D Navigation & Assistive Haptics */}
        <section className="space-y-8 border-t border-outline-variant/20 pt-8">
          <div className="text-center space-y-4">
            <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg text-primary-fixed-dim">
              Inclusive Navigation & Haptics
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto">
              Personalized wayfinding and assistive experiences to guarantee every fan feels the action.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 glass-panel rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
              <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">explore</span> 3D Digital Twin Wayfinding
              </h3>
              <div className="flex bg-surface-container-low rounded-lg p-1">
                <button
                  className={`flex-1 py-2 text-center rounded-md font-label-bold text-sm transition-colors ${
                    navMode === 'wheelchair' ? 'bg-surface-variant text-on-surface' : 'text-on-surface-variant hover:bg-surface-variant'
                  }`}
                  onClick={() => setNavMode('wheelchair')}
                >
                  <span className="material-symbols-outlined block mb-1">accessible</span>
                  Wheelchair Accessible
                </button>
                <button
                  className={`flex-1 py-2 text-center rounded-md font-label-bold text-sm transition-colors ${
                    navMode === 'visual' ? 'bg-surface-variant text-on-surface' : 'text-on-surface-variant hover:bg-surface-variant'
                  }`}
                  onClick={() => setNavMode('visual')}
                >
                  <span className="material-symbols-outlined block mb-1">visibility</span>
                  Visual Aid Priority
                </button>
              </div>
              <div
                className="flex-grow bg-surface-container-highest rounded-xl border border-outline-variant/30 flex items-center justify-center min-h-[200px] text-on-surface-variant p-4 text-center"
                role="status"
                aria-live="polite"
              >
                {navMode === 'wheelchair' ? (
                  <span>Displaying route optimized for wheelchair accessibility: avoiding stairs, prioritizing elevators and wide concourses.</span>
                ) : (
                  <span>Displaying route optimized for visual aids: high contrast pathways, audio beacons active, and minimal obstacle zones.</span>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 glass-panel rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
              <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">vibration</span> Assistive Haptics
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg cursor-pointer border border-outline-variant/30 hover:border-outline-variant transition-colors group">
                  <div>
                    <span className="font-label-bold text-on-surface block mb-1">Footbraille Haptic Insole Sync</span>
                    <span className="text-caption text-on-surface-variant">Real-time match events translated to haptic feedback</span>
                  </div>
                  <div className="relative">
                    <input className="sr-only peer" type="checkbox" defaultChecked />
                    <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-container"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg cursor-pointer border border-outline-variant/30 hover:border-outline-variant transition-colors group">
                  <div>
                    <span className="font-label-bold text-on-surface block mb-1">Unite Headset AD</span>
                    <span className="text-caption text-on-surface-variant">Spatial audio description integration</span>
                  </div>
                  <div className="relative">
                    <input className="sr-only peer" type="checkbox" defaultChecked />
                    <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-container"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: GenAI Audio Description & VQA */}
        <section className="space-y-8 border-t border-outline-variant/20 pt-8">
          <div className="text-center space-y-4">
            <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg text-primary-fixed-dim">
              GenAI Audio Description Suite
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto">
              Customizable, hyper-personalized match commentary powered by real-time spatial vision.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">headphones</span> Live AD Controls
                </h3>
                <select className="bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded-lg focus:ring-primary-fixed-dim focus:border-primary-fixed-dim p-2">
                  <option>Standard Model</option>
                  <option>Visual Nuance Focus</option>
                  <option>Tactical Analysis</option>
                </select>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 text-center relative overflow-hidden group">
                <div className="w-20 h-20 bg-surface-variant rounded-full mx-auto flex items-center justify-center mb-4 relative">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary-fixed-dim/20 animate-ping"></span>
                  <span className="material-symbols-outlined text-[40px] text-primary-fixed-dim">mic</span>
                </div>
                <h4 className="font-label-bold text-on-surface text-lg">AI Audio Description Active</h4>
                <p className="text-on-surface-variant text-sm mt-1 transition-opacity duration-300">
                  {subtitles[adSubtitleIndex]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-bold text-caption text-on-surface-variant">Speech Rate</label>
                  <input
                    className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary-container"
                    max="2"
                    min="0.5"
                    step="0.1"
                    type="range"
                    defaultValue="1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-bold text-caption text-on-surface-variant">Crowd Mix Volume</label>
                  <input
                    className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary-container"
                    max="100"
                    min="0"
                    type="range"
                    defaultValue="70"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/30">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="form-checkbox bg-surface-container-low border-outline-variant text-primary-container rounded" type="checkbox" />
                  <span className="font-caption text-on-surface">Partisan Mode (Home Bias)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="form-checkbox bg-surface-container-low border-outline-variant text-primary-container rounded" type="checkbox" />
                  <span className="font-caption text-on-surface">Track Favorite Athlete Only</span>
                </label>
              </div>
            </div>

            {/* VQA Chat Box */}
            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">forum</span> Visual Question Answering (VQA)
              </h3>

              <div className="flex-grow bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 overflow-y-auto space-y-4 max-h-[300px]" role="status" aria-live="polite">
                {vqaMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={
                        msg.sender === 'user'
                          ? 'bg-surface-variant text-on-surface rounded-l-xl rounded-tr-xl py-2 px-3 text-sm max-w-[85%]'
                          : 'bg-primary-container/10 border border-primary-container/20 text-on-surface rounded-r-xl rounded-tl-xl py-2 px-3 text-sm max-w-[85%]'
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-4 pr-12 text-on-surface focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim transition-all outline-none"
                  placeholder="Ask about the play..."
                  type="text"
                  maxLength={250}
                  value={vqaInputText}
                  onChange={(e) => setVqaInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendVQA()}
                />
                <button
                  className="absolute right-2 top-2 p-1 text-primary-fixed-dim hover:text-primary transition-colors"
                  onClick={handleSendVQA}
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Travel Carbon Accounting & Certified Offset */}
        <section className="space-y-8 border-t border-outline-variant/20 pt-8">
          <div className="text-center space-y-4">
            <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg text-secondary">
              Carbon Accounting & Offset
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto">
              Calculate your travel footprint and contribute to certified sustainable initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div className="glass-panel p-6 rounded-2xl space-y-6 shadow-xl">
              <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">eco</span> Segment Builder
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <select
                    className="bg-surface-container-low border border-outline-variant/50 text-on-surface rounded-lg p-3 w-1/3 text-sm focus:ring-secondary focus:border-secondary"
                    value={flightClass}
                    onChange={(e) => setFlightClass(e.target.value)}
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                  </select>
                  <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/50 flex-grow">
                    <span className="material-symbols-outlined text-on-surface-variant">flight</span>
                    <input
                      className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-label-bold"
                      placeholder="Flight Distance (km)"
                      type="number"
                      value={flightDist}
                      onChange={(e) => setFlightDist(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/50">
                  <span className="material-symbols-outlined text-on-surface-variant">train</span>
                  <input
                    className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-label-bold"
                    placeholder="Rail Distance (km)"
                    type="number"
                    value={railDist}
                    onChange={(e) => setRailDist(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/50">
                  <span className="material-symbols-outlined text-on-surface-variant">hotel</span>
                  <input
                    className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-label-bold"
                    placeholder="Hotel Nights"
                    type="number"
                    value={hotelNights}
                    onChange={(e) => setHotelNights(e.target.value)}
                  />
                </div>
              </div>

              {/* Dynamic Carbon Bar Chart */}
              <div className="h-4 w-full bg-surface-container-low rounded-full overflow-hidden flex">
                <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${barFlightPct}%` }} title="Flight"></div>
                <div className="h-full bg-primary-container transition-all duration-500" style={{ width: `${barRailPct}%` }} title="Rail"></div>
                <div className="h-full bg-error transition-all duration-500" style={{ width: `${barHotelPct}%` }} title="Hotel"></div>
              </div>

              <div className="bg-surface-container-highest p-4 rounded-lg font-label-bold text-caption overflow-x-auto border border-outline-variant/30 space-y-2">
                <p className="text-on-surface-variant">Calculation Models:</p>
                <div className="text-secondary math-tex text-xs">
                  E_total = ∑ (d_i × EF_class) + (N_nights × EF_hotel) + E_local
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                <span className="font-body-lg text-on-surface">Estimated Footprint:</span>
                <span className="font-display-xl text-headline-md text-error">
                  {totalCarbon} <span className="text-caption text-on-surface-variant">kg CO2e</span>
                </span>
              </div>
            </div>

            {/* Offset Selector */}
            <div className="glass-panel p-6 rounded-2xl space-y-6 flex flex-col shadow-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">verified</span> Certified Offsets
                </h3>
                <div className="flex items-center gap-2 group relative">
                  <span className="font-caption text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Optimize Compute
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={computeOptimized}
                      onChange={(e) => setComputeOptimized(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                <button
                  className={`bg-surface-container-low border rounded-xl p-4 text-left hover:bg-surface-variant transition-colors group relative overflow-hidden outline-none ${
                    selectedOffset === 'solar' ? 'border-secondary/80' : 'border-outline-variant'
                  }`}
                  onClick={() => setSelectedOffset('solar')}
                >
                  <span className="material-symbols-outlined text-secondary mb-2">solar_power</span>
                  <h4 className="font-label-bold text-on-surface mb-1">India Solar</h4>
                  <p className="font-caption text-on-surface-variant">Renewable energy expansion</p>
                </button>

                <button
                  className={`bg-surface-container-low border rounded-xl p-4 text-left hover:bg-surface-variant transition-colors group relative overflow-hidden outline-none ${
                    selectedOffset === 'redd' ? 'border-secondary/80' : 'border-outline-variant'
                  }`}
                  onClick={() => setSelectedOffset('redd')}
                >
                  <span className="material-symbols-outlined text-secondary mb-2">forest</span>
                  <h4 className="font-label-bold text-on-surface mb-1">Amazon REDD+</h4>
                  <p className="font-caption text-on-surface-variant">Deforestation prevention</p>
                </button>
              </div>

              <button
                className="w-full bg-transparent border-2 border-primary-container text-on-surface font-label-bold py-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 group"
                onClick={handleGetCertificate}
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">workspace_premium</span>
                Get Sustainable Fan Certificate
              </button>
            </div>
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

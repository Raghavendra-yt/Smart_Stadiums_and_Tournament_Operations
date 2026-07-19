import React, { useState, useEffect } from 'react';

export function StaffView() {
  const [selectedGate, setSelectedGate] = useState('Gate 4');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Assist Fan Wheelchair Transit at Gate 4', priority: 'HIGH', status: 'Pending' },
    { id: 2, title: 'Inspect Bottleneck Queue Scanner #2', priority: 'MEDIUM', status: 'Pending' },
    { id: 3, title: 'Distribute Hydration Packs - Gate 4 Rest Area', priority: 'LOW', status: 'Completed' }
  ]);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Translation & Radio Mic State
  const [micInput, setMicInput] = useState('');
  const [translatedText, setTranslatedText] = useState('Where is the nearest medical tent?');
  const [isMicRecording, setIsMicRecording] = useState(false);

  // Pathfinding State
  const [destinationInput, setDestinationInput] = useState('');

  // Assist Bot Chat State
  const [botMessages, setBotMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I see you are stationed at Gate 4. Crowd flow is currently nominal. How can I assist you with your Fan Assistance duties today?' },
    { id: 2, sender: 'user', text: 'Lost child protocol?' }
  ]);
  const [botInput, setBotInput] = useState('');

  // Sync tasks with telemetryBackbone
  useEffect(() => {
    if (window.telemetryBackbone) {
      const stateTasks = window.telemetryBackbone.state.volunteerTasks[selectedGate] || [];
      setTasks(stateTasks);

      const unsub = window.telemetryBackbone.subscribe((event) => {
        if (event.type === 'DISPATCH_VOLUNTEER_TASK') {
          const updated = window.telemetryBackbone.state.volunteerTasks[selectedGate] || [];
          setTasks(updated);
          setToastMessage(`NEW TASK (${event.payload.gate}): "${event.payload.title}"`);
          setToastVisible(true);
        } else if (event.type === 'TRIGGER_ANOMALY' && event.payload.mse > 0.7) {
          setToastMessage(`ALERT: High density anomaly detected at ${event.payload.sector}!`);
          setToastVisible(true);
        }
      });
      return () => unsub();
    }
  }, [selectedGate]);

  const toggleTaskStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t))
    );
    if (window.telemetryBackbone) {
      const gateTasks = window.telemetryBackbone.state.volunteerTasks[selectedGate] || [];
      const task = gateTasks.find((t) => t.id === taskId);
      if (task) {
        task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
        window.telemetryBackbone.saveState();
      }
    }
  };

  const handleMicClick = () => {
    setIsMicRecording(true);
    setTimeout(() => {
      setIsMicRecording(false);
      setMicInput('Gate 4 queue building up, need 2 extra ticket scanners');
      setTranslatedText('Auto-translated (EN): Gate 4 queue building up, need 2 extra ticket scanners');
    }, 1200);
  };

  const handleDispatchReport = () => {
    if (!micInput.trim()) return;
    setTranslatedText(`[RADIO LOGGED] "${micInput.trim()}"`);
    if (window.telemetryBackbone) {
      window.telemetryBackbone.addIncident(`Volunteer (${selectedGate}): ${micInput.trim()}`, 'secondary');
    }
    setMicInput('');
  };

  const handleSendBotMessage = (textToSend = botInput) => {
    if (!textToSend.trim()) return;
    const text = textToSend.trim();
    setBotMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text }]);
    setBotInput('');

    setTimeout(() => {
      let reply = 'I have logged your request and notified the team.';
      if (text.toLowerCase().includes('child') || text.toLowerCase().includes('lost')) {
        reply = 'Lost Child Protocol: Immediately escort the child to Information Booth #3, notify Sector Control via Radio, and do not leave the child unattended.';
      } else if (text.toLowerCase().includes('water') || text.toLowerCase().includes('spill')) {
        reply = 'Hydration & Spill Response: Water stations are located adjacent to Gate 4 Rest Area. Maintenance dispatches are active.';
      }
      setBotMessages((prev) => [...prev, { id: Date.now(), sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed top-20 right-6 z-[80] bg-primary-fixed-dim text-on-primary-fixed p-3 rounded-lg shadow-xl font-label-bold text-xs flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined">notifications_active</span>
          <span>{toastMessage}</span>
          <button className="text-on-primary-fixed font-bold hover:underline ml-2" onClick={() => setToastVisible(false)}>
            DISMISS
          </button>
        </div>
      )}

      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-8 space-y-10">
        {/* Header Hero */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-outline-variant/30">
          <div>
            <h1 className="font-display-xl text-headline-lg-mobile md:text-display-xl text-primary-fixed-dim mb-2">Volunteer Support Hub</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Manage your shifts, assist fans with AI tools, dispatch voice reports, and access real-time stadium intelligence.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="bg-secondary-container text-on-secondary-container font-label-bold text-label-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-secondary-fixed-dim/30">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-pulse"></span> Shift Active
            </span>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Shift & Contextual Task Manager */}
          <section className="glass-panel rounded-2xl p-6 md:col-span-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed-dim opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed-dim">schedule</span> Current Assignment & Contextual Tasks
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-on-surface-variant font-body-md text-body-md">MetLife Stadium •</span>
                  <select
                    className="bg-surface-container-high border border-outline-variant text-primary-fixed-dim rounded px-2 py-0.5 text-xs font-label-bold"
                    value={selectedGate}
                    onChange={(e) => setSelectedGate(e.target.value)}
                  >
                    <option value="Gate 4">Gate 4 (Sector North)</option>
                    <option value="Gate 2">Gate 2 (Sector East)</option>
                  </select>
                  <span className="text-xs text-secondary font-mono px-2 py-0.5 bg-secondary/10 rounded">📍 GEOFENCE ACTIVE</span>
                </div>
              </div>
              <button
                className="border-2 border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-bold text-label-bold hover:border-primary-fixed-dim transition-colors"
                onClick={() => alert('Checked out of shift. Thank you!')}
              >
                Check Out
              </button>
            </div>

            {/* Task List */}
            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-caption font-label-bold text-on-surface-variant uppercase tracking-wider">
                  Geofenced Priority Tasks
                </span>
                <span className="text-[10px] text-primary-fixed-dim bg-primary-fixed-dim/10 px-2 py-0.5 rounded">
                  {tasks.length} TASKS
                </span>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {tasks.length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic">No pending tasks for {selectedGate}. Standing by...</p>
                ) : (
                  tasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60 border border-outline-variant/20"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${t.priority === 'HIGH' ? 'bg-error' : 'bg-primary-fixed-dim'}`}
                        ></span>
                        <span
                          className={`text-xs text-on-surface ${t.status === 'Completed' ? 'line-through opacity-60' : 'font-medium'}`}
                        >
                          {t.title}
                        </span>
                      </div>
                      <button
                        className={`px-2 py-0.5 text-[9px] font-label-bold rounded ${
                          t.status === 'Completed'
                            ? 'bg-surface-variant text-on-surface-variant'
                            : 'bg-secondary-container text-on-secondary-container hover:bg-secondary'
                        }`}
                        onClick={() => toggleTaskStatus(t.id)}
                      >
                        {t.status === 'Completed' ? 'DONE' : 'MARK COMPLETE'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-high rounded-xl p-4 border border-outline-variant/30">
                <span className="text-caption font-caption text-on-surface-variant block mb-1">Time Remaining</span>
                <span className="font-label-bold text-label-bold text-primary-fixed-dim text-lg">02:15:00</span>
              </div>
              <div className="bg-surface-container-high rounded-xl p-4 border border-outline-variant/30">
                <span className="text-caption font-caption text-on-surface-variant block mb-1">Crowd Density</span>
                <span className="font-label-bold text-label-bold text-secondary-fixed flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_down</span> Low
                </span>
              </div>
              <div className="bg-surface-container-high rounded-xl p-4 border border-outline-variant/30">
                <span className="text-caption font-caption text-on-surface-variant block mb-1">Queue Time</span>
                <span className="font-label-bold text-label-bold text-on-surface">~4 mins</span>
              </div>
              <div className="bg-surface-container-high rounded-xl p-4 border border-outline-variant/30">
                <span className="text-caption font-caption text-on-surface-variant block mb-1">Next Break</span>
                <span className="font-label-bold text-label-bold text-on-surface">14:30 EST</span>
              </div>
            </div>
          </section>

          {/* AI Translation & Radio Dispatch */}
          <section className="glass-panel rounded-2xl p-6 md:col-span-4 flex flex-col bg-surface-container-high border-t-2 border-primary-fixed-dim shadow-xl">
            <h2 className="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">translate</span> Translate & Voice Radio
            </h2>
            <div className="flex-grow flex flex-col gap-4">
              <div className="bg-surface p-3 rounded-lg border border-outline-variant">
                <label className="font-caption text-caption text-on-surface-variant block mb-1">
                  Detecting Language or Radio Speech...
                </label>
                <textarea
                  className="w-full bg-transparent border-none text-on-surface font-body-md text-body-md focus:ring-0 resize-none p-0"
                  placeholder="Tap mic or type report..."
                  rows="2"
                  value={micInput}
                  onChange={(e) => setMicInput(e.target.value)}
                />
              </div>

              <div className="flex justify-center gap-3 my-1">
                <button
                  className={`p-3 rounded-full transition-colors text-on-surface ${
                    isMicRecording ? 'bg-error animate-pulse' : 'bg-surface-container-highest hover:bg-primary-fixed-dim hover:text-on-primary'
                  }`}
                  onClick={handleMicClick}
                  title="Record Voice"
                >
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button
                  className="bg-primary-fixed-dim text-on-primary-fixed px-3 py-2 rounded-lg font-label-bold text-xs hover:neon-glow flex items-center gap-1"
                  onClick={handleDispatchReport}
                >
                  <span className="material-symbols-outlined text-sm">cell_tower</span> Dispatch Radio Report
                </button>
              </div>

              <div className="bg-surface-dim p-3 rounded-lg border border-outline-variant/50 relative">
                <label className="font-caption text-caption text-on-surface-variant block mb-1">
                  English (Auto-translated / Logged)
                </label>
                <p className="text-on-surface font-body-md text-body-md min-h-[3rem]">{translatedText}</p>
                <button className="absolute top-2 right-2 text-on-surface-variant hover:text-primary-fixed-dim">
                  <span className="material-symbols-outlined text-sm">volume_up</span>
                </button>
              </div>
            </div>
          </section>

          {/* Interactive Map & Pathfinding */}
          <section className="glass-panel rounded-2xl overflow-hidden md:col-span-12 h-96 relative border border-outline-variant/40 flex flex-col shadow-xl">
            <div className="absolute inset-0 z-0">
              <div
                className="bg-cover bg-center w-full h-full opacity-60"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBStFEGbXuJitg96cojv2x2i8GwXorj46tWcDid70W127-LZdLoWKEwyFt8jmfqHiFloaiyJ1JFP-oR0iApDT6sQNcnyD2X2scOXQZzPM8LuD0-HMRRbl59y24kYeDaYK297P_GGlLKlhnntg2WQGJXg3lrA1ninAhY36-tfYC9oIDlIwnvY_z4bqnTs0GIeR3mkipTBy5xdm16pWgjQxq_BQpYiNkz7XHXw6zQtj-IbjPr4Rk0byLVsg')"
                }}
              ></div>
            </div>
            <div className="relative z-10 p-6 flex justify-between items-start pointer-events-none">
              <div className="bg-surface-container-lowest/80 backdrop-blur-md p-4 rounded-xl pointer-events-auto border border-outline-variant/30">
                <h2 className="font-headline-md text-headline-md text-primary mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-fixed-dim">route</span> Fan Pathfinding AI
                </h2>
                <div className="flex gap-2">
                  <input
                    className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface font-body-md text-body-md focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim w-64"
                    placeholder="Destination (e.g., Block 102)"
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                  />
                  <button
                    className="bg-primary-fixed-dim text-on-primary px-4 py-2 rounded-lg font-label-bold text-label-bold hover:bg-primary-container transition-colors"
                    onClick={() => alert(`Routing fan to ${destinationInput || 'Block 102'}`)}
                  >
                    Route
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Volunteer Assist Bot */}
          <section className="glass-panel rounded-2xl p-6 md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t-2 border-secondary-fixed-dim/50 shadow-xl">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed-dim">smart_toy</span> Volunteer Assist Bot
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Instantly access protocols, emergency procedures, or schedule changes. Powered by GenAI to give context-aware support.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="bg-surface-variant text-on-surface px-3 py-1 rounded-full font-caption text-caption cursor-pointer hover:bg-surface-bright border border-outline-variant/50"
                  onClick={() => handleSendBotMessage('Lost child protocol?')}
                >
                  "Lost child protocol?"
                </span>
                <span
                  className="bg-surface-variant text-on-surface px-3 py-1 rounded-full font-caption text-caption cursor-pointer hover:bg-surface-bright border border-outline-variant/50"
                  onClick={() => handleSendBotMessage('Where do I get water?')}
                >
                  "Where do I get water?"
                </span>
                <span
                  className="bg-surface-variant text-on-surface px-3 py-1 rounded-full font-caption text-caption cursor-pointer hover:bg-surface-bright border border-outline-variant/50"
                  onClick={() => handleSendBotMessage('Report spill at Gate 4')}
                >
                  "Report spill at Gate 4"
                </span>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg pl-4 pr-12 py-3 text-on-surface font-body-md text-body-md focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim"
                  placeholder="Ask a question..."
                  type="text"
                  value={botInput}
                  onChange={(e) => setBotInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendBotMessage()}
                />
                <button
                  className="absolute right-2 top-2 p-1 text-primary-fixed-dim hover:text-primary transition-colors"
                  onClick={() => handleSendBotMessage()}
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 h-64 overflow-y-auto flex flex-col gap-4">
              {botMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-primary-fixed-dim/20 text-primary-fixed-dim font-label-bold text-caption'
                        : 'bg-secondary-fixed-dim/20'
                    }`}
                  >
                    {msg.sender === 'user' ? 'ME' : <span className="material-symbols-outlined text-secondary-fixed-dim text-sm">smart_toy</span>}
                  </div>
                  <div className={`p-3 rounded-lg border border-outline-variant/30 ${msg.sender === 'user' ? 'bg-surface-variant rounded-tr-none' : 'bg-surface-container rounded-tl-none'}`}>
                    <p className="font-body-md text-body-md text-on-surface text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
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

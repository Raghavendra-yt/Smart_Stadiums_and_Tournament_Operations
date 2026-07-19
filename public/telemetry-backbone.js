/**
 * World Cup 2026 GenAI - Shared Telemetry Backbone & Notification Service
 * Handles cross-tab state synchronization, incident message bus, offline caching, and AI telemetry broadcasting.
 */

class TelemetryBackbone {
    constructor() {
        this.channelName = 'wc26_telemetry_channel';
        this.storageKey = 'wc26_telemetry_state';
        this.offlineKey = 'wc26_offline_mode';

        this.listeners = [];
        this.channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(this.channelName) : null;

        this.state = this.loadState();

        if (this.channel) {
            this.channel.onmessage = (event) => {
                if (event.data && event.data.type) {
                    this.handleIncomingEvent(event.data);
                }
            };
        }

        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.state = this.loadState();
                this.notifyListeners({ type: 'STATE_UPDATED', state: this.state });
            }
        });
    }

    loadState() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error('Failed to parse telemetry state', e); }
        }
        return {
            anomalyMSE: 0.200,
            predictivePeak15m: 15, // +15% predicted spike
            activeAlert: null,
            incidentLog: [
                { time: '19:10', text: 'Security Sector West rotation complete', severity: 'secondary' },
                { time: '19:15', text: 'Fan sentiment dip detected in Zone C', severity: 'primary' },
                { time: '19:20', text: 'Concession bandwidth stabilized', severity: 'secondary' }
            ],
            volunteerTasks: {
                'Gate 4': [
                    { id: 1, title: 'Assist Fan Wheelchair Transit at Gate 4', priority: 'HIGH', status: 'Pending' },
                    { id: 2, title: 'Inspect Bottleneck Queue Scanner #2', priority: 'MEDIUM', status: 'Pending' },
                    { id: 3, title: 'Distribute Hydration Packs - Gate 4 Rest Area', priority: 'LOW', status: 'Completed' }
                ],
                'Gate 2': [
                    { id: 101, title: 'Redirect Overflow Crowd to Meadowlands Rail', priority: 'HIGH', status: 'Pending' },
                    { id: 102, title: 'Check Medical Tent First Aid Supplies', priority: 'MEDIUM', status: 'Pending' }
                ]
            },
            transitSurge: { rideshareDelayMin: 45, shuttleEtaMin: 14, busLaneStatus: 'CLEAR' },
            offlineEmergency: localStorage.getItem(this.offlineKey) === 'true'
        };
    }

    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners(event) {
        this.listeners.forEach(cb => cb(event));
    }

    broadcast(type, payload) {
        const eventData = { type, payload, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        this.handleIncomingEvent(eventData, true);
        if (this.channel) {
            this.channel.postMessage(eventData);
        }
    }

    handleIncomingEvent(eventData, isLocal = false) {
        const { type, payload, timestamp } = eventData;

        switch (type) {
            case 'TRIGGER_ANOMALY':
                this.state.anomalyMSE = payload.mse;
                this.state.activeAlert = payload.mse > 0.7 ? {
                    title: `CRITICAL ANOMALY: MSE ${payload.mse.toFixed(3)}`,
                    sector: payload.sector || 'Sector North Gate 4',
                    timestamp
                } : null;
                this.saveState();
                break;

            case 'PREDICTIVE_FORECAST':
                this.state.predictivePeak15m = payload.spikePercentage;
                this.saveState();
                break;

            case 'ADD_TIMELINE_INCIDENT':
                this.state.incidentLog.unshift({
                    time: timestamp,
                    text: payload.text,
                    severity: payload.severity || 'primary'
                });
                this.saveState();
                break;

            case 'DISPATCH_VOLUNTEER_TASK':
                const gate = payload.gate || 'Gate 4';
                if (!this.state.volunteerTasks[gate]) this.state.volunteerTasks[gate] = [];
                this.state.volunteerTasks[gate].unshift({
                    id: Date.now(),
                    title: payload.title,
                    priority: payload.priority || 'HIGH',
                    status: 'Pending',
                    assignedBy: 'Control Room'
                });
                this.saveState();
                break;

            case 'TOGGLE_OFFLINE_MODE':
                this.state.offlineEmergency = payload.enabled;
                localStorage.setItem(this.offlineKey, payload.enabled ? 'true' : 'false');
                this.saveState();
                break;

            case 'UPDATE_TRANSIT':
                this.state.transitSurge = { ...this.state.transitSurge, ...payload };
                this.saveState();
                break;
        }

        if (!isLocal) {
            this.notifyListeners(eventData);
        }
    }

    setAnomalyMSE(mse, sector = 'Sector North Gate 4') {
        this.broadcast('TRIGGER_ANOMALY', { mse, sector });
    }

    addIncident(text, severity = 'primary') {
        this.broadcast('ADD_TIMELINE_INCIDENT', { text, severity });
    }

    dispatchTask(gate, title, priority = 'HIGH') {
        this.broadcast('DISPATCH_VOLUNTEER_TASK', { gate, title, priority });
        this.addIncident(`Task Dispatched to ${gate}: "${title}"`, 'secondary');
    }

    setPredictivePeak(spikePercentage) {
        this.broadcast('PREDICTIVE_FORECAST', { spikePercentage });
    }

    toggleOfflineEmergency(enabled) {
        this.broadcast('TOGGLE_OFFLINE_MODE', { enabled });
    }
}

// Global Singleton Instance
window.telemetryBackbone = new TelemetryBackbone();

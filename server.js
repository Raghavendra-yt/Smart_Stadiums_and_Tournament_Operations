import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory telemetry state (Lean & fast)
let telemetryState = {
  gates: [
    { id: "Gate A (North West)", sector: "Sec 101 - 124", waitMin: 4, flowRate: "140 fans/min", status: "Optimal", color: "#10b981", crowdDensity: 28 },
    { id: "Gate B (North East)", sector: "Sec 125 - 148", waitMin: 18, flowRate: "420 fans/min", status: "Congested", color: "#f43f5e", crowdDensity: 88 },
    { id: "Gate C (South East)", sector: "Sec 201 - 228", waitMin: 7, flowRate: "210 fans/min", status: "Moderate", color: "#f59e0b", crowdDensity: 45 },
    { id: "Gate D (South West)", sector: "Sec 301 - 340", waitMin: 3, flowRate: "110 fans/min", status: "Optimal", color: "#10b981", crowdDensity: 22 }
  ],
  incidents: [
    { id: "INC-8091", title: "Gate B Entry Surge Bottleneck", severity: "HIGH", sector: "Gate B", timeReported: "3 min ago", description: "Influx of 1,200 fans arriving via Shuttle Bus #14.", aiRecommendation: "Reroute incoming fans to Gate A. Redeploy 6 stewards.", status: "Active - Mitigating", assignedTeam: "Zone 2 Volunteer Response" }
  ],
  orders: []
};

// REST Endpoints
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.get('/api/telemetry', (req, res) => res.json(telemetryState));

app.post('/api/incidents/:id/resolve', (req, res) => {
  const { id } = req.params;
  telemetryState.incidents = telemetryState.incidents.map(inc => inc.id === id ? { ...inc, status: 'Resolved - Cleared', severity: 'RESOLVED' } : inc);
  telemetryState.gates = telemetryState.gates.map(g => g.id.includes('Gate B') ? { ...g, waitMin: 5, status: 'Optimal', color: '#10b981', crowdDensity: 32 } : g);
  res.json({ success: true, telemetry: telemetryState });
});

app.post('/api/orders', (req, res) => {
  const newOrder = { id: `FWC-ORD-${Math.floor(1000 + Math.random() * 9000)}`, ...req.body, time: new Date().toLocaleTimeString() };
  telemetryState.orders.unshift(newOrder);
  res.json({ success: true, order: newOrder });
});

app.post('/api/ai/chat', (req, res) => {
  const { prompt } = req.body;
  const lower = (prompt || '').toLowerCase();
  let answer = "I am your **StadiumPulse AI FIFA 2026 Concierge**. Real-time telemetry indicates normal gate operations and optimal weather conditions.";
  
  if (lower.includes('food') || lower.includes('taco') || lower.includes('burger')) {
    answer = "Based on live concourse sensors, **World Cup Taco Fiesta & Eco-Bowls** (Section 112) has a **3-minute wait time** (6 people in queue). An express QR pass has been prepared!";
  } else if (lower.includes('train') || lower.includes('transit') || lower.includes('wheelchair')) {
    answer = "For wheelchair ramp access to Meadowlands Rail, take **Elevator Bay 3** down to Level 0. Train Car 7 has low-floor boarding ready in 4 minutes.";
  } else if (lower.includes('gate') || lower.includes('crowd')) {
    answer = "⚠️ **Gate B** is currently congested (18 min wait). **Recommended Alternate**: Walk 120m North to **Gate A (North West)** (4 min wait).";
  }

  res.json({ text: answer, timestamp: new Date().toLocaleTimeString() });
});

app.listen(PORT, () => {
  console.log(`⚡ StadiumPulse AI Express Backend listening on http://localhost:${PORT}`);
});

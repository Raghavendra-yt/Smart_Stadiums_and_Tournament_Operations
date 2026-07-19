import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const app = express();

app.use(cors());
app.use(express.json());

// In-Memory High-Concurrency Query LRU Cache
const responseCache = new Map();
const CACHE_TTL_MS = 15000;

function getCachedResponse(key) {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

function setCachedResponse(key, data) {
  responseCache.set(key, { data, timestamp: Date.now() });
}

// Initial Database Seed Data
const INITIAL_DATABASE = {
  matchInfo: {
    id: "FWC2026-M48",
    tournament: "FIFA World Cup 2026™ - Quarter-Final",
    venue: "MetLife Stadium - New York / New Jersey (Capacity: 82,500)",
    homeTeam: { name: "USA", flag: "🇺🇸", score: 2 },
    awayTeam: { name: "BRAZIL", flag: "🇧🇷", score: 1 },
    matchTime: "72'",
    status: "LIVE - 2ND HALF",
    attendance: 81940,
    temperature: "24°C / 75°F",
    weather: "Clear Evening",
    ecoIndex: "94.8% Carbon Neutral Match Target"
  },
  gates: [
    { id: "Gate A (North West)", sector: "Sec 101 - 124", waitMin: 4, flowRate: "140 fans/min", status: "Optimal", color: "#10b981", crowdDensity: 28, accessibilityFriendly: true },
    { id: "Gate B (North East)", sector: "Sec 125 - 148", waitMin: 18, flowRate: "420 fans/min", status: "Congested", color: "#f43f5e", crowdDensity: 88, accessibilityFriendly: true },
    { id: "Gate C (South East)", sector: "Sec 201 - 228", waitMin: 7, flowRate: "210 fans/min", status: "Moderate", color: "#f59e0b", crowdDensity: 45, accessibilityFriendly: false },
    { id: "Gate D (South West)", sector: "Sec 301 - 340", waitMin: 3, flowRate: "110 fans/min", status: "Optimal", color: "#10b981", crowdDensity: 22, accessibilityFriendly: true },
    { id: "VIP / Express Gate 1", sector: "Suites & Press", waitMin: 1, flowRate: "35 fans/min", status: "Optimal", color: "#10b981", crowdDensity: 12, accessibilityFriendly: true }
  ],
  concessions: [
    { 
      id: "conc-1", 
      name: "World Cup Taco Fiesta & Eco-Bowls", 
      location: "Concourse Level 1 - Section 112", 
      cuisine: "Mexican / Fusion", 
      waitMin: 3, 
      queueSize: 6, 
      popularItem: "Organic Birria Tacos & Aqua Fresca",
      priceRange: "$$",
      tags: ["Eco-Packaging", "Vegan Options", "Halal Certified"],
      ecoScore: "A+"
    },
    { 
      id: "conc-2", 
      name: "Jersey Turnpike Smash Burgers", 
      location: "Concourse Level 1 - Section 130", 
      cuisine: "American Classics", 
      waitMin: 16, 
      queueSize: 34, 
      popularItem: "Double Angus Truffle Smash Burger",
      priceRange: "$$",
      tags: ["Express Pick-Up", "Gluten-Free Buns Available"],
      ecoScore: "A"
    },
    { 
      id: "conc-3", 
      name: "Copacabana Grill & Craft Hydration", 
      location: "Concourse Level 2 - Section 214", 
      cuisine: "Brazilian Churrasco & Beverages", 
      waitMin: 8, 
      queueSize: 15, 
      popularItem: "Picanha Skewer Box & Sugar-Free Guarana",
      priceRange: "$$$",
      tags: ["High Protein", "Solar-Powered Grill Unit"],
      ecoScore: "A+"
    },
    { 
      id: "conc-4", 
      name: "Zero-Waste Hydration Station 4", 
      location: "Concourse Level 1 & 2 (Near All Gate Corridors)", 
      cuisine: "Refill Water & Organic Electrolytes", 
      waitMin: 0, 
      queueSize: 1, 
      popularItem: "Free Filtered Chill Spring Water",
      priceRange: "FREE",
      tags: ["100% Zero Waste", "Bring Your Cup"],
      ecoScore: "A++"
    }
  ],
  incidents: [
    {
      id: "INC-8091",
      title: "Gate B Entry Surge Bottleneck",
      severity: "HIGH",
      sector: "Gate B (North East)",
      timeReported: "3 min ago",
      description: "Unexpected influx of 1,200 fans arriving via Bus Express Shuttle #14, causing ticket turnstile congestion.",
      aiRecommendation: "Dynamic Reroute Alert broadcasted to Fan Mobile App to redirect incoming fans to Gate A (4 min wait). Reassign 6 mobile stewards from Gate D.",
      status: "Active - Mitigating",
      assignedTeam: "Zone 2 Volunteer Response Team"
    },
    {
      id: "INC-8094",
      title: "Wheelchair Ramp Escort Requested",
      severity: "MEDIUM",
      sector: "Section 104 - Concourse Ramp B",
      timeReported: "6 min ago",
      description: "Family requiring electric wheelchair lift guidance following 1st Half break.",
      aiRecommendation: "Dispatch Steward Alex M. (equipped with Multilingual Copilot & Accessibility Pass) to Section 104 Elevator 2.",
      status: "In Progress",
      assignedTeam: "Accessibility Steward Alex M."
    }
  ],
  transitHubs: [
    {
      id: "t-1",
      name: "Meadowlands Express Train Station",
      mode: "Heavy Rail",
      nextDeparture: "In 4 mins (Secaucus Junction Direct)",
      occupancy: "78% High",
      aiAdvice: "Board Cars 5-8 for immediate seating; Cars 1-3 near capacity.",
      accessible: true
    },
    {
      id: "t-2",
      name: "NYC Port Authority Shuttle Express (Gate 8 Plaza)",
      mode: "Dedicated Express Bus Line",
      nextDeparture: "Continuous (Every 2 mins)",
      occupancy: "35% Low",
      aiAdvice: "Fastest route to Manhattan after match end. Dedicated VIP bus lane.",
      accessible: true
    },
    {
      id: "t-3",
      name: "Rideshare & Taxi Pick-Up Zone Red (Lot E)",
      mode: "App Rideshare",
      nextDeparture: "Avg Wait: 9 mins",
      occupancy: "Moderate Surge",
      aiAdvice: "Walk via Skybridge South to avoid concourse foot traffic.",
      accessible: true
    }
  ],
  volunteerTasks: [
    {
      id: "TSK-101",
      title: "Assist Gate B Fan Redirection",
      priority: "HIGH",
      gate: "Gate 4",
      location: "Gate B Outer Concourse",
      instruction: "Display digital route sign pointing fans towards Gate A (North West). Inform in Spanish/English.",
      status: "Pending",
      category: "Crowd Flow"
    },
    {
      id: "TSK-102",
      title: "Escort Visually Impaired Fan to Section 220",
      priority: "HIGH",
      gate: "Gate 4",
      location: "Gate D Main Information Desk",
      instruction: "Meet guest Mr. Santos arriving at Gate D, guide to Section 220, Row 4.",
      status: "In Progress",
      category: "Accessibility"
    },
    {
      id: "TSK-103",
      title: "Restock Water Cups at Zero-Waste Station 4",
      priority: "LOW",
      gate: "Gate 2",
      location: "Concourse Level 2 - Sec 214",
      instruction: "Retrieve reusable cup bin from Storage Bay C and replenish dispenser.",
      status: "Completed",
      category: "Sustainability"
    }
  ],
  orders: [],
  users: [
    {
      email: "organizer@worldcup2026.org",
      passcode: "ops2026",
      role: "ops",
      name: "J. Smith",
      title: "Senior Ops Controller"
    },
    {
      email: "volunteer@worldcup2026.org",
      passcode: "staff2026",
      role: "volunteer",
      name: "Vol. Alex Rivera",
      title: "Gate 4 Specialist"
    }
  ],
  activeTokens: {}
};

const DB_FILE = path.join('/tmp', 'stadium_database.json');

function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf-8');
      return INITIAL_DATABASE;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_DATABASE;
  }
}

function writeDatabase(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    // Ignore write errors in read-only environments
  }
}

// REST API Endpoints
app.get('/api/health', (req, res) => res.json({ status: 'OK', engine: 'Vercel Serverless Express', timestamp: new Date() }));

app.get('/api/telemetry', (req, res) => {
  const db = readDatabase();
  res.json({
    matchInfo: db.matchInfo,
    gates: db.gates,
    incidents: db.incidents,
    concessions: db.concessions,
    transitHubs: db.transitHubs,
    volunteerTasks: db.volunteerTasks,
    orders: db.orders
  });
});

app.get('/api/match-info', (req, res) => res.json(readDatabase().matchInfo));
app.get('/api/gates', (req, res) => res.json(readDatabase().gates));
app.get('/api/concessions', (req, res) => res.json(readDatabase().concessions));
app.get('/api/transit-hubs', (req, res) => res.json(readDatabase().transitHubs));
app.get('/api/incidents', (req, res) => res.json(readDatabase().incidents));

app.post('/api/incidents', (req, res) => {
  const db = readDatabase();
  const newIncident = {
    id: `INC-${Math.floor(8000 + Math.random() * 1000)}`,
    timeReported: 'Just now',
    status: 'Active - Mitigating',
    ...req.body
  };
  db.incidents.unshift(newIncident);
  writeDatabase(db);
  res.json({ success: true, incident: newIncident });
});

app.post('/api/incidents/:id/resolve', (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  db.incidents = db.incidents.map(inc => inc.id === id ? { ...inc, status: 'Resolved - Cleared', severity: 'RESOLVED' } : inc);
  db.gates = db.gates.map(g => g.id.includes('Gate B') ? { ...g, waitMin: 5, status: 'Optimal', color: '#10b981', crowdDensity: 32 } : g);
  writeDatabase(db);
  res.json({ success: true, incidents: db.incidents, gates: db.gates });
});

app.get('/api/volunteer-tasks', (req, res) => res.json(readDatabase().volunteerTasks));

app.post('/api/volunteer-tasks', (req, res) => {
  const db = readDatabase();
  const newTask = {
    id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
    status: 'Pending',
    ...req.body
  };
  db.volunteerTasks.unshift(newTask);
  writeDatabase(db);
  res.json({ success: true, task: newTask });
});

app.put('/api/volunteer-tasks/:id', (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  db.volunteerTasks = db.volunteerTasks.map(t => t.id === id ? { ...t, ...req.body } : t);
  writeDatabase(db);
  res.json({ success: true, tasks: db.volunteerTasks });
});

app.get('/api/orders', (req, res) => res.json(readDatabase().orders));

app.post('/api/orders', (req, res) => {
  const db = readDatabase();
  const newOrder = { 
    id: `FWC-ORD-${Math.floor(1000 + Math.random() * 9000)}`, 
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...req.body 
  };
  db.orders.unshift(newOrder);
  writeDatabase(db);
  res.json({ success: true, order: newOrder });
});

// Authentication Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const db = readDatabase();
  
  const user = db.users.find(u => 
    u.email.toLowerCase() === (email || '').toLowerCase().trim() &&
    u.passcode === (password || '').trim() &&
    (!role || u.role === role)
  );

  if (user) {
    const token = `jwt-token-${user.role}-${crypto.randomBytes(8).toString('hex')}`;
    if (!db.activeTokens) db.activeTokens = {};
    db.activeTokens[token] = { email: user.email, role: user.role, name: user.name, title: user.title };
    writeDatabase(db);

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        title: user.title
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials or unauthorized role access.' });
  }
});

// AI Concierge Endpoint
app.post('/api/ai/chat', (req, res) => {
  const { prompt } = req.body;
  const lower = (prompt || '').toLowerCase().trim();
  const cacheKey = `chat:${lower}`;

  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json({ text: cached, cached: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  }

  const db = readDatabase();
  let answer = "I am your **StadiumPulse AI FIFA 2026 Concierge**. Real-time database telemetry indicates normal gate operations and optimal weather conditions.";
  
  if (lower.includes('food') || lower.includes('taco') || lower.includes('burger') || lower.includes('eat')) {
    const topVendor = db.concessions[0] || { name: 'World Cup Taco Fiesta', waitMin: 3 };
    answer = `Based on live concourse sensors, **${topVendor.name}** (${topVendor.location}) currently has a **${topVendor.waitMin}-minute wait time** (${topVendor.queueSize || 6} people in queue). An express QR pass has been prepared!`;
  } else if (lower.includes('train') || lower.includes('transit') || lower.includes('wheelchair') || lower.includes('bus')) {
    const train = db.transitHubs[0] || { nextDeparture: 'In 4 mins' };
    answer = `For full wheelchair ramp access to Meadowlands Rail Station, take **Elevator Bay 3** down to Level 0 Plaza. Next departure is **${train.nextDeparture}**. Board Cars 6 or 7 for direct ramp access.`;
  } else if (lower.includes('gate') || lower.includes('crowd') || lower.includes('bottleneck')) {
    const gateB = db.gates.find(g => g.id.includes('Gate B')) || { waitMin: 18 };
    const gateA = db.gates.find(g => g.id.includes('Gate A')) || { waitMin: 4 };
    answer = `⚠️ **Gate B** is currently experiencing congestion (**${gateB.waitMin} min wait**). **Recommended Alternate**: Walk 120m North to **${gateA.id}** where current wait time is **${gateA.waitMin} minutes**.`;
  } else if (lower.includes('ball') || lower.includes('where is') || lower.includes('play')) {
    answer = `⚽ **Spatial Vision AI Stream**: MetLife Stadium Cam #4 tracking ball position at **Sector North 18-yard box**. Attacking momentum favors **USA (64% possession in last 5 mins)**.`;
  }

  setCachedResponse(cacheKey, answer);
  res.json({ text: answer, cached: false, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
});

export default app;

// FIFA World Cup 2026 Smart Stadium Telemetry & Data Repository

export const MATCH_INFO = {
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
};

export const GATES_DATA = [
  { id: "Gate A (North West)", sector: "Sec 101 - 124", waitMin: 4, flowRate: "140 fans/min", status: "Optimal", color: "#10b981", crowdDensity: 28, accessibilityFriendly: true },
  { id: "Gate B (North East)", sector: "Sec 125 - 148", waitMin: 18, flowRate: "420 fans/min", status: "Congested", color: "#f43f5e", crowdDensity: 88, accessibilityFriendly: true },
  { id: "Gate C (South East)", sector: "Sec 201 - 228", waitMin: 7, flowRate: "210 fans/min", status: "Moderate", color: "#f59e0b", crowdDensity: 45, accessibilityFriendly: false },
  { id: "Gate D (South West)", sector: "Sec 301 - 340", waitMin: 3, flowRate: "110 fans/min", status: "Optimal", color: "#10b981", crowdDensity: 22, accessibilityFriendly: true },
  { id: "VIP / Express Gate 1", sector: "Suites & Press", waitMin: 1, flowRate: "35 fans/min", status: "Optimal", color: "#10b981", crowdDensity: 12, accessibilityFriendly: true }
];

export const CONCESSIONS_DATA = [
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
];

export const ACTIVE_INCIDENTS = [
  {
    id: "INC-8091",
    title: "Gate B Entry Surge Bottleneck",
    severity: "HIGH",
    sector: "Gate B (North East)",
    timeReported: "3 min ago",
    description: "Unexpected influx of 1,200 fans arriving via Bus Express Shuttle #14, causing ticket turnstile congestion.",
    aiRecommendation: "Dynamic Reroute Alert broadcasted to Fan Mobile App to redirect incoming fans to Gate A (4 min wait). Reassign 6 mobile stewards from Gate D.",
    status: "Active - Mitigating",
    assignedTeam: "Zone 2 Volunteer Response Team",
    coordinates: { x: 380, y: 70 }
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
    assignedTeam: "Accessibility Steward Alex M.",
    coordinates: { x: 120, y: 150 }
  },
  {
    id: "INC-8095",
    title: "Compost Bin Bin #14 Overfill Alert",
    severity: "LOW",
    sector: "Plaza Food Court East",
    timeReported: "12 min ago",
    description: "IoT Waste Sensor reports Bin #14 reaches 92% capacity.",
    aiRecommendation: "Route Autonomous Eco-Waste Cart #3 for quick automated container swapped before crowd rush.",
    status: "Resolved - Cleared",
    assignedTeam: "Eco-Tech Clean Hub",
    coordinates: { x: 310, y: 220 }
  }
];

export const TRANSIT_HUBS = [
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
];

export const VOLUNTEER_TASKS = [
  {
    id: "TSK-101",
    title: "Assist Gate B Fan Redirection",
    priority: "HIGH",
    location: "Gate B Outer Concourse",
    instruction: "Display digital route sign pointing fans towards Gate A (North West). Inform in Spanish/English.",
    status: "PENDING",
    category: "Crowd Flow"
  },
  {
    id: "TSK-102",
    title: "Escort Visually Impaired Fan to Section 220",
    priority: "HIGH",
    location: "Gate D Main Information Desk",
    instruction: "Meet guest Mr. Santos arriving at Gate D, guide to Section 220, Row 4.",
    status: "IN_PROGRESS",
    category: "Accessibility"
  },
  {
    id: "TSK-103",
    title: "Restock Water Cups at Zero-Waste Station 4",
    priority: "LOW",
    location: "Concourse Level 2 - Sec 214",
    instruction: "Retrieve reusable cup bin from Storage Bay C and replenish dispenser.",
    status: "COMPLETED",
    category: "Sustainability"
  }
];

export const PROMPT_SUGGESTIONS = [
  "Where is the shortest line for food near Section 112?",
  "How do I reach the Secaucus train with a wheelchair after the match?",
  "Translate 'Can you point me to my seat in Spanish/Portuguese?'",
  "Show me real-time exit route avoiding Gate B crowd surge",
  "What eco-sustainability features are available in this stadium?",
  "Emergency assist: Medical steward requested near Section 104"
];

export const GENAI_PRESET_RESPONSES = {
  food: "Based on real-time concourse sensors, **World Cup Taco Fiesta & Eco-Bowls** (Section 112) has only a **3-minute wait time** (6 people in queue). Alternatively, **Zero-Waste Hydration Station 4** has 0 wait time. I can reserve an express pickup order for you now!",
  transit: "For full wheelchair accessibility to Meadowlands Rail Station, take **Elevator 3** down to Level 0 Plaza. Board **Train Car 6 or 7** which features low-floor ramp access. Current transit occupancy is 78%, next direct departure is in **4 minutes**.",
  gate: "⚠️ **Gate B** currently experiences high queue congestion (18 min wait). **Recommended Alternate**: Walk 120 meters north to **Gate A (North West)** where current wait time is under **4 minutes**.",
  translate: "Here are instant audio translations for your fan query:\n\n🇪🇸 **Spanish**: '¿Me puede indicar cómo llegar a mi asiento, por favor?'\n🇧🇷 **Portuguese**: 'Você pode me mostrar onde fica o meu assento, por favor?'\n🇫🇷 **French**: 'Pouvez-vous m'indiquer mon siège, s'il vous plaît?'",
  sustainability: "MetLife Stadium FIFA 2026 operates on **100% renewable grid power**, featuring zero single-use plastic, solar canopy charging stations, automated HVAC load balancing, and smart AI waste sorting bins achieving a **94.8% landfill diversion score** today!",
  default: "I am your **StadiumPulse AI FIFA 2026 Concierge**. I can assist you with real-time route optimization, crowd-aware concession orders, multilingual translation, transit schedules, and emergency staff requests. What would you like to know?"
};

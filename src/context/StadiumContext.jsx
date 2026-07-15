import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MATCH_INFO, 
  GATES_DATA, 
  CONCESSIONS_DATA, 
  ACTIVE_INCIDENTS, 
  TRANSIT_HUBS, 
  VOLUNTEER_TASKS,
  GENAI_PRESET_RESPONSES
} from '../data/stadiumData';

const StadiumContext = createContext();

export const StadiumProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('fan'); // 'fan' | 'ops' | 'volunteer'
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [matchInfo, setMatchInfo] = useState(MATCH_INFO);
  const [gates, setGates] = useState(GATES_DATA);
  const [concessions, setConcessions] = useState(CONCESSIONS_DATA);
  const [incidents, setIncidents] = useState(ACTIVE_INCIDENTS);
  const [tasks, setTasks] = useState(VOLUNTEER_TASKS);
  const [transitHubs, setTransitHubs] = useState(TRANSIT_HUBS);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  // Map & Wayfinding State
  const [selectedMapTarget, setSelectedMapTarget] = useState(null); // { name, type, sector, status }

  // Concession Modal State
  const [activeOrderModal, setActiveOrderModal] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  // GenAI Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      role: 'StadiumPulse AI',
      text: "Welcome to MetLife Stadium for FIFA World Cup 2026! 🏟️ I am your real-time GenAI Concierge. How can I help you navigate seating, find express food, or check transit queues?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        "Find food with shortest wait",
        "Accessible route to transit train",
        "Avoid Gate B crowd bottleneck"
      ]
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Speech Synthesizer Helper
  const speakText = (text) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop ongoing speech
      const cleanText = text.replace(/[*#_]/g, ''); // strip markdown
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      // match language if possible
      if (selectedLanguage === 'es') utterance.lang = 'es-ES';
      else if (selectedLanguage === 'pt') utterance.lang = 'pt-BR';
      else if (selectedLanguage === 'fr') utterance.lang = 'fr-FR';
      else utterance.lang = 'en-US';

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
    }
  };

  // Add user query to chat and trigger simulated GenAI response stream
  const sendChatMessage = (userInput) => {
    if (!userInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    // Simulate AI thinking and generator logic
    setTimeout(() => {
      let responseText = GENAI_PRESET_RESPONSES.default;
      const lower = userInput.toLowerCase();

      if (lower.includes('food') || lower.includes('taco') || lower.includes('burger') || lower.includes('eat') || lower.includes('hungry')) {
        responseText = GENAI_PRESET_RESPONSES.food;
      } else if (lower.includes('train') || lower.includes('transit') || lower.includes('bus') || lower.includes('rideshare') || lower.includes('wheelchair')) {
        responseText = GENAI_PRESET_RESPONSES.transit;
      } else if (lower.includes('gate') || lower.includes('crowd') || lower.includes('line') || lower.includes('bottleneck') || lower.includes('entry')) {
        responseText = GENAI_PRESET_RESPONSES.gate;
      } else if (lower.includes('translate') || lower.includes('spanish') || lower.includes('portuguese') || lower.includes('french') || lower.includes('language')) {
        responseText = GENAI_PRESET_RESPONSES.translate;
      } else if (lower.includes('eco') || lower.includes('sustainability') || lower.includes('waste') || lower.includes('green') || lower.includes('power')) {
        responseText = GENAI_PRESET_RESPONSES.sustainability;
      } else {
        responseText = `🤖 **GenAI Intelligence**: I analyzed your request ("${userInput}") against active stadium telemetry. Current match phase is **${matchInfo.matchTime}**. Gates A & D offer optimal traffic flow, and Section 112 Express Concession is ready for pickup. Direct support dispatched if required!`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        role: 'StadiumPulse AI',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsAiTyping(false);
      speakText(responseText);
    }, 1100);
  };

  // Ops Incident Resolution handler
  const resolveIncident = (incidentId) => {
    setIncidents((prev) => 
      prev.map((inc) => 
        inc.id === incidentId 
          ? { ...inc, status: 'Resolved - Cleared', severity: 'RESOLVED' } 
          : inc
      )
    );
    // Also update gate congestion if it was gate B
    setGates((prev) => 
      prev.map((g) => g.id.includes('Gate B') ? { ...g, waitMin: 5, status: 'Optimal', color: '#10b981', crowdDensity: 32 } : g)
    );
  };

  // Volunteer Task Status toggle
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) => 
      prev.map((tsk) => tsk.id === taskId ? { ...tsk, status: newStatus } : tsk)
    );
  };

  // Place smart food order
  const placeConcessionOrder = (item, quantity = 1) => {
    const newOrder = {
      orderId: "FWC-ORD-" + Math.floor(1000 + Math.random() * 9000),
      item: item.popularItem,
      stand: item.name,
      location: item.location,
      pickupTime: "In 4 minutes",
      expressCode: "EX-" + Math.floor(10 + Math.random() * 89),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecentOrders((prev) => [newOrder, ...prev]);
    setActiveOrderModal(null);
  };

  // Live telemetry pulse simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGates((prevGates) => 
        prevGates.map((gate) => {
          if (gate.status === 'Congested') return gate; // leave high status for demo
          const MathVariance = Math.floor((Math.random() - 0.5) * 4);
          const newDensity = Math.max(10, Math.min(95, gate.crowdDensity + MathVariance));
          return { ...gate, crowdDensity: newDensity };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StadiumContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        selectedLanguage,
        setSelectedLanguage,
        matchInfo,
        gates,
        concessions,
        incidents,
        resolveIncident,
        tasks,
        updateTaskStatus,
        transitHubs,
        selectedMapTarget,
        setSelectedMapTarget,
        activeOrderModal,
        setActiveOrderModal,
        recentOrders,
        placeConcessionOrder,
        chatMessages,
        sendChatMessage,
        isAiTyping,
        isSpeechEnabled,
        setIsSpeechEnabled,
        speakText
      }}
    >
      {children}
    </StadiumContext.Provider>
  );
};

export const useStadium = () => useContext(StadiumContext);

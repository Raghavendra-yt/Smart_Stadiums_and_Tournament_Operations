import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const StadiumContext = createContext();

export const StadiumProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('fan'); // 'fan' | 'ops' | 'volunteer'
  const [authenticatedRoles, setAuthenticatedRoles] = useState({
    ops: null,
    volunteer: null
  });

  const [authTokens, setAuthTokens] = useState({
    ops: null,
    volunteer: null
  });

  const loginRole = (role, userData, token) => {
    const bearerToken = token || `demo-token-${role}-${Date.now()}`;
    setAuthenticatedRoles((prev) => ({
      ...prev,
      [role]: userData || { name: role === 'ops' ? 'J. Smith' : 'Vol. Alex Rivera', title: role === 'ops' ? 'Senior Controller' : 'Gate 4 Specialist' }
    }));
    setAuthTokens((prev) => ({
      ...prev,
      [role]: bearerToken
    }));
  };

  const logoutRole = (role) => {
    setAuthenticatedRoles((prev) => ({
      ...prev,
      [role]: null
    }));
    setAuthTokens((prev) => ({
      ...prev,
      [role]: null
    }));
  };

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [matchInfo, setMatchInfo] = useState({
    id: "FWC2026-M48",
    tournament: "FIFA World Cup 2026™",
    venue: "MetLife Stadium - New York / New Jersey",
    homeTeam: { name: "USA", flag: "🇺🇸", score: 2 },
    awayTeam: { name: "BRAZIL", flag: "🇧🇷", score: 1 },
    matchTime: "72'",
    status: "LIVE - 2ND HALF",
    attendance: 81940
  });

  const [gates, setGates] = useState([]);
  const [concessions, setConcessions] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transitHubs, setTransitHubs] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  // Map & Wayfinding State
  const [selectedMapTarget, setSelectedMapTarget] = useState(null);
  const [activeOrderModal, setActiveOrderModal] = useState(null);

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

  // Fetch Initial Telemetry
  const fetchTelemetryFromDB = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/telemetry`);
      if (res.ok) {
        const data = await res.json();
        if (data.matchInfo) setMatchInfo(data.matchInfo);
        if (data.gates) setGates(data.gates);
        if (data.concessions) setConcessions(data.concessions);
        if (data.incidents) setIncidents(data.incidents);
        if (data.transitHubs) setTransitHubs(data.transitHubs);
        if (data.volunteerTasks) setTasks(data.volunteerTasks);
        if (data.orders) setRecentOrders(data.orders);
      }
    } catch (err) {
      console.warn('Backend API disconnected, retrying...', err);
    }
  };

  // Real-Time Server-Sent Events (SSE) Push Subscription
  useEffect(() => {
    fetchTelemetryFromDB();

    const eventSource = new EventSource(`${API_BASE_URL}/telemetry/stream`);

    eventSource.addEventListener('INCIDENT_CREATED', () => fetchTelemetryFromDB());
    eventSource.addEventListener('INCIDENT_RESOLVED', () => fetchTelemetryFromDB());
    eventSource.addEventListener('TASK_DISPATCHED', () => fetchTelemetryFromDB());
    eventSource.addEventListener('TASK_UPDATED', () => fetchTelemetryFromDB());
    eventSource.addEventListener('ORDER_PLACED', () => fetchTelemetryFromDB());

    return () => {
      eventSource.close();
    };
  }, []);

  // Speech Synthesizer Helper
  const speakText = (text) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (selectedLanguage === 'es') utterance.lang = 'es-ES';
      else if (selectedLanguage === 'pt') utterance.lang = 'pt-BR';
      else if (selectedLanguage === 'fr') utterance.lang = 'fr-FR';
      else utterance.lang = 'en-US';

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
    }
  };

  // Add user query to chat and call Express backend AI Endpoint
  const sendChatMessage = async (userInput) => {
    if (!userInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput })
      });
      if (res.ok) {
        const data = await res.json();
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          role: 'StadiumPulse AI',
          text: data.text,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        speakText(data.text);
      }
    } catch (e) {
      console.error('Failed to get AI chat response from backend:', e);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Ops Incident Resolution handler via Bearer Token Authenticated Endpoint
  const resolveIncident = async (incidentId) => {
    const token = authTokens[currentRole] || `demo-token-${currentRole}`;
    try {
      const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.incidents) setIncidents(data.incidents);
        if (data.gates) setGates(data.gates);
      }
    } catch (err) {
      console.error('Failed to resolve incident on backend:', err);
    }
  };

  // Volunteer Task Status toggle via Bearer Token Authenticated Endpoint
  const updateTaskStatus = async (taskId, newStatus) => {
    const token = authTokens[currentRole] || `demo-token-${currentRole}`;
    try {
      const res = await fetch(`${API_BASE_URL}/volunteer-tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tasks) setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Failed to update task status on backend:', err);
    }
  };

  // Place smart food order via Backend API
  const placeConcessionOrder = async (item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: item.popularItem,
          stand: item.name,
          location: item.location,
          pickupTime: "In 4 minutes",
          expressCode: "EX-" + Math.floor(10 + Math.random() * 89)
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) setRecentOrders((prev) => [data.order, ...prev]);
      }
    } catch (err) {
      console.error('Failed to place order on backend:', err);
    } finally {
      setActiveOrderModal(null);
    }
  };

  return (
    <StadiumContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        authenticatedRoles,
        authTokens,
        loginRole,
        logoutRole,
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

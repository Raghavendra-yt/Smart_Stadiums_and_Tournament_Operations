import React, { useState, useRef, useEffect } from 'react';
import { useStadium } from '../../context/StadiumContext';
import { Bot, Send, Sparkles, User, Volume2, Zap, ShoppingBag, Navigation } from 'lucide-react';

export const GenAIChatAssistant = () => {
  const {
    chatMessages,
    sendChatMessage,
    isAiTyping,
    speakText,
    setSelectedMapTarget,
    setActiveOrderModal,
    concessions
  } = useStadium();

  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const handleChipClick = (prompt) => {
    sendChatMessage(prompt);
  };

  return (
    <div className="glass-panel flex flex-col h-[580px] border border-emerald-500/20 shadow-2xl relative overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              Gemini Concierge Copilot
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                Multilingual AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Context-Aware Stadium Navigation & Concierge Assistant
            </p>
          </div>
        </div>

        <button
          onClick={() => handleChipClick("Show shortest concession line")}
          className="hidden sm:flex items-center gap-1 text-[11px] bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg transition-all"
        >
          <ShoppingBag className="w-3 h-3" /> Food Express
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} transition-all`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-400 px-1">
              {msg.sender === 'ai' ? (
                <>
                  <Bot className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">{msg.role}</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>You</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[88%] text-sm leading-relaxed ${msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-none shadow-lg'
                }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.sender === 'ai' && (
                <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-2">
                  <button
                    onClick={() => speakText(msg.text)}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
                  >
                    <Volume2 className="w-3 h-3" /> Listen Audio
                  </button>
                  <button
                    onClick={() => setSelectedMapTarget({ name: 'Section 112 Gate & Food', type: 'Concession', waitMin: 3 })}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20"
                  >
                    <Navigation className="w-3 h-3" /> Map Directions
                  </button>
                  {msg.text.includes('Taco') && (
                    <button
                      onClick={() => setActiveOrderModal(concessions[0])}
                      className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/20 px-2 py-1 rounded border border-amber-500/40"
                    >
                      <ShoppingBag className="w-3 h-3" /> Order Tacos ($$)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isAiTyping && (
          <div className="flex items-center gap-2 p-3 bg-slate-900/60 border border-white/5 rounded-xl max-w-[200px]">
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">Gemini Reasoning...</span>
            <div className="flex items-center gap-1">
              <span className="ai-typing-dot"></span>
              <span className="ai-typing-dot"></span>
              <span className="ai-typing-dot"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Dynamic Prompt Chips */}
      <div className="px-4 py-2 border-t border-white/5 bg-slate-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
          <Zap className="w-3 h-3 text-amber-400" /> Quick Prompts:
        </span>
        <button
          onClick={() => handleChipClick("Where is the shortest line for food near Section 112?")}
          className="text-xs shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all"
        >
          🍔 Shortest food queue
        </button>
        <button
          onClick={() => handleChipClick("How do I reach Secaucus train with a wheelchair after match?")}
          className="text-xs shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all"
        >
          ♿ Accessible train exit
        </button>
        <button
          onClick={() => handleChipClick("Show me real-time exit route avoiding Gate B crowd surge")}
          className="text-xs shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all"
        >
          🚪 Gate B route bypass
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-slate-900 flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask GenAI Concierge in any language..."
          className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

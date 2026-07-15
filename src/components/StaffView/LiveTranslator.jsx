import React, { useState } from 'react';
import { useStadium } from '../../context/StadiumContext';
import { Languages, Volume2, Mic, Sparkles, Check } from 'lucide-react';

export const LiveTranslator = () => {
  const { speakText } = useStadium();
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = (textToTranslate = inputText) => {
    if (!textToTranslate.trim()) return;
    setIsTranslating(true);

    setTimeout(() => {
      let result = "";
      const text = textToTranslate.toLowerCase();

      if (targetLang === 'es') {
        if (text.includes('seat')) result = "Su asiento se encuentra en la Sección 112, Fila 14. ¡Tome las escaleras de la izquierda!";
        else if (text.includes('water') || text.includes('restroom')) result = "El baño accesible y la estación de agua están pasando la Puerta A a 30 metros.";
        else result = `[Traducción al Español]: ${textToTranslate} - Le podemos asistir de inmediato.`;
      } else if (targetLang === 'pt') {
        result = `[Tradução em Português]: ${textToTranslate} - Seu assento fica na Seção 112.`;
      } else if (targetLang === 'fr') {
        result = `[Traduction en Français]: ${textToTranslate} - Suivez la ligne bleue.`;
      } else if (targetLang === 'ar') {
        result = `[الترجمة العربية]: ${textToTranslate} - يرجى اتباع اللافتات الخضراء.`;
      } else {
        result = `[Translated to German]: ${textToTranslate} - Bitte folgen Sie dem grünen Schild.`;
      }

      setTranslatedText(result);
      setIsTranslating(false);
      speakText(result);
    }, 500);
  };

  const handleQuickTranslate = (phrase, lang) => {
    setInputText(phrase);
    setTargetLang(lang);
    handleTranslate(phrase);
  };

  return (
    <div className="glass-panel p-4 flex flex-col h-[560px] border border-amber-500/20 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Languages className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-heading">
              GenAI Multilingual Fan Translator
            </h3>
            <p className="text-[11px] text-slate-400">
              Instant voice/text cross-language copilot for field stewards
            </p>
          </div>
        </div>

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="px-2 py-1 rounded-md bg-slate-900 border border-white/10 text-amber-300 font-bold text-xs focus:outline-none"
        >
          <option value="es">🇲🇽 Spanish (Español)</option>
          <option value="pt">🇧🇷 Portuguese (Português)</option>
          <option value="fr">🇫🇷 French (Français)</option>
          <option value="ar">🇸🇦 Arabic (العربية)</option>
          <option value="de">🇩🇪 German (Deutsch)</option>
        </select>
      </div>

      <div className="flex-1 my-3 space-y-4 overflow-y-auto">
        <div>
          <label className="text-xs text-slate-400 font-mono block mb-1">
            Staff Prompt / Fan Question (English):
          </label>
          <textarea
            rows="3"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or speak fan question..."
            className="w-full p-3 rounded-xl glass-input text-xs sm:text-sm resize-none focus:outline-none"
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
              <Mic className="w-3.5 h-3.5 text-amber-400" /> Audio Synthesizer Ready
            </div>
            <button
              onClick={() => handleTranslate()}
              disabled={!inputText.trim() || isTranslating}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-lg shadow-amber-400/20 transition-all disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" /> Translate & Play Audio
            </button>
          </div>
        </div>

        {translatedText && (
          <div className="p-4 rounded-xl glass-panel-glow border-amber-500/40 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 font-mono flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Instant Translation:
              </span>
              <button
                onClick={() => speakText(translatedText)}
                className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1 font-mono text-[11px]"
              >
                <Volume2 className="w-3.5 h-3.5" /> Replay
              </button>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {translatedText}
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-white/10">
          <label className="text-[11px] text-slate-400 font-mono block mb-2">
            ⚡ Quick Phrase Shortcuts:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickTranslate("Where is Section 112 seat?", "es")}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-500/10 border border-white/10 text-left text-xs text-slate-300 hover:text-amber-300 transition-all"
            >
              🇲🇽 "Where is Section 112 seat?" (Spanish)
            </button>
            <button
              onClick={() => handleQuickTranslate("Restroom and drinking water nearby", "pt")}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-500/10 border border-white/10 text-left text-xs text-slate-300 hover:text-amber-300 transition-all"
            >
              🇧🇷 "Restroom & water location" (Portuguese)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

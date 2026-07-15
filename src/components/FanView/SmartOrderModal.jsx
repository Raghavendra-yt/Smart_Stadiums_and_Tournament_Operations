import React, { useState } from 'react';
import { useStadium } from '../../context/StadiumContext';
import { 
  ShoppingBag, 
  X, 
  Leaf, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';

export const SmartOrderModal = () => {
  const { activeOrderModal, setActiveOrderModal, placeConcessionOrder } = useStadium();
  const [isOrdered, setIsOrdered] = useState(false);
  const [latestOrderInfo, setLatestOrderInfo] = useState(null);

  if (!activeOrderModal) return null;

  const handleConfirmOrder = () => {
    placeConcessionOrder(activeOrderModal);
    setIsOrdered(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-md w-full p-6 border-emerald-500/30 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveOrderModal(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {!isOrdered ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl border border-amber-500/30">
                🍔
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white font-heading">{activeOrderModal.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{activeOrderModal.location}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Popular Item:</span>
                <span className="font-semibold text-emerald-300">{activeOrderModal.popularItem}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Pickup Wait:</span>
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activeOrderModal.waitMin} minutes
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Eco-Packaging Score:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  🌿 {activeOrderModal.ecoScore}
                </span>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-5 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-200">
                <strong>GenAI Wait Saver:</strong> Placing order now reserves an Express QR Slot at Express Window #2. Avoids 14 min halftime peak rush.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveOrderModal(null)}
                className="w-1/2 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                Confirm Express Pickup <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white font-heading">Order Confirmed!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your food is currently being prepped at <strong>{activeOrderModal.name}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 font-mono space-y-1 text-left">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Express QR Pass:</span>
                <span className="text-emerald-400 font-bold">EX-8902</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Pickup Counter:</span>
                <span className="text-slate-100 font-semibold">Window 2 (Fast Lane)</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Ready In:</span>
                <span className="text-amber-400 font-bold">In 3 Minutes</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOrdered(false);
                setActiveOrderModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Done & Return to Match Hub
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

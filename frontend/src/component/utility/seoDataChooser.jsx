import React, { useState } from "react";
import { Compass } from "lucide-react";

// ==========================================
// AUDIO SYNTH: Premium Audio Feedback (Web Audio API)
// ==========================================
const playBeep = (freq = 600, type = "sine", duration = 0.06) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + duration,
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Fail silently if browser autoplay blocks audio
  }
};

// ========================================================
// STANDALONE COMPONENT: CIRCLE CHOOSER
// ========================================================
/**
 * CircleChooser Component
 * @param {Array} items - Array of data objects (must contain an 'id' field).
 * @param {number|string} activeId - The ID of the currently selected item.
 * @param {function} onChange - Callback function triggered when an item is selected. Receives the item ID.
 */
function CircleChooser({ items = [], activeIndex, onChange }) {
  
  const progressPercent =
    items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 0;

  const handleSelect = (index) => {
    playBeep(650, "sine", 0.06);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto backdrop-blur-xl borderrounded-2xl p-6 shadow-2xl relative overflow-x-auto">
    

      {/* Circle Selector Stepper Track */}
      <div className="relative flex items-center justify-between py-4 px-2">
        {/* Track Line Backing */}
        <div className="absolute left-6 right-6 h-[2px] bg-slate-800/60 z-0" />

        {/* Dynamic Highlight Progress Bar */}
        <div
          className="absolute left-6 h-[2px] bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500 z-0"
          style={{
            width: `calc(${progressPercent}% - ${progressPercent > 0 ? "12px" : "0px"})`,
          }}
        />

        {/* Circular Selector Buttons */}
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className="relative z-10 flex flex-col items-center focus:outline-none group"
            >
              {/* Outer Circular Ring with Blurs and Shadows */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform
                  ${
                    isActive
                      ? "bg-slate-900 border-2 border-sky-400 scale-110 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                      : "bg-slate-950/90 border border-slate-800/80 hover:border-slate-500 hover:scale-105"
                  }
                `}
              >
                {/* Ping wave animation only on active state */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-sky-500/10 animate-ping pointer-events-none" />
                )}

                {/* Number Text inside */}
                <span
                  className={`text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "text-sky-300"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                >
                  {idx + 1}
                </span>
              </div>

              {/* Status/Label tag under the nodes */}
              <span
                className={`absolute -bottom-6 text-[9px] font-semibold tracking-tight uppercase transition-colors duration-200 ${
                  isActive
                    ? "text-sky-400"
                    : "text-slate-600 group-hover:text-slate-500"
                }`}
              >
                SEO Data {idx+1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default CircleChooser;
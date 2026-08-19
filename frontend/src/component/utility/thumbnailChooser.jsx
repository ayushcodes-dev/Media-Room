import React from "react";
import { Image as ImageIcon } from "lucide-react";

// Audio Synth Feedback (Web Audio API)
const playBeep = (freq = 650, type = "sine", duration = 0.06) => {
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
    // Autoplay policy fallback
  }
};

/**
 * ThumbnailChooser Component
 * @param {Array} items - Array of thumbnail objects/strings
 * @param {number} activeIndex - Index of currently selected thumbnail
 * @param {function} onChange - Callback triggered when a thumbnail is selected
 */
export default function ThumbnailChooser({ items = [], activeIndex = 0, onChange }) {
  if (!items || items.length <= 1) return null;

  const progressPercent =
    items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 0;

  const handleSelect = (index) => {
    playBeep(680, "sine", 0.06);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto backdrop-blur-xl rounded-2xl p-4 shadow-2xl relative overflow-x-auto">
      {/* Circle Selector Stepper Track */}
      <div className="relative flex items-center justify-between py-3 px-2">
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
          const thumbnailURL = typeof item === "string" ? item : item?.thumbnailURL;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              className="relative w-14 z-10 flex flex-col items-center focus:outline-none group cursor-pointer"
              title={`Switch to Thumbnail ${idx + 1}`}
            >
              {/* Outer Ring */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform overflow-hidden
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

                {thumbnailURL ? (
                  <img
                    src={thumbnailURL}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className={`text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "text-sky-300"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* Status/Label tag under the node */}
              <span
                className={`absolute -bottom-5 text-[9px] font-semibold tracking-tight uppercase transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-sky-400 font-extrabold"
                    : "text-slate-600 group-hover:text-slate-500"
                }`}
              >
                Image {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

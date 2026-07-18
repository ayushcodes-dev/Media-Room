import { useEffect, useRef, useState } from "react";
import { Settings, X, Sliders, Copy, Check } from "lucide-react";

// Default Configuration (can be overwritten easily by pasting copied config here)
const DEFAULT_CONFIG = {
  shape: "circle",          // Options: 'circle', 'square', 'cross', 'sparkle'
  density: 0.00012,         // Density of star particles (stars per square pixel)
  maxStars: 800,            // Performance cap for total active stars
  minSize: 2,            // Minimum size of stars (scaled by depth)
  maxSize: 4,            // Maximum size of stars (scaled by depth)
  speedX: -0.82,            // Horizontal drift velocity (negative = left, positive = right)
  speedY: -0.45,            // Vertical drift velocity (negative = up, positive = down)
  minOpacity: 0.01,         // Minimum base opacity
  maxOpacity: 0.2,         // Maximum base opacity
  twinkleMinSpeed: 0.001,    // Minimum twinkling frequency speed
  twinkleMaxSpeed: 0.04,    // Maximum twinkling frequency speed
  colors: [
    "255, 255, 255",        // Pure White
    "147, 197, 253",        // Soft Blue (blue-300)
    "196, 181, 253",        // Lavender/Violet (violet-300)
    "253, 186, 116",        // Warm Amber (amber-300)
  ]
};

const StarBackground = () => {
  const canvasRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // Keep configuration values in a ref so the canvas render loop is always in sync without lagging
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Handle re-initialization of stars when count/density factors change
  const initTriggerRef = useRef(null);

  useEffect(() => {
    if (initTriggerRef.current) {
      initTriggerRef.current();
    }
  }, [config.density, config.maxStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let stars = [];

    const drawStar = (ctx, x, y, size, color, alpha, shape) => {
      ctx.beginPath();
      const fillStyle = `rgba(${color}, ${Math.max(0.02, Math.min(alpha, 0.98))})`;
      const strokeStyle = `rgba(${color}, ${Math.max(0.02, Math.min(alpha, 0.98))})`;

      if (shape === "circle") {
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = fillStyle;
        ctx.fill();
      } else if (shape === "square") {
        ctx.rect(x - size, y - size, size * 2, size * 2);
        ctx.fillStyle = fillStyle;
        ctx.fill();
      } else if (shape === "cross") {
        ctx.moveTo(x, y - size * 1.5);
        ctx.lineTo(x, y + size * 1.5);
        ctx.moveTo(x - size * 1.5, y);
        ctx.lineTo(x + size * 1.5, y);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = Math.max(0.5, size * 0.4);
        ctx.stroke();
      } else if (shape === "sparkle") {
        // Four-pointed diamond star
        ctx.moveTo(x, y - size * 2.2);
        ctx.quadraticCurveTo(x, y, x + size * 2.2, y);
        ctx.quadraticCurveTo(x, y, x, y + size * 2.2);
        ctx.quadraticCurveTo(x, y, x - size * 2.2, y);
        ctx.quadraticCurveTo(x, y, x, y - size * 2.2);
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
    };

    const initStars = (width, height) => {
      const c = configRef.current;
      const area = width * height;
      const count = Math.min(Math.floor(area * c.density), c.maxStars);

      stars = [];
      for (let i = 0; i < count; i++) {
        const z = Math.random() * 0.95 + 0.05; // Depth factor (0.05 to 1.0)
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: z,
          twinkleSpeed: Math.random() * (c.twinkleMaxSpeed - c.twinkleMinSpeed) + c.twinkleMinSpeed,
          twinklePhase: Math.random() * Math.PI * 2,
          color: c.colors[Math.floor(Math.random() * c.colors.length)],
        });
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    // Initial setup
    handleResize();
    window.addEventListener("resize", handleResize);

    // Save initial trigger function to ref so we can update count dynamically from sliders
    initTriggerRef.current = () => initStars(canvas.width, canvas.height);

    // Animation Loop
    const render = () => {
      const c = configRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move stars based on speedX/Y and depth factor z (parallax)
        star.x += c.speedX * star.z;
        star.y += c.speedY * star.z;

        // Wrap around boundaries
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Twinkle (sine-wave opacity oscillation)
        star.twinklePhase += star.twinkleSpeed;
        const baseAlpha = star.z * (c.maxOpacity - c.minOpacity) + c.minOpacity;
        const currentAlpha = baseAlpha * (0.75 + 0.25 * Math.sin(star.twinklePhase));

        // Size based on configuration and depth factor
        const size = star.z * (c.maxSize - c.minSize) + c.minSize;

        // Draw the custom star shape
        drawStar(ctx, star.x, star.y, size, star.color, currentAlpha, c.shape);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const copyConfigCode = () => {
    const code = `// Paste this object into DEFAULT_CONFIG at the top of starBackground.jsx\nconst DEFAULT_CONFIG = ${JSON.stringify(config, null, 2)};`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper custom slider component
  const Slider = ({ label, min, max, step, value, field }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-sky-400 font-mono font-semibold">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setConfig((prev) => ({ ...prev, [field]: parseFloat(e.target.value) }))}
        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-400"
      />
    </div>
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10 block"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Tweak Panel UI Overlay */}
     
    </>
  );
};

export default StarBackground;


//  <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
//    {/* Toggle Trigger */}
//    <button
//      onClick={() => setIsOpen(!isOpen)}
//      className="p-2.5 bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white rounded-full border border-slate-800 hover:border-slate-700 shadow-xl cursor-pointer transition-all duration-300 select-none"
//      title="Tweak Background Starfield"
//    >
//      {isOpen ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
//    </button>

//    {/* Expandable sliders container */}
//    {isOpen && (
//      <div className="mt-3 w-80 bg-slate-950/95 backdrop-blur-md border border-slate-800/90 rounded-2xl p-5 shadow-2xl space-y-4 text-slate-200 select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
//        <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
//          <div className="flex items-center gap-1.5">
//            <Sliders className="w-4 h-4 text-sky-400" />
//            <span className="text-xs font-black tracking-wider uppercase text-white">
//              Starfield Tweak Panel
//            </span>
//          </div>
//          <span className="text-[9px] text-slate-500 font-mono">v1.1</span>
//        </div>

//        {/* Shape Buttons */}
//        <div className="space-y-1.5">
//          <span className="text-[11px] text-slate-400 font-medium">
//            Star Shape
//          </span>
//          <div className="flex gap-1">
//            {["circle", "square", "cross", "sparkle"].map((s) => (
//              <button
//                key={s}
//                onClick={() => setConfig((prev) => ({ ...prev, shape: s }))}
//                className={`flex-1 py-1 rounded text-[10px] capitalize transition-all border font-semibold ${
//                  config.shape === s
//                    ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
//                    : "bg-slate-900/40 text-slate-400 border-slate-800/60 hover:border-slate-700/60"
//                }`}
//              >
//                {s}
//              </button>
//            ))}
//          </div>
//        </div>

//        {/* Sliders Area */}
//        <div className="space-y-3.5">
//          <Slider
//            label="Density (stars/px²)"
//            min={0.00001}
//            max={0.0004}
//            step={0.00001}
//            value={config.density}
//            field="density"
//          />
//          <Slider
//            label="Max Stars Limit"
//            min={10}
//            max={400}
//            step={10}
//            value={config.maxStars}
//            field="maxStars"
//          />

//          <div className="grid grid-cols-2 gap-4">
//            <Slider
//              label="Min Size (px)"
//              min={0.05}
//              max={0.5}
//              step={0.05}
//              value={config.minSize}
//              field="minSize"
//            />
//            <Slider
//              label="Max Size (px)"
//              min={0.5}
//              max={2.0}
//              step={0.05}
//              value={config.maxSize}
//              field="maxSize"
//            />
//          </div>

//          <div className="grid grid-cols-2 gap-4">
//            <Slider
//              label="Drift Speed X"
//              min={-1.0}
//              max={1.0}
//              step={0.02}
//              value={config.speedX}
//              field="speedX"
//            />
//            <Slider
//              label="Drift Speed Y"
//              min={-1.0}
//              max={1.0}
//              step={0.02}
//              value={config.speedY}
//              field="speedY"
//            />
//          </div>

//          <div className="grid grid-cols-2 gap-4">
//            <Slider
//              label="Min Opacity"
//              min={0.01}
//              max={0.2}
//              step={0.01}
//              value={config.minOpacity}
//              field="minOpacity"
//            />
//            <Slider
//              label="Max Opacity"
//              min={0.2}
//              max={0.9}
//              step={0.02}
//              value={config.maxOpacity}
//              field="maxOpacity"
//            />
//          </div>
//        </div>

//        {/* Export Config */}
//        <button
//          onClick={copyConfigCode}
//          className="w-full flex items-center justify-center gap-1.5 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 rounded-xl text-xs font-black tracking-wider uppercase border border-sky-500/20 hover:border-sky-500/40 active:scale-95 transition-all duration-150 cursor-pointer shadow-[0_0_15px_rgba(14,165,233,0.05)]"
//        >
//          {copied ? (
//            <>
//              <Check className="w-3.5 h-3.5 text-emerald-400" />
//              Code Copied!
//            </>
//          ) : (
//            <>
//              <Copy className="w-3.5 h-3.5" />
//              Copy Config Code
//            </>
//          )}
//        </button>
//      </div>
//    )}
//  </div>;
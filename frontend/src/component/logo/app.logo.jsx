

export default function AppTextLogo({
  className = "",
  fontSize = "text-4xl",
  fontFamily = "font-syne",
  glowIntensity = "low",
  hoverEffect = "glow",
}) {
  const fontClass = fontFamily === "font-syne" ? "font-syne" : "font-outfit";

  const glowStyles = {
    low: {
      textShadow:
        "0 0 10px rgba(56, 189, 248, 0.15), 0 0 20px rgba(30, 58, 138, 0.1)",
    },
    medium: {
      textShadow:
        "0 0 15px rgba(56, 189, 248, 0.3), 0 0 30px rgba(14, 165, 233, 0.2), 0 0 45px rgba(30, 58, 138, 0.15)",
    },
    high: {
      textShadow:
        "0 0 25px rgba(56, 189, 248, 0.5), 0 0 50px rgba(14, 165, 233, 0.35), 0 0 75px rgba(30, 58, 138, 0.25)",
    },
  };

  const hoverClass = {
    none: "",
    scale: "hover:scale-105 transition-transform duration-500 ease-out",
    glow: "hover:brightness-125 transition-all duration-500 ease-out",
    "scale-glow":
      "hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
  }[hoverEffect];
  return (
    <div
      className={`inline-flex items-center select-none cursor-pointer group relative ${hoverClass} ${className}`}
    >
      {/* Absolute blurring backdrop element - creates high transparency glass feel */}
      <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/10 to-blue-600/10 rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none" />

      <h1
        className={`relative ${fontSize} ${fontClass} font-extrabold tracking-tight flex items-center gap-1`}
      >
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-100 to-sky-300 opacity-95 transition-all"
          style={{ ...glowStyles[glowIntensity], letterSpacing: "-0.03em" }}
        >
          Media
        </span>
        <span className="relative flex h-2 w-2 mx-1 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-30"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-tr from-sky-400 to-blue-500 shadow-lg shadow-sky-400/50"></span>
        </span>
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-sky-300 to-sky-500 font-black"
          style={{ ...glowStyles[glowIntensity], letterSpacing: "-0.02em" }}
        >
          Room
          <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </span>
      </h1>
    </div>
  );
}

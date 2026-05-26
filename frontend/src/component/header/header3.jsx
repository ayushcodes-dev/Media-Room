import { Menu, X, Tv } from "lucide-react";

const APP_CONFIG = {
  name: "TubeNix",
  theme: {
    darkBlueBg: "bg-[#050b18]",
    headerBg: "bg-[#050b18]/80",
    glowColor: "shadow-[0_0_15px_rgba(56,189,248,0.4)]",
    neonBorder: "border-sky-500/20",
    accent: "text-sky-400",
  },
};

/**
 * Header Component
 * Features: Responsive layout, glassmorphism, neon logo, and menu toggle
 */
function Header3({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 ${APP_CONFIG.theme.headerBg} backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-8 transition-all duration-300 z-50`}
    >
      {/* LEFT: Branding & SEO Friendly Logo */}
      <div className="flex items-center gap-3 group cursor-pointer">
        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center ${APP_CONFIG.theme.glowColor} border border-sky-400/30 transition-transform group-hover:scale-105 duration-300`}
        >
          <Tv className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
          {APP_CONFIG.name}
        </span>
      </div>

      {/* RIGHT: Menu Interaction */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-400 rounded-xl transition-all duration-300 focus:outline-none flex items-center gap-2 group"
          aria-label={isSidebarOpen ? "Close Menu" : "Open Menu"}
        >
          <span className="hidden sm:block text-xs font-bold uppercase tracking-widest px-1">
            Menu
          </span>
          <div className="relative w-5 h-5 ">
            {isSidebarOpen ? (
              <X className="w-5 h-5 transition-all duration-300 rotate-0" />
            ) : (
              <Menu className="w-5 h-5 transition-all duration-300 rotate-0 group-hover:scale-110" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
export default Header3;

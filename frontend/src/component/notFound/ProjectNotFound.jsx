import { useNavigate } from "react-router-dom";
import { FolderLock, ArrowRight } from "lucide-react";
import Button1 from "@/component/button/button1.jsx";
import GlassCard from "@/component/cards/glassCard.jsx";

export default function ProjectNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 animate-in">
      <div className="relative w-full max-w-lg">
        {/* Ambient background glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-800 to-blue-900 opacity-20 blur-2xl transition duration-1000 group-hover:duration-200" />
        
        <GlassCard hoverEffect={true} className="relative flex flex-col items-center text-center p-8 sm:p-12 bg-slate-950/40 border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Animated Glowing Icon Wrapper */}
          <div className="relative mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-sky-500/10 blur-xl w-24 h-24 -translate-y-2" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
              <FolderLock className="w-10 h-10 text-sky-400 animate-pulse" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3 mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
              404 - Project Missing
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl animate-fade-in">
              Project Not Found
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              The project you're looking for might have been deleted, renamed, or is temporarily unavailable. Let's get you back on track.
            </p>
          </div>

          {/* Action Button */}
          <Button1
            variant="primary"
            className="w-full sm:w-auto px-10 py-3.5 flex items-center justify-center gap-2 group"
            onClick={() => navigate("/projects")}
            icon={ArrowRight}
          >
            Check All Projects
          </Button1>
        </GlassCard>
      </div>
    </div>
  );
}

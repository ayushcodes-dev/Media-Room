import { Folder } from "lucide-react";
import GlassCard from "@/component/cards/glassCard.jsx";

export default function NoProjects() {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 w-full animate-in">
      <GlassCard hoverEffect={true} className="w-full max-w-xl flex flex-col items-center text-center p-8 bg-slate-950/30 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-sky-500/5 blur-xl w-16 h-16" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900/60 border border-slate-800">
            <Folder className="w-6 h-6 text-slate-500" />
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">
          No Projects Found
        </h3>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
          You haven't created any projects yet. Use the button in the header above to build your first project workspace.
        </p>
      </GlassCard>
    </div>
  );
}

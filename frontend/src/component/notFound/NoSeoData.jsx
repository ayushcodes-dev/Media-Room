import { useNavigate } from "react-router-dom";
import { Sparkles, Image as ImageIcon, AlertCircle, ArrowRight } from "lucide-react";
import GlassCard from "@/component/cards/glassCard.jsx";

export default function NoSeoData({ seoDataGenerated, thumbnailGenerated, projectID, type }) {
  const navigate = useNavigate();

  if (type === "seo") {
    return (
      <GlassCard hoverEffect={true} className="w-full flex flex-col items-center text-center p-8 bg-slate-950/30 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-sky-500/5 blur-xl w-16 h-16" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900/60 border border-slate-800">
            <Sparkles className="w-6 h-6 text-sky-400/60" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          SEO Data Not Generated
        </h3>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
          SEO data not generated
        </p>
        <button
          onClick={() => navigate(`/projects/${projectID}`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <span>Generate SEO Data</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </GlassCard>
    );
  }

  if (type === "thumbnail") {
    return (
      <GlassCard hoverEffect={true} className="w-full flex flex-col items-center text-center p-8 bg-slate-950/30 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-sky-500/5 blur-xl w-16 h-16" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900/60 border border-slate-800">
            <ImageIcon className="w-6 h-6 text-sky-400/60" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Thumbnail Not Generated
        </h3>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
          thumbnail is not generated
        </p>
        <button
          onClick={() => navigate(`/projects/${projectID}`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <span>Generate Thumbnail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </GlassCard>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 w-full animate-in">
      <GlassCard hoverEffect={true} className="w-full max-w-2xl flex flex-col items-center text-center p-8 sm:p-12 bg-slate-950/30 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-sky-500/5 blur-xl w-16 h-16" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900/60 border border-slate-800">
            <AlertCircle className="w-6 h-6 text-sky-400/60 animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          Workspace Empty
        </h3>
        <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-8">
          you have not generated seo data or thumbnail yet
        </p>
        <button
          onClick={() => navigate(`/projects/${projectID}`)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <span>Open Workspace to Generate</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </GlassCard>
    </div>
  );
}

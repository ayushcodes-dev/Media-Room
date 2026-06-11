import MainPage from "@/wrapper/mainPage";
import Protect from "@/wrapper/protect";
import { UseProjectStatus } from "@/hooks/useProjectStatus.jsx";
import { UseProject } from "@/hooks/useProject.jsx";
import { useState, useEffect } from "react";
import {
  Copy,
  Sparkles,
  Image as ImageIcon,
  Tag,
  FileText,
  Share2,
  ChevronRight,
} from "lucide-react";

import MainPageHeader from "@/component/header/mainPage.jsx";
import GlassCard from "@/component/cards/glassCard";
import { NeonButton2 } from "@/component/button/neonButton.jsx";
import SkeletonLoading from "./skeletonLoading";
import copyToClipboard from "@/utility/copyToClipboard.js";
import getProjectStatus from "@/features/project/status.project.js";
import Toaster1 from "@/component/toaster/toaster1.jsx";
import getProjectByID from "@/features/project/get.project.js"
// ==========================================
// MOCK DATA & CONSTANTS
// ==========================================

// 4. SKELETON LOADER
export const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-900/60 rounded-lg w-1/4"></div>

      {/* 3 card rows skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-28 bg-slate-900/40 rounded-xl"></div>
        <div className="h-28 bg-slate-900/40 rounded-xl"></div>
        <div className="h-28 bg-slate-900/40 rounded-xl"></div>
      </div>

      <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="h-6 bg-slate-900/50 rounded-lg w-1/5"></div>
        <div className="h-24 bg-slate-900/30 rounded-xl w-full"></div>
        <div className="h-10 bg-slate-900/40 rounded-xl w-2/3"></div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const { projectStatus, setprojectStatus } = UseProjectStatus();
  const { project, setProject } = UseProject();
  const [toasterData, setToasterData] = useState([]);

  // Skeleton Loading Simulator State
  const [isLoading] = useState(false);

  // Inline status badge designed to perfectly mimic the content/thumbnail capsule controls in the screenshot
  const renderInlineStatusBadge = (status, label) => {
    const colorMap = {
      ready: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
      draft: "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
      pending: "bg-rose-500 shadow-[0_0_8px_#f43f5e]",
    };

    const dotColor = colorMap[status] || colorMap["pending"];

    return (
      <div className="flex-1 flex items-center justify-center gap-2 bg-slate-950/60 border border-slate-800/80 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-400 tracking-wider transition-all duration-300 hover:border-slate-700/80">
        <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} />
        <span className="uppercase text-[9px]">{label}</span>
      </div>
    );
  };
  async function handleDashboard() {
    const res = await getProjectStatus({
      projectStatus,
      setprojectStatus,
      setToasterData,
    });
    if (res && res.length > 0) {
getProjectByID({ projectID: res[0].projectID }, { setProject });
    }
  }
  useEffect(() => {handleDashboard()}, []);

  return (
    <Protect>
      <MainPage>
        <Toaster1 data={toasterData} />

        <div>
          {/* MAIN CONTENT AREA */}
          {isLoading ? (
            <SkeletonLoading />
          ) : (
            <main className="flex-1 px-4 md:px-8 py-6 mb-20 md:py-8 max-w-7xl mx-auto w-full space-y-6 ">
              {/* TOP DASHBOARD CONTROL PANEL */}
              <MainPageHeader
                title="Your Dashboard"
                description="Select and manage your metadata blueprints for YouTube
          content creation"
              />
              {/* DYNAMIC METADATA WORKSPACES */}

              <div className="space-y-8 animate-fade-in">
                {/* LAST PROJECT */}
                <div className="space-y-4">
                  <div className="flex items-center pl-0.5">
                    <span className="w-1 h-5 bg-sky-400 rounded shadow-[0_0_8px_#38bdf8] mr-3" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400">
                      Last Project
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* METADATA EXPORT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">
                      <GlassCard
                        hoverEffect={false}
                        className="h-full flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                      >
                        <div>
                          {/* Workspace heading */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-5 mb-6">
                            <div>
                              <h2 className="text-2xl font-black text-white tracking-tight">
                                {/* {selectedProject.name} */}
                              </h2>
                            </div>

                            <div className="flex items-center gap-2">
                              <NeonButton2
                                onClick={() =>
                                  copyToClipboard("hello", "metadata file")
                                }
                                variant="secondary"
                                icon={Share2}
                                className="text-[11px] px-3.5 py-2"
                              >
                                Export JSON
                              </NeonButton2>
                            </div>
                          </div>

                          {/* METADATA FIELDS */}
                          <div className="space-y-5">
                            {/* TITLE CONTAINER */}
                            <div className="group relative bg-slate-950/50 border border-slate-800 rounded-xl p-5 transition-all duration-300 hover:border-slate-400 shadow-inner">
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                                  Optimized Title
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      "selectedProject.title",
                                      "Title",
                                    )
                                  }
                                  className="text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center gap-1.5 border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)]"
                                  title="Copy Title"
                                >
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </button>
                              </div>
                              <p className="text-sm font-semibold text-slate-100 leading-relaxed pr-6 select-all">
                                {/* {selectedProject.title} */}
                              </p>
                            </div>

                            {/* DESCRIPTION CONTAINER */}
                            <div className="group relative bg-slate-950/50 border border-slate-800 rounded-xl p-5 transition-all duration-300 hover:border-slate-400 shadow-inner">
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                                  AI Generated Video Description
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      "selectedProject.description",
                                      "Description",
                                    )
                                  }
                                  className="text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center gap-1.5 border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)]"
                                  title="Copy Description"
                                >
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </button>
                              </div>
                              <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap pr-6 select-all">
                                {/* {selectedProject.description} */}
                              </p>
                            </div>

                            {/* SEO TAGS */}
                            <div className="relative bg-slate-950/50 border  border-slate-800 rounded-xl p-5 transition-all duration-300 hover:border-slate-400 shadow-inner">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                  <Tag className="w-3.5 h-3.5 text-sky-400" />
                                  SEO Keyword Tags
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      " selectedProject.tags",
                                      "SEO Tags",
                                    )
                                  }
                                  className="text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center gap-1.5 border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)]"
                                  title="Copy Tags"
                                >
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pr-6">
                                {/* {selectedProject.tags
                                  .split(",")
                                  .map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/15 px-3 py-1 rounded-lg"
                                    >
                                      #{tag.trim()}
                                    </span>
                                  ))} */}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                          {/* <span>Created {selectedProject.date}</span> */}
                        </div>
                      </GlassCard>
                    </div>

                    {/* VISUAL ASSET PREVIEW COLUMN */}
                    <div>
                      <GlassCard
                        hoverEffect={false}
                        className="space-y-5 flex flex-col justify-between h-full shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                      >
                        <div className="space-y-5">
                          <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                              Visual Asset Preview
                            </span>
                          </div>

                          {/* RENDER FALLBACK LOGIC WITH SHARP GLOSSY BORDERS */}
                          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-2xl">
                            {/* {selectedProject.thumbnail ? (
                              <>
                                <img
                                  src={selectedProject.thumbnail}
                                  alt="Generated Preview Thumbnail"
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[8px] text-emerald-400 font-extrabold uppercase tracking-widest shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                                  Ready
                                </div>
                              </>
                            ) : (
                              <div className="text-center p-6 space-y-2">
                                <ImageIcon className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                  Not Generated
                                </p>
                                <p className="text-[9px] text-slate-600 max-w-[200px]">
                                  Thumbnail canvas prompt is available to feed
                                  into image generators.
                                </p>
                              </div>
                            )} */}
                          </div>

                          {/* PROMPT SCRIPT PROJECTION */}
                          <div className="group relative bg-slate-950/50 border border-slate-800 rounded-xl p-5 transition-all duration-300 hover:border-slate-400 shadow-inner">
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                AI Thumbnail Prompt
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    "selectedProject.prompt",
                                    "Thumbnail Prompt",
                                  )
                                }
                                className="text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center gap-1.5 border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)]"
                                title="Copy Prompt"
                              >
                                <Copy className="w-3 h-3" />
                                Copy
                              </button>
                            </div>
                            <p className="text-xs text-sky-100 italic leading-relaxed pr-6 select-all">
                              {/* "{  }" */}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 flex justify-between items-center">
                          <span>Aspect Ratio: 16:9</span>
                          <span>HD Preview ready</span>
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}
        </div>
      </MainPage>
    </Protect>
  );
}

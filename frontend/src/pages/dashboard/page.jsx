import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Terminal,
  Hash,
  FileText,
  MousePointer2,
  ChevronRight,
  Zap,
} from "lucide-react";
import CopyButton from "@/component/button/copyButton";
import StatusCard from "@/component/cards/statusCard";
import MainPage from "@/wrapper/mainPage";
import Protect from "@/wrapper/protect";
const MOCK_PROJECTS = [
  {
    id: 1,
    name: "AI Tech Review 2024",
    status: { content: "green", thumbnail: "green" },
    title: "The Future of AI: 10 Tools You Need to Know",
    description:
      "Deep dive into the most influential AI tools of 2024 and how they are changing the landscape of software development.",
    tags: "AI, Technology, 2024, ML",
    prompt:
      "A high-tech laboratory with holographic displays, cinematic lighting.",
    thumbnailPrompt:
      "A sleek robot hand holding a glowing crystal orb, dark blue background.",
    thumbnailSrc:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "Fitness Journey Vlog",
    status: { content: "green", thumbnail: "yellow" },
    title: "How I Lost 20lbs in 3 Months: Real Talk",
    description:
      "No magic pills, just hard work and consistency. Sharing my full workout routine and meal plan.",
    tags: "Fitness, Health, Weightloss",
    prompt:
      "A person running on a coastal road during sunrise, orange and blue hues.",
    thumbnailPrompt:
      "Close up of running shoes on asphalt, morning dew, vibrant colors.",
    thumbnailSrc:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Tokyo Night Walk",
    status: { content: "yellow", thumbnail: "red" },
    title: "Tokyo at 3 AM: A Cyberpunk Reality",
    description:
      "Walking through Shinjuku at night. The lights, the rain, and the atmosphere are out of this world.",
    tags: "Travel, Tokyo, Cyberpunk, Japan",
    prompt: "Rainy Tokyo street at night, neon signs reflecting in puddles.",
    thumbnailPrompt:
      "Abstract neon lights of a city, bokeh effect, deep purples and cyans.",
    thumbnailSrc: "",
  },
];

const GlassCard = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const SkeletonLoader = () => (
  <div className="space-y-12 animate-pulse">
    {/* Section 1: Workspaces Title */}
    <div className="flex items-center gap-3 mb-6 px-2">
      <div className="w-2 h-8 bg-white/10 rounded-full" />
      <div className="h-6 w-32 bg-white/5 rounded-md" />
    </div>

    {/* Section 2: Horizontal Project Cards */}
    <div className="flex gap-6 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="min-w-[300px] p-6 bg-white/5 rounded-3xl border border-white/10 space-y-8"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-5 w-3/4 bg-white/10 rounded" />
              <div className="h-3 w-1/4 bg-white/5 rounded" />
            </div>
            <div className="h-5 w-5 bg-white/10 rounded" />
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <div className="flex-1 h-12 bg-white/5 rounded-2xl" />
            <div className="flex-1 h-12 bg-white/5 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>

    {/* Section 3: Detailed Project View Card */}
    <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
      {/* Skeleton Header */}
      <div className="p-8 border-b border-white/5 bg-white/[0.02]">
        <div className="h-3 w-24 bg-white/10 rounded mb-3" />
        <div className="h-10 w-1/3 bg-white/10 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-8 md:p-10 space-y-10 border-r border-white/5">
          {/* Skeleton Title Field */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-white/10 rounded" />
              <div className="h-8 w-16 bg-white/10 rounded-xl" />
            </div>
            <div className="h-16 w-full bg-white/5 rounded-2xl" />
          </div>
          {/* Skeleton Description Field */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-white/10 rounded" />
              <div className="h-8 w-16 bg-white/10 rounded-xl" />
            </div>
            <div className="h-32 w-full bg-white/5 rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="h-24 w-full bg-white/5 rounded-2xl" />
            <div className="h-24 w-full bg-white/5 rounded-2xl" />
          </div>
        </div>

        <div className="lg:col-span-5 p-8 md:p-10 bg-white/[0.01] space-y-10">
          {/* Skeleton Thumbnail */}
          <div className="space-y-4">
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="aspect-video w-full bg-white/5 rounded-3xl border border-white/5" />
          </div>
          {/* Skeleton Thumbnail Prompt */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-white/10 rounded" />
              <div className="h-8 w-16 bg-white/10 rounded-xl" />
            </div>
            <div className="h-24 w-full bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0]);

  useEffect(() => {
    // Initial data fetch simulation
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Protect>
      <MainPage>
        <div>
          {/* <div className="left-[-15%] w-[50%] h-[50%] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-blue-700/10 rounded-full blur-[140px] pointer-events-none" /> */}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar relative">
            <div className=" max-w-6xl mx-auto px-6 py-8 pb-20">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  {}
                  <section>
                    <div className="flex items-center justify-between mb-6 px-2">
                      <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter text-white">
                        <span className="w-2 h-8 bg-sky-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                        Workspaces
                      </h2>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x scroll-smooth">
                      {MOCK_PROJECTS.map((proj) => (
                        <GlassCard
                          key={proj.id}
                          onClick={() => setSelectedProject(proj)}
                          className={`min-w-[300px] p-6 cursor-pointer snap-start hover:scale-[1.03] active:scale-95 group relative overflow-hidden
                        ${selectedProject.id === proj.id ? "border-sky-400/50 bg-sky-400/5 shadow-[0_0_30px_rgba(56,189,248,0.1)]" : ""}`}
                        >
                          <div className="flex justify-between items-start mb-8">
                            <div className="flex-1 pr-2">
                              <h3
                                className={`font-black text-xl transition-colors mb-1 truncate
                            ${selectedProject.id === proj.id ? "text-sky-400" : "text-white"}`}
                              >
                                {proj.name}
                              </h3>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                ID: 00{proj.id}
                              </p>
                            </div>
                            <ChevronRight
                              size={18}
                              className={`text-slate-600 transition-all flex-shrink-0 ${selectedProject.id === proj.id ? "translate-x-1 text-sky-400" : ""}`}
                            />
                          </div>

                          {/* Workspace Status Section */}
                          <div className="flex gap-3 pt-4 border-t border-white/5">
                            <StatusCard
                              label="Content"
                              color={proj.status.content}
                            />
                            <StatusCard
                              label="Thumbnail"
                              color={proj.status.thumbnail}
                            />
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  </section>

                  {}
                  <section>
                    <GlassCard className="p-0 overflow-hidden border-sky-400/20 shadow-2xl">
                      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-sky-500/[0.07] to-transparent">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400/80">
                            Project Analytics Overview
                          </span>
                        </div>
                        <h2 className="text-4xl font-black text-white leading-tight">
                          {selectedProject.name}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Left Column: Text Content */}
                        <div className="lg:col-span-7 p-8 md:p-10 space-y-10 border-r border-white/5">
                          {/* Optimized Title */}
                          <div className="space-y-3 group">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest group-hover:text-sky-400 transition-colors">
                                <FileText size={16} className="text-sky-500" />{" "}
                                Optimized Title
                              </label>
                              <CopyButton text={selectedProject.title} />
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 text-white font-bold text-lg ring-1 ring-white/5 group-hover:ring-sky-500/20 transition-all">
                              {selectedProject.title}
                            </div>
                          </div>

                          {/* Video Description */}
                          <div className="space-y-3 group">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest group-hover:text-sky-400 transition-colors">
                                <Terminal size={16} className="text-sky-500" />{" "}
                                Video Description
                              </label>
                              <CopyButton text={selectedProject.description} />
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 text-sm leading-relaxed text-slate-300 min-h-[120px] group-hover:ring-1 ring-sky-500/20 transition-all">
                              {selectedProject.description}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* SEO Tags */}
                            <div className="space-y-3 group">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest group-hover:text-sky-400 transition-colors">
                                  <Hash size={16} className="text-sky-500" />{" "}
                                  SEO Tags
                                </label>
                                <CopyButton text={selectedProject.tags} />
                              </div>
                              <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 text-sm text-sky-400 font-mono ring-1 ring-sky-500/10 group-hover:ring-sky-500/30 transition-all">
                                {selectedProject.tags}
                              </div>
                            </div>

                            {/* Core Prompt */}
                            <div className="space-y-3 group">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest group-hover:text-sky-400 transition-colors">
                                  <MousePointer2
                                    size={16}
                                    className="text-sky-500"
                                  />{" "}
                                  Core Prompt
                                </label>
                                <CopyButton text={selectedProject.prompt} />
                              </div>
                              <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 text-sm italic text-slate-400 group-hover:text-slate-300 transition-colors">
                                {selectedProject.prompt}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Visual Assets */}
                        <div className="lg:col-span-5 p-8 md:p-10 bg-white/[0.01] space-y-10">
                          {/* Thumbnail Preview */}
                          <div className="space-y-4">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
                              <ImageIcon size={18} className="text-sky-500" />{" "}
                              Visual Asset Preview
                            </label>
                            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/10 glass-border group relative shadow-2xl bg-slate-950/50">
                              {selectedProject.thumbnailSrc ? (
                                <img
                                  src={selectedProject.thumbnailSrc}
                                  alt="Thumbnail"
                                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5">
                                  <ImageIcon
                                    className="text-slate-800 animate-pulse"
                                    size={56}
                                  />
                                  <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                                    Not Generated
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <span className="text-xs text-white font-bold uppercase tracking-widest">
                                  Asset Active
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Thumbnail Prompt */}
                          <div className="space-y-4 group">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest group-hover:text-sky-400 transition-colors">
                                <Zap size={16} className="text-sky-500" /> Image
                                Prompt
                              </label>
                              <CopyButton
                                text={selectedProject.thumbnailPrompt}
                              />
                            </div>
                            <div className="p-6 rounded-2xl bg-sky-500/[0.03] border border-sky-500/20 text-sm text-sky-100 leading-relaxed font-medium group-hover:bg-sky-500/[0.06] transition-all">
                              {selectedProject.thumbnailPrompt}
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </section>
                </div>
              )}
            </div>
          </main>

          <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .glass-border {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
        }
        ::selection {
          background: rgba(56, 189, 248, 0.3);
          color: white;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
        </div>
      </MainPage>
    </Protect>
  );
}

import MainPage from "@/wrapper/mainPage";
import Protect from "@/wrapper/protect";

import { useState } from "react";
import {
  Copy,
  Sparkles,
  Image as ImageIcon,
  Tag,
  FileText,
  Share2,
  ChevronRight,
  Plus,
} from "lucide-react";
import GlassCard from "@/component/cards/glassCard";
import { NeonButton2 } from "@/component/button/neonButton.jsx";
import SkeletonLoading from "./skeletonLoading";
import copyToClipboard from "@/utility/copyToClipboard.js"

// ==========================================
// MOCK DATA & CONSTANTS
// ==========================================
const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    uid: "001",
    name: "AI Tech Review 2024",
    title: "The Future of AI: 10 Tools You Need to Know",
    description:
      "Master React 19 new features including Actions, Server Components, useActionState, and more! Get ready for next-gen web development with hands-on coding examples designed for absolute beginners.",
    tags: "ai tools, artificial intelligence, tech review, artificial intelligence tutorial, future technology",
    prompt:
      "A futuristic digital workspace screen showing glowy cyan reactant code atoms, high contrast neon styling, depth of field, ultra realistic 3D render, tech background",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    contentStatus: "ready", // green
    thumbnailStatus: "ready", // green
    date: "2026-05-24",
  },
  {
    id: "proj-2",
    uid: "002",
    name: "Fitness Journey Vlog",
    title: "How I Transformed My Body in 90 Days (No Gym Required!)",
    description:
      "Learn the architectural patterns behind state-of-the-art AI agents. From memory vector search to action planners, we dismantle how companies are building production-ready cognitive bots.",
    tags: "fitness transformation, weight loss, body transformation, home workout, healthy lifestyle",
    prompt:
      "A conceptual visualization of an glowing cybernetic brain interacting with server nodes, sky blue neon connections, dark reflective glossy floor, cinematic render, 8k",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    contentStatus: "ready", // green
    thumbnailStatus: "draft", // yellow
    date: "2026-05-20",
  },
  {
    id: "proj-3",
    uid: "003",
    name: "Tokyo Night Walk",
    title: "Midnight Tokyo 4K - Rain Walks with Binaural Neon Ambience",
    description:
      "Step up your CSS designs with complex backdrop-filter, dynamic border-images, and subtle neon drop-shadows. Live coding with pure utility classes to build premium modern web applications.",
    tags: "tokyo walk, nighttime tokyo, rain walk, dynamic city lights, 4k street walk, virtual tour",
    prompt:
      "Abstract transparent glass panels reflecting soft cyber-punk sky-blue lights, high-end design dashboard mockups, modern UI aesthetics, ultra minimal render",
    thumbnail: null, // "Not Generated" fallback state
    contentStatus: "draft", // yellow
    thumbnailStatus: "pending", // red
    date: "2026-05-18",
  },
  {
    id: "proj-4",
    uid: "004",
    name: "React 19 Complete Guide",
    title: "React 19 is HERE! Everything You Need to Know (In 10 Minutes)",
    description:
      "Master React 19 new features including Actions, Server Components, useActionState, and more! Get ready for next-gen web development with hands-on coding examples designed for absolute beginners.",
    tags: "react 19, reactjs tutorial, web development, javascript, learn react, frontend engineering, coding",
    prompt:
      "A futuristic digital workspace screen showing glowy cyan reactant code atoms, high contrast neon styling, depth of field, ultra realistic 3D render, tech background",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    contentStatus: "ready", // green
    thumbnailStatus: "ready", // green
    date: "2026-05-24",
  },
  {
    id: "proj-5",
    uid: "005",
    name: "AI Agent Architectures",
    title: "How to Build an AI Agent in 2026: Step-by-Step System Design",
    description:
      "Learn the architectural patterns behind state-of-the-art AI agents. From memory vector search to action planners, we dismantle how companies are building production-ready cognitive bots.",
    tags: "ai agents, artificial intelligence, LLM, system design, chatgpt api, automation, python ai",
    prompt:
      "A conceptual visualization of an glowing cybernetic brain interacting with server nodes, sky blue neon connections, dark reflective glossy floor, cinematic render, 8k",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    contentStatus: "draft", // yellow
    thumbnailStatus: "ready", // green
    date: "2026-05-20",
  },
  {
    id: "proj-6",
    uid: "006",
    name: "Tailwind Glassmorphic UI",
    title:
      "Craft Stunning Glassmorphic Layouts in Tailwind CSS with Neon Accents",
    description:
      "Step up your CSS designs with complex backdrop-filter, dynamic border-images, and subtle neon drop-shadows. Live coding with pure utility classes to build premium modern web applications.",
    tags: "tailwind css, CSS tutorials, UI UX design, glassmorphism, front-end tips, web design tutorial",
    prompt:
      "Abstract transparent glass panels reflecting soft cyber-punk sky-blue lights, high-end design dashboard mockups, modern UI aesthetics, ultra minimal render",
    thumbnail: null, // "Not Generated" fallback state
    contentStatus: "pending", // red
    thumbnailStatus: "pending", // red
    date: "2026-05-18",
  },
  {
    id: "proj-7",
    uid: "007",
    name: "TypeScript Mastery Pro",
    title: "TypeScript Advanced Types: Level Up from Intermediate to Guru",
    description:
      "Crack open advanced generic types, mapped types, conditional types, and template literal keys. Learn how to design bulletproof type-safe libraries without breaking a sweat.",
    tags: "typescript, ts generic, typescript tutorial, react typescript, node js, programming expert",
    prompt:
      "Monospace glowing letters TS in a dark sleek tech sphere, neon sky blue particle aura, floating in dark void, cinematic atmosphere",
    thumbnail:
      "https://images.unsplash.com/photo-1516116211223-5c359a36298a?w=800&auto=format&fit=crop&q=80",
    contentStatus: "ready", // green
    thumbnailStatus: "draft", // yellow
    date: "2026-05-15",
  },
  {
    id: "proj-8",
    uid: "008",
    name: "SEO Tricks For Creators",
    title:
      "The Hidden Algorithm: Advanced SEO Secrets YouTube Doesn't Want You To Know",
    description:
      "Unlock explosive channel growth with calculated metadata strategies. Learn semantic search matching, tag hierarchies, and high-CTR thumbnail prompts designed to outrank competition.",
    tags: "youtube seo, seo tutorial, youtube algorithm, channel growth, marketing strategy, video tags",
    prompt:
      "A sleek modern neon-blue graph arrow piercing upwards through glass grids, corporate cyberpunk styling, high key illumination, clean geometric vectors",
    thumbnail: null,
    contentStatus: "draft",
    thumbnailStatus: "pending",
    date: "2026-05-11",
  },
];

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
  // Projects State
  const [projects] = useState(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState(
    INITIAL_PROJECTS[0].id,
  );
  // Skeleton Loading Simulator State
  const [isLoading] = useState(false);  
 
  // Find currently selected project object
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Quick generation mockup to insert real projects dynamically


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

  return (
    <Protect>
      <MainPage>
        <div>
          {/* MAIN CONTENT AREA */}
          {isLoading ? (
            <SkeletonLoading />
          ) : (
            <main className="flex-1 px-4 md:px-8 py-6 mb-20 md:py-8 max-w-7xl mx-auto w-full space-y-6 ">
              {/* TOP DASHBOARD CONTROL PANEL */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/65 pb-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    Dashboard
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Select and manage your metadata blueprints for YouTube
                    content creation
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <NeonButton2
                    variant="secondary"
                    icon={Plus}
                    className="text-xs"
                  >
                    Create Project
                  </NeonButton2>
                </div>
              </div>
              {/* DYNAMIC METADATA WORKSPACES */}

              <div className="space-y-8 animate-fade-in">
                {/* WORKSPACES ROW (Screenshot visual match) */}
                <div className="space-y-4">
                  <div className="flex items-center pl-0.5">
                    {/* Glowing sky-blue vertical indicator bar on title */}
                    <span className="w-1 h-5 bg-sky-400 rounded shadow-[0_0_8px_#38bdf8] mr-3" />
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-300">
                      Workspaces
                    </h3>
                  </div>

                  <div
                    className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth 
                [&::-webkit-scrollbar]:h-2 
                [&::-webkit-scrollbar-track]:bg-slate-950/20 
                [&::-webkit-scrollbar-thumb]:bg-sky-500/20 
                hover:[&::-webkit-scrollbar-thumb]:bg-sky-400/40 
                [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    {projects.map((p) => {
                      const isSelected = p.id === selectedProjectId;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedProjectId(p.id)}
                          className={`
                        snap-start shrink-0 w-[300px] cursor-pointer relative rounded-2xl p-6 transition-all duration-300 select-none
                        backdrop-blur-xl border
                        ${
                          isSelected
                            ? "bg-slate-900/60 border-sky-500/80 shadow-[0_0_20px_rgba(14,165,233,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)]"
                            : "bg-slate-900/20 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/40"
                        }
                      `}
                        >
                          {/* Project header with Chevron right */}
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="font-bold text-base text-slate-100 group-hover:text-sky-300 transition-colors">
                              {p.name}
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                          </div>

                          {/* UID Tag under title */}
                          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-5">
                            ID: {p.uid}
                          </div>

                          {/* Double layout capsule status pills styled exactly as shown in screenshot */}
                          <div className="flex gap-2.5 w-full">
                            {renderInlineStatusBadge(
                              p.contentStatus,
                              "Content",
                            )}
                            {renderInlineStatusBadge(
                              p.thumbnailStatus,
                              "Thumbnail",
                            )}
                          </div>

                          {/* Active blueprint header glow strip */}
                          {isSelected && (
                            <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* EXPANDED DETAILED WORKSPACE PREVIEW */}
                <div className="space-y-4">
                  <div className="flex items-center pl-0.5">
                    <span className="w-1 h-5 bg-sky-400 rounded shadow-[0_0_8px_#38bdf8] mr-3" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400">
                      Project Analytics Overview
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
                                {selectedProject.name}
                              </h2>
                            </div>

                            <div className="flex items-center gap-2">
                              <NeonButton2
                                onClick={() =>
                                  copyToClipboard(
                                    JSON.stringify(selectedProject, null, 2),
                                    "metadata file",
                                  )
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
                                      selectedProject.title,
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
                                {selectedProject.title}
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
                                      selectedProject.description,
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
                                {selectedProject.description}
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
                                      selectedProject.tags,
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
                                {selectedProject.tags
                                  .split(",")
                                  .map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/15 px-3 py-1 rounded-lg"
                                    >
                                      #{tag.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Created {selectedProject.date}</span>
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
                            {selectedProject.thumbnail ? (
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
                            )}
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
                                    selectedProject.prompt,
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
                              "{selectedProject.prompt}"
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

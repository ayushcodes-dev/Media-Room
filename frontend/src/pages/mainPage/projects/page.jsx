import MainPage from "@/wrapper/mainPage";
import Protect from "@/wrapper/protect";
import { UseProjectStatus } from "@/hooks/useProjectStatus.jsx";
import { useState, useEffect } from "react";
import { Search, ChevronRight, X } from "lucide-react";
import MainPageHeader from "@/component/header/mainPage.jsx";
import InputField from "@/component/input/input1.jsx";
import SkeletonLoading from "./skeletonLoading";
import getProjectStatus from "@/features/project/status.project.js";
import Toaster1 from "@/component/toaster/toaster1.jsx";
import GlassCard from "@/component/cards/glassCard.jsx";
import NeonButton from "@/component/button/neonButton.jsx";
import { useSearchParams } from "react-router-dom";
import createProject from "@/features/project/create.project.js";
import { useNavigate } from "react-router-dom";
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
  const { projectStatus, setprojectStatus } = UseProjectStatus();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toasterData, setToasterData] = useState([]);
  // Projects State
  const [projects] = useState(INITIAL_PROJECTS);

  const [search, setSearch] = useState("");
  const [projectName, setProjectName] = useState("");
  // Skeleton Loading Simulator State
  const [isLoading] = useState(false);
  const [isCreateCard, setIsCreateCard] = useState(false);
  const cardParams = searchParams.get("createProject");
  const navigate = useNavigate();

  useEffect(() => {
    // Compare against the string value "true"
    console.log(cardParams);
    if (cardParams === "true") {
      setIsCreateCard(true);
    } else {
      setIsCreateCard(false);
    }
  }, [cardParams]);
  const toggleCreateCardState = () => {
    if (cardParams === "false" || !cardParams) {
      setSearchParams({ createProject: "true" });
    } else {
      setSearchParams({ createProject: "false" });
    }
  };

  // Quick generation mockup to insert real projects dynamically

  // Inline status badge designed to perfectly mimic the content/thumbnail capsule controls in the screenshot
  const renderInlineStatusBadge = (status, label) => {
    const colorMap = {
      ready: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
      draft: "bg-amber-300 shadow-[0_0_8px_#f59e0b]",
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
  useEffect(() => {
    getProjectStatus({ projectStatus, setprojectStatus, setToasterData });
  }, []);

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
                title="Your Projects"
                description="Select and manage your metadata blueprints for YouTube
          content creation"
              />
              {isCreateCard ? (
                <GlassCard className="pt-4 md:w-130  sm:w-100 fixed w-80  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-9">
                  <div className="h-2 w-full flex justify-end">
                    <button
                      onClick={() => {
                        toggleCreateCardState();
                      }}
                      className="h-7 w-7 flex justify-center items-center pb-2 z-10"
                    >
                      <X className="text-slate-400 " size={20} />
                    </button>
                  </div>

                  <InputField
                    icon={Search}
                    label="Create Project"
                    type="text"
                    placeholder="Enter Project Name"
                    id="projectName"
                    autoComplete="project-name"
                    state={projectName}
                    setState={setProjectName}
                  />
                  <NeonButton
                    variant="outline"
                    onClick={async () => {
                      const response = await createProject(
                        { projectName },
                        { setToasterData, setprojectStatus },
                      );
                      toggleCreateCardState();
                      navigate("/project/" + response.data.projectID);
                    }}
                  >
                    Create project
                  </NeonButton>
                </GlassCard>
              ) : (
                ""
              )}
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
                  <div className="w-full">
                    <InputField
                      icon={Search}
                      type="text"
                      placeholder="Search Your Projects"
                      id="search"
                      autoComplete="current-search"
                      state={search}
                      setState={setSearch}
                    />
                  </div>
                  <div
                    className="grid gap-5 pb-4 pt-1  scroll-smooth lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1
                [&::-webkit-scrollbar]:h-2 
                [&::-webkit-scrollbar-track]:bg-slate-950/20 
                [&::-webkit-scrollbar-thumb]:bg-sky-500/20 
                hover:[&::-webkit-scrollbar-thumb]:bg-sky-400/40 
                [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    {projects.map((p) => {
                      return (
                        <div
                          key={p.id}
                          className={`
                         w-full cursor-pointer relative rounded-2xl p-6 transition-all duration-300 select-none
                        backdrop-blur-xl border
                        bg-slate-900/20 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/40
                              hover: bg-slate-900/60 border-sky-500/80 shadow-[0_0_20px_rgba(14,165,233,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      
                      
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
                          <div className="mt-2 pt-2  border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                            <span>Created {p.date}</span>
                          </div>
                        </div>
                      );
                    })}
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

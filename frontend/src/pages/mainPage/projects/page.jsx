import MainPage from "@/wrapper/mainPage";
import Protect from "@/wrapper/protect";

import { useState, useEffect, useContext } from "react";
import { Search, ChevronRight, X, ArrowUpRight, Hash, Calendar } from "lucide-react";
import MainPageHeader from "@/component/header/mainPage.jsx";
import InputField from "@/component/input/input1.jsx";
import ProjectsSkeleton from "@/component/loader/projectsSkeleton";
import getProjectStatus from "@/features/project/status.project.js";
import Toaster1 from "@/component/toaster/toaster1.jsx";
import GlassCard from "@/component/cards/glassCard.jsx";
import NeonButton from "@/component/button/neonButton.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import createProject from "@/features/project/create.project.js";
import projectStatusContext from "@/context/projectStatus.js";
import NoProjects from "@/component/notFound/NoProjects";

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
  const { projectStatus, setprojectStatus } = useContext(projectStatusContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [toasterData, setToasterData] = useState([]);
  // Projects State

  const [search, setSearch] = useState("");
  const [projectName, setProjectName] = useState("");
  // Skeleton Loading Simulator State
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateCard, setIsCreateCard] = useState(false);
  const [createProjectButtonDisabled, setCreateProjectButtonDisabled] = useState(true);
  const cardParams = searchParams.get("createProject");
  const navigate = useNavigate();

  useEffect(() => {
    if (cardParams === "true") {
      setIsCreateCard(true);
    } else {
      setIsCreateCard(false);
    }
  }, [cardParams]);

  async function handleApp() {
    if (projectStatus.length>0) setIsLoading(false);
    const res = await getProjectStatus({
      projectStatus,
      setprojectStatus,
      setToasterData,
    });

    if (res && res.length > 0) {
      setprojectStatus(() => [...res]);
      //const data = await getProjectByID({ projectID: res[0].projectID }, { setProject });
    }
    setIsLoading(false);
  }
  useEffect(() => {
    document.title = "Dashboard | Media Room";
    handleApp();
  }, []);



  //  useEffect(() => {
  //    document.title = "Projects | Media Room";
  //    async function fetch() {
  //      const res = await getProjectStatus({
  //       projectStatus,
  //       setprojectStatus,
  //       setToasterData,
  //     });
  //      if(res && res.length > 0) {
  //       setprojectStatus(() => [...res]);
  //       setDataFetched(true);
  //      console.log("Fetched project status:", res);
  //      }else{
  // setDataFetched(false);
  //      }

  //    }
  //    fetch();
  //  }, []);

  const handleCopyId = (e, projectID) => {
    e.stopPropagation();
    navigator.clipboard.writeText(projectID);
    setToasterData((prev) => [
      ...prev,
      {
        id: `copy_${Date.now()}`,
        status: "success",
        info: "copied",
        align: "top-right",
        duration: 3000,
      },
    ]);
  };

  const toggleCreateCardState = () => {
    if (cardParams === "false" || !cardParams) {
      setSearchParams({ createProject: "true" });
    } else {
      setSearchParams({ createProject: "false" });
    }
  };
  // Inline status badge designed to perfectly mimic the content/thumbnail capsule controls in the screenshot
  const renderAttractiveStatus = (status, type) => {
    let labelColor = "text-slate-400 bg-slate-500/10 border-slate-500/20";
    let dotColor = "bg-slate-500 shadow-[0_0_8px_#64748b]";
    let statusText = "Draft";

    const s = (status || "").toLowerCase();

    if (s === "completed" || s === "ready") {
      labelColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      dotColor = "bg-emerald-400 shadow-[0_0_8px_#10b981]";
      statusText = "Ready";
    } else if (s === "processing") {
      labelColor = "text-sky-400 bg-sky-500/10 border-sky-500/20";
      dotColor = "bg-sky-400 shadow-[0_0_8px_#0ea5e9] animate-pulse";
      statusText = "Processing";
    } else if (s === "pending") {
      labelColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
      dotColor = "bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse";
      statusText = "Pending";
    } else if (s === "failed") {
      labelColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
      dotColor = "bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse";
      statusText = "Failed";
    } else if (s === "unbegun" || s === "draft") {
      labelColor = "text-slate-400 bg-slate-500/10 border-slate-500/20";
      dotColor = "bg-slate-500 shadow-[0_0_8px_#64748b]";
      statusText = "Draft";
    }

    return (
      <div className={`flex-1 flex items-center justify-between px-3 py-1.5 rounded-xl border ${labelColor} text-[10px] font-extrabold uppercase tracking-widest transition-all duration-305`}>
        <span className="text-[9px] text-slate-400 font-bold lowercase first-letter:uppercase">{type}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          <span>{statusText}</span>
        </div>
      </div>
    );
  };

  return (
    <Protect>
      <MainPage>
        <Toaster1 data={toasterData} />

        <div>
          {/* MAIN CONTENT AREA */}
          <main className="flex-1 px-4 md:px-8 py-6 mb-20 md:py-8 max-w-7xl mx-auto w-full space-y-6 ">
            {/* TOP DASHBOARD CONTROL PANEL */}
            <MainPageHeader
              title="Your Projects"
              description="Select and manage your metadata blueprints for YouTube
          content creation"
              createProjectButton={true}
            />
            {isCreateCard && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop Overlay */}
                <div
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
                  onClick={() => toggleCreateCardState()}
                />
                
                {/* Modal Container */}
                <div className="relative w-full max-w-md mx-auto z-50 transform transition-all duration-300 animate-scale-up">
                  <GlassCard hoverEffect={false} className="relative p-6 bg-slate-950/95 border-sky-500/40 shadow-[0_0_40px_rgba(14,165,233,0.25)] rounded-3xl border">
                    {/* Top Glow Accent Bar */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full shadow-[0_0_12px_#38bdf8]" />

                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Create New Project</h3>
                        <p className="text-[11px] text-slate-400 font-medium">Enter a project name to create a workspace blueprint</p>
                      </div>
                      <button
                        onClick={() => toggleCreateCardState()}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Close modal"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <InputField
                      icon={Search}
                      label="Project Name"
                      type="text"
                      placeholder="Enter Project Name (min 3 chars)"
                      id="projectName"
                      autoComplete="project-name"
                      state={projectName}
                      setState={setProjectName}
                      onChange={(e) => {
                        const nameVal = e?.target?.value || "";
                        if (nameVal.trim().length >= 3) {
                          setCreateProjectButtonDisabled(false);
                        } else {
                          setCreateProjectButtonDisabled(true);
                        }
                      }}
                    />

                    <NeonButton
                      variant="primary"
                      disabled={createProjectButtonDisabled}
                      onClick={async () => {
                        if (projectName.trim().length < 3) return;
                        setCreateProjectButtonDisabled(true);
                        try {
                          const response = await createProject(
                            { projectName: projectName.trim() },
                            { setToasterData, setprojectStatus },
                          );
                          setProjectName("");
                          toggleCreateCardState();
                          if (response && response.data?.projectID) {
                            navigate("/projects/" + response.data.projectID);
                          }
                        } catch (err) {
                          setCreateProjectButtonDisabled(false);
                        }
                      }}
                    >
                      Create Project
                    </NeonButton>
                  </GlassCard>
                </div>
              </div>
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
                {isLoading ? (
                  <ProjectsSkeleton />
                ) : !projectStatus || projectStatus.length === 0 ? (
                  <NoProjects />
                ) : (
                  <div
                    className="grid gap-5 pb-4 pt-1  scroll-smooth lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1
                  [&::-webkit-scrollbar]:h-2 
                  [&::-webkit-scrollbar-track]:bg-slate-950/20 
                  [&::-webkit-scrollbar-thumb]:bg-sky-500/20 
                  hover:[&::-webkit-scrollbar-thumb]:bg-sky-400/40 
                  [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    {projectStatus
                      .sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                      })
                      .map((p) => {
                        return (
                          <div
                            key={p.projectID}
                            className="group relative cursor-pointer rounded-2xl p-6 backdrop-blur-xl border border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950/40 hover:border-sky-500/50 hover:shadow-[0_0_25px_rgba(14,165,233,0.1)] transition-all duration-300 ease-out select-none flex flex-col justify-between min-h-[180px] overflow-hidden"
                            onClick={() => navigate("/projects/" + p.projectID)}
                          >
                            {/* Neon Accent Line on Hover */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                             {/* Header with Project Name & Action Arrow */}
                             <div className="flex items-start justify-between gap-3 mb-2">
                               <h4 className="font-extrabold text-lg text-slate-100 group-hover:text-sky-400 transition-colors tracking-tight line-clamp-1">
                                 {p.projectName}
                               </h4>
                               <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950/40 border-2 border-slate-800/80 group-hover:border-sky-500/40 transition-colors shrink-0">
                                 <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                               </div>
                             </div>

                            {/* Project ID Tag */}
                            <div
                              onClick={(e) => handleCopyId(e, p.projectID)}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-950/40 border border-slate-800/50 text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-4 hover:bg-slate-900/60 hover:text-sky-400 hover:border-sky-500/30 transition-all cursor-pointer z-10"
                              title="Copy Project ID"
                            >
                              <Hash className="w-3 h-3 text-sky-500/50 group-hover:text-sky-400 transition-colors" />
                              <span>{p.projectID.substring(0, 12)}...</span>
                            </div>

                            {/* Status & Created Date Footer */}
                            <div className="space-y-4">
                              {/* Capsule status pills - Responsive layout */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5 w-full">
                                {renderAttractiveStatus(
                                  p.contentStatus,
                                  "Content",
                                )}
                                {renderAttractiveStatus(
                                  p.thumbnailStatus,
                                  "Thumbnail",
                                )}
                              </div>

                              {/* Creation Date with Calendar Icon */}
                              <div className="pt-3 border-t border-slate-950 flex items-center justify-between text-[10px] font-bold text-slate-500 tracking-wider">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                  <span>
                                    Created{" "}
                                    {new Date(p.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      },
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </MainPage>
    </Protect>
  );
}

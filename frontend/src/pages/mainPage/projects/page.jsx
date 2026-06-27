import MainPage from "@/wrapper/mainPage";
import Protect from "@/wrapper/protect";

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
import { useContext } from "react";
import projectStatusContext from "@/context/projectStatus.js";

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
  const [isLoading] = useState(false);
  const [isCreateCard, setIsCreateCard] = useState(false);

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
    const res = await getProjectStatus({
      projectStatus,
      setprojectStatus,
      setToasterData,
    });

    if (res && res.length > 0) {
      setprojectStatus(() => [...res]);
      //const data = await getProjectByID({ projectID: res[0].projectID }, { setProject });
    }
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

  const toggleCreateCardState = () => {
    if (cardParams === "false" || !cardParams) {
      setSearchParams({ createProject: "true" });
    } else {
      setSearchParams({ createProject: "false" });
    }
  };
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
                createProjectButton={true}
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
                      navigate("/projects/" + response.data.projectID);
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
                    {projectStatus
                      .sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                      })
                      .map((p) => {
                        return (
                          <div
                            key={p.projectID}
                            className={`
                                w-full cursor-pointer relative rounded-2xl p-6 transition-all duration-300 select-none
                                backdrop-blur-xl border
                                bg-slate-900/20 border-slate-800/60 hover:border-sky-500/80 hover:bg-slate-900/40
                                hover:shadow-[0_0_20px_rgba(14,165,233,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)]
                              `}
                            onClick={() => {
                              navigate("/projects/" + p.projectID);
                            }}
                          >
                            {/* Project header with Chevron right */}
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="font-bold text-base text-slate-100 group-hover:text-sky-300 transition-colors">
                                {p.projectName}
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                            </div>

                            {/* UID Tag under title */}
                            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-5">
                              ID: {p.projectID}
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
                            <div className="mt-2 pt-2 font-bold tracking-widest border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                              <span>
                                Created{" "}
                                {`${new Date(p.date).getDate()}-${new Date(p.date).getMonth() + 1}-${new Date(p.date).getFullYear()}`}
                              </span>
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

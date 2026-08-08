import SubPage from "@/wrapper/subPage";
import Protect from "@/wrapper/protect";
import TextArea from "@/component/input/textArea.jsx";
import { useState, useEffect, useRef, useContext } from "react";
import {
  Copy,
  Sparkles,
  Image as ImageIcon,
  Tag,
  FileText,
  Share2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import GlassCard from "@/component/cards/glassCard";
import { NeonButton2 } from "@/component/button/neonButton.jsx";
import Button1 from "@/component/button/button1.jsx";
import copyToClipboard from "@/utility/copyToClipboard.js";
import Toaster1 from "@/component/toaster/toaster1.jsx";
import generateSEOData from "@/features/generate/seoData.generate.js";
import projectStatusContext from "@/context/projectStatus.js";
import projectContext from "@/context/project.js";
import getProjectByID from "@/features/project/get.project.js";
import deleteProject from "@/features/project/delete.project.js";
import SEODataChooser from "@/component/utility/seoDataChooser.jsx";
import ProjectNotFound from "@/component/notFound/ProjectNotFound.jsx";
import SeoDataSkeleton from "@/component/loader/seoDataSkeleton.jsx";
import DeleteConfirmModal from "@/component/cards/deleteConfirmModal.jsx";
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

// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const { projectStatus, setprojectStatus } = useContext(projectStatusContext);
  //const { project, setProject } = UseProject();
  const [toasterData, setToasterData] = useState([]);
  const [videoDesc, setVideoDesc] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const { projectID } = useParams();
  // Skeleton Loading Simulator State
  const [isLoading, setIsLoading] = useState(true);
  const [projectNotFound, setProjectNotFound] = useState(false);
  const { projectData, setProjectData } = useContext(projectContext);
  const [seoButtonDisable, setSeoButtonDisable] = useState(true);
  const [currentProjectData, setCurrentProjectData] = useState(null);

  const [activeSEOData, setActiveSEOData] = useState(0);

  const resolvedVideoDesc =
    videoDesc || currentProjectData?.videoDescription || "";
  // activate and diactivate the generate seo button based on the length of the video description
  useEffect(() => {
    setSeoButtonDisable(resolvedVideoDesc.trim().length < 5);
  }, [resolvedVideoDesc]);

  const handleConfirmDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(
        { projectID },
        {
          setProjectData,
          setToasterData,
          setprojectStatus,
          projectStatus,
          setProjectNotFound,
        },
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  useEffect(() => {
    const project = projectData.find((data) => data.projectID === projectID);
    if (project) {
      //console.log("useeffect", project);

      setCurrentProjectData({ ...project });
      setVideoDesc(
        project.videoDescription ? project.videoDescription : videoDesc,
      );
      setSeoButtonDisable(true);
      // setProjectNotFound(false);
      setIsLoading(false);
    } else {
      setCurrentProjectData(null);
    }
  }, [projectData, projectID]);

  useEffect(() => {
    if (!showPopup) return;

    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  useEffect(() => {
    document.title = "Dashboard | Media Room";
    const exists = projectStatus.find((data) => data.projectID === projectID);
    setIsLoading(true);
    // console.log("exits", exists);
    //  console.log("res", res, exists);

    if (!exists) {
      const timer = setTimeout(() => {
        const exists = projectStatus.find(
          (data) => data.projectID === projectID,
        );
       // console.log("timeout exists", exists);
        if (!exists) {
          setProjectNotFound(true);
        } else {
          setProjectNotFound(false);
        }
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setProjectNotFound(false);
    }
    const fetchProject = async () => {
      
      // if(projectData.find((data) => data.projectID === projectID)){
      //    setIsLoading(false);
      // }
      await getProjectByID({ projectID: projectID }, { setProjectData });

      setIsLoading(false);
    };

    fetchProject();
  }, [projectID, projectStatus, setProjectData]);

  // gets project data
  // async function handleApp() {
  //   const data = await getProjectByID(
  //     { projectID: projectID },
  //     { setProjectData, projectData },
  //   );

  //    console.log(data);
  // }
  // useEffect(() => {
  //   document.title = "Dashboard | Media Room";
  //   handleApp();
  // }, []);

  if (projectNotFound) {
    return (
      <Protect>
        <SubPage>
          <ProjectNotFound />
        </SubPage>
      </Protect>
    );
  }

  // Inline status badge designed to perfectly mimic the content/thumbnail capsule controls in the screenshot
  return (
    <Protect>
      <SubPage>
        <Toaster1 data={toasterData} />
        <div>
          {/* MAIN CONTENT AREA */}

          <main className="flex-1 px-8  py-6 mb-20 md:py-8  mx-auto w-full space-y-6 ">
            {/* TOP DASHBOARD CONTROL PANEL */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/65 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  Project Details
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage metadata, SEO tags, and thumbnail prompts for your workspace
                </p>
              </div>

              {/* Responsive Options Menu Button */}
              <div className="relative flex items-center gap-2.5">
                <div ref={buttonRef}>
                  <button
                    onClick={() => setShowPopup((prev) => !prev)}
                    className="relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-white shadow-md hover:shadow-[0_0_20px_rgba(14,165,233,0.25)] transition-all duration-300 active:scale-95 text-xs font-extrabold select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                    aria-label="Project Actions Menu"
                    title="Project Actions Menu"
                  >
                    <MoreVertical className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="tracking-wider uppercase text-[11px] font-black">Options</span>
                  </button>
                </div>

                {/* Themed Dropdown Popup */}
                <div
                  className={`absolute right-0 top-full z-30 mt-2 w-56 sm:w-64 transition-all duration-300 ease-out origin-top-right ${
                    showPopup
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div ref={popupRef}>
                    <GlassCard
                      hoverEffect={false}
                      className="p-3 bg-slate-950/95 border-slate-800/90 shadow-[0_10px_40px_rgba(0,0,0,0.85)] rounded-2xl relative overflow-hidden"
                    >
                      {/* Dynamic Neon Cyan Accent Bar */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-rose-500" />
                      
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1.5 border-b border-slate-800/60 mb-2 flex items-center justify-between">
                        <span>Project Actions</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setShowPopup(false);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/25 hover:text-white hover:border-rose-500/50 transition-all text-xs font-bold group cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                            <span>Delete Project</span>
                          </span>
                          <span className="text-[9px] font-mono text-rose-400/80 group-hover:text-rose-200 uppercase tracking-widest bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/30">
                            Danger
                          </span>
                        </button>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </header>

            {/* DELETE CONFIRMATION MODAL POPUP */}
            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              projectName={
                projectStatus.find((p) => p.projectID === projectID)?.projectName ||
                currentProjectData?.projectName ||
                "this project"
              }
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleConfirmDeleteProject}
              isDeleting={isDeleting}
            />
            {/* project name */}
            <div className="flex items-center pl-0.5 mb-10">
              {/* Glowing sky-blue vertical indicator bar on title */}
              <span className="w-1 h-5 bg-sky-400 rounded shadow-[0_0_8px_#38bdf8] mr-3 " />
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-300">
                {
                  projectStatus.find((p) => p.projectID === projectID)
                    ?.projectName
                }
              </h3>
            </div>
            <div className="space-y-8 animate-fade-in">
              {/* LAST PROJECT */}
              <div className="space-y-4">
                {/* <div className="flex items-center pl-0.5">
                    <span className="w-1 h-5 bg-sky-400 rounded shadow-[0_0_8px_#38bdf8] mr-3" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400">
                      hello
                    </h3>
                  </div> */}
                <div className="grid lg:grid-cols-2  w-full gap-6">
                  <TextArea
                    label="Video Description"
                    icon="Icon"
                    type="text"
                    placeholder="describe your video"
                    id="video desc"
                    autoComplete="video description"
                    state={videoDesc}
                    setState={setVideoDesc}
                    value={videoDesc}
                    onChange={(e) => {
                      setVideoDesc(
                        e.target.currentValue
                          ? e.target.currentValue
                          : videoDesc,
                      );
                    }}
                  />
                  <TextArea
                    label="Custom Thumbnail Prompt (optional)"
                    icon="Icon"
                    type="text"
                    placeholder="add custom thumbanil prompt"
                    id="video desc"
                    autoComplete="video description"
                    state={customPrompt}
                    setState={setCustomPrompt}
                    value={customPrompt}
                    onChange={(e) => {
                      setVideoDesc(
                        e.target.currentValue
                          ? e.target.currentValue
                          : videoDesc,
                      );
                    }}
                  />
                </div>
                <div className="grid lg:grid-cols-2  w-full  gap-10 my-5 ">
                  <Button1
                    className=" w-full lg:w-[80%] mx-auto flex gap-20 "
                    disabled={seoButtonDisable}
                    variant="secondary"
                    //   disabled={true}
                    onClick={() => {
                      generateSEOData(
                        { projectID, videoDescription: videoDesc },
                        {
                          currentProjectData,
                          setToasterData,
                          setProjectData,
                          setSeoButtonDisable,
                          setActiveSEOData,
                        },
                      );
                    }}
                  >
                    <div> Generate SEO Data </div>
                    <div>
                      <p>( 5 credit )</p>
                    </div>
                  </Button1>
                  <Button1
                    className="w-full lg:w-[80%] mx-auto flex gap-20 "
                    variant="primary"
                    //   disabled={true}
                  >
                    <div> Generate Thumbnail</div>
                    <div>
                      <p>( 20 credit )</p>
                    </div>
                  </Button1>
                </div>
                <div className="mt-30">
                  {isLoading ? (
                    <SeoDataSkeleton />
                  ) : (
                    <div className="grid  lg:grid-cols-4 gap-6 ">
                      {/* METADATA EXPORT COLUMN */}
                      <div className="lg:col-span-2 space-y-6">
                        <GlassCard
                          hoverEffect={false}
                          className="h-full flex flex-col  justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)] "
                        >
                          <div>
                            {/* Workspace heading */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-5 mb-6">
                              <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                  {/* {selectedProject.name} */}
                                </h2>
                              </div>

                              <div className="flex items-center gap-2 w-full justify-between">
                                <NeonButton2
                                  onClick={() =>
                                    copyToClipboard("hello", "metadata file")
                                  }
                                  variant="secondary"
                                  icon={Share2}
                                  className="lg:text-md text-xs lg:px-3.5 lg:py-2 px-1 py-1"
                                >
                                  Export JSON
                                </NeonButton2>
                                {/* <div className="flex gap-2 lg:text-lg md:text-md text-xs">
                                <p className="text-white/80 inline-block ">
                                  status :
                                </p>
                                <p className="text-white/50 tracking-wider">
                                  generating...
                                </p>
                              </div> */}
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
                                  {/* {console.log("line 275", currentProjectData)} */}
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        currentProjectData?.seoData[
                                          activeSEOData
                                        ]
                                          ? currentProjectData.seoData[
                                              currentProjectData.seoData
                                                .length - 1
                                            ].title
                                          : "",
                                        "Title",
                                      )
                                    }
                                    className="text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center gap-1.5 border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)]"
                                    title="Copy Title"
                                  >
                                    {/* {currentProjectData?.seoData[currentProjectData.seoData.length-1]
                                    ? currentProjectData.seoData[currentProjectData.seoData.length-1].title
                                    : ""} */}
                                    <Copy className="w-3 h-3" />
                                    Copy
                                  </button>
                                </div>
                                <p className="text-sm font-semibold text-slate-100 leading-relaxed pr-6 select-all">
                                  {currentProjectData?.seoData[activeSEOData]
                                    ? currentProjectData.seoData[activeSEOData]
                                        .title
                                    : ""}
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
                                        currentProjectData?.seoData[
                                          activeSEOData
                                        ]
                                          ? currentProjectData.seoData[
                                              currentProjectData.seoData
                                                .length - 1
                                            ].description
                                          : "",
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
                                  {currentProjectData?.seoData[activeSEOData]
                                    ? currentProjectData.seoData[activeSEOData]
                                        .description
                                    : ""}
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
                                        currentProjectData?.seoData[
                                          activeSEOData
                                        ]
                                          ? currentProjectData.seoData[
                                              currentProjectData.seoData
                                                .length - 1
                                            ].tags.join(",")
                                          : "",
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
                                  {currentProjectData?.seoData[activeSEOData]
                                    ? currentProjectData.seoData[
                                        activeSEOData
                                      ].tags
                                        .join(",")
                                        .split(",")
                                        .map((tag, idx) => (
                                          <span
                                            key={idx}
                                            className="text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/15 px-3 py-1 rounded-lg"
                                          >
                                            #{tag.trim()}
                                          </span>
                                        ))
                                    : ""}
                                </div>
                              </div>
                            </div>

                            <SEODataChooser
                              items={currentProjectData?.seoData}
                              activeIndex={activeSEOData}
                              onChange={setActiveSEOData}
                            />
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                            {/* <span>Created {selectedProject.date}</span> */}
                          </div>
                        </GlassCard>
                      </div>

                      {/* VISUAL ASSET PREVIEW COLUMN */}
                      <div className="lg:col-span-2">
                        <GlassCard
                          hoverEffect={false}
                          className="space-y-5 flex flex-col justify-between h-full shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                        >
                          <div className="space-y-5">
                            <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                                Thumbnail Preview
                              </span>
                              {/* <div className="flex gap-2 lg:text-lg md:text-md text-xs">
                              <p className="text-white/80">status :</p>
                              <p className="text-white/50 tracking-wider">
                                generating...
                              </p>
                            </div> */}
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
                                      currentProjectData?.seoData[activeSEOData]
                                        ? currentProjectData.seoData[
                                            activeSEOData
                                          ].thumbnailDescription
                                        : "",
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
                                {currentProjectData?.seoData[activeSEOData]
                                  ? currentProjectData.seoData[activeSEOData]
                                      .thumbnailDescription
                                  : "not available"}
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
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </SubPage>
    </Protect>
  );
}

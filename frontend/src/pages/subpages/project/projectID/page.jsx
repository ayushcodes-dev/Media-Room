import SubPage from "@/wrapper/subPage";
import Protect from "@/wrapper/protect";
import TextArea from "@/component/input/textArea.jsx";
import { useState, useEffect } from "react";
import {
  Copy,
  Sparkles,
  Image as ImageIcon,
  Tag,
  FileText,
  Share2,
  ChevronRight,
  CircleDollarSign,
} from "lucide-react";
import { useParams } from "react-router-dom";
import MainPageHeader from "@/component/header/mainPage.jsx";
import GlassCard from "@/component/cards/glassCard";
import { NeonButton2 } from "@/component/button/neonButton.jsx";
import Button1 from "@/component/button/button1.jsx";
import copyToClipboard from "@/utility/copyToClipboard.js"; 
import Toaster1 from "@/component/toaster/toaster1.jsx";
import generateSEOData from "@/features/generate/seoData.generate.js";
import { useContext } from "react";
import projectStatusContext from "@/context/projectStatus.js";
import projectContext from "@/context/project.js";
import getProjectByID from "@/features/project/get.project.js";
import SEODataChooser from "@/component/utility/seoDataChooser.jsx"
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
  const { projectStatus } = useContext(projectStatusContext);
  //const { project, setProject } = UseProject();
  const [toasterData, setToasterData] = useState([]);
  const [videoDesc, setVideoDesc] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const { projectID } = useParams();
  // Skeleton Loading Simulator State
  const [isLoading] = useState(false);
  const [seoButtonDisable, setSeoButtonDisable] = useState(true);
  const { projectData, setProjectData } = useContext(projectContext);
  const [currentProjectData, setCurrentProjectData] = useState();
  const [activeSEOData, setActiveSEOData]= useState(0)

// gets project data
  async function handleApp() {
    const data = await getProjectByID(
      { projectID: projectID },
      { setProjectData },
    );
   

  //  console.log(data);
  }
  useEffect(() => {
    document.title = "Dashboard | Media Room";
    handleApp();
  }, []);


  //  handle toggle of button -- disable or enable
  useEffect(() => {
    if (videoDesc.trim().length < 5) {
      setSeoButtonDisable(true);
    } else {
      setSeoButtonDisable(false);
    }
  }, [videoDesc]);

  // sets current project
  useEffect(() => {
   
    const project = projectData.find((data) => data.projectID === projectID);
    if (project) {
      //console.log("useeffect", project);
      setCurrentProjectData({ ...project });
      setVideoDesc(
        project.videoDescription ? project.videoDescription : videoDesc,
      );
       setSeoButtonDisable(true);
    }
   
  }, [projectData]);


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
      <SubPage>
        <Toaster1 data={toasterData} />
        <div>
          {/* MAIN CONTENT AREA */}
          {isLoading ? (
            <SkeletonLoading />
          ) : (
            <main className="flex-1 px-8  py-6 mb-20 md:py-8  mx-auto w-full space-y-6 ">
              {/* TOP DASHBOARD CONTROL PANEL */}
              <MainPageHeader
                title="Project"
                description="Select and manage your metadata blueprints for YouTube
          content creation"
              />{" "}
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
                  <div className="grid  lg:grid-cols-4 gap-6 mt-30">
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
                                      currentProjectData?.seoData[activeSEOData]
                                        ? currentProjectData.seoData[
                                            currentProjectData.seoData.length -
                                              1
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
                                      currentProjectData?.seoData[activeSEOData]
                                        ? currentProjectData.seoData[
                                            currentProjectData.seoData.length -
                                              1
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
                                      currentProjectData?.seoData[activeSEOData]
                                        ? currentProjectData.seoData[
                                            currentProjectData.seoData.length -
                                              1
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
                </div>
              </div>
            </main>
          )}
        </div>
      </SubPage>
    </Protect>
  );
}

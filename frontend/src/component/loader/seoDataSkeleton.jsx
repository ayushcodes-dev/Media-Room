

// Custom Lucide-like inline SVG icons for self-containment
const SkeletonIcon = ({ className = "w-4 h-4" }) => (
  <div className={`${className} bg-slate-800 rounded-md animate-pulse`} />
);
 
 // Generate mock array for SEO tag skeletons
 const skeletonTags = Array.from({ length: 5 }, (_, i) => i);
export default function SeoDataSkeleton() {
  return (
    <div className="space-y-4">
      {/* <div className="flex items-center pl-0.5">
        <span className="w-1 h-5 bg-sky-500/40 rounded shadow-[0_0_8px_rgba(56,189,248,0.3)] mr-3 animate-pulse" />
        <div className="h-4 w-48 bg-slate-800 rounded-md animate-pulse" />
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* METADATA EXPORT COLUMN SKELETON */}
        <div className=" space-y-6">
          <div className="h-full flex flex-col justify-between bg-slate-900/10 border border-slate-800/50 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <div>
              {/* Workspace heading */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-5 mb-6">
                <div className="h-8 w-60 bg-slate-800 rounded-lg animate-pulse" />

                <div className="flex items-center gap-2">
                  <div className="w-24 h-9 bg-slate-800 rounded-lg animate-pulse" />
                  <div className="w-20 h-9 bg-slate-800/60 rounded-lg animate-pulse" />
                </div>
              </div>

              {/* METADATA FIELDS SKELETON */}
              <div className="space-y-5">
                {/* OPTIMIZED TITLE SKELETON */}
                <div className="bg-slate-950/50 border border-slate-900/85 rounded-xl p-5 shadow-inner space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <SkeletonIcon className="w-3.5 h-3.5" />
                      <div className="h-3 w-24 bg-slate-800 rounded-md animate-pulse" />
                    </div>
                    <div className="w-14 h-6 bg-slate-800/80 rounded-lg animate-pulse" />
                  </div>
                  <div className="h-5 w-full bg-slate-800 rounded-md animate-pulse" />
                </div>

                {/* DESCRIPTION SKELETON */}
                <div className="bg-slate-950/50 border border-slate-900/85 rounded-xl p-5 shadow-inner space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <SkeletonIcon className="w-3.5 h-3.5" />
                      <div className="h-3 w-40 bg-slate-800 rounded-md animate-pulse" />
                    </div>
                    <div className="w-14 h-6 bg-slate-800/80 rounded-lg animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 w-full bg-slate-800 rounded-md animate-pulse" />
                    <div className="h-3.5 w-11/12 bg-slate-800 rounded-md animate-pulse" />
                    <div className="h-3.5 w-4/5 bg-slate-800 rounded-md animate-pulse" />
                  </div>
                </div>

                {/* SEO TAGS SKELETON */}
                <div className="bg-slate-950/50 border border-slate-900/85 rounded-xl p-5 shadow-inner space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <SkeletonIcon className="w-3.5 h-3.5" />
                      <div className="h-3 w-28 bg-slate-800 rounded-md animate-pulse" />
                    </div>
                    <div className="w-14 h-6 bg-slate-800/80 rounded-lg animate-pulse" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pr-6">
                    {skeletonTags.map((t) => (
                      <div
                        key={t}
                        className="h-6 w-16 bg-slate-800/60 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card bottom footer metadata skeleton */}
            <div className="mt-6 pt-4 border-t border-slate-900 text-[10px] flex items-center justify-between">
              <div className="h-3 w-36 bg-slate-800/40 rounded-md animate-pulse" />
              <div className="h-3 w-24 bg-slate-800/40 rounded-md animate-pulse" />
            </div>
          </div>
        </div>

        {/* VISUAL ASSET PREVIEW COLUMN SKELETON */}
        <div>
          <div className="space-y-5 flex flex-col justify-between h-full bg-slate-900/10 border border-slate-800/50 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <div className="space-y-5">
              <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <SkeletonIcon className="w-3.5 h-3.5" />
                  <div className="h-3.5 w-32 bg-slate-800 rounded-md animate-pulse" />
                </div>
              </div>

              {/* Aspect-Ratio Video Screen Frame Skeleton */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950/80 border border-slate-800/60 flex flex-col items-center justify-center shadow-2xl space-y-3">
                <div className="w-10 h-10 bg-slate-800/80 rounded-full flex items-center justify-center animate-pulse">
                  <SkeletonIcon className="w-5 h-5" />
                </div>
                <div className="h-3 w-32 bg-slate-800/65 rounded-md animate-pulse" />
                <div className="h-2 w-48 bg-slate-800/40 rounded-md animate-pulse" />
              </div>

              {/* Prompt script projector skeleton container */}
              <div className="bg-slate-950/50 border border-slate-900/85 rounded-xl p-5 shadow-inner space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-32 bg-slate-800 rounded-md animate-pulse" />
                  <div className="w-14 h-6 bg-slate-800/80 rounded-lg animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-800/50 rounded-md animate-pulse" />
                  <div className="h-3 w-3/4 bg-slate-800/50 rounded-md animate-pulse" />
                </div>
              </div>
            </div>

            {/* Card bottom footer status skeleton */}
            <div className="pt-4 border-t border-slate-900 flex justify-between items-center">
              <div className="h-3 w-24 bg-slate-800/40 rounded-md animate-pulse" />
              <div className="h-3 w-24 bg-slate-800/40 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Lucide-like inline SVG icons for self-containment
const SkeletonIcon = ({ className = "w-4 h-4" }) => (
  <div className={`${className} bg-slate-800 rounded-md animate-pulse`} />
);

export default function SkeletonLoding() {
  // Generate mock array for horizontal scroll cards (usually 3 or 4 visible)
  const skeletonCards = Array.from({ length: 4 }, (_, i) => i);
  // Generate mock array for SEO tag skeletons
  const skeletonTags = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <main className="flex-1 px-4 md:px-8 py-6 mb-20 md:py-8 max-w-7xl mx-auto w-full space-y-6 select-none">
        {/* TOP DASHBOARD CONTROL PANEL SKELETON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/65 pb-6">
          <div className="space-y-2.5">
            {/* Title Skeleton */}
            <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse" />
            {/* Subtitle Skeleton */}
            <div className="h-4 w-80 bg-slate-800/60 rounded-md animate-pulse" />
          </div>

          {/* Action Button Skeleton */}
          <div className="w-32 h-10 bg-slate-800 rounded-xl animate-pulse" />
        </div>

        {/* DYNAMIC METADATA WORKSPACES SKELETON */}
        <div className="space-y-8">
          {/* WORKSPACES ROW */}
          <div className="space-y-4">
            <div className="flex items-center pl-0.5">
              {/* Glowing sky-blue vertical indicator bar placeholder */}
              <span className="w-1 h-5 bg-sky-500/40 rounded shadow-[0_0_8px_rgba(56,189,248,0.3)] mr-3 animate-pulse" />
              <div className="h-4 w-28 bg-slate-800 rounded-md animate-pulse" />
            </div>

            {/* Horizontal scrollable row */}
            <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-950/20 [&::-webkit-scrollbar-thumb]:bg-sky-500/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              {skeletonCards.map((index) => (
                <div
                  key={index}
                  className={`snap-start shrink-0 w-[300px] relative rounded-2xl p-6 bg-slate-900/20 border border-slate-800/40 transition-all duration-300`}
                >
                  {/* Card Header with chevron block */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="h-5 w-3/4 bg-slate-800 rounded-md animate-pulse" />
                    <div className="w-4 h-4 bg-slate-800/60 rounded-md animate-pulse" />
                  </div>

                  {/* UID Tag under title */}
                  <div className="h-3 w-1/3 bg-slate-800/40 rounded-md mb-6 animate-pulse" />

                  {/* Double layout capsule status pills styled exactly as in preview */}
                  <div className="flex gap-2.5 w-full">
                    <div className="flex-1 h-8 bg-slate-800/50 border border-slate-800/40 rounded-lg animate-pulse" />
                    <div className="flex-1 h-8 bg-slate-800/50 border border-slate-800/40 rounded-lg animate-pulse" />
                  </div>

                  {/* Dummy glow strip on first workspace index to represent selected active state */}
                  {index === 0 && (
                    <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EXPANDED DETAILED WORKSPACE PREVIEW SKELETON */}
          <div className="space-y-4">
            <div className="flex items-center pl-0.5">
              <span className="w-1 h-5 bg-sky-500/40 rounded shadow-[0_0_8px_rgba(56,189,248,0.3)] mr-3 animate-pulse" />
              <div className="h-4 w-48 bg-slate-800 rounded-md animate-pulse" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* METADATA EXPORT COLUMN SKELETON */}
              <div className="lg:col-span-2 space-y-6">
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
        </div>
      </main>
    </div>
  );
}




export default function SkeletonLoding() {
  // Generate mock array for horizontal scroll cards (usually 3 or 4 visible)
 

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

       
          </div>     {/* Horizontal scrollable row */}
          

          {/* EXPANDED DETAILED WORKSPACE PREVIEW SKELETON */}
        
        </div>
      </main>
    </div>
  );
}

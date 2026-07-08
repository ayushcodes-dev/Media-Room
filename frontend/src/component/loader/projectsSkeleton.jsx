export default function ProjectsSkeleton() {
  const mockCards = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="grid gap-5 pb-4 pt-1 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 animate-pulse">
      {mockCards.map((idx) => (
        <div
          key={idx}
          className="w-full min-h-[180px] relative rounded-2xl p-6 backdrop-blur-xl border border-slate-800/40 bg-slate-900/10 flex flex-col justify-between space-y-4"
        >
          <div>
            {/* Header with Title and Arrow Icon placeholder */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="h-5 bg-slate-800 rounded-md w-2/3" />
              <div className="w-7 h-7 bg-slate-800 rounded-lg shrink-0" />
            </div>

            {/* ID placeholder */}
            <div className="h-4 bg-slate-800/60 rounded-md w-1/4" />
          </div>

          <div className="space-y-4">
            {/* Pills placeholder - Responsive layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5 w-full">
              <div className="flex-1 h-8 bg-slate-800/50 border border-slate-800/20 rounded-xl" />
              <div className="flex-1 h-8 bg-slate-800/50 border border-slate-800/20 rounded-xl" />
            </div>

            {/* Date placeholder with icon placeholder */}
            <div className="pt-3 border-t border-slate-950/60 flex justify-between items-center">
              <div className="h-3 bg-slate-800/40 rounded-md w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

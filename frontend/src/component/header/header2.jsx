export default function Header2() {
  return (
    <div className="mb-12 text-center z-10 transition-all duration-700 transform hover:scale-105">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-12 h-12 bg-linear-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.4)]">
          <span className="text-slate-950 font-black text-2xl font-orbitron">
            T
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-sky-400 bg-clip-text text-transparent font-orbitron">
          TUBENIX
        </h1>
      </div>
      <p className="text-sky-500/50 text-[10px] font-bold tracking-[0.4em] uppercase font-inter">
        The Future of Streaming
      </p>
    </div>
  );
}

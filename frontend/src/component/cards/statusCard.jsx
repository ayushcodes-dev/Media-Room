

const StatusCard = ({ label, color }) => {
  const config = {
    red: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]",
    yellow: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    green: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-default group hover:border-white/10">
      <div
        className={`w-2.5 h-2.5 rounded-full ${config[color]} animate-pulse group-hover:scale-125 transition-transform`}
      />
      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
};
export default StatusCard;
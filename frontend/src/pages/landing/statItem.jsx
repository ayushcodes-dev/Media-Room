const StatItem = ({ icon, label, value, color }) => (
  <div className="flex flex-col gap-1">
    <div
      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${color}`}
    >
      {icon} {label}
    </div>
    <div className="text-lg font-bold text-white">{value}</div>
  </div>
);

export default StatItem;
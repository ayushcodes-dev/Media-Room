
 const NeonInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-450 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-slate-950/60 border border-slate-850 rounded-xl text-slate-200 placeholder-slate-550 text-sm focus:outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10 transition-all duration-300"
        />
        <div className="absolute inset-0 rounded-xl border border-sky-400/0 group-hover:border-sky-500/20 pointer-events-none transition-all duration-300" />
      </div>
    </div>
  );
};

export default NeonInput
// Neon Input Field: Styled input with icon and focus-driven neon highlights
const TextArea = ({
  label,
  Icon,
  type,
  placeholder,
  id,
  autoComplete,
  state,
  setState,
}) => (
  <div className="mb-6 text-left  w-full">
    <label className="block text-sky-400 text-[10px] font-bold mb-2 ml-1 tracking-[0.15em] uppercase opacity-60 group-focus-within:opacity-100 transition-opacity">
      {label}
    </label>
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {Icon&&<Icon className="h-5 w-5 text-sky-500/40 group-focus-within:text-sky-400 transition-colors" />}
      </div>
      <textarea
        type={type}
        value={state}
        onChange={(e) => {
          setState(e.currentTarget.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        className="w-full lg:pl-12 lg:pr-4 pl-5 pr-2 lg:pb-3 lg:pt-7 pb-1 pt-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all font-inter  max-h-50 scrollbar-track-transparent"
        placeholder={placeholder}
        id={id}
        autoComplete={autoComplete}
      ></textarea>
    </div>
  </div>
);
export default TextArea;

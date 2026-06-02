
// High-Impact Neon Button: Used for primary actions and social logins
const NeonButton = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const styles = {
    primary:
      "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_0_25px_rgba(14,165,233,0.3)]",
    outline:
      "bg-transparent border border-sky-500/50 text-sky-400 hover:bg-sky-500/10",
    ghost:
      "bg-white/5 text-white hover:bg-white/10 border border-white/5 shadow-sm",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full py-3.5 px-6 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-3 font-inter ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
export default NeonButton;

// 2. REUSABLE GLOWING BUTTON
export const NeonButton2 = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  icon: Icon = null,
}) => {
  const baseStyle =
    "relative flex items-center justify-center gap-2 font-medium px-4 py-2 rounded-xl transition-all duration-300 select-none active:scale-95";

  const variants = {
    primary:
      "bg-sky-500/20 border border-sky-400/50 text-sky-200 hover:bg-sky-500/40 hover:text-white hover:shadow-[0_0_15px_rgba(14,165,233,0.4)]",
    secondary:
      "bg-slate-800/60 border border-slate-700 text-slate-300 hover:bg-slate-700/80 hover:text-white",
    danger:
      "bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/35 hover:text-rose-100 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    ghost:
      "bg-transparent border border-transparent text-slate-400 hover:bg-white/5 hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};
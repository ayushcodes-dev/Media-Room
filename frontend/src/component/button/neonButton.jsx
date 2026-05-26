
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
const Button = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    "group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 overflow-hidden";

  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105",
    secondary:
      "border border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10",
    outline:
      "bg-white/5 border border-white/10 px-5 py-2 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm text-sm font-medium text-slate-400 hover:text-white",
    ghost:
      "text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium",
    white:
      "bg-white text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {Icon && (
          <Icon
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        )}
      </span>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 -translate-x-full" />
      )}
    </button>
  );
};
export default Button 
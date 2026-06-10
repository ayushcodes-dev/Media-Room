

// Glass Card Container: Provides the frosted glass effect with blurred background
export const GlassCard = ({
  children,
  className = "",
  hoverEffect = true,
  onClick = null,
}) => {
  
  return (
    <div
      onClick={onClick}
      className={`
         backdrop-blur-xl  bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6
        shadow-[0_8px_32px_rgba(0,0,0,0.5)]
        transition-all duration-350 ease-out
        ${onClick ? "cursor-pointer" : ""}
        ${hoverEffect ? "hover:border-sky-500/30 hover:shadow-[0_0_25px_rgba(14,165,233,0.12)] " : ""}
        ${className}
      `}
    >
      {/* Dynamic neon corner ambient glow */}
      <div className="absolute -top-[1px] -left-[1px] w-8 h-8 rounded-tl-2xl border-t border-l border-sky-400/20 pointer-events-none" />
      <div className="absolute -bottom-[1px] -right-[1px] w-8 h-8 rounded-br-2xl border-b border-r border-sky-400/20 pointer-events-none" />
      {children}
    
    </div>
  );
};
export default GlassCard;
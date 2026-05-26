

// Glass Card Container: Provides the frosted glass effect with blurred background
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2rem] p-10 shadow-2xl w-full max-w-md ${className}`}
  >
    {children}
  </div>
);
export default GlassCard;
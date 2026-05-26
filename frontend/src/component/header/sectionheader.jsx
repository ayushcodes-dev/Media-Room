import { Sparkles } from "lucide-react";
/**
 * REUSABLE SECTION HEADER
 * @param {string} title - The main heading text
 * @param {string} subtitle - The descriptive paragraph below the heading
 * @param {string} badge - (Optional) Small highlighted text above the title
 * @param {boolean} centered - Toggle between center or left alignment (defaults to true)
 */
const SectionHeader = ({ title, subtitle, badge, centered = true }) => (
  <div className={`mb-16 ${centered ? "text-center" : "text-left"}`}>
    {/* Optional Badge: Only renders if the 'badge' prop is provided */}
    {badge && (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-6">
        <Sparkles size={14} />
        {badge}
      </div>
    )}

    {/* Main Title: Uses responsive font sizes (3xl to 5xl) */}
    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
      {title}
    </h2>

    {/* Optional Subtitle: Renders if 'subtitle' prop is provided */}
    {subtitle && (
      <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);


export default SectionHeader;
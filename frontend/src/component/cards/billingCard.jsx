import React from "react";
import { Check, Sparkles, Zap, ShieldCheck, Crown, ArrowRight } from "lucide-react";
import GlassCard from "@/component/cards/glassCard.jsx";
import NeonButton, { NeonButton2 } from "@/component/button/neonButton.jsx";

/**
 * Reusable BillingCard Component
 * 
 * Renders a high-impact, theme-matched subscription plan card.
 * Includes hover animations, neon accent glows, and badge support for recommended plans.
 * 
 * @param {Object} props
 * @param {string} props.title - Plan name (e.g. Starter, Pro, Growth, Elite)
 * @param {string} props.subtitle - Short plan description
 * @param {number|string} props.price - Price value (e.g. 299, 599)
 * @param {number|string} props.credits - Total credits allocated (e.g. 500, 1500)
 * @param {string} props.validity - Duration validity (e.g. 1 Month, 2 Months)
 * @param {Array<string>} props.features - Array of feature description strings
 * @param {boolean} props.isRecommended - If true, highlights card as Recommended / Most Popular
 * @param {string} props.badgeText - Custom badge text for recommended plan
 * @param {Function} props.onSubscribe - Callback function when Subscribe button is clicked
 */
const BillingCard = ({
  title,
  subtitle,
  price,
  credits,
  validity,
  features = [],
  isRecommended = false,
  badgeText = "MOST POPULAR",
  onSubscribe,
}) => {
  return (
    <div
      className={`relative group rounded-2xl transition-all duration-300 ease-out flex flex-col justify-between ${
        isRecommended
          ? "scale-[1.03] lg:-translate-y-2 z-10"
          : "hover:-translate-y-1"
      }`}
    >
      {/* Recommended Glow Effect & Glowing Border Highlight */}
      {isRecommended && (
        <div className="absolute -inset-[1.5px] bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 rounded-[1.1rem] blur-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
      )}

      {/* Top Banner Badge for Recommended Card */}
      {isRecommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(56,189,248,0.6)] border border-sky-300/40">
            <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            {badgeText}
          </span>
        </div>
      )}

      {/* Main Glass Container - Reusing GlassCard styled for theme uniformity */}
      <div
        className={`relative h-full flex flex-col justify-between rounded-2xl p-6 md:p-7 backdrop-blur-xl border ${
          isRecommended
            ? "bg-slate-950/90 border-sky-400/60 shadow-[0_0_35px_rgba(14,165,233,0.2)]"
            : "bg-slate-900/40 border-slate-800/80 hover:border-sky-500/40 hover:shadow-[0_0_30px_rgba(14,165,233,0.12)]"
        } transition-all duration-300 overflow-hidden`}
      >
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/10 transition-colors duration-300" />

        <div>
          {/* Card Title & Subtitle Header */}
          <div className="border-b border-slate-800/70 pb-5 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-sky-400 transition-colors">
                {title}
              </h3>
              {isRecommended ? (
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400">
                  <Zap className="w-4 h-4" />
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Pricing Display */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-sky-400">₹</span>
              <span className="text-4xl font-black text-white tracking-tight">
                {typeof price === "number" ? price.toLocaleString("en-IN") : price}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-1">
                / {validity}
              </span>
            </div>
          </div>

          {/* Highlight Key Specs Capsule */}
          <div className="grid grid-cols-1 gap-2.5 mb-6">
            {/* Total Credits Spec */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-sky-400" />
                Total Credits
              </span>
              <span className="text-base font-black text-sky-300 mt-0.5">
                {typeof credits === "number" ? credits.toLocaleString("en-IN") : credits}
              </span>
            </div>
          </div>

          {/* Features List Section */}
          <div className="space-y-3 mb-8">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Plan Features Included:
            </p>
            <ul className="space-y-2.5">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="mt-0.5 p-0.5 rounded-full bg-sky-500/20 text-sky-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Subscribe Action Button - Using Reusable NeonButton */}
        <div className="mt-2">
          {isRecommended ? (
            <NeonButton
              variant="primary"
              onClick={onSubscribe}
              className="group/btn w-full shadow-[0_0_20px_rgba(14,165,233,0.35)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
            >
              <span>Subscribe Now</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </NeonButton>
          ) : (
            <NeonButton2
              variant="secondary"
              onClick={onSubscribe}
              className="w-full py-3 text-sm font-bold border-slate-700/80 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-white"
            >
              <span>Subscribe</span>
            </NeonButton2>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingCard;

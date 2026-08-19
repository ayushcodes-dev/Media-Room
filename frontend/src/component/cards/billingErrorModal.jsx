import React from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/component/cards/glassCard.jsx";
import NeonButton, { NeonButton2 } from "@/component/button/neonButton.jsx";
import {
  CreditCard,
  Zap,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  X,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

/**
 * BillingErrorModal Component
 *
 * Appears when an action fails due to:
 * - No active subscription plan (NO_ACTIVE_PLAN)
 * - Maximum usage reached / insufficient credits (INSUFFICIENT_CREDITS)
 * - Plan expired
 *
 * Provides clear explanations and direct navigation to Billing or Usage pages.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibility state
 * @param {Function} props.onClose - Close callback
 * @param {Object} [props.errorInfo] - Error payload { errorCode, message, type }
 */
export default function BillingErrorModal({ isOpen, onClose, errorInfo = {} }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const rawMessage = errorInfo?.message || "";
  const errorCode = errorInfo?.errorCode || errorInfo?.error?.errorCode || "";

  // Determine error category
  const isNoPlan =
    errorCode === "NO_ACTIVE_PLAN" ||
    rawMessage.toLowerCase().includes("no active plan") ||
    rawMessage.toLowerCase().includes("no plan");

  const isExpired =
    errorCode === "PLAN_EXPIRED" ||
    rawMessage.toLowerCase().includes("expired");

  const isInsufficient =
    errorCode === "INSUFFICIENT_CREDITS" ||
    rawMessage.toLowerCase().includes("credit") ||
    rawMessage.toLowerCase().includes("not enough") ||
    rawMessage.toLowerCase().includes("limit reached");

  // Dynamic headers and content
  let badgeText = "Billing Alert";
  let title = "Subscription Action Required";
  let description =
    rawMessage ||
    "You need active credits to generate AI SEO metadata and thumbnails.";
  let primaryActionText = "View Subscription Plans";
  let primaryActionPath = "/billing";
  let showUsageButton = true;

  if (isNoPlan) {
    badgeText = "No Active Plan";
    title = "Subscription Required";
    description =
      "You don't have an active plan. Choose a plan to start generating AI SEO tags, titles, descriptions, and high-CTR thumbnails.";
    primaryActionText = "Choose a Plan";
    primaryActionPath = "/billing";
  } else if (isExpired) {
    badgeText = "Plan Expired";
    title = "Subscription Expired";
    description =
      "Your subscription plan has expired. Renew your plan to continue generating AI content.";
    primaryActionText = "Renew Plan";
    primaryActionPath = "/billing";
  } else if (isInsufficient) {
    badgeText = "Credit Limit Reached";
    title = "Not Enough Credits";
    description =
      rawMessage ||
      "You have used all your available credits. Upgrade your plan or purchase additional credits to continue.";
    primaryActionText = "Upgrade / Add Credits";
    primaryActionPath = "/billing";
  }

  const handleNavigate = (path) => {
    if (onClose) onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
      {/* Darkened Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Popup Container */}
      <div className="relative w-full max-w-md mx-auto z-50 transform transition-all duration-300 ease-out animate-scale-up">
        <GlassCard
          hoverEffect={false}
          className="relative bg-slate-950/95 border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] p-6 md:p-7 rounded-3xl border"
        >
          {/* Top Neon Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-sky-400 rounded-full shadow-[0_0_12px_#f59e0b]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Header */}
          <div className="relative mx-auto mt-2 mb-4 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-60 pointer-events-none" />
            <div className="absolute inset-0 rounded-full bg-amber-500/10 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              {isInsufficient ? (
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[2.5]" />
              ) : (
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[2.5]" />
              )}
            </div>
          </div>

          {/* Modal Header & Title */}
          <div className="text-center space-y-2 mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          {/* Credit Cost Quick Guide */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs mb-6 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                SEO Metadata Generation
              </span>
              <span className="font-bold text-sky-300">5 Credits</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                AI Thumbnail (FLUX.1)
              </span>
              <span className="font-bold text-amber-300">20 Credits</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <NeonButton
              variant="primary"
              onClick={() => handleNavigate(primaryActionPath)}
              className="w-full py-3 text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{primaryActionText}</span>
              <ArrowRight className="w-4 h-4" />
            </NeonButton>

            {showUsageButton && (
              <NeonButton2
                variant="secondary"
                onClick={() => handleNavigate("/usages")}
                icon={BarChart3}
                className="w-full py-2.5 text-xs sm:text-sm font-bold border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Usage & Credits</span>
              </NeonButton2>
            )}

            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-400 transition-colors font-semibold text-center cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

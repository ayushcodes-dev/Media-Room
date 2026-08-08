import React from "react";
import GlassCard from "@/component/cards/glassCard.jsx";
import { NeonButton2 } from "@/component/button/neonButton.jsx";
import {
  XCircle,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  FileQuestion,
} from "lucide-react";

/**
 * PaymentFailedComponent
 *
 * In-page component displayed on the Billing page when a payment fails.
 * Does NOT use separate routing.
 *
 * @param {Object} props
 * @param {Object} [props.plan] - Plan details
 * @param {string} [props.error] - Diagnostic error reason
 * @param {string} [props.code] - Diagnostic error code
 * @param {Function} props.onRetry - Callback to reopen modal / try again
 * @param {Function} props.onBackToPlans - Callback to return to billing plans view
 */
export default function PaymentFailedComponent({
  plan,
  error: propError,
  code: propCode,
  onRetry,
  onBackToPlans,
}) {
  const planTitle = plan?.title || "Selected Plan";
  const planPrice = plan?.price || 599;

  const errorMessage =
    propError ||
    "The payment transaction was cancelled or declined by your financial institution.";
  const errorCode = propCode || "PAYMENT_DECLINED";

  const formattedDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const referenceId = `ERR_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Background Glow Effects */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      </div>

      {/* HERO FAILURE HEADER CARD */}
      <GlassCard
        hoverEffect={false}
        className="relative overflow-hidden bg-slate-950/90 border-rose-500/30 text-center p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.15)]"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 shadow-[0_0_15px_#f43f5e]" />

        <div className="relative mx-auto mb-6 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping opacity-75" />
          <div className="absolute inset-0 rounded-full bg-rose-500/10 border-2 border-rose-400/40 shadow-[0_0_30px_rgba(244,63,94,0.5)]" />
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center shadow-lg shadow-rose-500/40">
            <XCircle className="w-10 h-10 md:w-12 md:h-12 text-white stroke-[2.5]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-widest mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Payment Unsuccessful</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
          Payment Could Not Be Completed
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Don't worry! Your payment method was <span className="font-bold text-emerald-400">not charged</span>. You can review the details below and try again.
        </p>

        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Zero Billing Penalty</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Existing Credits Intact</span>
          </div>
        </div>
      </GlassCard>

      {/* DIAGNOSTIC ERROR DETAILS CARD */}
      <GlassCard
        hoverEffect={false}
        className="bg-slate-950/80 border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800/80 mb-6">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Transaction Failure Details
            </h3>
            <p className="text-xs text-slate-400">
              Diagnostic error details returned for this transaction attempt
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs mb-6 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-rose-100 uppercase tracking-wider block mb-0.5">
              Reason for Failure:
            </span>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Attempted Plan</span>
            <span className="font-extrabold text-white text-sm bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              {planTitle}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Plan Price</span>
            <span className="font-black text-rose-400 text-base">
              ₹{typeof planPrice === "number" ? planPrice.toLocaleString("en-IN") : planPrice}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Transaction Status</span>
            <span className="font-black text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30 uppercase tracking-widest text-[10px]">
              Failed / Cancelled
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Error Reference Code</span>
            <code className="font-mono text-rose-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-[11px]">
              {errorCode}
            </code>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Failure Log ID</span>
            <code className="font-mono text-slate-300 text-[11px]">
              {referenceId}
            </code>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Attempt Time</span>
            <span className="text-slate-300 font-medium">{formattedDate}</span>
          </div>
        </div>
      </GlassCard>

      {/* TROUBLESHOOTING GUIDE */}
      <GlassCard
        hoverEffect={false}
        className="bg-slate-950/80 border-slate-800 p-6 rounded-3xl space-y-4"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            Troubleshooting Steps
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-sky-400" />
              1. Card / UPI Details
            </div>
            <p className="text-slate-400 text-[11px]">
              Verify card expiration date, CVV, or UPI PIN.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              2. Alternative Options
            </div>
            <p className="text-slate-400 text-[11px]">
              Try UPI, GPay, Paytm, or NetBanking.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              3. Bank Authorization
            </div>
            <p className="text-slate-400 text-[11px]">
              Ensure online payments are authorized by your bank.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <NeonButton2
          variant="danger"
          onClick={onRetry}
          icon={RotateCcw}
          className="py-3.5 px-6 text-xs font-black flex-1 w-full sm:w-auto"
        >
          <span>Try Payment Again</span>
          <ArrowRight className="w-4 h-4" />
        </NeonButton2>

        <NeonButton2
          variant="secondary"
          onClick={onBackToPlans}
          icon={CreditCard}
          className="py-3.5 px-6 text-xs font-bold w-full sm:w-auto"
        >
          Back to Billing & Plans
        </NeonButton2>

   
      </div>
    </div>
  );
}

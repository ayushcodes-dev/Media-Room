import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/component/cards/glassCard.jsx";
import NeonButton, { NeonButton2 } from "@/component/button/neonButton.jsx";
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Printer,
  Copy,
  Check,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Calendar,
  Receipt,
  FileCheck2,
  RotateCcw,
} from "lucide-react";

/**
 * PaymentSuccessComponent
 *
 * In-page component displayed on the Billing page when a payment succeeds.
 * Does NOT use separate routing.
 *
 * @param {Object} props
 * @param {Object} [props.plan] - Plan object
 * @param {string} [props.paymentId] - Razorpay or reference Payment ID
 * @param {string} [props.orderId] - Order ID
 * @param {number} [props.amount] - Price paid
 * @param {number} [props.credits] - Total credits added
 * @param {Function} props.onBackToPlans - Callback to return to billing plans view
 */
export default function PaymentSuccessComponent({
  plan,
  paymentId: propPaymentId,
  orderId: propOrderId,
  amount: propAmount,
  credits: propCredits,
  onBackToPlans,
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const planTitle = plan?.title || "Pro Creator Plan";
  const planPrice = propAmount || plan?.price || 599;
  const creditsAdded = propCredits || plan?.credits || 1500;
  const validity = plan?.validity || "2 Months";
  const dailyLimit = plan?.dailyLimit || 100;

  const paymentId =
    propPaymentId ||
    `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
  const orderId =
    propOrderId ||
    `order_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

  const formattedDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleCopyPaymentId = () => {
    navigator.clipboard.writeText(paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-8 animate-fade-in print:p-0 print:m-0">
      {/* Glow Background Effects (Hidden on Print) */}
      <div className="relative print:hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      </div>

      {/* HERO SUCCESS HEADER CARD */}
      <GlassCard
        hoverEffect={false}
        className="relative overflow-hidden bg-slate-950/90 border-emerald-500/30 text-center p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)]"
      >
        {/* Top Glowing Emerald Banner Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 shadow-[0_0_15px_#10b981]" />

        {/* Glowing Animated Checkmark Icon Ring */}
        <div className="relative mx-auto mb-6 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 border-2 border-emerald-400/40 shadow-[0_0_30px_rgba(16,185,129,0.5)]" />
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-slate-950 stroke-[2.5]" />
          </div>
        </div>

        {/* Success Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payment Verified & Plan Activated</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
          Payment Successful!
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Thank you for your purchase! Your plan is active, and{" "}
          <span className="font-bold text-emerald-400">
            +{typeof creditsAdded === "number" ? creditsAdded.toLocaleString("en-IN") : creditsAdded} Credits
          </span>{" "}
          have been added to your Media Room workspace.
        </p>

        {/* Summary Pills */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted Payment</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Validity: {validity}</span>
          </div>
        </div>
      </GlassCard>

      {/* DIGITAL RECEIPT CARD */}
      <GlassCard
        hoverEffect={false}
        className="bg-slate-950/80 border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Transaction Digital Receipt
              </h3>
              <p className="text-xs text-slate-400">
                Official proof of purchase for your subscription
              </p>
            </div>
          </div>

          <NeonButton2
            variant="secondary"
            onClick={handlePrint}
            icon={Printer}
            className="print:hidden text-xs py-2 px-3.5 self-start sm:self-auto"
          >
            Print Receipt
          </NeonButton2>
        </div>

        {/* RECEIPT DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Plan Subscribed</span>
            <span className="font-extrabold text-white text-sm bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              {planTitle}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Amount Paid</span>
            <span className="font-black text-emerald-400 text-base">
              ₹{typeof planPrice === "number" ? planPrice.toLocaleString("en-IN") : planPrice}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              Credits Added
            </span>
            <span className="font-extrabold text-sky-300 text-sm">
              +{typeof creditsAdded === "number" ? creditsAdded.toLocaleString("en-IN") : creditsAdded} Credits
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Payment Status</span>
            <span className="font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-widest text-[10px]">
              Success / Paid
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center col-span-1 md:col-span-2">
            <span className="text-slate-400 font-medium">Payment ID</span>
            <div className="flex items-center gap-2">
              <code className="font-mono text-slate-200 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-[11px]">
                {paymentId}
              </code>
              <button
                onClick={handleCopyPaymentId}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors print:hidden"
                title="Copy Payment ID"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Order ID</span>
            <code className="font-mono text-slate-300 text-[11px]">
              {orderId}
            </code>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center">
            <span className="text-slate-400 font-medium">Date & Time</span>
            <span className="text-slate-300 font-medium">{formattedDate}</span>
          </div>
        </div>
      </GlassCard>

      {/* UNLOCKED FEATURES */}
      <GlassCard
        hoverEffect={false}
        className="bg-slate-950/80 border-slate-800 p-6 rounded-3xl space-y-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            Unlocked Plan Capabilities
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              Daily Credit Limit
            </div>
            <p className="text-slate-400 text-[11px]">
              Up to {dailyLimit} credits/day limit allowance.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-sky-400" />
              High Priority Generation
            </div>
            <p className="text-slate-400 text-[11px]">
              Accelerated AI SEO & thumbnail queue.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Validity Protection
            </div>
            <p className="text-slate-400 text-[11px]">
              Credits remain valid for full {validity}.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 print:hidden">
        <NeonButton
          variant="primary"
          onClick={() => navigate("/dashboard")}
          className="py-3.5 text-xs font-black shadow-[0_0_25px_rgba(14,165,233,0.3)] flex-1"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </NeonButton>

        <NeonButton2
          variant="secondary"
          onClick={onBackToPlans}
          icon={RotateCcw}
          className="py-3.5 px-6 text-xs font-bold w-full sm:w-auto"
        >
          Back to Billing Plans
        </NeonButton2>
      </div>
    </div>
  );
}

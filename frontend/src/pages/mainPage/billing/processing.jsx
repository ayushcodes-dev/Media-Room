import React, { useState, useEffect } from "react";
import GlassCard from "@/component/cards/glassCard.jsx";
import { NeonButton2 } from "@/component/button/neonButton.jsx";
import {
  Loader2,
  ShieldCheck,
  Lock,
  CreditCard,
  Zap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  RefreshCw,
} from "lucide-react";

/**
 * PaymentProcessingComponent
 *
 * Displayed in the Billing Page while a payment transaction is in progress.
 * Shows high-tech animated loading visuals, active processing steps, selected plan details,
 * and security assurances. Automatically removed when payment state becomes 'success' or 'failed'.
 *
 * @param {Object} props
 * @param {Object} [props.plan] - Currently selected subscription plan
 * @param {string} [props.step] - Human-readable current processing step message
 * @param {number} [props.stepIndex] - Step index (1: Order, 2: Authorization, 3: Verification)
 * @param {Function} [props.onCancel] - Optional callback to cancel processing
 */
export default function PaymentProcessingComponent({
  plan,
  step = "Initializing payment session...",
  stepIndex = 1,
  onCancel,
}) {
  const [dots, setDots] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const planTitle = plan?.title || "Pro Creator Plan";
  const planPrice = plan?.price || 599;
  const planCredits = plan?.credits || 1500;
  const validity = plan?.validity || "2 Months";

  // Animated dots for dynamic text
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const stepsList = [
    {
      index: 1,
      title: "Creating Secure Order",
      description: "Generating order ID and registering transaction with server",
      icon: Lock,
    },
    {
      index: 2,
      title: "Gateway Authorization",
      description: "Awaiting bank/card authorization via Razorpay checkout",
      icon: CreditCard,
    },
    {
      index: 3,
      title: "Verifying & Crediting Account",
      description: "Validating signature and allocating subscription credits",
      icon: Zap,
    },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Background Glow Effects */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      </div>

      {/* HERO PROCESSING CARD */}
      <GlassCard
        hoverEffect={false}
        className="relative overflow-hidden bg-slate-950/90 border-sky-500/40 text-center p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(14,165,233,0.2)]"
      >
        {/* Top Animated Neon Cyan Banner Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 shadow-[0_0_20px_#38bdf8] animate-pulse" />

        {/* Dynamic Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-black uppercase tracking-widest mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400" />
          </span>
          <span>Payment Processing In Progress</span>
        </div>

        {/* CENTRAL HIGH-TECH ANIMATED SPINNER ICON */}
        <div className="relative mx-auto mb-8 w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
          {/* Outer Rotating Gear Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-500/30 animate-[spin_10s_linear_infinite]" />
          
          {/* Middle Pulse Ring */}
          <div className="absolute inset-2 rounded-full bg-sky-500/10 border border-sky-400/40 animate-ping opacity-60" />
          <div className="absolute inset-2 rounded-full border-2 border-sky-400/50 border-t-transparent animate-spin" />

          {/* Central Glowing Icon Capsule */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center shadow-[0_0_35px_rgba(14,165,233,0.5)]">
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-white animate-spin stroke-[2.5]" />
          </div>
        </div>

        {/* Headline & Current Dynamic Step Message */}
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
          {step}
          <span className="inline-block w-6 text-sky-400 text-left">{dots}</span>
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Please wait while we secure your transaction. Do not refresh, reload, or navigate away from this page.
        </p>

        {/* Timer Counter & Security Badges Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Time Elapsed: <strong className="text-white font-mono">{elapsedSeconds}s</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Session</span>
          </div>
        </div>
      </GlassCard>

      {/* THREE-STEP PROCESSING PROGRESS TRACKER */}
      <GlassCard
        hoverEffect={false}
        className="bg-slate-950/80 border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800/80 mb-6">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Transaction Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              Live status updates for your subscription processing
            </p>
          </div>
        </div>

        {/* STEPPER LIST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stepsList.map((s) => {
            const isCompleted = s.index < stepIndex;
            const isCurrent = s.index === stepIndex;
            const StepIcon = s.icon;

            return (
              <div
                key={s.index}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? "bg-sky-500/10 border-sky-400/60 shadow-[0_0_20px_rgba(14,165,233,0.15)]"
                    : isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-slate-900/40 border-slate-800/80 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-xl border ${
                      isCurrent
                        ? "bg-sky-500/20 border-sky-400 text-sky-300"
                        : isCompleted
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border">
                    {isCompleted ? (
                      <span className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">Completed</span>
                    ) : isCurrent ? (
                      <span className="text-sky-300 border-sky-400/40 bg-sky-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Active
                      </span>
                    ) : (
                      <span className="text-slate-500 border-slate-800 bg-slate-900 px-2 py-0.5 rounded">Pending</span>
                    )}
                  </span>
                </div>

                <div>
                  <h4
                    className={`text-sm font-bold mb-1 ${
                      isCurrent ? "text-white" : isCompleted ? "text-slate-200" : "text-slate-400"
                    }`}
                  >
                    Step {s.index}: {s.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* SELECTED PLAN SUMMARY CARD */}
      <GlassCard
        hoverEffect={false}
        className="bg-slate-950/80 border-slate-800 p-6 rounded-3xl"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Target Plan
              </span>
              <h4 className="text-lg font-black text-white">{planTitle}</h4>
              <p className="text-xs text-slate-400">
                Validity: <span className="text-slate-200 font-semibold">{validity}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-right sm:text-right">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Total Amount
              </span>
              <span className="text-2xl font-black text-white">
                ₹{typeof planPrice === "number" ? planPrice.toLocaleString("en-IN") : planPrice}
              </span>
            </div>

            <div className="pl-6 border-l border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Credits Adding
              </span>
              <span className="text-xl font-black text-sky-400 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                +{typeof planCredits === "number" ? planCredits.toLocaleString("en-IN") : planCredits}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* SECURITY NOTICE ALERT */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h5 className="font-extrabold text-amber-100 uppercase tracking-wider">
            Important Notice During Payment
          </h5>
          <p className="text-amber-200/80 leading-relaxed text-[11px]">
            Payment gateways typically take between 5 to 30 seconds to confirm payment authorization.
            Closing this browser tab or refreshing may interrupt credit synchronization.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import GlassCard from "@/component/cards/glassCard.jsx";
import { Loader2, ShieldCheck, Lock, CreditCard, Zap, RefreshCw, X } from "lucide-react";

/**
 * PaymentProcessingModal Component
 *
 * A bottom slide-up modal popup displaying the payment processing animation and steps.
 * Can be shown when payment is in progress or overlaying the screen.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibility flag
 * @param {Object} props.plan - Currently selected plan details
 * @param {string} [props.step] - Current processing step message
 * @param {Function} [props.onClose] - Close handler
 */
const PaymentProcessingModal = ({
  isOpen,
  plan,
  step = "Communicating with payment gateway...",
  onClose,
}) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
      {/* Darkened Backdrop Overlay */}
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 animate-fade-in" />

      {/* Center Modal Card */}
      <div className="relative w-full max-w-lg mx-auto z-50 transform transition-all duration-300 ease-out animate-scale-up">
        <GlassCard
          hoverEffect={false}
          className="relative bg-slate-950/95 border-sky-500/50 shadow-[0_0_50px_rgba(14,165,233,0.3)] p-6 md:p-8 rounded-3xl border text-center"
        >
          {/* Top Neon Banner Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full shadow-[0_0_15px_#38bdf8]" />

          {/* Glowing Animated Loading Icon */}
          <div className="relative mx-auto my-4 w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping opacity-75" />
            <div className="absolute inset-0 rounded-full border-2 border-sky-400/40 border-t-transparent animate-spin" />
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/40">
              <Loader2 className="w-8 h-8 text-white animate-spin stroke-[2.5]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[10px] font-black uppercase tracking-widest mb-3">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Processing Payment</span>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight mb-2">
            {step}
          </h3>

          <p className="text-xs text-slate-300 mb-6 max-w-xs mx-auto">
            Please wait while we establish a secure 256-bit encrypted link with Razorpay.
          </p>

          {/* Selected Plan Brief */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs text-left mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Plan</span>
              <span className="text-sm font-extrabold text-white">{plan.title}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount</span>
              <span className="text-sm font-black text-sky-400">₹{plan.price}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Do not close or reload this window</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default PaymentProcessingModal;

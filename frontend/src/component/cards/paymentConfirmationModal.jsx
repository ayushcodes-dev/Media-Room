import React from "react";
import { X, ShieldCheck, Zap, CreditCard, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import GlassCard from "@/component/cards/glassCard.jsx";
import NeonButton, { NeonButton2 } from "@/component/button/neonButton.jsx";

/**
 * PaymentConfirmationModal Component
 * 
 * A bottom slide-up popup card used to confirm subscription payments.
 * Prominently displays:
 * - Plan Name
 * - Price
 * - Total Credits
 * - Validity
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the popup card
 * @param {Object} props.plan - Currently selected plan details
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onConfirm - Callback when user confirms payment
 * @param {Function} [props.onSimulateSuccess] - Callback to simulate success page directly
 * @param {Function} [props.onSimulateFailure] - Callback to simulate failure page directly
 */
const PaymentConfirmationModal = ({
  isOpen,
  plan,
  onClose,
  onConfirm,
  onSimulateSuccess,
  onSimulateFailure,
}) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
      {/* Darkened Backdrop Overlay with Smooth Fade */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Popup Card Drawer */}
      <div className="relative w-full max-w-lg mx-auto mb-0 md:mb-6 p-4 md:px-6 z-50 transform transition-all duration-300 ease-out animate-slide-up">
        <GlassCard
          hoverEffect={false}
          className="relative bg-slate-950/95 border-sky-400/50 shadow-[0_-10px_40px_rgba(14,165,233,0.25)] p-6 md:p-7 rounded-t-3xl md:rounded-3xl border-t border-x border-b border-slate-800"
        >
          {/* Neon Glow Accent Header Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_12px_#38bdf8]" />

          {/* Top Bar with Title & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Confirm Subscription
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Review plan details before completing payment
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MAIN DETAILS GRID (Plan Name, Price, Total Credit) */}
          <div className="py-6 space-y-5">
            {/* Plan Name Capsule */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                  Selected Plan
                </span>
                <h4 className="text-xl font-extrabold text-white flex items-center gap-2">
                  {plan.title}
                  {plan.isRecommended && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                  Duration
                </span>
                <span className="text-xs font-bold text-slate-200 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  {plan.validity}
                </span>
              </div>
            </div>

            {/* Price & Total Credits Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {/* Price Metric */}
              <div className="bg-slate-900/60 border border-sky-500/20 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                  Total Price
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-sky-400">₹</span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {typeof plan.price === "number" ? plan.price.toLocaleString("en-IN") : plan.price}
                  </span>
                </div>
              </div>

              {/* Total Credit Metric */}
              <div className="bg-slate-900/60 border border-sky-500/20 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1 mb-1">
                  <Zap className="w-3 h-3 text-sky-400" />
                  Total Credits
                </span>
                <div className="text-2xl font-black text-sky-300 tracking-tight">
                  {typeof plan.credits === "number" ? plan.credits.toLocaleString("en-IN") : plan.credits}
                </div>
              </div>
            </div>

            {/* Feature Highlights Summary */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  SEO & Thumbnail AI Access:
                </span>
                <span className="font-bold text-emerald-400">Included</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (Confirm & Cancel) */}
          <div className="flex items-center gap-3 pt-2">
            <NeonButton2
              variant="secondary"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold border-slate-800 hover:bg-slate-900"
            >
              Cancel
            </NeonButton2>

            <NeonButton
              variant="primary"
              onClick={() => onConfirm(plan)}
              className="flex-[2] py-3 text-xs font-black shadow-[0_0_20px_rgba(14,165,233,0.4)]"
            >
              <span>Confirm & Pay ₹{plan.price}</span>
              <ArrowRight className="w-4 h-4" />
            </NeonButton>
          </div>

        

          {/* Secure Payment Footer */}
          <div className="mt-3 pt-2 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;

import React, { useState, useEffect } from "react";
import MainPage from "@/wrapper/mainPage";
import Protect from "@/wrapper/protect";
import MainPageHeader from "@/component/header/mainPage.jsx";
import GlassCard from "@/component/cards/glassCard.jsx";
import BillingCard from "@/component/cards/billingCard.jsx";
import PaymentConfirmationModal from "@/component/cards/paymentConfirmationModal.jsx";
import Toaster1 from "@/component/toaster/toaster1.jsx";
import { Zap, CreditCard, Sparkles, CheckCircle2, Shield, HelpCircle } from "lucide-react";

/**
 * Billing Page Component (MainPage Billing Section)
 * 
 * Main billing and subscription management workspace for Media Room / Tubenix.
 * Displays user's current credit balance, credit breakdown, 4 tiered subscription plans,
 * and a bottom slide-up payment confirmation popup card.
 */
export default function BillingPage() {
  const [toasterData, setToasterData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Billing & Plans | Media Room";
  }, []);

  /**
   * Opens the payment confirmation modal for a selected plan
   */
  const handleOpenPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  /**
   * Finalize Payment Confirmation
   * Adds success toast notification and closes the bottom popup card
   */
  const handleConfirmPayment = (plan) => {
    setIsPaymentModalOpen(false);
    setToasterData((prev) => [
      ...prev,
      {
        id: `confirm_${Date.now()}`,
        status: "success",
        info: `Payment Successful! Subscribed to ${plan.title} (₹${plan.price}) with ${plan.credits.toLocaleString("en-IN")} Credits.`,
        align: "top-right",
        duration: 5000,
      },
    ]);
  };

  /**
   * Data definition for the 4 pricing cards
   * - Card 1: Price 299, 500 Credits, 1 Month, 50/day max
   * - Card 2: Price 599, 1500 Credits, 2 Months, 100/day max (RECOMMENDED)
   * - Card 3: Price 899, 3000 Credits, 4 Months, 200/day max
   * - Card 4: Price 1999, 7000 Credits, 6 Months, 500/day max
   */
  const PRICING_PLANS = [
    {
      id: "starter",
      title: "Starter Plan",
      subtitle: "Ideal for new creators starting out",
      price: 299,
      credits: 500,
      validity: "1 Month",
      dailyLimit: 50,
      isRecommended: false,
      features: [
        "Plan validity for 1 Month",
        "Per-day max credit limit: 50 Credits",
        "SEO Data Generation available",
        "Thumbnail Generation available",
        "Standard generation priority",
        "Export metadata in JSON format",
      ],
    },
    {
      id: "pro",
      title: "Pro Creator",
      subtitle: "Best choice for active channel managers",
      price: 599,
      credits: 1500,
      validity: "2 Months",
      dailyLimit: 100,
      isRecommended: true, // Card 2 is RECOMMENDED
      badgeText: "RECOMMENDED",
      features: [
        "Plan validity for 2 Months",
        "Per-day max credit limit: 100 Credits",
        "SEO Data Generation available",
        "Thumbnail Generation available",
        "Accelerated generation priority",
        "CTR-optimized title & tag engine",
      ],
    },
    {
      id: "growth",
      title: "Growth Studio",
      subtitle: "Built for scaling YouTube channels",
      price: 899,
      credits: 3000,
      validity: "4 Months",
      dailyLimit: 200,
      isRecommended: false,
      features: [
        "Plan validity for 4 Months",
        "Per-day max credit limit: 200 Credits",
        "SEO Data Generation available",
        "Thumbnail Generation available",
        "High-priority generation queue",
        "Multi-variation prompt canvas",
      ],
    },
    {
      id: "elite",
      title: "Elite Agency",
      subtitle: "Maximum credits for power creators",
      price: 1999,
      credits: 7000,
      validity: "6 Months",
      dailyLimit: 500,
      isRecommended: false,
      features: [
        "Plan validity for 6 Months",
        "Per-day max credit limit: 500 Credits",
        "SEO Data Generation available",
        "Thumbnail Generation available",
        "VIP ultra-fast generation priority",
        "Dedicated creator support",
      ],
    },
  ];

  return (
    <Protect>
      <MainPage>
        {/* Toast Notification Container */}
        <Toaster1 data={toasterData} />

        <div className="flex-1 px-4 md:px-8 py-6 mb-20 md:py-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
          {/* Header Bar */}
          <MainPageHeader
            title="Billing & Subscription"
            description="Choose the right credit plan for your YouTube channel SEO and AI thumbnail generation."
            createProjectButton={false}
          />

          {/* Current Balance & Credit Info Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Active Balance Card */}
            <GlassCard hoverEffect={false} className="relative overflow-hidden bg-slate-950/60 border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  Current Active Plan
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  Active
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">Starter Free</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Daily reset cap: 50 credits/day
              </p>
            </GlassCard>

            {/* Remaining Credit Balance */}
            <GlassCard hoverEffect={false} className="relative overflow-hidden bg-slate-950/60 border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-sky-400" />
                  Available Credits
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-[10px] font-black text-sky-400 uppercase tracking-widest">
                  Ready
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-sky-400">450</span>
                <span className="text-xs text-slate-400 font-bold">/ 500 Credits</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-500 to-blue-500 h-full w-[90%] rounded-full shadow-[0_0_8px_#38bdf8]" />
              </div>
            </GlassCard>

            {/* Credit Usage Breakdown */}
            <GlassCard hoverEffect={false} className="relative overflow-hidden bg-slate-950/60 border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  Credit Cost Rate
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300 font-medium">SEO Data Generation</span>
                  <span className="font-bold text-sky-400">5 Credits</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300 font-medium">Thumbnail Canvas Generation</span>
                  <span className="font-bold text-sky-400">20 Credits</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Pricing Section Header */}
          <div className="pt-4">
            <div className="flex items-center pl-0.5 mb-2">
              <span className="w-1 h-5 bg-sky-400 rounded shadow-[0_0_8px_#38bdf8] mr-3" />
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-300">
                Subscription Credit Packages
              </h2>
            </div>
            <p className="text-xs text-slate-400 pl-4">
              Select a plan to unlock higher daily credit caps and total generation allowances.
            </p>
          </div>

          {/* 4 CARDS PRICING GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-2">
            {PRICING_PLANS.map((plan) => (
              <BillingCard
                key={plan.id}
                title={plan.title}
                subtitle={plan.subtitle}
                price={plan.price}
                credits={plan.credits}
                validity={plan.validity}
                dailyLimit={plan.dailyLimit}
                features={plan.features}
                isRecommended={plan.isRecommended}
                badgeText={plan.badgeText}
                onSubscribe={() => handleOpenPaymentModal(plan)}
              />
            ))}
          </div>

          {/* Bottom Trust & Feature FAQ Highlights */}
          <div className="mt-16 pt-8 border-t border-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60">
                <Shield className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Instant Activation</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Credits are added to your workspace instantly after successful payment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60">
                <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Rollover Protection</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Unused total credits stay valid for the full plan duration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60">
                <HelpCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Need Custom Volume?</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Contact creator support for custom multi-channel agency packages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM POPUP PAYMENT CONFIRMATION CARD */}
        <PaymentConfirmationModal
          isOpen={isPaymentModalOpen}
          plan={selectedPlan}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={handleConfirmPayment}
        />
      </MainPage>
    </Protect>
  );
}

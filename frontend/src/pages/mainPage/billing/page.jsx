import { useState, useEffect } from "react";
import MainPage from "@/wrapper/mainPage";
import Protect from "@/wrapper/protect";
import MainPageHeader from "@/component/header/mainPage.jsx";

import BillingCard from "@/component/cards/billingCard.jsx";
import PaymentConfirmationModal from "@/component/cards/paymentConfirmationModal.jsx";
import Toaster1 from "@/component/toaster/toaster1.jsx";
import createOrder from "@/features/billing/createOrder.js";
import verifyPayment from "@/features/billing/verifyPayment.js";
import PaymentProcessingComponent from "./processing.jsx";
import PaymentSuccessComponent from "./success.jsx";
import PaymentFailedComponent from "./failed.jsx";
import SubscriptionHistoryCard from "./historyCard.jsx";
import SubscriptionHistoryModal from "./historyModal.jsx";
import getPaymentHistory from "@/features/billing/getHistory.js"
import updatePlanStatus from "@/features/billing/updatePlanStatus.js";

import {
  CheckCircle2,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useAsyncValue } from "react-router-dom";

/**
 * Billing Page Component (MainPage Billing Section)
 *
 * Main billing and subscription management workspace for Media Room / Tubenix.
 * Displays subscription history card (thin rows, status, expired/active, see all modal),
 * available credit balance, credit breakdown, 4 tiered subscription plans,
 * and renders Payment Success / Payment Failure components in-page without separate routes.
 */
export default function BillingPage() {
  const [toasterData, setToasterData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // In-page payment state view: 'idle' | 'processing' | 'success' | 'failed'
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [processingStep, setProcessingStep] = useState("Initializing secure payment session...");
  const [processingStepIndex, setProcessingStepIndex] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState({
    plan: null,
    paymentId: "",
    orderId: "",
    amount: 0,
    credits: 0,
    error: "",
    code: "",
  });

  // Subscription History State (Initial sample history conforming to history format)
  const [billingHistory, setBillingHistory] = useState([
   
  ]);

  useEffect(() => {
    document.title = "Billing & Plans | Media Room";
    getPaymentHistory({ setPaymentHistory: setBillingHistory });
  }, []);

  /**
   * Opens the payment confirmation modal for a selected plan
   */
  const handleOpenPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  /**
   * Show Payment Success Component in-page and append to History
   */
  const handleShowSuccess = (plan, paymentId, orderId) => {
    setIsPaymentModalOpen(false);

    const generatedPaymentId =
      paymentId || `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    const generatedOrderId =
      orderId || `order_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    setPaymentDetails({
      plan: plan,
      paymentId: generatedPaymentId,
      orderId: generatedOrderId,
      amount: plan?.price || 599,
      credits: plan?.credits || 1500,
    });
    setPaymentStatus("success");

    // Add new purchase to History matching the backend format
    if (plan) {
      const now = new Date();
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 2);

      const newHistoryItem = {
        _id: `hist_${Date.now()}`,
        planID: plan.id,
        planTitle: plan.title,
        price: plan.price,
        credits: plan.credits,
        dailyLimit: plan.dailyLimit || 100,
        seoDataCredit: 5,
        thumbnailCredit: 20,
        purchaseDate: now.toISOString(),
        expirydate: expiry.toISOString(),
        orderID: generatedOrderId,
        status: "purchased",
      };

      setBillingHistory((prevHistory) => [
        newHistoryItem,
        ...prevHistory.map((item) => ({ ...item, status: "expired" })),
      ]);
    }
  };

  /**
   * Show Payment Failure Component in-page
   */
  const handleShowFailed = (plan, errorMessage, errorCode) => {
    setIsPaymentModalOpen(false);
    setPaymentDetails({
      plan: plan,
      error: errorMessage || "The payment process was unsuccessful or cancelled.",
      code: errorCode || "PAYMENT_FAILED",
      amount: plan?.price || 599,
    });
    setPaymentStatus("failed");
  };

  /**
   * Finalize Payment Confirmation with Razorpay
   */
  const handleConfirmPayment = async (plan) => {
    const targetPlan = plan || selectedPlan;
    setSelectedPlan(targetPlan);
    setIsPaymentModalOpen(false);

    // Show Payment Processing view during payment execution
    setPaymentDetails((prev) => ({ ...prev, plan: targetPlan }));
    setPaymentStatus("processing");
    setProcessingStep("Creating secure transaction order with server...");
    setProcessingStepIndex(1);

    try {
      const res = await createOrder({
        planID: targetPlan.id,
      });

      if (res && res.success && res.data?.order) {
        setProcessingStep("Awaiting payment authorization via gateway...");
        setProcessingStepIndex(2);

        const paymentObject = new window.Razorpay({
          key: "rzp_test_TCGPlFcfHm3Qkm",
          order_id: res.data.order.id,
          ...res.data.order,
          handler: function (response) {
            setProcessingStep("Verifying payment signature & allocating credits...");
            setProcessingStepIndex(3);

            const option2 = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };
            verifyPayment(option2).then(async (verifyRes) => {
              if (verifyRes && verifyRes.success) {
                await updatePlanStatus({ orderID: response.razorpay_order_id });
                getPaymentHistory({ setPaymentHistory: setBillingHistory });
                handleShowSuccess(targetPlan, response.razorpay_payment_id, response.razorpay_order_id);
              } else {
                handleShowFailed(
                  targetPlan,
                  verifyRes?.error?.message || "Payment verification failed on server.",
                  "VERIFICATION_FAILED"
                );
              }
            }).catch((err) => {
              handleShowFailed(targetPlan, err?.message || "Payment verification request failed.", "NETWORK_ERROR");
            });
          },
          modal: {
            ondismiss: function () {
              handleShowFailed(targetPlan, "Payment checkout was dismissed by user.", "USER_CANCELLED");
            },
          },
        });

        paymentObject.on("payment.failed", function (response) {
          handleShowFailed(
            targetPlan,
            response.error?.description || "Payment failed or was declined by payment gateway.",
            response.error?.code || "PAYMENT_DECLINED"
          );
        });

        paymentObject.open();
      } else {
        handleShowFailed(
          targetPlan,
          res?.error?.message || "Unable to initialize order with server. Please try again.",
          "ORDER_CREATION_FAILED"
        );
      }
    } catch (err) {
      handleShowFailed(
        targetPlan,
        err?.message || "An unexpected error occurred during payment setup.",
        "CLIENT_ERROR"
      );
    }
  };

  /**
   * Data definition for the 4 pricing cards
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
      isRecommended: true,
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

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  return (
    <Protect>
      <MainPage>
        <Toaster1 data={toasterData} />

        <div className="flex-1 px-4 md:px-8 py-6 mb-20 md:py-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
          {/* Header Bar */}
          <MainPageHeader
            title="Billing & Subscription"
            description="Choose the right credit plan for your YouTube channel SEO and AI thumbnail generation."
            createProjectButton={false}
          />

          {/* IN-PAGE VIEW SWITCHING (No separate routes) */}
          {paymentStatus === "processing" && (
            <PaymentProcessingComponent
              plan={paymentDetails.plan || selectedPlan}
              step={processingStep}
              stepIndex={processingStepIndex}
              onCancel={() => setPaymentStatus("idle")}
            />
          )}

          {paymentStatus === "success" && (
            <PaymentSuccessComponent
              plan={paymentDetails.plan}
              paymentId={paymentDetails.paymentId}
              orderId={paymentDetails.orderId}
              amount={paymentDetails.amount}
              credits={paymentDetails.credits}
              onBackToPlans={() => setPaymentStatus("idle")}
            />
          )}

          {paymentStatus === "failed" && (
            <PaymentFailedComponent
              plan={paymentDetails.plan}
              error={paymentDetails.error}
              code={paymentDetails.code}
              onRetry={() => {
                setPaymentStatus("idle");
                if (paymentDetails.plan) {
                  handleOpenPaymentModal(paymentDetails.plan);
                }
              }}
              onBackToPlans={() => setPaymentStatus("idle")}
            />
          )}

          {paymentStatus === "idle" && (
            <>
              {/* Top 3 Metric Cards Grid */}
              <div className="grid  gap-5">
                {/* Pricing Section Header */}
                <div className="pt-4">
                  <div className="flex items-center pl-0.5 mb-2">
                    <span className="w-1 h-5 bg-sky-400 rounded shadow-[0_0_8px_#38bdf8] mr-3" />
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-300">
                      Subscription History & Active Plan
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 pl-4">
                  see your all palns
                  </p>
                </div>
                {/* 1. SUBSCRIPTION HISTORY CARD (Replaces Active Plan Card) */}
                <SubscriptionHistoryCard
                  history={billingHistory}
                  onSeeAll={() => setIsHistoryModalOpen(true)}
                />

                {/* 2. Remaining Credit Balance */}
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
                  Select a plan to unlock higher daily credit caps and total
                  generation allowances.
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

              {/* Bottom Trust Highlights */}
              <div className="mt-16 pt-8 border-t border-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60">
                    <Shield className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Instant Activation
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Credits are added to your workspace instantly after
                        successful payment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Rollover Protection
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Unused total credits stay valid for the full plan
                        duration.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60">
                    <HelpCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Need Custom Volume?
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Contact creator support for custom multi-channel agency
                        packages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* SUBSCRIPTION HISTORY FULL LIST MODAL */}
        <SubscriptionHistoryModal
          isOpen={isHistoryModalOpen}
          history={billingHistory}
          onClose={() => setIsHistoryModalOpen(false)}
        />

        {/* BOTTOM POPUP PAYMENT CONFIRMATION CARD */}
        <PaymentConfirmationModal
          isOpen={isPaymentModalOpen}
          plan={selectedPlan}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={(plan) => {
            handleConfirmPayment(plan || selectedPlan);
          }}
          onSimulateSuccess={(plan) => {
            handleShowSuccess(plan || selectedPlan);
          }}
          onSimulateFailure={(plan) => {
            handleShowFailed(
              plan || selectedPlan,
              "Simulated payment declined for testing (Insufficient funds or card decline)",
              "ERR_SIMULATED_DECLINE",
            );
          }}
        />
      </MainPage>
    </Protect>
  );
}

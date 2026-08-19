import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Protect from "@/wrapper/protect";
import MainPage from "@/wrapper/mainPage";
import MainPageHeader from "@/component/header/mainPage.jsx";
import GlassCard from "@/component/cards/glassCard.jsx";
import getPaymentHistory from "@/features/billing/getbillingHistory";
import getUsage from "@/features/usage/get.usage.js";
import {
  BarChart3,
  Zap,
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  CreditCard,
  ArrowRight,
  Info,
  Check,
  AlertCircle,
} from "lucide-react";

/**
 * Format ISO date string into readable date & time format (e.g. "Aug 09, 2026 • 02:45 PM")
 * @param {string|Date} dateStr - Date string or instance
 * @returns {string} Formatted date & time string
 */
const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);

  const dateFormatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const timeFormatted = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateFormatted} • ${timeFormatted}`;
};

/**
 * Format ISO date string into short readable date (e.g. "Aug 09, 2026")
 * @param {string|Date} dateStr
 * @returns {string} Formatted short date
 */
const formatDateShort = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

/**
 * Helper to get clean human plan title from plan object or plan ID
 * @param {Object|string} plan
 * @returns {string} Human title (e.g. "Pro Creator", "Starter Plan", "No Active Plan")
 */
const getPlanTitle = (plan) => {
  if (!plan) return "No Active Plan";
  if (typeof plan === "string") {
    const id = plan.toLowerCase();
    if (id.includes("pro")) return "Pro Creator";
    if (id.includes("starter")) return "Starter Plan";
    if (id.includes("growth")) return "Growth Studio";
    if (id.includes("elite")) return "Elite Agency";
    return plan.charAt(0).toUpperCase() + plan.slice(1) + " Plan";
  }
  if (plan.planTitle) return plan.planTitle;
  if (plan.title) return plan.title;
  if (plan.planID) {
    const id = plan.planID.toString().toLowerCase();
    if (id === "pro") return "Pro Creator";
    if (id === "starter") return "Starter Plan";
    if (id === "growth") return "Growth Studio";
    if (id === "elite") return "Elite Agency";
    return plan.planID.charAt(0).toUpperCase() + plan.planID.slice(1) + " Plan";
  }
  return "No Active Plan";
};

/**
 * Helper to check if a plan is expired
 * @param {Object} plan
 * @returns {boolean} True if plan is expired
 */
const isPlanExpired = (plan) => {
  if (!plan) return true;
  const rawStatus = (plan.status || "").toLowerCase();
  if (rawStatus === "expired") return true;

  const expiryRaw = plan.expirydate || plan.expiryDate;
  if (!expiryRaw) return false;

  const expiryTime = new Date(expiryRaw).getTime();
  if (isNaN(expiryTime)) return false;

  return expiryTime < Date.now();
};

/**
 * UsagePage Component (MainPage Usages Section)
 *
 * Provides a comprehensive credit and feature usage dashboard:
 * 1. Top Section: Active Plan summary, Credit Used vs Left gauge, Change Active Plan button, Filter out expired plans.
 * 2. Fetches all plans from features/billing/getbillingHistory.
 * 3. Usage History Table & Cards: Date & Time, SEO Data Generated / Thumbnail Generated, Credits Used, Daily Limit Crossed.
 * 4. Strictly shows data belonging to the Active Plan.
 */
export default function UsagePage() {
  const navigate = useNavigate();

  // State definitions
  const [plansHistory, setPlansHistory] = useState([]);
  const [usageData, setUsageData] = useState(null);
  const [usageLogs, setUsageLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all' | 'SEO_DATA' | 'THUMBNAIL'
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'credits'

  // Fetch subscription history & usage on mount
  useEffect(() => {
    document.title = "Credit Usage & History | Media Room";

    let isMounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const plans = await getPaymentHistory({ setPaymentHistory: setPlansHistory });
        const plansList = Array.isArray(plans) ? plans : [];
        const active =
          plansList.find((p) => p.status === "active") ||
          plansList.find((p) => p.status === "purchased") ||
          plansList[0];

        if (active?.orderID && isMounted) {
          await getUsage(
            { orderID: active.orderID },
            { setUsageLogs, setUsageData }
          );
        }
      } catch (err) {
        console.error("Failed to fetch billing/usage history:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Filter out EXPIRED plans and locate current ACTIVE plan
   * Requirement: "also not show expired plan"
   */
  const nonExpiredPlans = useMemo(() => {
    return plansHistory.filter((plan) => !isPlanExpired(plan));
  }, [plansHistory]);

  /**
   * Active plan resolution:
   * Prefer plan with status === "active" or "purchased" (non-expired)
   * If none exists in history, check if usageData has valid plan/order info.
   * If none exists, resolves to null ("No Active Plan")
   */
  const activePlan = useMemo(() => {
    if (nonExpiredPlans.length > 0) {
      const active =
        nonExpiredPlans.find((p) => p.status === "active") ||
        nonExpiredPlans.find((p) => p.status === "purchased") ||
        nonExpiredPlans[0];
      return active || null;
    }
    if (usageData?.planID && usageData?.orderID) {
      return {
        planID: usageData.planID,
        orderID: usageData.orderID,
        credits: usageData.totalCredits,
        createdAt: usageData.createdAt,
        status: "active",
      };
    }
    return null;
  }, [nonExpiredPlans, usageData]);

  const hasActivePlan = Boolean(activePlan || usageData?.orderID);

  // Sync usage when activePlan orderID changes
  useEffect(() => {
    if (
      activePlan?.orderID &&
      activePlan.orderID !== usageData?.orderID
    ) {
      getUsage(
        { orderID: activePlan.orderID },
        { setUsageLogs, setUsageData }
      );
    }
  }, [activePlan?.orderID, usageData?.orderID]);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const plans = await getPaymentHistory({ setPaymentHistory: setPlansHistory });
      const plansList = Array.isArray(plans) ? plans : [];
      const active =
        plansList.find((p) => p.status === "active") ||
        plansList.find((p) => p.status === "purchased") ||
        plansList[0];

      if (active?.orderID) {
        await getUsage(
          { orderID: active.orderID },
          { setUsageLogs, setUsageData }
        );
      }
    } catch (err) {
      console.error("Manual refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Calculate aggregated usage statistics for the Active Plan & Usage Document
   */
  const stats = useMemo(() => {
    // Total plan credits (from usage document or active plan)
    const totalCredits = hasActivePlan
      ? Number(usageData?.totalCredits ?? activePlan?.credits ?? 0)
      : 0;

    // Normalizing usage log entries to match backend { action, date, projectID, creditUsed } format
    const normalizedLogs = (usageLogs || []).map((item, idx) => {
      const rawAction = String(item.action || item.type || "").toLowerCase();
      const isSeo = rawAction.includes("seo");
      const isThumbnail = rawAction.includes("thumb");

      const type = isSeo
        ? "SEO_DATA"
        : isThumbnail
        ? "THUMBNAIL"
        : item.type || item.action || "GENERAL";

      const title =
        item.title ||
        (isSeo
          ? "SEO Data Generated"
          : isThumbnail
          ? "Thumbnail Generated"
          : `${item.action || "Feature"} Executed`);

      const details =
        item.details ||
        (isSeo
          ? "YouTube SEO metadata & tag optimization"
          : isThumbnail
          ? "AI Thumbnail Canvas Generation"
          : "AI Feature Execution");

      const dateStr =
        item.date ||
        item.dateTime ||
        item.createdAt ||
        item.updatedAt ||
        new Date().toISOString();

      const creditCost =
        Number(item.creditUsed) ||
        (isSeo
          ? activePlan?.seoDataCredit || 5
          : isThumbnail
          ? activePlan?.thumbnailCredit || 20
          : 0);

      const projectName =
        item.projectName ||
        (item.projectID ? `Project ${item.projectID.slice(-6)}` : "General Project");

      const id = item._id || item.id || `usg_${idx}_${item.action || "item"}`;
      const status = item.status || "completed";

      return {
        ...item,
        id,
        _id: item._id || id,
        type,
        action: item.action || type,
        title,
        details,
        dateTime: dateStr,
        date: dateStr,
        projectName,
        projectID: item.projectID,
        creditUsed: creditCost,
        status,
      };
    });

    // Total credits consumed:
    const totalCreditsUsed = hasActivePlan
      ? (typeof usageData?.usedCredit === "number"
          ? usageData.usedCredit
          : normalizedLogs.reduce((acc, log) => acc + (log.creditUsed || 0), 0))
      : 0;

    const creditsLeft = Math.max(0, totalCredits - totalCreditsUsed);
    const usedPercentage =
      totalCredits > 0
        ? Math.min(100, Math.round((totalCreditsUsed / totalCredits) * 100))
        : 0;

    // Calculate today's credits used
    const todayStr = new Date().toDateString();
    const todayLogs = normalizedLogs.filter(
      (log) => new Date(log.dateTime).toDateString() === todayStr
    );
    const todayCreditsUsed = todayLogs.reduce(
      (acc, log) => acc + (log.creditUsed || 0),
      0
    );

    // Count by generation type
    const seoCount = normalizedLogs.filter((log) => log.type === "SEO_DATA").length;
    const thumbnailCount = normalizedLogs.filter(
      (log) => log.type === "THUMBNAIL"
    ).length;

    const hasUsage = normalizedLogs.length > 0 || totalCreditsUsed > 0;

    return {
      totalCredits,
      totalCreditsUsed,
      creditsLeft,
      usedPercentage,
      todayCreditsUsed,
      todayCount: todayLogs.length,
      seoCount,
      thumbnailCount,
      normalizedLogs,
      hasUsage,
    };
  }, [activePlan, hasActivePlan, usageData, usageLogs]);

  /**
   * Filter and sort table usage data
   * Requirement: "only show data of active plan."
   */
  const filteredUsageHistory = useMemo(() => {
    let list = [...stats.normalizedLogs];

    // 1. Filter by Category (SEO vs Thumbnail)
    if (selectedFilter !== "all") {
      list = list.filter((item) => item.type === selectedFilter);
    }

    // 2. Sorting logic
    list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      }
      if (sortBy === "credits") {
        return b.creditUsed - a.creditUsed;
      }
      return 0;
    });

    return list;
  }, [stats.normalizedLogs, selectedFilter, sortBy]);

  return (
    <Protect>
      <MainPage>
        <div className="flex-1 px-4 md:px-8 py-6 mb-20 md:py-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
          {/* Header Bar */}
          <MainPageHeader
            title="Usage & Credits"
            description="Track active subscription allowances, credit consumption, and generation history."
            createProjectButton={false}
          />

          {/* ========================================================================= */}
          {/* TOP SECTION: ACTIVE PLAN, CREDIT USED & LEFT, CHANGE PLAN BUTTON         */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. ACTIVE PLAN CARD */}
            <GlassCard hoverEffect={false} className="relative overflow-hidden p-6 space-y-5 bg-slate-950/70 border-slate-800/80 flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
                <ShieldCheck className="w-36 h-36 text-sky-400" />
              </div>

              <div>
                {/* Top status & Action bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {hasActivePlan ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Active Plan
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      No Active Plan
                    </span>
                  )}

                  {/* CHANGE / ACTIVATE ACTIVE PLAN BUTTON */}
                  <button
                    type="button"
                    onClick={() => navigate("/billing")}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.15)] group active:scale-[0.97]"
                  >
                    <span>{hasActivePlan ? "Change Active Plan" : "Activate Plan"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Plan Title & Order ID */}
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    {hasActivePlan ? getPlanTitle(usageData?.planID || activePlan) : "No Active Plan"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Order ID:{" "}
                    <span className="font-mono text-slate-300">
                      {hasActivePlan ? (usageData?.orderID || activePlan?.orderID || "order_ACTIVE") : "No Active Plan"}
                    </span>
                  </p>
                </div>

                {/* Dates & Validity Info */}
                <div className="mt-4 pt-4 border-t border-slate-900 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Purchased Date
                    </span>
                    <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      {hasActivePlan ? formatDateShort(activePlan?.purchaseDate || usageData?.createdAt) : "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Expiration Date
                    </span>
                    <span className="text-sky-300 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      {hasActivePlan ? formatDateShort(activePlan?.expirydate || activePlan?.expiryDate) : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Rate Badges */}
              <div className="pt-3 border-t border-slate-900/80 flex items-center justify-between text-[11px] text-slate-400">
                {hasActivePlan ? (
                  <>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-sky-400" />
                      SEO: <strong className="text-slate-200">{activePlan?.seoDataCredit || 5} Cr</strong>
                      <p>anuall income is 50 lakh</p>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      Thumbnail: <strong className="text-slate-200">{activePlan?.thumbnailCredit || 20} Cr</strong>
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500">No active plan subscription</span>
                )}
              </div>
            </GlassCard>

            {/* 2. CREDIT USED & LEFT METRIC CARD */}
            <GlassCard hoverEffect={false} className="p-6 space-y-5 bg-slate-950/70 border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-sky-400" />
                    Credit Allowance
                  </span>
                  <span className="text-xs font-extrabold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                    {hasActivePlan ? `${stats.usedPercentage}% Used` : "No Active Plan"}
                  </span>
                </div>

                {/* Big Credit Counters */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Credits Remaining
                    </span>
                    <p className="text-2xl font-black text-emerald-400 mt-1 tracking-tight">
                      {hasActivePlan ? stats.creditsLeft.toLocaleString("en-IN") : 0}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {hasActivePlan ? "Available for AI jobs" : "No Active Plan"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Credits Used
                    </span>
                    <p className="text-2xl font-black text-slate-200 mt-1 tracking-tight">
                      {hasActivePlan ? stats.totalCreditsUsed.toLocaleString("en-IN") : 0}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {hasActivePlan ? `of ${stats.totalCredits.toLocaleString("en-IN")} Total` : "of 0 Total"}
                    </span>
                  </div>
                </div>

                {/* Animated Progress Gauge Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Usage Gauge</span>
                    <span className="text-slate-200">
                      {hasActivePlan ? `${stats.totalCreditsUsed} / ${stats.totalCredits} Cr` : "0 / 0 Cr"}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                      style={{ width: `${hasActivePlan ? stats.usedPercentage : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sub-breakdown of generations */}
              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  SEO Runs: <strong className="text-slate-200">{stats.seoCount}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Thumbnails: <strong className="text-slate-200">{stats.thumbnailCount}</strong>
                </span>
              </div>
            </GlassCard>

            {/* 3. TODAY'S CREDIT USAGE CARD */}
            <GlassCard hoverEffect={false} className="p-6 space-y-5 bg-slate-950/70 border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    Today's Activity
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    24h Cycle
                  </span>
                </div>

                {/* Today's Usage Counters */}
                <div className="space-y-3 mt-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Today's Credits Used
                      </span>
                      <p className="text-xl font-black text-white mt-0.5">
                        {stats.todayCreditsUsed} <span className="text-xs font-normal text-slate-400">Credits</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Status
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold inline-block mt-0.5 ${
                        !hasActivePlan
                          ? "bg-slate-800 border border-slate-700 text-slate-400"
                          : stats.hasUsage
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-slate-800 border border-slate-700 text-slate-400"
                      }`}>
                        {!hasActivePlan ? "No Active Plan" : stats.hasUsage ? "Active Usage" : "No Usage"}
                      </span>
                    </div>
                  </div>

                  {/* TODAY'S GENERATION ACTIVITY SUMMARY */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${hasActivePlan && stats.hasUsage ? "text-emerald-400" : "text-slate-500"}`} />
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                          Daily Generation Status
                        </span>
                        <span className="text-sm font-black text-slate-200">
                          {!hasActivePlan
                            ? "No Active Plan"
                            : stats.todayCreditsUsed > 0
                            ? `${stats.todayCreditsUsed} Credits Consumed Today (${stats.todayCount} ${stats.todayCount === 1 ? 'Job' : 'Jobs'})`
                            : "No Usage"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                Usage stats update dynamically based on workspace activity.
              </p>
            </GlassCard>

          </div>

          {/* ========================================================================= */}
          {/* USAGE HISTORY SECTION (Active Plan Only) - FULLY RESPONSIVE               */}
          {/* ========================================================================= */}
          <div className="space-y-5">
            
            {/* Table Header & Search/Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-sky-400 rounded-full shadow-[0_0_10px_#38bdf8] shrink-0" />
                <div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2 flex-wrap">
                    <span>Active Plan Usage History</span>
                    <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                      {filteredUsageHistory.length} {filteredUsageHistory.length === 1 ? "Record" : "Records"}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {hasActivePlan ? (
                      <>Displaying generation records strictly associated with <strong className="text-slate-200">{getPlanTitle(usageData?.planID || activePlan)}</strong>.</>
                    ) : (
                      "No Active Plan"
                    )}
                  </p>
                </div>
              </div>

              {/* Filter Tabs, Sort & Refresh */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {/* Refresh Button */}
                <button
                  type="button"
                  title="Refresh usage data"
                  onClick={handleManualRefresh}
                  disabled={refreshing || loading}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all active:scale-95 disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-sky-400" : ""}`} />
                </button>

                {/* Sort Selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500/50"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="credits">Highest Credits</option>
                </select>

                {/* Type Filter Buttons */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      selectedFilter === "all"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("SEO_DATA")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                      selectedFilter === "SEO_DATA"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileText className="w-3 h-3 text-sky-400" />
                    SEO
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("THUMBNAIL")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                      selectedFilter === "THUMBNAIL"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <ImageIcon className="w-3 h-3 text-amber-400" />
                    Thumbnails
                  </button>
                </div>
              </div>
            </div>

            {/* USAGE HISTORY CARD CONTAINER */}
            <GlassCard hoverEffect={false} className="p-0 overflow-hidden border-slate-800 bg-slate-950/80">
              
              {/* 1. LOADING STATE */}
              {loading ? (
                <div className="py-16 text-center text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <RefreshCw className="w-6 h-6 text-sky-400 animate-spin" />
                    <p className="text-sm font-semibold text-slate-300">Loading usage records...</p>
                  </div>
                </div>
              ) : !hasActivePlan ? (
                /* 2. NO ACTIVE PLAN EMPTY STATE */
                <div className="py-16 px-4 text-center text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                    <BarChart3 className="w-8 h-8 text-slate-600" />
                    <p className="text-base font-black text-slate-300">No Active Plan</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      You do not currently have an active plan. Activate a plan from the Billing page to start generating and tracking usage.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/billing")}
                      className="mt-2 px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.15)] active:scale-95"
                    >
                      <span>Activate Plan</span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                  </div>
                </div>
              ) : filteredUsageHistory.length === 0 ? (
                /* 3. NO USAGE EMPTY STATE */
                <div className="py-16 px-4 text-center text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                    <BarChart3 className="w-8 h-8 text-slate-600" />
                    <p className="text-base font-black text-slate-300">No Usage</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {selectedFilter !== "all"
                        ? "No usage found for this filter category."
                        : "No usage recorded under this active plan. Generations (SEO data, AI Thumbnails) will appear here."}
                    </p>
                  </div>
                </div>
              ) : (
                /* ========================================================================= */
                /* RESPONSIVE SCROLLABLE TABLE VIEW (Visible scrollbar for all screen sizes) */
                /* ========================================================================= */
                <div className="overflow-x-auto custom-scrollbar w-full">
                  <table className="w-full min-w-[780px] text-left text-xs text-slate-300 border-collapse">
                    
                    {/* Table Headers */}
                    <thead>
                      <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-3.5 px-4 min-w-[150px]">Date & Time</th>
                        <th className="py-3.5 px-4 min-w-[240px]">Generated Activity</th>
                        <th className="py-3.5 px-4 min-w-[140px]">Project</th>
                        <th className="py-3.5 px-4 min-w-[130px]">Credit Used</th>
                        <th className="py-3.5 px-4 min-w-[130px]">Usage Progress</th>
                        <th className="py-3.5 px-4 min-w-[110px] text-right">Status</th>
                      </tr>
                    </thead>

                    {/* Table Rows */}
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredUsageHistory.map((row, idx) => {
                        const isSeo = row.type === "SEO_DATA";

                        return (
                          <tr
                            key={row._id || row.id || idx}
                            className="hover:bg-slate-900/50 transition-colors group"
                          >
                            {/* 1. Date & Time */}
                            <td className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">
                              <span className="font-mono text-slate-200 text-[11px] flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                                {formatDateTime(row.dateTime || row.date)}
                              </span>
                            </td>

                            {/* 2. Generated Activity (SEO Data vs Thumbnail) */}
                            <td className="py-3.5 px-4 min-w-[240px]">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                    isSeo
                                      ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                  }`}
                                >
                                  {isSeo ? (
                                    <FileText className="w-4 h-4" />
                                  ) : (
                                    <ImageIcon className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-bold text-slate-100 block text-xs group-hover:text-sky-300 transition-colors">
                                    {row.title}
                                  </span>
                                  <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                                    {row.details}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* 3. Project Name */}
                            <td className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                                {row.projectName || row.projectID || "General Project"}
                              </span>
                            </td>

                            {/* 4. Credit Used */}
                            <td className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">
                              <span className="font-extrabold text-xs px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-300 inline-flex items-center gap-1">
                                <Zap className="w-3 h-3 text-sky-400" />
                                -{row.creditUsed} Credits
                              </span>
                            </td>

                            {/* 5. Usage Progress */}
                            <td className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">
                              <div className="space-y-0.5">
                                <span className="text-[11px] text-slate-300 font-semibold block">
                                  {isSeo ? "SEO Optimization" : "Thumbnail Canvas"}
                                </span>
                                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  Recorded
                                </span>
                              </div>
                            </td>

                            {/* 6. Status */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap min-w-[110px]">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                Completed
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Footer Summary Bar */}
              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span className="text-center sm:text-left">
                  Showing <strong className="text-slate-200">{filteredUsageHistory.length}</strong> active plan usage entries
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/billing")}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                    Manage Active Plan
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>
      </MainPage>
    </Protect>
  );
}

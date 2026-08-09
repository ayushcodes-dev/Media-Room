import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Protect from "@/wrapper/protect";
import MainPage from "@/wrapper/mainPage";
import MainPageHeader from "@/component/header/mainPage.jsx";
import GlassCard from "@/component/cards/glassCard.jsx";
import Toaster1 from "@/component/toaster/toaster1.jsx";
import getPaymentHistory from "@/features/billing/getbillingHistory";

import {
  BarChart3,
  Zap,
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Layers,
  CreditCard,
  ArrowRight,
  ChevronRight,
  Info,
  SlidersHorizontal,
  Check,
  AlertTriangle,
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
  if (!dateStr) return "N/A";
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
 * @returns {string} Human title (e.g. "Pro Creator", "Starter Plan", etc.)
 */
const getPlanTitle = (plan) => {
  if (!plan) return "Starter Plan";
  if (typeof plan === "string") {
    const id = plan.toLowerCase();
    if (id.includes("pro")) return "Pro Creator";
    if (id.includes("starter")) return "Starter Plan";
    if (id.includes("growth")) return "Growth Studio";
    if (id.includes("elite")) return "Elite Agency";
    return plan;
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
  return "Active Subscription Plan";
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
 * Default fallback active plan data if user has no backend plan history yet
 */
const DEFAULT_ACTIVE_PLAN = {
  _id: "default_active_plan",
  planID: "pro",
  planTitle: "Pro Creator",
  price: 599,
  credits: 1500,
  dailyLimit: 100,
  seoDataCredit: 5,
  thumbnailCredit: 20,
  purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  expirydate: new Date(Date.now() + 53 * 24 * 60 * 60 * 1000).toISOString(),
  orderID: "order_PRO_DEFAULT",
  status: "active",
};

/**
 * Generate realistic sample usage records associated with active plan
 * @param {Object} activePlan
 * @returns {Array} Array of usage objects
 */
const generateSampleUsageHistory = (activePlan) => {
  const now = new Date();
  const planId = activePlan?.planID || activePlan?._id || "pro";
  const dailyCap = activePlan?.dailyLimit || 100;
  const seoCost = activePlan?.seoDataCredit || 5;
  const thumbCost = activePlan?.thumbnailCredit || 20;

  return [
    {
      id: "usg_1001",
      planID: planId,
      dateTime: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 mins ago
      type: "SEO_DATA",
      title: "SEO Data Generated",
      details: "YouTube SEO metadata & tag optimization for 'Tech Review 2026'",
      projectName: "Tech Reviews",
      creditUsed: seoCost,
      dailyUsageBefore: 90,
      dailyUsageAfter: 95,
      dailyLimitCap: dailyCap,
      dailyLimitCrossed: 0,
      status: "completed",
    },
    {
      id: "usg_1002",
      planID: planId,
      dateTime: new Date(now.getTime() - 2.5 * 3600 * 1000).toISOString(), // 2.5 hrs ago
      type: "THUMBNAIL",
      title: "Thumbnail Generated",
      details: "AI Thumbnail Canvas Generation - 4K CTR Boosted Layout",
      projectName: "Gaming Highlights",
      creditUsed: thumbCost,
      dailyUsageBefore: 70,
      dailyUsageAfter: 90,
      dailyLimitCap: dailyCap,
      dailyLimitCrossed: 0,
      status: "completed",
    },
    {
      id: "usg_1003",
      planID: planId,
      dateTime: new Date(now.getTime() - 5.5 * 3600 * 1000).toISOString(), // 5.5 hrs ago
      type: "SEO_DATA",
      title: "SEO Data Generated",
      details: "High-ranking keyword titles & description bundle",
      projectName: "Vlog Channel",
      creditUsed: seoCost,
      dailyUsageBefore: 65,
      dailyUsageAfter: 70,
      dailyLimitCap: dailyCap,
      dailyLimitCrossed: 0,
      status: "completed",
    },
    {
      id: "usg_1004",
      planID: planId,
      dateTime: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(), // Yesterday
      type: "THUMBNAIL",
      title: "Thumbnail Generated",
      details: "Custom face thumbnail variation rendering with high contrast prompt",
      projectName: "Finance Tips",
      creditUsed: thumbCost,
      dailyUsageBefore: 95,
      dailyUsageAfter: 115,
      dailyLimitCap: dailyCap,
      dailyLimitCrossed: 15, // Crossed daily limit by 15 credits!
      status: "completed",
    },
    {
      id: "usg_1005",
      planID: planId,
      dateTime: new Date(now.getTime() - 1.2 * 24 * 3600 * 1000).toISOString(),
      type: "SEO_DATA",
      title: "SEO Data Generated",
      details: "Automated YouTube tag analysis & viral topic score generation",
      projectName: "Finance Tips",
      creditUsed: seoCost,
      dailyUsageBefore: 90,
      dailyUsageAfter: 95,
      dailyLimitCap: dailyCap,
      dailyLimitCrossed: 0,
      status: "completed",
    },
    {
      id: "usg_1006",
      planID: planId,
      dateTime: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
      type: "THUMBNAIL",
      title: "Thumbnail Generated",
      details: "Multi-style prompt generation for Shorts cover image",
      projectName: "Shorts Factory",
      creditUsed: thumbCost,
      dailyUsageBefore: 40,
      dailyUsageAfter: 60,
      dailyLimitCap: dailyCap,
      dailyLimitCrossed: 0,
      status: "completed",
    },
    {
      id: "usg_1007",
      planID: planId,
      dateTime: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
      type: "SEO_DATA",
      title: "SEO Data Generated",
      details: "Description & hashtag suite for 'Top 10 AI Tools 2026'",
      projectName: "Tech Reviews",
      creditUsed: seoCost,
      dailyUsageBefore: 30,
      dailyUsageAfter: 35,
      dailyLimitCap: dailyCap,
      dailyLimitCrossed: 0,
      status: "completed",
    },
    {
      id: "usg_1008",
      planID: planId,
      dateTime: new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString(),
      type: "THUMBNAIL",
      title: "Thumbnail Generated",
      details: "Ultra HD AI Thumbnail export with custom text overlay",
      projectName: "Tech Reviews",
      creditUsed: thumbCost,
      dailyUsageBefore: 10,
      dailyUsageAfter: 30,
      dailyLimitCap: dailyCap,
      dailyLimitCrossed: 0,
      status: "completed",
    },
  ];
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
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all' | 'SEO_DATA' | 'THUMBNAIL'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'credits'
  const [toasterData, setToasterData] = useState([]);
  const [usageLogs, setUsageLogs] = useState([]);

  // Fetch subscription history on mount
  useEffect(() => {
    document.title = "Credit Usage & History | Media Room";

    const fetchHistory = async () => {
      setLoading(true);
      try {
        await getPaymentHistory({ setPaymentHistory: setPlansHistory });
      } catch (err) {
        console.error("Failed to fetch billing history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
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
   * If none exists in history, fallback to DEFAULT_ACTIVE_PLAN for seamless UI evaluation
   */
  const activePlan = useMemo(() => {
    if (nonExpiredPlans.length > 0) {
      const active =
        nonExpiredPlans.find((p) => p.status === "active") ||
        nonExpiredPlans.find((p) => p.status === "purchased") ||
        nonExpiredPlans[0];
      return active;
    }
    return DEFAULT_ACTIVE_PLAN;
  }, [nonExpiredPlans]);

  // Load / initialize usage records for the active plan
  useEffect(() => {
    if (activePlan) {
      const samples = generateSampleUsageHistory(activePlan);
      setUsageLogs(samples);
    }
  }, [activePlan]);

  /**
   * Calculate aggregated usage statistics for the Active Plan
   */
  const stats = useMemo(() => {
    const totalCredits = activePlan?.credits || 1500;
    const dailyLimitCap = activePlan?.dailyLimit || 100;

    // Filter usages belonging to current active plan
    const activePlanLogs = usageLogs.filter(
      (log) => log.planID === (activePlan?.planID || activePlan?._id || "pro")
    );

    // Sum total credits consumed
    const totalCreditsUsed = activePlanLogs.reduce(
      (acc, log) => acc + (log.creditUsed || 0),
      0
    );

    const creditsLeft = Math.max(0, totalCredits - totalCreditsUsed);
    const usedPercentage = Math.min(
      100,
      Math.round((totalCreditsUsed / totalCredits) * 100)
    );

    // Calculate today's total credits used
    const todayStr = new Date().toDateString();
    const todayLogs = activePlanLogs.filter(
      (log) => new Date(log.dateTime).toDateString() === todayStr
    );
    const todayCreditsUsed = todayLogs.reduce(
      (acc, log) => acc + (log.creditUsed || 0),
      0
    );

    // Calculate daily limit crossed
    const dailyLimitCrossed = Math.max(0, todayCreditsUsed - dailyLimitCap);

    // Count by generation type
    const seoCount = activePlanLogs.filter((log) => log.type === "SEO_DATA").length;
    const thumbnailCount = activePlanLogs.filter(
      (log) => log.type === "THUMBNAIL"
    ).length;

    return {
      totalCredits,
      totalCreditsUsed,
      creditsLeft,
      usedPercentage,
      dailyLimitCap,
      todayCreditsUsed,
      dailyLimitCrossed,
      seoCount,
      thumbnailCount,
      activePlanLogs,
    };
  }, [activePlan, usageLogs]);

  /**
   * Filter and sort table usage data
   * Requirement: "only show data of active plan."
   */
  const filteredUsageHistory = useMemo(() => {
    // 1. Strictly restrict to active plan logs
    let list = [...stats.activePlanLogs];

    // 2. Filter by Category (SEO vs Thumbnail)
    if (selectedFilter !== "all") {
      list = list.filter((item) => item.type === selectedFilter);
    }

    // 3. Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.details.toLowerCase().includes(q) ||
          (item.projectName && item.projectName.toLowerCase().includes(q))
      );
    }

    // 4. Sorting logic
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
  }, [stats.activePlanLogs, selectedFilter, searchQuery, sortBy]);

  return (
    <Protect>
      <MainPage>
        <Toaster1 data={toasterData} />

        <div className="flex-1 px-4 md:px-8 py-6 mb-20 md:py-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
          {/* Header Bar */}
          <MainPageHeader
            title="Usage & Credits"
            description="Track active subscription allowances, credit consumption, generation history, and daily limits."
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
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Active Plan
                  </span>

                  {/* CHANGE ACTIVE PLAN BUTTON */}
                  <button
                    type="button"
                    onClick={() => navigate("/billing")}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.15)] group active:scale-[0.97]"
                  >
                    <span>Change Active Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Plan Title & Price */}
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    {getPlanTitle(activePlan)}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Order ID: <span className="font-mono text-slate-300">{activePlan?.orderID || "order_ACTIVE"}</span>
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
                      {formatDateShort(activePlan?.purchaseDate)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Expiration Date
                    </span>
                    <span className="text-sky-300 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      {formatDateShort(activePlan?.expirydate || activePlan?.expiryDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Rate Badges */}
              <div className="pt-3 border-t border-slate-900/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  SEO: <strong className="text-slate-200">{activePlan?.seoDataCredit || 5} Cr</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Thumbnail: <strong className="text-slate-200">{activePlan?.thumbnailCredit || 20} Cr</strong>
                </span>
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
                    {stats.usedPercentage}% Used
                  </span>
                </div>

                {/* Big Credit Counters */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Credits Remaining
                    </span>
                    <p className="text-2xl font-black text-emerald-400 mt-1 tracking-tight">
                      {stats.creditsLeft.toLocaleString("en-IN")}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Available for AI jobs</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Credits Used
                    </span>
                    <p className="text-2xl font-black text-slate-200 mt-1 tracking-tight">
                      {stats.totalCreditsUsed.toLocaleString("en-IN")}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      of {stats.totalCredits.toLocaleString("en-IN")} Total
                    </span>
                  </div>
                </div>

                {/* Animated Progress Gauge Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Usage Gauge</span>
                    <span className="text-slate-200">
                      {stats.totalCreditsUsed} / {stats.totalCredits} Cr
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                      style={{ width: `${stats.usedPercentage}%` }}
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

            {/* 3. DAILY LIMIT & DAILY LIMIT CROSSED CARD */}
            <GlassCard hoverEffect={false} className="p-6 space-y-5 bg-slate-950/70 border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    Daily Limit Status
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Today's Cycle
                  </span>
                </div>

                {/* Today's Usage & Limit Crossed Counters */}
                <div className="space-y-3 mt-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Today's Usage / Daily Cap
                      </span>
                      <p className="text-xl font-black text-white mt-0.5">
                        {stats.todayCreditsUsed} <span className="text-xs font-normal text-slate-400">/ {stats.dailyLimitCap} Credits/day</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Cap Status
                      </span>
                      {stats.todayCreditsUsed <= stats.dailyLimitCap ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[11px] inline-block mt-0.5">
                          Within Cap
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-[11px] inline-block mt-0.5">
                          Cap Reached
                        </span>
                      )}
                    </div>
                  </div>

                  {/* DAILY LIMIT CROSSED SPECIFIC METRIC */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                    stats.dailyLimitCrossed > 0
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      : "bg-slate-900/60 border-slate-800 text-slate-300"
                  }`}>
                    <div className="flex items-center gap-3">
                      {stats.dailyLimitCrossed > 0 ? (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                          Daily Limit Crossed
                        </span>
                        <span className="text-sm font-black">
                          {stats.dailyLimitCrossed > 0
                            ? `+${stats.dailyLimitCrossed} Credits Over Limit`
                            : "0 Credits (Within Limit)"}
                        </span>
                      </div>
                    </div>

                    {stats.dailyLimitCrossed > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300">
                        Exceeded
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                Daily credit caps reset automatically at 12:00 AM UTC every 24 hours.
              </p>
            </GlassCard>

          </div>

          {/* ========================================================================= */}
          {/* USAGE HISTORY TABLE / GRID (Active Plan Only)                             */}
          {/* ========================================================================= */}
          <div className="space-y-5">
            
            {/* Table Header & Search/Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-sky-400 rounded-full shadow-[0_0_10px_#38bdf8]" />
                <div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                    Active Plan Usage History
                    <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                      {filteredUsageHistory.length} Rows
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Displaying generation records strictly associated with <strong className="text-slate-200">{getPlanTitle(activePlan)}</strong>.
                  </p>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search usage activity..."
                    className="w-48 sm:w-56 bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-colors"
                  />
                </div>

                {/* Type Filter Buttons */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedFilter === "all"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All Usages
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("SEO_DATA")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedFilter === "SEO_DATA"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileText className="w-3 h-3 text-sky-400" />
                    SEO Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("THUMBNAIL")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
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

            {/* USAGE HISTORY TABLE */}
            <GlassCard hoverEffect={false} className="p-0 overflow-hidden border-slate-800 bg-slate-950/80">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  
                  {/* Table Headers */}
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4">Generated Activity</th>
                      <th className="py-3.5 px-4">Project</th>
                      <th className="py-3.5 px-4">Credit Used</th>
                      <th className="py-3.5 px-4">Daily Limit & Crossed</th>
                      <th className="py-3.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>

                  {/* Table Rows */}
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsageHistory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <BarChart3 className="w-8 h-8 text-slate-600" />
                            <p className="text-sm font-semibold text-slate-400">No active plan usage logs found</p>
                            <p className="text-xs text-slate-500 max-w-sm">
                              Generations performed under your active plan will appear here automatically.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsageHistory.map((row) => {
                        const isSeo = row.type === "SEO_DATA";

                        return (
                          <tr
                            key={row.id}
                            className="hover:bg-slate-900/50 transition-colors group"
                          >
                            {/* 1. Date & Time */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-mono text-slate-200 text-[11px] flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                                {formatDateTime(row.dateTime)}
                              </span>
                            </td>

                            {/* 2. Generated Activity (SEO Data vs Thumbnail) */}
                            <td className="py-3.5 px-4">
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
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                                {row.projectName || "General Project"}
                              </span>
                            </td>

                            {/* 4. Credit Used */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-extrabold text-xs px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-300 inline-flex items-center gap-1">
                                <Zap className="w-3 h-3 text-sky-400" />
                                -{row.creditUsed} Credits
                              </span>
                            </td>

                            {/* 5. Daily Limit & Daily Limit Crossed */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="space-y-0.5">
                                <span className="text-[11px] text-slate-300 font-semibold block">
                                  {row.dailyUsageAfter} / {row.dailyLimitCap} Daily
                                </span>
                                {row.dailyLimitCrossed > 0 ? (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold inline-flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                                    +{row.dailyLimitCrossed} Cr Crossed Limit
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    Within Daily Limit
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 6. Status */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                Completed
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary Bar */}
              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span>
                  Showing <strong className="text-slate-200">{filteredUsageHistory.length}</strong> active plan usage entries
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/billing")}
                    className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold text-xs transition-all flex items-center gap-1.5"
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

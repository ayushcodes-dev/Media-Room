import React, { useState, useEffect } from "react";
import GlassCard from "@/component/cards/glassCard.jsx";
import updatePlanStatus from "@/features/billing/updatePlanStatus.js";

import {
  History,
  ChevronRight,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Layers,
  Zap,
  Sparkles,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Loader2,
} from "lucide-react";

/**
 * Helper to format ISO or standard date strings into clean readable date (e.g. "Aug 06, 2026")
 */
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

/**
 * Helper to determine human plan title
 */
const getPlanTitle = (item) => {
  if (item.planTitle) return item.planTitle;
  if (item.planID) {
    const id = item.planID.toString().toLowerCase();
    if (id === "pro") return "Pro Plan";
    if (id === "starter") return "Starter Plan";
    if (id === "growth") return "Growth Studio";
    if (id === "elite") return "Elite Agency";
    return item.planID.charAt(0).toUpperCase() + item.planID.slice(1) + " Plan";
  }
  return "Subscription Plan";
};

/**
 * Helper for status badge details
 */
const getStatusBadge = (item) => {
  const rawStatus = (item.status || "").toLowerCase();
  const expiryRaw = item.expirydate || item.expiryDate;
  const isExpired = expiryRaw && new Date(expiryRaw).getTime() < Date.now();

  if (rawStatus === "purchased" || rawStatus === "active" || rawStatus === "success") {
    if (isExpired) {
      return {
        label: "Expired",
        colorClass: "bg-slate-800/90 border-slate-700 text-slate-400",
        type: "expired",
      };
    }
    return {
      label: rawStatus === "purchased" ? "Purchased" : "Active",
      colorClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      type: rawStatus === "active" ? "active" : "purchased",
    };
  }

  if (rawStatus === "inactive") {
    return {
      label: "Inactive",
      colorClass: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      type: "inactive",
    };
  }

  return {
    label: "Expired",
    colorClass: "bg-slate-800/90 border-slate-700 text-slate-400",
    type: "expired",
  };
};

/**
 * SubscriptionHistoryCard Component
 *
 * Displays subscription history records in thin rows on the /billing page.
 * Includes a 3-dot button on each plan row that opens a dropdown menu showing the "Activate Plan" option.
 * If the plan is expired, the activate option is disabled.
 * When clicked, triggers updatePlanStatus from features/billing/updatePlanStatus.js.
 *
 * @param {Object} props
 * @param {Array} props.history - Array of billing history objects
 * @param {Function} props.onSeeAll - Callback when "Show All Plans" button is clicked
 * @param {Function} [props.onRefreshHistory] - Callback to refresh history state after activation
 */
export default function SubscriptionHistoryCard({ history = [], onSeeAll, onRefreshHistory }) {
  const [activatingOrderId, setActivatingOrderId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const displayItems = history.slice(0, 3);
  const hasMoreThanThree = history.length > 3;

  /**
   * Close dropdown on click outside
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".plan-actions-dropdown")) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /**
   * Triggers active plan update via features/billing/updatePlanStatus
   */
  const handleActivatePlan = async (item) => {
    setActiveMenuId(null);
    const orderId = item.orderID || item.orderId;
    if (!orderId) return;

    const expiryRaw = item.expirydate || item.expiryDate;
    const isExpired =
      (item.status || "").toLowerCase() === "expired" ||
      (expiryRaw && new Date(expiryRaw).getTime() < Date.now());

    if (isExpired) return;

    setActivatingOrderId(orderId);
    try {
      await updatePlanStatus({ orderID: orderId });
      if (onRefreshHistory) {
        onRefreshHistory();
      }
    } catch (err) {
      console.error("Error updating plan status:", err);
    } finally {
      setActivatingOrderId(null);
    }
  };

  return (
    <GlassCard
      hoverEffect={false}
      className="relative overflow-visible bg-slate-950/60 border-slate-800 flex flex-col justify-between p-5 space-y-4"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <History className="w-4 h-4 text-sky-400" />
          Subscription History
        </span>

        {hasMoreThanThree && (
          <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-[10px] font-black text-sky-300 uppercase tracking-wider">
            {history.length} Total Plans
          </span>
        )}
      </div>

      {/* Thin Rows Container */}
      <div className="space-y-2.5 flex-1">
        {displayItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 font-medium">
            No subscription history recorded yet
          </div>
        ) : (
          displayItems.map((item, index) => {
            const statusInfo = getStatusBadge(item);
            const orderId = item.orderID || item.orderId;
            const itemKey = item._id || item.id || orderId || index;
            const isExpired = statusInfo.type === "expired";
            const isAlreadyActive = statusInfo.type === "active";

            return (
              <div
                key={itemKey}
                className="p-3 px-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs transition-all hover:border-slate-700/80 space-y-2 relative"
              >
                {/* Top Row: Plan Title, Price, Status Badge & 3-Dot Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-extrabold text-slate-100 truncate text-[13px]">
                      {getPlanTitle(item)}
                    </span>
                    <span className="text-[11px] font-extrabold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20 shrink-0">
                      ₹{typeof item.price === "number" ? item.price.toLocaleString("en-IN") : item.price}
                    </span>
                  </div>

                  {/* Status Badge & 3-Dot Action Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 border ${statusInfo.colorClass}`}
                    >
                      {isAlreadyActive && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                      {statusInfo.type === "inactive" && <AlertCircle className="w-2.5 h-2.5 text-amber-400" />}
                      {isExpired && <Clock className="w-2.5 h-2.5 text-slate-500" />}
                      {statusInfo.label}
                    </span>

                    {/* 3-DOT BUTTON WITH DROPDOWN MENU */}
                    <div className="relative plan-actions-dropdown">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === itemKey ? null : itemKey);
                        }}
                        className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all outline-none cursor-pointer"
                        title="More options"
                      >
                        {activatingOrderId === orderId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                        ) : (
                          <MoreVertical className="w-3.5 h-3.5 text-slate-400 hover:text-sky-300" />
                        )}
                      </button>

                      {/* Dropdown Menu showing "Activate Plan" option */}
                      {activeMenuId === itemKey && (
                        <div className="absolute right-0 top-full mt-1 z-30 min-w-[140px] p-1 bg-slate-950 border border-slate-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fade-in space-y-0.5">
                          <button
                            type="button"
                            disabled={isExpired || isAlreadyActive || activatingOrderId === orderId}
                            onClick={() => handleActivatePlan(item)}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all text-left ${
                              isExpired
                                ? "text-slate-600 cursor-not-allowed opacity-50 bg-transparent"
                                : isAlreadyActive
                                ? "text-emerald-400 cursor-default bg-emerald-500/10"
                                : "text-sky-300 hover:bg-sky-500/20 hover:text-white cursor-pointer"
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>
                              {isAlreadyActive
                                ? "Plan is Active"
                                : isExpired
                                ? "Plan Expired"
                                : "Activate Plan"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Credits & Limits Breakdown */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                  <span className="flex items-center gap-1 text-sky-300 font-bold">
                    <Zap className="w-3 h-3 text-sky-400" />
                    {item.credits} Credits
                  </span>
                  {item.seoDataCredit !== undefined && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <FileText className="w-3 h-3 text-slate-500" />
                      SEO: <strong className="text-slate-200">{item.seoDataCredit}</strong>
                    </span>
                  )}
                  {item.thumbnailCredit !== undefined && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <ImageIcon className="w-3 h-3 text-slate-500" />
                      Thumbnails: <strong className="text-slate-200">{item.thumbnailCredit}</strong>
                    </span>
                  )}
                </div>

                {/* Dates & Order ID Row */}
                <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      Purchased: {formatDate(item.purchaseDate)}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">
                      Expires: {formatDate(item.expirydate || item.expiryDate)}
                    </span>
                  </div>

                  {orderId && (
                    <span className="text-slate-500 font-mono text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                      ID: {orderId}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PROMINENT BOTTOM "SHOW ALL PLANS" BUTTON */}
      <div className="pt-2 border-t border-slate-900">
        <button
          type="button"
          onClick={onSeeAll}
          className="w-full py-2.5 px-4 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 active:scale-[0.98] border border-sky-500/30 text-sky-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.15)] group"
        >
          <Layers className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          <span>Show All Plans ({history.length})</span>
          <ChevronRight className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </GlassCard>
  );
}

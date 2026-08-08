import React from "react";
import {
  X,
  History,
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Hash,
} from "lucide-react";
import GlassCard from "@/component/cards/glassCard.jsx";
import { NeonButton2 } from "@/component/button/neonButton.jsx";

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
      type: "active",
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
 * SubscriptionHistoryModal Component
 *
 * Popup modal displaying all subscription plans and history in clean, thin rows.
 * Matches the neon glassmorphism dark mode design system.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Array} props.history - Full list of history records
 * @param {Function} props.onClose - Callback to close the modal
 */
export default function SubscriptionHistoryModal({ isOpen, history = [], onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
      {/* Darkened Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl mx-auto z-50 transform transition-all duration-300 animate-slide-up">
        <GlassCard
          hoverEffect={false}
          className="relative bg-slate-950/95 border-sky-500/30 shadow-[0_0_50px_rgba(14,165,233,0.2)] p-6 md:p-7 rounded-3xl border"
        >
          {/* Top Glow Accent Bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_12px_#38bdf8]" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  All Subscription History
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Complete record of past credit purchases and active plans ({history.length} records)
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

          {/* HISTORY THIN ROWS LIST */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 font-medium">
                No subscription history recorded yet
              </div>
            ) : (
              history.map((item, index) => {
                const statusBadge = getStatusBadge(item);
                const orderId = item.orderID || item.orderId;

                return (
                  <div
                    key={item._id || item.id || index}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col space-y-2.5 text-xs hover:border-slate-700/80 transition-all"
                  >
                    {/* Top Row: Plan Title & Price + Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-extrabold text-white">
                          {getPlanTitle(item)}
                        </span>
                        <span className="font-extrabold text-sky-400 text-xs bg-sky-500/10 px-2.5 py-0.5 rounded-lg border border-sky-500/20">
                          ₹{typeof item.price === "number" ? item.price.toLocaleString("en-IN") : item.price}
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border ${statusBadge.colorClass}`}
                      >
                        {statusBadge.type === "active" && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {statusBadge.type === "inactive" && <AlertCircle className="w-3 h-3 text-amber-400" />}
                        {statusBadge.type === "expired" && <Clock className="w-3 h-3 text-slate-500" />}
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Middle Row: Credit Breakdown & Allowances */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                      <span className="flex items-center gap-1 text-sky-300 font-bold">
                        <Zap className="w-3.5 h-3.5 text-sky-400" />
                        {item.credits} Total Credits
                      </span>
                      {item.dailyLimit !== undefined && (
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          {item.dailyLimit}/day limit
                        </span>
                      )}
                      {item.seoDataCredit !== undefined && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          SEO: <strong className="text-white">{item.seoDataCredit}</strong>
                        </span>
                      )}
                      {item.thumbnailCredit !== undefined && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                          Thumbnails: <strong className="text-white">{item.thumbnailCredit}</strong>
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: Purchase Date, Expiry Date & Order ID */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          Purchased: {formatDate(item.purchaseDate)}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">
                          Expires: {formatDate(item.expirydate || item.expiryDate)}
                        </span>
                      </div>

                      {orderId && (
                        <span className="flex items-center gap-1 text-slate-500 font-mono text-[10px] bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                          <Hash className="w-3 h-3 text-slate-600" />
                          {orderId}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Subscription Logs</span>
            </div>

            <NeonButton2
              variant="secondary"
              onClick={onClose}
              className="py-2 px-4 text-xs font-bold"
            >
              Close
            </NeonButton2>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}


import React from "react";
import GlassCard from "@/component/cards/glassCard.jsx";
import NeonButton, { NeonButton2 } from "@/component/button/neonButton.jsx";
import { AlertTriangle, Trash2, X, ShieldAlert } from "lucide-react";

/**
 * DeleteConfirmModal Component
 *
 * Responsive, themed confirmation popup shown before deleting a project.
 * Warns the user that once deleted, the project cannot be regained.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {string} [props.projectName] - Name of the project to delete
 * @param {Function} props.onClose - Callback to close/cancel the modal
 * @param {Function} props.onConfirm - Callback to confirm project deletion
 * @param {boolean} [props.isDeleting] - Loading state during deletion
 */
export default function DeleteConfirmModal({
  isOpen,
  projectName = "this project",
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
      {/* Darkened Backdrop Overlay with Blur */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Popup Container */}
      <div className="relative w-full max-w-md mx-auto z-50 transform transition-all duration-300 ease-out animate-scale-up">
        <GlassCard
          hoverEffect={false}
          className="relative bg-slate-950/95 border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.25)] p-6 md:p-7 rounded-3xl border"
        >
          {/* Top Neon Glowing Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full shadow-[0_0_12px_#f43f5e]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Header Circle */}
          <div className="relative mx-auto mt-2 mb-5 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping opacity-60" />
            <div className="absolute inset-0 rounded-full bg-rose-500/10 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.4)]" />
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center shadow-lg shadow-rose-500/40">
              <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[2.5]" />
            </div>
          </div>

          {/* Modal Header & Title */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Confirm Permanent Deletion</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Delete Project?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 inline-block my-0.5 break-all">
                "{projectName}"
              </span>
              ?
            </p>
          </div>

          {/* Warning Message Box */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs mb-6 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-[11px] sm:text-xs leading-relaxed">
              <strong className="font-extrabold text-rose-100 uppercase tracking-wider block mb-0.5">
                Warning: Irreversible Action
              </strong>
              <span>
                Once deleted, it cannot be regained. All generated metadata, SEO tags, and thumbnails for this project will be permanently erased.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <NeonButton2
              variant="secondary"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 text-xs sm:text-sm font-bold border-slate-800 hover:bg-slate-900"
            >
              Cancel
            </NeonButton2>

            <NeonButton2
              variant="danger"
              onClick={onConfirm}
              disabled={isDeleting}
              icon={Trash2}
              className="flex-1 py-3 text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(244,63,94,0.4)]"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </NeonButton2>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

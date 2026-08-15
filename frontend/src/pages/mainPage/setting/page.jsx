import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Protect from "@/wrapper/protect";
import MainPage from "@/wrapper/mainPage";
import MainPageHeader from "@/component/header/mainPage.jsx";
import GlassCard from "@/component/cards/glassCard.jsx";
import { NeonButton2 } from "@/component/button/neonButton.jsx";
import copyToClipboard from "@/utility/copyToClipboard.js";
import handleUserSignout from "@/features/auth/signout.auth.js";
import handleUserDeleteAccount from "@/features/auth/deleteAccount.auth.js";
import {
  ShieldAlert,
  AlertTriangle,
  LogOut,
  Trash2,
  X,
  Check,
  Copy,
  User,
  Mail,
  Fingerprint,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

/**
 * Settings Page Component (MainPage Settings Section)
 *
 * Provides comprehensive account settings and security controls:
 * 1. Profile Information (Avatar, Username, Email, User ID with quick-copy).
 * 2. System & Application Preferences.
 * 3. Security & Session controls with Logout button and confirmation dialog.
 * 4. Danger Zone with Permanent Account Deletion, strict double-reconfirmation modal.
 */
export default function SettingPage() {
  const navigate = useNavigate();

  // User state initialized from localStorage & synced session
  const [userData] = useState(() => {
    const defaultData = {
      username: "Creator",
      email: "creator@tubenix.ai",
      userID: "usr_active_session",
      role: "user",
      isAuthenticated: true,
    };

    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user_auth") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          return {
            ...defaultData,
            ...parsed,
          };
        }
      }
    } catch (e) {
      console.error("Failed to parse user auth cache", e);
    }
    return defaultData;
  });

  const [copiedId, setCopiedId] = useState(false);

  // Modal visibility states
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Action loading states
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Delete reconfirmation input & checkbox
  const [confirmInput, setConfirmInput] = useState("");
  const [hasAcknowledgedLoss, setHasAcknowledgedLoss] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Set document title on mount
  useEffect(() => {
    document.title = "Account Settings | Media Room";
  }, []);

  // Copy User ID
  const handleCopyUserID = () => {
    if (userData.userID) {
      copyToClipboard(userData.userID);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Execute Logout
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await handleUserSignout();
      setIsLogoutModalOpen(false);
      navigate("/auth/signin", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/auth/signin", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Execute Account Deletion
  const handleConfirmDeleteAccount = async () => {
    if (!hasAcknowledgedLoss) {
      setErrorMessage("Please check the acknowledgment box to proceed.");
      return;
    }

    if (confirmInput.trim().toUpperCase() !== "DELETE") {
      setErrorMessage('Please type "DELETE" in uppercase to confirm.');
      return;
    }

    setErrorMessage("");
    setIsDeletingAccount(true);

    try {
      const res = await handleUserDeleteAccount();
      if (res && res.success) {
        setIsDeleteModalOpen(false);
        navigate("/auth/signup", { replace: true });
      } else {
        setErrorMessage(res?.message || "Failed to delete account. Please try again.");
      }
    } catch (err) {
      console.error("Account deletion failed:", err);
      setErrorMessage("An unexpected error occurred during account deletion.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Open Delete Modal with reset states
  const handleOpenDeleteModal = () => {
    setConfirmInput("");
    setHasAcknowledgedLoss(false);
    setErrorMessage("");
    setIsDeleteModalOpen(true);
  };

  return (
    <Protect>
      <MainPage>
        <div className="flex-1 px-4 md:px-8 py-6 mb-20 md:py-8 max-w-5xl mx-auto w-full space-y-8 animate-fade-in">
          {/* Header Bar */}
          <MainPageHeader
            title="Account & Settings"
            description="Manage your account profile, workspace credentials, security preferences, and data options."
            createProjectButton={false}
          />

          {/* ========================================================================= */}
          {/* 1. PROFILE & ACCOUNT CREDENTIALS SECTION                                  */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-sky-400 rounded-full shadow-[0_0_10px_#38bdf8]" />
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" />
                Profile & Identification
              </h2>
            </div>

            <GlassCard hoverEffect={false} className="p-6 md:p-8 bg-slate-950/80 border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-900">
                {/* User Avatar + Name Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-[2px] shadow-lg shadow-sky-500/20">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] overflow-hidden flex items-center justify-center p-1.5">
                        <img
                          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                            userData.username || userData.email || "Creator"
                          )}`}
                          alt="avatar"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-[0_0_8px_#10b981]" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {userData.username || "Creator"}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-[10px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        {userData.role ? userData.role.toUpperCase() : "CREATOR"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {userData.email || "creator@tubenix.ai"}
                    </p>
                  </div>
                </div>

                {/* Account Status Badge */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 bg-slate-900/60 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Account Status
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Active & Verified
                  </span>
                </div>
              </div>

              {/* Account Credential Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* User ID Field */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5 text-sky-400" />
                      Unique User ID
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUserID}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                      {copiedId ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-slate-200 text-xs truncate select-all">
                    {userData.userID || "usr_34c8bd57-3679-4e0b-9128-2cd8e9f8510e"}
                  </p>
                </div>

                {/* Email Address Field */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    Registered Email
                  </span>
                  <p className="font-semibold text-slate-200 text-xs truncate">
                    {userData.email || "creator@tubenix.ai"}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ========================================================================= */}
          {/* 2. SESSION & SECURITY MANAGEMENT (LOGOUT)                                */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b]" />
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <LogOut className="w-4 h-4 text-amber-400" />
                Session & Security
              </h2>
            </div>

            <GlassCard hoverEffect={false} className="p-6 bg-slate-950/80 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-100">
                  Active Session
                </h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Signed in on this browser. Logging out will clear your local authorization session and require credentials to sign back in.
                </p>
              </div>

              {/* LOGOUT ACTION BUTTON */}
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.15)] active:scale-95"
              >
                <LogOut className="w-4 h-4 text-amber-400" />
                <span>Log Out Session</span>
              </button>
            </GlassCard>
          </div>

          {/* ========================================================================= */}
          {/* 4. DANGER ZONE: PERMANENT ACCOUNT DELETION                                 */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]" />
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Danger Zone
              </h2>
            </div>

            <GlassCard hoverEffect={false} className="p-6 md:p-8 bg-rose-950/20 border-rose-500/30 rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-base font-black text-rose-200 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    Delete Account Permanently
                  </h3>
                  <p className="text-xs text-rose-200/70 max-w-xl leading-relaxed">
                    Permanently delete your account and all associated workspace data. This includes all created video projects, generated SEO metadata, tags, AI thumbnails, billing history, and remaining credit balances. 
                    <strong className="text-rose-200 font-bold block mt-1">This action cannot be undone.</strong>
                  </p>
                </div>

                {/* DELETE ACCOUNT BUTTON */}
                <button
                  type="button"
                  onClick={handleOpenDeleteModal}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.35)] active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* LOGOUT CONFIRMATION MODAL                                                 */}
        {/* ========================================================================= */}
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-fade-in"
              onClick={() => !isLoggingOut && setIsLogoutModalOpen(false)}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-md mx-auto z-50 animate-scale-up">
              <GlassCard hoverEffect={false} className="p-6 sm:p-7 bg-slate-950 border-amber-500/30 rounded-3xl space-y-6 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  disabled={isLoggingOut}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Icon Circle */}
                <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                  <LogOut className="w-7 h-7" />
                </div>

                {/* Title & Description */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Confirm Sign Out
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                    Are you sure you want to log out of your account on this device?
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <NeonButton2
                    variant="secondary"
                    onClick={() => setIsLogoutModalOpen(false)}
                    disabled={isLoggingOut}
                    className="flex-1 py-2.5 text-xs font-bold border-slate-800"
                  >
                    Cancel
                  </NeonButton2>

                  <NeonButton2
                    variant="primary"
                    onClick={handleConfirmLogout}
                    disabled={isLoggingOut}
                    icon={LogOut}
                    className="flex-1 py-2.5 text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  >
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </NeonButton2>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PERMANENT ACCOUNT DELETION RECONFIRMATION MODAL                            */}
        {/* ========================================================================= */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
            {/* Dark Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-fade-in"
              onClick={() => !isDeletingAccount && setIsDeleteModalOpen(false)}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg mx-auto z-50 animate-scale-up">
              <GlassCard
                hoverEffect={false}
                className="relative bg-slate-950 border-rose-500/50 shadow-[0_0_60px_rgba(244,63,94,0.3)] p-6 sm:p-8 rounded-3xl border space-y-6"
              >
                {/* Top Glowing Red Accent Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 rounded-full shadow-[0_0_15px_#f43f5e]" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeletingAccount}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Animated Hazard Icon Header */}
                <div className="relative mx-auto mt-1 w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping opacity-60" />
                  <div className="absolute inset-0 rounded-full bg-rose-500/10 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.4)]" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center shadow-lg shadow-rose-500/40">
                    <Trash2 className="w-6 h-6 text-white stroke-[2.5]" />
                  </div>
                </div>

                {/* Modal Title & Warning Header */}
                <div className="text-center space-y-1.5">
                  <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Irreversible Action
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Delete Account Permanently?
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    You are about to permanently purge your account (<span className="text-white font-bold">{userData.email}</span>).
                  </p>
                </div>

                {/* Scope of Deletion List */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-200 space-y-2">
                  <span className="font-extrabold uppercase tracking-wider text-[10px] text-rose-300 block flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    The following resources will be erased immediately:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300 pl-4 list-disc marker:text-rose-400">
                    <li>All video optimization projects and custom metadata</li>
                    <li>Generated YouTube tags, descriptions, and thumbnail prompts</li>
                    <li>Active plan subscriptions, usage records, and remaining credits</li>
                    <li>All stored user profile credentials and active sessions</li>
                  </ul>
                </div>

                {/* Verification & Checkbox Controls */}
                <div className="space-y-4 pt-1">
                  {/* Checkbox Acknowledgment */}
                  <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <input
                      type="checkbox"
                      checked={hasAcknowledgedLoss}
                      onChange={(e) => setHasAcknowledgedLoss(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-rose-500 focus:ring-rose-500/40 bg-slate-950 cursor-pointer"
                    />
                    <span className="text-[11px] leading-relaxed">
                      I understand that this action is <strong className="text-rose-300">permanent</strong> and cannot be restored by support under any circumstances.
                    </span>
                  </label>

                  {/* Typing confirmation input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 block">
                      To confirm, type <span className="font-black text-rose-400 font-mono">DELETE</span> below:
                    </label>
                    <input
                      type="text"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors font-mono tracking-wider"
                    />
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <NeonButton2
                    variant="secondary"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeletingAccount}
                    className="flex-1 py-3 text-xs font-bold border-slate-800"
                  >
                    Cancel
                  </NeonButton2>

                  <NeonButton2
                    variant="danger"
                    onClick={handleConfirmDeleteAccount}
                    disabled={isDeletingAccount || !hasAcknowledgedLoss || confirmInput.trim().toUpperCase() !== "DELETE"}
                    icon={Trash2}
                    className="flex-1 py-3 text-xs font-black shadow-[0_0_20px_rgba(244,63,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isDeletingAccount ? "Purging Account..." : "Permanently Delete"}
                  </NeonButton2>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

      </MainPage>
    </Protect>
  );
}

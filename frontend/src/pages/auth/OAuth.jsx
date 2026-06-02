import { provider_callback } from "@/api/auth";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header2 from "@/component/header/header2";

const DEVELOPER_CONFIG = {
  appName: "CreatorStudio AI",
  defaultErrorReason:
    "Authentication handshake timed out. Check your Google Credentials.",
  redirectDelayMs: 2500, // Time shown in success state before dashboard routing
  handshakeCheckInterval: 80, // Tick speed (ms) for the authenticating progress loader
  initialCountdownSeconds: 10.0, // Starting point for our countdown
  fontUrl:
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap",
};

// handle callback from google for oauth signin
const handleOAuthCallback = async ({
  provider,
  allParams,
  setUser,
  isHandshakeComplete,
  setErrorText,
  setCurrentStep,
  navigate,
}) => {
  if (provider && allParams) {
    const result = await provider_callback({ provider, allParams });

    if (result.success) {
      setUser({ ...result.data });
      isHandshakeComplete.current = true;
      navigate('/dashboard')
      console.log(result.data)
        localStorage.setItem(
          "user_auth",
          JSON.stringify({ ...result.data }),
        );
    } else {
      console.log("handshanke :", isHandshakeComplete);
      if (!isHandshakeComplete.current) {
        setCurrentStep("failed");
        setErrorText(
          result.error.error.message || DEVELOPER_CONFIG.defaultErrorReason,
        );
        console.log("OAuth callback failed:", result.error);
      }
    }
  }
};

const VisualStyleRegistry = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @import url('${DEVELOPER_CONFIG.fontUrl}');
    
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #030712;
      color: #f3f4f6;
    }
    
    .font-scifi {
      font-family: 'Space Grotesk', sans-serif;
    }

    /* Elegant Soft Glow Effects */
    .neon-glow-blue {
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.25), 0 0 8px rgba(56, 189, 248, 0.1);
    }
    
    .neon-text-blue {
      text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
    }

    .neon-border-blue {
      border-color: rgba(56, 189, 248, 0.3);
      box-shadow: inset 0 0 10px rgba(56, 189, 248, 0.1), 0 0 10px rgba(56, 189, 248, 0.05);
    }

    /* Smooth CSS Shimmer */
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
    .animate-shimmer {
      animation: shimmer 2s infinite linear;
    }

    /* Radial Pulse Ring */
    @keyframes pulse-ring {
      0% { transform: scale(0.95); opacity: 0.4; }
      50% { transform: scale(1.05); opacity: 0.7; }
      100% { transform: scale(0.95); opacity: 0.4; }
    }
    .animate-pulse-ring {
      animation: pulse-ring 3s infinite ease-in-out;
    }
  `,
    }}
  />
);

const WaitingCard = ({
  progress,
  countdownTime,
  title = "Authenticating with Google",
  subtitle = "Please wait a few seconds",
  redirectInfo = "Securing Google Accounts authentication. Progress will automatically continue when verification approves.",
}) => {
  return (
    <div className="w-full relative group">
      {/* Soft Ambient Shadow Backdrop */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500/10 to-indigo-500/5 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

      {/* Primary Card Frame */}
      <div className="relative w-full rounded-2xl bg-[#090f23]/80 border border-sky-500/15 backdrop-blur-xl p-8 md:p-12 text-center transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)]">
        {/* Futuristic Concentric Outer Ring - Contains ONLY the pulsing "Authenticating" text */}
        <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-400/20 animate-[spin_40s_linear_infinite]"></div>
          <div className="absolute inset-1.5 rounded-full border border-sky-400/10"></div>
          <div className="absolute inset-3 rounded-full border-t-2 border-r-2 border-sky-400 animate-spin"></div>
          <div className="absolute inset-6 rounded-full border-b-2 border-indigo-400 animate-[spin_3s_linear_infinite_reverse]"></div>

          <div className="z-10 text-center px-2">
            <span className="text-[11px] font-bold font-scifi text-sky-300 tracking-wider uppercase block animate-pulse">
              Authenticating
            </span>
          </div>
        </div>

        {/* Informational Header Titles */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-white font-scifi mb-3 tracking-wide neon-text-blue">
          {title}
        </h2>

        <p className="text-sky-300/80 font-medium text-sm md:text-base max-w-md mx-auto mb-2 animate-pulse">
          {subtitle}
        </p>

        <p className="text-slate-400 text-xs md:text-sm max-w-sm mx-auto mb-8">
          {redirectInfo}
        </p>

        {/* Neon Progress Bar Wrapper */}
        <div className="w-full bg-[#050917] rounded-full h-3 border border-sky-950/80 overflow-hidden p-[2px] relative mb-3">
          <div
            className="bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-500 h-full rounded-full transition-all duration-300 relative shadow-[0_0_10px_rgba(56,189,248,0.4)]"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <div
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer"
                style={{ transform: "translateX(-100%)" }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Details block below progress bar */}
        <div className="flex justify-between items-center px-2 text-[11px] font-semibold font-scifi text-slate-400">
          <div className="flex items-center gap-1 bg-slate-950/40 border border-slate-900 px-2.5 py-1 rounded-md">
            <span>Status:</span>
            <span className="text-sky-400 animate-pulse">{progress}%</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950/40 border border-slate-900 px-2.5 py-1 rounded-md">
            <span>Time Remaining:</span>
            <span className="text-sky-400">{countdownTime}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessCard = ({
  title = "Successfully Signed In With Google",
  subtitle = "Secure authentication complete.",
  redirectMessage = "Redirecting you to dashboard",
}) => {
  return (
    <div className="w-full relative group animate-[fadeIn_0.5s_ease-out]">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/15 to-sky-500/5 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

      <div className="relative w-full rounded-2xl bg-[#08121f]/90 border border-emerald-500/15 backdrop-blur-xl p-8 md:p-12 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
        {/* Animated Checkmark Vector Graphic */}
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 rounded-full mx-auto mb-8 flex items-center justify-center border border-emerald-500/25 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-400/5 animate-pulse-ring rounded-full"></div>

          <svg
            className="h-10 w-10 text-emerald-400 animate-[bounce_1.2s_infinite_alternate]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Dynamic Success Headings */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-white font-scifi mb-3 tracking-wide bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
          {title}
        </h2>

        <p className="text-slate-300 font-medium text-sm md:text-base max-w-md mx-auto mb-1">
          {subtitle}
        </p>

        {/* Spinning Loading Status */}
        <div className="flex items-center justify-center gap-2 mt-8 py-3 px-6 bg-[#040912]/80 border border-emerald-500/10 rounded-full max-w-xs mx-auto">
          <svg
            className="animate-spin h-4 w-4 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest font-scifi animate-pulse">
            {redirectMessage}...
          </span>
        </div>

        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mx-auto mt-8 opacity-70"></div>
      </div>
    </div>
  );
};

const FailedCard = ({
  errorTitle = "Failed to Authenticate with Google",
  errorReason = DEVELOPER_CONFIG.defaultErrorReason,
  onTryAgain,
}) => {
  return (
    <div className="w-full relative group">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-500/10 to-indigo-500/5 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

      <div className="relative w-full rounded-2xl bg-[#140b12]/95 border border-rose-500/15 backdrop-blur-xl p-8 md:p-12 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
        {/* Crisp Error Icon frame with corrected standard sizing */}
        <div className="w-24 h-24 bg-gradient-to-br from-rose-500/5 to-rose-500/15 rounded-full mx-auto mb-8 flex items-center justify-center border border-rose-500/25 shadow-[0_0_20px_rgba(244,63,94,0.15)] relative">
          <div className="absolute inset-0 bg-rose-400/5 animate-pulse rounded-full"></div>
          <svg
            className="h-10 w-10 text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Dynamic Error Titles */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-white font-scifi mb-4 tracking-wide bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
          {errorTitle}
        </h2>

        {/* Explicit Reason Log panel */}
        <div className="w-full max-w-md mx-auto mb-8 bg-rose-950/15 border border-rose-900/30 rounded-xl p-4 text-left">
          <div className="text-[10px] uppercase font-bold tracking-widest text-rose-400/70 mb-1">
            Error Reason
          </div>
          <p className="text-rose-200/95 text-xs md:text-sm font-medium">
            {errorReason}
          </p>
        </div>

        {/* Ultra-Premium, Muted Re-Auth CTA button with corrected icon sizing */}
        <div className="inline-block relative group/btn">
          <button
            onClick={onTryAgain}
            className="relative flex items-center gap-3 bg-[#080d1a] hover:bg-[#0c1224] px-8 py-3.5 rounded-xl border border-sky-500/20 hover:border-sky-400/40 text-slate-300 font-bold tracking-wider font-scifi text-xs transition-all duration-300 group-hover/btn:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer"
          >
            {/* Elegant, precise circular arrows reload icon (Corrected Size h-5 w-5) */}
            <svg
              className="h-5 w-5 text-sky-400/80 group-hover/btn:rotate-180 transition-transform duration-700 ease-in-out"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>TRY AGAIN NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const [currentStep, setCurrentStep] = useState("waiting"); // 'waiting' | 'success' | 'failed'
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(
    DEVELOPER_CONFIG.initialCountdownSeconds.toFixed(1),
  );
  const isHandshakeComplete = useRef(false);
  const [errorText, setErrorText] = useState(
    DEVELOPER_CONFIG.defaultErrorReason,
  );
  const progressTimerRef = useRef(null);
  const startTimeRef = useRef(null);
  const navigate = useNavigate();

  //---------- user authentication logic ----------
  const { setUser } = useAuth();
  const [searchParams] = useSearchParams();
  // const code = searchParams.get("code");
  const allParams = searchParams.toString();
  const { provider } = useParams();
  useEffect(() => {
    if (provider && allParams) {
      handleOAuthCallback({
        provider,
        allParams,
        setUser,
        isHandshakeComplete,
        setErrorText,
        setCurrentStep,
        navigate,
      });
    }
  }, [provider, allParams]);
  //--------------------

  // Listen for the 100% complete milestones and switch views
  useEffect(() => {
    if (progress === 100) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      const successTransitionTimeout = setTimeout(() => {
        setCurrentStep("success");
      }, 500);
      return () => clearTimeout(successTransitionTimeout);
    }
  }, [progress]);

  // Handle Initializing and state changes
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isHandshakeComplete]);
  // Core Simulation Timer Loop
 
useEffect(()=>{
progressTimerRef.current = setInterval(() => {
  // Manage countdown timer mapping down to 1.0s limit
  if (startTimeRef.current) {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    let remaining = DEVELOPER_CONFIG.initialCountdownSeconds - elapsed;

    if (!isHandshakeComplete.current) {
      // Freeze countdown at exactly 1.0 second if handshake is not approved
      if (remaining < 1.0) {
        remaining = 1.0;
      }
    } else {
      // If handshake is complete, allow it to wind down to 0.0s alongside the final 100% progress push
      if (remaining < 0.0) {
        remaining = 0.0;
      }
    }
    setCountdown(remaining.toFixed(1));
  }

  setProgress((prevProgress) => {
    // Enforcing absolute 99% logic requirement limit
    if (prevProgress >= 99) {
      if (isHandshakeComplete.current) {
        if (prevProgress < 100) {
          return prevProgress + 1;
        } else {
          clearInterval(progressTimerRef.current);
          return 100;
        }
      }
      return 99; // Cap at 99% when handshake is false
    }

    // Dynamic increments towards 99%
    const step = Math.ceil(Math.random() * 8) + 2;
    const next = prevProgress + step;
    return next > 99 ? 99 : next;
  });
}, DEVELOPER_CONFIG.handshakeCheckInterval);
  
},[])
    
  return (
    <div className="min-h-screen bg-[#020512] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Premium Visual Style Registry */}
      <VisualStyleRegistry />

      {/* Atmospheric Glowing Neon Backdrops */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-indigo-500/5 via-sky-500/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Responsive Header component */}
      <Header2 />

      {/* Core Grid Content Container */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-grow flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10">
        {/* Live Status Content Panel */}
        <div className="w-full lg:w-3/5 max-w-2xl flex flex-col justify-center min-h-[480px]">
          {currentStep === "waiting" && (
            <WaitingCard
              progress={progress}
              countdownTime={countdown}
              title="Authenticating with Google"
              subtitle="Please wait a few seconds"
              redirectInfo="Securing Google Accounts authentication. Progress will hold until verification is approved."
            />
          )}

          {currentStep === "success" && (
            <SuccessCard
              title="Successfully Signed In With Google"
              subtitle="Secure credentials accepted. Your access credentials are verified."
              redirectMessage="Redirecting you to dashboard"
            />
          )}

          {currentStep === "failed" && (
            <FailedCard
              errorTitle="Failed to Authenticate with Google"
              errorReason={errorText}
              onTryAgain={() => {
                navigate("/auth/signin");
              }}
            />
          )}
        </div>
      </main>
    </div>

  );
}

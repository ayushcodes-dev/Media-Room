import { ArrowLeft } from "lucide-react";
import GlassCard from "@/component/cards/glassCard";
import NeonButton from "@/component/button/neonButton";
import {useEffect} from "react"
const VerificationForm = ({
  otp,
  onOtpChange,
  onBack,
  onComplete,
  handleResendOTP,
}) => {
    
 useEffect(() => {
   document.title = "email_verification | Media Room";
 }, []);

  return(
  <GlassCard className="p-10 w-md">
    <div className="flex justify-start mb-6">
      <button
        onClick={onBack}
        className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] font-inter"
      >
        <ArrowLeft size={14} strokeWidth={3} /> Back
      </button>
    </div>
    <h2 className="text-2xl font-black mb-2 text-left font-orbitron uppercase tracking-tight">
      VERIFY EMAIL
    </h2>
    <p className="text-slate-400 text-sm mb-10 text-left font-inter">
      We've sent a 6-digit code to your email.
    </p>

    <div className="flex justify-between gap-3 mb-10">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => onOtpChange(e.target, index)}
          onFocus={(e) => e.target.select()}
          className="w-12 h-14 bg-white/5 border border-white/10 rounded-2xl text-center text-xl font-black text-sky-400 outline-none focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 transition-all font-inter shadow-inner"
        />
      ))}
    </div>

    <NeonButton onClick={onComplete}>COMPLETE SIGNUP</NeonButton>

    <p className="text-center text-xs text-slate-500 mt-8 font-inter">
      No code?{" "}
      <button
        className="text-sky-500 font-black hover:underline tracking-wider"
        onClick={handleResendOTP}
      >
        RESEND OTP
      </button>
    </p>
  </GlassCard>
)};
export default VerificationForm;

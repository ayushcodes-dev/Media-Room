import { useRef } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import InputField from "@/component/input/input1";
import GlassCard from "@/component/cards/glassCard";
import NeonButton from "@/component/button/neonButton";
import { useAuth } from "@/hooks/useAuth.jsx";
/**
 * FEATURE COMPONENTS
 */

const SignUpForm = ({ onSwitch, onSignUp }) =>{
  // username, email, password, OTPsended ,OTP, setUser } making its ref
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();  
  const { setUser } = useAuth();
  return (
    <GlassCard>
      <h2 className="text-3xl font-black mb-2 tracking-tight font-orbitron uppercase">
        Sign Up
      </h2>
      <p className="text-slate-400 text-sm mb-10 font-inter">
        Join the Tubex experience
      </p>
      <InputField
        label="Name"
        icon={Mail}
        type="text"
        placeholder="Enter your your name"
        ref={usernameRef}
        id="name"
        autoComplete="name"
      />
      <InputField
        label="Email Address"
        icon={Mail}
        type="email"
        placeholder="name@example.com"
        ref={emailRef}
        id="email"
        autoComplete="email"
      />
      <InputField
        label="Password"
        icon={Lock}
        type="password"
     id="password"
        autoComplete="password"
        placeholder="Create a strong password"
        ref={passwordRef}
      />
      <InputField
        label="Confirm Password"
        icon={ShieldCheck}
        type="password"
       id="confirm-password"
        autoComplete="password"
        placeholder="Re-enter your password"
        ref={confirmPasswordRef}
      />

      <div className="mt-10">
        <NeonButton
          onClick={() =>
            onSignUp({
              username: usernameRef.current.value,
              email: emailRef.current.value,
              password: passwordRef.current.value,
              confirmPassword: confirmPasswordRef.current.value,
              setUser,
            })
          }
        >
          VERIFY EMAIL <ArrowRight size={20} strokeWidth={3} />
        </NeonButton>
      </div>

      <p className="mt-12 text-center text-sm text-slate-400 font-inter">
        Already a member?
        <button
          onClick={onSwitch}
          className="ml-2 text-sky-400 font-extrabold hover:text-sky-300 transition-colors uppercase tracking-wider text-xs"
        >
          Sign In
        </button>
      </p>
    </GlassCard>
  );
}

export default SignUpForm;

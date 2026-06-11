import { Mail, Lock, ArrowRight } from "lucide-react";
import InputField from "@/component/input/input1";
import GlassCard from "@/component/cards/glassCard";
import NeonButton from "@/component/button/neonButton";
import GoogleIcon from "@/component/icon/google";
import GithubIcon from "@/component/icon/github";
import {useEffect} from "react"
//import { useNavigate } from "react-router-dom";
const SignInForm = ({
  onSwitch,
  onSignIn,
  onSigninWithProvider,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  
 useEffect(()=>{
     document.title = "signin | Media Room";
 },[])

  //const navigate = useNavigate();
  return (
    <GlassCard className="p-10 w-md">
      <h2 className="text-3xl font-black mb-2 tracking-tight font-orbitron uppercase">
        Sign In
      </h2>
      <p className="text-slate-400 text-sm mb-10 font-inter">
        Enter your credentials to continue
      </p>
      <form>
        <InputField
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="name@example.com"
          id="email"
          autoComplete="username"
          state={email}
          setState={setEmail}
        />
        <InputField
          label="Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          id="password"
          autoComplete="current-password"
          state={password}
          setState={setPassword}
        />
      </form>
      <div className="mt-10">
        <NeonButton
          onClick={() => {
            onSignIn();
          }}
        >
          SIGN IN <ArrowRight size={20} strokeWidth={3} />
        </NeonButton>
      </div>

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
          <span className="bg-[#0b1224]/80 px-4 text-slate-500 font-inter">
            Social Connect
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NeonButton
          variant="ghost"
          className="!py-3 text-sm font-bold"
          onClick={() => {
            onSigninWithProvider("google");
          }}
        >
          <GoogleIcon /> GOOGLE
        </NeonButton>
        <NeonButton
          variant="ghost"
          className="!py-3 text-sm font-bold"
          onClick={() => {
            onSigninWithProvider("github`");
          }}
        >
          <GithubIcon /> GITHUB
        </NeonButton>
      </div>

      <p className="mt-12 text-center text-sm text-slate-400 font-inter">
        New here?
        <button
          onClick={() => {
            onSwitch();
          }}
          className="ml-2 text-sky-400 font-extrabold hover:text-sky-300 transition-colors uppercase tracking-wider text-xs"
        >
          Create Account
        </button>
      </p>
    </GlassCard>
  );
};
export default SignInForm;

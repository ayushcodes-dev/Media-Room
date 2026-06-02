import { useState } from "react";
import SignInForm from "./signin";
import SignUpForm from "./signup";
import VerificationForm from "./email_verification";
import Header from "@/component/header/header2";
import { useLocation, useNavigate } from "react-router-dom";
import { onSignin, onSigninWithProvider } from "@/features/auth/signin.auth.js";
import { onSignup} from "@/features/auth/signup.auth.js";
import { handleVerification } from "@/features/auth/email_verification.auth.js";
import NeonLoader from "@/component/loader/loader1";
import Toaster1 from "@/component/toaster/toaster1";
import { useAuth } from "@/hooks/useAuth.jsx";
/**
 * MAIN APP COMPONENT
 */
export default function Auth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [toasterData, setToasterData] = useState([]);
  const { user, setUser } = useAuth();

  // forrm data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [otp, setOtp] = useState(new Array(6).fill(""));
  // Injecting Google Fonts

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const navigateTo = (newView) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/${newView}`);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-sky-500/30 selection:text-sky-300">
      {/* Dynamic Background Neon Glows */}
      <div className="absolute top-[-15%] right-[-15%] w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[130px] animate-pulse" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[130px]" />

      {/* App Header & Brand Logo */}
      <Header />
      {/* Active Form Content Area */}
      <div
        className={`z-10 w-full flex justify-center transition-all duration-500 ${loading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <NeonLoader
          isLoading={isLoading}
          heading="Signing In..."
          description="Authenticating your credentials, please wait."
        />

        <Toaster1 data={toasterData} />

        {location.pathname === "/auth/signin" && (
          <SignInForm
            onSwitch={() => navigateTo("auth/signup")}
            onSignIn={() => {
              onSignin(
                { email, password },
                { setIsLoading, setToasterData, setUser },
                { navigateTo },
              );
            }}
            onSigninWithProvider={(provider) => {
              onSigninWithProvider(
                { provider },
                { setIsLoading, setToasterData },
                { navigateTo },
              );
            }}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        )}
        {location.pathname === "/auth/signup" && (
          <SignUpForm
            onSwitch={() => navigateTo("auth/signin")}
            onSignUp={() => {
              onSignup(
                { username, email, password, confirmPassword },
                { setIsLoading,toasterData, setToasterData, setUser },
                { navigateTo },
              );
            }}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        )}
        {location.pathname === "/auth/email_verification" && (
          <VerificationForm
            otp={otp}
            onOtpChange={handleOtpChange}
            onBack={() => navigateTo("auth/signup")}
            onComplete={() => {
              handleVerification(
                { otp },
                { setIsLoading, toasterData,setToasterData, setUser },
                { navigateTo },
              );
            }}
            handleResendOTP={() => {
              setOtp(new Array(6).fill(""));
              if (user.email) {
                onSignup(
                  { username, email, password, confirmPassword },
                  { setIsLoading, toasterData,setToasterData, setUser },
                  { navigateTo },
                );
                return;
              }
              navigateTo("auth/signup");
            }}
          />
        )}
      </div>

      {/* Sticky Footer */}
      <div className="mt-16 z-10 text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em] font-inter">
        &copy; 2024 Tubex Inc. &bull; Secure Auth
      </div>
    </div>
  );
}

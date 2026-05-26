import { useState } from "react";
import SignInForm from "./signin";
import SignUpForm from "./signup";
import VerificationForm from "./email_verification";
import Header from "@/component/header/header2";
import { useLocation, useNavigate } from "react-router-dom";
import { signin, signup, signin_with_provider } from "@/api/auth";
import NeonLoader from "@/component/loader/loader1";
import Toaster1 from "@/component/toaster/toaster1";
import { useAuth } from "@/hooks/useAuth.jsx";
/**
 * MAIN APP COMPONENT
 */
export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [toasterData, setToasterData] = useState([]);
  const { user, setUser } = useAuth();
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
    }, 350);
  };
  const onSignin = async ({ email, password, setUser }) => {
    setIsLoading(true);
    const data = await signin(email, password);
    setIsLoading(false);
    if (!data.success) {
      if (data.error.error?.errorCode === "VALIDATION_ERROR") {
        const messages = data.error.error.error
          .map((detail) => detail.msg)
          .join(".\n");
        setToasterData([
          {
            status: "error",
            info: messages,
            duration: 9000,
          },
        ]);
        return;
      }
      setToasterData([
        {
          status: "error",
          info: data.error.message,
          duration: 7000,
        },
      ]);
      return;
    }
    setToasterData([
      {
        status: "success",
        info: "Signed in successfully!",
        // align: "bottom-right",
      },
    ]);
    
    const userdata = {
      userID: data.data.userID,
      email: data.data.email,
      username: data.data.username,
      isAuthenticated: data.data.isAuthenticated,
      role: data.data.role,
    };
    setUser(userdata);
    sessionStorage.setItem("user_auth", JSON.stringify(userdata));
    navigateTo("/dashboard");
  };
  const onSignup = async ({ username, email, password, confirmPassword }) => {
    setIsLoading(true);
    if (password !== confirmPassword) {
      setIsLoading(false);
      setToasterData([
        {
          status: "error",
          info: "Passwords do not match!",
          duration: 7000,
        },
      ]);
      return;
    }
    const data = await signup({
      username,
      email,
      password,
      OTPsended: false,
      OTP: "111111", //it is random
    });

    setIsLoading(false);
    if (!data.success) {
      if (data.error.error?.errorCode === "VALIDATION_ERROR") {
        const messages = data.error.error.error
          .map((detail) => detail.msg)
          .join(".\n");
        setToasterData([
          {
            status: "error",
            info: messages,
            duration: 9000,
          },
        ]);
        return;
      }
      setToasterData([
        {
          status: "error",
          info: data.error.message,
          duration: 7000,
        },
      ]);
      return;
    }

    const userdata = {
      userID: data.data.userID,
      email: data.data.email,
      username: data.data.username,
      password: password,
      isAuthenticated: data.data.isAuthenticated,
      role: data.data.role,
    };
    setUser(userdata);
   
    sessionStorage.setItem("user_auth", JSON.stringify(userdata));
    navigateTo("auth/email_verification");
  };
  const handleVerification = async (otp) => {
    setIsLoading(true);
    const enteredOtp = otp.join("");
    const raw_userdata = sessionStorage.getItem("user_auth");
    if(!raw_userdata){
       navigateTo("auth/signup");
    }
    const userdata = JSON.parse(raw_userdata);
    const data = await signup({
      username: userdata?.username,
      email: userdata?.email,
      password: userdata?.password,
      OTPsended: true,
      OTP: enteredOtp,
    });

    setIsLoading(false);
    if (!data.success) {
      if (data.error.error?.errorCode === "VALIDATION_ERROR") {
        const messages = data.error.error.error
          .map((detail) => detail.msg)
          .join(".\n");
        setToasterData([
          {
            status: "error",
            info: messages,
            duration: 9000,
          },
        ]);
        return;
      }
      setToasterData([
        {
          status: "error",
          info: data.error.message,
          duration: 7000,
        },
      ]);
      return;
    }
    setUser({
      ...user,
      isAuthenticated: data.data.isAuthenticated,
    });
    navigateTo("/dashboard");
  };
  const onSigninWithProvider = async ({ provider }) => {
    setIsLoading(true);
    const data = await signin_with_provider({ provider });

    if (!data.success) {
      setToasterData([
        {
          status: "error",
          info: data?.error?.message,
          duration: 7000,
        },
      ]);
      return;
    }
    console.log(data.data.redirect_url);
    if (data.data?.redirect && data.data?.redirect_url) {
      window.location.href = data.data.redirect_url;
    }
    setIsLoading(false);
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
            onSignIn={onSignin}
            onSigninWithProvider={onSigninWithProvider}
          />
        )}
        {location.pathname === "/auth/signup" && (
          <SignUpForm
            onSwitch={() => navigateTo("auth/signin")}
            onSignUp={onSignup}
          />
        )}
        {location.pathname === "/auth/email_verification" && (
          <VerificationForm
            otp={otp}
            onOtpChange={handleOtpChange}
            onBack={() => navigateTo("auth/signup")}
            onComplete={() => {
              handleVerification(otp);
            }}
            handleResendOTP={() => {
              setOtp(new Array(6).fill(""));
              if (user.email) {
                onSignup({
                  username: user.username,
                  email: user.email,
                  password: user.password,
                  confirmPassword: user.password,
                });
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

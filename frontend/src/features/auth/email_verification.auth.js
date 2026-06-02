import { signup } from "@/api/auth";
export const handleVerification = async (
  { otp },
  { setIsLoading, toasterData, setToasterData, setUser },
  { navigateTo },
) => {
  setIsLoading(true);
  const enteredOtp = otp.join("");
  if (enteredOtp.length !== 6)
    setToasterData([
      ...toasterData,
      {
        status: "error",
        info: "Please Enter All fields Of OTP",
        duration: 7000,
      },
    ]);
  const raw_userdata = localStorage.getItem("user_auth");
  if (!raw_userdata) {
    return navigateTo("auth/signup");
  }
 
  let userdata = null;
  try {
    userdata = JSON.parse(raw_userdata);
  } catch {
    setToasterData([
      ...toasterData,
      {
        status: "error",
        info: "something went wrong",
        duration: 7000,
      },
    ]);
    return
  }
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

  const newdata = {
    userID: data.data.userID,
    email: data.data.email,
    username: data.data.username,
    password: "",
    isAuthenticated: data.data.isAuthenticated,
    role: data.data.role,
  };
  setUser(newdata);

  localStorage.setItem("user_auth", JSON.stringify(newdata));
  navigateTo("/dashboard");
};

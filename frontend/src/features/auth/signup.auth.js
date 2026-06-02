import { signup } from "@/api/auth";
export const onSignup = async (
  { username, email, password, confirmPassword },
  { setIsLoading, setToasterData, setUser },
  { navigateTo },
) => {
  
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
//console.log(data,userdata)
  localStorage.setItem("user_auth", JSON.stringify(userdata));
  navigateTo("auth/email_verification");
};

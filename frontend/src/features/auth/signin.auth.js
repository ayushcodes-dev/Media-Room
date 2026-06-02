import { signin,  signin_with_provider } from "@/api/auth";

export const onSignin = async (
  { email, password },
  { setIsLoading, setToasterData, setUser },
  { navigateTo },
) => {
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
  localStorage.setItem("user_auth", JSON.stringify(userdata));
 
  navigateTo("/dashboard");
};

export const onSigninWithProvider = async (
  { provider },
  { setIsLoading, setToasterData },
) => {
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

import api from "./axios";

export const signin = async (email, password) => {
  try {
    const response = await api.post("/auth/signin", { email, password });
    const data = response.data;
    return data;
  } catch (error) {
    return {
      error: error.response.data || {message:"An error occurred during sign-in."},
      success: false,
    };
  }
};




export const signup = async ({username, email, password, OTPsended, OTP, setUser}) => {
  try {
    const response = await api.post("/auth/signup", {
      username,
      email,
      password,
      OTPsended,
      OTP,
      setUser,
    });
    const data = response.data;
    return data;
  } catch (error) {
    return {
      error: error.response.data || {
        message: "An error occurred during sign-up.",
      },
      success: false,
    };
  }
};


export const signin_with_provider = async ({
provider,
}) => {
  try {
  
    let providerUrl = "";
    if (provider === "google") {
      providerUrl = `${import.meta.env.VITE_Backend_SERVER_API_BASE_URL}/oAuth/signin/google`;
    }
    const response = await api.get(providerUrl, { withCredentials: true });
    const data = response.data;
     console.log(data);
    return data;
  } catch (error) {
    console.log(error.response.data)
    return {
      error: error.response.data || {
        message: "An error occurred during sign-in with  "+provider,
      },
      success: false,
    };
  }
};


export const provider_callback = async ({ provider,allParams }) => {

  try {
     
    let providerUrl = "";
    if (provider === "google") {
      providerUrl = `${import.meta.env.VITE_Backend_SERVER_API_BASE_URL}/oAuth/callback/google`;
    }
  
    const response = await api.get(providerUrl+`?${allParams}`, { withCredentials: true });
    const data = response.data;
    console.log("data", data);
    return data;
  } catch (error) {
    console.log("error", error);
    return {
      error: error.response.data || {
        message: "An error occurred during authentication with  " + provider,
      },
      success: false,
    };
  }
};

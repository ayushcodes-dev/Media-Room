import api from "./axios";

export const getUsageAPI = async ({orderID}) => {
  try {

    const response = await api.get("/usage/"+orderID);
  

    const data = response.data;

    return data;
  } catch (error) {
    console.log(error);
    return {
      error: error.response.data || {
        message: "An error occurred during getting usage history",
      },
      success: false,
    };
  }
};

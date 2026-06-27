import api from "./axios";
export const generate_SEO_DataAPI = async ({videoDescription,projectID }) => {
  
  try {
    const response = await api.post("/generate/seoData",{videoDescription,projectID});
    const data = response.data;    
    return data;
  } catch (error) {
 //console.log("generate api",error.response.data)
    return {
      error: error.response.data.error ? {
        message: "An error occurred during Generating Data",
        error: error.response.data.error,
      }:error.response,
      success: false,
    };
  }
};

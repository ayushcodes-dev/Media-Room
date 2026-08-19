import api from "./axios";

export const generate_SEO_DataAPI = async ({ videoDescription, projectID }) => {
  try {
    const response = await api.post("/generate/seoData", {
      videoDescription,
      projectID,
    });
    return response.data;
  } catch (error) {
    const resData = error.response?.data || {};
    return {
      success: false,
      statusCode: error.response?.status || resData.statusCode || 500,
      message: resData.message || "An error occurred during Generating Data",
      error: resData.error || { message: resData.message },
    };
  }
};

export const generate_Thumbnail_API = async ({
  projectID,
  customPrompt,
  videoDescription,
  description,
}) => {
  try {
    const response = await api.post("/generate/thumbnail", {
      projectID,
      customPrompt,
      videoDescription,
      description,
    });
    return response.data;
  } catch (error) {
    const resData = error.response?.data || {};
    return {
      success: false,
      statusCode: error.response?.status || resData.statusCode || 500,
      message: resData.message || "An error occurred during Generating Thumbnail",
      error: resData.error || { message: resData.message },
    };
  }
};

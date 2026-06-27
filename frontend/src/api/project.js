import api from "./axios";

export const projectStatusAPI = async () => {
  try {
    const response = await api.get("/project/status");
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error.response);
    return {
      error: error.response.data || {
        message: "An error occurred during getting project status.",
      },
      success: false,
    };
  }
};

export const createProjectAPI = async ({ projectName }) => {
  try {
    const response = await api.post("/project", { projectName });
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error.response);
    return {
      error: error.response.data || {
        message: "An error occurred during creating project",
      },
      success: false,
    };
  }
};

export const getProjectByID_API = async ({ projectID }) => {
  try {
    const response = await api.get("/project/" + projectID);
    const data = response.data;
    // console.log("api",data)
    return data;
  } catch (error) {
    console.log(error.response);
    return {
      error: error.response.data || {
        message: "An error occurred during getting project data.",
      },
      success: false,
    };
  }
};

export const saveVideoDesc_API = async ({ projectID, description }) => {
  try {
    const response = await api.post(
      "/project/" + projectID + "/videoDescription",
      { description },
    );
    const data = response.data;
    console.log("saving desc", data);
    return data;
  } catch (error) {
    console.log("error during sving video desc ", error.response);
    return {
      error: error.response.data || {
        message: "An error occurred during saving  viddeo desciption data.",
      },
      success: false,
    };
  }
};
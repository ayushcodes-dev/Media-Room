import api from "./axios";

export const getProjects = async (startProject, limitProject) => {
  try {
    const url = `/project?startProject=${startProject}&limitProject=${limitProject}`;
    const response = await api.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error.response);
    return {
      error: error.response.data || {
        message: "An error occurred during getting projects.",
      },
      success: false,
    };
  }
};


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

export const getProjectByID_API= async ({projectID})=>{
try {
  const response = await api.get("/project/"+projectID);
  const data = response.data;
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
}


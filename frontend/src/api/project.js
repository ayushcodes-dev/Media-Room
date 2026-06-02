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



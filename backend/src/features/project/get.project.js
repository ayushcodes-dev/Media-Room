import { ProjectModel } from "#/database/mongoose/schema/index.model.js";

const getProjects = async (req, start, limit) => {
  try {
    console.log("start, limit, req.session.userID:", start, limit, req.session.userID);
    const projects = await ProjectModel.aggregate([
      {
        $match: { userID: req.session.userID },
      },

      {
        $project: {
          projects: 1,
          _id: 0,
        },
      },
    ]);
    console.log(projects);
    if (!projects) {
      return {
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        errorCode: "INTERNAL_SERVER_ERROR",
        errors: null,
      };
    }
    if (projects.length < 1) {
      return {
        success: false,
        statusCode: 404,
        message: "no projects found",
        errorCode: "PROJECTS_NOT_FOUND",
        errors: null,
      };
    }
    const userProjects = projects[0].projects || [];
    if (userProjects.length < 1) {
      return {
        success: false,
        statusCode: 404,
        message: "no projects found",
        errorCode: "PROJECTS_NOT_FOUND",
        errors: null,
      };
    }
    const limitedProjects = userProjects.slice(start, limit);
    return {
      success: true,
      statusCode: 200,
      message: "project funded successfully",
      data: limitedProjects,
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("Error in getProjects:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
};


export default getProjects;
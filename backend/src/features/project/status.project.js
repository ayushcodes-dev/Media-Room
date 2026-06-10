import { ProjectModel } from "#/database/mongoose/schema/index.model.js";

const projectStatus = async (req) => {
  try {
    const userID = req.session.userID;
    const projects = await ProjectModel.findOne(
        { userID: userID },
        {
            _id: 0,
        }
    );
   
 
    if (!projects||!projects.projects || projects.projects.length < 1) {
      return {
        success: false,
        statusCode: 404,
        message: "no projects found",
        errorCode: "PROJECTS_NOT_FOUND",
        errors: null,
      };
    }
    const userProjects = projects.projects;
    const projectStatus = userProjects.map((project) => {
      return {
        projectID: project.projectID,
        contentStatus: project.contentStatus,
        thumbnailStatus: project.thumbnailStatus,
      };
    });
    return {
      success: true,
      statusCode: 200,
      message: "project funded successfully",
      data: userProjects,
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("Error in getting Project  status:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
};

export default projectStatus;

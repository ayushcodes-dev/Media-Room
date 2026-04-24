import {
  ProjectModel,
  ContentModel,
} from "#/database/mongoose/schema/index.model.js";

// function to find project and its details
async function getProject(userID, projectName) {
  try {
    const projects = await ProjectModel.aggregate([
      {
        $match: { userID: userID },
      },
      {
        $project: {
          matchedProject: {
            $filter: {
              input: "$projects",
              as: "proj",
              cond: { $eq: ["$$proj.projectName", projectName] },
            },
          },
        },
      },
    ]);
    if (!projects) {
      return {
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        errorCode: "INTERNAL_SERVER_ERROR",
        errors: null,
      };
    }
    if (projects[0].matchedProject.length < 1) {
      return {
        success: false,
        statusCode: 404,
        message: "project not found",
        errorCode: "PROJECT_NOT_FOUND",
        errors: null,
      };
    }

    return {
      success: true,
      data: projects[0].matchedProject[0],
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}

// handles the req of get projectbyid. returns the project data
async function getProjectByName(req, Data) {
  try {
    const project = await getProject(req.session.userID, Data.projectName);

    if (!project.success) {
      return project; // Return the error response from getProject
    }
    return {
      success: true,
      statusCode: 200,
      message: "successfully fetched project data",
      data: {
        projectID: project.data.projectID,
        projectName: project.data.projectName,
        contentStatus: project.data.contentStatus,
        thumbnailStatus: project.data.thumbnailStatus,
        description: project.data.description,
      },
      errorCode: null,
      errors: null,
    };

    
  } catch (error) {
    console.error("Error in getProjectById:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}

export default getProjectByName;

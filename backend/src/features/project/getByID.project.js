import {
  ProjectModel,
  ContentModel,
} from "#/database/mongoose/schema/index.model.js";

// function to find project and its details
async function getProject(userID, projectID) {
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
              cond: { $eq: ["$$proj.projectID", projectID] },
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
        message: "projects not found",
        errorCode: "PROJECTS_NOT_FOUND",
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
// fuunction to get content
async function getContent(userID, projectID) {
  const content = await ContentModel.findOne({
    userID: userID,
    projectID: projectID,
  });
  if (!content) {
    return {
      success: false,
      statusCode: 404,
      message: "content not found",
      errorCode: "CONTENT_NOT_FOUND",
      errors: null,
    };
  }
  return {
    success: true,
    statusCode: 200,
    message: "successfully fetched content",
    data: content,
    errorCode: null,
    errors: null,
  };
}

// handles the req of get projectbyid. returns the project data
async function getProjectById(req, projectID) {
  try {
    const fetchData = await Promise.all(
      [
        getProject(req.session.userID, projectID),
        getContent(req.session.userID, projectID),
      ],
      (error) => {
        if (error) {
          return {
            success: false,
            statusCode: 500,
            message: "Internal Server Error",
            errorCode: "INTERNAL_SERVER_ERROR",
            errors: null,
          };
        }
      },
    );
    const projectData = fetchData[0];
    const contentData = fetchData[1];
    if (!projectData.success) {
      return projectData; // Return the error response from getProject
    }

    if (!contentData.success) {
      return contentData; // Return the error response from getProject
    }

    return {
      success: true,
      statusCode: 200,
      message: "successfully fetched project data",
      data: {
        projectData: {
          projectID: projectData.data.projectID,
          projectName: projectData.data.projectName,
          contentStatus: projectData.data.contentStatus,
          thumbnailStatus: projectData.data.thumbnailStatus,
          description: projectData.data.description,
        },
        contentData: {
          title: contentData.data.title,
          description: contentData.data.description,
          tags: contentData.data.tags,
        },
        
      },
      errorCode: null,
      errors: null,
    };

    return { success: true, data: project.data };
  } catch (error) {
    console.error("Error in getProjectById:", error);
    return { success: false, message: "Server error" };
  }
}

export default getProjectById;

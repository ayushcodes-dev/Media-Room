import {
  ProjectModel,
  ContentModel,
} from "#/database/mongoose/schema/index.model.js";

// function to find project and its details
async function getProjectStatus(userID, projectID) {
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


// function to find project data and its details
async function getProjectData(userID, projectID) {
  try {
    const projects = await ContentModel.find({userID:userID,projectID:projectID})
    
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
        message: "projects not found",
        errorCode: "PROJECTS_NOT_FOUND",
        errors: null,
      };
    }
    
    return {
      success: true,
      data: projects,
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
async function getProjectById(req, projectID) {
  try {
    const project = await getProjectStatus(req.session.userID, projectID);
  
    if (!project.success) {
      return project; // Return the error response from getProject
    }
   const projectdata = await getProjectData(req.session.userID, projectID);
   
    if (!projectdata.success) {
      return projectdata; // Return the error response from getProject
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
        videoDescription: project.data.videoDescription,
        seoData: projectdata.data,
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

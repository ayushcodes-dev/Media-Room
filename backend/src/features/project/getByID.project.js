import {
  ProjectModel,
  ContentModel,
  ThumbnailModel,
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
    if (projects.length === 0 || !projects[0].matchedProject || projects[0].matchedProject.length < 1) {
      return {
        success: false,
        statusCode: 404,
        message: "Project not found",
        errorCode: "PROJECTS_NOT_FOUND",
        errors: null,
      };
    }

    return {
      success: true,
      data: projects[0].matchedProject[0],
    };
  } catch (error) {
    console.error("Error in getProjectStatus:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}

// function to find project content data
async function getProjectData(userID, projectID) {
  try {
    const contents = await ContentModel.find({ userID, projectID }).sort({
      createdAt: -1,
    });
    return {
      success: true,
      data: contents || [],
    };
  } catch (error) {
    console.error("Error in getProjectData:", error);
    return {
      success: true,
      data: [],
    };
  }
}

// function to find project thumbnail data
async function getThumbnailData(userID, projectID) {
  try {
    const thumbnails = await ThumbnailModel.find({ userID, projectID }).sort({
      createdAt: -1,
    });
    return {
      success: true,
      data: thumbnails || [],
    };
  } catch (error) {
    console.error("Error in getThumbnailData:", error);
    return {
      success: true,
      data: [],
    };
  }
}

// handles the req of get projectbyid. returns the project data
async function getProjectById(req, projectID) {
  try {
    const userID = req.session?.userID || req.userID;
    const project = await getProjectStatus(userID, projectID);

    if (!project.success) {
      return project;
    }

    const [projectData, thumbnailData] = await Promise.all([
      getProjectData(userID, projectID),
      getThumbnailData(userID, projectID),
    ]);

    const thumbnails = thumbnailData.data || [];
    const latestThumbnail = thumbnails.length > 0 ? thumbnails[0].thumbnailURL : null;

    return {
      success: true,
      statusCode: 200,
      message: "Successfully fetched project data",
      data: {
        projectID: project.data.projectID,
        projectName: project.data.projectName,
        contentStatus: project.data.contentStatus,
        thumbnailStatus: project.data.thumbnailStatus,
        videoDescription: project.data.videoDescription,
        customPrompt: project.data.customPrompt,
        seoData: projectData.data || [],
        thumbnail: latestThumbnail,
        thumbnails: thumbnails,
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
      errors: error.message,
    };
  }
}

export default getProjectById;

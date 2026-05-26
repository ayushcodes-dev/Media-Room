import { getProjectById } from "#/features/project/index.project.js";
import { ProjectModel } from "#/database/mongoose/schema/index.model.js";
// function to rename project name
async function saveDesc(userID, projectID, desc) {
  try {
    const result = await ProjectModel.updateOne(
      {
        userID,
        "projects.projectID": projectID,
      },
      {
        $set: {
          "projects.$.videoDescription": desc,
        },
      },
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        statusCode: 404,
        message: "Project not found",
        errorCode: "PROJECT_NOT_FOUND",
        errors: null,
      };
    }
    if (!result.acknowledged || result.modifiedCount === 0) {
      return {
        success: false,
        statusCode: 500,
        message: "Failed to store video description",
        errorCode: "FAILED_TO_SAVE_VIDEO_DESC",
        errors: null,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "successfully saved video description",
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("error in saving video description", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}

async function saveVideoDesc(req, Data) {
  try {
    const update = await saveDesc(
      req.session.userID,
      Data.projectID,
      Data.desc,
    );

    if (!update.success) return update;
    return {
      success: true,
      statusCode: 200,
      message: "successfully saved video description",
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("error in saving video description", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
export default saveVideoDesc;

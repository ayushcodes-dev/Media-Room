import { getProjectById } from "#/features/project/index.project.js";
import { ProjectModel } from "#/database/mongoose/schema/index.model.js";
// function to rename project name
async function savePrompt(userID, projectID, prompt) {
   
  try {
    const result = await ProjectModel.updateOne(
      {
        userID,
        "projects.projectID": projectID,
      },
      {
        $set: {
          "projects.$.customPrompt": prompt,
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
        message: "Failed to save custom prompt",
        errorCode: "FAILED_TO_SAVE_CUSTOM_PROMPT",
        errors: null,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "successfully saved custom prompt",
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("error in saving custom prompt", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}

async function saveCustomPrompt(req, Data) {
  try {
    const update = await savePrompt(
      req.session.userID,
      Data.projectID,
      Data.prompt,
    );

    if (!update.success) return update;
    return {
      success: true,
      statusCode: 200,
      message: "successfully saved custom prompt",
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("error in saving custom prompt", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
export default saveCustomPrompt;

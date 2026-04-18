import { ContentModel } from "#/database/mongoose/schema/index.model.js";

// fuunction to get content
async function getContent(req, projectID) {
  const userID = req.user.id;
  try {
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
    const data = {
      projectID: content.projectID,
      title: content.title,
      description: content.description,
      tags: content.tags,
    };
    return {
      success: true,
      statusCode: 200,
      message: "successfully fetched content",
      data: data,
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return {
      success: false,
      statusCode: 500,
      message: "An error occurred while fetching content",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
export default getContent;
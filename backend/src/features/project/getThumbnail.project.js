import { ThumbnailModel } from "#/database/mongoose/schema/index.model.js";

async function getThumbnail(req, projectID) {
  const userID = req.session?.userID || req.userID;
  try {
    const thumbnails = await ThumbnailModel.find({ userID, projectID }).sort({
      createdAt: -1,
    });
    if (!thumbnails || thumbnails.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: "No thumbnails found for this project",
        errorCode: "THUMBNAIL_NOT_FOUND",
        errors: null,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "Successfully fetched thumbnails",
      data: {
        thumbnails: thumbnails,
        latestThumbnail: thumbnails[0]?.thumbnailURL,
        thumbnail: thumbnails[0]?.thumbnailURL,
      },
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("Error in getThumbnail:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    };
  }
}

export default getThumbnail;
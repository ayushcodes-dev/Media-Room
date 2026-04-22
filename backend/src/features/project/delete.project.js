import {
  ProjectModel,
  ContentModel,
} from "#/database/mongoose/schema/index.model.js";
import { getProjectById } from "./index.project.js";
// deleting from project collection
async function deletFromProject(userID, projectID) {
  try {
    
    const result = await ProjectModel.updateOne(
      { userID },
      {
        $pull: {
          projects: { projectID: projectID },
        },
      },
    );
    if (result.matchedCount === 0 || result.modifiedCount === 0) {
      return {
        success: false,
        statusCode: 404,
        message: "Failed to delete project",
        errorCode: "FAILED_TO_DELETE",
        errors: null,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "successfully Deleted Project",
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("error in delete project",error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
// deletting from content collection
async function deletFromContent(userID, projectID) {
  try {
    const result = await ContentModel.deleteOne({ userID, projectID });

    if (result.deletedCount === 0) {
      return {
        success: false,
        statusCode: 404,
        message: "Failed to delete project",
      errorCode: "FAILED_TO_DELETE",
        errors: null,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "successfully Deleted Project",
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("error in delete content",error);

    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
// deletting from thumbnail collection
async function deletFromThumbnail(userID, projectID) {
 /* try {
    const result = await ThumbnailModel.deleteOne({ userID, projectID });

    if (result.deletedCount === 0) {
      return {
        success: false,
        statusCode: 404,
        message: "Failed to delete project",
      errorCode: "FAILED_TO_DELETE",
        errors: null,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "successfully Deleted Project",
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }*/
}
async function deleteProject(req, projectID) {
  try {
    const userID = req.session.userID;
    // getting project
    const project = await getProjectById(req, projectID);
  
    if (!project.success) return project;
    // deleting project,content,thumbnail
    const deleted = await Promise.allSettled([
      deletFromProject(userID, projectID),
      deletFromContent(userID, projectID),
      //  deletFromThumbnail(userID, projectID),
    ]);
    const delProject = deleted[0];
    
    const delContent = deleted[1];
   
    // const delThumbnail = deleted[1];

    // if failed to delete from project collection
    if (!delProject.value.success) return delProject;
    // if failed to delete from content collection
    if (project.data.contentStatus === "completed" && !delContent.value.success)
      return delContent;
    // if failed to delete from Tumbnail collection
    /*if (project.data.thumbnailStatus === "completed" && !delThumbnail.value.success)
      return delContent;*/

    return {
      success: true,
      statusCode: 200,
      message: "successfully Deleted Project",
      errorCode: null,
      errors: null,
    };
  

  } catch (error) {
    console.error(error)
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
export default deleteProject;

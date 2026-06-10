import { ProjectModel } from "#/database/mongoose/schema/index.model.js";
import { v4 as uuidv4 } from "uuid";


async function checkProjectNameExists(userID, projectID) {
  
  const userProjects = await ProjectModel.findOne({ userID });
  if (!userProjects) {
    return false; 
  }
  const projectNameExists = userProjects.projects.some((p) => p.projectID === projectID);
  return projectNameExists;
}


async function createProject(req, Data) {
  const userID = req.session.userID;

  try {
    
    const projectID = uuidv4();

    const newItem = {
      projectID: projectID,
      projectName: Data.projectName,
      date: new Date(),
    };
    // creating project by pushing new project .if  user is not eits in project collection then creting new user and adding project to it. 
    const result = await ProjectModel.findOneAndUpdate(
      { userID },
      {
        $push: { projects: newItem },
        $setOnInsert: { userID },
      },
      {
        upsert: true,
        includeResultMetadata: true,
      },
    );
  console.log("result",result);
    if (result.lastErrorObject.n===0 || !result.lastErrorObject.n) {
      return {
        success: false,
        statusCode: 500,
        message: "Failed To Create Project",
        errorCode: "PROJECT_CREATION_FAILED",
        errors: null,
      };
    } else {
      return {
        success: true,
        statusCode: 201,
        message: "Project created successfully",
        data:{projectID:projectID},
        errorCode: null,
        errors: null,
      };
    }
  } catch (error) {
    console.error("Error creating project:", error);    
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
export default createProject; 
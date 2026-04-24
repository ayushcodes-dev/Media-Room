import {getProjectByName} from "#/features/project/index.project.js"
import { ProjectModel } from "#/database/mongoose/schema/index.model.js"
// function to rename project name
async function rename(userID,projectID, newName){
    
     try {
       const result = await ProjectModel.updateOne(
         {
           userID,
           "projects.projectID": projectID,
         },
         {
           $set: {
             "projects.$.projectName": newName,
           },
         },
       );
    
      
       if( result.matchedCount === 0 ){
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
            message: "Failed to rename project",
            errorCode: "FAILED_TO_RENAME",
            errors: null,
          };
        }
       return {
         success: true,
         statusCode: 200,
         message: "successfully renamed Project",
         errorCode: null,
         errors: null,
       };
     } catch (error) {
       console.error("error in renaming project", error);
       return {
         success: false,
         statusCode: 500,
         message: "Internal Server Error",
         errorCode: "INTERNAL_SERVER_ERROR",
         errors: null,
       };
     }
}


async function renameProject(req,Data){
    try{
    const project = await getProjectByName(req, { projectName: Data.newName });
    
    if (project.success){
         return {
           success: false,
           statusCode: 209,
           message: "Project name already exits",
           errorCode: "NAME_ALREADY_EXITS",
           errors: null,
         };
    }
    const update= await rename(req.session.userID, Data.projectID, Data.newName);
  
   if (!update.success) return update
     return {
       success: true,
       statusCode: 200,
       message: "successfully renamed Project",
       errorCode: null,
       errors: null,
     };
    }catch(error){
       console.error("error in renaming project", error);
       return {
         success: false,
         statusCode: 500,
         message: "Internal Server Error",
         errorCode: "INTERNAL_SERVER_ERROR",
         errors: null,
       };
     
    }
}
export default renameProject;
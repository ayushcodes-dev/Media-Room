import { projectStatusAPI } from "@/api/project";

 const getProjectStatus = async ({ setprojectStatus }) => {
   const data = await projectStatusAPI();
 // console.log("data", data);
  if(data.error.error&& data.error.error.errorCode  === "PROJECTS_NOT_FOUND"){
     setprojectStatus(() => []);
     return []
  }
   if (data.data && data.data.length > 0) {
 
     setprojectStatus(() => [...data.data]);
     return data.data;
   }
   return null;
 };
export default getProjectStatus;
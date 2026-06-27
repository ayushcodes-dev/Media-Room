import { projectStatusAPI } from "@/api/project";

 const getProjectStatus = async ({ setprojectStatus }) => {
   const data = await projectStatusAPI();

   if (data.data && data.data.length > 0) {
 
     setprojectStatus(() => [...data.data]);
     return data.data;
   }
   return null;
 };
export default getProjectStatus;
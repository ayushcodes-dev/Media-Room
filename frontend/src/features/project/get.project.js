import { getProjectByID_API } from "@/api/project.js"


async function getProjectByID({ projectID }, { setProjectData }) {
  try {
    const res = await getProjectByID_API({ projectID });
   //console.log("features",res)
    if (res.success) {
      setProjectData((prev) => {
       const filtered = prev.filter((data) => data.projectID !== projectID);
        return [...filtered, res.data];
      });
      return res.data;
    }

    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}
export default getProjectByID;
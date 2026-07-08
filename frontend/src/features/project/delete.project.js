import { deleteProject_API } from "@/api/project.js";
import getProjectStatus from "@/features/project/status.project.js";
async function deleteProject(
  { projectID },
  {
    setProjectData,
    setToasterData,
    projectStatus,
    setprojectStatus,
    setProjectNotFound,
  },
) {
  try {
    const res = await deleteProject_API({ projectID });
    //console.log("features",res)
    if (res.success) {
      setProjectData((prev) => {
        const filtered = prev.filter((data) => data.projectID !== projectID);
        console.log("filtered", filtered);
        return [...filtered];
      });
      const status = await getProjectStatus({
        projectStatus,
        setprojectStatus,
        setToasterData,
      });
      //console.log("status", status);
        setProjectNotFound(true)
      return res;
    }
    //console.log("res", res);
    setToasterData([
      {
        status: "error",
        info: res?.error?.message,
        duration: 7000,
      },
    ]);
    return null;
  } catch (err) {
    console.log(err);
    setToasterData([
      {
        status: "error",
        info: err?.error?.message,
        duration: 7000,
      },
    ]);
    return null;
  }
}
export default deleteProject;

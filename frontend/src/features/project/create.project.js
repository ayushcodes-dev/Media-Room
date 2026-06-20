import {createProjectAPI} from "@/api/project.js";
import getProjectStatus from "@/features/project/status.project.js";

async function createProject(
  { projectName },
  { setToasterData, setprojectStatus },
) {
  const data = await createProjectAPI({ projectName });

  if (!data.success) {
    setToasterData([
      {
        status: "error",
        info: data?.error?.message,
        duration: 7000,
      },
    ]);
  }

  if (data.success) {
    setToasterData([
      {
        status: "success",
        info: "successfully created project " + projectName,
        duration: 7000,
      },
    ]);
    getProjectStatus({
      setprojectStatus,
    });
    return data
  }
  return;
}
export default createProject;

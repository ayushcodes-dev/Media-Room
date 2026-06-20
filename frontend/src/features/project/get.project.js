import { getProjectByID_API } from "@/api/project.js"


async function getProjectByID({ projectID }, { setProject }) {
  const res = await getProjectByID_API({ projectID });
  console.log(res);
  if (res.success) {
    setProject((prev) => {
      return [...prev, res.data];
    });
    return res.data;
  }
  return null
}
export default getProjectByID;
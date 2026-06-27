import { useContext } from "react";
import projectStatusContext from "@/context/projectStatus.js";
import { useState, useEffect } from "react";
import Toaster1 from "@/component/toaster/toaster1.jsx";
import getProjectStatus from "@/features/project/status.project.js";

function App() {
  const { projectStatus, setprojectStatus } = useContext(projectStatusContext);
  const [toasterData, setToasterData] = useState([]);
  async function handleApp() {
    const res = await getProjectStatus({
      projectStatus,
      setprojectStatus,
      setToasterData,
    });

    if (res && res.length > 0) {
      setprojectStatus(() => [...res]);
      //const data = await getProjectByID({ projectID: res[0].projectID }, { setProject });
    }
  }
  useEffect(()=>{
    
    handleApp()
  },[])
  return <>
    <Toaster1 data={toasterData} /></>;
}
export default App;

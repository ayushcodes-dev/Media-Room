import { createContext } from "react";
// import { useState, useEffect } from "react";
// import { getProjects } from "@/api/project";
const ProjectContext = createContext();

export default ProjectContext;

// const ProjectProvider = ({ children }) => {
//     const [projectData, setProjectData] = useState({
//         projects: [],
//         total: 0,
//         page: 1,
//         limit: 10,
//     });
//   useEffect(() => {
//     const fetchProjects = async () => {
//       const response = await getProjects(0, 10);
//       setProjectData(response.data);
//     };
//     fetchProjects();
//   }, []);
//   return <ProjectContext.Provider value={{ projects, setProjects }}>{children}</ProjectContext.Provider>;
// };

// export { ProjectProvider, ProjectContext };
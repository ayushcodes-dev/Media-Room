import { useState } from "react";
import projectContext from "@/context/project.js";

export default function ProjectProvider({ children }) {
  const [projectData, setProjectData] = useState([]);

  return (
    <projectContext.Provider value={{ projectData, setProjectData }}>
      {children}
    </projectContext.Provider>
  );
}

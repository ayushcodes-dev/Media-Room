import { useState } from "react";
import projectContext from "@/context/project.js";

export default function ProjectProvider({ children }) {
  const [projectStatus, setProject] = useState([]);

  return (
    <projectContext.Provider value={{ projectStatus, setProject }}>
      {children}
    </projectContext.Provider>
  );
}

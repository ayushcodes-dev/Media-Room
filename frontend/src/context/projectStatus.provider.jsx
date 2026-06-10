import { useState } from "react";
import projectStatusContext from "@/context/projectStatus.js";

export default function ProjectStatusProvider({ children }) {
  const [projectStatus, setprojectStatus] = useState([]);

  return (
    <projectStatusContext.Provider value={{ projectStatus, setprojectStatus }}>
      {children}
    </projectStatusContext.Provider>
  );
}

import { useContext } from "react";
import projectContext from "@/context/project.js";

export function UseProject() {
  return useContext(projectContext);
}

import { useContext } from "react";
import projectStatusContext from "@/context/projectStatus.js";

export function UseProjectStatus() {

  return useContext(projectStatusContext);
}

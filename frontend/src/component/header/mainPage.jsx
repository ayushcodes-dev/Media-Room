import {
  Plus,
} from "lucide-react";

import { NeonButton2 } from "@/component/button/neonButton.jsx";
import { useNavigate } from "react-router-dom";
function MainPageHeader({ title, description }) {
   const navigate = useNavigate();

 
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/65 pb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          {title}
         
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {description} 
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <NeonButton2
          variant="secondary"
          icon={Plus}
          className="text-xs"
          onClick={() => {
            navigate("/projects?createProject=true");
          }}
        >
          Create Project
        </NeonButton2>
      </div>
    </header>
  );
}
export default MainPageHeader;

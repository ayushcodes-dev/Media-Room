import { CheckCircle2 } from "lucide-react";
const GrowthBullet = ({ text }) => (
  <li className="flex items-center gap-3 text-slate-300">
    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
      <CheckCircle2 size={14} />
    </div>
    {text}
  </li>
);
export default GrowthBullet;
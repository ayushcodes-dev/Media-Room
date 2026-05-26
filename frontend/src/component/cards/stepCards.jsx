
const StepCard = ({ number, title, desc, icon: Icon }) => (
  <div className="relative group text-center">
    <div className="mb-6 text-6xl font-black text-white/5 absolute -top-10 left-1/2 -translate-x-1/2 group-hover:text-cyan-500/10 transition-colors">
      {number}
    </div>
    <div className="relative z-10 space-y-4">
      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-cyan-500/50 transition-all">
        {Icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default StepCard;
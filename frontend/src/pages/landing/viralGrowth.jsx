import { BarChart3, Eye, MessageCircle, MousePointerClick, ThumbsUp, TrendingUp } from "lucide-react";
import StatItem from "@/pages/landing/statItem.jsx";
import GrowthBullet from "@/pages/landing/growthbullet.jsx";
const ViralGrowth = () => (
  <section className="py-24 px-6 relative z-10 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="absolute -inset-4 bg-cyan-500/20 rounded-[2rem] blur-3xl" />
          <div className="relative bg-[#0A101F]/90 border border-white/10 rounded-[2rem] p-6 sm:p-10 backdrop-blur-xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Growth Forecast
                </p>
                <h3 className="text-2xl font-bold text-white">Viral Pulse</h3>
              </div>
              <div className="text-right">
                <span className="text-cyan-400 text-sm font-bold flex items-center gap-1">
                  <TrendingUp size={16} /> +412% Growth
                </span>
              </div>
            </div>

            <div className="relative h-64 w-full bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden group">
              <svg
                className="absolute bottom-0 left-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 400 200"
              >
                <defs>
                  <linearGradient
                    id="graphGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,180 Q50,170 80,140 T150,110 T220,80 T300,40 T400,10 V200 H0 Z"
                  fill="url(#graphGradient)"
                  className="animate-pulse"
                />
                <path
                  d="M0,180 Q50,170 80,140 T150,110 T220,80 T300,40 T400,10"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="[stroke-dasharray:1000] [stroke-dashoffset:1000] animate-draw"
                />
              </svg>
              <div className="absolute top-10 right-10 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-bold animate-bounce text-white">
                Peak Reach 🚀
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <StatItem
                icon={<Eye size={14} />}
                label="Views"
                value="1.2M"
                color="text-cyan-400"
              />
              <StatItem
                icon={<MousePointerClick size={14} />}
                label="CTR"
                value="14.8%"
                color="text-blue-400"
              />
              <StatItem
                icon={<ThumbsUp size={14} />}
                label="Likes"
                value="85K"
                color="text-sky-400"
              />
              <StatItem
                icon={<MessageCircle size={14} />}
                label="Comments"
                value="12K"
                color="text-indigo-400"
              />
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
            <BarChart3 size={14} /> ALGORITHM OPTIMIZED
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Watch Your Channel <br />
            <span className="text-cyan-400">Scale Automatically</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Tubex doesn't just suggest words; it engineers engagement. Our
            viral-pulse technology optimizes for high CTR and average view
            duration simultaneously.
          </p>
          <ul className="space-y-4 pt-4">
            <GrowthBullet text="Explosive CTR increase in the first 24 hours" />
            <GrowthBullet text="Dominant SEO ranking for competitive tags" />
            <GrowthBullet text="Higher viewer retention through perfect hooks" />
          </ul>
        </div>
      </div>
    </div>
  </section>
);
export default ViralGrowth;
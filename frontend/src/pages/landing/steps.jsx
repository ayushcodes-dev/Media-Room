import { CheckCircle2, Layout, Zap } from "lucide-react";
import StepCard from "@/component/cards/stepCards.jsx";
import SectionHeader from "@/component/header/sectionheader.jsx";
const Steps = () => (
  <section
    id="how-it-works"
    className="py-24 px-6 bg-white/[0.02] border-y border-white/5 relative z-10"
  >
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="3 Simple Steps to Viral Success" />
      <div className="grid md:grid-cols-3 gap-12">
        <StepCard
          number="01"
          title="Enter Video Idea"
          desc="Just type your topic or raw script concept into the AI engine."
          icon={<Layout className="text-cyan-400" />}
        />
        <StepCard
          number="02"
          title="AI Analysis"
          desc="Our neural network scans 50,000+ trending patterns in real-time."
          icon={<Zap className="text-sky-400" />}
        />
        <StepCard
          number="03"
          title="Deploy Viral Content"
          desc="Get optimized titles, tags, and ideas ready in < 30s."
          icon={<CheckCircle2 className="text-cyan-400" />}
        />
      </div>
    </div>
  </section>
);
export default Steps;
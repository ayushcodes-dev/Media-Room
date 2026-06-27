import { Sparkles, ArrowRight } from "lucide-react";
import Button from "@/component/button/button1.jsx";

const Hero = () => (
  <section className="relative pt-32 pb-20 px-6 z-10 text-center max-w-7xl mx-auto">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-8">
      <Sparkles size={14} /> The Future of Content Creation
    </div>

    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white">
      Get More YouTube Views <br />
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
        Without Guessing
      </span>
    </h1>

    <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light px-4">
      Stop wasting time on bad titles, weak thumbnails, and low SEO. Our AI
      gives you everything needed to make your video go viral.
    </p>

    <div className="flex justify-center px-6">
      <Button variant="primary" icon={ArrowRight} onClick={()=>{
        window.location.href="/dashboard"
      }}>
        👉 Start Growing Now
      </Button>
    </div>
  </section>
);
export default Hero
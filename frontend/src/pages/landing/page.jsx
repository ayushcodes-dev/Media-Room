import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Search,
  Image as ImageIcon,
  ArrowRight,
  
  AlertCircle,
 
  BarChart3,
 
  Target,
 
} from "lucide-react";
import Button from "@/component/button/button1.jsx";
import { YouTubeLogo } from "@/component/icon/youtube";
import Navbar from "@/component/navbar/navbar1.jsx";
import Hero from "@/pages/landing/hero.jsx";
import Steps from "@/pages/landing/steps.jsx";
import ViralGrowth from "@/pages/landing/viralGrowth.jsx";
import FeatureCard from "@/component/cards/featureCard";
import {useAuth} from "@/hooks/useAuth"
import {  useNavigate } from "react-router-dom";
const SectionHeader = ({ title, subtitle, badge, centered = true }) => (
  <div className={`mb-16 ${centered ? "text-center" : "text-left"}`}>
    {badge && (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-6">
        <Sparkles size={14} />
        {badge}
      </div>
    )}
    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

/**
 * MAIN APP CONTAINER
 */
const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {user} = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    console.log(user)
    if (user.isAuthenticated) {
      return navigate("/dashboard");
    }
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user.isAuthenticated]);
  console.log(user)

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
          @keyframes draw { to { stroke-dashoffset: 0; } }
          .animate-draw { animation: draw 2.5s ease-out forwards; }
        `}
      </style>

      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <Navbar
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main className="relative z-10">
        <Hero />

        {/* Problem Section */}
        <section id="problem" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Why most creators <span className="text-red-500">fail</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Packaging is the invisible wall between you and your audience.
              </p>
              <div className="space-y-4">
                <ProblemItem text="Spend hours overthinking titles" />
                <ProblemItem text="Random, non-clickable thumbnails" />
                <ProblemItem text="Videos never reach the right audience" />
                <ProblemItem text="SEO ignored completely" />
              </div>
            </div>
            <SolutionPreview />
          </div>
        </section>

        <Steps />
        <ViralGrowth />

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
          <SectionHeader
            title="Everything You Need To Win"
            subtitle="Stop creating videos blindly. Start creating videos that are designed to win."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Sparkles className="text-cyan-400" />}
              title="Viral Title Generator"
              desc="CTR-optimized hooks that stop the scroll and force a click."
            />
            <FeatureCard
              icon={<Search className="text-sky-400" />}
              title="SEO Tag Generator"
              desc="Ranking-focused metadata to push your content into the 'Up Next' feed."
            />
            <FeatureCard
              icon={<ImageIcon className="text-blue-400" />}
              title="Thumbnail Idea Engine"
              desc="Visual concepts based on click psychology and high-contrast trends."
            />
            <FeatureCard
              icon={<Target className="text-cyan-400" />}
              title="Strategy Suggestions"
              desc="Personalized advice on pacing, hooks, and community engagement."
            />
            <FeatureCard
              icon={<TrendingUp className="text-sky-400" />}
              title="Trend Pulse"
              desc="AI suggestions based on what's currently exploding in your niche."
            />
            <FeatureCard
              icon={<BarChart3 className="text-blue-400" />}
              title="Performance Predictor"
              desc="Estimate your views and CTR before you even finish the video."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white">
            Ready to grow your channel?
          </h2>
          <Button
            variant="white"
            icon={ArrowRight}
            className="px-12 py-5 mx-auto"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            GET EARLY ACCESS NOW
          </Button>
          <p className="text-slate-500 text-sm font-medium">
            Join 5,000+ creators beating the algorithm.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/**
 * SECTION-SPECIFIC MINI COMPONENTS
 */
const ProblemItem = ({ text }) => (
  <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-slate-300">
    <AlertCircle className="text-red-500 shrink-0" size={20} />
    <span>{text}</span>
  </div>
);

const SolutionPreview = () => (
  <div className="relative group">
    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2rem] blur-xl opacity-20" />
    <div className="relative bg-[#0A101F] border border-white/10 rounded-[2rem] p-8 space-y-6">
      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-sky-400">
        The Solution
      </h3>
      <div className="space-y-3">
        {[
          "Viral Title Ideas",
          "SEO Tags that rank",
          "Thumbnail Click-Psychology",
          "Content optimization tips",
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl text-slate-200"
          >
            <Sparkles size={18} className="text-cyan-400" />
            <span className="font-semibold">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="py-12 border-t border-white/5 bg-[#010309] relative z-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-md flex items-center justify-center">
          <YouTubeLogo className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tighter text-white">
          TUBENIX
        </span>
      </div>
      <div className="flex gap-8 text-sm text-slate-500">
        <a href="#" className="hover:text-white transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Contact
        </a>
      </div>
      <p className="text-xs text-slate-600">
        © 2024 Tubex AI. Designed to win.
      </p>
    </div>
  </footer>
);

export default App;

import { Menu, X } from "lucide-react";
import Button from "@/component/button/button1.jsx";
import { useNavigate } from "react-router-dom";
import AppTextLogo from "@/component/logo/app.logo";
const Navbar = ({ scrolled, isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? "bg-[#020617]/80 backdrop-blur-md border-slate-800" : "bg-transparent border-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <img src="/appLogo.png" />
          </div>
          <AppTextLogo fontSize="text-3xl" />
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a
            href="#problem"
            className="text-slate-400 hover:text-cyan-400 text-sm font-medium"
          >
            The Problem
          </a>
          <a
            href="#features"
            className="text-slate-400 hover:text-cyan-400 text-sm font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-slate-400 hover:text-cyan-400 text-sm font-medium"
          >
            How it works
          </a>
          <Button
            variant="primary"
            className="px-5 py-2 h-auto text-sm"
            onClick={() => {
              navigate("/auth/signin");
            }}
          >
            Sign In
          </Button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#020617] border-b border-slate-800 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <a href="#problem" onClick={() => setIsMenuOpen(false)}>
            The Problem
          </a>
          <a href="#features" onClick={() => setIsMenuOpen(false)}>
            Features
          </a>
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
            How it works
          </a>

          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              className="px-5 py-2 h-auto text-sm"
              onClick={() => {
                navigate("/auth/signin");
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;

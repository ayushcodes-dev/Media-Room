import { useEffect } from "react";
import {
  Settings,
  LayoutDashboard,
  FolderLock,
  BarChart3,
  CreditCard,
  User,
 
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderLock },
  { id: "usages", label: "Usages", icon: BarChart3 },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "profile", label: "Profile", icon: User },
  { id: "setting", label: "Setting", icon: Settings },
];
export default function Navbar2({activeTab, setActiveTab, isSidebarOpen, setSidebarOpen}) {
   const navigate = useNavigate();
   const location = useLocation();
   useEffect(() => {
     NAV_ITEMS.find((item) => {
       if (location.pathname.split("/")[1] === item.id) {
         setActiveTab(item.id);
       
       }
     });
   }, [location.pathname, activeTab]);
    return (
      <>
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed h-full left-0 z-40 w-62 bg-[#030712]/95 backdrop-blur-3xl border-r border-white/5 transform transition-transform duration-300 pb-10 lg:pb-0 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full overflow-scroll no-scrollbar"}`}
        >
          <div className="h-full flex flex-col p-5 bg-slate-950 border-r border-slate-900/50 backdrop-blur-xl selection:bg-sky-500/30 overflow-scroll no-scrollbar">
            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 relative">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                      navigate(`/${item.id}`);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold relative group transition-all duration-300 ease-out outline-none active:scale-[0.97]
              ${
                isActive
                  ? "text-sky-400 bg-sky-500/[0.06] shadow-[inset_0_1px_1px_rgba(56,189,248,0.1)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03] hover:translate-x-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
              }`}
                  >
                    {/* Left Edge Indicator Accent Line */}
                    <span
                      className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-300 ease-out
                ${
                  isActive
                    ? "scale-y-100 opacity-100 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                    : "scale-y-0 opacity-0 bg-slate-600 group-hover:scale-y-70 group-hover:opacity-100"
                }`}
                    />

                    {/* Icon Container with Micro-movement */}
                    <div className="relative flex items-center justify-center">
                      <item.icon
                        size={19}
                        className={`transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                      : "text-slate-400 group-hover:text-white group-hover:scale-110 group-hover:-translate-y-[1px]"
                  }`}
                      />
                    </div>

                    {/* Button Label Text */}
                    <span className="font-medium tracking-wide transition-colors duration-200">
                      {item.label}
                    </span>

                    {/* Shimmer overlay effect on active tab */}
                    {isActive && (
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none rounded-xl" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer Profile Section */}
            <div className="pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-all duration-300 cursor-pointer group/profile">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-[1px] overflow-hidden shadow-md group-hover/profile:from-sky-400 group-hover/profile:to-blue-600 group-hover/profile:scale-105 transition-all duration-300">
                  <div className="w-full h-full bg-slate-950 rounded-[11px] overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-300 group-hover/profile:text-sky-400 transition-colors duration-300 truncate">
                    Alex Rivera
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Pro Creator
                  </p>
                </div>
                <Settings
                  size={18}
                  className="text-slate-500 group-hover/profile:text-slate-300 group-hover/profile:rotate-90 transition-all duration-500 ease-out"
                />
              </div>
            </div>
          </div>
        </aside>
      </>
    );
}

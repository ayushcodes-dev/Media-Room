import Header3 from "@/component/header/header3";
import Navbar2 from "@/component/navbar/navbar2";
import { useState } from "react";

function MainPage({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
console.log("MainPage rendered with activeTab:", activeTab, "and isSidebarOpen:", isSidebarOpen);
  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col overflow-hidden no-scrollbar">
      {/* 1. Global Header */}
      <div className="relative ">
        <Header3
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* 2. Main Layout Container */}
      <div className="lg:flex h-screen pt-15">
        {/* 
          3. Responsive Navigation 
          On small screens: hidden by default, pops out when isSidebarOpen is true.
          On large screens (md and up): permanently visible as a left sidebar.
        */}

        <Navbar2
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* 4. Main Content Area */}
        <main className="flex-1 h-screen min-w-0 relative  overflow-auto no-scrollbar ">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainPage;
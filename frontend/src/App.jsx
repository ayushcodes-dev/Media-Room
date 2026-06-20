import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/landing/page.jsx";
import Auth from "./pages/auth/page.jsx";
import Dashboard from "./pages/mainPage/dashboard/page.jsx";
import ProjectsHome from "./pages/mainPage/projects/page.jsx";
import ProjectDataPage from "./pages/subpages/project/projectID/page.jsx";
import OAuth from "./pages/auth/OAuth.jsx";
import {useEffect} from "react"
import syncUserAuth from "@/features/auth/syncUser.auth.js";
function App() {
  const location = useLocation();
useEffect(()=>{
  syncUserAuth()
},[location.pathname])
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/:action" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsHome />} />
        <Route path="/projects/:projectID" element={<ProjectDataPage />} />
        <Route path="/oAuth/callback/:provider" element={<OAuth />} />
      </Routes>
    </>
  );
}

export default App;

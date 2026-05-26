import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/page.jsx";
import Auth from "./pages/auth/index.jsx";
import Dashboard from "./pages/dashboard/page.jsx";
import OAuth from "./pages/auth/OAuth.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/:action" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/oAuth/callback/:provider" element={<OAuth />} />
      </Routes>
    </>
  );
}

export default App;

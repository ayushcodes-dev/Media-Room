//import { useAuth } from "@/hooks/useAuth.jsx";
import { Navigate } from "react-router-dom";

function Protect({ children }) {
  let isAuthenticated = false;
  const raw_userdata = localStorage.getItem("user_auth");

  if (!raw_userdata) {
    isAuthenticated = false;
  } else {
    try {
      const userdata = JSON.parse(raw_userdata);
      if (userdata.isAuthenticated) isAuthenticated = true;
    } catch (err) {
      console.error(err);
      isAuthenticated = false;
    }
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  } else {
    return children;
  }
}
export default Protect;

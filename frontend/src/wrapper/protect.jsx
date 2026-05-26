import { useAuth } from "@/hooks/useAuth.jsx";
import { Navigate } from "react-router-dom";
function Protect({ children }) {

    const { user } = useAuth();
    console.log(user)
    if (!user.isAuthenticated) {
        return <Navigate to="/auth/signin" replace />;
    }
    return children;
}
export default Protect;

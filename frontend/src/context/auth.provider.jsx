import { useState } from "react";
import AuthContext from "@/context/auth";


export default function AuthProvider({ children }) {
  const [user, setUser] = useState({
    userID: null,
    username: null,
    email: null,
    password: null,
    isAuthenticated: false,
    role:null,

  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

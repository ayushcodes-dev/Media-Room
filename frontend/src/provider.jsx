import { AuthProvider} from "@/context/auth";

export default function Provider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

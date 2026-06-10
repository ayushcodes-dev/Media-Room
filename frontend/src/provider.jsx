import AuthProvider from "@/context/auth.provider.jsx";
import ProjectStatusProvider from "@/context/projectStatus.provider.jsx";
import ProjectProvider from "@/context/project.provider.jsx";
export default function Provider({ children }) {
  return (
    <AuthProvider>
      <ProjectStatusProvider>
        <ProjectProvider>{children}</ProjectProvider>
      </ProjectStatusProvider>
    </AuthProvider>
  );
}

// src/App.tsx
import { useEffect, useState } from "react";
import { initKeycloak } from "./auth/initKeycloak";
import LoginPage from "./components/LoginPage";
import TreeUploadPage from "./components/TreeUploadPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    initKeycloak()
      .then(auth => setIsAuthenticated(auth))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <LoginPage />;
  return <TreeUploadPage />;
}

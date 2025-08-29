// src/App.tsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import TreeUploadPage from "./components/TreeUploadPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const storedTokens =
      localStorage.getItem("tokens") || sessionStorage.getItem("tokens");

    if (storedTokens) {
      try {
        const { access_token, expires_in } = JSON.parse(storedTokens);
        const tokenValid = access_token && expires_in > 0;
        setIsAuthenticated(tokenValid);
      } catch (err) {
        console.error("Invalid stored tokens", err);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/upload" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route
        path="/upload"
        element={
          isAuthenticated ? <TreeUploadPage /> : <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

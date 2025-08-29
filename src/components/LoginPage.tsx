// src/components/LoginPage.tsx
import { useState } from "react";
import { loginWithPassword } from "../auth/keycloakService";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const tokens = await loginWithPassword(username, password);
      console.log("Tokens:", tokens);

      if (rememberMe) {
        localStorage.setItem("tokens", JSON.stringify(tokens));
      } else {
        sessionStorage.setItem("tokens", JSON.stringify(tokens));
      }

      // Redirect to TreeUploadPage after login
      window.location.href = "/upload";
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/forest.jpg')" }}
    >
      <div className="bg-black bg-opacity-80 p-8 rounded-2xl shadow-lg text-center w-96">
        <h1 className="mb-6 text-2xl font-bold text-white">
          Greenstand TreeTracker
        </h1>

        {/* Email & Password Inputs */}
        <div className="mb-6 flex flex-col gap-4">
          <InputText
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3"
          />
          <InputText
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3"
          />
        </div>

        {/* Remember me and forgot password */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label 
              htmlFor="rememberMe" 
              className="ml-2 text-white text-sm cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>
          <a href="#" className="text-blue-400 text-sm hover:underline">
            Forgot password?
          </a>
        </div>

        {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}

        <Button 
          label="Login" 
          onClick={handleLogin} 
          className="w-full mb-4 p-3" 
        />

        <div className="text-white text-sm">
          New user?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:underline"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { registerUserBackend, loginWithPassword } from "../auth/keycloakService";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useNavigate, Link } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null);

    if (!email || !password || !firstName || !lastName) {
      setError("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Create the user directly in Keycloak
      await registerUserBackend(email, password, firstName, lastName);

      // Try login with the new credentials
      const tokens = await loginWithPassword(email, password);

      localStorage.setItem("tokens", JSON.stringify(tokens));
      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => navigate("/upload"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/forest.jpg')" }}
    >
      <div className="bg-black bg-opacity-80 p-8 rounded-2xl shadow-lg text-center w-96">
        <h1 className="mb-6 text-2xl font-bold text-white">Create Your Account</h1>

        <div className="mb-6 flex flex-col gap-4">
          <InputText
            placeholder="First Name *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            className="w-full p-3"
          />
          <InputText
            placeholder="Last Name *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            className="w-full p-3"
          />
          <InputText
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full p-3"
          />
          <InputText
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full p-3"
          />
          <InputText
            type="password"
            placeholder="Confirm Password *"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="w-full p-3"
            onKeyPress={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        {error && (
          <Message
            severity="error"
            text={error}
            className="w-full mb-3 justify-start"
          />
        )}
        {success && (
          <Message
            severity="success"
            text="Registration successful! Redirecting..."
            className="w-full mb-3 justify-start"
          />
        )}

        {loading ? (
          <div className="card flex justify-content-center mb-4">
            <ProgressSpinner
              style={{ width: "40px", height: "40px" }}
              strokeWidth="4"
              animationDuration=".5s"
            />
          </div>
        ) : (
          <Button
            label="Register"
            onClick={handleRegister}
            className="w-full mb-4 p-3 text-white bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          />
        )}

        <div className="text-white text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

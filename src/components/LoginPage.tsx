// src/components/LoginPage.tsx
import keycloak from "../auth/keycloak";
import { Button } from "primereact/button";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="mb-5 text-2xl font-bold">Login Into TreeTracker</h1>
        <Button
          label="Login"
          onClick={() =>
            keycloak.login({
              redirectUri: window.location.origin,
            })
          }
          className="p-button p-button-primary"
        />
      </div>
    </div>
  );
}

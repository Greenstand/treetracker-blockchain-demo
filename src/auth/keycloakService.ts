// src/auth/keycloakService.ts
const KEYCLOAK_URL = "http://localhost:8080";
const REALM = "master";

const ADMIN_USERNAME = "admin"; // your Keycloak admin
const ADMIN_PASSWORD = "admin"; // your Keycloak admin password

// Get admin token directly from frontend
export async function getAdminToken() {
  const resp = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: "admin-cli",
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    }),
  });
  const data = await resp.json();
  return data.access_token;
}

// Create a user in Keycloak
export async function registerUserBackend(email: string, password: string, firstName: string, lastName: string) {
  const token = await getAdminToken();
  const resp = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username: email,
      email,
      firstName,
      lastName,
      enabled: true,
      credentials: [{ type: "password", value: password, temporary: false }],
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error("Keycloak registration failed: " + text);
  }
}

// Normal login for frontend
export async function loginWithPassword(username: string, password: string) {
  const resp = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: "react-auth", // your frontend client
      username,
      password,
    }),
  });
  return resp.json();
}

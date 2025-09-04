// src/auth/keycloakService.ts
const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL as string;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM as string;
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID as string;

export async function registerUserFrontend(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const resp = await fetch("http://localhost:4000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || "Registration failed");
  return data;
}

export async function loginWithPassword(username: string, password: string) {
  const tokenUrl = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: KEYCLOAK_CLIENT_ID,
      username,
      password,
    }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error_description || "Login failed");
  return data;
}

import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Load environment variables
const KEYCLOAK_URL = process.env.KEYCLOAK_URL;
const REALM = process.env.REALM;
const ADMIN_CLIENT_ID = process.env.ADMIN_CLIENT_ID;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Helper: get admin token
async function getAdminToken() {
  const params = new URLSearchParams();
  params.append("client_id", ADMIN_CLIENT_ID);
  params.append("username", ADMIN_USERNAME);
  params.append("password", ADMIN_PASSWORD);
  params.append("grant_type", "password");

  const resp = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });

  if (!resp.ok) throw new Error("Failed to get admin token");
  return resp.json();
}

// Registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    const { access_token } = await getAdminToken();

    const resp = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
      body: JSON.stringify({
        username,
        email,
        firstName,
        lastName,
        enabled: true,
        emailVerified: true, // skip email verification
        credentials: [
          {
            type: "password",
            value: password,
            temporary: false
          }
        ]
      })
    });

    if (!resp.ok) {
      const error = await resp.text();
      return res.status(500).json({ errorMessage: error });
    }

    return res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ errorMessage: err.message });
  }
});

// Start server
app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});

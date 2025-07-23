// src/auth/initKeycloak.ts
import keycloak from './keycloak';

let initPromise: Promise<boolean> | null = null;

export function initKeycloak() {
  if (!initPromise) {
    initPromise = keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false, // reduce complexity during dev
      })
      .then((authenticated) => {
        console.log("Keycloak authenticated:", authenticated);
        return authenticated;
      })
      .catch((err) => {
        console.error("Keycloak init failed:", err);
        return false;
      });
  }
  return initPromise;
}

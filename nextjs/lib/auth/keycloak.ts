import Keycloak from "keycloak-js";

export type KeycloakPublicConfig = {
  url: string;
  realm: string;
  clientId: string;
};

function readKeycloakConfig(): KeycloakPublicConfig | null {
  const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL?.trim();
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM?.trim();
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID?.trim();

  if (!url || !realm || !clientId) {
    return null;
  }

  return {
    url: url.replace(/\/+$/, ""),
    realm,
    clientId
  };
}

export const keycloakConfig = readKeycloakConfig();

let keycloakInstance: Keycloak | null = null;
let initializationPromise: Promise<boolean> | null = null;

export function isKeycloakConfigured(): boolean {
  return keycloakConfig !== null;
}

export function getKeycloak(): Keycloak {
  if (typeof window === "undefined") {
    throw new Error("Keycloak can only be initialized in the browser.");
  }

  if (!keycloakConfig) {
    throw new Error(
      "Keycloak configuration is missing. Set NEXT_PUBLIC_KEYCLOAK_URL, NEXT_PUBLIC_KEYCLOAK_REALM, and NEXT_PUBLIC_KEYCLOAK_CLIENT_ID."
    );
  }

  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig);
  }

  return keycloakInstance;
}

export function initializeKeycloak(): Promise<boolean> {
  if (!initializationPromise) {
    initializationPromise = getKeycloak()
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false
      })
      .catch((error: unknown) => {
        initializationPromise = null;
        throw error;
      });
  }

  return initializationPromise;
}
"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { ReactNode } from "react";

import {
    getKeycloak,
    initializeKeycloak,
    isKeycloakConfigured,
    keycloakConfig,
} from "../lib/auth/keycloak";

type AuthStatus =
    | "loading"
    | "authenticated"
    | "unauthenticated"
    | "configuration-error"
    | "error";

type TokenData = {
    preferred_username: string;
    name?: string;
    email: string;
    realm_access?: {
        roles?: string[];
    };
    resource_access?: Record<
    string,
    {
        roles?: string[];
    }
    >;
};

export type AuthUser = {
  username?: string;
  name?: string;
  email?: string;
  roles: string[];
};

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


function readAuthenticatedUser(): AuthUser | null {
  const token = getKeycloak().tokenParsed as TokenData | undefined;

  if (!token) {
    return null;
  }

  const realmRoles = token.realm_access?.roles ?? [];
  const clientRoles = keycloakConfig
    ? token.resource_access?.[keycloakConfig.clientId]?.roles ?? []
    : [];

  return {
    username: token.preferred_username,
    name: token.name,
    email: token.email,
    roles: Array.from(new Set([...realmRoles, ...clientRoles])).sort()
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "An unexpected Keycloak authentication error occurred.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!isKeycloakConfigured()) {
      setStatus("configuration-error");
      setError(
        "Keycloak configuration is missing. Add the required NEXT_PUBLIC_KEYCLOAK_* values during the build."
      );
      return;
    }

    const keycloak = getKeycloak();

    keycloak.onTokenExpired = () => {
      void keycloak.updateToken(30).catch(() => {
        if (active) {
          setUser(null);
          setStatus("unauthenticated");
        }
      });
    };

    void initializeKeycloak()
      .then((authenticated) => {
        if (!active) {
          return;
        }

        if (authenticated) {
          setUser(readAuthenticatedUser());
          setStatus("authenticated");
          setError(null);
        } else {
          setUser(null);
          setStatus("unauthenticated");
          setError(null);
        }
      })
      .catch((initializationError: unknown) => {
        if (active) {
          setStatus("error");
          setError(getErrorMessage(initializationError));
        }
      });

    return () => {
      active = false;
      keycloak.onTokenExpired = undefined;
    };
  }, []);

  const login = useCallback(async () => {
    if (!isKeycloakConfigured()) {
      setStatus("configuration-error");
      setError("Keycloak configuration is missing.");
      return;
    }

    try {
      await getKeycloak().login({
        redirectUri: window.location.href
      });
    } catch (loginError: unknown) {
      setStatus("error");
      setError(getErrorMessage(loginError));
    }
  }, []);

  const logout = useCallback(async () => {
    if (!isKeycloakConfigured()) {
      return;
    }

    try {
      await getKeycloak().logout({
        redirectUri: `${window.location.origin}/`
      });
    } catch (logoutError: unknown) {
      setStatus("error");
      setError(getErrorMessage(logoutError));
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      login,
      logout,
      hasRole: (role: string) => user?.roles.includes(role) ?? false,
      hasAnyRole: (roles: string[]) =>
        roles.some((role) => user?.roles.includes(role) ?? false)
    }),
    [error, login, logout, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
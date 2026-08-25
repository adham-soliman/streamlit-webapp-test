import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

type KeycloakProfile = {
  realm_access?: {
    roles?: string[];
  };
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      const keycloakProfile = profile as KeycloakProfile | undefined;

      if (keycloakProfile?.realm_access?.roles) {
        token.roles = keycloakProfile.realm_access.roles;
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        roles: token.roles ?? [],
      };
    },
  },
});
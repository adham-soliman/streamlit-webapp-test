import { NextResponse } from "next/server";

export function GET() {
  const issuer = process.env.AUTH_KEYCLOAK_ISSUER;
  const clientId = process.env.AUTH_KEYCLOAK_ID;
  const postLogoutRedirectUri = "http://localhost:3000";

  if (!issuer || !clientId) {
    return new NextResponse("Keycloak configuration is missing.", {
      status: 500,
    });
  }

  const logoutUrl = new URL(
    `${issuer}/protocol/openid-connect/logout`
  );

  logoutUrl.searchParams.set("client_id", clientId);
  logoutUrl.searchParams.set(
    "post_logout_redirect_uri",
    postLogoutRedirectUri
  );

  return NextResponse.redirect(logoutUrl);
}
import { auth } from "./auth";

export default auth((request) => {
  const isLoggedIn = Boolean(request.auth);
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardPage && !isLoggedIn) {
    const loginUrl = new URL("/", request.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
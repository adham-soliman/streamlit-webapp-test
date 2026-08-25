import { auth, signIn } from "../auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    return (
      <main>
        <h1>FH Platform Demo</h1>
        <p>You are signed in as {session.user?.email ?? "an authenticated user"}.</p>
        <Link href="/dashboard">Open dashboard</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>FH Platform Demo</h1>
      <p>Sign in with your Keycloak account to access the platform.</p>

      <form
        action={async () => {
          "use server";
          await signIn("keycloak", { redirectTo: "/dashboard" });
        }}
      >
        <button type="submit">Sign in with Keycloak</button>
      </form>
    </main>
  );
}
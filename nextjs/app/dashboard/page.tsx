import { auth, signOut } from "../../auth";
import { redirect } from "next/navigation";

type SessionWithRoles = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  roles?: string[];
};

function hasAnyRole(roles: string[], ...requiredRoles: string[]) {
  return requiredRoles.some((role) => roles.includes(role));
}

export default async function DashboardPage() {
  const session = (await auth()) as SessionWithRoles | null;

  if (!session) {
    redirect("/");
  }

  const roles = session.roles ?? [];

  return (
    <main>
      <h1>FH Platform – Access Rights Demo</h1>

      <p>
        Signed in as: <strong>{session.user?.email ?? session.user?.name}</strong>
      </p>

      <p>
        Assigned roles: <strong>{roles.length ? roles.join(", ") : "No roles found"}</strong>
      </p>

      <hr />

      <section>
        <h2>Authenticated area</h2>
        <p>You successfully authenticated through Keycloak.</p>
      </section>

      {hasAnyRole(roles, "engineer", "reviewer", "admin") && (
        <section>
          <h2>Engineer area</h2>
          <p>Submit ideas and view validation results.</p>
        </section>
      )}

      {hasAnyRole(roles, "reviewer", "admin") && (
        <section>
          <h2>Reviewer area</h2>
          <p>Review, approve, reject, and provide feedback on submissions.</p>
        </section>
      )}

      {hasAnyRole(roles, "ml_operator", "admin") && (
        <section>
          <h2>ML/HPC operator area</h2>
          <p>Monitor and manage ML validation jobs.</p>
        </section>
      )}

      {hasAnyRole(roles, "client", "admin") && (
        <section>
          <h2>Client area</h2>
          <p>View approved outputs intended for clients.</p>
        </section>
      )}

      {hasAnyRole(roles, "admin") && (
        <section>
          <h2>Administration area</h2>
          <p>Manage platform settings, users, and access policies.</p>
        </section>
      )}

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
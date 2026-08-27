"use client";

import { useState } from "react";
import { signOutAndLogoutFromKeycloak } from "./actions";

export function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    const logoutUrl = await signOutAndLogoutFromKeycloak();

    window.location.assign(logoutUrl);
  }

  return (
    <button type="button" onClick={handleSignOut} disabled={isSigningOut}>
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
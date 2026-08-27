"use server";

import { signOut } from "../../auth";

export async function signOutAndLogoutFromKeycloak() {
  await signOut({ redirect: false });

  return "/api/keycloak-logout";
}
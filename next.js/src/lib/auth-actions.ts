"use server";

import { signIn, signOut } from "@/lib/auth";

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function requestLoginLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  await signIn("resend", { email, redirectTo: "/projects" });
}


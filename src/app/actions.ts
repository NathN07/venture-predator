"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function setRole(formData: FormData) {
  const role = formData.get("role");
  const firm = String(formData.get("firm") ?? "").trim().slice(0, 80);
  if (role !== "founder" && role !== "investor") redirect("/onboarding");

  const { supabase, user } = await requireUser();
  await supabase
    .from("profiles")
    .update({ role, firm: role === "investor" ? firm || null : null })
    .eq("id", user.id);

  redirect(`/${role}`);
}

import type { Metadata } from "next";
import { NewPitchForm } from "@/components/NewPitchForm";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "New pitch" };

export default async function NewPitchPage() {
  const { profile, user } = await requireRole("founder");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight">New pitch</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        Tell us about the startup. Traction figures are self-reported and are shown to
        investors next to your transcript, so keep them honest.
      </p>
      <NewPitchForm
        defaultName={profile.full_name ?? ""}
        defaultEmail={profile.email ?? user.email ?? ""}
      />
    </div>
  );
}

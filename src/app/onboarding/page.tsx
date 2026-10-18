import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { RoleForm } from "@/components/RoleForm";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Choose your role" };

export default async function OnboardingPage() {
  const { profile, user } = await requireUser();
  const name = profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0];

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-14">
      <Logo />
      <div className="mt-16 w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Welcome{name ? `, ${name}` : ""}.
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          How will you use Venture Predator? You can switch later from the menu.
        </p>
        <RoleForm current={profile?.role ?? null} />
      </div>
    </main>
  );
}
